import type { Metadata } from "next";
import Link from "next/link";
import { Archivo } from "next/font/google";
import PrintingTicket from "./components/landing/PrintingTicket";
import styles from "./components/landing/landing.module.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flyprint, le photobooth qui imprime sur ticket",
  description:
    "Vos invités prennent un selfie avec leur téléphone, la photo sort en noir et blanc sur une imprimante thermique, avec votre logo.",
};

const steps = [
  {
    title: "Imprimez le QR code",
    text: "Depuis le dashboard, l'imprimante sort un ticket avec le QR code de votre événement. Posez-le près d'elle.",
  },
  {
    title: "Vos invités le scannent",
    text: "Rien à installer. La page s'ouvre dans le navigateur : un selfie, une légende si on veut.",
  },
  {
    title: "Le ticket sort",
    text: "La photo en noir et blanc, votre logo, la légende et l'heure. Ils repartent avec.",
  },
];

const settings = [
  {
    term: "Votre logo",
    text: "En haut de chaque ticket, à la taille que vous choisissez.",
  },
  {
    term: "Vos lignes de texte",
    text: "Un hashtag, une date, un merci : elles s'impriment sous chaque photo.",
  },
  {
    term: "L'heure",
    text: "Sous la photo, ou pas du tout.",
  },
  {
    term: "Un flybooth par événement",
    text: "Chacun a son lien, son QR code et ses réglages.",
  },
  {
    term: "Les statistiques",
    text: "Le nombre de photos imprimées, et à quel moment de la soirée.",
  },
  {
    term: "L'état de l'imprimante",
    text: "Le dashboard vous dit si elle est en ligne avant que les invités arrivent.",
  },
];

export default function LandingPage() {
  return (
    <div className={`${archivo.className} ${styles.page}`}>
      <header className={styles.bar}>
        <Link href="/" className={styles.wordmark}>
          Flyprint
        </Link>
        <Link href="/dashboard" className={styles.barLink}>
          Dashboard
        </Link>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={`${styles.display} ${styles.headline}`}>
              Souriez,
              <br />
              c&apos;est
              <br />
              imprimé.
            </h1>
            <p className={styles.lede}>
              Flyprint transforme une imprimante thermique en photobooth. Vos
              invités prennent un selfie avec leur téléphone, et la photo sort
              sur ticket, en noir et blanc, avec votre logo.
            </p>
            <div className={styles.actions}>
              <Link href="/dashboard" className={styles.primary}>
                Créer un flybooth
              </Link>
              <a href="#fonctionnement" className={styles.textLink}>
                Comment ça marche
              </a>
            </div>
          </div>

          <PrintingTicket displayFont={archivo.style.fontFamily} />
        </section>

        <section id="fonctionnement" className={styles.section}>
          <h2 className={`${styles.display} ${styles.sectionTitle}`}>
            Comment ça marche
          </h2>
          <ol className={styles.steps}>
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className={styles.stepNum} aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${styles.section} ${styles.settings}`}>
          <h2 className={`${styles.display} ${styles.sectionTitle}`}>
            Ce que vous réglez
          </h2>
          <dl className={styles.settingsGrid}>
            {settings.map((s) => (
              <div key={s.term}>
                <dt>{s.term}</dt>
                <dd>{s.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.closing}>
          <h2 className={`${styles.display} ${styles.closingTitle}`}>
            Branchez l&apos;imprimante, la soirée fait le reste.
          </h2>
          <div className={styles.actions}>
            <Link href="/dashboard" className={styles.primary}>
              Créer un flybooth
            </Link>
            <a href="/flybooth_manual_v1.pdf" className={styles.textLink}>
              Lire le manuel d&apos;installation
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Flyprint</span>
        <ul className={styles.footerLinks}>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <a href="/flybooth_manual_v1.pdf">Manuel d&apos;installation</a>
          </li>
          <li>
            <a
              href="https://github.com/AlexisAnzieu/flyprint"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code source
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
