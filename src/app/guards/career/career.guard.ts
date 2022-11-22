import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable, map } from 'rxjs'
import { selectUser } from '@selectors/app'

@Injectable({
  providedIn: 'root'
})
export class CareerGuard implements CanActivate {
  public constructor(
    private readonly store: Store
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const user = this.store.select(selectUser)
    return user.pipe(
      map(u => u.careers?.some(c => c === route.params.career))
    )
  }
}
