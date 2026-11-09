import type { Metadata } from "next";
import Link from "next/link";
import { Archivo } from "next/font/google";
import PrinterGallery from "./components/landing/PrinterGallery";
import PrintingTicket from "./components/landing/PrintingTicket";
import styles from "./components/landing/landing.module.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const PRICE_PER_DAY = 250;
const DELIVERY_PRICE = 100;
const CONTACT_EMAIL = "alexis@anzieu.com";
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Location d'imprimante",
)}`;

export const metadata: Metadata = {
  title: "Flyprint, le photobooth qui imprime sur ticket",
  description: `Louez une imprimante thermique pour votre événement : chaque selfie de vos invités s'imprime en noir et blanc, avec votre logo. ${PRICE_PER_DAY} $ par jour, à récupérer près du métro Laurier à Montréal, ou livrée pour ${DELIVERY_PRICE} $ aller-retour.`,
};

const receiptItems = [
  "1 imprimante thermique",
  "500 impressions",
  "Location 24 heures",
  "Support technique",
];

const why = [
  {
    term: "Pas d'encre",
    text: "La tête d'impression chauffe directement le papier : aucune cartouche à acheter, à changer ou à voir se vider en pleine soirée.",
  },
  {
    term: "Une simple prise suffit",
    text: "Elle consomme très peu d'énergie. N'importe quelle prise de la salle fait l'affaire.",
  },
  {
    term: "Peu coûteux par photo",
    text: "Chaque impression revient bien moins cher qu'un tirage photo classique.",
  },
  {
    term: "Prête en quelques minutes",
    text: "Branchez-la, suivez le manuel, et elle est reliée à votre événement.",
  },
];

const steps = [
  {
    title: "Vous venez la chercher",
    text: `Choisissez votre date et récupérez l'imprimante à côté de la station de métro Laurier. Vous préférez qu'on vous la livre ? C'est ${DELIVERY_PRICE} $ aller-retour.`,
  },
  {
    title: "Vous la branchez",
    text: "Suivez le manuel, puis imprimez depuis le dashboard le QR code de votre événement. Posez-le près de l'imprimante.",
  },
  {
    title: "Vos invités scannent",
    text: "Rien à installer : un selfie, une légende si on veut, et le ticket sort en quelques secondes. Ils repartent avec.",
  },
  {
    title: "Vous la rapportez",
    text: "Après l'événement, ramenez-la au même endroit. Si vous avez pris la livraison, on passe la reprendre.",
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
              Louez une imprimante thermique pour votre événement. Vos invités
              prennent un selfie avec leur téléphone, et la photo sort sur
              ticket quelques secondes plus tard, en noir et blanc, avec votre
              logo en haut et votre message en bas.
            </p>
            <div className={styles.actions}>
              <a href={MAILTO} className={styles.primary}>
                Réserver par courriel
              </a>
              <p className={styles.price}>
                {PRICE_PER_DAY} $ par jour, à récupérer près du métro Laurier
              </p>
            </div>
          </div>

          <PrintingTicket displayFont={archivo.style.fontFamily} />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionIntro}>
            <h2 className={`${styles.display} ${styles.sectionTitle}`}>
              L&apos;imprimante en action
            </h2>
            <p>
              Les tickets sortent sur du papier de 80 mm, la largeur d&apos;un
              ticket de caisse, quelques secondes après chaque photo.
            </p>
          </div>
          <PrinterGallery />
        </section>

        <section className={`${styles.section} ${styles.band}`}>
          <div className={styles.offer}>
            <div>
              <h2 className={`${styles.display} ${styles.sectionTitle}`}>
                Une journée de location
              </h2>
              <div className={styles.receiptTilt}>
                <div className={styles.receipt}>
                  <p className={`${archivo.className} ${styles.receiptBrand}`}>
                    Flyprint
                  </p>
                  <p className={styles.receiptHeading}>Location imprimante</p>
                  <ul className={styles.receiptItems}>
                    {receiptItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className={styles.receiptTotal}>
                    <span>Total</span>
                    <span className={styles.receiptAmount}>
                      {PRICE_PER_DAY} $
                    </span>
                  </p>
                  <p className={styles.receiptSmall}>par jour</p>
                  <div className={styles.receiptExtra}>
                    <p>Retrait : métro Laurier</p>
                    <p className={styles.receiptLine}>
                      <span>Livraison A/R</span>
                      <span>+{DELIVERY_PRICE} $</span>
                    </p>
                    <p className={styles.receiptSmall}>en option</p>
                  </div>
                  <p className={styles.receiptThanks}>Merci !</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className={`${styles.display} ${styles.sectionTitle}`}>
                Pourquoi le papier thermique
              </h2>
              <dl className={styles.why}>
                {why.map((item) => (
                  <div key={item.term}>
                    <dt>{item.term}</dt>
                    <dd>{item.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="fonctionnement" className={styles.section}>
          <h2 className={`${styles.display} ${styles.sectionTitle}`}>
            Comment se passe la location
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

        <section className={`${styles.section} ${styles.band}`}>
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
            Nous avons peu d&apos;imprimantes. Réservez tôt.
          </h2>
          <p className={styles.lede}>
            Envoyez-nous la date et le lieu de votre événement, nous vous
            confirmerons la disponibilité par courriel.
          </p>
          <div className={styles.actions}>
            <a href={MAILTO} className={styles.primary}>
              Réserver par courriel
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>
          © {new Date().getFullYear()} Flyprint. Codé avec ❤ à Montréal.
        </span>
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
