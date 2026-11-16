/**
 * Standalone HQ-only media integrity inventory for cold backup and fresh restore.
 * Cross-checks every referenced local photo/MP4 against HQ-only PostgreSQL rows.
 * No SPLCART API, database, storage, file or external network access.
 */
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {createReadStream} from "node:fs";
import {lstat,readFile} from "node:fs/promises";
import {join,resolve} from "node:path";
import {PrismaClient} from "@prisma/client";

const [mode,arg]=process.argv.slice(2);
const root=process.env.HQ_MEDIA_DIR;
const url=process.env.DATABASE_URL;
if(!root||!url||!["snapshot","verify"].includes(mode)||(mode==="verify"&&!arg))
 throw new Error("HQ_MEDIA_RECOVERY_REQUIRES_DEDICATED_DB_MEDIA_AND_MODE");
const dbName=new URL(url).pathname;
if(dbName!=="/hq" && !(process.env.HQ_TEST_MODE==="1" && dbName==="/hq_media_restore_check"))
 throw new Error("HQ_MEDIA_RECOVERY_REFUSES_NON_HQ_DATABASE");
if(/splcart/i.test(root))throw new Error("HQ_MEDIA_RECOVERY_REFUSES_STORE_PATH");

const base=resolve(root);
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function realDirectory(path){
 const stat=await lstat(path);
 if(!stat.isDirectory()||stat.isSymbolicLink())throw new Error("UNSAFE_MEDIA_DIRECTORY");
}
async function fileInfo(entry){
 assert.ok(entry && ["assets","reels"].includes(entry.folder),"INVALID_MEDIA_FOLDER");
 const ext=entry.folder==="assets"?".png":".mp4";
 assert.ok(typeof entry.filename==="string"&&entry.filename.endsWith(ext)&&
   uuid.test(entry.filename.slice(0,-ext.length)),"INVALID_MEDIA_FILENAME");
 const directory=join(base,entry.folder);
 await realDirectory(directory);
 const path=join(directory,entry.filename);
 const stat=await lstat(path);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size<64)
  throw new Error("UNSAFE_OR_EMPTY_HQ_MEDIA_FILE: "+entry.filename);
 const hash=createHash("sha256");
 const stream=createReadStream(path,{flags:"r"});
 for await(const chunk of stream)hash.update(chunk);
 return {folder:entry.folder,filename:entry.filename,bytes:stat.size,sha256:hash.digest("hex")};
}
async function expectedRows(db){
 const [photos,jobs]=await Promise.all([
  db.creativeAsset.findMany({select:{filename:true,byteSize:true}}),
  db.reelJob.findMany({where:{outputFilename:{not:null}},
   select:{outputFilename:true,status:true}}),
 ]);
 const entries=[];
 for(const p of photos)entries.push({folder:"assets",filename:p.filename,expectedBytes:p.byteSize});
 for(const j of jobs){
  if(!["RENDERED","APPROVED","VOID"].includes(j.status))
   throw new Error("IMPOSSIBLE_HQ_REEL_OUTPUT_STATUS");
  entries.push({folder:"reels",filename:j.outputFilename});
 }
 entries.sort((a,b)=>(a.folder+"/"+a.filename).localeCompare(b.folder+"/"+b.filename));
 const unique=new Set(entries.map(e=>e.folder+"/"+e.filename));
 if(unique.size!==entries.length)throw new Error("DUPLICATED_HQ_MEDIA_REFERENCE");
 return entries;
}
async function main(){
 await realDirectory(base);
 const db=new PrismaClient();
 try{
  const entries=await expectedRows(db);
  const files=[];
  for(const entry of entries){
   const current=await fileInfo(entry);
   if(entry.expectedBytes!=null && current.bytes!==entry.expectedBytes)
    throw new Error("HQ_PHOTO_DB_BYTE_SIZE_MISMATCH: "+entry.filename);
   files.push(current);
  }
  if(mode==="snapshot"){
   process.stdout.write(JSON.stringify({schema:"prasanth-hq-media-v1",createdAt:new Date().toISOString(),
    source:"DEDICATED_HEADQUARTERS_ONLY",
    photoCount:entries.filter(e=>e.folder==="assets").length,
    videoCount:entries.filter(e=>e.folder==="reels").length,
    files},null,2)+"\n");
   return;
  }
  const info=await lstat(arg);
  if(!info.isFile()||info.isSymbolicLink()||info.size>10*1024*1024)throw new Error("INVALID_MANIFEST_FILE");
  const manifest=JSON.parse(await readFile(arg,"utf8"));
  assert.equal(manifest.schema,"prasanth-hq-media-v1");
  assert.equal(manifest.source,"DEDICATED_HEADQUARTERS_ONLY");
  assert.ok(Array.isArray(manifest.files));
  assert.equal(manifest.photoCount,entries.filter(e=>e.folder==="assets").length);
  assert.equal(manifest.videoCount,entries.filter(e=>e.folder==="reels").length);
  assert.equal(manifest.files.length,files.length,"DATABASE_MEDIA_REFERENCE_COUNT_MISMATCH");
  for(let i=0;i<files.length;i++){
   assert.deepEqual(files[i],manifest.files[i],"MEDIA_CHECKSUM_OR_DB_REFERENCE_MISMATCH");
  }
  console.log("PASS HQ recovered DB/media integrity: "+manifest.photoCount+
    " actual PNG(s), "+manifest.videoCount+" actual MP4(s); SHA-256 verified; independent source.");
 }finally{await db.$disconnect();}
}
main().catch(e=>{console.error("HQ_MEDIA_RECOVERY_FAILED",e.message);process.exitCode=1;});
