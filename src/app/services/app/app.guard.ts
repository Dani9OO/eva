import { Injectable } from '@angular/core'
import { CanActivate, UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { selectUser } from '@selectors/app'

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectUser).pipe(
      map(user => !!user || this.router.createUrlTree(['/auth']))
    )
  }
}
