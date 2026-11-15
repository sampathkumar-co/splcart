import {describe,it,expect} from "vitest";
import {mkdtemp,writeFile,readdir,symlink,readFile,rm,mkdir} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const script=fileURLToPath(new URL("../scripts/hq-backup-retention.mjs",import.meta.url));
const day=24*60*60*1000;
function name(daysAgo,number){
 const iso=new Date(Date.now()-daysAgo*day).toISOString();
 const stamp=iso.slice(0,19).replace(/[-:]/g,"").replace("T","T")+"Z";
 return "prasanth-hq-"+stamp+"-"+number+".age";
}
function run(args){return spawnSync(process.execPath,[script,...args],{encoding:"utf8"});}
describe("owner-confirmed independent HQ encrypted archive retention",()=>{
 it("dry-runs 90 day expiry, preserving two most recent archives and foreign files",async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),"hq-backups-test-"));
  try{
   const names=[name(130,101),name(122,102),name(100,103),name(12,104),name(3,105)];
   for(const n of names)await writeFile(path.join(dir,n),"FAKE_CI_TEST_ARCHIVE");
   await writeFile(path.join(dir,"safeguard.agekey"),"NOT_AN_ACTUAL_KEY");
   await writeFile(path.join(dir,"unrecognized.age"),"OTHER_DATA");
   const check=run(["--dir",dir,"--days","90"]);
   expect(check.status).toBe(0);
   const details=JSON.parse(check.stdout);
   expect(details.mode).toBe("DRY_RUN_ONLY");
   expect(details.candidateCount).toBe(3);
   expect(details.removed).toEqual([]);
   expect((await readdir(dir)).length).toBe(7);
   const apply=run(["--dir",dir,"--days","90","--apply","--confirm","DELETE_EXPIRED_HQ_BACKUPS"]);
   expect(apply.status).toBe(0);
   const result=JSON.parse(apply.stdout);
   expect(result.removed).toHaveLength(3);
   const surviving=await readdir(dir);
   expect(surviving).toContain(names[3]);
   expect(surviving).toContain(names[4]);
   expect(surviving).toContain("safeguard.agekey");
   expect(surviving).toContain("unrecognized.age");
  }finally{await rm(dir,{recursive:true,force:true});}
 });
 it("requires exact typed apply consent and rejects unsafe expiry windows",async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),"hq-backups-test-"));
  try{
   const n=name(140,4);await writeFile(path.join(dir,n),"TEST");
   for(const args of [
    ["--dir",dir,"--days","90","--apply"],
    ["--dir",dir,"--days","90","--apply","--confirm","PURGE"],
    ["--dir",dir,"--days","7","--apply","--confirm","DELETE_EXPIRED_HQ_BACKUPS"],
    ["--dir",dir,"--days","90","--confirm","DELETE_EXPIRED_HQ_BACKUPS"],
   ]){
    expect(run(args).status).toBe(2);
    expect(await readdir(dir)).toContain(n);
   }
  }finally{await rm(dir,{recursive:true,force:true});}
 });
 it("never follows a matching archive symlink to another file",async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),"hq-backups-test-"));
  const external=await mkdtemp(path.join(tmpdir(),"private-target-"));
  try{
   const target=path.join(external,"keep.txt");
   await writeFile(target,"DO_NOT_DELETE");
   await symlink(target,path.join(dir,name(150,111)));
   const result=run(["--dir",dir,"--days","90","--apply","--confirm","DELETE_EXPIRED_HQ_BACKUPS"]);
   expect(result.status).toBe(2);
   expect(await readFile(target,"utf8")).toBe("DO_NOT_DELETE");
  }finally{await rm(dir,{recursive:true,force:true});await rm(external,{recursive:true,force:true});}
 });
 it("refuses SPLCART, root, indirect dirs and unrecognized archive names",async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),"hq-backups-test-"));
  const splcart=await mkdtemp(path.join(tmpdir(),"splcart-backups-test-"));
  try{
   const invalid="prasanth-hq-20261301T999999Z-12.age";
   await writeFile(path.join(dir,invalid),"FOREIGN");
   expect(JSON.parse(run(["--dir",dir,"--days","90"]).stdout).skippedUnrecognized).toContain(invalid);
   expect(run(["--dir",splcart,"--days","90"]).status).toBe(2);
   expect(run(["--dir","/","--days","90"]).status).toBe(2);
   const link=path.join(tmpdir(),"hq-backups-link-"+Date.now());
   await symlink(dir,link);
   try{expect(run(["--dir",link,"--days","90"]).status).toBe(2);}
   finally{await rm(link,{force:true});}
  }finally{await rm(dir,{recursive:true,force:true});await rm(splcart,{recursive:true,force:true});}
 });
});
