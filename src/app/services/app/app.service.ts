import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { Calendar } from '../../models/calendar.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _locale: string
  private lottie = false

  constructor() {
    this.init()
  }

  public initLottie(): void {
    if (this.lottie) return
    const tag = document.createElement('script')
    tag.src = 'https://unpkg.com/@lottiefiles/lottie-player@1.5.7/dist/lottie-player.js'
    document.body.appendChild(tag)
    this.lottie = true
  }

  public get locale(): string {
    return this._locale
  }

  private async init(): Promise<void> {
    this._locale = (await Device.getLanguageTag()).value
  }
}
