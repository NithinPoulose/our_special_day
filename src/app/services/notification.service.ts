import { Injectable, signal } from '@angular/core';

interface PushKeyResponse {
  publicKey: string;
}

interface PushApiErrorResponse {
  error?: string;
}

interface StoredPushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    auth: string;
    p256dh: string;
  };
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly permissionGranted = signal(false);
  readonly pushSupported = signal(false);
  readonly subscriptionActive = signal(false);
  readonly statusMessage = signal<string | null>(null);

  constructor() {
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    if (!this.isPushSupported()) {
      return;
    }

    this.pushSupported.set(true);
    this.permissionGranted.set(Notification.permission === 'granted');
    await this.refreshSubscriptionState();
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isPushSupported()) {
      this.statusMessage.set('This browser does not support background push notifications.');
      return false;
    }

    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';

    this.permissionGranted.set(granted);

    if (!granted) {
      this.subscriptionActive.set(false);
      this.statusMessage.set(
        'Notifications were not enabled. Please allow them in the browser prompt.'
      );
      return false;
    }

    try {
      const registration = await this.getServiceWorkerRegistration();
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: await this.getApplicationServerKey(),
        });
      }

      await this.saveSubscription(subscription);
      this.subscriptionActive.set(true);
      this.statusMessage.set('Push notifications are enabled.');

      return true;
    } catch (error) {
      this.subscriptionActive.set(false);
      this.statusMessage.set(this.getErrorMessage(error));
      return false;
    }
  }

  private isPushSupported(): boolean {
    return typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window;
  }

  private async refreshSubscriptionState(): Promise<void> {
    try {
      const registration = await this.getServiceWorkerRegistration();
      const subscription = await registration.pushManager.getSubscription();

      this.subscriptionActive.set(Boolean(subscription));

      if (subscription) {
        this.permissionGranted.set(true);
      }
    } catch {
      this.subscriptionActive.set(false);
    }
  }

  private async getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
    const existingRegistration = await navigator.serviceWorker.getRegistration('/');

    if (existingRegistration?.active) {
      return existingRegistration;
    }

    await navigator.serviceWorker.register('/sw.js');
    return navigator.serviceWorker.ready;
  }

  private async getApplicationServerKey(): Promise<ArrayBuffer> {
    const response = await fetch('/api/push/public-key', {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(await this.getApiError(response));
    }

    const payload = (await response.json()) as PushKeyResponse;

    return this.urlBase64ToUint8Array(payload.publicKey);
  }

  private async saveSubscription(subscription: PushSubscription): Promise<void> {
    const payload = subscription.toJSON();

    if (!this.isValidSubscription(payload)) {
      throw new Error('The browser returned an invalid push subscription.');
    }

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await this.getApiError(response));
    }
  }

  private isValidSubscription(
    subscription: PushSubscriptionJSON | null
  ): subscription is StoredPushSubscription {
    return Boolean(
      subscription?.endpoint &&
      subscription.keys?.['auth'] &&
      subscription.keys?.['p256dh']
    );
  }

  private async getApiError(response: Response): Promise<string> {
    try {
      const payload = (await response.json()) as PushApiErrorResponse;
      return payload.error ?? 'Push setup failed on the server.';
    } catch {
      return 'Push setup failed on the server.';
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Unable to enable push notifications right now.';
  }

  private urlBase64ToUint8Array(value: string): ArrayBuffer {
    const padding = '='.repeat((4 - (value.length % 4)) % 4);
    const normalizedValue = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawValue = atob(normalizedValue);
    const bytes = Uint8Array.from(rawValue, (character) => character.charCodeAt(0));
    const buffer = new ArrayBuffer(bytes.byteLength);

    new Uint8Array(buffer).set(bytes);

    return buffer;
  }
}
