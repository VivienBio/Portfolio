import { PortfolioLocale } from '../../core/domain/portfolio.models';

export type CaseStudySlug = 'betclic' | 'tf1';

export interface CaseStudyDecision {
  readonly title: string;
  readonly problem: string;
  readonly options: string;
  readonly decision: string;
  readonly tradeOff: string;
}

export interface CaseStudySection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export interface CaseStudyCopy {
  readonly slug: CaseStudySlug;
  readonly kicker: string;
  readonly title: string;
  readonly accent: string;
  readonly roleLine: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly context: CaseStudySection;
  readonly challenge: CaseStudySection;
  readonly role: CaseStudySection;
  readonly constraintsHeading: string;
  readonly constraints: readonly string[];
  readonly architecture: CaseStudySection;
  readonly diagram: {
    readonly label: string;
    readonly stages: readonly { readonly name: string; readonly detail: string }[];
    readonly loop: string;
  };
  readonly decisionsHeading: string;
  readonly decisionsIntro: string;
  readonly decisionLabels: {
    readonly problem: string;
    readonly options: string;
    readonly decision: string;
    readonly tradeOff: string;
  };
  readonly decisions: readonly CaseStudyDecision[];
  readonly outcomesHeading: string;
  readonly outcomes: readonly string[];
  readonly learnedHeading: string;
  readonly learned: readonly string[];
  readonly stackHeading: string;
  readonly stack: readonly string[];
  readonly backToHome: string;
  readonly otherCase: { readonly label: string; readonly path: string };
  readonly contactCta: { readonly title: string; readonly action: string; readonly href: string };
}

const EN_BETCLIC: CaseStudyCopy = {
  slug: 'betclic',
  kicker: 'Case study · Betclic Group · Since Oct 2025',
  title: 'Real-time sports odds,',
  accent: 'priced in-house.',
  roleLine: 'Senior Software Engineer — Quant & sports pricing · C#/.NET · AWS',
  metaTitle: 'Real-time sports pricing at Betclic — case study · Vivien Billot',
  metaDescription:
    'Working on a proprietary sports-pricing chain that turns Monte Carlo simulations into live odds: market lifecycle, replay tooling, and automated delivery on AWS.',
  context: {
    heading: 'Context',
    paragraphs: [
      'Betclic is one of Europe’s largest sports-betting operators. The odds a bettor sees are a price — and a price that is wrong or late is immediately exploitable by the market. Most operators buy those prices from external providers. Betclic is building its own pricing chain: in-house probability models feeding odds it controls, across many sports and competitions, to react faster and depend less on any single provider.',
    ],
  },
  challenge: {
    heading: 'Challenge',
    paragraphs: [
      'Three properties are in permanent tension. The system must be right — probabilities and odds move real money on every market, on every match. It must be fast — a price that reacts late to a match event is a free option for sharp bettors. And it must be explainable — when an algorithm suspends a market or a price looks wrong, the business needs to know why, quickly and with evidence.',
    ],
  },
  role: {
    heading: 'My role',
    paragraphs: [
      'Senior Software Engineer on the Quant side, in C#/.NET on AWS. I contribute to the simulation-to-odds chain — including the market-lifecycle rules that decide when a market must be suspended or reopened — and I own the replay and tracing console, delivery automation, and the team’s AI-assisted engineering practice.',
    ],
  },
  constraintsHeading: 'Constraints',
  constraints: [
    'Real time: match events keep coming whether the system is ready or not.',
    'Correctness under concurrency: markets are recomputed and re-decided continuously across sports.',
    'Auditability: an algorithmic decision that cannot be replayed cannot be trusted or fixed.',
    'Confidentiality: this case study sticks to what Betclic has shared publicly — no internal architecture detail.',
  ],
  architecture: {
    heading: 'How it fits together',
    paragraphs: [
      'Match events feed Monte Carlo simulations that estimate outcome probabilities across sports and competitions. Probabilities become internally controlled odds under business rules, and market-lifecycle logic makes the sensitive calls — suspend, reopen, recompute, investigate. Wrapped around the chain: a replay and tracing console that can re-run past events and show why the algorithms decided what they decided, and delivery on AWS automated with Dagger and GitHub Actions.',
    ],
  },
  diagram: {
    label: 'Simulation-to-odds chain (public-level view)',
    stages: [
      { name: 'Match events', detail: 'live, continuous' },
      { name: 'Monte Carlo simulation', detail: 'outcome probabilities' },
      { name: 'Pricing', detail: 'internally controlled odds' },
      { name: 'Market lifecycle', detail: 'suspend · reopen · recompute' },
    ],
    loop: 'Replay & tracing console — re-run events, explain decisions, validate fixes',
  },
  decisionsHeading: 'Key decisions',
  decisionsIntro:
    'Pricing in-house rather than depending exclusively on providers is Betclic’s strategic call — it sets the bar my work has to meet: own the models means own the errors. These are decisions I made within that frame.',
  decisionLabels: {
    problem: 'Problem',
    options: 'Options',
    decision: 'Decision',
    tradeOff: 'Trade-off',
  },
  decisions: [
    {
      title: 'Make algorithmic decisions replayable.',
      problem:
        '“The algorithm did something odd yesterday” is unanswerable without evidence — and a question you cannot answer is a system you cannot trust.',
      options: 'Logs and dashboards only, or a dedicated replay and tracing console.',
      decision:
        'I built the replay console: reproduce past events, trace each algorithmic decision, validate a fix against reality before it ships.',
      tradeOff:
        'Tooling like this ships no visible feature. It pays for itself the first time a market anomaly must be explained with proof instead of guesses.',
    },
    {
      title: 'Prove out GPU acceleration before committing.',
      problem: 'Monte Carlo simulation is compute-hungry; the instinct is to reach for GPUs.',
      options: 'Commit to a GPU migration, or measure first on a bounded proof of concept.',
      decision:
        'I ran the proof of concept to get numbers before any architectural commitment. The figures stay internal — the method is the point: measure, then commit.',
      tradeOff: 'A POC costs weeks; an unvetted architecture bet costs quarters.',
    },
    {
      title: 'Make AI-assisted engineering a system, not a habit.',
      problem:
        'AI coding tools used ad hoc produce inconsistent results and unreviewable shortcuts.',
      options: 'Leave usage to individuals, or build shared, reviewable workflows.',
      decision:
        'I build Claude Code and Cursor into the team’s workflow: reusable skills, commands, agents, routines, and review loops.',
      tradeOff:
        'Standardizing costs setup time and discipline — in exchange, repeatable work gets faster without delegating judgment to the tools.',
    },
  ],
  outcomesHeading: 'Where it stands',
  outcomes: [
    'Proprietary probabilities and odds across many sports and competitions, controlled in-house.',
    'Faster reaction to in-game events, with the risk controls to back it up — suspend and reopen decisions under explicit, testable rules.',
    'Market anomalies analyzed with evidence, through replay and decision tracing.',
    'Reduced exclusive dependence on external providers.',
  ],
  learnedHeading: 'What I learned',
  learned: [
    'In a pricing system, observability is not a production concern — it is a product feature. The replay console changed how the team talks about anomalies: from opinions to evidence.',
    'A proof of concept is the cheapest architecture insurance you will ever buy.',
  ],
  stackHeading: 'Stack & practices',
  stack: ['C# / .NET', 'Monte Carlo', 'AWS', 'Dagger', 'GitHub Actions', 'Claude Code / Cursor'],
  backToHome: 'Back to the portfolio',
  otherCase: { label: 'Next case study: TF1 →', path: '/work/tf1' },
  contactCta: {
    title: 'Working on a system where wrong answers are expensive?',
    action: 'Let’s talk',
    href: 'mailto:billot.vivien@gmail.com?subject=Contact%20portfolio%20-%20Vivien%20Billot',
  },
};

const EN_TF1: CaseStudyCopy = {
  slug: 'tf1',
  kicker: 'Case study · TF1 Group · Mar 2022–Oct 2025',
  title: 'Modernizing the ad platform',
  accent: 'without stopping it.',
  roleLine: 'Tech Lead / Software Architect — two cross-functional teams',
  metaTitle: "Modernizing TF1's advertising platform — case study · Vivien Billot",
  metaDescription:
    "Tech Lead of two teams on TF1's advertising platform from March 2022 to October 2025: VB6 legacy to .NET 6/8 and AKS, 11 projects shipped to production, delivery without interruption.",
  context: {
    heading: 'Context',
    paragraphs: [
      'TF1 is France’s largest private broadcaster; advertising is the revenue engine, and the advertising platform is where campaigns become money. When I joined in 2022, that system carried years of history — including VB6-era code — while the business kept selling, planning, and airing every day.',
    ],
  },
  challenge: {
    heading: 'Challenge',
    paragraphs: [
      'Modernize the system — stack, architecture, practices — while it kept running the business. No freeze, no big-bang rewrite, no broken commitments. The classic modernization trap is choosing between delivery and transformation; the job was to do both.',
    ],
  },
  role: {
    heading: 'My role',
    paragraphs: [
      'I owned technical direction for two cross-functional teams: architecture, roadmaps, prioritization, coaching, hiring, and delivery commitments. Decisions were written down, argued, and owned by the teams — my job was to make sure they were made, not to make them alone.',
    ],
  },
  constraintsHeading: 'Constraints',
  constraints: [
    'Business continuity: advertising operations could not stop for a migration.',
    'Legacy depth: VB6-era systems with implicit rules that existed nowhere but in the code and in people’s heads.',
    'Exposure: incidents in an ad system are measured in money and in trust.',
    'Two teams, one direction: consistent architecture and standards across parallel streams.',
  ],
  architecture: {
    heading: 'How it fits together',
    paragraphs: [
      'The modernization ran as an incremental replacement, not a rewrite: new .NET 6/8 services and Angular frontends took over domains step by step, behind governed APIs (Apigee), deployed on Azure and AKS, with Datadog observability and security scanning (Checkmarx, Snyk) wired into the delivery pipeline. The legacy shrank as the new system proved itself — domain by domain, release by release.',
    ],
  },
  diagram: {
    label: 'Incremental replacement, domain by domain',
    stages: [
      { name: 'VB6-era legacy', detail: 'shrinking, still serving' },
      { name: 'Governed APIs', detail: 'Apigee · one contract' },
      { name: '.NET 6/8 + Angular', detail: 'new services, domain by domain' },
      { name: 'Azure · AKS', detail: 'CI/CD · Datadog · security scans' },
    ],
    loop: 'Each domain moves only when its replacement is proven in production',
  },
  decisionsHeading: 'Key decisions',
  decisionsIntro: '',
  decisionLabels: {
    problem: 'Problem',
    options: 'Options',
    decision: 'Decision',
    tradeOff: 'Trade-off',
  },
  decisions: [
    {
      title: 'Incremental replacement over big-bang rewrite.',
      problem: 'A legacy system that runs the revenue cannot be frozen for a multi-year rewrite.',
      options: 'Big-bang rewrite, or incremental, domain-by-domain replacement.',
      decision: 'Incremental. Each domain moved when its replacement was proven in production.',
      tradeOff:
        'We accepted running old and new in parallel — double run cost and boundary complexity — in exchange for keeping every business commitment through four years of transformation.',
    },
    {
      title: 'Make quality the delivery accelerator, not its tax.',
      problem: 'Modernizing while shipping means quality regressions compound fast.',
      options: 'Inspect quality at the end, or build it into the loop.',
      decision:
        'Accelerate-style practices: tests that lock business rules, code review standards, observability, and a shorter feedback loop.',
      tradeOff: 'Slower first commits, faster everything after.',
    },
    {
      title: 'One architecture direction across two teams.',
      problem: 'Two teams modernizing in parallel can produce two systems.',
      options: 'Team-local choices, or shared architecture governance.',
      decision:
        'Shared standards, explicit architecture decisions, and API governance — written down, argued, and owned by the teams rather than imposed.',
      tradeOff: 'Alignment costs meetings; divergence costs years.',
    },
  ],
  outcomesHeading: 'Outcomes',
  outcomes: [
    '11 projects shipped to production, with four more underway when I left — while the business kept running.',
    'VB6-era code gradually replaced with .NET 6/8, Angular, Azure, and AKS.',
    'Lead time reduced through testing, observability, and Accelerate practices.',
    '80+ production incidents resolved without pausing the modernization — each followed by a post-incident loop, with recurring classes of failure designed out over time.',
    'Two teams grown through clear framing, shared decisions, and lasting standards — including hiring and coaching.',
  ],
  learnedHeading: 'What I learned',
  learned: [
    'Modernization is a delivery discipline before it is a technical one: the moment transformation stops shipping business value, it loses its mandate.',
    'Implicit knowledge is the real legacy — half the work was making rules explicit enough to be tested, challenged, and safely replaced.',
  ],
  stackHeading: 'Stack & practices',
  stack: [
    '.NET 6/8',
    'Angular',
    'Azure',
    'AKS',
    'Apigee',
    'Datadog',
    'Checkmarx',
    'Snyk',
    'Accelerate practices',
  ],
  backToHome: 'Back to the portfolio',
  otherCase: { label: 'Next case study: Betclic →', path: '/work/betclic' },
  contactCta: {
    title: 'Facing a modernization that cannot stop the business?',
    action: 'Let’s talk',
    href: 'mailto:billot.vivien@gmail.com?subject=Contact%20portfolio%20-%20Vivien%20Billot',
  },
};

const FR_BETCLIC: CaseStudyCopy = {
  slug: 'betclic',
  kicker: 'Étude de cas · Betclic Group · Depuis octobre 2025',
  title: 'Des cotes sportives temps réel,',
  accent: 'produites en interne.',
  roleLine: 'Senior Software Engineer — Quant & pricing sportif · C#/.NET · AWS',
  metaTitle: 'Pricing sportif temps réel chez Betclic — étude de cas · Vivien Billot',
  metaDescription:
    'Contribuer à une chaîne de pricing sportif propriétaire qui transforme des simulations Monte-Carlo en cotes live : cycle de vie des marchés, outillage de replay, delivery automatisé sur AWS.',
  context: {
    heading: 'Contexte',
    paragraphs: [
      'Betclic est l’un des plus grands opérateurs de paris sportifs en Europe. La cote affichée à un parieur est un prix — et un prix faux ou en retard est immédiatement exploitable par le marché. La plupart des opérateurs achètent ces prix à des providers externes. Betclic construit sa propre chaîne de pricing : des modèles de probabilités internes qui alimentent des cotes maîtrisées, sur de nombreux sports et compétitions, pour réagir plus vite et réduire la dépendance exclusive aux providers.',
    ],
  },
  challenge: {
    heading: 'Défi',
    paragraphs: [
      'Trois propriétés sont en tension permanente. Le système doit être juste — probabilités et cotes engagent de l’argent réel sur chaque marché, à chaque match. Il doit être rapide — un prix qui réagit en retard à un événement de match est une option gratuite pour les parieurs affûtés. Et il doit être explicable — quand un algorithme suspend un marché ou qu’un prix semble anormal, le métier doit savoir pourquoi, vite et avec des preuves.',
    ],
  },
  role: {
    heading: 'Mon rôle',
    paragraphs: [
      'Senior Software Engineer côté Quant, en C#/.NET sur AWS. Je contribue à la chaîne simulation → cotes — y compris les règles de cycle de vie qui décident quand un marché doit être suspendu ou rouvert — et je porte le back-office de replay et de traçage, l’automatisation du delivery et la pratique d’ingénierie assistée par IA de l’équipe.',
    ],
  },
  constraintsHeading: 'Contraintes',
  constraints: [
    'Temps réel : les événements de match arrivent, que le système soit prêt ou non.',
    'Justesse sous concurrence : les marchés sont recalculés et re-décidés en continu, sur plusieurs sports.',
    'Auditabilité : une décision algorithmique qui ne peut pas être rejouée ne peut être ni vérifiée ni corrigée.',
    'Confidentialité : cette étude de cas s’en tient à ce que Betclic communique publiquement — aucun détail d’architecture interne.',
  ],
  architecture: {
    heading: 'Comment ça s’articule',
    paragraphs: [
      'Les événements de match alimentent des simulations Monte-Carlo qui estiment les probabilités d’issue sur de nombreux sports et compétitions. Les probabilités deviennent des cotes maîtrisées en interne selon des règles métier, et la logique de cycle de vie des marchés prend les décisions sensibles — suspendre, rouvrir, recalculer, investiguer. Autour de la chaîne : un back-office de replay et de traçage capable de rejouer les événements passés et de montrer pourquoi les algorithmes ont décidé ce qu’ils ont décidé, et un delivery sur AWS automatisé avec Dagger et GitHub Actions.',
    ],
  },
  diagram: {
    label: 'Chaîne simulation → cotes (vue publique)',
    stages: [
      { name: 'Événements de match', detail: 'live, en continu' },
      { name: 'Simulation Monte-Carlo', detail: 'probabilités d’issue' },
      { name: 'Pricing', detail: 'cotes maîtrisées en interne' },
      { name: 'Cycle de vie des marchés', detail: 'suspendre · rouvrir · recalculer' },
    ],
    loop: 'Back-office de replay & traçage — rejouer, expliquer, valider les correctifs',
  },
  decisionsHeading: 'Décisions clés',
  decisionsIntro:
    'Produire le pricing en interne plutôt que dépendre exclusivement de providers est un choix stratégique de Betclic — il fixe l’exigence de mon travail : posséder les modèles, c’est posséder les erreurs. Voici les décisions que j’ai prises dans ce cadre.',
  decisionLabels: {
    problem: 'Problème',
    options: 'Options',
    decision: 'Décision',
    tradeOff: 'Compromis',
  },
  decisions: [
    {
      title: 'Rendre les décisions algorithmiques rejouables.',
      problem:
        '« L’algorithme a fait quelque chose d’étrange hier » est une question sans réponse en l’absence de preuves — et une question sans réponse, c’est un système auquel on ne peut pas faire confiance.',
      options:
        'Se contenter de logs et de dashboards, ou construire un back-office dédié de replay et de traçage.',
      decision:
        'J’ai construit le back-office de replay : rejouer les événements passés, tracer chaque décision algorithmique, valider un correctif contre la réalité avant sa mise en production.',
      tradeOff:
        'Ce type d’outillage ne livre aucune feature visible. Il se rembourse à la première anomalie de marché qu’il faut expliquer avec des preuves plutôt qu’avec des hypothèses.',
    },
    {
      title: 'Qualifier l’accélération GPU avant de s’engager.',
      problem:
        'La simulation Monte-Carlo est gourmande en calcul ; le réflexe est de foncer vers le GPU.',
      options: 'S’engager dans une migration GPU, ou mesurer d’abord sur un POC borné.',
      decision:
        'J’ai mené le POC pour obtenir des chiffres avant tout engagement d’architecture. Les chiffres restent internes — c’est la méthode qui compte : mesurer, puis s’engager.',
      tradeOff:
        'Un POC coûte des semaines ; un pari d’architecture non vérifié coûte des trimestres.',
    },
    {
      title: 'Faire de l’ingénierie assistée par IA un système, pas une habitude.',
      problem:
        'Des outils IA utilisés au cas par cas produisent des résultats inconstants et des raccourcis difficiles à relire.',
      options: 'Laisser chacun s’outiller, ou construire des workflows partagés et relisibles.',
      decision:
        'J’intègre Claude Code et Cursor au workflow de l’équipe : skills, commandes, agents, routines et boucles de revue réutilisables.',
      tradeOff:
        'Standardiser coûte du temps de mise en place et de la discipline — en échange, le travail répétable accélère sans déléguer le jugement aux outils.',
    },
  ],
  outcomesHeading: 'Où ça en est',
  outcomes: [
    'Des probabilités et des cotes propriétaires sur de nombreux sports et compétitions, maîtrisées en interne.',
    'Une réaction plus rapide aux événements de jeu, avec les garde-fous de risque correspondants — suspension et réouverture sous règles explicites et testables.',
    'Des anomalies de marché analysées avec des preuves, grâce au replay et au traçage des décisions.',
    'Une dépendance exclusive aux providers externes réduite.',
  ],
  learnedHeading: 'Ce que j’en retiens',
  learned: [
    'Dans un système de pricing, l’observabilité n’est pas un sujet de production — c’est une fonctionnalité du produit. Le back-office de replay a changé la façon dont l’équipe parle des anomalies : des opinions aux preuves.',
    'Un POC est l’assurance d’architecture la moins chère qui existe.',
  ],
  stackHeading: 'Stack & pratiques',
  stack: ['C# / .NET', 'Monte-Carlo', 'AWS', 'Dagger', 'GitHub Actions', 'Claude Code / Cursor'],
  backToHome: 'Retour au portfolio',
  otherCase: { label: 'Étude de cas suivante : TF1 →', path: '/fr/work/tf1' },
  contactCta: {
    title: 'Un système où l’erreur coûte cher ?',
    action: 'Parlons-en',
    href: 'mailto:billot.vivien@gmail.com?subject=Contact%20portfolio%20-%20Vivien%20Billot',
  },
};

const FR_TF1: CaseStudyCopy = {
  slug: 'tf1',
  kicker: 'Étude de cas · Groupe TF1 · Mars 2022–octobre 2025',
  title: 'Moderniser le SI publicitaire',
  accent: 'sans l’arrêter.',
  roleLine: 'Tech Lead / Architecte — deux équipes pluridisciplinaires',
  metaTitle: 'Moderniser le SI publicitaire de TF1 — étude de cas · Vivien Billot',
  metaDescription:
    'Tech Lead de deux équipes sur le SI publicitaire de TF1 de mars 2022 à octobre 2025 : du legacy VB6 vers .NET 6/8 et AKS, 11 projets mis en production, sans interrompre le métier.',
  context: {
    heading: 'Contexte',
    paragraphs: [
      'TF1 est le premier diffuseur privé français ; la publicité est le moteur de revenus, et le SI publicitaire est l’endroit où les campagnes deviennent de l’argent. À mon arrivée en 2022, ce système portait des années d’histoire — dont du code de l’ère VB6 — pendant que le métier continuait de vendre, planifier et diffuser chaque jour.',
    ],
  },
  challenge: {
    heading: 'Défi',
    paragraphs: [
      'Moderniser le système — stack, architecture, pratiques — pendant qu’il faisait tourner le métier. Pas de gel, pas de réécriture big-bang, pas d’engagement rompu. Le piège classique de la modernisation est de choisir entre delivery et transformation ; le travail consistait à faire les deux.',
    ],
  },
  role: {
    heading: 'Mon rôle',
    paragraphs: [
      'J’ai porté la direction technique de deux équipes pluridisciplinaires : architecture, roadmaps, priorisation, coaching, recrutement et engagements de delivery. Les décisions étaient écrites, débattues et portées par les équipes — mon rôle était de garantir qu’elles soient prises, pas de les prendre seul.',
    ],
  },
  constraintsHeading: 'Contraintes',
  constraints: [
    'Continuité métier : les opérations publicitaires ne pouvaient pas s’arrêter pour une migration.',
    'Profondeur du legacy : des systèmes de l’ère VB6 avec des règles implicites qui n’existaient nulle part ailleurs que dans le code et dans les têtes.',
    'Exposition : un incident dans un SI publicitaire se mesure en argent et en confiance.',
    'Deux équipes, une direction : une architecture et des standards cohérents sur des chantiers parallèles.',
  ],
  architecture: {
    heading: 'Comment ça s’articule',
    paragraphs: [
      'La modernisation a fonctionné en remplacement incrémental, pas en réécriture : de nouveaux services .NET 6/8 et des frontends Angular ont repris les domaines un à un, derrière des API gouvernées (Apigee), déployés sur Azure et AKS, avec l’observabilité Datadog et les scans de sécurité (Checkmarx, Snyk) intégrés à la chaîne de delivery. Le legacy a rétréci à mesure que le nouveau système faisait ses preuves — domaine par domaine, release par release.',
    ],
  },
  diagram: {
    label: 'Remplacement incrémental, domaine par domaine',
    stages: [
      { name: 'Legacy ère VB6', detail: 'rétrécit, sert encore' },
      { name: 'API gouvernées', detail: 'Apigee · un seul contrat' },
      { name: '.NET 6/8 + Angular', detail: 'nouveaux services, domaine par domaine' },
      { name: 'Azure · AKS', detail: 'CI/CD · Datadog · scans sécurité' },
    ],
    loop: 'Un domaine ne bascule que lorsque son remplaçant a fait ses preuves en production',
  },
  decisionsHeading: 'Décisions clés',
  decisionsIntro: '',
  decisionLabels: {
    problem: 'Problème',
    options: 'Options',
    decision: 'Décision',
    tradeOff: 'Compromis',
  },
  decisions: [
    {
      title: 'Le remplacement incrémental plutôt que la réécriture big-bang.',
      problem:
        'Un système legacy qui fait tourner le revenu ne peut pas être gelé pour une réécriture pluriannuelle.',
      options: 'Réécriture big-bang, ou remplacement incrémental domaine par domaine.',
      decision:
        'Incrémental. Chaque domaine basculait quand son remplaçant avait fait ses preuves en production.',
      tradeOff:
        'Nous avons accepté de faire tourner l’ancien et le nouveau en parallèle — double coût d’exploitation et complexité des frontières — en échange du respect de chaque engagement métier de mars 2022 à octobre 2025.',
    },
    {
      title: 'Faire de la qualité l’accélérateur du delivery, pas sa taxe.',
      problem:
        'Moderniser tout en livrant, c’est voir les régressions de qualité se composer très vite.',
      options: 'Inspecter la qualité à la fin, ou la construire dans la boucle.',
      decision:
        'Des pratiques inspirées d’Accelerate : des tests qui verrouillent les règles métier, des standards de code review, de l’observabilité et une boucle de feedback plus courte.',
      tradeOff: 'Des premiers commits plus lents, tout le reste plus rapide.',
    },
    {
      title: 'Une seule direction d’architecture pour deux équipes.',
      problem: 'Deux équipes qui modernisent en parallèle peuvent produire deux systèmes.',
      options: 'Des choix locaux à chaque équipe, ou une gouvernance d’architecture partagée.',
      decision:
        'Des standards partagés, des décisions d’architecture explicites et une gouvernance d’API — écrites, débattues et portées par les équipes plutôt qu’imposées.',
      tradeOff: 'L’alignement coûte des réunions ; la divergence coûte des années.',
    },
  ],
  outcomesHeading: 'Résultats',
  outcomes: [
    '11 projets mis en production, et quatre autres engagés à mon départ — pendant que le métier continuait de tourner.',
    'Le code de l’ère VB6 progressivement remplacé par .NET 6/8, Angular, Azure et AKS.',
    'Un lead time réduit grâce aux tests, à l’observabilité et aux pratiques Accelerate.',
    'Plus de 80 incidents de production résolus sans mettre la modernisation en pause — chacun suivi d’une boucle post-incident, les classes de défaillance récurrentes étant éliminées par la conception au fil du temps.',
    'Deux équipes qui ont grandi : cadre clair, décisions partagées, standards durables — recrutement et coaching compris.',
  ],
  learnedHeading: 'Ce que j’en retiens',
  learned: [
    'La modernisation est une discipline de delivery avant d’être un sujet technique : dès qu’une transformation cesse de livrer de la valeur métier, elle perd son mandat.',
    'Le vrai legacy, c’est la connaissance implicite — la moitié du travail a consisté à rendre les règles suffisamment explicites pour être testées, challengées et remplacées en sécurité.',
  ],
  stackHeading: 'Stack & pratiques',
  stack: [
    '.NET 6/8',
    'Angular',
    'Azure',
    'AKS',
    'Apigee',
    'Datadog',
    'Checkmarx',
    'Snyk',
    'Pratiques Accelerate',
  ],
  backToHome: 'Retour au portfolio',
  otherCase: { label: 'Étude de cas suivante : Betclic →', path: '/fr/work/betclic' },
  contactCta: {
    title: 'Une modernisation qui ne peut pas arrêter le métier ?',
    action: 'Parlons-en',
    href: 'mailto:billot.vivien@gmail.com?subject=Contact%20portfolio%20-%20Vivien%20Billot',
  },
};

export const CASE_STUDIES: Record<PortfolioLocale, Record<CaseStudySlug, CaseStudyCopy>> = {
  en: { betclic: EN_BETCLIC, tf1: EN_TF1 },
  fr: { betclic: FR_BETCLIC, tf1: FR_TF1 },
};
