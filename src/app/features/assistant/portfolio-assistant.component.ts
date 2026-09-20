import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssistantMessage } from '../../core/domain/assistant.models';
import { PortfolioLocale } from '../../core/domain/portfolio.models';
import { PortfolioAssistantApiService } from './portfolio-assistant-api.service';

const ASSISTANT_COPY = {
  fr: {
    launcherLabel: 'Discuter avec le double numérique de Vivien',
    launcherTitle: 'On discute ?',
    figureLabel: 'Vivien · Double numérique',
    title: 'Vivien Billot',
    assistantName: 'Vivien Billot',
    grounded: 'Double numérique · parcours vérifié',
    close: 'Fermer l’assistant',
    hide: 'Masquer Vivien',
    hideShort: 'Masquer',
    restore: 'Afficher Vivien',
    initialMessage:
      'Je réponds sur le parcours de Vivien, sa stack, son leadership et ses choix d’architecture.',
    quickQuestions: ['Parcours', 'Priorités', 'Leadership', 'Différence'],
    suggestedQuestions: 'Questions suggérées',
    conversationLabel: 'Conversation avec le double numérique de Vivien',
    visitor: 'Vous',
    questionLabel: 'Votre question sur Vivien',
    questionPlaceholder: 'Votre question…',
    sendQuestion: 'Envoyer la question',
    directContact: 'Contact direct',
    contactTitle: 'Je transmets votre message.',
    contactDescription:
      'Vos informations servent uniquement à permettre à Vivien de vous répondre.',
    name: 'Nom',
    nameError: 'Indiquez au moins 2 caractères.',
    email: 'Email professionnel',
    emailError: 'Saisissez une adresse email valide.',
    message: 'Message',
    messageError: 'Votre message doit contenir au moins 20 caractères.',
    website: 'Site web',
    back: 'Retour',
    review: 'Vérifier le message',
    confirmation: 'Confirmation requise',
    confirmationTitle: 'Prêt à envoyer ?',
    from: 'De',
    replyTo: 'Réponse à',
    privacy:
      "En confirmant, vous autorisez la transmission de ces données à Vivien via Formspree (prestataire d'envoi).",
    edit: 'Modifier',
    sending: 'Envoi…',
    confirm: 'Confirmer et envoyer',
    sent: 'Message transmis',
    sentTitle: 'Merci, Vivien vous répondra directement.',
    continue: 'Continuer la conversation',
    unavailable: 'Je ne peux pas répondre pour le moment.',
    offline: 'La connexion a été interrompue. Votre question est conservée.',
    rateLimited: 'Trop de demandes. Réessayez dans une minute.',
    retry: 'Réessayer',
    thinking: 'Vivien prépare sa réponse…',
    deliveryFailed: 'Le message n’a pas pu être transmis.',
  },
  en: {
    launcherLabel: 'Chat with Vivien’s professional digital twin',
    launcherTitle: 'Let’s talk?',
    figureLabel: 'Vivien · Digital twin',
    title: 'Vivien Billot',
    assistantName: 'Vivien Billot',
    grounded: 'Digital twin · verified career facts',
    close: 'Close assistant',
    hide: 'Hide Vivien',
    hideShort: 'Hide',
    restore: 'Show Vivien',
    initialMessage:
      'I answer about Vivien’s background, stack, leadership, and architecture choices.',
    quickQuestions: ['Career path', 'Priorities', 'Leadership', 'Difference'],
    suggestedQuestions: 'Suggested questions',
    conversationLabel: 'Conversation with Vivien’s professional digital twin',
    visitor: 'You',
    questionLabel: 'Your question about Vivien',
    questionPlaceholder: 'Your question…',
    sendQuestion: 'Send question',
    directContact: 'Direct contact',
    contactTitle: 'I will forward your message.',
    contactDescription: 'Your information is used only to enable Vivien to reply to you.',
    name: 'Name',
    nameError: 'Please enter at least 2 characters.',
    email: 'Work email',
    emailError: 'Please enter a valid email address.',
    message: 'Message',
    messageError: 'Your message must contain at least 20 characters.',
    website: 'Website',
    back: 'Back',
    review: 'Review message',
    confirmation: 'Confirmation required',
    confirmationTitle: 'Ready to send?',
    from: 'From',
    replyTo: 'Reply to',
    privacy:
      'By confirming, you authorise these details to be sent to Vivien via Formspree (delivery provider).',
    edit: 'Edit',
    sending: 'Sending…',
    confirm: 'Confirm and send',
    sent: 'Message sent',
    sentTitle: 'Thank you. Vivien will reply to you directly.',
    continue: 'Continue the conversation',
    unavailable: 'I cannot reply at the moment.',
    offline: 'The connection was interrupted. Your question has been kept.',
    rateLimited: 'Too many requests. Please try again in a minute.',
    retry: 'Try again',
    thinking: 'Vivien is preparing a reply…',
    deliveryFailed: 'Your message could not be sent.',
  },
} as const;

const MAX_QUESTION_LENGTH = 1200;
type AssistantError = 'unavailable' | 'offline' | 'rateLimited';

interface ConversationState {
  readonly messages: readonly AssistantMessage[];
  readonly sending: boolean;
  readonly error: AssistantError | null;
}

const EMPTY_CONVERSATION: ConversationState = { messages: [], sending: false, error: null };

@Component({
  selector: 'app-portfolio-assistant',
  imports: [NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './portfolio-assistant.component.html',
  styleUrl: './portfolio-assistant.component.scss',
  host: {
    '[style.--assistant-viewport-height]': 'viewportHeight()',
    '[style.--assistant-viewport-top]': 'viewportTop()',
  },
})
export class PortfolioAssistantComponent {
  readonly locale = input<PortfolioLocale>('en');

  private readonly destroyRef = inject(DestroyRef);
  private readonly api = inject(PortfolioAssistantApiService);
  private readonly document = inject(DOCUMENT);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly conversation = viewChild<ElementRef<HTMLElement>>('conversation');
  private readonly launcher = viewChild<ElementRef<HTMLButtonElement>>('launcher');
  private readonly restoreButton = viewChild<ElementRef<HTMLButtonElement>>('restoreButton');
  private readonly assistantPanel = viewChild<ElementRef<HTMLElement>>('assistantPanel');
  private pendingFocusTimer: ReturnType<typeof globalThis.setTimeout> | undefined;
  private pendingScrollTimer: ReturnType<typeof globalThis.setTimeout> | undefined;
  private releaseModal: (() => void) | undefined;
  private readonly conversations = signal<Record<PortfolioLocale, ConversationState>>({
    fr: EMPTY_CONVERSATION,
    en: EMPTY_CONVERSATION,
  });
  private readonly currentConversation = computed(() => this.conversations()[this.locale()]);

  protected readonly isOpen = signal(false);
  protected readonly isHidden = signal(false);
  protected readonly copy = computed(() => ASSISTANT_COPY[this.locale()]);
  protected readonly messages = computed<readonly AssistantMessage[]>(() => [
    { role: 'assistant', content: this.copy().initialMessage },
    ...this.currentConversation().messages,
  ]);
  protected readonly isSending = computed(() => this.currentConversation().sending);
  protected readonly error = computed(() => {
    const error = this.currentConversation().error;
    return error ? this.copy()[error] : '';
  });
  protected readonly viewportHeight = signal('100dvh');
  protected readonly viewportTop = signal('0px');
  protected readonly quickQuestions = computed(() => this.copy().quickQuestions);

  protected readonly question = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(/\S/),
      Validators.maxLength(MAX_QUESTION_LENGTH),
    ],
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearPendingFocusTimer();
      this.clearPendingScrollTimer();
      this.releaseModal?.();
    });
  }

  protected open(): void {
    this.isHidden.set(false);

    if (this.isOpen()) {
      return;
    }

    this.isOpen.set(true);
    this.captureModal();
    this.scheduleFocus(() => this.assistantPanel()?.nativeElement.focus({ preventScroll: true }));
    this.scheduleScrollConversation();
  }

  protected toggle(): void {
    if (this.isOpen()) {
      this.close();
      return;
    }

    this.open();
  }

  protected close(): void {
    this.isOpen.set(false);
    this.releaseModal?.();
    this.releaseModal = undefined;
    this.scheduleFocusLauncher();
  }

  protected hideAssistant(): void {
    this.isOpen.set(false);
    this.releaseModal?.();
    this.releaseModal = undefined;
    this.isHidden.set(true);
    this.scheduleFocusRestoreButton();
  }

  protected restoreAssistant(): void {
    this.isHidden.set(false);
    this.open();
  }

  protected async sendQuestion(suggestedQuestion?: string): Promise<void> {
    if (this.isSending()) {
      return;
    }

    if (suggestedQuestion) {
      this.question.setValue(suggestedQuestion);
    }

    if (this.question.invalid) {
      this.question.markAsTouched();
      return;
    }

    const visitorMessage: AssistantMessage = {
      role: 'user',
      content: this.question.value.trim(),
    };
    const locale = this.locale();
    this.updateConversation(locale, {
      messages: [...this.currentConversation().messages, visitorMessage],
    });
    this.question.reset();
    if (suggestedQuestion) {
      this.scheduleFocusConversation();
    }
    await this.requestReply(locale);
  }

  protected async retryQuestion(): Promise<void> {
    if (!this.error() || this.isSending()) {
      return;
    }
    this.scheduleFocusConversation();
    await this.requestReply(this.locale());
  }

  private async requestReply(locale: PortfolioLocale): Promise<void> {
    this.updateConversation(locale, { error: null, sending: true });
    this.scheduleScrollConversation();

    try {
      const response = await this.api.ask(this.conversations()[locale].messages.slice(-6), locale);
      if (this.destroyRef.destroyed) {
        return;
      }
      if (!response.answer?.trim()) {
        throw new Error('Empty assistant response');
      }
      this.updateConversation(locale, {
        messages: [
          ...this.conversations()[locale].messages,
          { role: 'assistant', content: response.answer },
        ],
      });
      if (this.locale() === locale && this.isOpen()) {
        this.scheduleScrollConversation();
      }
    } catch (error: unknown) {
      if (!this.destroyRef.destroyed) {
        this.updateConversation(locale, { error: readApiError(error) });
      }
    } finally {
      if (!this.destroyRef.destroyed) {
        this.updateConversation(locale, { sending: false });
      }
    }
  }

  private updateConversation(locale: PortfolioLocale, change: Partial<ConversationState>): void {
    this.conversations.update((conversations) => ({
      ...conversations,
      [locale]: { ...conversations[locale], ...change },
    }));
  }

  protected onQuestionKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) {
      return;
    }

    event.preventDefault();
    void this.sendQuestion();
  }

  protected onDialogKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const panel = this.assistantPanel()?.nativeElement;
    if (!panel) {
      return;
    }

    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => {
      const isAriaHidden = element.getAttribute('aria-hidden') === 'true';
      const isDisabled =
        'disabled' in element
          ? Boolean((element as { readonly disabled?: boolean }).disabled)
          : false;

      return !isAriaHidden && !isDisabled;
    });

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = this.document.activeElement;

    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && (active === last || active === panel)) {
      event.preventDefault();
      first.focus();
    }
  }

  private scheduleFocusLauncher(): void {
    this.scheduleFocus(() => this.launcher()?.nativeElement.focus({ preventScroll: true }));
  }

  private scheduleFocusConversation(): void {
    this.scheduleFocus(() => this.conversation()?.nativeElement.focus({ preventScroll: true }));
  }

  private scheduleFocusRestoreButton(): void {
    this.scheduleFocus(() => this.restoreButton()?.nativeElement.focus({ preventScroll: true }));
  }

  private captureModal(): void {
    const inertElements: HTMLElement[] = [];
    let ancestor = this.element.nativeElement;
    while (ancestor.parentElement) {
      for (const sibling of Array.from(ancestor.parentElement.children)) {
        if (sibling !== ancestor && sibling instanceof HTMLElement && !sibling.inert) {
          sibling.inert = true;
          inertElements.push(sibling);
        }
      }
      ancestor = ancestor.parentElement;
      if (ancestor === this.document.body) {
        break;
      }
    }

    const root = this.document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    const viewport = this.document.defaultView?.visualViewport;
    const updateViewport = () => {
      this.viewportHeight.set(viewport ? `${viewport.height}px` : '100dvh');
      this.viewportTop.set(viewport ? `${viewport.offsetTop}px` : '0px');
    };
    updateViewport();
    viewport?.addEventListener('resize', updateViewport);
    viewport?.addEventListener('scroll', updateViewport);

    this.releaseModal = () => {
      inertElements.forEach((element) => (element.inert = false));
      root.style.overflow = previousOverflow;
      viewport?.removeEventListener('resize', updateViewport);
      viewport?.removeEventListener('scroll', updateViewport);
    };
  }

  private scheduleFocus(action: () => void): void {
    this.clearPendingFocusTimer();

    this.pendingFocusTimer = globalThis.setTimeout(() => {
      if (!this.destroyRef.destroyed) {
        action();
      }
      this.pendingFocusTimer = undefined;
    });
  }

  private clearPendingFocusTimer(): void {
    if (this.pendingFocusTimer !== undefined) {
      globalThis.clearTimeout(this.pendingFocusTimer);
      this.pendingFocusTimer = undefined;
    }
  }

  private scheduleScrollConversation(): void {
    this.clearPendingScrollTimer();

    this.pendingScrollTimer = globalThis.setTimeout(() => {
      const conversation = this.conversation()?.nativeElement;
      if (!this.destroyRef.destroyed && conversation) {
        conversation.scrollTop = conversation.scrollHeight;
      }
      this.pendingScrollTimer = undefined;
    });
  }

  private clearPendingScrollTimer(): void {
    if (this.pendingScrollTimer !== undefined) {
      globalThis.clearTimeout(this.pendingScrollTimer);
      this.pendingScrollTimer = undefined;
    }
  }
}

function readApiError(error: unknown): AssistantError {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'offline';
    }
    if (error.status === 429) {
      return 'rateLimited';
    }
  }
  return 'unavailable';
}
