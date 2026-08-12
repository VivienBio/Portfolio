import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  linkedSignal,
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
    questionPlaceholder: 'Posez votre question sur Vivien…',
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
    questionPlaceholder: 'Ask a question about Vivien…',
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
    deliveryFailed: 'Your message could not be sent.',
  },
} as const;

const MAX_QUESTION_LENGTH = 1200;

@Component({
  selector: 'app-portfolio-assistant',
  imports: [NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './portfolio-assistant.component.html',
  styleUrl: './portfolio-assistant.component.scss',
})
export class PortfolioAssistantComponent {
  readonly locale = input<PortfolioLocale>('fr');

  private readonly destroyRef = inject(DestroyRef);
  private readonly api = inject(PortfolioAssistantApiService);
  private readonly document = inject(DOCUMENT);
  private readonly questionField = viewChild<ElementRef<HTMLTextAreaElement>>('questionField');
  private readonly conversation = viewChild<ElementRef<HTMLElement>>('conversation');
  private readonly launcher = viewChild<ElementRef<HTMLButtonElement>>('launcher');
  private readonly restoreButton = viewChild<ElementRef<HTMLButtonElement>>('restoreButton');
  private readonly assistantPanel = viewChild<ElementRef<HTMLElement>>('assistantPanel');
  private pendingFocusTimer: ReturnType<typeof globalThis.setTimeout> | undefined;
  private pendingScrollTimer: ReturnType<typeof globalThis.setTimeout> | undefined;

  protected readonly isOpen = signal(false);
  protected readonly isHidden = signal(false);
  protected readonly copy = computed(() => ASSISTANT_COPY[this.locale()]);
  protected readonly messages = linkedSignal<readonly AssistantMessage[]>(() => [
    { role: 'assistant', content: this.copy().initialMessage },
  ]);
  protected readonly isSending = signal(false);
  protected readonly error = signal('');
  protected readonly quickQuestions = computed(() => this.copy().quickQuestions);

  protected readonly question = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(MAX_QUESTION_LENGTH)],
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearPendingFocusTimer();
      this.clearPendingScrollTimer();
    });
  }

  protected open(): void {
    this.error.set('');
    this.isHidden.set(false);

    if (this.isOpen()) {
      return;
    }

    this.isOpen.set(true);
    this.scheduleFocusQuestionField();
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
    this.scheduleFocusLauncher();
  }

  protected hideAssistant(): void {
    this.isOpen.set(false);
    this.isHidden.set(true);
    this.scheduleFocusRestoreButton();
  }

  protected restoreAssistant(): void {
    this.isHidden.set(false);
    this.open();
  }

  protected async sendQuestion(suggestedQuestion?: string): Promise<void> {
    if (suggestedQuestion) {
      this.question.setValue(suggestedQuestion);
    }

    if (this.question.invalid || this.isSending()) {
      this.question.markAsTouched();
      return;
    }

    const visitorMessage: AssistantMessage = {
      role: 'user',
      content: this.question.value.trim(),
    };
    this.messages.update((messages) => [...messages, visitorMessage]);
    this.question.reset();
    this.error.set('');
    this.isSending.set(true);
    this.scheduleScrollConversation();

    try {
      const response = await this.api.ask(this.messages().slice(-6), this.locale());
      this.messages.update((messages) => [
        ...messages,
        { role: 'assistant', content: response.answer },
      ]);
      this.scheduleScrollConversation();
    } catch (error: unknown) {
      this.error.set(readApiError(error, this.copy().unavailable));
    } finally {
      this.isSending.set(false);
      this.scheduleFocusQuestionField();
    }
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

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private scheduleFocusQuestionField(): void {
    this.scheduleFocus(() => this.questionField()?.nativeElement.focus());
  }

  private scheduleFocusLauncher(): void {
    this.scheduleFocus(() => this.launcher()?.nativeElement.focus());
  }

  private scheduleFocusRestoreButton(): void {
    this.scheduleFocus(() => this.restoreButton()?.nativeElement.focus());
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

function readApiError(error: unknown, fallback: string): string {
  if (
    error instanceof HttpErrorResponse &&
    typeof error.error === 'object' &&
    error.error !== null &&
    'error' in error.error &&
    typeof error.error.error === 'string'
  ) {
    return error.error.error;
  }

  return fallback;
}
