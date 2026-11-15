/**
 * HQ-only creative asset handling. Explicit owner photo; no remote fetching,
 * storefront access, paid model, AI-video endpoint, or background data scraping.
 */
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { spawn } from "node:child_process";

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const MAX_PIXELS = 16_000_000;
export const REEL_DURATION_SECONDS = 20;
export const REEL_WIDTH = 720;
export const REEL_HEIGHT = 1280;
const MEDIA_ROOT = resolve(process.env.HQ_MEDIA_DIR || join(process.cwd(), "data", "hq-media"));

export function creativePath(folder: "assets" | "reels", filename: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|mp4)$/i.test(filename))
    throw new Error("INVALID_MEDIA_FILENAME");
  if (folder === "assets" && !filename.endsWith(".png")) throw new Error("INVALID_MEDIA_FILENAME");
  if (folder === "reels" && !filename.endsWith(".mp4")) throw new Error("INVALID_MEDIA_FILENAME");
  return join(MEDIA_ROOT, folder, filename);
}

export function detectImage(buffer: Buffer): "image/png" | "image/jpeg" | null {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return "image/png";
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return "image/jpeg";
  return null;
}

export async function saveOwnerPhoto(contentBase64: string) {
  if (!/^[A-Za-z0-9+/=]+$/.test(contentBase64) ||
      contentBase64.length > Math.ceil(MAX_UPLOAD_BYTES * 4 / 3) + 5 ||
      contentBase64.length < 20) throw new Error("INVALID_IMAGE_ENCODING");
  const buffer = Buffer.from(contentBase64, "base64");
  if (!buffer.length || buffer.length > MAX_UPLOAD_BYTES || !detectImage(buffer))
    throw new Error("INVALID_IMAGE_CONTENT");
  let photo;
  try {
    photo = await sharp(buffer, { limitInputPixels: MAX_PIXELS, failOn: "error" })
      .rotate().resize({ width:1200,height:1200,fit:"inside",withoutEnlargement:true })
      .flatten({ background:"#ffffff" }).png({compressionLevel:7})
      .toBuffer({resolveWithObject:true});
  } catch { throw new Error("INVALID_IMAGE_CONTENT"); }
  const {width,height} = photo.info;
  if (width < 350 || height < 350 || photo.data.byteLength > 8 * 1024 * 1024)
    throw new Error("INVALID_IMAGE_DIMENSIONS");
  const filename = randomUUID()+".png";
  await mkdir(join(MEDIA_ROOT,"assets"),{recursive:true,mode:0o700});
  await writeFile(creativePath("assets", filename),photo.data,{flag:"wx",mode:0o600});
  return {filename,width,height,byteSize:photo.data.byteLength,mime:"image/png" as const};
}

export async function loadMedia(folder: "assets" | "reels", filename: string) {
  return readFile(creativePath(folder,filename));
}

function safeCopy(value:string, max:number) {
  return value.replace(/[\r\n\t]/g," ").replace(/[<>]/g,"").replace(/\s+/g," ").trim().slice(0,max);
}

/**
 * Fully local FFmpeg render. A copyright-free 20s silent 9:16 jewellery promo.
 * Product facts are owner-entered. No unsupported "discount" / stock claim.
 * Uses only code-generated typography, motion and the owner's own image.
 */
export async function renderProductReel(input: {
  imageFilename:string; outputFilename:string; title:string; material:string;
  ownerLink:string; durationSeconds?:number;
}) {
  const seconds=input.durationSeconds??REEL_DURATION_SECONDS;
  if (seconds !== REEL_DURATION_SECONDS && !(process.env.HQ_TEST_MODE === "1" && seconds === 2))
    throw new Error("INVALID_REEL_DURATION");
  const imagePath=creativePath("assets",input.imageFilename);
  const outputPath=creativePath("reels",input.outputFilename);
  const tempDir=join(MEDIA_ROOT,"reels","titles-"+randomUUID());
  await mkdir(tempDir,{recursive:true,mode:0o700});
  await mkdir(join(MEDIA_ROOT,"reels"),{recursive:true,mode:0o700});
  const { rm }=await import("node:fs/promises");
  const font = process.env.HQ_REEL_FONT_FILE || "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";
  const captions=[
    "PRASANTH JEWELLERS",
    safeCopy(input.title,42),
    safeCopy(input.material,38),
    "DISCOVER THE COLLECTION",
    "OWNER-APPROVED CREATIVE · LINK IN DESCRIPTION",
  ];
  if(!captions[1] || !captions[2]) throw new Error("INVALID_REEL_COPY");
  const textFiles=await Promise.all(captions.map(async(txt,i)=>{
    const target=join(tempDir,`text-${i}.txt`);
    await writeFile(target,txt,{mode:0o600});
    return target;
  }));
  const esc=(s:string)=>s.replace(/\\/g,"\\\\").replace(/:/g,"\\:").replace(/'/g,"\\'");
  const draw=(index:number, y:number, fontsize:number, start:number, end:number,color="0xf4e3c8") =>
    `drawtext=fontfile='${esc(font)}':textfile='${esc(textFiles[index])}':fontcolor=${color}:fontsize=${fontsize}:x=(w-text_w)/2:y=${y}:enable='between(t,${start},${end})'`;
  const filter=[
    "[1:v]scale=850:850:force_original_aspect_ratio=decrease:flags=lanczos,pad=850:850:(ow-iw)/2:(oh-ih)/2:color=0x192024,zoompan=z='min(zoom+0.00015,1.11)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=580x580:fps=24,format=yuv420p[photo]",
    "[0:v][photo]overlay=(W-w)/2:285:shortest=1",
    "drawbox=x=58:y=162:w=604:h=3:color=0xc4a46f:t=fill",
    "drawbox=x=58:y=960:w=604:h=3:color=0xc4a46f:t=fill",
    draw(0,100,29,0,seconds),
    draw(1,916,31,0,seconds/2),
    draw(2,917,28,seconds/2,seconds-4),
    draw(3,921,29,seconds-4,seconds),
    draw(4,1135,15,0,seconds),
    "format=yuv420p[out]",
  ].join(",");
  const args=[
    "-hide_banner","-nostdin","-loglevel","error","-y",
    "-f","lavfi","-i",`color=c=0x11191d:s=${REEL_WIDTH}x${REEL_HEIGHT}:r=24:d=${seconds}`,
    "-loop","1","-framerate","24","-i",imagePath,
    "-filter_complex",filter,"-map","[out]",
    "-t",String(seconds),"-an","-c:v","libx264",
    "-preset","veryfast","-crf","24","-threads","2",
    "-pix_fmt","yuv420p","-movflags","+faststart",outputPath,
  ];
  try {
    await new Promise<void>((resolveDone,reject)=>{
      const child=spawn(process.env.HQ_FFMPEG_BINARY || "ffmpeg",args,{shell:false,stdio:["ignore","ignore","pipe"]});
      let stderr="";let done=false;
      const timer=setTimeout(()=>{child.kill("SIGKILL");},120_000);
      child.stderr.on("data",chunk=>{stderr=(stderr+chunk.toString()).slice(-1800);});
      child.once("error",err=>{if(!done){done=true;clearTimeout(timer);reject(err);}});
      child.once("close",code=>{if(done)return;done=true;clearTimeout(timer);
        if(code===0)resolveDone();else reject(new Error("FFMPEG_RENDER_FAILED:"+stderr.slice(-300)));});
    });
    const video=await readFile(outputPath);
    if(video.byteLength<1024 || video.subarray(4,8).toString("ascii")!=="ftyp")
      throw new Error("INVALID_REEL_OUTPUT");
    return { filename:input.outputFilename,bytes:video.byteLength,durationSeconds:seconds,
      width:REEL_WIDTH,height:REEL_HEIGHT };
  }finally {
    await rm(tempDir,{recursive:true,force:true});
  }
}
