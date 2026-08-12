import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PortfolioAssistantApiService } from './portfolio-assistant-api.service';
import { PortfolioAssistantComponent } from './portfolio-assistant.component';

describe('PortfolioAssistantComponent', () => {
  let fixture: ComponentFixture<PortfolioAssistantComponent>;
  const api = {
    ask: vi.fn().mockResolvedValue({ answer: 'Je travaille chez Betclic depuis 2026.' }),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [PortfolioAssistantComponent],
      providers: [{ provide: PortfolioAssistantApiService, useValue: api }],
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
    ).toBe('/vivien-billot-character-cutout-v1.png');
    expect(launcher?.querySelector('.assistant-persona i')).toBeNull();
    expect(element.querySelector('.assistant-hide')).toBeTruthy();
    expect(launcher?.querySelector('.assistant-expand-indicator')).toBeNull();
    expect(launcher?.textContent).toContain('On discute ?');
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
    expect(element.querySelector('.assistant-dock')).toBeNull();
    expect(element.querySelector('.assistant-sidekick .assistant-persona-side')).toBeTruthy();
    expect(dialog?.querySelector('.contact-shortcut')).toBeNull();
    expect(dialog?.querySelector('.assistant-floating-actions')).toBeNull();

    suggestion?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(api.ask).toHaveBeenCalledOnce();
    expect(api.ask).toHaveBeenLastCalledWith(expect.any(Array), 'fr');
    expect(dialog?.textContent).toContain('Je travaille chez Betclic depuis 2026.');
  });

  it('exposes a discrete internal close control while dialog is open', () => {
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();

    expect(element.querySelector('.assistant-hide-open')).toBeNull();
    expect(element.querySelector('.assistant-close')).toBeTruthy();
    expect(element.querySelector('.assistant-minimize')).toBeNull();
  });

  it('uses English copy and sends the English locale to the API', async () => {
    fixture.componentRef.setInput('locale', 'en');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Let’s talk?');
    element.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('.quick-questions button')?.click();
    await fixture.whenStable();

    expect(api.ask).toHaveBeenLastCalledWith(expect.any(Array), 'en');
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
      'fr',
    );
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
      'Afficher Vivien',
    );
    expect(
      element
        .querySelector<HTMLImageElement>('.assistant-restore-avatar img')
        ?.getAttribute('ngsrc'),
    ).toBe('/vivien-billot-character-cutout-v1.png');

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
});
