import { LocalPortfolioRepository } from './local-portfolio.repository';

describe('LocalPortfolioRepository', () => {
  const repository = new LocalPortfolioRepository();

  it('exposes a complete portfolio aggregate', () => {
    const portfolio = repository.getPortfolio();

    expect(portfolio.expertises).toHaveLength(4);
    expect(portfolio.experiences).toHaveLength(6);
    expect(portfolio.projects).toHaveLength(5);
    expect(portfolio.workingStyle).toHaveLength(6);
    expect(portfolio.certifications.length).toBeGreaterThanOrEqual(9);
  });

  it('keeps stable and unique business identifiers', () => {
    const portfolio = repository.getPortfolio();
    const expertiseIndexes = portfolio.expertises.map(({ index }) => index);
    const companies = portfolio.experiences.map(({ company }) => company);
    const projectTitles = portfolio.projects.map(({ title }) => title);

    expect(new Set(expertiseIndexes).size).toBe(expertiseIndexes.length);
    expect(new Set(companies).size).toBe(companies.length);
    expect(new Set(projectTitles).size).toBe(projectTitles.length);
  });

  it('does not expose empty content or incomplete experiences', () => {
    const portfolio = repository.getPortfolio();

    for (const expertise of portfolio.expertises) {
      expect(expertise.title.trim()).not.toBe('');
      expect(expertise.description.trim()).not.toBe('');
      expect(expertise.technologies.length).toBeGreaterThan(0);
    }

    for (const experience of portfolio.experiences) {
      expect(experience.company.trim()).not.toBe('');
      expect(experience.role.trim()).not.toBe('');
      expect(experience.achievements.length).toBeGreaterThanOrEqual(2);
      expect(experience.technologies.length).toBeGreaterThanOrEqual(3);
    }

    for (const project of portfolio.projects) {
      expect(project.title.trim()).not.toBe('');
      expect(project.url.startsWith('https://')).toBe(true);
      expect(project.technologies.length).toBeGreaterThanOrEqual(3);
    }

    for (const item of portfolio.workingStyle) {
      expect(item.title.trim()).not.toBe('');
      expect(item.description.trim()).not.toBe('');
      expect(item.practice.trim()).not.toBe('');
    }
  });

  it('returns a deeply immutable aggregate', () => {
    const portfolio = repository.getPortfolio();

    expect(Object.isFrozen(portfolio)).toBe(true);
    expect(Object.isFrozen(portfolio.expertises)).toBe(true);
    expect(Object.isFrozen(portfolio.expertises[0])).toBe(true);
    expect(Object.isFrozen(portfolio.experiences[0]?.achievements)).toBe(true);
    expect(Object.isFrozen(portfolio.projects[0]?.technologies)).toBe(true);
  });

  it('returns the same reference because the aggregate cannot be mutated', () => {
    expect(repository.getPortfolio()).toBe(repository.getPortfolio());
  });

  it('provides an English aggregate with the same verified professional evidence', () => {
    const englishPortfolio = repository.getPortfolio('en');

    expect(englishPortfolio).not.toBe(repository.getPortfolio());
    expect(englishPortfolio.experiences).toHaveLength(6);
    expect(englishPortfolio.experiences[0]?.summary).toContain('proprietary sports-pricing');
    expect(englishPortfolio.projects.map(({ title }) => title)).toContain('BullsAndCows');
    expect(Object.isFrozen(englishPortfolio)).toBe(true);
  });

  it('makes Betclic quantitative work and TF1 leadership visible', () => {
    const portfolio = repository.getPortfolio();
    const betclic = portfolio.experiences.find(({ company }) => company === 'Betclic Group');
    const tf1 = portfolio.experiences.find(({ company }) => company === 'Groupe TF1');

    expect(betclic?.summary).toContain('probabilités propriétaires');
    expect(betclic?.summary).toContain('cotes maîtrisées');
    expect(betclic?.achievements.join(' ')).toContain('suspendre');
    expect(betclic?.achievements.join(' ')).toContain('GPU');
    expect(betclic?.achievements.join(' ')).toContain('replay');
    expect(betclic?.achievements.join(' ')).toContain('skills, commandes, agents');
    expect(betclic?.technologies).toContain('Pricing sportif');
    expect(betclic?.technologies).toContain('Dagger / GHA');
    expect(tf1?.summary).toContain('deux équipes');
    expect(tf1?.summary).toContain('11 projets');
    expect(tf1?.achievements.join(' ')).toContain('80 incidents');
  });

  it('preserves the documented scale and career progression', () => {
    const portfolio = repository.getPortfolio();
    const rentACar = portfolio.experiences.find(({ company }) => company === 'Rent A Car');
    const stago = portfolio.experiences.find(({ company }) => company === 'Stago');

    expect(rentACar?.period).toContain('2017');
    expect(rentACar?.summary).toContain('500 agences');
    expect(rentACar?.achievements.join(' ')).toContain('Easy Péage');
    expect(stago?.role).toContain('Responsable d’équipe');
    expect(stago?.summary).toContain('huit personnes');
    expect(portfolio.experiences.map(({ company }) => company)).toContain('Total');
  });
});
