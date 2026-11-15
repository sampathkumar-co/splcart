#!/usr/bin/env node
/**
 * Owner-initiated, dedicated Headquarters encrypted backup retention.
 * Default: inventory/dry-run. No scheduling, transfer, keys, decryption,
 * customer contact or SPLCART access. Never deletes any unknown file.
 */
import {lstat,readdir,unlink,realpath} from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const PATTERN=/^prasanth-hq-(\d{8})T(\d{6})Z-(\d{1,5})\.age$/;
const DAYS=new Set([30,60,90,180]);
const CONFIRM="DELETE_EXPIRED_HQ_BACKUPS";
const usage="Usage: node scripts/hq-backup-retention.mjs --dir /absolute/private/hq-backups --days 90 [--apply --confirm DELETE_EXPIRED_HQ_BACKUPS]\n";

function fail(message){
 process.stderr.write("HQ retention refused: "+message+"\n"+usage);
 process.exitCode=2;
}
function parseArgs(args){
 const options={dir:null,days:null,apply:false,confirm:null};
 for(let i=0;i<args.length;i++){
  const arg=args[i];
  if(arg==="--dir"||arg==="--days"||arg==="--confirm"){
   if(i+1>=args.length)throw Error("missing value after "+arg);
   const value=args[++i];const key=arg.slice(2);
   if(options[key]!==null)throw Error("duplicate "+arg);
   options[key]=value;
  }else if(arg==="--apply"){
   if(options.apply)throw Error("duplicate --apply");
   options.apply=true;
  }else throw Error("unknown argument "+arg);
 }
 if(typeof options.dir!=="string"||!path.isAbsolute(options.dir))
   throw Error("absolute --dir required");
 if(!DAYS.has(Number(options.days))||!/^\d+$/.test(String(options.days)))
   throw Error("supported --days: 30, 60, 90, 180");
 if(options.confirm!==null&&(!options.apply||options.confirm!==CONFIRM))
   throw Error("typed confirmation only permitted with --apply");
 if(options.apply&&options.confirm!==CONFIRM)
   throw Error("unsafe deletion: --apply requires typed "+CONFIRM);
 const normalized=path.resolve(options.dir);
 if(normalized==="/"||normalized===path.parse(normalized).root||
    /(^|[/\\_-])splcart([/\\_-]|$)/i.test(normalized)||
    !/(^|[/\\_-])(hq|headquarters)([/\\_-]|$)/i.test(normalized))
   throw Error("directory must be a dedicated HQ path, never root or SPLCART");
 return {...options,days:Number(options.days),dir:normalized};
}
function archiveTime(name){
 const match=PATTERN.exec(name);
 if(!match)return null;
 const stamp=match[1]+match[2];
 const y=+stamp.slice(0,4),m=+stamp.slice(4,6),d=+stamp.slice(6,8);
 const h=+stamp.slice(8,10),min=+stamp.slice(10,12),sec=+stamp.slice(12,14);
 const time=Date.UTC(y,m-1,d,h,min,sec);
 if(!Number.isFinite(time))return null;
 const iso=new Date(time).toISOString();
 if(iso.slice(0,19).replace(/[-T:]/g,"")!==stamp)return null;
 return time;
}
async function execute(options){
 const root=await lstat(options.dir);
 if(!root.isDirectory()||root.isSymbolicLink())
   throw Error("refusing non-directory or symlink backup destination");
 const truePath=await realpath(options.dir);
 if(truePath!==options.dir)throw Error("refusing indirect/symlinked backup path");
 if(typeof process.getuid==="function"&&root.uid!==process.getuid())
   throw Error("backup directory must be owned by this operator");
 const entries=await readdir(options.dir,{withFileTypes:true});
 const files=[];
 const skipped=[];
 for(const entry of entries){
  if(!entry.name.startsWith("prasanth-hq-")||!entry.name.endsWith(".age"))continue;
  const created=archiveTime(entry.name);
  if(created===null){skipped.push(entry.name);continue;}
  const full=path.join(options.dir,entry.name);
  const stat=await lstat(full);
  if(!stat.isFile()||stat.isSymbolicLink())
   throw Error("refusing matching HQ archive symlink or special file: "+entry.name);
  files.push({name:entry.name,created,ino:stat.ino,dev:stat.dev});
 }
 files.sort((a,b)=>b.created-a.created||b.name.localeCompare(a.name));
 // A time-based policy must never erase the last recoverable archive.
 const keepCount=Math.min(files.length,2);
 const protectedNames=new Set(files.slice(0,keepCount).map(f=>f.name));
 const cutoff=Date.now()-options.days*24*60*60*1000;
 const eligible=files.filter(f=>!protectedNames.has(f.name)&&f.created<cutoff);
 const removed=[];
 if(options.apply){
  for(const candidate of eligible){
   const full=path.join(options.dir,candidate.name);
   const now=await lstat(full);
   if(!now.isFile()||now.isSymbolicLink()||now.ino!==candidate.ino||now.dev!==candidate.dev)
    throw Error("archive changed after inventory; aborting: "+candidate.name);
   await unlink(full);
   removed.push(candidate.name);
  }
 }
 process.stdout.write(JSON.stringify({
  mode:options.apply?"owner_confirmed_apply":"DRY_RUN_ONLY",
  retentionDays:options.days,
  protectedNewestCount:keepCount,
  considered:files.length,
  candidateCount:eligible.length,
  candidates:eligible.map(f=>f.name),
  removed,
  skippedUnrecognized:skipped,
  note:"Local HQ .age archives only. Unknown files and separately copied offsite backups are untouched.",
 },null,2)+"\n");
}
try{
 const options=parseArgs(process.argv.slice(2));
 await execute(options);
}catch(error){fail(error instanceof Error?error.message:String(error));}
