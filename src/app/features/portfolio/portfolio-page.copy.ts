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

interface CareerStep {
  readonly year: string;
  readonly company: string;
  readonly role: string;
  readonly summary?: string;
  /** Present for the roles that have a full case study. */
  readonly caseStudy?: { readonly path: string; readonly label: string };
  /** The current mission is marked with the signal colour. */
  readonly current?: boolean;
}

/** A public case study, linked from the hero. */
interface CaseStudyLink {
  /** Client and period, as stated on the CV. */
  readonly meta: string;
  readonly title: string;
  readonly path: string;
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
    readonly status: string;
    readonly title: string;
    readonly lead: string;
    readonly primaryAction: string;
    readonly secondaryAction: string;
    readonly caseStudiesTitle: string;
    readonly caseStudies: readonly CaseStudyLink[];
  };
  readonly missions: {
    readonly title: string;
    readonly intro: string;
    readonly proofLabel: string;
    readonly items: readonly Mission[];
    readonly practicalLabel: string;
    readonly practical: readonly { readonly label: string; readonly value: string }[];
    readonly emailAction: string;
    readonly emailHref: string;
  };
  readonly career: {
    readonly title: string;
    readonly intro: string;
    readonly steps: readonly CareerStep[];
    readonly cvAction: string;
  };
  readonly approach: {
    readonly title: string;
    readonly intro: string;
    readonly principles: readonly { readonly title: string; readonly description: string }[];
    readonly stackTitle: string;
    readonly vigilanceTitle: string;
    readonly vigilanceIntro: string;
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
    readonly learningTitle: string;
    readonly learningDescription: string;
    readonly certificationsTitle: string;
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
      { label: 'Career', fragment: 'work' },
      { label: 'Approach', fragment: 'approche' },
      { label: 'Recommendations', fragment: 'recommandations' },
      { label: 'Contact', fragment: 'contact' },
    ],
    menu: 'Menu',
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
      status: 'Freelance, on a mission with Betclic since October 2025',
      title: 'Systems where wrong answers are expensive.',
      lead: 'Freelance Senior Software Engineer and Tech Lead in C# / .NET. Since 2012: real-time sports pricing at Betclic, advertising at TF1 — France’s largest private broadcaster — and regulated medical software at Stago.',
      primaryAction: 'Propose a mission',
      secondaryAction: 'See my career',
      caseStudiesTitle: 'Case studies',
      caseStudies: [
        {
          meta: 'Betclic Group, since October 2025',
          title: 'Real-time sports odds, priced in-house',
          path: '/work/betclic',
        },
        {
          meta: 'TF1 Group, 2022 to 2025',
          title: 'Modernizing a broadcaster’s ad platform without stopping it',
          path: '/work/tf1',
        },
      ],
    },
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
      practicalLabel: 'Working together',
      practical: [
        { label: 'Status', value: 'Freelance, on a mission with Betclic since October 2025' },
        { label: 'Location', value: 'Paris region, France; hybrid or remote' },
        { label: 'Languages', value: 'French (native), English (professional)' },
        {
          label: 'To start',
          value: 'An email with the context, the expected duration, and the preferred start date',
        },
      ],
      emailAction: 'Propose a mission',
      emailHref: 'mailto:billot.vivien@gmail.com?subject=Mission%20proposal',
    },
    career: {
      title: 'Career',
      intro: 'Most recent first. The first two roles each have a full case study.',
      steps: [
        {
          year: '2025',
          company: 'Betclic Group',
          role: 'Senior Software Engineer (.NET / Kafka / AWS), freelance, since October 2025',
          summary:
            'A proprietary sports-pricing chain: taking the quants’ models to production, a real-time C# / .NET engine with Kafka and gRPC, and a deterministic capture and replay framework.',
          caseStudy: {
            path: '/work/betclic',
            label: 'Case study: real-time sports odds, priced in-house',
          },
          current: true,
        },
        {
          year: '2022',
          company: 'TF1 Group',
          role: 'Tech Lead Full Stack (.NET / Angular), freelance, February 2022 to October 2025',
          summary:
            'Three teams redesigning the advertising platform without stopping it: 11 projects shipped to production, and a VB6-era legacy replaced step by step with .NET 6/8, Angular, Azure, and AKS.',
          caseStudy: {
            path: '/work/tf1',
            label: 'Case study: modernizing a broadcaster’s ad platform without stopping it',
          },
        },
        {
          year: '2017',
          company: 'Rent A Car',
          role: 'Senior Developer Full Stack, then Tech Lead Full Stack (.NET / Angular) of a nine-person team',
          summary:
            'The digital rental journey for a network of 500+ branches: microservices, dynamic pricing, and Easy Péage, announced as Europe’s first in-vehicle toll payment for rental cars.',
        },
        {
          year: '2012',
          company: 'Stago',
          role: 'Software Engineer (C# / .NET), then Team Lead & Scrum Master (C# / WPF) of an eight-person team',
          summary:
            'The C# framework that computes patient results on in-vitro diagnostic instruments, in a regulated environment, with TDD and requirements traceability.',
        },
        {
          year: '2011',
          company: 'Internships',
          role: 'Software Developer (C++ / C#) at Bentley Systems, Software Developer (.NET) at Total',
        },
      ],
      cvAction: 'Full career in the resume (PDF)',
    },
    approach: {
      title: 'Approach',
      intro:
        'The principles I bring to a design review, and drop when the evidence goes against them.',
      principles: [
        {
          title: 'Simplicity before sophistication',
          description:
            'The best architecture is the simplest one that survives the requirements. Sophistication has to be earned by the problem.',
        },
        {
          title: 'Architecture follows the problem',
          description:
            'DDD, hexagonal, CQRS, microservices: I use them where the domain justifies them, and argue against them where it doesn’t.',
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
      stackTitle: 'Stack',
      vigilanceTitle: 'What I keep in check',
      vigilanceIntro: 'Strengths come with failure modes. Mine, and the safeguard I use for each.',
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
      title: 'Public code',
      learningTitle: 'Education',
      learningDescription:
        'Engineering degree from ESILV (scientific computing), exchange at Université Laval. CodinGame Grand Master, in the world’s top 0.1%.',
      certificationsTitle: 'Training and certifications',
    },
    contact: {
      title: 'A system to modernize, or a team to lead?',
      description:
        'A system that must not fail, a legacy that has to move, a team that needs to speed up: I’d like to hear about it.',
      emailAction: 'Propose a mission',
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
      { label: 'Parcours', fragment: 'work' },
      { label: 'Approche', fragment: 'approche' },
      { label: 'Recommandations', fragment: 'recommandations' },
      { label: 'Contact', fragment: 'contact' },
    ],
    menu: 'Menu',
    headerActionsLabel: 'Actions rapides',
    language: {
      current: 'FR',
      target: 'EN',
      href: '/',
      currentHint: 'Version actuelle : ',
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
      status: 'Freelance, en mission chez Betclic depuis octobre 2025',
      title: 'Des systèmes où l’erreur coûte cher.',
      lead: 'Senior Software Engineer et Tech Lead freelance en C# / .NET. Depuis 2012 : pricing sportif temps réel chez Betclic, SI publicitaire de TF1, logiciel médical réglementé chez Stago.',
      primaryAction: 'Proposer une mission',
      secondaryAction: 'Voir le parcours',
      caseStudiesTitle: 'Études de cas',
      caseStudies: [
        {
          meta: 'Betclic Group, depuis octobre 2025',
          title: 'Des cotes sportives temps réel, produites en interne',
          path: '/fr/work/betclic',
        },
        {
          meta: 'Groupe TF1, de 2022 à 2025',
          title: 'Moderniser le SI publicitaire d’un diffuseur sans l’arrêter',
          path: '/fr/work/tf1',
        },
      ],
    },
    missions: {
      title: 'Missions',
      intro:
        'Trois types de missions, chacune adossée à des systèmes que j’ai fait tourner en production.',
      proofLabel: 'Déjà fait :',
      items: [
        {
          title: 'Tech Lead d’équipes .NET',
          description:
            'Prendre la responsabilité technique d’une ou plusieurs équipes : cap d’architecture, priorités, qualité du delivery et montée en compétence.',
          proof: 'trois équipes chez TF1, neuf personnes chez Rent A Car, huit en R&D chez Stago.',
        },
        {
          title: 'Modernisation de legacy',
          description:
            'Faire évoluer un système ancien sans arrêter le business : cartographier l’existant, verrouiller les règles métier par les tests, migrer pas à pas.',
          proof: 'legacy VB6 migré vers .NET 6/8, Angular, Azure et AKS chez TF1.',
        },
        {
          title: 'Systèmes critiques et temps réel',
          description:
            'Concevoir ou fiabiliser un système où une erreur coûte cher : règles métier explicites, observabilité et rejeu pour expliquer chaque décision.',
          proof:
            'pricing sportif temps réel chez Betclic, calcul des résultats patients chez Stago.',
        },
      ],
      practicalLabel: 'Travailler ensemble',
      practical: [
        { label: 'Statut', value: 'Freelance, en mission chez Betclic depuis octobre 2025' },
        { label: 'Localisation', value: 'Île-de-France, en hybride ou en télétravail' },
        { label: 'Langues', value: 'Français (natif), anglais (professionnel)' },
        {
          label: 'Pour démarrer',
          value: 'Un email avec le contexte, la durée envisagée et la date de démarrage souhaitée',
        },
      ],
      emailAction: 'Proposer une mission',
      emailHref: 'mailto:billot.vivien@gmail.com?subject=Proposition%20de%20mission',
    },
    career: {
      title: 'Parcours',
      intro:
        'Du plus récent au plus ancien. Les deux premières étapes ont chacune leur étude de cas.',
      steps: [
        {
          year: '2025',
          company: 'Betclic Group',
          role: 'Senior Software Engineer (.NET / Kafka / AWS), freelance, depuis octobre 2025',
          summary:
            'Chaîne de pricing sportif propriétaire : mise en production des modèles des quants, moteur temps réel C# / .NET avec Kafka et gRPC, framework de capture et de rejeu déterministe.',
          caseStudy: {
            path: '/fr/work/betclic',
            label: 'Étude de cas : des cotes sportives temps réel, produites en interne',
          },
          current: true,
        },
        {
          year: '2022',
          company: 'Groupe TF1',
          role: 'Tech Lead Full Stack (.NET / Angular), freelance, de février 2022 à octobre 2025',
          summary:
            'Trois équipes pour refondre le SI publicitaire sans l’arrêter : 11 projets mis en production, un legacy VB6 remplacé pas à pas par .NET 6/8, Angular, Azure et AKS.',
          caseStudy: {
            path: '/fr/work/tf1',
            label: 'Étude de cas : moderniser le SI publicitaire d’un diffuseur sans l’arrêter',
          },
        },
        {
          year: '2017',
          company: 'Rent A Car',
          role: 'Senior Developer Full Stack, puis Tech Lead Full Stack (.NET / Angular) d’une équipe de neuf personnes',
          summary:
            'Le parcours de location digital d’un réseau de plus de 500 agences : microservices, pricing dynamique et Easy Péage, annoncé comme le premier paiement de péage embarqué d’Europe pour la location.',
        },
        {
          year: '2012',
          company: 'Stago',
          role: 'Software Engineer (C# / .NET), puis Team Lead & Scrum Master (C# / WPF) d’une équipe de huit personnes',
          summary:
            'Le framework C# qui calcule les résultats patients sur des automates de diagnostic in vitro, en environnement réglementé, avec TDD et traçabilité des exigences.',
        },
        {
          year: '2011',
          company: 'Stages',
          role: 'Software Developer (C++ / C#) chez Bentley Systems, Software Developer (.NET) chez Total',
        },
      ],
      cvAction: 'Parcours complet dans le CV (PDF)',
    },
    approach: {
      title: 'Approche',
      intro:
        'Les principes que je défends en revue de conception, et que j’abandonne quand les faits me donnent tort.',
      principles: [
        {
          title: 'La simplicité avant la sophistication',
          description:
            'La meilleure architecture est la plus simple qui survive aux exigences. La sophistication doit être méritée par le problème.',
        },
        {
          title: 'L’architecture suit le problème',
          description:
            'DDD, hexagonale, CQRS, microservices : je les utilise quand le domaine les justifie, et je plaide contre quand ce n’est pas le cas.',
        },
        {
          title: 'Les tests sont un outil de conception',
          description:
            'Je pars du comportement attendu. Des tests qui verrouillent les règles métier achètent la liberté de refactorer tout le reste.',
        },
        {
          title: 'L’observabilité se conçoit dès le départ',
          description:
            'Un système que je ne peux pas expliquer en production n’est pas terminé. Traçage, rejeu et signaux actionnables font partie de l’architecture ; ils ne s’ajoutent pas après coup.',
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
      stackTitle: 'Stack',
      vigilanceTitle: 'Ce que je surveille chez moi',
      vigilanceIntro: 'Les forces ont leurs revers. Voici les miens, et le garde-fou de chacun.',
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
            'Bosseur, impliqué et toujours orienté vers la modernisation, Vivien a cette capacité rare à revenir à la quintessence du besoin : il sait simplifier, clarifier et concentrer les efforts sur ce qui apporte réellement de la valeur.',
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
      title: 'Code public',
      learningTitle: 'Formation',
      learningDescription:
        'Ingénieur ESILV (calcul scientifique), échange à l’Université Laval. Grand Maître sur CodinGame, dans le top 0,1 % mondial.',
      certificationsTitle: 'Formations et certifications',
    },
    contact: {
      title: 'Un système à moderniser, ou une équipe à faire grandir ?',
      description:
        'Un système qui ne doit pas tomber, un legacy qui doit bouger, une équipe qui doit accélérer : j’aimerais en entendre parler.',
      emailAction: 'Proposer une mission',
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
        'Senior Software Engineer & Tech Lead freelance : pricing sportif temps réel chez Betclic, modernisation du SI publicitaire de TF1. C#/.NET, AWS, Azure.',
    },
  },
};
