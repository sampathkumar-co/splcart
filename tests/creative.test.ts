import {describe,expect,it} from "vitest";
import {creativePath,detectImage,renderProductReel,saveOwnerPhoto,REEL_DURATION_SECONDS,REEL_WIDTH,REEL_HEIGHT} from "../lib/creative";

describe("local code-rendered jewellery studio without paid API keys",()=>{
 it("requires real explicit JPEG/PNG magic rather than trusting filename or MIME",()=>{
   expect(detectImage(Buffer.from([137,80,78,71,13,10,26,10,0]))).toBe("image/png");
   expect(detectImage(Buffer.from([255,216,255,224]))).toBe("image/jpeg");
   expect(detectImage(Buffer.from("<svg onload='alert(1)' />"))).toBeNull();
   expect(detectImage(Buffer.from("not a real image"))).toBeNull();
 });
 it("refuses traversal, missing extensions, cross-media filenames",()=>{
   expect(()=>creativePath("assets","../../.env")).toThrow("INVALID_MEDIA_FILENAME");
   expect(()=>creativePath("reels","../../etc/passwd")).toThrow("INVALID_MEDIA_FILENAME");
   expect(()=>creativePath("assets","7ecbb659-25f6-41d7-b84d-e95a1aa449bd.mp4")).toThrow("INVALID_MEDIA_FILENAME");
   expect(creativePath("assets","7ecbb659-25f6-41d7-b84d-e95a1aa449bd.png")).toContain("assets");
 });
 it("enforces bounded owner image payload before trying to decode",async()=>{
   await expect(saveOwnerPhoto("not base 64!")).rejects.toThrow("INVALID_IMAGE_ENCODING");
   await expect(saveOwnerPhoto(Buffer.from("not-image").toString("base64"))).rejects.toThrow("INVALID_IMAGE_ENCODING");
   await expect(saveOwnerPhoto(Buffer.alloc(3*1024*1024+1).toString("base64"))).rejects.toThrow("INVALID_IMAGE_ENCODING");
 });
 it("always uses 20 seconds at 720x1280 in non-test mode",async()=>{
   expect(REEL_DURATION_SECONDS).toBe(20);
   expect(REEL_WIDTH).toBe(720);
   expect(REEL_HEIGHT).toBe(1280);
   await expect(renderProductReel({imageFilename:"fake.png",outputFilename:"fake.mp4",
     title:"Real owner product",material:"Owner attested",ownerLink:"https://example.org",durationSeconds:7}))
     .rejects.toThrow("INVALID_REEL_DURATION");
 });
});
