import {afterEach, beforeEach, describe,expect,it} from "vitest";
import {authConfigured,checkOwnerCredentials,issueSession,sessionCookieOptions,validateSession} from "../lib/auth";
const variables=["HQ_SESSION_SECRET","OWNER_USERNAME","OWNER_PASSWORD","HQ_PUBLIC_ORIGIN","HQ_TEST_MODE","NODE_ENV"] as const;
const originals=Object.fromEntries(variables.map(key=>[key,process.env[key]])) as Record<string,string|undefined>;
beforeEach(()=>{
 process.env.OWNER_USERNAME="ci-owner";
 process.env.OWNER_PASSWORD="ci-own-password-very-long";
 process.env.HQ_SESSION_SECRET="ci-unit-only-an-unpredictable-signing-secret-over-32-bytes";
 process.env.NODE_ENV="test";
 process.env.HQ_TEST_MODE="1";
 process.env.HQ_PUBLIC_ORIGIN="http://127.0.0.1:3000";
});
afterEach(()=>{for(const k of variables){if(originals[k]===undefined)delete process.env[k];else process.env[k]=originals[k];}});
describe("private owner HMAC session",()=>{
 it("requires real owner config and won't accept placeholder secrets",()=>{
   expect(authConfigured()).toBe(true);
   process.env.HQ_SESSION_SECRET="short";
   expect(authConfigured()).toBe(false);
   expect(validateSession("bogus")).toBe(false);
 });
 it("authenticates one owner without accepting partial, wrong or near passwords",()=>{
   expect(checkOwnerCredentials("ci-owner","ci-own-password-very-long")).toBe(true);
   expect(checkOwnerCredentials("ci-owner","ci-own-password-very-lon")).toBe(false);
   expect(checkOwnerCredentials("other-owner","ci-own-password-very-long")).toBe(false);
 });
 it("checks session signature, account and expiry",()=>{
   const now=Date.parse("2026-11-14T12:00:00Z");
   const cookie=issueSession(now);
   expect(validateSession(cookie,now+1000)).toBe(true);
   expect(validateSession(cookie,now+8*3600000+1)).toBe(false);
   const [body,mac]=cookie.split(".");
   expect(validateSession(body+"."+mac.slice(0,-1)+"a",now)).toBe(false);
   process.env.OWNER_USERNAME="a-different-account";
   expect(validateSession(cookie,now)).toBe(false);
 });
 it("requires HTTPS public origin for real production",()=>{
   process.env.NODE_ENV="production";
   delete process.env.HQ_TEST_MODE;
   process.env.HQ_PUBLIC_ORIGIN="http://127.0.0.1:3000";
   expect(authConfigured()).toBe(false);
   process.env.HQ_PUBLIC_ORIGIN="https://headquarters.example.org";
   expect(authConfigured()).toBe(true);
   expect(sessionCookieOptions()).toMatchObject({httpOnly:true,secure:true,sameSite:"strict",path:"/"});
 });
});
