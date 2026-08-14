import { AssistantGateway, AssistantGatewayRequest } from '../application/assistant.gateway';
import { PortfolioLocale } from '../domain/portfolio.models';

const ANSWERS = {
  fr: [
    {
      terms: ['je suis gentil', 'gentil', 'sympa', 'ca va', 'comment ca va', 'hello', 'salut'],
      answer:
        'Oui, ça a l’air sympa. Si tu veux, je peux surtout te répondre sur Vivien, son parcours, ses projets ou sa façon de travailler.',
    },
    {
      terms: [
        'retrace',
        'raconte ton parcours',
        'parle moi de ton parcours',
        'presente',
        'qui es tu',
        'parcours',
      ],
      answer:
        'Je suis Senior Software Engineer / Tech Lead, avec un fil conducteur dans mon parcours : rendre des domaines complexes plus lisibles, plus fiables et plus rapides à faire évoluer.\n\nJ’ai construit cette approche dans des contextes exigeants : le médical réglementé chez Stago, la transformation digitale d’un réseau de plus de 500 agences chez Rent A Car, la refonte du SI publicitaire chez TF1 avec deux équipes pluridisciplinaires, puis aujourd’hui le pricing sportif propriétaire chez Betclic, où les probabilités internes, les simulations Monte-Carlo et les décisions de marché ont un impact direct sur le risque et le ROI.\n\nCe qui me caractérise, c’est cette capacité à relier le métier, l’architecture, la qualité, le delivery et la progression des équipes. Je ne cherche pas seulement à livrer une feature : je veux laisser un système plus compréhensible et une équipe plus autonome.',
    },
    {
      terms: [
        'compte le plus',
        'important pour toi',
        'valeur',
        'valeurs',
        'motivation',
        'moteur',
        'priorite',
        'priorites',
      ],
      answer:
        'Ce qui compte le plus pour moi dans un projet, c’est que la solution crée une valeur métier durable, pas seulement une livraison visible le jour de la mise en production.\n\nConcrètement, je regarde trois choses : la clarté du domaine dans le code, la résilience du système en production et la capacité de l’équipe à continuer d’avancer sans dépendre d’une seule personne. C’est pour ça que j’accorde beaucoup d’importance au DDD, aux tests, à l’observabilité, aux pipelines reproductibles et aux standards partagés.\n\nMon exigence vient de là : réduire la dette technique, sécuriser les choix structurants et permettre au collectif de livrer mieux, plus vite et avec moins d’incertitude.',
    },
    {
      terms: ['aides tu une equipe', 'livrer mieux', 'leadership', 'management', 'coaching'],
      answer:
        'J’aide une équipe à livrer mieux en rendant le travail plus clair. Je cherche d’abord à aligner le besoin métier, le modèle, les responsabilités du code et les signaux de production. Ensuite, je transforme cette clarté en pratiques concrètes : découpage réaliste, tests utiles, revues de code, standards communs, CI/CD et observabilité.\n\nChez TF1, cette approche m’a permis d’encadrer deux équipes pendant une modernisation majeure du SI publicitaire, avec 11 projets mis en production, 4 engagés et plus de 80 incidents traités. Chez Rent A Car et Stago, elle s’est aussi traduite par du recrutement, du mentorat, de la planification et la montée en autonomie d’équipes techniques.',
    },
    {
      terms: [
        'distingue',
        'different',
        'pourquoi toi',
        'recrut',
        'force',
        'forces',
        'profil',
        'difference',
        'differenciation',
        'qualite',
        'qualites',
        'defaut',
        'defauts',
      ],
      answer:
        'Ce qui me distingue, c’est la combinaison entre profondeur technique et sens du contexte métier. Je peux descendre dans le détail d’un modèle C# / .NET, d’un pipeline, d’un problème de performance ou d’une architecture hexagonale, tout en gardant la question principale : quel risque réduit-on, quelle valeur crée-t-on, et comment l’équipe pourra-t-elle maintenir ça demain ?\n\nMes forces : structurer le complexe, élever les standards de qualité et faire progresser les équipes autour du code. Mes points de vigilance : je suis exigeant, direct dans le feedback et parfois très vite dans le détail. Je les compense en timeboxant l’analyse, en explicitant les compromis et en reliant toujours mes recommandations à des faits.',
    },
    {
      terms: [
        'gpu',
        'dagger',
        'github actions',
        'gha',
        'replay',
        'tracage',
        'claude code',
        'cursor',
        'agent',
        'skill',
        'workflow',
        'routine',
        'loop',
      ],
      answer:
        'Chez Betclic, je travaille sur une boucle d’ingénierie conçue pour rendre un domaine algorithmique complexe plus rapide à faire évoluer et plus fiable. Un POC GPU évalue l’accélération des calculs intensifs. Le back-office de replay permet de reproduire les événements, suivre les décisions des algorithmes, comprendre un écart et valider un correctif avant remise en production. Le delivery AWS est automatisé avec Dagger et GitHub Actions afin de conserver une pipeline portable et reproductible. Enfin, j’industrialise Claude Code et Cursor avec des skills, commandes, agents, routines, workflows et boucles IA : l’objectif n’est pas de déléguer aveuglément le code, mais de standardiser les tâches répétables, intégrer les contrôles et raccourcir la boucle analyse–implémentation–preuve.',
    },
    {
      terms: [
        'betclic',
        'monte',
        'carlo',
        'quant',
        'synchronisation',
        'simulation',
        'probabilite',
        'cote',
        'market',
        'marche',
        'provider',
        'parieur',
      ],
      answer:
        'Chez Betclic Group, je contribue à produire des probabilités propriétaires et des cotes maîtrisées plutôt que de dépendre exclusivement de providers externes. Des algorithmes et simulations Monte-Carlo modélisent le déroulement de matchs sur de nombreux sports et compétitions. Ces probabilités alimentent ensuite le pricing et des décisions très sensibles, comme suspendre ou rouvrir un marché. L’enjeu métier est direct : réagir plus vite, conserver la maîtrise de la cote et du risque, tout en garantissant la précision, la performance et la résilience de l’écosystème Quant en C# / .NET.',
    },
    {
      terms: [
        'technologie',
        'technologies',
        'techno',
        'techo',
        'stack',
        'outil',
        'outils',
        'competence',
        'competences',
        'langage',
        'langages',
        'framework',
        'frameworks',
      ],
      answer:
        'Voici ma stack, classée par usage :\n• Back-end — C#, .NET et .NET Core.\n• Front-end — Angular et TypeScript.\n• Données — SQL Server, PostgreSQL, Oracle et MongoDB.\n• Architecture & conception — DDD, architecture hexagonale, CQRS, REST et SOLID.\n• Cloud & delivery — Azure, AWS, Kubernetes, AKS, Docker et CI/CD.\n• Intégration & observabilité — APIGEE, IBM API Connect, Datadog, Application Insights et ELK.\n• Sécurité applicative — Checkmarx, Snyk, SonarQube et pratiques OWASP.\n• Qualité — TDD, NUnit, XUnit, Vitest, TeamCity et software craftsmanship.\nCette organisation traduit ma manière de travailler : clarifier le métier, sécuriser la solution, automatiser sa livraison et la rendre observable en production.',
    },
    {
      terms: ['ia', 'intelligence artificielle'],
      answer:
        'J’utilise l’IA comme un levier d’ingénierie reproductible. Chez Betclic, j’industrialise Claude Code et Cursor au moyen de skills, commandes, agents, routines, workflows et boucles IA, afin d’accélérer le développement sans perdre la traçabilité ni la fiabilité. J’ai aussi développé un back-office de replay et d’analyse, mené un POC de calcul GPU et travaillé le delivery AWS avec Dagger et GitHub Actions. Chez TF1, j’avais déjà exploré Copilot et la validation éditoriale automatisée de vidéos. Chaque usage reste lié à un besoin précis, des contrôles et des preuves.',
    },
    {
      terms: ['tdd', 'test', 'tictactoe', 'vending'],
      answer:
        'Le TDD est pour moi un outil de conception. TicTacToe Solver et Vending Machine me servent à faire émerger un modèle où les règles métier sont nommées, testées et donc simples à challenger ou à faire évoluer.',
    },
    {
      terms: ['projet', 'github', 'codingame'],
      answer:
        'Mes projets publics incluent ce portfolio, TicTacToe Solver, BullsAndCows et Vending Machine. Ils mettent l’accent sur le domaine, les tests et la maintenabilité. Je pratique aussi les algorithmes sur CodinGame, où je suis Grand Maître, dans le top 0,1 % mondial.',
    },
    {
      terms: ['recommandation', 'recommandations', 'reco', 'linkedin'],
      answer:
        'Mes recommandations professionnelles sont consultables directement sur LinkedIn. Elles apportent une preuve complémentaire à mon portfolio : des retours de collaborateurs et d’équipes rencontrés dans des contextes techniques exigeants. Je préfère renvoyer vers les témoignages attribués plutôt que reformuler leurs propos sans pouvoir les citer précisément.',
    },
    {
      terms: ['tf1', 'publicit'],
      answer:
        'Chez Groupe TF1, j’ai été le référent technique de deux équipes pluridisciplinaires pendant la refonte du SI publicitaire. Le bilan documenté comprend 11 projets en production, 4 en cours et plus de 80 incidents traités. J’ai défini architecture et roadmaps, piloté la modernisation vers .NET 6/8, Angular, Azure et AKS, renforcé la sécurité avec Checkmarx, Snyk et SonarQube, puis réduit le lead time avec les pratiques Accelerate, les tests et l’observabilité.',
    },
    {
      terms: ['rent', 'location'],
      answer:
        'Chez Rent A Car, j’ai évolué de développeur senior à responsable technique d’une équipe de neuf personnes pour accompagner la transformation de plus de 500 agences. Les réalisations couvrent Easy Péage — présenté comme une première européenne dans la location —, le check-in digital, Yousign, WeProov, le pricing dynamique, l’interface ANTAI, le référentiel client RGPD et la refonte e-commerce à fort trafic.',
    },
    {
      terms: ['stago', 'medical'],
      answer:
        'Chez Stago, j’ai évolué de responsable d’étude à responsable d’une équipe R&D de huit personnes sur des automates de diagnostic in vitro. J’ai conçu un framework C# de calcul des résultats patients, refactoré des modules critiques avec TDD, SOLID et MVVM, structuré l’intégration continue TeamCity et assuré la traçabilité réglementaire avec IBM Rational DOORS.',
    },
    {
      terms: ['software craftsmanship'],
      answer:
        'J’apporte une vision de bout en bout : métier lisible dans le code, qualité de conception, Cloud, livraison continue et accompagnement des équipes. Mon objectif est de laisser un système plus compréhensible et un collectif plus autonome que je ne l’ai trouvé.',
    },
  ],
  en: [
    {
      terms: ['im friendly', 'friendly', 'nice', 'how are you'],
      answer:
        'Yes, you sound friendly. If you want, I can mainly answer about Vivien, his background, projects, or way of working.',
    },
    {
      terms: [
        'walk me through',
        'career path',
        'career',
        'tell me about your path',
        'tell me about yourself',
        'who are you',
        'background',
      ],
      answer:
        'I am a Senior Software Engineer / Tech Lead, with one common thread across my career: making complex domains easier to read, more reliable, and faster to evolve.\n\nI built that approach in demanding contexts: regulated medical software at Stago, the digital transformation of a 500+ branch network at Rent A Car, the redesign of TF1’s advertising systems with two multidisciplinary teams, and today proprietary sports pricing at Betclic, where internal probabilities, Monte Carlo simulations, and market decisions directly impact risk and ROI.\n\nWhat characterises me is the ability to connect business, architecture, quality, delivery, and team growth. I am not only shipping features: I want to leave a clearer system and a more autonomous team.',
    },
    {
      terms: [
        'matters most',
        'most important to you',
        'value',
        'values',
        'motivation',
        'priority',
        'priorities',
      ],
      answer:
        'What matters most to me in a project is durable business value, not only a visible delivery on release day.\n\nIn practice, I look at three things: how clearly the domain is expressed in code, how resilient the system is in production, and whether the team can keep moving without depending on one person. That is why I care about DDD, tests, observability, reproducible pipelines, and shared standards.\n\nMy standards come from that: reduce technical debt, secure structural decisions, and help the team deliver better, faster, and with less uncertainty.',
    },
    {
      terms: ['help a team', 'deliver better', 'leadership', 'management', 'coaching'],
      answer:
        'I help a team deliver better by making the work clearer. I first align the business need, the model, code responsibilities, and production signals. Then I turn that clarity into concrete practices: realistic slicing, useful tests, code reviews, shared standards, CI/CD, and observability.\n\nAt TF1, this helped me lead two teams through a major advertising-system modernisation, with 11 projects brought to production, 4 underway, and over 80 incidents resolved. At Rent A Car and Stago, the same approach included hiring, mentoring, planning, and growing technical autonomy.',
    },
    {
      terms: [
        'different',
        'why you',
        'recruit',
        'strength',
        'strengths',
        'profile',
        'difference',
        'differentiation',
        'quality',
        'qualities',
        'weakness',
        'weaknesses',
      ],
      answer:
        'What makes me different is the combination of technical depth and business context. I can go deep into a C# / .NET model, a pipeline, a performance issue, or a hexagonal architecture, while keeping the main question visible: which risk are we reducing, which value are we creating, and how will the team maintain this tomorrow?\n\nMy strengths are structuring complexity, raising quality standards, and growing teams through code. My watch-outs are that I am demanding, direct with feedback, and sometimes quick to dive into detail. I manage that by timeboxing analysis, making trade-offs explicit, and grounding recommendations in facts.',
    },
    {
      terms: [
        'gpu',
        'dagger',
        'github actions',
        'gha',
        'replay',
        'tracing',
        'claude code',
        'cursor',
        'agent',
        'skill',
        'workflow',
        'routine',
        'loop',
      ],
      answer:
        'At Betclic, I work on an engineering loop designed to make a complex algorithmic domain faster and safer to evolve. A GPU proof of concept assesses acceleration for compute-intensive workloads. The replay back office reproduces events, traces algorithmic decisions, explains discrepancies, and validates a fix before it returns to production. AWS delivery is automated with Dagger and GitHub Actions to keep the pipeline portable and reproducible. I also industrialise Claude Code and Cursor through skills, commands, agents, routines, workflows, and AI loops: the goal is not to delegate code blindly, but to standardise repeatable tasks, embed controls, and shorten the analysis–implementation–evidence loop.',
    },
    {
      terms: [
        'betclic',
        'monte',
        'carlo',
        'quant',
        'synchronisation',
        'simulation',
        'quantitative',
        'probability',
        'probabilities',
        'odds',
        'market',
        'provider',
        'bettor',
        'pricing',
      ],
      answer:
        'At Betclic Group, I help produce proprietary probabilities and controlled odds instead of relying exclusively on external providers. Algorithms and Monte Carlo simulations model matches across numerous sports and competitions. Those probabilities then power pricing and sensitive decisions such as suspending or reopening a market. The business value is direct: react faster, retain control over odds and risk, while ensuring accuracy, performance, and resilience across the C# / .NET Quant ecosystem.',
    },
    {
      terms: [
        'technology',
        'technologies',
        'tech',
        'stack',
        'tool',
        'tools',
        'skill',
        'skills',
        'language',
        'languages',
        'framework',
        'frameworks',
      ],
      answer:
        'Here is my stack, organised by use:\n• Back end — C#, .NET, and .NET Core.\n• Front end — Angular and TypeScript.\n• Data — SQL Server, PostgreSQL, Oracle, and MongoDB.\n• Architecture & design — DDD, hexagonal architecture, CQRS, REST, and SOLID.\n• Cloud & delivery — Azure, AWS, AKS, Docker, Helm, Azure DevOps, and CI/CD.\n• Integration & observability — APIGEE, IBM API Connect, Datadog, Application Insights, and ELK.\n• Application security — Checkmarx, Snyk, SonarQube, and OWASP practices.\n• Quality — TDD, NUnit, XUnit, Vitest, TeamCity, and software craftsmanship.\nThis reflects how I work: make the business clear, secure the solution, automate delivery, and keep it observable in production.',
    },
    {
      terms: ['ai', 'artificial intelligence'],
      answer:
        'I use AI as a reproducible engineering lever. At Betclic, I industrialise Claude Code and Cursor through skills, commands, agents, routines, workflows, and AI loops to accelerate development without losing traceability or reliability. I also built a replay and analysis back office, ran a GPU compute proof of concept, and worked on AWS delivery with Dagger and GitHub Actions. At TF1, I had already explored Copilot-assisted development and automated editorial validation of videos. Every use remains tied to a precise need, controls, and evidence.',
    },
    {
      terms: ['tdd', 'test', 'tictactoe', 'vending'],
      answer:
        'I use TDD as a design tool. TicTacToe Solver and Vending Machine help me let a model emerge where business rules are named, tested, and therefore easy to challenge or evolve.',
    },
    {
      terms: ['project', 'github', 'codingame'],
      answer:
        'My public projects include this portfolio, TicTacToe Solver, BullsAndCows, and Vending Machine. They focus on the domain, tests, and maintainability. I also train on algorithms through CodinGame, where I am a Grand Master in the global top 0.1%.',
    },
    {
      terms: ['recommendation', 'recommendations', 'testimonial', 'testimonials', 'linkedin'],
      answer:
        'My professional recommendations are available directly on LinkedIn. They add complementary evidence to this portfolio: feedback from colleagues and teams encountered in demanding technical contexts. I prefer linking to attributed testimonials rather than rewriting their words without being able to quote them precisely.',
    },
    {
      terms: ['tf1', 'advertis'],
      answer:
        'At TF1 Group, I was the technical reference for two multidisciplinary teams during the advertising-system redesign. The documented results include 11 projects in production, 4 underway, and over 80 incidents resolved. I defined architecture and roadmaps, led modernisation towards .NET 6/8, Angular, Azure, and AKS, strengthened security with Checkmarx, Snyk, and SonarQube, and reduced lead time through Accelerate practices, testing, and observability.',
    },
    {
      terms: ['rent', 'rental'],
      answer:
        'At Rent A Car, I progressed from senior developer to technical manager of a nine-person team, supporting the transformation of over 500 branches. Deliveries included Easy Péage — presented as a European first for rental vehicles — digital check-in, Yousign, WeProov, dynamic pricing, the ANTAI interface, a GDPR-compliant customer master, and high-traffic e-commerce redesign.',
    },
    {
      terms: ['stago', 'medical'],
      answer:
        'At Stago, I progressed from R&D study lead to manager of an eight-person team working on in-vitro diagnostic instruments. I designed a C# patient-results calculation framework, refactored critical modules with TDD, SOLID, and MVVM, structured TeamCity continuous integration, and ensured regulatory traceability through IBM Rational DOORS.',
    },
    {
      terms: ['software craftsmanship'],
      answer:
        'I bring an end-to-end perspective: business concepts made clear in code, design quality, Cloud, continuous delivery, and team enablement. My aim is to leave a system easier to understand and a team more autonomous than I found them.',
    },
  ],
} as const;

const DEFAULT_ANSWERS: Record<PortfolioLocale, string> = {
  fr: 'Je suis Senior Software Engineer / Tech Lead. Chez Betclic, je contribue à un pricing sportif propriétaire fondé sur des probabilités internes, des algorithmes et des simulations Monte-Carlo multi-sports. Mon parcours combine aussi architecture .NET / Angular, modernisation de SI et leadership d’équipes chez Groupe TF1, Rent A Car et Stago.',
  en: 'I am a Senior Software Engineer / Tech Lead. At Betclic, I contribute to proprietary sports pricing powered by internally generated probabilities, algorithms, and multi-sport Monte Carlo simulations. My background also combines .NET / Angular architecture, information-system modernisation, and team leadership at TF1 Group, Rent A Car, and Stago.',
};

export class ProfileFallbackGateway implements AssistantGateway {
  constructor(private readonly locale: PortfolioLocale = 'fr') {}

  answer(request: AssistantGatewayRequest): Promise<string> {
    const question = normalize(request.messages.at(-1)?.content ?? '');
    const answer = ANSWERS[this.locale].find(({ terms }) =>
      terms.some((term) => question.includes(term)),
    )?.answer;

    return Promise.resolve(answer ?? DEFAULT_ANSWERS[this.locale]);
  }
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9#+.]+/g, ' ')
    .trim();
}
