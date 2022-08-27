import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private readonly platform: Platform
  ) { }

  public get isApp(): boolean {
    return this.platform.is('hybrid');
  }
}
