import type { SiteContent } from "@/lib/types";

export const defaultSiteContent: SiteContent = {
  siteName: "LabID",
  hero: {
    eyebrow: "AI-native academic identity",
    title: "让每一项研究，\n成为清晰的学术叙事",
    description:
      "LabID 为高校 PI 与研究团队打造专属学术主页。AI 理解公开科研工作、梳理研究脉络，团队通过所见即所得的后台持续更新。",
    primaryCtaLabel: "查看案例",
    secondaryCtaLabel: "咨询 LabID",
  },
  product: {
    eyebrow: "From research to identity",
    title: "不是把成果搬上网页，而是把研究讲清楚",
    description:
      "AI 负责理解与组织科研信息，研究者保留最终判断。更少的材料准备，更完整的研究表达。",
    values: [
      {
        id: "discover",
        label: "识别",
        title: "从公开科研工作开始",
        description: "无需先整理厚重材料。LabID 围绕公开论文与科研信息，建立可确认的内容底稿。",
      },
      {
        id: "narrate",
        label: "组织",
        title: "把成果连接成研究脉络",
        description: "不止陈列论文，而是呈现方向之间的关系、问题的演进，以及团队持续推进的科研叙事。",
      },
      {
        id: "maintain",
        label: "更新",
        title: "交付之后，仍然持续生长",
        description: "在所见即所得的管理后台中编辑、预览和发布，让主页始终跟上团队的新成果。",
      },
    ],
  },
  cases: {
    eyebrow: "Selected demos",
    title: "不同学科，同样清楚的表达",
    description: "三个虚拟案例展示 LabID 如何适配不同研究领域与团队规模，实际展现效果以及图片风格可根据团队具体要求定制。",
  },
  contact: {
    eyebrow: "Start a conversation",
    title: "让团队的研究，被更准确地看见",
    description: "告诉我们你的团队与当前需求，我们会基于实际情况与你讨论主页方案。",
    phone: "",
    email: "",
    responseSlaText: "提交后，LabID 官方将在 48 小时内与您联系。",
    successText: "信息已提交。LabID 官方将在 48 小时内与您联系。",
  },
  footer: {
    icp: "粤 ICP 备 2026073823 号",
    copyrightOwner: "深圳市深瞻科技有限公司",
  },
};

export const defaultCases = [
  {
    discipline: "生命科学",
    teamScale: "大型研究团队",
    description: "多方向协作下的研究版图与团队结构",
    coverUrl: "/case-life.png",
    coverAlt: "生命科学大型研究团队学术主页预览",
    url: "https://demo-life.labid.cn/",
    sortOrder: 1,
  },
  {
    discipline: "化学",
    teamScale: "中型课题组",
    description: "围绕核心问题展开的成果关系与研究方法",
    coverUrl: "/case-chem.png",
    coverAlt: "化学中型课题组学术主页预览",
    url: "https://demo-chem.labid.cn/",
    sortOrder: 2,
  },
  {
    discipline: "材料学",
    teamScale: "小型课题组",
    description: "聚焦研究方向、代表成果与成员协作",
    coverUrl: "/case-materials.png",
    coverAlt: "材料学小型课题组学术主页预览",
    url: "https://demo-materials.labid.cn/",
    sortOrder: 3,
  },
];
