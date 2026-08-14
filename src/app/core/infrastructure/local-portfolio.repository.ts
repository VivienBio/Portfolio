import { PortfolioRepository } from '../application/portfolio.repository';
import { Portfolio, PortfolioLocale } from '../domain/portfolio.models';
import { deepFreeze } from '../domain/deep-freeze';

const FRENCH_PORTFOLIO: Portfolio = deepFreeze({
  expertises: [
    {
      index: '01',
      title: 'Ingénierie logicielle',
      description:
        'Rendre les domaines complexes explicites, testables et sûrs à faire évoluer : un domaine protégé, des cas d’usage clairs, des dépendances qui ne dictent pas la solution.',
      technologies: ['C#', '.NET / ASP.NET Core', 'DDD', 'Hexagonale', 'CQRS', 'TDD'],
    },
    {
      index: '02',
      title: 'Systèmes distribués & messaging',
      description:
        'Concevoir des services qui restent justes quand tout devient asynchrone : frontières nettes, résilience et flux d’événements maîtrisés.',
      technologies: ['Microservices', 'Kafka', 'Messaging', 'Résilience'],
    },
    {
      index: '03',
      title: 'Cloud & plateforme',
      description:
        'Traiter la plateforme comme un produit : reproductible, sécurisée, observable — et des signaux de production réellement actionnables.',
      technologies: [
        'AWS (ECS/Fargate)',
        'Azure (AKS)',
        'Docker',
        'Terraform / Terragrunt',
        'Datadog',
      ],
    },
    {
      index: '04',
      title: 'Delivery & qualité',
      description:
        'Raccourcir le chemin de la décision à la production sans rogner sur la qualité : pipelines, quality gates et sécurité intégrée.',
      technologies: ['GitHub Actions', 'CI/CD', 'Dagger', 'SonarQube', 'Checkmarx / Snyk'],
    },
    {
      index: '05',
      title: 'Full stack & frontend',
      description:
        'Des interfaces qui respectent l’utilisateur et le modèle métier derrière : de l’API au parcours Angular, fiable et accessible.',
      technologies: ['Angular', 'TypeScript', 'SQL / NoSQL', 'Accessibilité', 'SSR'],
    },
    {
      index: '06',
      title: 'Leadership technique',
      description:
        'Faire monter le niveau de l’équipe, pas seulement celui du code : cap commun, décisions explicites et autonomie durable.',
      technologies: ['Roadmaps', 'Revues d’architecture', 'Mentorat', 'Recrutement', 'Standards'],
    },
  ],
  experiences: [
    {
      company: 'Betclic Group',
      role: 'Senior Software Engineer / Tech Lead',
      period: 'Depuis 2026',
      summary:
        'Je contribue à une chaîne de pricing sportif propriétaire : générer nos probabilités propriétaires afin de proposer rapidement des cotes maîtrisées aux parieurs, avec davantage d’autonomie qu’une dépendance exclusive à des providers externes.',
      achievements: [
        'Simuler le déroulement des matchs par Monte-Carlo à travers de nombreux sports et compétitions pour estimer les probabilités',
        'Transformer ces probabilités en cotes pilotées en interne, afin de gagner en vitesse, en maîtrise et en indépendance',
        'Traiter des règles complexes du cycle de vie d’un marché, notamment déterminer quand le suspendre ou le rouvrir',
        'Évaluer par un POC GPU l’accélération des calculs intensifs et industrialiser le delivery sur AWS avec Dagger et GitHub Actions',
        'Développer un back-office de replay, traçage et analyse pour reproduire les événements, comprendre les décisions algorithmiques et corriger plus sûrement',
        'Industrialiser l’usage de Claude Code et Cursor avec des skills, commandes, agents, routines, workflows et boucles IA reproductibles',
      ],
      technologies: [
        'C# / .NET',
        'Monte-Carlo / GPU',
        'Pricing sportif',
        'Quant',
        'AWS',
        'Dagger / GHA',
        'Claude Code / Cursor',
      ],
    },
    {
      company: 'Groupe TF1',
      role: 'Tech Lead / Architecte',
      period: 'Mars 2022 — 2026',
      summary:
        'Référent technique de deux équipes pluridisciplinaires, j’ai piloté la refonte du SI publicitaire : 11 projets mis en production, 4 autres engagés et plus de 80 incidents traités.',
      achievements: [
        'Donner un cap commun aux équipes : architecture, roadmap, priorisation, coaching, recrutement et respect des délais',
        'Réduire le lead time et traiter plus de 80 incidents avec les pratiques Accelerate, les tests et l’observabilité',
        'Moderniser du legacy VB6 vers .NET 6/8, Angular, Azure et AKS, avec gouvernance API et sécurité applicative',
        'Explorer des usages IA ciblés : assistance Copilot et validation éditoriale automatisée de vidéos',
      ],
      technologies: ['.NET 6/8', 'Angular', 'Azure / AKS', 'Apigee', 'Datadog', 'Checkmarx / Snyk'],
    },
    {
      company: 'Rent A Car',
      role: 'Développeur senior → Tech Lead / Responsable technique',
      period: 'Déc. 2017 — fév. 2022',
      summary:
        'De développeur senior à responsable technique d’une équipe de neuf personnes, j’ai contribué à la transformation numérique d’un réseau de plus de 500 agences.',
      achievements: [
        'Lancer Easy Péage, présenté comme le premier service européen de paiement de péage embarqué dans un véhicule de location',
        'Digitaliser le parcours : check-in, signature Yousign, état des lieux WeProov et e-commerce à fort trafic',
        'Construire microservices, pricing dynamique, interface ANTAI et référentiel client unique conforme au RGPD',
        'Industrialiser CI/CD, Docker, AWS et ELK tout en recrutant et faisant progresser l’équipe',
      ],
      technologies: ['C#', '.NET Core', 'Angular', 'AWS / Docker', 'PostgreSQL', 'Microservices'],
    },
    {
      company: 'Stago',
      role: 'Responsable d’étude → Responsable d’équipe R&D',
      period: 'Déc. 2012 — nov. 2017',
      summary:
        'J’ai évolué de responsable d’étude à responsable d’une équipe R&D de huit personnes sur une nouvelle gamme d’automates de diagnostic in vitro.',
      achievements: [
        'Concevoir le framework C# de calcul des résultats patients dans un environnement médical réglementé',
        'Refactorer les modules critiques avec TDD, SOLID, MVVM et intégration continue TeamCity',
        'Planifier les livrables, recruter, former et suivre les indicateurs d’une équipe de huit personnes',
        'Encadrer les prestataires et structurer la traçabilité des exigences dans IBM Rational DOORS',
      ],
      technologies: ['C#', 'WPF', 'PostgreSQL', 'NUnit', 'TeamCity'],
    },
    {
      company: 'Bentley Systems',
      role: 'Junior Software Engineer',
      period: 'Avr. — nov. 2012',
      summary:
        'Première expérience sur des applications de génie civil : finaliser un framework métier et développer des outils qui sécurisent les données de conception.',
      achievements: [
        'Développer un éditeur interactif d’expressions paramétriques',
        'Créer des outils de contrôle et de réparation de l’intégrité des données',
      ],
      technologies: ['C++', 'C#', '.NET', 'UML', 'Scrum'],
    },
    {
      company: 'Total',
      role: 'Développeur VB.NET — stage',
      period: 'Fév. — juil. 2011',
      summary:
        'J’ai créé des outils de suivi des audits de transport d’hydrocarbures pour la zone Afrique–Moyen-Orient, au croisement de la donnée et de la sécurité opérationnelle.',
      achievements: [
        'Concevoir une base Access et des interfaces VB.NET / Excel pour centraliser les audits',
        'Automatiser les tableaux de bord afin de réduire les erreurs de reporting et améliorer la traçabilité',
      ],
      technologies: ['VB.NET', 'Access', 'SQL', 'Excel'],
    },
  ],
  projects: [
    {
      title: 'Portfolio — Digital Twin',
      category: 'Architecture · Angular · Cloud',
      description:
        'Un portfolio qui se comporte comme un produit : il raconte mon parcours, expose mes choix d’architecture et propose une conversation ancrée sur des informations vérifiées.',
      proof:
        'Angular SSR, architecture hexagonale, TDD, contrôles d’accessibilité et déploiement GCP pensé sans secrets dans le navigateur.',
      technologies: ['Angular 22', 'OpenAI', 'GCP', 'Vitest'],
      url: 'https://github.com/VivienBio/Portfolio',
    },
    {
      title: 'TicTacToe Solver',
      category: 'TDD · Domain Design',
      description:
        'Bien plus qu’un morpion : un laboratoire C# pour modéliser des règles, faire émerger le design par les tests et garder le comportement métier évident.',
      proof:
        'Une base volontairement compacte où chaque règle est nommée, testée et donc facile à challenger ou à faire évoluer.',
      technologies: ['C#', 'TDD', 'SOLID'],
      url: 'https://github.com/VivienBio/TicTacToeSolver',
    },
    {
      title: 'BullsAndCows',
      category: 'C# · Tests · Règles métier',
      description:
        'Un exercice C# public qui met la logique du jeu au premier plan, avec un projet de tests dédié pour verrouiller les règles et les cas limites.',
      proof:
        'Une démonstration supplémentaire d’une pratique récurrente : partir du comportement attendu, puis construire un code simple à vérifier.',
      technologies: ['C#', 'Tests', 'Règles métier'],
      url: 'https://github.com/VivienBio/BullsAndCows',
    },
    {
      title: 'Vending Machine',
      category: 'Craft · Kata',
      description:
        'Une machine distributrice traitée comme un vrai domaine : monnaie, stock, remboursement et règles métier restent indépendants de l’interface.',
      proof:
        'Un terrain de pratique pour le refactoring guidé par les tests et le design qui émerge du comportement plutôt que d’un diagramme figé.',
      technologies: ['DDD', 'TDD', 'Clean Code'],
      url: 'https://github.com/VivienBio/VendingMachine',
    },
    {
      title: 'CodinGame',
      category: 'Algorithmes · Optimisation',
      description:
        'Des problèmes d’algorithmes comme salle d’entraînement : comprendre vite, choisir la bonne complexité et livrer une stratégie robuste sous contrainte.',
      proof:
        'Grand Maître CodinGame, dans le top 0,1 % mondial : une pratique régulière de l’optimisation et du raisonnement algorithmique.',
      technologies: ['Algorithms', 'Optimisation', 'IA'],
      url: 'https://www.codingame.com/profile/534d2045d7dc0057e6d53d29336657fe6190191',
    },
  ],
  workingStyle: [
    {
      index: '01',
      kind: 'strength',
      title: 'Voir le système dans son ensemble',
      description:
        'Je relie volontiers le besoin métier, le code, la livraison et la production pour éviter qu’une bonne décision locale crée une dette ailleurs.',
      practice: 'Je rends les compromis explicites avant de choisir une direction technique.',
    },
    {
      index: '02',
      kind: 'strength',
      title: 'Rendre le complexe praticable',
      description:
        'J’aime transformer une zone floue en règles compréhensibles, tests utiles et étapes de livraison réalistes.',
      practice:
        'Je commence par le comportement attendu, puis je découpe le chemin vers une première valeur livrée.',
    },
    {
      index: '03',
      kind: 'strength',
      title: 'Faire grandir autour du code',
      description:
        'Je considère revue de code, mentorat et partage de contexte comme des leviers de qualité aussi importants que l’implémentation elle-même.',
      practice:
        'Je privilégie des standards partagés pour que les décisions ne reposent pas sur une seule personne.',
    },
    {
      index: '04',
      kind: 'vigilance',
      title: 'Exigeant sur la qualité',
      description:
        'Je challenge naturellement un raccourci qui risque de coûter cher plus tard. Sans cadre, cette exigence peut ralentir une décision.',
      practice:
        'Je calibre le niveau de qualité au risque, au délai et à la valeur réellement attendue.',
    },
    {
      index: '05',
      kind: 'vigilance',
      title: 'À l’aise dans le détail',
      description:
        'Sur un sujet structurel, j’ai tendance à descendre vite dans les mécanismes techniques pour comprendre ce qui se joue vraiment.',
      practice:
        'Je timeboxe l’analyse et je partage une décision courte, avec ses alternatives et ses conséquences.',
    },
    {
      index: '06',
      kind: 'vigilance',
      title: 'Direct dans le feedback',
      description:
        'Je préfère nommer tôt un risque ou un désaccord plutôt que laisser une ambiguïté s’installer dans l’équipe.',
      practice:
        'Je relie toujours le feedback à des faits, à son intention et à une prochaine action concrète.',
    },
  ],
  certifications: [
    'Domain-Driven Design — Julien Topçu',
    'C# avancé — Valtech',
    'Design patterns — Learning Tree',
    'Management — EFE',
    'SAFe Release Train Engineer 6.0',
    'Sécurité applicative',
    'Azure & DevOps',
    'Datadog & observabilité',
    'Recrutement tech — Mobiskill',
  ],
});

const ENGLISH_PORTFOLIO: Portfolio = deepFreeze({
  ...FRENCH_PORTFOLIO,
  expertises: [
    {
      ...FRENCH_PORTFOLIO.expertises[0]!,
      title: 'Software engineering',
      description:
        'Making complex domains explicit, tested, and safe to change: a protected domain, clear use cases, and dependencies that do not dictate the solution.',
      technologies: ['C#', '.NET / ASP.NET Core', 'DDD', 'Hexagonal', 'CQRS', 'TDD'],
    },
    {
      ...FRENCH_PORTFOLIO.expertises[1]!,
      title: 'Distributed systems & messaging',
      description:
        'Designing services that stay correct when everything is asynchronous: clean boundaries, resilience, and event flows under control.',
      technologies: ['Microservices', 'Kafka', 'Messaging', 'Resilience'],
    },
    {
      ...FRENCH_PORTFOLIO.expertises[2]!,
      title: 'Cloud & platform',
      description:
        'Treating the platform as a product: reproducible, secure, observable — with production signals that lead to action.',
      technologies: [
        'AWS (ECS/Fargate)',
        'Azure (AKS)',
        'Docker',
        'Terraform / Terragrunt',
        'Datadog',
      ],
    },
    {
      ...FRENCH_PORTFOLIO.expertises[3]!,
      title: 'Delivery & quality',
      description:
        'Shortening the path from decision to production without cutting corners: pipelines, quality gates, and security built in.',
      technologies: ['GitHub Actions', 'CI/CD', 'Dagger', 'SonarQube', 'Checkmarx / Snyk'],
    },
    {
      ...FRENCH_PORTFOLIO.expertises[4]!,
      title: 'Full stack & frontend',
      description:
        'Interfaces that respect both the user and the domain model behind them: from API to Angular experience, reliable and accessible.',
      technologies: ['Angular', 'TypeScript', 'SQL / NoSQL', 'Accessibility', 'SSR'],
    },
    {
      ...FRENCH_PORTFOLIO.expertises[5]!,
      title: 'Technical leadership',
      description:
        'Raising the level of the team, not just the code: shared direction, explicit decisions, and lasting autonomy.',
      technologies: ['Roadmaps', 'Architecture reviews', 'Mentoring', 'Hiring', 'Standards'],
    },
  ],
  experiences: [
    {
      ...FRENCH_PORTFOLIO.experiences[0]!,
      period: 'Since 2026',
      summary:
        'I contribute to a proprietary sports-pricing chain: generating our own probabilities to offer bettors controlled odds faster, with greater autonomy than relying exclusively on external providers.',
      achievements: [
        'Simulating match outcomes with Monte Carlo methods across numerous sports and competitions to estimate probabilities',
        'Turning those probabilities into internally controlled odds to improve speed, control, and independence',
        'Handling complex market-lifecycle rules, including deciding when a market must be suspended or reopened',
        'Assessing compute acceleration through a GPU proof of concept and automating delivery on AWS with Dagger and GitHub Actions',
        'Building a replay, tracing, and analysis console to reproduce events, understand algorithmic decisions, and fix issues safely',
        'Building Claude Code and Cursor into the team’s workflow through reusable skills, commands, agents, routines, and AI loops',
      ],
      technologies: [
        'C# / .NET',
        'Monte Carlo / GPU',
        'Sports pricing',
        'Quant',
        'AWS',
        'Dagger / GHA',
        'Claude Code / Cursor',
      ],
    },
    {
      ...FRENCH_PORTFOLIO.experiences[1]!,
      role: 'Tech Lead / Software Architect',
      period: 'Mar 2022 — 2026',
      summary:
        'As the technical reference for two multidisciplinary teams, I led the advertising-system redesign: 11 projects brought to production, 4 more underway, and over 80 incidents resolved.',
      achievements: [
        'Giving teams a shared direction through architecture, roadmaps, prioritization, coaching, hiring, and delivery discipline',
        'Reducing lead time and resolving over 80 incidents through Accelerate practices, testing, and observability',
        'Modernizing VB6-era legacy toward .NET 6/8, Angular, Azure, and AKS with API governance and application security',
        'Exploring focused AI use cases: Copilot-assisted development and automated editorial validation of videos',
      ],
    },
    {
      ...FRENCH_PORTFOLIO.experiences[2]!,
      role: 'Senior Developer → Tech Lead / Technical Manager',
      period: 'Dec 2017 — Feb 2022',
      summary:
        'I progressed from senior developer to technical manager of a nine-person team, contributing to the digital transformation of a network of over 500 branches.',
      achievements: [
        'Launching Easy Péage, announced as Europe’s first in-vehicle toll-payment service for rental cars',
        'Digitizing the journey through check-in, Yousign e-signature, WeProov inspections, and high-traffic e-commerce',
        'Building microservices, dynamic pricing, an ANTAI interface, and a GDPR-compliant customer data platform',
        'Automating CI/CD, Docker, AWS, and ELK delivery while hiring and growing the engineering team',
      ],
    },
    {
      ...FRENCH_PORTFOLIO.experiences[3]!,
      role: 'R&D Project Lead → R&D Team Lead',
      period: 'Dec 2012 — Nov 2017',
      summary:
        'I progressed from project lead to manager of an eight-person R&D team working on a new range of in-vitro diagnostic instruments.',
      achievements: [
        'Designing the C# patient-results calculation framework in a regulated medical environment',
        'Refactoring critical modules with TDD, SOLID, MVVM, and TeamCity continuous integration',
        'Planning deliverables, hiring, training, and tracking performance for an eight-person team',
        'Managing suppliers and structuring requirements traceability in IBM Rational DOORS',
      ],
    },
    {
      ...FRENCH_PORTFOLIO.experiences[4]!,
      role: 'Junior Software Engineer',
      period: 'Apr — Nov 2012',
      summary:
        'My first role in civil-engineering software: completing a business framework and building tools that safeguard design data.',
      achievements: [
        'Developing an interactive parametric-expression editor',
        'Building tools to validate and repair data integrity',
      ],
    },
    {
      ...FRENCH_PORTFOLIO.experiences[5]!,
      role: 'VB.NET Developer Intern',
      period: 'Feb — Jul 2011',
      summary:
        'I built tools for monitoring hydrocarbon-transport audits across Africa and the Middle East, connecting data with operational safety.',
      achievements: [
        'Designing an Access database and VB.NET / Excel interfaces to centralize audit information',
        'Automating dashboards to reduce reporting errors and improve traceability',
      ],
    },
  ],
  projects: [
    {
      ...FRENCH_PORTFOLIO.projects[0]!,
      category: 'Architecture · Angular · Cloud',
      description:
        'A portfolio built as a product: it explains my background, exposes my architecture decisions, and offers a conversation grounded in verified information.',
      proof:
        'Angular SSR, hexagonal architecture, TDD, accessibility checks, and a GCP deployment designed with no browser-side secrets.',
    },
    {
      ...FRENCH_PORTFOLIO.projects[1]!,
      category: 'TDD · Domain Design',
      description:
        'More than a game: a C# lab for modelling rules, letting tests shape design, and keeping business behaviour obvious.',
      proof:
        'A deliberately compact codebase where every rule is named, tested, and therefore easy to challenge or evolve.',
    },
    {
      ...FRENCH_PORTFOLIO.projects[2]!,
      category: 'C# · Tests · Business Rules',
      description:
        'A public C# exercise that puts game logic first, with a dedicated test project to lock down rules and edge cases.',
      proof:
        'Another example of a recurring practice: start with expected behaviour, then build code that is simple to verify.',
      technologies: ['C#', 'Tests', 'Business Rules'],
    },
    {
      ...FRENCH_PORTFOLIO.projects[3]!,
      category: 'Craft · Kata',
      description:
        'A vending machine treated as a real domain: currency, stock, refunds, and business rules remain independent from the interface.',
      proof:
        'A practice ground for test-guided refactoring and design that emerges from behaviour rather than a fixed diagram.',
    },
    {
      ...FRENCH_PORTFOLIO.projects[4]!,
      category: 'Algorithms · Optimisation',
      description:
        'Algorithmic problems as a training ground: understand quickly, choose the right complexity, and deliver a resilient strategy under constraints.',
      proof:
        'CodinGame Grand Master, ranked in the global top 0.1%: regular practice in optimisation and algorithmic reasoning.',
      technologies: ['Algorithms', 'Optimisation', 'AI'],
    },
  ],
  workingStyle: [
    {
      ...FRENCH_PORTFOLIO.workingStyle[0]!,
      title: 'Seeing the whole system',
      description:
        'I connect the business need, the code, delivery, and production so that a good local decision does not create debt somewhere else.',
      practice: 'I make trade-offs explicit before choosing a technical direction.',
    },
    {
      ...FRENCH_PORTFOLIO.workingStyle[1]!,
      title: 'Making complexity workable',
      description:
        'I enjoy turning an unclear area into understandable rules, useful tests, and realistic delivery steps.',
      practice:
        'I start with expected behaviour, then break the path down to a first piece of delivered value.',
    },
    {
      ...FRENCH_PORTFOLIO.workingStyle[2]!,
      title: 'Growing capability through code',
      description:
        'I see code review, mentoring, and shared context as quality levers just as important as implementation itself.',
      practice: 'I favour shared standards so that decisions do not depend on one person.',
    },
    {
      ...FRENCH_PORTFOLIO.workingStyle[3]!,
      title: 'High standards for quality',
      description:
        'I naturally challenge a shortcut that may become expensive later. Without a framework, that level of care can slow a decision.',
      practice: 'I calibrate the level of quality to risk, time, and the value actually expected.',
    },
    {
      ...FRENCH_PORTFOLIO.workingStyle[4]!,
      title: 'Comfortable in the detail',
      description:
        'On a structural topic, I tend to go quickly into technical mechanics to understand what is really at stake.',
      practice:
        'I timebox the analysis and share a concise decision with alternatives and consequences.',
    },
    {
      ...FRENCH_PORTFOLIO.workingStyle[5]!,
      title: 'Direct with feedback',
      description:
        'I prefer naming a risk or disagreement early rather than allowing ambiguity to settle into the team.',
      practice: 'I always connect feedback to facts, its intent, and one concrete next action.',
    },
  ],
  certifications: [
    'Domain-Driven Design — Julien Topçu',
    'Advanced C# — Valtech',
    'Design Patterns — Learning Tree',
    'Management — EFE',
    'SAFe Release Train Engineer 6.0',
    'Application Security',
    'Azure & DevOps',
    'Datadog & Observability',
    'Technical Recruitment — Mobiskill',
  ],
});

export class LocalPortfolioRepository implements PortfolioRepository {
  getPortfolio(locale: PortfolioLocale = 'fr'): Portfolio {
    return locale === 'en' ? ENGLISH_PORTFOLIO : FRENCH_PORTFOLIO;
  }
}
