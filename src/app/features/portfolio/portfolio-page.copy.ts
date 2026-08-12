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
    readonly scrollCue: string;
  };
  readonly metricsLabel: string;
  readonly metrics: readonly { readonly value: string; readonly label: string }[];
  readonly manifesto: readonly string[];
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
  readonly impact: {
    readonly eyebrow: string;
    readonly title: string;
    readonly accent: string;
    readonly intro: string;
    readonly matrix: {
      readonly contribution: string;
      readonly outcomes: string;
      readonly stack: string;
    };
    readonly cases: readonly {
      readonly company: string;
      readonly scope: string;
      readonly title: string;
      readonly description: string;
      readonly contributions: readonly string[];
      readonly outcomes: readonly string[];
      readonly tags: readonly string[];
    }[];
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
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly role: string;
    readonly availability: string;
    readonly email: string;
    readonly phone: string;
    readonly socials: string;
    readonly documents: string;
    readonly directoryLabel: string;
    readonly cvFr: string;
    readonly cvEn: string;
    readonly cvFrAriaLabel: string;
    readonly cvEnAriaLabel: string;
    readonly top: string;
    readonly rights: string;
  };
}

export const PORTFOLIO_PAGE_COPY: Record<PortfolioLocale, PageCopy> = {
  fr: {
    skipToContent: 'Aller au contenu',
    homeLabel: 'Vivien Billot, accueil',
    navigationLabel: 'Navigation principale',
    navigation: ['Expertise', 'Impact', 'Parcours', 'Projets', 'Contact'],
    availability: 'Disponible pour échanger',
    headerActionsLabel: 'Actions rapides',
    language: {
      current: 'FR',
      target: 'EN',
      href: '/en',
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
      eyebrow: 'Senior Software Engineer / Tech Lead · Betclic Group · Freelance',
      title: 'Résoudre les problèmes',
      accent: 'métier complexes.',
      lead: 'En tant que Senior Software Engineer / Tech Lead chez Betclic Group, je transforme les problèmes métier complexes en ROI durable : rendre les systèmes résilients, maîtriser la dette technique et augmenter la capacité de livraison des équipes — sans sacrifier la qualité.',
      primaryAction: 'Voir les résultats concrets',
      secondaryAction: 'Discuter de votre contexte',
      proof: [
        'C# / .NET',
        'Monte-Carlo',
        'Pricing sportif',
        'Résilience',
        'Dette technique',
        'Performance équipes',
      ],
      profileLabel: 'Profil / en bref',
      profileTitle: 'L’impact que je recherche',
      profilePoints: [
        'Sécuriser les services et les décisions qui comptent',
        'Réduire la dette sans mettre le delivery à l’arrêt',
        'Augmenter la capacité de livraison et l’autonomie des équipes',
      ],
      profileFooter: ['Résilience', 'Delivery', 'Transmission'],
      scrollCue: 'SCROLL TO EXPLORE',
    },
    metricsLabel: 'Repères professionnels',
    metrics: [
      { value: '15+', label: 'années à construire' },
      { value: '11', label: 'projets TF1 en production' },
      { value: '500+', label: 'agences transformées' },
      { value: 'Top 0,1%', label: 'CodinGame mondial' },
    ],
    manifesto: ['ARCHITECTURER', 'FIABILISER', 'TRANSMETTRE', 'FAIRE ÉVOLUER'],
    expertise: {
      eyebrow: 'Expertise',
      title: 'Ce que je sais',
      accent: 'faire concrètement.',
      intro:
        'Je relie métier, code et exploitation. Le résultat attendu : une solution utile maintenant, compréhensible demain et maîtrisable par l’équipe qui la fait vivre.',
      technologies: 'Technologies',
    },
    workingStyle: {
      eyebrow: 'Mode de collaboration',
      title: 'Ce que vous obtenez.',
      accent: 'Ce que je surveille.',
      intro:
        'Une relation de confiance se construit aussi sur la lucidité. Voici les forces que j’apporte et les réflexes que je cadre pour rester utile au collectif.',
      strength: 'Force',
      vigilance: 'Point de vigilance',
      safeguard: 'Mon garde-fou',
    },
    impact: {
      eyebrow: 'Expériences clés',
      title: 'Des contextes complexes.',
      accent: 'Des décisions durables.',
      intro:
        'Des environnements exigeants, du pari sportif à la publicité, en passant par la location, le logiciel médical et les systèmes métier à forte contrainte. Le fil rouge reste le même : clarifier avant de construire, sécuriser avant d’accélérer et transmettre pour rendre les équipes plus autonomes.',
      matrix: {
        contribution: 'Contribution structurante',
        outcomes: 'Impact recherché',
        stack: 'Stack & pratiques',
      },
      cases: [
        {
          company: 'BETCLIC GROUP',
          scope: 'Pricing sportif · Quant · IA',
          title:
            'Produire nos probabilités pour maîtriser les cotes, le risque et la vitesse de réaction.',
          description:
            'Un contexte où la valeur tient à la capacité de générer des cotes internes fiables, rapides et maîtrisées plutôt que de dépendre uniquement de providers externes.',
          contributions: [
            'Modéliser des matchs par simulations Monte-Carlo sur de nombreux sports et compétitions.',
            'Transformer les probabilités en cotes propriétaires, avec une attention forte portée au risque et à la cohérence des marchés.',
            'Traiter les règles fines du cycle de vie d’un market : quand suspendre, rouvrir, recalculer ou investiguer.',
            'Construire un back-office de replay pour reproduire les événements, tracer les décisions algorithmiques et corriger avec preuve.',
            'Explorer l’accélération des calculs via POC GPU et industrialiser le delivery avec AWS, Dagger et GitHub Actions.',
            'Structurer des usages IA reproductibles : skills, commandes, agents, routines, workflows et boucles Claude Code / Cursor.',
          ],
          outcomes: [
            'Réagir plus vite aux événements sportifs sans perdre la maîtrise métier.',
            'Réduire la dépendance aux providers et renforcer l’autonomie de pricing.',
            'Accélérer l’analyse des anomalies grâce au replay et à l’observabilité des décisions.',
          ],
          tags: [
            'C# / .NET',
            'Monte-Carlo',
            'Pricing sportif',
            'Quant',
            'GPU',
            'AWS',
            'Dagger',
            'GitHub Actions',
            'Claude Code',
            'Cursor',
          ],
        },
        {
          company: 'GROUPE TF1',
          scope: 'Publicité · Cloud · Leadership',
          title:
            'Faire avancer deux équipes, tenir les délais et transformer le SI sans dégrader le métier.',
          description:
            'Refonte et modernisation du système d’information publicitaire, dans un environnement visible, rythmé par les engagements business, la production et la qualité de service.',
          contributions: [
            'Encadrer deux équipes pluridisciplinaires : architecture, roadmap, priorisation, coaching, recrutement et standards de développement.',
            'Mettre 11 projets en production et en engager 4 autres tout en respectant les délais et la continuité métier.',
            'Moderniser du legacy VB6 vers .NET 6/8, Angular, Azure et AKS, avec API Management, sécurité et observabilité.',
            'Éradiquer progressivement les défauts pendant la modernisation : incidents, dette, zones floues, fragilité de delivery.',
            'Mettre en place des pratiques Accelerate, tests utiles, code reviews, monitoring Datadog et gouvernance APIGEE.',
            'Explorer l’IA avec pragmatisme : beta tests, Copilot et validation éditoriale automatisée de vidéos.',
          ],
          outcomes: [
            'Transformer sans casser : continuité de service et lisibilité technique malgré un SI historique.',
            'Réduire le lead time et absorber plus de 80 incidents avec une boucle qualité plus courte.',
            'Faire grandir les équipes via un cadre clair, des décisions partagées et des standards durables.',
          ],
          tags: [
            '.NET 6/8',
            'Angular',
            'Azure',
            'AKS',
            'APIGEE',
            'Datadog',
            'Checkmarx',
            'Snyk',
            'Accelerate',
            'Copilot',
          ],
        },
        {
          company: 'RENT A CAR',
          scope: 'Mobilité · Réseau · E-commerce',
          title: 'Transformer le parcours de location à l’échelle de plus de 500 agences.',
          description:
            'Un terrain très opérationnel : agences, clients, partenaires, flux de réservation, contrats, paiement, péage, conformité et montée en charge.',
          contributions: [
            'Piloter une équipe de neuf personnes en passant de développeur senior à responsable technique.',
            'Lancer Easy Péage, service européen innovant de paiement de péage embarqué dans un véhicule de location.',
            'Digitaliser le parcours client : check-in, signature Yousign, état des lieux WeProov et e-commerce à fort trafic.',
            'Construire des microservices, du pricing dynamique, une interface ANTAI et un référentiel client conforme RGPD.',
            'Industrialiser CI/CD, Docker, AWS et ELK tout en recrutant et en faisant progresser l’équipe.',
          ],
          outcomes: [
            'Rendre le parcours de location plus fluide pour un réseau de plus de 500 agences.',
            'Relier innovation terrain, contraintes réglementaires et robustesse technique.',
            'Installer une base applicative plus modulaire, observable et évolutive.',
          ],
          tags: [
            'C#',
            '.NET Core',
            'Angular',
            'Microservices',
            'AWS',
            'Docker',
            'PostgreSQL',
            'ELK',
            'Yousign',
            'WeProov',
          ],
        },
        {
          company: 'STAGO',
          scope: 'Logiciel médical · R&D · Qualité',
          title:
            'Quand le logiciel participe à un résultat médical, la rigueur n’est pas négociable.',
          description:
            'Développement logiciel dans un environnement réglementé, où le calcul, la traçabilité et la preuve de qualité ont un impact direct sur la confiance produit.',
          contributions: [
            'Concevoir un framework C# de calcul des résultats patients pour une nouvelle gamme d’automates de diagnostic in vitro.',
            'Refactorer les modules critiques avec TDD, SOLID, MVVM, NUnit et intégration continue TeamCity.',
            'Structurer la traçabilité des exigences dans IBM Rational DOORS et encadrer les prestataires.',
            'Planifier les livrables, recruter, former et suivre les indicateurs d’une équipe R&D de huit personnes.',
          ],
          outcomes: [
            'Sécuriser les règles de calcul dans un contexte où l’approximation n’est pas acceptable.',
            'Faire progresser la maintenabilité par les tests, le refactoring et la traçabilité.',
            'Passer d’un rôle de responsable d’étude à un rôle d’encadrement R&D.',
          ],
          tags: ['C#', 'WPF', 'NUnit', 'TDD', 'SOLID', 'MVVM', 'TeamCity', 'PostgreSQL', 'DOORS'],
        },
        {
          company: 'BENTLEY SYSTEMS',
          scope: 'Génie civil · Données métier',
          title:
            'Sécuriser les outils métier et l’intégrité des données dès la première expérience.',
          description:
            'Une première immersion dans des applications de génie civil, centrée sur la fiabilité des données de conception et l’outillage des utilisateurs experts.',
          contributions: [
            'Finaliser un framework métier sur des applications de conception technique.',
            'Développer un éditeur interactif d’expressions paramétriques.',
            'Créer des outils de contrôle et de réparation de l’intégrité des données.',
            'Travailler avec une démarche UML, Scrum et une attention forte portée aux règles métier.',
          ],
          outcomes: [
            'Comprendre tôt l’importance de la donnée fiable dans un outil professionnel.',
            'Relier UX métier, règles techniques et qualité de modèle.',
          ],
          tags: ['C++', 'C#', '.NET', 'UML', 'Scrum', 'Data integrity'],
        },
        {
          company: 'TOTAL',
          scope: 'Énergie · Audit · Sécurité opérationnelle',
          title: 'Transformer des audits opérationnels en données exploitables.',
          description:
            'Un projet au croisement de la donnée, du reporting et de la sécurité terrain pour le transport d’hydrocarbures en Afrique et au Moyen-Orient.',
          contributions: [
            'Concevoir une base Access pour centraliser les audits de transport.',
            'Développer des interfaces VB.NET / Excel adaptées aux usages opérationnels.',
            'Automatiser les tableaux de bord pour fiabiliser le reporting.',
          ],
          outcomes: [
            'Réduire les erreurs de reporting et améliorer la traçabilité.',
            'Transformer des informations dispersées en pilotage plus lisible.',
          ],
          tags: ['VB.NET', 'Access', 'SQL', 'Excel', 'Reporting'],
        },
      ],
    },
    projects: {
      eyebrow: 'Projets personnels',
      title: 'Des principes',
      accent: 'mis à l’épreuve.',
      intro:
        'Ces projets montrent ma manière de raisonner : partir des règles métier, rendre les choix visibles par les tests et construire une base simple à faire évoluer.',
    },
    quote: {
      label: 'Recommandation professionnelle',
      text: 'Mes recommandations LinkedIn apportent une preuve complémentaire : la confiance d’équipes et de collaborateurs avec qui j’ai partagé des contextes techniques exigeants.',
      action: 'Lire les recommandations LinkedIn',
    },
    journey: {
      eyebrow: 'Parcours',
      title: 'Une progression',
      accent: 'par la complexité.',
      intro:
        'Du logiciel médical à la plateforme Cloud, j’ai développé la même discipline : comprendre le terrain, rendre les décisions explicites et faire gagner l’équipe en autonomie.',
    },
    learning: {
      eyebrow: 'Formation continue',
      title: 'Apprendre pour',
      accent: 'mieux décider.',
      description:
        'Ingénieur ESILV, formé au calcul scientifique et enrichi par l’Université Laval. Je cultive cette base par le craft, la veille et les problèmes d’algorithmes qui obligent à rester précis.',
      action: 'Explorer mon profil CodinGame',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Un sujet d’architecture,',
      accent: 'de modernisation ou de Tech Lead ?',
      description:
        'Échangeons directement sur votre contexte, vos contraintes et la prochaine étape utile.',
      emailAction: 'Envoyer un email',
      cvAction: 'Télécharger le CV',
      phoneAction: 'Appeler Vivien Billot au 06 23 85 77 32',
      linkedinAction: 'Voir le profil LinkedIn',
    },
    footer: {
      eyebrow: 'Prochaine conversation',
      title: 'Un contexte complexe mérite une discussion claire.',
      description:
        'Architecture, modernisation, pricing, Cloud, dette technique ou performance d’équipe : si le sujet compte, je préfère cadrer vite, concrètement et sans bruit.',
      role: 'Tech Lead Full Stack · Île-de-France',
      availability: 'Disponible pour échanger',
      email: 'Email',
      phone: 'Téléphone',
      socials: 'Réseaux',
      documents: 'Documents',
      directoryLabel: 'Coordonnées et liens utiles',
      cvFr: 'CV français',
      cvEn: 'CV anglais',
      cvFrAriaLabel: 'Télécharger le CV français de Vivien Billot au format PDF',
      cvEnAriaLabel: 'Télécharger le CV anglais de Vivien Billot au format PDF',
      top: 'Retour en haut',
      rights: 'Tous droits réservés',
    },
  },
  en: {
    skipToContent: 'Skip to content',
    homeLabel: 'Vivien Billot, home',
    navigationLabel: 'Primary navigation',
    navigation: ['Expertise', 'Impact', 'Experience', 'Projects', 'Contact'],
    availability: 'Available to discuss',
    headerActionsLabel: 'Quick actions',
    language: {
      current: 'EN',
      target: 'FR',
      href: '/',
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
      eyebrow: 'Senior Software Engineer / Tech Lead · Betclic Group · Freelance',
      title: 'Solving complex business',
      accent: 'problems.',
      lead: 'As Senior Software Engineer / Tech Lead at Betclic Group, I turn complex business problems into durable ROI: building more resilient systems, controlling technical debt, and increasing teams’ delivery capacity — without sacrificing quality.',
      primaryAction: 'See concrete outcomes',
      secondaryAction: 'Discuss your context',
      proof: [
        'C# / .NET',
        'Monte Carlo',
        'Sports pricing',
        'Resilience',
        'Technical debt',
        'Team performance',
      ],
      profileLabel: 'Profile / at a glance',
      profileTitle: 'The impact I aim for',
      profilePoints: [
        'Safeguarding services and decisions that matter',
        'Reducing technical debt without stopping delivery',
        'Increasing a team’s delivery capacity and autonomy',
      ],
      profileFooter: ['Resilience', 'Delivery', 'Knowledge sharing'],
      scrollCue: 'SCROLL TO EXPLORE',
    },
    metricsLabel: 'Professional highlights',
    metrics: [
      { value: '15+', label: 'years building software' },
      { value: '11', label: 'TF1 projects in production' },
      { value: '500+', label: 'branches transformed' },
      { value: 'Top 0.1%', label: 'worldwide on CodinGame' },
    ],
    manifesto: ['ARCHITECT', 'MAKE RELIABLE', 'SHARE KNOWLEDGE', 'EVOLVE'],
    expertise: {
      eyebrow: 'Expertise',
      title: 'What I',
      accent: 'deliver in practice.',
      intro:
        'I connect business intent, code, and operations. The expected result: a solution that is useful today, understandable tomorrow, and owned by the team that runs it.',
      technologies: 'Technologies',
    },
    workingStyle: {
      eyebrow: 'How I work',
      title: 'What you gain.',
      accent: 'What I keep in check.',
      intro:
        'Trust also relies on clear-eyed collaboration. These are the strengths I bring and the habits I use to stay effective for the team.',
      strength: 'Strength',
      vigilance: 'Watch point',
      safeguard: 'My safeguard',
    },
    impact: {
      eyebrow: 'Key experience',
      title: 'Complex contexts.',
      accent: 'Durable decisions.',
      intro:
        'Demanding environments, from sports betting to advertising technology, rental services, medical software, and business-critical systems. The through line remains the same: clarify before building, secure before accelerating, and share knowledge so teams become more autonomous.',
      matrix: {
        contribution: 'Structuring contribution',
        outcomes: 'Targeted impact',
        stack: 'Stack & practices',
      },
      cases: [
        {
          company: 'BETCLIC GROUP',
          scope: 'Sports pricing · Quant · AI',
          title: 'Producing our own probabilities to control odds, risk, and reaction speed.',
          description:
            'A context where value depends on generating reliable internal odds quickly, with greater business control than relying only on external providers.',
          contributions: [
            'Model match outcomes through Monte Carlo simulations across multiple sports and competitions.',
            'Turn probabilities into proprietary odds, with strong attention to risk and market consistency.',
            'Handle fine-grained market-lifecycle rules: when to suspend, reopen, recompute, or investigate.',
            'Build replay tooling to reproduce events, trace algorithmic decisions, and fix issues with evidence.',
            'Explore compute acceleration through a GPU proof of concept and industrialise delivery with AWS, Dagger, and GitHub Actions.',
            'Structure reproducible AI workflows: skills, commands, agents, routines, workflows, and Claude Code / Cursor loops.',
          ],
          outcomes: [
            'React faster to sports events without losing business control.',
            'Reduce provider dependency and reinforce pricing autonomy.',
            'Accelerate anomaly analysis through replay and decision observability.',
          ],
          tags: [
            'C# / .NET',
            'Monte Carlo',
            'Sports pricing',
            'Quant',
            'GPU',
            'AWS',
            'Dagger',
            'GitHub Actions',
            'Claude Code',
            'Cursor',
          ],
        },
        {
          company: 'TF1 GROUP',
          scope: 'Advertising · Cloud · Leadership',
          title:
            'Moving two teams forward, meeting deadlines, and transforming the system without disrupting the business.',
          description:
            'A redesign and modernisation of the advertising information system in a highly visible environment shaped by business commitments, production constraints, and service quality.',
          contributions: [
            'Lead two multidisciplinary teams through architecture, roadmap, prioritisation, coaching, hiring, and engineering standards.',
            'Bring 11 projects to production and start 4 more while preserving deadlines and business continuity.',
            'Modernise VB6 legacy towards .NET 6/8, Angular, Azure, and AKS with API management, security, and observability.',
            'Gradually remove defects during modernisation: incidents, debt, unclear ownership, and delivery fragility.',
            'Install Accelerate practices, useful tests, code reviews, Datadog monitoring, and APIGEE governance.',
            'Explore AI pragmatically through beta testing, Copilot, and automated editorial validation of videos.',
          ],
          outcomes: [
            'Transform without breaking: service continuity and technical clarity despite a historical system.',
            'Reduce lead time and absorb over 80 incidents through a shorter quality feedback loop.',
            'Grow teams through clear framing, shared decisions, and durable standards.',
          ],
          tags: [
            '.NET 6/8',
            'Angular',
            'Azure',
            'AKS',
            'APIGEE',
            'Datadog',
            'Checkmarx',
            'Snyk',
            'Accelerate',
            'Copilot',
          ],
        },
        {
          company: 'RENT A CAR',
          scope: 'Mobility · Network · E-commerce',
          title: 'Transforming the rental journey across a network of more than 500 branches.',
          description:
            'A very operational environment: branches, customers, partners, booking flows, contracts, payment, tolls, compliance, and scale.',
          contributions: [
            'Lead a nine-person team while progressing from senior developer to technical manager.',
            'Launch Easy Péage, an innovative European in-vehicle toll-payment service for rental cars.',
            'Digitise the customer journey: check-in, Yousign e-signature, WeProov inspections, and high-traffic e-commerce.',
            'Build microservices, dynamic pricing, an ANTAI interface, and a GDPR-compliant customer master.',
            'Industrialise CI/CD, Docker, AWS, and ELK while hiring and developing the team.',
          ],
          outcomes: [
            'Make the rental journey smoother across a network of more than 500 branches.',
            'Connect field innovation, regulatory constraints, and technical robustness.',
            'Install a more modular, observable, and evolvable application foundation.',
          ],
          tags: [
            'C#',
            '.NET Core',
            'Angular',
            'Microservices',
            'AWS',
            'Docker',
            'PostgreSQL',
            'ELK',
            'Yousign',
            'WeProov',
          ],
        },
        {
          company: 'STAGO',
          scope: 'Medical software · R&D · Quality',
          title: 'When software contributes to a medical result, rigour is not negotiable.',
          description:
            'Software development in a regulated environment where calculation, traceability, and proof of quality directly affect product trust.',
          contributions: [
            'Design a C# patient-results calculation framework for a new generation of in-vitro diagnostic instruments.',
            'Refactor critical modules with TDD, SOLID, MVVM, NUnit, and TeamCity continuous integration.',
            'Structure requirements traceability in IBM Rational DOORS and coordinate external providers.',
            'Plan deliverables, hire, train, and track indicators for an eight-person R&D team.',
          ],
          outcomes: [
            'Secure calculation rules in a context where approximation is not acceptable.',
            'Increase maintainability through tests, refactoring, and traceability.',
            'Progress from study leadership into R&D team management.',
          ],
          tags: ['C#', 'WPF', 'NUnit', 'TDD', 'SOLID', 'MVVM', 'TeamCity', 'PostgreSQL', 'DOORS'],
        },
        {
          company: 'BENTLEY SYSTEMS',
          scope: 'Civil engineering · Business data',
          title: 'Safeguarding business tooling and data integrity from the first role.',
          description:
            'An early immersion into civil-engineering applications, focused on reliable design data and tooling for expert users.',
          contributions: [
            'Complete a business framework for technical design applications.',
            'Develop an interactive parametric-expression editor.',
            'Build tools to validate and repair data integrity.',
            'Work with UML, Scrum, and strong attention to business rules.',
          ],
          outcomes: [
            'Understand early why reliable data matters in professional software.',
            'Connect business UX, technical rules, and model quality.',
          ],
          tags: ['C++', 'C#', '.NET', 'UML', 'Scrum', 'Data integrity'],
        },
        {
          company: 'TOTAL',
          scope: 'Energy · Audit · Operational safety',
          title: 'Turning operational audits into exploitable data.',
          description:
            'A project connecting data, reporting, and field safety for hydrocarbon-transport audits across Africa and the Middle East.',
          contributions: [
            'Design an Access database to centralise transport audits.',
            'Develop VB.NET / Excel interfaces adapted to operational usage.',
            'Automate dashboards to make reporting more reliable.',
          ],
          outcomes: [
            'Reduce reporting errors and improve traceability.',
            'Turn scattered information into clearer operational steering.',
          ],
          tags: ['VB.NET', 'Access', 'SQL', 'Excel', 'Reporting'],
        },
      ],
    },
    projects: {
      eyebrow: 'Personal projects',
      title: 'Principles',
      accent: 'tested in practice.',
      intro:
        'These projects demonstrate how I reason: start with business rules, make decisions visible through tests, and build a simple foundation that can evolve.',
    },
    quote: {
      label: 'Professional recommendation',
      text: 'My LinkedIn recommendations provide complementary evidence: the trust of teams and colleagues with whom I have worked in demanding technical contexts.',
      action: 'Read LinkedIn recommendations',
    },
    journey: {
      eyebrow: 'Experience',
      title: 'Progression',
      accent: 'through complexity.',
      intro:
        'From medical software to Cloud platforms, I have developed the same discipline: understand the field, make decisions explicit, and make the team more autonomous.',
    },
    learning: {
      eyebrow: 'Continuous learning',
      title: 'Learn to',
      accent: 'make better decisions.',
      description:
        'ESILV engineering graduate, trained in scientific computing and enriched by an exchange at Université Laval. I keep building on that foundation through craft, technical curiosity, and algorithmic problems that demand precision.',
      action: 'Explore my CodinGame profile',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'An architecture,',
      accent: 'modernisation, or Tech Lead challenge?',
      description: 'Let’s discuss your context, constraints, and the next useful step directly.',
      emailAction: 'Email Vivien',
      cvAction: 'Download resume',
      phoneAction: 'Call Vivien Billot at +33 6 23 85 77 32',
      linkedinAction: 'View LinkedIn profile',
    },
    footer: {
      eyebrow: 'Next conversation',
      title: 'A complex context deserves a clear discussion.',
      description:
        'Architecture, modernisation, pricing, Cloud, technical debt, or team performance: if the topic matters, I prefer framing it quickly, concretely, and without noise.',
      role: 'Full-Stack Tech Lead · Paris region',
      availability: 'Available to discuss',
      email: 'Email',
      phone: 'Phone',
      socials: 'Social',
      documents: 'Documents',
      directoryLabel: 'Contact details and useful links',
      cvFr: 'French resume',
      cvEn: 'English resume',
      cvFrAriaLabel: 'Download Vivien Billot French resume as a PDF',
      cvEnAriaLabel: 'Download Vivien Billot English resume as a PDF',
      top: 'Back to top',
      rights: 'All rights reserved',
    },
  },
};
