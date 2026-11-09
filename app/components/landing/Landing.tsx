import Link from "next/link";
import { Archivo } from "next/font/google";
import PrinterGallery from "./PrinterGallery";
import PrintingTicket from "./PrintingTicket";
import {
  CONTACT_EMAIL,
  CONTENT,
  DELIVERY_PRICE,
  LANG_PATHS,
  PRICE_PER_DAY,
  formatPrice,
  landingJsonLd,
  type Lang,
} from "./content";
import styles from "./landing.module.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const LANG_NAMES: Record<Lang, { short: string; full: string }> = {
  fr: { short: "FR", full: "Français" },
  en: { short: "EN", full: "English" },
};

export default function Landing({ lang }: { lang: Lang }) {
  const t = CONTENT[lang];
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    t.mailSubject,
  )}`;

  return (
    <div lang={lang} className={`${archivo.className} ${styles.page}`}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from our own constants, "<" escaped.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(landingJsonLd(lang)).replace(/</g, "\\u003c"),
        }}
      />
      <header className={styles.bar}>
        <Link href={LANG_PATHS[lang]} className={styles.wordmark}>
          Flyprint
        </Link>
        <div className={styles.barEnd}>
          <nav aria-label={t.switcherLabel} className={styles.switcher}>
            {(Object.keys(LANG_NAMES) as Lang[]).map((code) => (
              <Link
                key={code}
                href={LANG_PATHS[code]}
                lang={code}
                hrefLang={code}
                aria-label={LANG_NAMES[code].full}
                aria-current={code === lang ? "page" : undefined}
              >
                {LANG_NAMES[code].short}
              </Link>
            ))}
          </nav>
          <Link href="/dashboard" prefetch={false} className={styles.barLink}>
            {t.footer.dashboard}
          </Link>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={`${styles.display} ${styles.headline}`}>
              {t.headline.map((line, i) => (
                <span key={line}>
                  {i > 0 && (
                    <>
                      {" "}
                      <br />
                    </>
                  )}
                  {line}
                </span>
              ))}
            </h1>
            <p className={styles.lede}>{t.lede}</p>
            <div className={styles.actions}>
              <a href={mailto} className={styles.primary}>
                {t.book}
              </a>
              <p className={styles.price}>{t.priceNote}</p>
            </div>
          </div>

          <PrintingTicket
            key={lang}
            displayFont={archivo.style.fontFamily}
            copy={t.ticket}
          />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionIntro}>
            <h2 className={`${styles.display} ${styles.sectionTitle}`}>
              {t.galleryTitle}
            </h2>
            <p>{t.galleryIntro}</p>
          </div>
          <PrinterGallery copy={t.gallery} />
        </section>

        <section className={`${styles.section} ${styles.band}`}>
          <div className={styles.offer}>
            <div>
              <h2 className={`${styles.display} ${styles.sectionTitle}`}>
                {t.offerTitle}
              </h2>
              <div className={styles.receiptTilt}>
                <div className={styles.receipt}>
                  <p className={`${archivo.className} ${styles.receiptBrand}`}>
                    Flyprint
                  </p>
                  <p className={styles.receiptHeading}>{t.receipt.heading}</p>
                  <ul className={styles.receiptItems}>
                    {t.receipt.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className={styles.receiptTotal}>
                    <span>{t.receipt.total}</span>
                    <span className={styles.receiptAmount}>
                      {formatPrice(lang, PRICE_PER_DAY)}
                    </span>
                  </p>
                  <p className={styles.receiptSmall}>{t.receipt.perDay}</p>
                  <div className={styles.receiptExtra}>
                    <p>{t.receipt.pickup}</p>
                    <p className={styles.receiptLine}>
                      <span>{t.receipt.delivery}</span>
                      <span>+{formatPrice(lang, DELIVERY_PRICE)}</span>
                    </p>
                    <p className={styles.receiptSmall}>{t.receipt.optional}</p>
                  </div>
                  <p className={styles.receiptThanks}>{t.receipt.thanks}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className={`${styles.display} ${styles.sectionTitle}`}>
                {t.whyTitle}
              </h2>
              <dl className={styles.why}>
                {t.why.map((item) => (
                  <div key={item.term}>
                    <dt>{item.term}</dt>
                    <dd>{item.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={`${styles.display} ${styles.sectionTitle}`}>
            {t.stepsTitle}
          </h2>
          <ol className={styles.steps}>
            {t.steps.map((step, i) => (
              <li key={step.term}>
                <span className={styles.stepNum} aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className={styles.stepTitle}>{step.term}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${styles.section} ${styles.band}`}>
          <h2 className={`${styles.display} ${styles.sectionTitle}`}>
            {t.settingsTitle}
          </h2>
          <dl className={styles.settingsGrid}>
            {t.settings.map((s) => (
              <div key={s.term}>
                <dt>{s.term}</dt>
                <dd>{s.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.closing}>
          <h2 className={`${styles.display} ${styles.closingTitle}`}>
            {t.closingTitle}
          </h2>
          <p className={styles.lede}>{t.closingText}</p>
          <div className={styles.actions}>
            <a href={mailto} className={styles.primary}>
              {t.book}
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} Flyprint. {t.footer.madeIn}
        </span>
        <ul className={styles.footerLinks}>
          <li>
            <Link href="/dashboard" prefetch={false}>{t.footer.dashboard}</Link>
          </li>
          <li>
            <a href="/flybooth_manual_v1.pdf" hrefLang="fr">
              {t.footer.manual}
            </a>
          </li>
          <li>
            <a
              href="https://github.com/AlexisAnzieu/flyprint"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.footer.source}
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
