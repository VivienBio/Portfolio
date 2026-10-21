import { describe, expect, it } from 'vitest';
import { ProfileFallbackGateway } from './profile-fallback.gateway';

describe('ProfileFallbackGateway', () => {
  it('keeps the IA answer grounded and secondary to Vivien’s engineering expertise', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Comment Vivien utilise-t-il l’IA ?' }],
      }),
    ).resolves.toContain('skills, commandes, agents');
  });

  it('does not mistake words containing "ai" for a question about AI', async () => {
    const gateway = new ProfileFallbackGateway('en');

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Explain your domain expertise' }],
      }),
    ).resolves.not.toContain('Claude Code');
  });

  it('lists the technology stack in a structured way', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Quelles technologies maîtrises-tu ?' }],
      }),
    ).resolves.toContain(
      'Architecture & conception — DDD, architecture hexagonale, CQRS, REST et SOLID',
    );
  });

  it('defaults to a concise professional introduction', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Présente-toi.' }],
      }),
    ).resolves.toContain('Senior Software Engineer');
  });

  it('answers casual small-talk questions with a friendly redirect', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'je suis gentil ?' }],
      }),
    ).resolves.toContain('répondre sur le parcours de Vivien');
  });

  it('answers broad career-path questions with a recruiter-friendly narrative', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Parcours' }],
      }),
    ).resolves.toContain('laisser un système plus compréhensible et une équipe plus autonome');
  });

  it('answers values questions as professional priorities', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Priorités' }],
      }),
    ).resolves.toContain('valeur métier durable');
  });

  it('answers short differentiation suggestions', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Différence' }],
      }),
    ).resolves.toContain('Ce qui me distingue');
  });

  it('answers English technology questions in English when requested', async () => {
    const gateway = new ProfileFallbackGateway('en');

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Which technologies do you work with?' }],
      }),
    ).resolves.toContain(
      'Architecture & design — DDD, hexagonal architecture, CQRS, REST, and SOLID',
    );
  });

  it('explains Betclic proprietary pricing instead of a generic .NET role', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Quel est ton rôle chez Betclic ?' }],
      }),
    ).resolves.toContain('cotes maîtrisées');
  });

  it('explains Betclic engineering acceleration and replay tooling', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Comment utilises-tu le GPU et les agents IA ?' }],
      }),
    ).resolves.toContain('framework de capture & replay');
  });

  it('directs a recommendation question to the LinkedIn recommendations', async () => {
    const gateway = new ProfileFallbackGateway();

    const answer = await gateway.answer({
      instructions: 'ignored by the deterministic fallback',
      messages: [{ role: 'user', content: 'Où puis-je lire les recommandations LinkedIn ?' }],
    });

    expect(answer).toContain('https://www.linkedin.com/in/vivien-billot/details/recommendations/');
    expect(answer).toContain('TF1, Stago et Rent A Car');
  });

  it('links Betclic and TF1 answers to their case studies in the visitor language', async () => {
    const french = new ProfileFallbackGateway('fr');
    const english = new ProfileFallbackGateway('en');

    await expect(
      french.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Que fais-tu chez Betclic ?' }],
      }),
    ).resolves.toContain('https://vivien-billot.web.app/fr/work/betclic');
    await expect(
      english.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'What did you do at TF1?' }],
      }),
    ).resolves.toContain('https://vivien-billot.web.app/work/tf1');
  });

  it('explains TF1 outcomes with documented scale', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Quels résultats chez TF1 ?' }],
      }),
    ).resolves.toContain('11 projets en production');
  });

  it('includes application security in the structured technology answer', async () => {
    const gateway = new ProfileFallbackGateway();

    await expect(
      gateway.answer({
        instructions: 'ignored by the deterministic fallback',
        messages: [{ role: 'user', content: 'Quelles technologies maîtrises-tu ?' }],
      }),
    ).resolves.toContain('Checkmarx, Snyk, SonarQube');
  });
});
