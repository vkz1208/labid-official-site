export type MediaAsset = {
  url: string;
  alt: string;
};

export type SiteContent = {
  siteName: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    media?: MediaAsset;
  };
  product: {
    eyebrow: string;
    title: string;
    description: string;
    values: Array<{ id: string; label: string; title: string; description: string }>;
  };
  cases: { eyebrow: string; title: string; description: string };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    phone: string;
    email: string;
    responseSlaText: string;
    successText: string;
  };
  footer: { icp: string; copyrightOwner: string };
};

export type DemoCase = {
  id: number;
  discipline: string;
  teamScale: string;
  description: string;
  coverUrl: string;
  coverAlt: string;
  url: string;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Lead = {
  id: number;
  school: string;
  department: string;
  name: string;
  contact: string;
  message: string;
  status: "new" | "contacted" | "closed";
  source: string;
  emailStatus: "pending" | "sent" | "failed";
  emailAttempts: number;
  lastEmailError: string;
  createdAt: string;
  updatedAt: string;
};

export type AuditLog = {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  detail: string;
  createdAt: string;
};
