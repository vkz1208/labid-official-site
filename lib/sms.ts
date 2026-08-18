import crypto from "node:crypto";
import type { LeadInput } from "@/lib/validation";

const percentEncode = (value: string) => encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
  `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
);

export async function sendLeadSms(lead: LeadInput, destination: string) {
  const accessKeyId = process.env.ALIYUN_SMS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIYUN_SMS_ACCESS_KEY_SECRET;
  const signName = process.env.ALIYUN_SMS_NOTIFICATION_SIGN_NAME;
  const templateCode = process.env.ALIYUN_SMS_NOTIFICATION_TEMPLATE_CODE;
  if (!accessKeyId || !accessKeySecret || !signName || !templateCode) {
    throw new Error("Aliyun SMS notification configuration is incomplete");
  }

  const parameters: Record<string, string> = {
    AccessKeyId: accessKeyId,
    Action: "SendSms",
    Format: "JSON",
    PhoneNumbers: destination,
    RegionId: process.env.ALIYUN_SMS_REGION_ID || "cn-hangzhou",
    SignName: signName,
    SignatureMethod: "HMAC-SHA1",
    SignatureNonce: crypto.randomUUID(),
    SignatureVersion: "1.0",
    TemplateCode: templateCode,
    TemplateParam: JSON.stringify({
      school: lead.school.slice(0, 20),
      name: lead.name.slice(0, 12),
      contact: lead.contact.slice(0, 30),
    }),
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    Version: "2017-05-25",
  };
  const canonical = Object.keys(parameters).sort().map((key) => `${percentEncode(key)}=${percentEncode(parameters[key])}`).join("&");
  const stringToSign = `POST&%2F&${percentEncode(canonical)}`;
  parameters.Signature = crypto.createHmac("sha1", `${accessKeySecret}&`).update(stringToSign).digest("base64");
  const body = Object.keys(parameters).sort().map((key) => `${percentEncode(key)}=${percentEncode(parameters[key])}`).join("&");
  const response = await fetch("https://dysmsapi.aliyuncs.com/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(10_000),
  });
  const result = await response.json() as { Code?: string; Message?: string; RequestId?: string };
  if (!response.ok || result.Code !== "OK") throw new Error(`Aliyun SMS failed: ${result.Code || response.status} ${result.Message || ""}`.trim());
  return { requestId: result.RequestId || "" };
}
