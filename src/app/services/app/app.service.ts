import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private lottie = false;

  constructor() { }

  public initLottie() {
    if (this.lottie) return;
    const tag = document.createElement('script')
    tag.src = 'https://unpkg.com/@lottiefiles/lottie-player@1.5.7/dist/lottie-player.js'
    document.body.appendChild(tag)
    this.lottie = true;
  }
}
