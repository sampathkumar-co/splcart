import { db } from "@/lib/prisma";
import { scoreProspect, canMove } from "@/lib/domain";
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
            competitorMaterial: data.competitorMaterial, competitorUnitDescription: data.competitorUnitDescription,
            competitorPricePaise: paise(data.competitorPriceRupees), competitorEvidenceUrl: data.competitorEvidenceUrl,
            competitorPriceCheckedAt: new Date(), equivalentMaterials: data.equivalentMaterials, equivalentUnits: data.equivalentUnits },
          update: { competitorMaterial: data.competitorMaterial, competitorUnitDescription: data.competitorUnitDescription,
            competitorPricePaise: paise(data.competitorPriceRupees), competitorEvidenceUrl: data.competitorEvidenceUrl,
            competitorPriceCheckedAt: new Date(), equivalentMaterials: data.equivalentMaterials, equivalentUnits: data.equivalentUnits } });
        await db.activity.create({ data: { prospectId: data.prospectId, event: "MATCH_RECORDED", note: `Manual evidence comparison against ${product.title}; no unverified price advantage claimed`, evidenceUrl: data.competitorEvidenceUrl } });
        return Response.json({ id: match.id });
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
        if (data.to === "CONTACTED" && !data.evidenceUrl) notAllowed("REQUIRES_MANUAL_OUTREACH_EVIDENCE");
        await db.$transaction(async tx => {
          await tx.prospect.update({ where: { id: p.id }, data: { stage: data.to } });
          await tx.activity.create({ data: { prospectId: p.id, event: `STAGE_${data.to}`, note: data.note, evidenceUrl: data.evidenceUrl } });
        });
        return Response.json({ success: true });
      }
      case "record_order": {
        const p = await db.prospect.findUnique({ where: { id: data.prospectId } });
        if (!p) notAllowed("NOT_FOUND");
        if (!["QUOTATION", "NEGOTIATION"].includes(p.stage) || p.decision !== "APPROVED") notAllowed("REQUIRES_APPROVED_QUOTATION_STAGE");
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
