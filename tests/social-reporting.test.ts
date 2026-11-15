import {describe,expect,it} from "vitest";
import {normalizeSocialPost,validateMetricCounts} from "../lib/social-reporting";
describe("independent social reporting without platform API access",()=>{
 it("allows only official public Reel/Short URL shapes",()=>{
  expect(normalizeSocialPost("INSTAGRAM","https://www.instagram.com/reel/CIfixture001/?igsh=example"))
    .toBe("https://www.instagram.com/reel/CIfixture001/");
  expect(normalizeSocialPost("YOUTUBE","https://www.youtube.com/shorts/CIexample00a"))
    .toBe("https://www.youtube.com/shorts/CIexample00a");
  expect(()=>normalizeSocialPost("INSTAGRAM","https://instagram.com/login")).toThrow("INVALID_SOCIAL_POST_LINK");
  expect(()=>normalizeSocialPost("YOUTUBE","https://evil.youtube.com/shorts/CIexample00a")).toThrow("INVALID_SOCIAL_POST_LINK");
  expect(()=>normalizeSocialPost("INSTAGRAM","http://www.instagram.com/reel/CIfixture001/")).toThrow("INVALID_SOCIAL_POST_LINK");
  expect(()=>normalizeSocialPost("INSTAGRAM","https://api.splcart.in/reel/CIfixture001/")).toThrow("INVALID_SOCIAL_POST_LINK");
 });
 it("does not invent metrics or accept negative/unsafe numbers",()=>{
  expect(validateMetricCounts({views:0,likes:null,enquiries:null})).toBe(true);
  expect(validateMetricCounts({views:1234,likes:45,enquiries:3})).toBe(true);
  expect(()=>validateMetricCounts({})).toThrow("INVALID_OWNER_METRICS");
  expect(()=>validateMetricCounts({likes:-1})).toThrow("INVALID_OWNER_METRICS");
  expect(()=>validateMetricCounts({views:1_000_000_001})).toThrow("INVALID_OWNER_METRICS");
 });
});
