import Image from "next/image";
import { Analytics } from "@/components/Analytics";
import { LeadForm } from "@/components/LeadForm";
import { SiteHeader } from "@/components/SiteHeader";
import { getCases, getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const content = getSiteContent();
  const cases = getCases();

  return (
    <div className="editorial-home">
      <Analytics />
      <SiteHeader siteName={content.siteName} />
      <main id="top">
        <section className="editorial-hero" aria-labelledby="hero-title">
          <div className="editorial-hero-copy section-shell">
            <span className="eyebrow">{content.hero.eyebrow}</span>
            <h1 id="hero-title">{content.hero.title}</h1>
            <p>{content.hero.description}</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#cases">{content.hero.primaryCtaLabel}</a>
              <a className="button button-outline" href="#contact" data-event="contact_cta_click">
                {content.hero.secondaryCtaLabel}
              </a>
            </div>
          </div>

          <figure className="editorial-hero-media">
            <Image
              src="/labid-editorial-hero.png"
              alt="研究人员在自然光实验室中整理科研工作的场景"
              fill
              priority
              sizes="100vw"
            />
          </figure>
        </section>

        <section id="product" className="editorial-product section-shell">
          <div className="product-intro">
            <span>我们的方式</span>
            <h2>{content.product.title}</h2>
            <p>{content.product.description}</p>
          </div>
          <div className="editorial-values">
            {content.product.values.map((value, index) => (
              <article key={value.id}>
                <div className="value-number">0{index + 1}</div>
                <span>{value.label}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cases" className="cases-section">
          <div className="section-shell">
            <div className="editorial-section-heading">
              <div><span>{content.cases.eyebrow}</span><small>Selected work</small></div>
              <h2>{content.cases.title}</h2>
              <p>{content.cases.description}</p>
            </div>
            {cases.length ? (
              <div className="case-grid">
                {cases.map((item, index) => (
                  <a
                    className={`case-card case-${index + 1}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-event="case_view"
                    key={item.id}
                  >
                    <div className="case-image">
                      <Image
                        src={item.coverUrl}
                        alt={item.coverAlt}
                        fill
                        sizes="(max-width: 720px) 100vw, 60vw"
                        priority={index === 0}
                        unoptimized={item.coverUrl.startsWith("/api/media/")}
                      />
                      <span>打开案例</span>
                    </div>
                    <div className="case-meta">
                      <div><span>{item.discipline}</span><h3>{item.teamScale}</h3></div>
                      <p>{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : <p className="empty-state">案例正在整理中，欢迎稍后回来查看。</p>}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="section-shell contact-grid">
            <div className="contact-copy">
              <span className="eyebrow eyebrow-light">{content.contact.eyebrow}</span>
              <h2>{content.contact.title}</h2>
              <p>{content.contact.description}</p>
            </div>
            <div className="contact-body">
              {(content.contact.phone || content.contact.email) && (
                <div className="contact-details">
                  {content.contact.phone && <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a>}
                  {content.contact.email && <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>}
                </div>
              )}
              <LeadForm
                successText={content.contact.successText}
                responseSlaText={content.contact.responseSlaText}
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a className="brand footer-brand" href="#top" aria-label={`${content.siteName} 首页`}>
          <span className="brand-wordmark" aria-hidden="true"><Image src="/labid-wordmark.png" alt="" fill sizes="120px" /></span>
        </a>
        <p>© {new Date().getFullYear()} {content.footer.copyrightOwner}</p>
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">{content.footer.icp}</a>
      </footer>
    </div>
  );
}
