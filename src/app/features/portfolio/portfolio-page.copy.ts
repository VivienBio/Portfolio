import { PortfolioLocale } from '../../core/domain/portfolio.models';

interface NavigationItem {
  readonly label: string;
  /** Section identifier on the home page, shared by both languages. */
  readonly fragment: string;
}

interface Mission {
  readonly title: string;
  readonly description: string;
  /** Where this kind of work was already done, so the offer is backed by facts. */
  readonly proof: string;
}

interface Recommendation {
  /** Verbatim excerpt of a public LinkedIn recommendation, or a faithful translation of one. */
  readonly quote: string;
  readonly name: string;
  readonly role: string;
  readonly translated?: boolean;
}

interface PageCopy {
  readonly skipToContent: string;
  /** Screen-reader context appended to the visible brand name and title. */
  readonly homeHint: string;
  readonly navigationLabel: string;
  readonly navigation: readonly NavigationItem[];
  /** Name of the button that opens the navigation on small screens. */
  readonly menu: string;
  readonly availability: string;
  readonly headerActionsLabel: string;
  readonly language: {
    readonly current: string;
    readonly target: string;
    readonly href: string;
    /** Screen-reader context placed before the visible current language. */
    readonly currentHint: string;
    /** Screen-reader context placed after the visible target language. */
    readonly switchHint: string;
  };
  readonly cv: {
    readonly label: string;
    readonly href: string;
    readonly fileName: string;
    /** Screen-reader context placed after the visible label. */
    readonly hint: string;
  };
  readonly theme: { readonly light: string; readonly dark: string };
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly lead: string;
    readonly primaryAction: string;
    readonly secondaryAction: string;
    readonly proof: readonly string[];
  };
  readonly metricsLabel: string;
  readonly metrics: readonly { readonly value: string; readonly label: string }[];
  readonly missions: {
    readonly title: string;
    readonly intro: string;
    readonly proofLabel: string;
    readonly items: readonly Mission[];
    readonly practicalTitle: string;
    readonly practical: readonly { readonly label: string; readonly value: string }[];
    readonly emailAction: string;
    readonly emailHref: string;
  };
  readonly work: {
    readonly title: string;
    readonly intro: string;
    readonly openCase: string;
    readonly flagships: readonly {
      readonly kicker: string;
      readonly title: string;
      readonly summary: string;
      readonly path: string;
    }[];
    readonly earlierTitle: string;
    readonly compact: readonly {
      readonly company: string;
      readonly period: string;
      readonly role: string;
      readonly summary: string;
      readonly tags: readonly string[];
    }[];
    readonly technologies: string;
    readonly internships: { readonly period: string; readonly text: string };
    readonly cvAction: string;
  };
  readonly approach: {
    readonly title: string;
    readonly intro: string;
    readonly expertiseTitle: string;
    readonly technologies: string;
    readonly principlesTitle: string;
    readonly principlesIntro: string;
    readonly principles: readonly { readonly title: string; readonly description: string }[];
    readonly styleTitle: string;
    readonly strengthsTitle: string;
    readonly vigilanceTitle: string;
    readonly safeguard: string;
  };
  readonly recommendations: {
    readonly title: string;
    readonly intro: string;
    readonly openQuote: string;
    readonly closeQuote: string;
    readonly translated: string;
    readonly items: readonly Recommendation[];
    readonly action: string;
  };
  readonly projects: {
    readonly title: string;
    readonly intro: string;
    readonly learningTitle: string;
    readonly learningDescription: string;
    readonly certificationsLabel: string;
  };
  readonly contact: {
    readonly title: string;
    readonly description: string;
    readonly emailAction: string;
    readonly phoneAction: string;
    readonly phoneDisplay: string;
  };
  readonly footer: {
    readonly availability: string;
    readonly directoryLabel: string;
    readonly cvFr: string;
    readonly cvEn: string;
    readonly cvFrAriaLabel: string;
    readonly cvEnAriaLabel: string;
    readonly top: string;
    readonly rights: string;
  };
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
}

export const PORTFOLIO_PAGE_COPY: Record<PortfolioLocale, PageCopy> = {
  en: {
    skipToContent: 'Skip to content',
    homeHint: ', home',
    navigationLabel: 'Primary navigation',
    navigation: [
      { label: 'Services', fragment: 'missions' },
      { label: 'Work', fragment: 'work' },
      { label: 'Approach', fragment: 'approche' },
      { label: 'Contact', fragment: 'contact' },
    ],
    menu: 'Menu',
    availability: 'Open to discussing what’s next',
    headerActionsLabel: 'Quick actions',
    language: {
      current: 'EN',
      target: 'FR',
      href: '/fr',
      currentHint: 'Current language: ',
      switchHint: ' — switch to the French version',
    },
    cv: {
      label: 'Resume PDF',
      href: '/assets/CV-Vivien-Billot-EN.pdf',
      fileName: 'CV-Vivien-Billot-EN.pdf',
      hint: ' — download Vivien Billot’s English resume',
    },
    theme: { light: 'Switch to light theme', dark: 'Switch to dark theme' },
    hero: {
      eyebrow: 'Freelance Senior Software Engineer & Tech Lead · C# / .NET',
      title: 'Systems where wrong answers',
      accent: 'are expensive.',
      lead: 'Since 2012, I’ve designed and modernized critical systems: real-time pricing at Betclic, advertising at TF1 — France’s largest private broadcaster — and regulated medical software at Stago.',
      primaryAction: 'Read the case studies',
      secondaryAction: 'Let’s talk',
      proof: [
        'C# / .NET',
        'Distributed systems',
        'AWS & Azure',
        'Real-time pricing',
        'Legacy modernization',
        'Technical leadership',
      ],
    },
    metricsLabel: 'Key results',
    metrics: [
      {
        value: '14+',
        label: 'years of engineering, from regulated medical software to real-time pricing',
      },
      { value: '11', label: 'projects shipped to production while leading three teams at TF1' },
      { value: '500+', label: 'rental branches served by platforms my team built at Rent A Car' },
      { value: '5', label: 'teams led across TF1, Rent A Car, and Stago' },
    ],
    missions: {
      title: 'Services',
      intro: 'Three kinds of engagement, each backed by systems I have run in production.',
      proofLabel: 'Track record:',
      items: [
        {
          title: 'Tech Lead for .NET teams',
          description:
            'Taking technical ownership of one or more teams: architecture direction, priorities, delivery quality, and skills growth.',
          proof: 'three teams at TF1, nine people at Rent A Car, eight in R&D at Stago.',
        },
        {
          title: 'Legacy modernization',
          description:
            'Evolving an aging system without stopping the business: map what exists, lock the business rules in tests, migrate step by step.',
          proof: 'VB6-era legacy moved to .NET 6/8, Angular, Azure, and AKS at TF1.',
        },
        {
          title: 'Critical, real-time systems',
          description:
            'Designing or hardening a system where a mistake is expensive: explicit business rules, observability, and replay to explain every decision.',
          proof: 'real-time sports pricing at Betclic, patient-results calculation at Stago.',
        },
      ],
      practicalTitle: 'In practice',
      practical: [
        { label: 'Status', value: 'Freelance, on a mission with Betclic since October 2025' },
        { label: 'Location', value: 'Paris region, France' },
        { label: 'Languages', value: 'French (native), English (professional)' },
        {
          label: 'To start',
          value: 'An email with the context, the expected duration, and the preferred start date.',
        },
      ],
      emailAction: 'Propose a mission',
      emailHref: 'mailto:billot.vivien@gmail.com?subject=Mission%20proposal',
    },
    work: {
      title: 'Work',
      intro: 'Two in-depth case studies, then the rest of the career in brief.',
      openCase: 'Read the case study',
      flagships: [
        {
          kicker: 'Betclic Group · Since Oct 2025',
          title: 'Real-time sports odds, priced in-house',
          summary:
            'Working on the pricing chain that turns Monte Carlo simulations into live betting odds — where every market decision hits the P&L directly.',
          path: '/work/betclic',
        },
        {
          kicker: 'TF1 Group · Feb 2022–Oct 2025 · Tech Lead of three teams',
          title: 'Modernizing a broadcaster’s ad platform without stopping it',
          summary:
            'Led the redesign of TF1’s advertising platform: 11 projects shipped to production, a VB6-era stack retired step by step, and three teams that got stronger along the way.',
          path: '/work/tf1',
        },
      ],
      earlierTitle: 'Earlier roles',
      compact: [
        {
          company: 'Rent A Car',
          period: '2017–2021',
          role: 'Senior Developer → Tech Lead / Technical Manager',
          summary:
            'Built the digital rental journey for a 500+ branch network: microservices, dynamic pricing, high-traffic e-commerce, and Easy Péage — announced as Europe’s first in-vehicle toll payment for rental cars. Grew from senior developer to technical manager of a nine-person team.',
          tags: ['C#', '.NET Core', 'Angular', 'Microservices', 'AWS', 'Docker', 'PostgreSQL'],
        },
        {
          company: 'Stago',
          period: '2012–2017',
          role: 'R&D Project Lead → R&D Team Lead',
          summary:
            'Designed the C# framework that computes patient results on in-vitro diagnostic instruments — a regulated environment where an approximation is a defect. Led an eight-person R&D team; refactored critical modules with TDD; structured continuous integration and requirements traceability.',
          tags: ['C#', 'WPF', 'TDD', 'NUnit', 'TeamCity', 'IBM Rational DOORS'],
        },
      ],
      technologies: 'Technologies',
      internships: {
        period: '2011–2012',
        text: 'Internships: C++ / C# developer at Bentley Systems, VB.NET developer at Total.',
      },
      cvAction: 'Full career in the resume (PDF)',
    },
    approach: {
      title: 'Approach',
      intro: 'What I know how to do, how I make decisions, and what I keep in check.',
      expertiseTitle: 'Expertise',
      technologies: 'Technologies',
      principlesTitle: 'Engineering principles',
      principlesIntro:
        'What I bring to a design review — and what I drop when the evidence goes against it.',
      principles: [
        {
          title: 'Simplicity before sophistication',
          description:
            'The best architecture is the simplest one that survives the requirements. Sophistication has to be earned by the problem.',
        },
        {
          title: 'Architecture follows the problem',
          description:
            'DDD, hexagonal, CQRS, microservices: I use them where the domain justifies them — and argue against them where it doesn’t.',
        },
        {
          title: 'Tests are a design tool',
          description:
            'I start from expected behavior. Tests that lock in business rules buy the freedom to refactor everything else.',
        },
        {
          title: 'Observability is a design concern',
          description:
            'A system I can’t explain in production isn’t done. Tracing, replay, and actionable signals are part of the architecture, not an afterthought.',
        },
        {
          title: 'Evolution over perfection',
          description:
            'I optimize for systems that are easy to change. A decision that keeps options open beats a perfect answer that closes them.',
        },
        {
          title: 'Trade-offs, stated out loud',
          description:
            'Every significant decision is written down with its alternatives and its cost. Teams align on reasoning, not on authority.',
        },
      ],
      styleTitle: 'Working with me',
      strengthsTitle: 'What you gain',
      vigilanceTitle: 'What I watch',
      safeguard: 'My safeguard:',
    },
    recommendations: {
      title: 'Recommendations',
      intro: 'Excerpts from public recommendations on LinkedIn.',
      openQuote: '“',
      closeQuote: '”',
      translated: 'Translated from French',
      items: [
        {
          quote:
            'Vivien is incredibly reliable under pressure and technically sound, always able to propose solutions with a clear, long-term vision.',
          name: 'Apoorva Deshmukh',
          role: 'Product at Unlimitail, worked with Vivien on the same team',
        },
        {
          quote:
            'Hard-working, committed and always focused on modernization, Vivien has that rare ability to get back to the essence of the need: he knows how to simplify, clarify and focus efforts on what really adds value.',
          name: 'Arnaud Pradeilles',
          role: 'Solution architect, worked with Vivien at TF1',
          translated: true,
        },
        {
          quote:
            'He was an exceptional leader and mentor, both technically and on a human level. […] he helps the people around him grow.',
          name: 'Vince Gusmini',
          role: '.NET developer on Vivien’s team at Rent A Car',
          translated: true,
        },
      ],
      action: 'Read all recommendations on LinkedIn',
    },
    projects: {
      title: 'Public code & learning',
      intro:
        'Each project isolates one practice — domain modeling, TDD, algorithmic optimization — so the reasoning is easy to follow.',
      learningTitle: 'Education & training',
      learningDescription:
        'Engineering degree from ESILV (scientific computing), exchange at Université Laval. I keep the fundamentals sharp through deliberate practice: DDD training with Julien Topçu, SAFe RTE certification, security and observability training — and competitive programming on CodinGame, where I rank in the world’s top 0.1% (Grand Master).',
      certificationsLabel: 'Training and certifications',
    },
    contact: {
      title: 'A system to modernize, or a team to lead?',
      description:
        'Freelance Senior Software Engineer, currently on contract with Betclic Group. If you’re facing a system that must not fail, a legacy that has to move, or a team that needs to speed up — I’d like to hear about it.',
      emailAction: 'Email Vivien',
      phoneAction: 'Call Vivien Billot at +33 6 23 85 77 32',
      phoneDisplay: '+33 6 23 85 77 32',
    },
    footer: {
      availability: 'Open to discussing what’s next',
      directoryLabel: 'Contact details and useful links',
      cvFr: 'French resume',
      cvEn: 'English resume',
      cvFrAriaLabel: 'Download Vivien Billot’s French resume as a PDF',
      cvEnAriaLabel: 'Download Vivien Billot’s English resume as a PDF',
      top: 'Back to top',
      rights: 'All rights reserved',
    },
    seo: {
      title: 'Vivien Billot — Freelance Senior Software Engineer (.NET)',
      description:
        'Freelance Senior Software Engineer & Tech Lead: real-time sports pricing at Betclic, TF1 ad platform modernization, medical software. C#/.NET, AWS, Azure.',
    },
  },
  fr: {
    skipToContent: 'Aller au contenu',
    homeHint: ', accueil',
    navigationLabel: 'Navigation principale',
    navigation: [
      { label: 'Missions', fragment: 'missions' },
      { label: 'Réalisations', fragment: 'work' },
      { label: 'Approche', fragment: 'approche' },
      { label: 'Contact', fragment: 'contact' },
    ],
    menu: 'Menu',
    availability: 'Ouvert à la discussion',
    headerActionsLabel: 'Actions rapides',
    language: {
      current: 'FR',
      target: 'EN',
      href: '/',
      currentHint: 'Version actuelle : ',
      switchHint: ' — passer à la version anglaise',
    },
    cv: {
      label: 'CV PDF',
      href: '/assets/CV-Vivien-Billot-FR.pdf',
      fileName: 'CV-Vivien-Billot-FR.pdf',
      hint: ' — télécharger le CV français de Vivien Billot',
    },
    theme: { light: 'Activer le thème clair', dark: 'Activer le thème sombre' },
    hero: {
      eyebrow: 'Senior Software Engineer & Tech Lead freelance · C# / .NET',
      title: 'Des systèmes où l’erreur',
      accent: 'coûte cher.',
      lead: 'Depuis 2012, je conçois et modernise des systèmes critiques : pricing temps réel chez Betclic, SI publicitaire de TF1 et logiciel médical réglementé chez Stago.',
      primaryAction: 'Lire les études de cas',
      secondaryAction: 'Parlons-en',
      proof: [
        'C# / .NET',
        'Systèmes distribués',
        'AWS & Azure',
        'Pricing temps réel',
        'Modernisation legacy',
        'Leadership technique',
      ],
    },
    metricsLabel: 'Résultats clés',
    metrics: [
      { value: '14+', label: 'années d’ingénierie, du médical réglementé au pricing temps réel' },
      { value: '11', label: 'projets mis en production en encadrant trois équipes chez TF1' },
      { value: '500+', label: 'agences servies par les plateformes construites chez Rent A Car' },
      { value: '5', label: 'équipes encadrées chez TF1, Rent A Car et Stago' },
    ],
    missions: {
      title: 'Missions',
      intro:
        'Trois types de missions, chacune adossée à des systèmes que j’ai fait tourner en production.',
      proofLabel: 'Déjà fait :',
      items: [
        {
          title: 'Tech Lead d’équipes .NET',
          description:
            'Prendre la responsabilité technique d’une ou plusieurs équipes : cap d’architecture, priorités, qualité du delivery et montée en compétence.',
          proof: 'trois équipes chez TF1, neuf personnes chez Rent A Car, huit en R&D chez Stago.',
        },
        {
          title: 'Modernisation de legacy',
          description:
            'Faire évoluer un système ancien sans arrêter le business : cartographier l’existant, verrouiller les règles métier par les tests, migrer pas à pas.',
          proof: 'legacy VB6 migré vers .NET 6/8, Angular, Azure et AKS chez TF1.',
        },
        {
          title: 'Systèmes critiques et temps réel',
          description:
            'Concevoir ou fiabiliser un système où une erreur coûte cher : règles métier explicites, observabilité et replay pour expliquer chaque décision.',
          proof:
            'pricing sportif temps réel chez Betclic, calcul des résultats patients chez Stago.',
        },
      ],
      practicalTitle: 'En pratique',
      practical: [
        { label: 'Statut', value: 'Freelance, en mission chez Betclic depuis octobre 2025' },
        { label: 'Localisation', value: 'Île-de-France' },
        { label: 'Langues', value: 'Français (natif), anglais (professionnel)' },
        {
          label: 'Pour démarrer',
          value: 'Un email avec le contexte, la durée envisagée et la date de démarrage souhaitée.',
        },
      ],
      emailAction: 'Proposer une mission',
      emailHref: 'mailto:billot.vivien@gmail.com?subject=Proposition%20de%20mission',
    },
    work: {
      title: 'Réalisations',
      intro: 'Deux études de cas détaillées, puis le reste du parcours en bref.',
      openCase: 'Lire l’étude de cas',
      flagships: [
        {
          kicker: 'Betclic Group · Depuis octobre 2025',
          title: 'Des cotes sportives temps réel, produites en interne',
          summary:
            'Contribuer à la chaîne de pricing qui transforme des simulations Monte-Carlo en cotes live — où chaque décision de marché impacte directement le P&L.',
          path: '/fr/work/betclic',
        },
        {
          kicker: 'Groupe TF1 · Février 2022–octobre 2025 · Tech Lead de trois équipes',
          title: 'Moderniser le SI publicitaire d’un diffuseur sans l’arrêter',
          summary:
            'Piloter la refonte de bout en bout : 11 projets mis en production, un legacy VB6 remplacé pas à pas, et trois équipes qui en sont sorties plus fortes.',
          path: '/fr/work/tf1',
        },
      ],
      earlierTitle: 'Auparavant',
      compact: [
        {
          company: 'Rent A Car',
          period: '2017–2021',
          role: 'Développeur senior → Tech Lead / Responsable technique',
          summary:
            'Construire le parcours de location digital d’un réseau de plus de 500 agences : microservices, pricing dynamique, e-commerce à fort trafic et Easy Péage — annoncé comme le premier paiement de péage embarqué d’Europe pour la location. De développeur senior à responsable technique d’une équipe de neuf personnes.',
          tags: ['C#', '.NET Core', 'Angular', 'Microservices', 'AWS', 'Docker', 'PostgreSQL'],
        },
        {
          company: 'Stago',
          period: '2012–2017',
          role: 'Responsable d’étude → Responsable d’équipe R&D',
          summary:
            'Concevoir le framework C# qui calcule les résultats patients sur des automates de diagnostic in vitro — un environnement réglementé où une approximation est un défaut. Encadrer une équipe R&D de huit personnes ; refactorer les modules critiques avec TDD et structurer l’intégration continue et la traçabilité des exigences.',
          tags: ['C#', 'WPF', 'TDD', 'NUnit', 'TeamCity', 'IBM Rational DOORS'],
        },
      ],
      technologies: 'Technologies',
      internships: {
        period: '2011–2012',
        text: 'Stages : développeur C++ / C# chez Bentley Systems, développeur VB.NET chez Total.',
      },
      cvAction: 'Parcours complet dans le CV (PDF)',
    },
    approach: {
      title: 'Approche',
      intro: 'Ce que je sais faire, comment je décide, et ce que je surveille chez moi.',
      expertiseTitle: 'Expertise',
      technologies: 'Technologies',
      principlesTitle: 'Principes d’ingénierie',
      principlesIntro:
        'Ce que j’apporte en revue de conception — et ce que j’abandonne quand les faits me donnent tort.',
      principles: [
        {
          title: 'La simplicité avant la sophistication',
          description:
            'La meilleure architecture est la plus simple qui survive aux exigences. La sophistication doit être méritée par le problème.',
        },
        {
          title: 'L’architecture suit le problème',
          description:
            'DDD, hexagonale, CQRS, microservices : je les utilise quand le domaine les justifie — et je plaide contre quand ce n’est pas le cas.',
        },
        {
          title: 'Les tests sont un outil de conception',
          description:
            'Je pars du comportement attendu. Des tests qui verrouillent les règles métier achètent la liberté de refactorer tout le reste.',
        },
        {
          title: 'L’observabilité se conçoit dès le départ',
          description:
            'Un système que je ne peux pas expliquer en production n’est pas terminé. Traçage, replay et signaux actionnables font partie de l’architecture ; ils ne s’ajoutent pas après coup.',
        },
        {
          title: 'L’évolution plutôt que la perfection',
          description:
            'J’optimise pour des systèmes faciles à changer. Une décision qui garde les options ouvertes bat une réponse parfaite qui les ferme.',
        },
        {
          title: 'Des compromis énoncés à voix haute',
          description:
            'Chaque décision significative est écrite avec ses alternatives et son coût. Les équipes s’alignent sur le raisonnement, pas sur l’autorité.',
        },
      ],
      styleTitle: 'Travailler avec moi',
      strengthsTitle: 'Ce que vous obtenez',
      vigilanceTitle: 'Ce que je surveille',
      safeguard: 'Mon garde-fou :',
    },
    recommendations: {
      title: 'Recommandations',
      intro: 'Extraits de recommandations publiques sur LinkedIn.',
      openQuote: '« ',
      closeQuote: ' »',
      translated: 'Traduit de l’anglais',
      items: [
        {
          quote:
            'Vivien a démontré une capacité exceptionnelle à gérer les situations complexes, lors d’incident critique, y compris sur des domaines en dehors de son périmètre. Il a toujours su garder son calme et nous guider vers des solutions efficaces.',
          name: 'Lydie Monnet',
          role: 'PMO, Groupe TF1',
        },
        {
          quote:
            'Bosseur, impliqué et toujours orienté vers la modernisation, Vivien a cette capacité rare à revenir à la quintessence du besoin : il sait simplifier, clarifier et concentrer les efforts sur ce qui apporte réellement de la valeur.',
          name: 'Arnaud Pradeilles',
          role: 'Architecte solution, a travaillé avec Vivien chez TF1',
        },
        {
          quote:
            'Il a été un leader et mentor exceptionnel tant techniquement que humainement. […] il fait grandir les personnes autour de lui.',
          name: 'Vince Gusmini',
          role: 'Développeur .NET dans l’équipe de Vivien chez Rent A Car',
        },
      ],
      action: 'Lire toutes les recommandations sur LinkedIn',
    },
    projects: {
      title: 'Code public et formation',
      intro:
        'Chaque projet isole une pratique — modélisation de domaine, TDD, optimisation algorithmique — pour que le raisonnement reste lisible.',
      learningTitle: 'Formation',
      learningDescription:
        'Ingénieur ESILV (calcul scientifique), échange à l’Université Laval. J’entretiens les fondamentaux par la pratique délibérée : formation DDD avec Julien Topçu, certification SAFe RTE, sécurité et observabilité — et la programmation compétitive sur CodinGame, où je suis dans le top 0,1 % mondial (Grand Maître).',
      certificationsLabel: 'Formations et certifications',
    },
    contact: {
      title: 'Un système à moderniser, ou une équipe à faire grandir ?',
      description:
        'Senior Software Engineer freelance, actuellement en mission chez Betclic Group. Un système qui ne doit pas tomber, un legacy qui doit bouger, une équipe qui doit accélérer — j’aimerais en entendre parler.',
      emailAction: 'Envoyer un email',
      phoneAction: 'Appeler Vivien Billot au 06 23 85 77 32',
      phoneDisplay: '06 23 85 77 32',
    },
    footer: {
      availability: 'Ouvert à la discussion',
      directoryLabel: 'Coordonnées et liens utiles',
      cvFr: 'CV français',
      cvEn: 'CV anglais',
      cvFrAriaLabel: 'Télécharger le CV français de Vivien Billot au format PDF',
      cvEnAriaLabel: 'Télécharger le CV anglais de Vivien Billot au format PDF',
      top: 'Retour en haut',
      rights: 'Tous droits réservés',
    },
    seo: {
      title: 'Vivien Billot — Senior Software Engineer .NET freelance',
      description:
        'Senior Software Engineer & Tech Lead freelance : pricing sportif temps réel chez Betclic, modernisation du SI publicitaire de TF1. C#/.NET, AWS, Azure.',
    },
  },
};
