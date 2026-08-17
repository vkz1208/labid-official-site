import { z } from "zod";

const cleanText = (min: number, max: number, label: string) =>
  z.string().trim().min(min, `${label}不能为空`).max(max, `${label}过长`);

export const leadSchema = z.object({
  school: cleanText(1, 100, "学校"),
  department: cleanText(1, 100, "院系"),
  name: cleanText(2, 50, "姓名"),
  contact: cleanText(1, 100, "联系方式"),
  message: cleanText(5, 2000, "留言"),
  website: z.string().max(0, "请求未通过验证").optional().default(""),
  submissionKey: z.string().uuid("提交标识无效"),
  source: z.string().max(500).optional().default("/"),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
