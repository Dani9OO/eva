import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { getApp, initializeApp,provideFirebaseApp } from '@angular/fire/app'
import { environment } from '../environments/environment'
import { provideAuth,getAuth, initializeAuth, indexedDBLocalPersistence } from '@angular/fire/auth'
import { provideFirestore, getFirestore } from '@angular/fire/firestore'
import { SpinnerComponent } from './components/spinner/spinner.component'
import { Capacitor } from '@capacitor/core'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { AppEffects } from './app.effects'
import { reducer } from './app.reducer'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      if (!Capacitor.isNativePlatform()) return getAuth()
      return initializeAuth(getApp(), { persistence: indexedDBLocalPersistence })
    }),
    provideFirestore(() => getFirestore()),
    SpinnerComponent,
    StoreModule.forRoot({ app: reducer }),
    EffectsModule.forRoot([AppEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
