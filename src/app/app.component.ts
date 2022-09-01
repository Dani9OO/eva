import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';
import { Observable, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'eva-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public initialized$: Observable<boolean>;
  public splash: AnimationOptions = {
    path: 'assets/eva.json',
    loop: false
  };
  private initialized: BehaviorSubject<boolean>;
  constructor(
    private platform: Platform
  ) {
    this.initialized = new BehaviorSubject(false);
    this.initialized$ = this.initialized.asObservable();
    this.init();
  }

  private async init() {
    await this.platform.ready();
    if (this.platform.is('ios')) await this.showSplash();
    this.initialized.next(true);
    GoogleAuth.initialize({
      clientId: '733249240859-k9viv6v3lagtbqn68uk0a4mnk52ng5h5.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }

  private async showSplash() {
    const lottie = (window as any).lottie;
    await lottie.splashscreen.hide();
    await lottie.splashscreen.show('public/assets/eva.json', false);
  }
}
