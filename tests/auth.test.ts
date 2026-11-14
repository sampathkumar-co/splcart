import {afterEach, beforeEach, describe,expect,it} from "vitest";
import {authConfigured,checkOwnerCredentials,issueSession,isLocalTestMode,sessionCookieOptions,validateSession} from "../lib/auth";
const mutableEnv = process.env as Record<string,string|undefined>;
const variables=["HQ_SESSION_SECRET","OWNER_USERNAME","OWNER_PASSWORD","HQ_PUBLIC_ORIGIN","HQ_TEST_MODE","NODE_ENV"] as const;
const originals=Object.fromEntries(variables.map(key=>[key,process.env[key]])) as Record<string,string|undefined>;
beforeEach(()=>{
 mutableEnv.OWNER_USERNAME="ci-owner";
 mutableEnv.OWNER_PASSWORD="ci-own-password-very-long";
 mutableEnv.HQ_SESSION_SECRET="ci-unit-only-an-unpredictable-signing-secret-over-32-bytes";
 mutableEnv.NODE_ENV="test";
 mutableEnv.HQ_TEST_MODE="1";
 mutableEnv.HQ_PUBLIC_ORIGIN="http://127.0.0.1:3000";
});
afterEach(()=>{for(const k of variables){if(originals[k]===undefined)delete mutableEnv[k];else mutableEnv[k]=originals[k];}});
describe("private owner HMAC session",()=>{
 it("requires real owner config and won't accept placeholder secrets",()=>{
   expect(authConfigured()).toBe(true);
   mutableEnv.HQ_SESSION_SECRET="short";
   expect(authConfigured()).toBe(false);
   expect(validateSession("bogus")).toBe(false);
   mutableEnv.HQ_SESSION_SECRET="REPLACE_WITH_AT_LEAST_32_RANDOM_CHARACTERS";
   expect(authConfigured()).toBe(false);
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
   mutableEnv.OWNER_USERNAME="a-different-account";
   expect(validateSession(cookie,now)).toBe(false);
 });
 it("cannot enable insecure CI mode on a non-local real hostname",()=>{
   mutableEnv.NODE_ENV="production";
   mutableEnv.HQ_TEST_MODE="1";
   mutableEnv.HQ_PUBLIC_ORIGIN="https://hq.example.org";
   expect(isLocalTestMode()).toBe(false);
   expect(sessionCookieOptions().secure).toBe(true);
   mutableEnv.HQ_PUBLIC_ORIGIN="http://127.0.0.1:3000";
   expect(isLocalTestMode()).toBe(true);
   expect(sessionCookieOptions().secure).toBe(false);
 });
 it("requires HTTPS public origin for real production",()=>{
   mutableEnv.NODE_ENV="production";
   delete mutableEnv.HQ_TEST_MODE;
   mutableEnv.HQ_PUBLIC_ORIGIN="http://127.0.0.1:3000";
   expect(authConfigured()).toBe(false);
   mutableEnv.HQ_PUBLIC_ORIGIN="https://headquarters.example.org";
   expect(authConfigured()).toBe(true);
   expect(sessionCookieOptions()).toMatchObject({httpOnly:true,secure:true,sameSite:"strict",path:"/"});
 });
});
