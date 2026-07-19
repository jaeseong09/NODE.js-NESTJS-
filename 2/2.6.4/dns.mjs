import dns from "dns/promises";

const ip = await dns.lookup("gilbut.co.kr");
console.log("IP", ip);

const a = await dns.resolve("gilbut.co.kr", "A");
console.log("A", a);

const mx = await dns.resolve("gilbut.co.kr", "MX");
console.log("MX", mx);

const cname = await dns.resolve("www.gilbut.co.kr", "CNAME");
console.log("CNAME", cname);

try {
  const any = await dns.resolve("gilbut.co.kr", "ANY");
  console.log("ANY", any);
} catch (err) {
  console.log("ANY 조회 실패 (많은 DNS 서버가 ANY 쿼리를 더 이상 지원하지 않음):", err.code);
}
