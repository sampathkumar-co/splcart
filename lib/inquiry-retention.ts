/**
 * Optional OWNER-TRIGGERED deletion, never an automatic retention job.
 * We use updatedAt (last manual change) to avoid deleting recently handled
 * conversations even if the initial inbound date is old.
 */
export const INQUIRY_RETENTION_DAYS=[30,90,180] as const;
export type InquiryRetentionDays=(typeof INQUIRY_RETENTION_DAYS)[number];
export const PURGE_BATCH_LIMIT=100;
export function inquiryRetentionCutoff(days:InquiryRetentionDays,now=new Date()):Date{
 if(!INQUIRY_RETENTION_DAYS.includes(days))throw new Error("INVALID_RETENTION_WINDOW");
 return new Date(now.getTime()-days*86_400_000);
}
export const CUSTOMER_HISTORY_REDACTED={
 summary:"Historical customer enquiry summary redacted following an owner privacy action. Original individual names and messages no longer retained in this task report.",
 items:[],
 computeCost:"NOT_METERED",
 provenance:"PRIVACY_REDACTED",
} as const;
