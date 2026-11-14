import { db } from "@/lib/prisma";
import { scoreProspect, canMove } from "@/lib/domain";
import { canApproveQuote, totalQuotePaise } from "@/lib/quotation";
import { actionInput, apiError } from "@/lib/validation";
import { fullProspect } from "@/lib/serialize";
import { Prisma } from "@prisma/client";
export const runtime = "nodejs";
const paise = (rupees: number) => Math.round(rupees * 100);
function notAllowed(msg: string): never { throw new Error(msg); }

export async function POST(req: Request) {
  try {
    const data = actionInput.parse(await req.json());
    switch (data.action) {
      case "add_prospect": {
        let proof: { sourceUrl: string; finalUrl: string | null } | null = null;
        if (data.researchRunId) {
          const r = await db.researchRun.findFirst({ where: { id: data.researchRunId, status: "COMPLETED" } });
          if (!r) notAllowed("RESEARCH_PROOF_NOT_FOUND");
          proof = { sourceUrl: r.sourceUrl, finalUrl: r.finalUrl };
          if (new URL(data.businessSourceUrl).hostname !== new URL(proof.finalUrl || proof.sourceUrl).hostname) notAllowed("RESEARCH_SOURCE_MISMATCH");
        }
        const prospect = await db.prospect.create({ data: {
          name: data.name, city: data.city, category: data.category, businessSourceUrl: data.businessSourceUrl,
          businessWebsiteUrl: data.businessSourceUrl, evidenceSummary: data.evidenceSummary,
          independentSource: !!proof, verifiedBusinessAt: proof ? new Date() : null,
          activities: { create: { event: "LEAD_CREATED", note: proof ? `Owner registered lead from browser run ${data.researchRunId}` : "Owner-entered lead; independent browser verification outstanding", evidenceUrl: data.businessSourceUrl } }
        } });
        return Response.json({ id: prospect.id }, { status: 201 });
      }
      case "add_product": {
        const product = await db.product.create({ data: { splcartProductId: data.splcartProductId, title: data.title,
          category: data.category, material: data.material, unitDescription: data.unitDescription,
          pricePaise: paise(data.priceRupees), productUrl: data.productUrl, ownerVerifiedAt: new Date(), verificationSource: "OWNER_ATTESTED" } });
        return Response.json({ id: product.id }, { status: 201 });
      }
      case "add_match": {
        const [prospect, product] = await Promise.all([
          db.prospect.findUnique({ where: { id: data.prospectId } }), db.product.findUnique({ where: { id: data.productId } }),
        ]);
        if (!prospect || !product) notAllowed("NOT_FOUND");
        const match = await db.productMatch.upsert({ where: { prospectId_productId: { prospectId: data.prospectId, productId: data.productId } },
          create: { prospectId: data.prospectId, productId: data.productId,
            competitorMaterial: data.competitorMaterial ?? null, competitorUnitDescription: data.competitorUnitDescription ?? null,
            competitorPricePaise: data.competitorPriceRupees === undefined ? null : paise(data.competitorPriceRupees), competitorEvidenceUrl: data.competitorEvidenceUrl ?? null,
            competitorPriceCheckedAt: new Date(), equivalentMaterials: data.equivalentMaterials, equivalentUnits: data.equivalentUnits },
          update: { competitorMaterial: data.competitorMaterial ?? null, competitorUnitDescription: data.competitorUnitDescription ?? null,
            competitorPricePaise: data.competitorPriceRupees === undefined ? null : paise(data.competitorPriceRupees), competitorEvidenceUrl: data.competitorEvidenceUrl ?? null,
            competitorPriceCheckedAt: new Date(), equivalentMaterials: data.equivalentMaterials, equivalentUnits: data.equivalentUnits } });
        await db.activity.create({ data: { prospectId: data.prospectId, event: "MATCH_RECORDED", note: `Owner-linked ${product.title} to retailer demand. ${data.competitorPriceRupees ? "Competitor price source recorded." : "No competitor price evidence; no price advantage claimed."}`, evidenceUrl: data.competitorEvidenceUrl ?? null } });
        return Response.json({ id: match.id });
      }
      case "record_wholesale_intent": {
        const p = await db.prospect.findUnique({ where: { id: data.prospectId } });
        if (!p) notAllowed("NOT_FOUND");
        await db.$transaction(async tx => {
          await tx.prospect.update({ where: { id: p.id }, data: {
            wholesaleIntentEvidenceUrl: data.evidenceUrl, wholesaleIntentNote: data.note,
          } });
          await tx.activity.create({ data: { prospectId: p.id,
            event: "WHOLESALE_INTENT_OWNER_ATTESTED",
            note: data.note + " (source owner supplied, independent verification required)",
            evidenceUrl: data.evidenceUrl } });
        });
        return Response.json({ status: "OWNER_ATTESTED_INTENT", evidenceUrl: data.evidenceUrl });
      }
      case "record_permission": {
        const p = await db.prospect.findUnique({ where: { id: data.prospectId } });
        if (!p) notAllowed("NOT_FOUND");
        await db.$transaction(async tx => {
          await tx.prospect.update({ where: { id: p.id }, data: {
            contactConsentUrl: data.consentEvidenceUrl, consentGrantedAt: new Date()
          } });
          await tx.activity.create({ data: { prospectId: p.id, event: "CONTACT_PERMISSION_OWNER_ATTESTED",
            note: `Owner documented outreach eligibility: ${data.consentNote}. Verify permissions before actual contact.`, evidenceUrl: data.consentEvidenceUrl } });
        });
        return Response.json({ status: "OWNER_ATTESTED_PERMISSION" });
      }
      case "review": {
        const p = await db.prospect.findUnique({ where: { id: data.prospectId }, ...fullProspect });
        if (!p) notAllowed("NOT_FOUND");
        if (data.decision === "APPROVED") {
          const scoring = scoreProspect(p, p.matches);
          if (!scoring.qualified) notAllowed("REQUIRES_VERIFIED_QUALIFICATION");
        }
        await db.$transaction(async tx => {
          await tx.prospect.update({ where: { id: p.id }, data: { decision: data.decision } });
          await tx.activity.create({ data: { prospectId: p.id, event: `OWNER_${data.decision}`, note: data.note } });
        });
        return Response.json({ success: true });
      }
      case "advance": {
        const p = await db.prospect.findUnique({ where: { id: data.prospectId }, ...fullProspect });
        if (!p) notAllowed("NOT_FOUND");
        if (!canMove(p.stage, data.to, p.decision === "APPROVED")) notAllowed("NOT_ALLOWED_STAGE_TRANSITION");
        if (data.to === "QUALIFIED" && !scoreProspect(p, p.matches).qualified) notAllowed("REQUIRES_VERIFIED_QUALIFICATION");
        if (data.to === "APPROVED" && p.decision !== "APPROVED") notAllowed("REQUIRES_OWNER_APPROVAL");
        if (data.to === "QUOTATION") {
          const approved = await db.quote.findFirst({
            where: { prospectId: p.id, status: "APPROVED", validUntil: { gt: new Date() } },
          });
          if (!approved) notAllowed("REQUIRES_OWNER_APPROVED_CURRENT_QUOTE");
        }
                if (data.to === "CONTACTED") {
          if (!data.evidenceUrl) notAllowed("REQUIRES_MANUAL_OUTREACH_EVIDENCE");
          if (!p.contactConsentUrl || !p.consentGrantedAt || Date.now() - p.consentGrantedAt.getTime() > 365 * 86400000)
            notAllowed("REQUIRES_DOCUMENTED_CONTACT_ELIGIBILITY");
        }
        await db.$transaction(async tx => {
          await tx.prospect.update({ where: { id: p.id }, data: { stage: data.to } });
          await tx.activity.create({ data: { prospectId: p.id, event: `STAGE_${data.to}`, note: data.note, evidenceUrl: data.evidenceUrl } });
        });
        return Response.json({ success: true });
      }
      case "create_quote": {
        const [p, product, match] = await Promise.all([
          db.prospect.findUnique({ where: { id: data.prospectId } }),
          db.product.findUnique({ where: { id: data.productId } }),
          db.productMatch.findUnique({ where: { prospectId_productId: { prospectId: data.prospectId, productId: data.productId } } }),
        ]);
        if (!p || !product) notAllowed("NOT_FOUND");
        if (!match) notAllowed("REQUIRES_MATCHED_PRODUCT");
        if (p.decision === "REJECTED" || ["LOST", "WON_VERIFIED"].includes(p.stage)) notAllowed("NOT_ALLOWED_QUOTE_STAGE");
        const unitPricePaise = paise(data.unitPriceRupees);
        const deliveryPaise = paise(data.deliveryRupees);
        totalQuotePaise(data.quantity, unitPricePaise, deliveryPaise);
        const quote = await db.$transaction(async tx => {
          const created = await tx.quote.create({ data: {
            prospectId: p.id, productId: product.id, quantity: data.quantity,
            unitPricePaise, deliveryPaise,
            productTitleSnapshot: product.title,
            productUrlSnapshot: product.productUrl,
            productSourceSnapshot: product.verificationSource,
            note: data.note,
          } });
          await tx.activity.create({ data: {
            prospectId: p.id, event: "QUOTE_DRAFTED", actor: "OWNER",
            note: "Created quote draft " + created.id + " for " + data.quantity + " x " + product.title + ". No message was sent.",
            evidenceUrl: product.productUrl,
          } });
          return created;
        });
        return Response.json({ id: quote.id, status: "DRAFT", totalRupees: totalQuotePaise(quote.quantity, quote.unitPricePaise, quote.deliveryPaise) / 100 }, { status: 201 });
      }
      case "approve_quote": {
        const q = await db.quote.findUnique({ where: { id: data.quoteId }, include: { prospect: true } });
        if (!q) notAllowed("NOT_FOUND");
        if (q.status !== "DRAFT") notAllowed("NOT_ALLOWED_QUOTE_STATE");
        if (!canApproveQuote(q.prospect)) notAllowed("REQUIRES_APPROVED_PERMISSIONED_CONTACT");
        totalQuotePaise(q.quantity, q.unitPricePaise, q.deliveryPaise);
        const approvedAt = new Date();
        const validUntil = new Date(approvedAt.getTime() + 7 * 86400000);
        await db.$transaction(async tx => {
          const changed = await tx.quote.updateMany({
            where: { id: q.id, status: "DRAFT" },
            data: { status: "APPROVED", approvedAt, validUntil },
          });
          if (changed.count !== 1) notAllowed("NOT_ALLOWED_QUOTE_STATE");
          await tx.quote.updateMany({
            where: { prospectId: q.prospectId, productId: q.productId, id: { not: q.id }, status: "APPROVED" },
            data: { status: "VOID" },
          });
          await tx.activity.create({ data: {
            prospectId: q.prospectId, event: "QUOTE_OWNER_APPROVED", actor: "OWNER",
            note: "Owner attested price and availability, approved quote " + q.id + " for manual sharing only. No external message was sent.",
            evidenceUrl: q.productUrlSnapshot,
          } });
        });
        return Response.json({ id: q.id, status: "APPROVED", validUntil: validUntil.toISOString(), message: "Approved for owner-controlled manual sharing; no message sent." });
      }
      case "void_quote": {
        const q = await db.quote.findUnique({ where: { id: data.quoteId } });
        if (!q) notAllowed("NOT_FOUND");
        if (q.status === "VOID") notAllowed("NOT_ALLOWED_QUOTE_STATE");
        await db.$transaction(async tx => {
          await tx.quote.update({ where: { id: q.id }, data: { status: "VOID" } });
          await tx.activity.create({ data: {
            prospectId: q.prospectId, event: "QUOTE_VOIDED", actor: "OWNER",
            note: "Owner voided quote " + q.id + ".",
          } });
        });
        return Response.json({ id: q.id, status: "VOID" });
      }
      case "record_order": {
        const p = await db.prospect.findUnique({ where: { id: data.prospectId } });
        if (!p) notAllowed("NOT_FOUND");
        if (!["QUOTATION", "NEGOTIATION"].includes(p.stage) || p.decision !== "APPROVED") notAllowed("REQUIRES_APPROVED_QUOTATION_STAGE");
        const approvedQuote = await db.quote.findFirst({ where: { prospectId: p.id, status: "APPROVED" } });
        if (!approvedQuote) notAllowed("REQUIRES_OWNER_APPROVED_QUOTE");
        await db.$transaction(async tx => {
          await tx.conversion.upsert({ where: { prospectId: p.id }, create: { prospectId: p.id,
            orderReference: data.orderReference, grossAmountPaise: paise(data.amountRupees), evidenceUrl: data.evidenceUrl },
            update: { orderReference: data.orderReference, grossAmountPaise: paise(data.amountRupees), evidenceUrl: data.evidenceUrl, verifiedAt: null, verificationNote: null } });
          await tx.prospect.update({ where: { id: p.id }, data: { stage: "WON_REPORTED" } });
          await tx.activity.create({ data: { prospectId: p.id, event: "ORDER_OWNER_REPORTED", note: `Owner-reported order ${data.orderReference}. NOT verified paid revenue.`, evidenceUrl: data.evidenceUrl } });
        });
        return Response.json({ status: "OWNER_REPORTED_UNVERIFIED" });
      }
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return Response.json({ error: "DUPLICATE_ENTRY" }, { status: 409 });
    return apiError(e);
  }
}
