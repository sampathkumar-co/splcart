/**
 * Pure, deterministic quote rules for independent AI Headquarters.
 * HQ does not query or mutate the SPLCART storefront.
 * All quote prices and availability confirmations are owner assertions.
 */
export type ApprovalContext = {
  decision: string;
  stage: string;
  contactConsentUrl: string | null;
  consentGrantedAt: Date | null;
};

export type QuotationRecord = {
  id: string;
  productTitleSnapshot: string;
  productUrlSnapshot: string;
  productSourceSnapshot: string;
  quantity: number;
  unitPricePaise: number;
  deliveryPaise: number;
  status: string;
  note: string;
  validUntil: Date | string | null;
};

export function totalQuotePaise(quantity: number, unitPricePaise: number, deliveryPaise: number): number {
  if (![quantity, unitPricePaise, deliveryPaise].every(Number.isSafeInteger) ||
      quantity < 1 || quantity > 5000 || unitPricePaise <= 0 ||
      deliveryPaise < 0 || deliveryPaise > 20_000_000) {
    throw new Error("INVALID_QUOTE_AMOUNT");
  }
  const total = quantity * unitPricePaise + deliveryPaise;
  if (!Number.isSafeInteger(total) || total > 10_000_000_000) throw new Error("INVALID_QUOTE_AMOUNT");
  return total;
}

/** Manual quote publication is only possible after a permission-backed, owner-approved contact. */
export function canApproveQuote(p: ApprovalContext, now = new Date()) {
  const consent = p.consentGrantedAt;
  const freshPermission = !!consent && now.getTime() >= consent.getTime() &&
    now.getTime() - consent.getTime() <= 365 * 86400000;
  return p.decision === "APPROVED" &&
    ["CONTACTED", "INTERESTED", "QUOTATION", "NEGOTIATION"].includes(p.stage) &&
    !!p.contactConsentUrl && freshPermission;
}

export function quoteShareText(q: QuotationRecord): string | null {
  if (q.status !== "APPROVED" || !q.validUntil || new Date(q.validUntil).getTime() < Date.now()) return null;
  const total = totalQuotePaise(q.quantity, q.unitPricePaise, q.deliveryPaise);
  const rupees = (paise: number) => "₹" + (paise / 100).toFixed(2);
  const valid = new Date(q.validUntil).toISOString().slice(0, 10);
  return [
    "PRASANTH JEWELLERS | OWNER-APPROVED WHOLESALE QUOTATION",
    "Quote ID: " + q.id,
    "Product: " + q.productTitleSnapshot,
    "Product link: " + q.productUrlSnapshot,
    "Quantity: " + q.quantity,
    "Unit price (owner confirmed): " + rupees(q.unitPricePaise),
    "Delivery charge: " + rupees(q.deliveryPaise),
    "Quoted total: " + rupees(total),
    "Valid until: " + valid,
    "Notes: " + (q.note || "None"),
    "Product reference source: " + q.productSourceSnapshot,
    "This is an owner-approved HQ quote, not a paid order or a real-time SPLCART stock promise.",
  ].join("\n");
}
