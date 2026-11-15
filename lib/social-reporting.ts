/**
 * No external publishing or analytics APIs. These checks only classify
 * owner-reported URLs; never fetch, scrape or verify the social media content.
 */
export type SocialPlatform="INSTAGRAM"|"YOUTUBE";
export function normalizeSocialPost(platform:SocialPlatform,raw:string):string{
  let url:URL;
  try{url=new URL(raw);}catch{throw new Error("INVALID_SOCIAL_POST_LINK");}
  if(url.protocol!=="https:"||url.username||url.password||url.port||url.hash)
    throw new Error("INVALID_SOCIAL_POST_LINK");
  const hostname=url.hostname.toLowerCase();
  const path=url.pathname;
  if(platform==="INSTAGRAM" &&
     !["instagram.com","www.instagram.com"].includes(hostname))
    throw new Error("INVALID_SOCIAL_POST_LINK");
  if(platform==="YOUTUBE" &&
     !["youtube.com","www.youtube.com","youtu.be"].includes(hostname))
    throw new Error("INVALID_SOCIAL_POST_LINK");
  if(platform==="INSTAGRAM" && !/^\/(reel|p)\/[A-Za-z0-9_-]{5,64}\/?$/.test(path))
    throw new Error("INVALID_SOCIAL_POST_LINK");
  if(platform==="YOUTUBE" && !(/^\/shorts\/[A-Za-z0-9_-]{8,20}\/?$/.test(path) ||
      (hostname==="youtu.be" && /^\/[A-Za-z0-9_-]{8,20}\/?$/.test(path))))
    throw new Error("INVALID_SOCIAL_POST_LINK");
  url.search="";
  return url.toString();
}
export function validateMetricCounts(values:{views?:number|null;likes?:number|null;enquiries?:number|null}){
  const present=Object.values(values).filter((n):n is number=>n!==null&&n!==undefined);
  if(!present.length||present.some(n=>!Number.isSafeInteger(n)||n<0||n>1_000_000_000))
    throw new Error("INVALID_OWNER_METRICS");
  return true;
}
export type SocialMeasured={platform:SocialPlatform;views:number|null;likes:number|null;enquiries:number|null;sourceLabel:string;observedAt:Date};
export function summarizeOwnerReportedMetrics(rows:readonly SocialMeasured[]){
  const byPlatform=(["INSTAGRAM","YOUTUBE"] as const).map(platform=>{
    const relevant=rows.filter(r=>r.platform===platform && r.sourceLabel==="OWNER_REPORTED");
    const sums={
      views:relevant.reduce((sum,r)=>sum+(r.views??0),0),
      likes:relevant.reduce((sum,r)=>sum+(r.likes??0),0),
      enquiries:relevant.reduce((sum,r)=>sum+(r.enquiries??0),0),
    };
    return {platform,reportedSnapshots:relevant.length,totals:sums,
      disclaimer:"Owner-entered figures only. Not verified by Instagram or YouTube. Different snapshots of one post must not be summed."};
  });
  return {byPlatform,verification:"OWNER_REPORTED_ONLY"};
}
