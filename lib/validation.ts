import { z } from "zod";

export const publicUrl = z.url().max(1000).refine(v => {
  try { const u = new URL(v); return u.protocol === "https:" && !u.username && !u.password && !u.port &&
    !["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(u.hostname) && !u.hostname.endsWith(".local"); }
  catch { return false; }
}, "A public HTTPS URL is required");
const text = (max: number) => z.string().trim().min(2).max(max);
const id = z.uuid();
export const actionInput = z.discriminatedUnion("action", [
  z.object({ action: z.literal("add_prospect"), name: text(140), city: text(80), category: text(80), businessSourceUrl: publicUrl, evidenceSummary: text(1500), researchRunId: id.optional() }),
  z.object({ action: z.literal("add_product"), splcartProductId: text(100), title: text(150), category: text(80), material: text(80), unitDescription: text(100), priceRupees: z.coerce.number().positive().max(1000000), productUrl: publicUrl.refine(v => new URL(v).hostname === "splcart.in" || new URL(v).hostname.endsWith(".splcart.in"), "Use a real SPLCART product link") }),
  z.object({ action: z.literal("add_match"), prospectId: id, productId: id, competitorMaterial: text(80), competitorUnitDescription: text(100), competitorPriceRupees: z.coerce.number().positive().max(1000000), competitorEvidenceUrl: publicUrl, equivalentMaterials: z.boolean(), equivalentUnits: z.boolean() }),
  z.object({ action: z.literal("record_permission"), prospectId: id, consentEvidenceUrl: publicUrl, consentNote: text(600) }),
  z.object({ action: z.literal("review"), prospectId: id, decision: z.enum(["APPROVED", "REJECTED"]), note: text(600) }),
  z.object({ action: z.literal("advance"), prospectId: id, to: z.enum(["RESEARCHED","QUALIFIED","APPROVED","CONTACTED","INTERESTED","QUOTATION","NEGOTIATION","LOST","FOLLOW_UP"]), note: text(600), evidenceUrl: publicUrl.optional() }),
  z.object({ action: z.literal("record_order"), prospectId: id, orderReference: text(120), amountRupees: z.coerce.number().positive().max(100000000), evidenceUrl: publicUrl }),
]).strict();
export const researchInput = z.object({ url: publicUrl }).strict();
export function apiError(error: unknown) {
  if (error instanceof z.ZodError) return Response.json({ error: "Invalid input", details: error.issues.map(i => i.message) }, { status: 400 });
  if (error instanceof Error && /^(INVALID_|NOT_|REQUIRES_|ALREADY_|HTTPS_|PRIVATE_|PAGE_|RESEARCH_|NOT_ALLOWED|CHROMIUM_)/.test(error.message))
    return Response.json({ error: error.message }, { status: 400 });
  console.error("HQ request failure:", error instanceof Error ? error.message : "unknown");
  return Response.json({ error: "Action failed. Check database, browser installation, and server logs." }, { status: 500 });
}
