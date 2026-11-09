import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";

export type Lang = "fr" | "en";

export const PRICE_PER_DAY = 250;
export const DELIVERY_PRICE = 100;
export const CONTACT_EMAIL = "alexis@anzieu.com";

export const LANG_PATHS: Record<Lang, string> = { fr: "/", en: "/en" };

// "250 $" in Quebec French, "$250" in English.
export function formatPrice(lang: Lang, amount: number) {
  return lang === "fr" ? `${amount} $` : `$${amount}`;
}

type Titled = { term: string; text: string };

export type TicketCopy = {
  captionLabel: string;
  defaultCaption: string;
  upload: string;
  note: string;
  formatError: string;
  canvasLabel: string;
};

export type GalleryCopy = {
  enlarge: string;
  close: string;
  alts: string[];
};

function build(lang: Lang) {
  const price = formatPrice(lang, PRICE_PER_DAY);
  const delivery = formatPrice(lang, DELIVERY_PRICE);

  if (lang === "en") {
    return {
      meta: {
        title: "Photobooth printer rental in Montreal | Flyprint",
        description: `Rent a thermal printer for your event in Montreal: your guests' selfies print on receipt paper, with your logo. ${price} per day.`,
        ogAlt: "Black-and-white photos printed on receipt paper, with the event's logo at the top",
      },
      switcherLabel: "Language",
      headline: ["Smile,", "it's", "printed."],
      lede: "Rent a thermal printer for your event in Montreal. Your guests take a selfie with their phone, and a few seconds later the photo comes out on a ticket, in black and white, with your logo at the top and your message at the bottom.",
      book: "Book by email",
      mailSubject: "Printer rental",
      priceNote: `${price} per day, pick up near Laurier metro`,
      galleryTitle: "The printer in action",
      galleryIntro:
        "Tickets come out on 80 mm paper, the width of a store receipt, a few seconds after each photo.",
      offerTitle: "One day of rental",
      receipt: {
        heading: "Printer rental",
        items: ["1 thermal printer", "500 prints", "24-hour rental", "Tech support"],
        total: "Total",
        perDay: "per day",
        pickup: "Pickup: Laurier metro",
        delivery: "Round-trip delivery",
        optional: "optional",
        thanks: "Thank you!",
      },
      whyTitle: "Why thermal paper",
      why: [
        {
          term: "No ink",
          text: "The print head heats the paper directly: no cartridge to buy, swap, or watch run dry in the middle of the party.",
        },
        {
          term: "Any outlet will do",
          text: "It draws very little power. Any outlet in the venue works.",
        },
        {
          term: "Cheap per photo",
          text: "Each print costs far less than a regular photo print.",
        },
        {
          term: "Ready in minutes",
          text: "Plug it in, follow the manual, and it's linked to your event.",
        },
      ] as Titled[],
      stepsTitle: "How the rental works",
      steps: [
        {
          term: "You pick it up",
          text: `Choose your date and pick up the printer next to Laurier metro station. Rather have it delivered? It's ${delivery} round trip.`,
        },
        {
          term: "You plug it in",
          text: "Follow the manual, then print your event's QR code from the dashboard. Put it next to the printer.",
        },
        {
          term: "Your guests scan it",
          text: "Nothing to install: a selfie, a caption if they want one, and the ticket comes out in seconds. They keep it.",
        },
        {
          term: "You bring it back",
          text: "After the event, return it to the same spot. If you chose delivery, we come and pick it up.",
        },
      ] as Titled[],
      settingsTitle: "What you control",
      settings: [
        { term: "Your logo", text: "At the top of every ticket, at the size you choose." },
        {
          term: "Your text lines",
          text: "A hashtag, a date, a thank-you: they print under every photo.",
        },
        { term: "The time", text: "Under the photo, or not at all." },
        {
          term: "One flybooth per event",
          text: "Each one has its own link, QR code and settings.",
        },
        {
          term: "Statistics",
          text: "How many photos were printed, and at what point in the night.",
        },
        {
          term: "Printer status",
          text: "The dashboard tells you whether it's online before your guests arrive.",
        },
      ] as Titled[],
      closingTitle: "We only have a few printers. Book early.",
      closingText:
        "Send us the date and place of your event, and we'll confirm availability by email.",
      footer: {
        madeIn: "Made with ❤ in Montreal.",
        dashboard: "Dashboard",
        manual: "Installation manual (in French)",
        source: "Source code",
      },
      ticket: {
        captionLabel: "Your caption",
        defaultCaption: "Happy birthday!",
        upload: "Print with my photo",
        note: "Your photo stays in your browser. Like on the real printer, accents are dropped.",
        formatError: "This format can't be opened in the browser. Try a JPEG or a PNG.",
        canvasLabel:
          "Printed ticket: event logo, black-and-white photo, caption and time",
      } as TicketCopy,
      gallery: {
        enlarge: "Enlarge photo:",
        close: "Close",
        alts: [
          "The printer on a lit-up bar counter, surrounded by prints",
          "The thermal printer, black with an orange trim, a ticket coming out",
          "Prints from a party in Montreal, with the organizers' logo at the top",
          "Prints lined up on each side of the printer",
        ],
      } as GalleryCopy,
    };
  }

  return {
    meta: {
      title: "Location de photobooth imprimante à Montréal | Flyprint",
      description: `Louez une imprimante thermique pour votre événement à Montréal : les selfies de vos invités s'impriment sur ticket, avec votre logo. ${price} par jour.`,
      ogAlt: "Des photos en noir et blanc imprimées sur ticket, avec le logo de l'événement en haut",
    },
    switcherLabel: "Langue",
    headline: ["Souriez,", "c'est", "imprimé."],
    lede: "Louez une imprimante thermique pour votre événement à Montréal. Vos invités prennent un selfie avec leur téléphone, et la photo sort sur ticket quelques secondes plus tard, en noir et blanc, avec votre logo en haut et votre message en bas.",
    book: "Réserver par courriel",
    mailSubject: "Location d'imprimante",
    priceNote: `${price} par jour, à récupérer près du métro Laurier`,
    galleryTitle: "L'imprimante en action",
    galleryIntro:
      "Les tickets sortent sur du papier de 80 mm, la largeur d'un ticket de caisse, quelques secondes après chaque photo.",
    offerTitle: "Une journée de location",
    receipt: {
      heading: "Location imprimante",
      items: [
        "1 imprimante thermique",
        "500 impressions",
        "Location 24 heures",
        "Support technique",
      ],
      total: "Total",
      perDay: "par jour",
      pickup: "Retrait : métro Laurier",
      delivery: "Livraison A/R",
      optional: "en option",
      thanks: "Merci !",
    },
    whyTitle: "Pourquoi le papier thermique",
    why: [
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
    ] as Titled[],
    stepsTitle: "Comment se passe la location",
    steps: [
      {
        term: "Vous venez la chercher",
        text: `Choisissez votre date et récupérez l'imprimante à côté de la station de métro Laurier. Vous préférez qu'on vous la livre ? C'est ${delivery} aller-retour.`,
      },
      {
        term: "Vous la branchez",
        text: "Suivez le manuel, puis imprimez depuis le dashboard le QR code de votre événement. Posez-le près de l'imprimante.",
      },
      {
        term: "Vos invités scannent",
        text: "Rien à installer : un selfie, une légende si on veut, et le ticket sort en quelques secondes. Ils repartent avec.",
      },
      {
        term: "Vous la rapportez",
        text: "Après l'événement, ramenez-la au même endroit. Si vous avez pris la livraison, on passe la reprendre.",
      },
    ] as Titled[],
    settingsTitle: "Ce que vous réglez",
    settings: [
      { term: "Votre logo", text: "En haut de chaque ticket, à la taille que vous choisissez." },
      {
        term: "Vos lignes de texte",
        text: "Un hashtag, une date, un merci : elles s'impriment sous chaque photo.",
      },
      { term: "L'heure", text: "Sous la photo, ou pas du tout." },
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
    ] as Titled[],
    closingTitle: "Nous avons peu d'imprimantes. Réservez tôt.",
    closingText:
      "Envoyez-nous la date et le lieu de votre événement, nous vous confirmerons la disponibilité par courriel.",
    footer: {
      madeIn: "Codé avec ❤ à Montréal.",
      dashboard: "Dashboard",
      manual: "Manuel d'installation",
      source: "Code source",
    },
    ticket: {
      captionLabel: "Votre légende",
      defaultCaption: "Joyeux anniversaire !",
      upload: "Imprimer avec ma photo",
      note: "Votre photo reste dans votre navigateur. Comme sur la vraie imprimante, les accents ne s'impriment pas.",
      formatError:
        "Ce format ne s'ouvre pas dans le navigateur. Essayez un JPEG ou un PNG.",
      canvasLabel:
        "Ticket imprimé : logo de l'événement, photo en noir et blanc, légende et heure",
    } as TicketCopy,
    gallery: {
      enlarge: "Agrandir la photo :",
      close: "Fermer",
      alts: [
        "L'imprimante sur un comptoir de bar illuminé, entourée d'impressions",
        "L'imprimante thermique, noire avec une bordure orange, un ticket qui sort",
        "Des impressions d'une soirée à Montréal, avec le logo des organisateurs en haut",
        "Des impressions alignées de chaque côté de l'imprimante",
      ],
    } as GalleryCopy,
  };
}

export const CONTENT = { fr: build("fr"), en: build("en") };

const OG_LOCALES: Record<Lang, string> = { fr: "fr_CA", en: "en_CA" };
const OTHER: Record<Lang, Lang> = { fr: "en", en: "fr" };

export function landingMetadata(lang: Lang): Metadata {
  const { meta } = CONTENT[lang];
  const image = { url: "/og.jpg", width: 1200, height: 630, alt: meta.ogAlt };
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: LANG_PATHS[lang],
      languages: {
        "fr-CA": LANG_PATHS.fr,
        "en-CA": LANG_PATHS.en,
        "x-default": LANG_PATHS.fr,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Flyprint",
      url: LANG_PATHS[lang],
      title: meta.title,
      description: meta.description,
      locale: OG_LOCALES[lang],
      alternateLocale: OG_LOCALES[OTHER[lang]],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image],
    },
  };
}

export const landingViewport: Viewport = {
  themeColor: "#ff7eb3",
};

// schema.org data so search engines understand the offer and its price.
export function landingJsonLd(lang: Lang) {
  const t = CONTENT[lang];
  const url = `${SITE_URL}${LANG_PATHS[lang] === "/" ? "/" : LANG_PATHS[lang]}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.receipt.heading,
    serviceType: t.receipt.heading,
    description: t.meta.description,
    url,
    image: `${SITE_URL}/og.jpg`,
    inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
    areaServed: { "@type": "City", name: "Montréal" },
    provider: { "@type": "Organization", name: "Flyprint", url: SITE_URL },
    offers: [
      {
        "@type": "Offer",
        name: t.receipt.heading,
        price: PRICE_PER_DAY,
        priceCurrency: "CAD",
        url,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: PRICE_PER_DAY,
          priceCurrency: "CAD",
          unitCode: "DAY",
        },
      },
      {
        "@type": "Offer",
        name: t.receipt.delivery,
        price: DELIVERY_PRICE,
        priceCurrency: "CAD",
        url,
      },
    ],
  };
}
