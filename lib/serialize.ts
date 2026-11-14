import { Prisma } from "@prisma/client";
import { scoreProspect } from "./domain";
export const fullProspect = Prisma.validator<Prisma.ProspectDefaultArgs>()({ include: { matches: { include: { product: true } }, activities: { orderBy: { createdAt: "desc" }, take: 20 }, quotes: { orderBy: { createdAt: "desc" }, take: 20 }, conversion: true } });
export type ProspectFull = Prisma.ProspectGetPayload<typeof fullProspect>;
export function serializeProspect(p: ProspectFull) {
  const scoring = scoreProspect(p, p.matches);
  return { id: p.id, name: p.name, city: p.city, category: p.category, businessSourceUrl: p.businessSourceUrl,
    evidenceSummary: p.evidenceSummary, stage: p.stage, decision: p.decision, createdAt: p.createdAt.toISOString(), ...scoring,
    matches: p.matches.map(m => ({ id: m.id, productId: m.productId, title: m.product.title, productUrl: m.product.productUrl,
      source: m.product.verificationSource, priceRupees: m.product.pricePaise / 100, competitorPriceRupees: m.competitorPricePaise ? m.competitorPricePaise / 100 : null,
      evidenceUrl: m.competitorEvidenceUrl, equivalentMaterials: m.equivalentMaterials, equivalentUnits: m.equivalentUnits })),
    quotes: p.quotes.map(q => ({
      id: q.id, productId: q.productId, productTitleSnapshot: q.productTitleSnapshot,
      productUrlSnapshot: q.productUrlSnapshot, productSourceSnapshot: q.productSourceSnapshot,
      quantity: q.quantity, unitPricePaise: q.unitPricePaise, deliveryPaise: q.deliveryPaise,
      note: q.note, status: q.status, validUntil: q.validUntil?.toISOString() || null,
      approvedAt: q.approvedAt?.toISOString() || null,
      totalRupees: (q.quantity * q.unitPricePaise + q.deliveryPaise) / 100,
    })),
    activities: p.activities.map(a => ({ id: a.id, event: a.event, note: a.note, evidenceUrl: a.evidenceUrl, createdAt: a.createdAt.toISOString() })),
    conversion: p.conversion ? { orderReference: p.conversion.orderReference, grossAmountRupees: p.conversion.grossAmountPaise / 100, verifiedAt: p.conversion.verifiedAt?.toISOString() || null } : null,
  };
}
