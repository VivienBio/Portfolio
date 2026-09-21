import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { signal } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics.service';
import { PortfolioAssistantApiService } from './portfolio-assistant-api.service';
import { PortfolioAssistantComponent } from './portfolio-assistant.component';

describe('PortfolioAssistantComponent', () => {
  let fixture: ComponentFixture<PortfolioAssistantComponent>;
  const analytics = {
    available: signal(false),
    consent: signal('pending'),
    preferencesOpen: signal(false),
    track: vi.fn(),
  };
  const api = {
    ask: vi
      .fn()
      .mockResolvedValue({ answer: 'Je travaille chez Betclic depuis le 6 octobre 2025.' }),
  };

  beforeEach(async () => {
    analytics.track.mockReset();
    api.ask
      .mockReset()
      .mockResolvedValue({ answer: 'Je travaille chez Betclic depuis le 6 octobre 2025.' });
    await TestBed.configureTestingModule({
      imports: [PortfolioAssistantComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioAssistantApiService, useValue: api },
        { provide: AnalyticsService, useValue: analytics },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PortfolioAssistantComponent);
    fixture.detectChanges();
  });

  it('exposes an accessible, collapsed launcher by default', () => {
    const element = fixture.nativeElement as HTMLElement;
    const launcher = element.querySelector<HTMLButtonElement>('.assistant-launcher');

    expect(launcher?.getAttribute('aria-expanded')).toBe('false');
    expect(launcher?.getAttribute('aria-controls')).toBe('portfolio-assistant-panel');
    expect(
      launcher?.querySelector<HTMLImageElement>('.assistant-persona img')?.getAttribute('ngsrc'),
    ).toBe('/vivien-billot-character-cutout-v2.png');
    expect(launcher?.querySelector('.assistant-persona i')).toBeNull();
    expect(element.querySelector('.assistant-hide')).toBeTruthy();
    expect(launcher?.querySelector('.assistant-expand-indicator')).toBeNull();
    expect(launcher?.textContent).toContain('Let’s talk?');
    expect(launcher?.textContent).not.toContain('Betclic · TF1');
    expect(element.querySelector('[role="dialog"]')).toBeNull();
  });

  it('opens a named dialog and submits a suggested question', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const launcher = element.querySelector<HTMLButtonElement>('.assistant-launcher');
    launcher?.click();
    fixture.detectChanges();

    const dialog = element.querySelector<HTMLElement>('[role="dialog"]');
    const suggestion = element.querySelector<HTMLButtonElement>('.quick-questions button');
    expect(dialog?.getAttribute('aria-labelledby')).toBe('assistant-title');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.textContent).toContain('Vivien Billot');
    expect(dialog?.querySelector('.assistant-privacy')?.textContent).toContain('OpenAI');
    expect(dialog?.querySelector('.assistant-privacy a')?.getAttribute('href')).toBe('/privacy');
    expect(element.querySelector('.assistant-dock')).toBeNull();
    expect(element.querySelector('.assistant-sidekick .assistant-persona-side')).toBeTruthy();
    expect(dialog?.querySelector('.contact-shortcut')).toBeNull();
    expect(dialog?.querySelector('.assistant-floating-actions')).toBeNull();

    suggestion?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(api.ask).toHaveBeenCalledOnce();
    expect(api.ask).toHaveBeenLastCalledWith(expect.any(Array), 'en');
    expect(dialog?.textContent).toContain('Je travaille chez Betclic depuis le 6 octobre 2025.');
  });

  it('exposes a discrete internal close control while dialog is open', () => {
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();

    expect(element.querySelector('.assistant-hide-open')).toBeNull();
    expect(element.querySelector('.assistant-close')).toBeTruthy();
    expect(element.querySelector('.assistant-minimize')).toBeNull();
  });

  it('uses French copy and sends the French locale to the API', async () => {
    fixture.componentRef.setInput('locale', 'fr');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('On discute ?');
    element.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();
    expect(element.querySelector('.assistant-privacy a')?.getAttribute('href')).toBe(
      '/fr/confidentialite',
    );
    element.querySelector<HTMLButtonElement>('.quick-questions button')?.click();
    await fixture.whenStable();

    expect(api.ask).toHaveBeenLastCalledWith(expect.any(Array), 'fr');
  });

  it('sends the typed question when the user presses Enter', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const launcher = element.querySelector<HTMLButtonElement>('.assistant-launcher');
    launcher?.click();
    fixture.detectChanges();

    const textarea = element.querySelector<HTMLTextAreaElement>('#assistant-question');
    expect(textarea).toBeTruthy();
    textarea!.value = 'je suis gentil ?';
    textarea!.dispatchEvent(new Event('input', { bubbles: true }));
    textarea!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(api.ask).toHaveBeenCalledOnce();
    expect(api.ask).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ role: 'user', content: 'je suis gentil ?' }),
      ]),
      'en',
    );
    expect(analytics.track.mock.calls).toEqual([
      ['assistant_open', { locale: 'en' }],
      ['assistant_send', { locale: 'en' }],
      ['assistant_success', { locale: 'en' }],
    ]);
    expect(JSON.stringify(analytics.track.mock.calls)).not.toContain('je suis gentil');
  });

  it('keeps the assistant panel free of contact actions and extra header chrome', () => {
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();

    expect(element.querySelector('.assistant-header')).toBeNull();
    expect(element.querySelector('.assistant-floating-actions')).toBeNull();
    expect(element.querySelector('.contact-shortcut')).toBeNull();
  });

  it('can hide the floating assistant and restore it later', () => {
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector<HTMLButtonElement>('.assistant-hide')?.click();
    fixture.detectChanges();

    expect(element.querySelector('.assistant-dock')).toBeNull();
    expect(element.querySelector<HTMLButtonElement>('.assistant-restore')?.textContent).toContain(
      'Show Vivien',
    );
    expect(
      element
        .querySelector<HTMLImageElement>('.assistant-restore-avatar img')
        ?.getAttribute('ngsrc'),
    ).toBe('/vivien-billot-character-cutout-v2.png');

    element.querySelector<HTMLButtonElement>('.assistant-restore')?.click();
    fixture.detectChanges();

    expect(element.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('closes when the user clicks the internal close control', () => {
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('.assistant-close')?.click();
    fixture.detectChanges();

    expect(element.querySelector('[role="dialog"]')).toBeNull();
  });

  it('closes when the user clicks outside the dialog', () => {
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('.assistant-backdrop')?.click();
    fixture.detectChanges();

    expect(element.querySelector('[role="dialog"]')).toBeNull();
    expect(
      element
        .querySelector<HTMLButtonElement>('.assistant-launcher')
        ?.getAttribute('aria-expanded'),
    ).toBe('false');
  });

  it('rejects whitespace-only questions without losing the draft', async () => {
    const element = openDialog();
    const textarea = typeQuestion(element, '   \n  ');
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fixture.whenStable();

    expect(api.ask).not.toHaveBeenCalled();
    expect(textarea.value).toBe('   \n  ');
    expect(element.querySelector<HTMLButtonElement>('[type="submit"]')?.disabled).toBe(true);
  });

  it('preserves newlines and composition input instead of sending them early', () => {
    const element = openDialog();
    const textarea = typeQuestion(element, 'Une question en cours');
    textarea.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }),
    );
    textarea.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true }),
    );

    expect(api.ask).not.toHaveBeenCalled();
    expect(textarea.value).toBe('Une question en cours');
  });

  it('preserves French messages and keeps an in-flight reply out of the English conversation', async () => {
    let resolveReply!: (reply: { answer: string }) => void;
    api.ask.mockImplementationOnce(() => new Promise((resolve) => (resolveReply = resolve)));
    fixture.componentRef.setInput('locale', 'fr');
    const element = openDialog();
    element.querySelector<HTMLButtonElement>('.quick-questions button')?.click();
    fixture.detectChanges();
    expect(api.ask).toHaveBeenLastCalledWith([{ role: 'user', content: 'Parcours' }], 'fr');

    fixture.componentRef.setInput('locale', 'en');
    fixture.detectChanges();
    expect(element.querySelector('.assistant-conversation')?.textContent).not.toContain('Parcours');
    resolveReply({ answer: 'Une réponse exclusivement française.' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Une réponse exclusivement française.');

    fixture.componentRef.setInput('locale', 'fr');
    fixture.detectChanges();
    expect(element.textContent).toContain('Une réponse exclusivement française.');
    expect(element.querySelector('[role="dialog"]')?.getAttribute('lang')).toBe('fr');
  });

  it('localizes a network error and retries the same question without duplicating it', async () => {
    api.ask.mockRejectedValueOnce(new HttpErrorResponse({ status: 0, error: 'Network error' }));
    fixture.componentRef.setInput('locale', 'fr');
    const element = openDialog();
    element.querySelector<HTMLButtonElement>('.quick-questions button')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'connexion a été interrompue',
    );
    expect(element.querySelector('.assistant-error button')?.textContent).toContain('Réessayer');
    const firstPayload = api.ask.mock.calls[0];
    element.querySelector<HTMLButtonElement>('.assistant-error button')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(api.ask.mock.calls[1]).toEqual(firstPayload);
    expect(element.querySelectorAll('.message-user')).toHaveLength(1);
    expect(element.querySelector('[role="alert"]')).toBeNull();
  });

  it('keeps server errors in the selected language and exposes the rate-limit recovery', async () => {
    api.ask.mockRejectedValueOnce(
      new HttpErrorResponse({
        status: 429,
        error: { error: 'Trop de demandes.' },
      }),
    );
    const element = openDialog();
    element.querySelector<HTMLButtonElement>('.quick-questions button')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('try again in a minute');
    expect(element.querySelector('[role="alert"]')?.textContent).not.toContain('Trop de demandes');
  });

  it('makes an empty server answer recoverable', async () => {
    api.ask.mockResolvedValueOnce({ answer: '  ' });
    const element = openDialog();
    element.querySelector<HTMLButtonElement>('.quick-questions button')?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('cannot reply');
    expect(element.querySelectorAll('.message')).toHaveLength(2);
    expect(element.querySelector('.assistant-error button')).toBeTruthy();
  });

  it('ignores duplicate submissions and does not steal focus when a reply arrives', async () => {
    let resolveReply!: (reply: { answer: string }) => void;
    api.ask.mockImplementationOnce(() => new Promise((resolve) => (resolveReply = resolve)));
    const element = openDialog();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const textarea = typeQuestion(element, 'Votre parcours ?');
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    const close = element.querySelector<HTMLButtonElement>('.assistant-close')!;
    close.focus();
    expect(api.ask).toHaveBeenCalledOnce();

    resolveReply({ answer: 'Voici mon parcours.' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(document.activeElement).toBe(close);
  });

  it('keeps a late reply without reopening a closed dialog', async () => {
    let resolveReply!: (reply: { answer: string }) => void;
    api.ask.mockImplementationOnce(() => new Promise((resolve) => (resolveReply = resolve)));
    const element = openDialog();
    element.querySelector<HTMLButtonElement>('.quick-questions button')?.click();
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('.assistant-close')?.click();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));

    resolveReply({ answer: 'A reply received in the background.' });
    await fixture.whenStable();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(element.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(element.querySelector('.assistant-launcher'));
    openDialog();
    expect(element.querySelector('.assistant-conversation')?.textContent).toContain(
      'A reply received in the background.',
    );
  });

  it('opens without summoning the mobile keyboard, traps Tab and restores focus after Escape', async () => {
    const element = openDialog();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const dialog = element.querySelector<HTMLElement>('[role="dialog"]')!;
    const close = element.querySelector<HTMLButtonElement>('.assistant-close')!;
    const textarea = element.querySelector<HTMLTextAreaElement>('textarea')!;
    expect(document.activeElement).toBe(dialog);

    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    expect(document.activeElement).toBe(close);
    close.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
    );
    expect(document.activeElement).toBe(textarea);
    textarea.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    expect(document.activeElement).toBe(close);
    close.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(element.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(element.querySelector('.assistant-launcher'));
  });

  it('isolates the modal from the background and releases it on destruction', () => {
    const background = document.createElement('button');
    document.body.append(background);
    const overflow = document.documentElement.style.overflow;
    try {
      openDialog();
      expect(background.inert).toBe(true);
      expect(document.documentElement.style.overflow).toBe('hidden');
      fixture.destroy();
      expect(background.inert).toBe(false);
      expect(document.documentElement.style.overflow).toBe(overflow);
    } finally {
      background.remove();
    }
  });

  it('tracks the visible viewport when the Android keyboard resizes or pans it', () => {
    const viewport = Object.assign(new EventTarget(), { height: 700, offsetTop: 0 });
    vi.stubGlobal('visualViewport', viewport);
    try {
      const element = openDialog();
      expect(element.style.getPropertyValue('--assistant-viewport-height')).toBe('700px');
      viewport.height = 360;
      viewport.offsetTop = 24;
      viewport.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      expect(element.style.getPropertyValue('--assistant-viewport-height')).toBe('360px');
      expect(element.style.getPropertyValue('--assistant-viewport-top')).toBe('24px');
      element.querySelector<HTMLButtonElement>('.assistant-close')?.click();
      fixture.detectChanges();
      viewport.height = 720;
      viewport.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      expect(element.style.getPropertyValue('--assistant-viewport-height')).toBe('360px');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  function openDialog(): HTMLElement {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();
    return element;
  }

  function typeQuestion(element: HTMLElement, value: string): HTMLTextAreaElement {
    const textarea = element.querySelector<HTMLTextAreaElement>('textarea')!;
    textarea.value = value;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    return textarea;
  }
});
