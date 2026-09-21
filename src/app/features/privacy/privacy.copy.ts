import { PortfolioLocale } from '../../core/domain/portfolio.models';

interface PrivacySection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly links?: readonly { label: string; href: string }[];
}

interface PrivacyCopy {
  readonly title: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly updated: string;
  readonly home: string;
  readonly homePath: string;
  readonly alternate: string;
  readonly alternatePath: string;
  readonly path: string;
  readonly skip: string;
  readonly navigation: string;
  readonly contents: string;
  readonly choices: string;
  readonly choicesUnavailable: string;
  readonly summary: readonly { title: string; detail: string }[];
  readonly sections: readonly PrivacySection[];
  readonly contact: string;
  readonly themeToLight: string;
  readonly themeToDark: string;
}

export const PRIVACY_COPY: Readonly<Record<PortfolioLocale, PrivacyCopy>> = {
  fr: {
    title: 'Confidentialité',
    description:
      'Comprendre les données utilisées sur ce portfolio et garder la main sur vos choix.',
    eyebrow: 'Vos données, vos choix',
    updated: 'Mise à jour : 21 septembre 2026',
    home: '← Portfolio',
    homePath: '/fr',
    alternate: 'Read in English',
    alternatePath: '/privacy',
    path: '/fr/confidentialite',
    skip: 'Aller au contenu',
    navigation: 'Navigation de la confidentialité',
    contents: 'Sur cette page',
    choices: 'Modifier mes choix de cookies',
    choicesUnavailable: 'La mesure d’audience n’est pas active sur cette version du site.',
    summary: [
      {
        title: 'La visite reste libre',
        detail: 'Refuser les statistiques ne bloque ni le CV ni l’assistant.',
      },
      {
        title: 'Les statistiques sont facultatives',
        detail: 'Google Analytics ne se charge qu’après votre accord.',
      },
      {
        title: 'Les échanges restent séparés',
        detail: 'Le texte des conversations et du formulaire n’est pas envoyé à Analytics.',
      },
    ],
    contact: 'Écrire à Vivien au sujet de mes données',
    themeToLight: 'Activer le thème clair',
    themeToDark: 'Activer le thème sombre',
    sections: [
      {
        id: 'responsable',
        title: 'Qui s’occupe de vos données ?',
        paragraphs: [
          'Vivien Billot est responsable des traitements réalisés pour ce portfolio professionnel. Pour toute question ou demande relative à vos données : billot.vivien@gmail.com.',
          'Le site permet de consulter mon parcours, télécharger mon CV, poser une question à l’assistant ou me contacter. Il ne comporte ni compte visiteur ni publicité ciblée.',
        ],
      },
      {
        id: 'statistiques',
        title: 'Visites et statistiques',
        paragraphs: [
          'Avec votre consentement, Google Analytics 4 mesure les pages consultées, les sessions, le temps d’engagement, les téléchargements du CV et les interactions avec les projets, les contacts et l’assistant. Il reçoit également des informations techniques sur le navigateur et l’appareil, ainsi qu’une localisation approximative.',
          'La mesure utilise des identifiants de cookies. Elle ne fournit pas le nom des visiteurs. Aucun nom, adresse email, numéro de téléphone ou texte de conversation saisi n’est envoyé volontairement à Analytics par le site. Les adresses de pages sont limitées aux pages publiques, sans paramètres libres ni fragments.',
          'Aucune balise Google Analytics n’est chargée avant votre choix ou lorsque vous refusez. Le stockage publicitaire, Google Signals et la personnalisation publicitaire sont désactivés dans l’intégration du site.',
          'Vous pouvez accepter ou refuser avec la même facilité, puis modifier votre choix à tout moment. Le retrait arrête la collecte, supprime les cookies Analytics accessibles au site et recharge la page. Il ne supprime pas automatiquement les données déjà transmises à Google.',
          'Votre choix et les cookies Analytics ont une durée maximale de 180 jours. Dans la propriété Google Analytics, les données d’événement sont conservées 2 mois et les données utilisateur 14 mois ; une nouvelle activité peut réinitialiser cette dernière durée. Ces réglages ne concernent pas la plupart des rapports standard agrégés et sont distincts de la durée des cookies dans votre navigateur.',
        ],
        links: [
          {
            label: 'Utilisation des données par Google sur les sites partenaires',
            href: 'https://policies.google.com/technologies/partner-sites?hl=fr',
          },
        ],
      },
      {
        id: 'assistant',
        title: 'Questions à l’assistant',
        paragraphs: [
          'Quand vous envoyez une question, son texte et les derniers messages utiles de la conversation passent par le serveur du site et peuvent être transmis à OpenAI pour produire la réponse. Une réponse fondée sur les informations du portfolio peut aussi être fournie sans appel à OpenAI.',
          'La conversation reste en mémoire dans la page pendant son utilisation ; le site ne l’enregistre pas dans une base de conversations. Recharger ou quitter cette page efface cet historique local. Évitez d’y partager des données sensibles ou des informations confidentielles sur vous ou sur d’autres personnes.',
          'La conservation des réponses dans l’API OpenAI est désactivée. Cela ne signifie pas une absence totale de conservation : OpenAI indique que des journaux de prévention des abus peuvent contenir des échanges et être conservés jusqu’à 30 jours par défaut, davantage dans certains cas de sécurité ou d’obligation légale.',
          'Ce traitement sert à répondre à la question que vous choisissez d’envoyer, sur le fondement de l’intérêt légitime à proposer une présentation interactive du parcours. Il est indépendant de votre choix concernant Analytics.',
        ],
        links: [
          {
            label: 'Politique de conservation des données de l’API OpenAI',
            href: 'https://developers.openai.com/api/docs/guides/your-data',
          },
        ],
      },
      {
        id: 'contact',
        title: 'Messages de contact',
        paragraphs: [
          'Les liens de contact ouvrent votre messagerie, votre application téléphonique ou LinkedIn. Le site ne reçoit pas le contenu de ces échanges. Les coordonnées et messages que vous choisissez ensuite de transmettre sont reçus par Vivien via le service utilisé.',
          'Les messages sont traités pour répondre à votre demande professionnelle et en assurer le suivi, sur le fondement de l’intérêt légitime à gérer ces échanges. Ils sont accessibles à Vivien et aux prestataires nécessaires à leur transmission et à leur hébergement.',
          'Lorsque le service d’envoi de formulaire est utilisé, le nom, l’adresse email et le message sont nécessaires à la transmission par Formspree ; l’envoi exige une confirmation. Ce service est distinct des liens de contact direct actuellement affichés sur le site.',
          'La messagerie et, lorsqu’il est utilisé, Formspree peuvent conserver une copie des échanges. La durée dépend du suivi de votre demande, des règles du prestataire et, le cas échéant, des obligations de conservation. Vous pouvez demander la suppression de vos échanges à l’adresse indiquée ci-dessous.',
        ],
        links: [
          {
            label: 'Confidentialité chez Formspree',
            href: 'https://formspree.io/legal/privacy-policy/',
          },
        ],
      },
      {
        id: 'fonctionnement',
        title: 'Fonctionnement et sécurité du site',
        paragraphs: [
          'Le site est hébergé par Google Firebase Hosting et Google Cloud Run. Le service applicatif Cloud Run est situé en Belgique. Les requêtes peuvent produire des journaux techniques contenant notamment l’adresse IP, l’adresse demandée, le navigateur, la date et le résultat de la requête.',
          'Les journaux applicatifs et de requêtes de ce projet Google Cloud sont conservés 30 jours. Les erreurs enregistrées par le code de l’application contiennent un type d’erreur et un code technique, sans texte de conversation ni contenu du formulaire.',
          'Une limitation temporaire des requêtes par adresse IP protège l’assistant et le formulaire contre les abus. Ces traitements reposent sur l’intérêt légitime à maintenir la disponibilité et la sécurité du site.',
          'Votre préférence de thème et votre choix de cookies sont enregistrés localement dans votre navigateur. Le thème reste mémorisé jusqu’à sa modification ou à l’effacement des données du site. Aucun compte ni suivi publicitaire n’est nécessaire pour ces préférences.',
        ],
        links: [
          {
            label: 'Protection des données dans Google Cloud',
            href: 'https://cloud.google.com/terms/cloud-privacy-notice',
          },
        ],
      },
      {
        id: 'prestataires',
        title: 'Prestataires et transferts',
        paragraphs: [
          'Google fournit l’hébergement et, si vous l’acceptez, les statistiques. OpenAI fournit les réponses générées de l’assistant. Formspree transmet les messages lorsque le service de formulaire est utilisé. Leurs services et sous-traitants peuvent traiter des données hors de l’Espace économique européen, notamment aux États-Unis.',
          'L’hébergement du serveur en Europe ne signifie donc pas que tous les traitements restent en Europe. Les conditions de transfert et garanties applicables sont décrites dans la documentation de chaque prestataire ; vous pouvez aussi demander des précisions à Vivien.',
          'Les liens vers LinkedIn, GitHub ou d’autres sites ouvrent des services externes qui appliquent leurs propres règles de confidentialité.',
        ],
      },
      {
        id: 'droits',
        title: 'Vos droits et votre contact',
        paragraphs: [
          'Selon la situation, vous pouvez demander l’accès, la rectification, l’effacement ou la limitation de vos données, vous opposer à un traitement ou demander leur portabilité. Vous pouvez retirer votre consentement aux statistiques à tout moment depuis le bouton de cette page.',
          'Écrivez à billot.vivien@gmail.com en précisant votre demande et les informations utiles pour retrouver l’échange concerné. Ne joignez pas de pièce d’identité spontanément. Les statistiques du site ne permettent pas d’identifier directement une personne à partir de son nom.',
          'Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL ou à votre autorité de contrôle compétente.',
        ],
        links: [
          {
            label: 'Exercer mes droits auprès de la CNIL',
            href: 'https://www.cnil.fr/fr/comprendre-mes-droits',
          },
        ],
      },
    ],
  },
  en: {
    title: 'Privacy',
    description: 'Understand how this portfolio uses data and stay in control of your choices.',
    eyebrow: 'Your data, your choices',
    updated: 'Updated: 21 September 2026',
    home: '← Portfolio',
    homePath: '/',
    alternate: 'Lire en français',
    alternatePath: '/fr/confidentialite',
    path: '/privacy',
    skip: 'Skip to content',
    navigation: 'Privacy navigation',
    contents: 'On this page',
    choices: 'Change my cookie choices',
    choicesUnavailable: 'Audience measurement is not active on this version of the site.',
    summary: [
      {
        title: 'Browsing stays available',
        detail: 'Rejecting statistics does not block the resume or the assistant.',
      },
      { title: 'Statistics are optional', detail: 'Google Analytics loads only after you accept.' },
      {
        title: 'Messages stay separate',
        detail: 'Chat and contact form text are not sent to Analytics.',
      },
    ],
    contact: 'Contact Vivien about my data',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    sections: [
      {
        id: 'responsable',
        title: 'Who is responsible for your data?',
        paragraphs: [
          'Vivien Billot is responsible for the processing carried out for this professional portfolio. For any question or request about your data, contact billot.vivien@gmail.com.',
          'This site lets you explore my background, download my resume, ask the assistant a question or contact me. It has no visitor account or targeted advertising.',
        ],
      },
      {
        id: 'statistiques',
        title: 'Visits and statistics',
        paragraphs: [
          'With your consent, Google Analytics 4 measures page views, sessions, engagement time, resume downloads and interactions with projects, contact links and the assistant. It also receives technical information about your browser and device, and an approximate location.',
          'Measurement uses cookie identifiers. It does not provide visitors’ names. The site does not intentionally send entered names, email addresses, phone numbers or chat text to Analytics. Page addresses are limited to public pages, without free-text parameters or fragments.',
          'No Google Analytics tag loads before your choice or when you reject. Advertising storage, Google Signals and advertising personalisation are disabled in the site integration.',
          'Accepting and rejecting are equally accessible, and you can change your choice at any time. Withdrawing stops collection, deletes Analytics cookies accessible to the site and reloads the page. It does not automatically erase data already sent to Google.',
          'Your choice and Analytics cookies have a maximum lifetime of 180 days. In the Google Analytics property, event data is kept for 2 months and user data for 14 months; new activity may reset the latter period. These settings do not apply to most aggregated standard reports and are separate from the lifetime of cookies in your browser.',
        ],
        links: [
          {
            label: 'How Google uses data from partner sites',
            href: 'https://policies.google.com/technologies/partner-sites?hl=en',
          },
        ],
      },
      {
        id: 'assistant',
        title: 'Questions to the assistant',
        paragraphs: [
          'When you send a question, its text and recent relevant conversation messages pass through the site server and may be sent to OpenAI to generate a reply. An answer based on portfolio information may also be provided without calling OpenAI.',
          'The conversation stays in page memory while you use it; the site does not save it in a conversation database. Reloading or leaving that page clears this local history. Avoid sharing sensitive data or confidential information about yourself or other people.',
          'Response storage in the OpenAI API is disabled. This does not mean that no data is retained: OpenAI states that abuse monitoring logs may contain exchanges and are kept for up to 30 days by default, or longer in certain security or legal circumstances.',
          'This processing answers the question you choose to send, based on the legitimate interest in presenting an interactive professional profile. It is independent of your Analytics choice.',
        ],
        links: [
          {
            label: 'OpenAI API data retention policy',
            href: 'https://developers.openai.com/api/docs/guides/your-data',
          },
        ],
      },
      {
        id: 'contact',
        title: 'Contact messages',
        paragraphs: [
          'Contact links open your email app, phone app or LinkedIn. The site does not receive the contents of those exchanges. The details and messages you then choose to send are received by Vivien through the service you use.',
          'Messages are processed to answer your professional enquiry and follow up on it, based on the legitimate interest in managing these exchanges. They are accessible to Vivien and the providers needed to deliver and host them.',
          'When the form delivery service is used, your name, email address and message are required for transmission through Formspree; sending requires confirmation. This service is separate from the direct contact links currently displayed on the site.',
          'The email service and, when used, Formspree may keep a copy of your exchanges. Retention depends on the follow-up to your enquiry, provider rules and any applicable retention obligations. You may request deletion using the contact address below.',
        ],
        links: [
          { label: 'Formspree privacy policy', href: 'https://formspree.io/legal/privacy-policy/' },
        ],
      },
      {
        id: 'fonctionnement',
        title: 'Site operation and security',
        paragraphs: [
          'The site is hosted by Google Firebase Hosting and Google Cloud Run. The Cloud Run application service is located in Belgium. Requests may produce technical logs that include the IP address, requested address, browser, time and request result.',
          'Application and request logs in this Google Cloud project are kept for 30 days. Errors recorded by the application code contain an error type and technical code, without chat text or contact form contents.',
          'Temporary request limits by IP address protect the assistant and contact form against abuse. These operations are based on the legitimate interest in keeping the site available and secure.',
          'Your theme preference and cookie choice are stored locally in your browser. The theme is remembered until you change it or clear the site data. These preferences require no account or advertising tracking.',
        ],
        links: [
          {
            label: 'Data protection in Google Cloud',
            href: 'https://cloud.google.com/terms/cloud-privacy-notice',
          },
        ],
      },
      {
        id: 'prestataires',
        title: 'Providers and transfers',
        paragraphs: [
          'Google provides hosting and, if you accept, statistics. OpenAI provides generated assistant replies. Formspree delivers messages when the form service is used. Their services and subprocessors may process data outside the European Economic Area, including in the United States.',
          'Hosting the server in Europe therefore does not mean that every operation stays in Europe. Each provider documents the applicable transfer terms and safeguards; you can also ask Vivien for more details.',
          'Links to LinkedIn, GitHub or other websites open external services with their own privacy rules.',
        ],
      },
      {
        id: 'droits',
        title: 'Your rights and contact',
        paragraphs: [
          'Depending on the circumstances, you may request access, correction, deletion or restriction of your data, object to processing or request data portability. You can withdraw consent to statistics at any time using the button on this page.',
          'Email billot.vivien@gmail.com with your request and details that help identify the relevant exchange. Do not send an identity document unless asked. Site statistics do not directly identify a person by name.',
          'If you believe your rights have not been respected, you may complain to the French data protection authority, the CNIL, or your competent supervisory authority.',
        ],
        links: [
          {
            label: 'Understand my rights with the CNIL',
            href: 'https://design.cnil.fr/en/concepts/exercising-rights/',
          },
        ],
      },
    ],
  },
};
