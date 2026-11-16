/** Single source of real HQ-only persisted evidence for on-demand role reports. */
import { db } from "./prisma";
import type {LocalContext} from "./local-agents";

export async function loadLocalContext(now=new Date()):Promise<LocalContext>{
      const [leads,products,reels,photos,research,publications,inquiries]=await Promise.all([
        db.prospect.findMany({orderBy:{updatedAt:"desc"},take:200,
          select:{id:true,name:true,category:true,stage:true,decision:true,
            businessSourceUrl:true,updatedAt:true,verifiedBusinessAt:true,
            wholesaleIntentEvidenceUrl:true,contactConsentUrl:true,consentGrantedAt:true,
            activities:{orderBy:{createdAt:"desc"},take:1,select:{createdAt:true}},
            conversion:{select:{id:true}},
          }}),
        db.product.findMany({orderBy:{createdAt:"desc"},take:150,
          select:{id:true,title:true,category:true,material:true,productUrl:true}}),
        db.reelJob.findMany({orderBy:{createdAt:"desc"},take:150,
          select:{id:true,status:true,productId:true,titleSnapshot:true}}),
        db.creativeAsset.findMany({orderBy:{createdAt:"desc"},take:150,
          select:{id:true,productId:true}}),
        db.researchRun.findMany({orderBy:{startedAt:"desc"},take:100,
          select:{id:true,sourceUrl:true,status:true,provider:true,pageTitle:true}}),
        db.socialPublication.findMany({orderBy:{recordedAt:"desc"},take:80,
          select:{id:true,platform:true,postUrl:true,
            reel:{select:{titleSnapshot:true}},
            metrics:{orderBy:{observedAt:"desc"},take:1,
              select:{views:true,likes:true,enquiries:true,sourceLabel:true}}},
        }),
        db.customerInquiry.findMany({orderBy:{createdAt:"desc"},take:150,
          select:{id:true,customerAlias:true,channel:true,category:true,
            status:true,createdAt:true,sourceLabel:true}}),
      ]);
      return {now,
        leads:leads.map(p=>({id:p.id,name:p.name,category:p.category,stage:p.stage,
          decision:p.decision,sourceUrl:p.businessSourceUrl,updatedAt:p.updatedAt,
          verifiedBusinessAt:p.verifiedBusinessAt,
          wholesaleIntentEvidenceUrl:p.wholesaleIntentEvidenceUrl,contactConsentUrl:p.contactConsentUrl,
          consentGrantedAt:p.consentGrantedAt,
          lastActivityAt:p.activities[0]?.createdAt??null,reportedOrder:!!p.conversion})),
        products,reels,photos,research,inquiries,
        socialPosts:publications.map(p=>({
          id:p.id,platform:p.platform,title:p.reel.titleSnapshot,
          postUrl:p.postUrl,
          views:p.metrics[0]?.views??null,likes:p.metrics[0]?.likes??null,
          enquiries:p.metrics[0]?.enquiries??null,
          metricSource:p.metrics[0]?.sourceLabel??null,
        }))};
 }
