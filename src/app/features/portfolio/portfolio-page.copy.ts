import { PortfolioLocale } from '../../core/domain/portfolio.models';

interface PageCopy {
  readonly skipToContent: string;
  readonly homeLabel: string;
  readonly navigationLabel: string;
  readonly navigation: readonly string[];
  readonly availability: string;
  readonly headerActionsLabel: string;
  readonly language: {
    readonly current: string;
    readonly target: string;
    readonly href: string;
    readonly ariaLabel: string;
  };
  readonly cv: {
    readonly label: string;
    readonly href: string;
    readonly fileName: string;
    readonly ariaLabel: string;
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
    readonly profileLabel: string;
    readonly profileTitle: string;
    readonly profilePoints: readonly string[];
    readonly profileFooter: readonly string[];
  };
  readonly metricsLabel: string;
  readonly metrics: readonly { readonly value: string; readonly label: string }[];
  readonly manifesto: readonly string[];
  readonly work: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly intro: string;
    readonly openCase: string;
    readonly flagships: readonly {
      readonly kicker: string;
      readonly title: string;
      readonly summary: string;
      readonly path: string;
    }[];
    readonly compact: readonly {
      readonly company: string;
      readonly period: string;
      readonly role: string;
      readonly summary: string;
      readonly tags: readonly string[];
    }[];
  };
  readonly principles: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly intro: string;
    readonly items: readonly { readonly title: string; readonly description: string }[];
  };
  readonly expertise: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly intro: string;
    readonly technologies: string;
  };
  readonly workingStyle: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly intro: string;
    readonly strength: string;
    readonly vigilance: string;
    readonly safeguard: string;
  };
  readonly projects: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly intro: string;
  };
  readonly quote: {
    readonly label: string;
    readonly text: string;
    readonly action: string;
  };
  readonly journey: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly intro: string;
  };
  readonly learning: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly description: string;
    readonly action: string;
  };
  readonly contact: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly description: string;
    readonly emailAction: string;
    readonly cvAction: string;
    readonly phoneAction: string;
    readonly linkedinAction: string;
  };
  readonly footer: {
    readonly description: string;
    readonly role: string;
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
    homeLabel: 'Vivien Billot, home',
    navigationLabel: 'Primary navigation',
    navigation: ['Work', 'Expertise', 'Experience', 'Projects', 'Contact'],
    availability: 'Open to discussing what’s next',
    headerActionsLabel: 'Quick actions',
    language: {
      current: 'EN',
      target: 'FR',
      href: '/fr',
      ariaLabel: 'Current language: English. Switch to the French version.',
    },
    cv: {
      label: 'Resume PDF',
      href: '/assets/CV-Vivien-Billot-EN.pdf',
      fileName: 'CV-Vivien-Billot-EN.pdf',
      ariaLabel: 'Download Vivien Billot English resume as a PDF',
    },
    theme: { light: 'Switch to light theme', dark: 'Switch to dark theme' },
    hero: {
      eyebrow: 'Senior Software Engineer / Tech Lead · C# / .NET · Distributed systems',
      title: 'Systems where wrong answers',
      accent: 'are expensive.',
      lead: 'For 15+ years I’ve designed, built, and modernized software where correctness is the business: real-time sports pricing at Betclic, the ad platform at TF1 — France’s largest private broadcaster — and regulated medical software at Stago. I work end to end — business, architecture, code, production — and leave systems clearer and teams more autonomous than I found them.',
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
      profileLabel: 'Profile / at a glance',
      profileTitle: 'What I get hired for',
      profilePoints: [
        'Making critical business rules explicit, testable, and safe to change',
        'Modernizing legacy systems without stopping delivery',
        'Raising a team’s delivery capacity and autonomy',
      ],
      profileFooter: ['Architecture', 'Delivery', 'Leadership'],
    },
    metricsLabel: 'Selected impact',
    metrics: [
      {
        value: '15+',
        label: 'years of engineering, from regulated medical software to real-time pricing',
      },
      { value: '11', label: 'projects shipped to production while leading two teams at TF1' },
      { value: '500+', label: 'rental branches served by platforms my team built at Rent A Car' },
      { value: '4', label: 'teams led across TF1, Rent A Car, and Stago' },
    ],
    manifesto: ['ARCHITECT', 'HARDEN', 'SHIP', 'TRANSFER'],
    work: {
      eyebrow: 'Selected work',
      title: 'Complex systems.',
      accent: 'Decisions that hold up.',
      intro:
        'Two case studies in depth — what the problem was, which decisions I made, what they cost, and what shipped. Two more environments in brief.',
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
          kicker: 'TF1 Group · Mar 2022–Oct 2025 · Tech Lead of two teams',
          title: 'Modernizing a broadcaster’s ad platform without stopping it',
          summary:
            'Leading the redesign of TF1’s advertising platform from March 2022 to October 2025: 11 projects shipped to production, a VB6-era stack retired step by step, and two teams that got stronger along the way.',
          path: '/work/tf1',
        },
      ],
      compact: [
        {
          company: 'Rent A Car',
          period: '2017–2022',
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
            'Designed the C# framework that computes patient results on in-vitro diagnostic instruments — a regulated environment where an approximation is a defect. Led an eight-person R&D team; refactored critical modules with TDD and structured continuous integration and requirements traceability.',
          tags: ['C#', 'WPF', 'TDD', 'NUnit', 'TeamCity', 'IBM Rational DOORS'],
        },
      ],
    },
    principles: {
      eyebrow: 'Engineering principles',
      title: 'Opinions I defend.',
      accent: 'Until proven wrong.',
      intro: 'What I bring to a design review — and what I drop when the evidence proves it wrong.',
      items: [
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
    },
    expertise: {
      eyebrow: 'Expertise',
      title: 'The problems',
      accent: 'people call me in for.',
      intro:
        'Organized by problem, not by keyword count. Each area is backed by systems that ran — and still run — in production.',
      technologies: 'Technologies',
    },
    workingStyle: {
      eyebrow: 'How I work',
      title: 'What you gain.',
      accent: 'What I keep in check.',
      intro:
        'Strengths come with failure modes. These are mine — and the instincts I keep in check to stay useful to the team.',
      strength: 'Strength',
      vigilance: 'What I watch',
      safeguard: 'My safeguard',
    },
    projects: {
      eyebrow: 'Public code',
      title: 'Small on purpose,',
      accent: 'easy to inspect.',
      intro:
        'Each project isolates one practice — domain modeling, TDD, algorithmic optimization — so the reasoning is easy to inspect.',
    },
    quote: {
      label: 'Professional recommendations',
      text: 'The strongest proof is other people’s words: recommendations from the engineers, managers, and product owners I’ve worked with are public on LinkedIn.',
      action: 'Read the recommendations',
    },
    journey: {
      eyebrow: 'Experience',
      title: 'A career built on',
      accent: 'expensive mistakes avoided.',
      intro:
        'Six environments, one through line: the more a mistake costs, the more the fundamentals matter — explicit domains, tests, observability, and teams that understand their own system.',
    },
    learning: {
      eyebrow: 'Continuous learning',
      title: 'Learn to',
      accent: 'decide better.',
      description:
        'Engineering degree from ESILV (scientific computing), exchange at Université Laval. I keep the fundamentals sharp through deliberate practice: DDD training with Julien Topçu, SAFe RTE certification, security and observability training — and competitive programming on CodinGame, where I rank in the world’s top 0.1% (Grand Master).',
      action: 'See my CodinGame profile',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'A system to modernize,',
      accent: 'or a team to lead?',
      description:
        'Freelance Senior Tech Lead, currently on contract with Betclic Group. If you’re facing a system that must not fail, a legacy that has to move, or a team that needs to speed up — I’d like to hear about it.',
      emailAction: 'Email Vivien',
      cvAction: 'Download resume',
      phoneAction: 'Call Vivien Billot at +33 6 23 85 77 32',
      linkedinAction: 'View LinkedIn profile',
    },
    footer: {
      description:
        'Architecture, modernization, real-time systems, technical debt, or team performance: if the topic matters, I prefer to frame it quickly and concretely.',
      role: 'Senior Software Engineer / Tech Lead · Paris region',
      availability: 'Open to discussing what’s next',
      directoryLabel: 'Contact details and useful links',
      cvFr: 'French resume',
      cvEn: 'English resume',
      cvFrAriaLabel: 'Download Vivien Billot French resume as a PDF',
      cvEnAriaLabel: 'Download Vivien Billot English resume as a PDF',
      top: 'Back to top',
      rights: 'All rights reserved',
    },
    seo: {
      title: 'Vivien Billot — Senior Software Engineer / Tech Lead · C#/.NET, Distributed Systems',
      description:
        'Senior Tech Lead with 15+ years on high-stakes systems: real-time sports pricing at Betclic, advertising platform modernization at TF1, regulated medical software. C#/.NET, AWS, Azure, distributed systems, team leadership.',
    },
  },
  fr: {
    skipToContent: 'Aller au contenu',
    homeLabel: 'Vivien Billot, accueil',
    navigationLabel: 'Navigation principale',
    navigation: ['Réalisations', 'Expertise', 'Parcours', 'Projets', 'Contact'],
    availability: 'Ouvert à la discussion',
    headerActionsLabel: 'Actions rapides',
    language: {
      current: 'FR',
      target: 'EN',
      href: '/',
      ariaLabel: 'Version actuelle : français. Passer à la version anglaise.',
    },
    cv: {
      label: 'CV PDF',
      href: '/assets/CV-Vivien-Billot-FR.pdf',
      fileName: 'CV-Vivien-Billot-FR.pdf',
      ariaLabel: 'Télécharger le CV français de Vivien Billot au format PDF',
    },
    theme: { light: 'Activer le thème clair', dark: 'Activer le thème sombre' },
    hero: {
      eyebrow: 'Senior Software Engineer / Tech Lead · C# / .NET · Systèmes distribués',
      title: 'Des systèmes où l’erreur',
      accent: 'coûte cher.',
      lead: 'Depuis 15+ ans, je conçois, construis et modernise des logiciels où la justesse est le métier : pricing sportif temps réel chez Betclic, SI publicitaire de TF1 — premier diffuseur privé français — et logiciel médical réglementé chez Stago. Je travaille de bout en bout — métier, architecture, code, production — et je laisse les systèmes plus lisibles et les équipes plus autonomes que je ne les ai trouvés.',
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
      profileLabel: 'Profil / en bref',
      profileTitle: 'Ce pour quoi on me recrute',
      profilePoints: [
        'Rendre les règles métier critiques explicites, testables et sûres à faire évoluer',
        'Moderniser du legacy sans mettre le delivery à l’arrêt',
        'Augmenter la capacité de livraison et l’autonomie des équipes',
      ],
      profileFooter: ['Architecture', 'Delivery', 'Leadership'],
    },
    metricsLabel: 'Impact sélectionné',
    metrics: [
      { value: '15+', label: 'années d’ingénierie, du médical réglementé au pricing temps réel' },
      { value: '11', label: 'projets mis en production en encadrant deux équipes chez TF1' },
      { value: '500+', label: 'agences servies par les plateformes construites chez Rent A Car' },
      { value: '4', label: 'équipes encadrées chez TF1, Rent A Car et Stago' },
    ],
    manifesto: ['ARCHITECTURER', 'FIABILISER', 'LIVRER', 'TRANSMETTRE'],
    work: {
      eyebrow: 'Réalisations',
      title: 'Des systèmes complexes.',
      accent: 'Des décisions qui tiennent.',
      intro:
        'Deux études de cas en profondeur — le problème, les décisions prises, leur coût et ce qui a été livré. Deux autres environnements en bref.',
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
          kicker: 'Groupe TF1 · Mars 2022–octobre 2025 · Tech Lead de deux équipes',
          title: 'Moderniser le SI publicitaire d’un diffuseur sans l’arrêter',
          summary:
            'Piloter la refonte du SI publicitaire de TF1 de mars 2022 à octobre 2025 : 11 projets mis en production, un legacy VB6 remplacé pas à pas, et deux équipes qui en sont sorties plus fortes.',
          path: '/fr/work/tf1',
        },
      ],
      compact: [
        {
          company: 'Rent A Car',
          period: '2017–2022',
          role: 'Développeur senior → Tech Lead / Responsable technique',
          summary:
            'Construire le parcours de location digital d’un réseau de 500+ agences : microservices, pricing dynamique, e-commerce à fort trafic et Easy Péage — annoncé comme le premier paiement de péage embarqué d’Europe pour la location. De développeur senior à responsable technique d’une équipe de neuf personnes.',
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
    },
    principles: {
      eyebrow: 'Principes d’ingénierie',
      title: 'Des convictions défendues.',
      accent: 'Jusqu’à preuve du contraire.',
      intro:
        'Ce que j’apporte en revue de conception — et ce que j’abandonne quand les faits me donnent tort.',
      items: [
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
            'Un système que je ne peux pas expliquer en production n’est pas terminé. Traçage, replay et signaux actionnables font partie de l’architecture, pas de l’après-coup.',
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
    },
    expertise: {
      eyebrow: 'Expertise',
      title: 'Les problèmes pour lesquels',
      accent: 'on m’appelle.',
      intro:
        'Organisée par problème, pas par nombre de mots-clés. Chaque domaine s’appuie sur des systèmes qui ont tourné — et tournent encore — en production.',
      technologies: 'Technologies',
    },
    workingStyle: {
      eyebrow: 'Mode de collaboration',
      title: 'Ce que vous obtenez.',
      accent: 'Ce que je surveille.',
      intro:
        'Les forces ont leurs revers. Voici les miennes — et les réflexes que je cadre pour rester utile au collectif.',
      strength: 'Force',
      vigilance: 'Point de vigilance',
      safeguard: 'Mon garde-fou',
    },
    projects: {
      eyebrow: 'Code public',
      title: 'Petits par choix,',
      accent: 'faciles à inspecter.',
      intro:
        'Chaque projet isole une pratique — modélisation de domaine, TDD, optimisation algorithmique — pour que le raisonnement soit facile à inspecter.',
    },
    quote: {
      label: 'Recommandations professionnelles',
      text: 'La meilleure preuve, ce sont les mots des autres : les recommandations des ingénieurs, managers et product owners avec qui j’ai travaillé sont publiques sur LinkedIn.',
      action: 'Lire les recommandations',
    },
    journey: {
      eyebrow: 'Parcours',
      title: 'Une progression',
      accent: 'par la complexité.',
      intro:
        'Six environnements, un fil rouge : plus une erreur coûte cher, plus les fondamentaux comptent — domaines explicites, tests, observabilité et équipes qui comprennent leur propre système.',
    },
    learning: {
      eyebrow: 'Formation continue',
      title: 'Apprendre pour',
      accent: 'mieux décider.',
      description:
        'Ingénieur ESILV (calcul scientifique), échange à l’Université Laval. J’entretiens les fondamentaux par la pratique délibérée : formation DDD avec Julien Topçu, certification SAFe RTE, sécurité et observabilité — et la programmation compétitive sur CodinGame, où je suis dans le top 0,1 % mondial (Grand Maître).',
      action: 'Voir mon profil CodinGame',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Un système à moderniser,',
      accent: 'ou une équipe à faire grandir ?',
      description:
        'Tech Lead senior freelance, actuellement en mission chez Betclic Group. Un système qui ne doit pas tomber, un legacy qui doit bouger, une équipe qui doit accélérer — j’aimerais en entendre parler.',
      emailAction: 'Envoyer un email',
      cvAction: 'Télécharger le CV',
      phoneAction: 'Appeler Vivien Billot au 06 23 85 77 32',
      linkedinAction: 'Voir le profil LinkedIn',
    },
    footer: {
      description:
        'Architecture, modernisation, systèmes temps réel, dette technique ou performance d’équipe : si le sujet compte, je préfère le cadrer vite et concrètement.',
      role: 'Senior Software Engineer / Tech Lead · Île-de-France',
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
      title: 'Vivien Billot — Senior Software Engineer / Tech Lead · C#/.NET, systèmes distribués',
      description:
        'Tech Lead senior, 15+ ans sur des systèmes à fort enjeu : pricing sportif temps réel chez Betclic, modernisation du SI publicitaire de TF1, logiciel médical réglementé. C#/.NET, AWS, Azure, leadership d’équipe.',
    },
  },
};
