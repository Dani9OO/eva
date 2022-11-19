import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { selectIsRole } from '@selectors/app'

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  public constructor(
    private readonly store: Store
  ) {}

  public canActivate(): Observable<boolean> {
    return this.store.select(selectIsRole('admin'))
  }
}
