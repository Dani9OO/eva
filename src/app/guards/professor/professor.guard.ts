import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable, zip, map } from 'rxjs'
import { selectIsRole } from '@selectors/app'

@Injectable({
  providedIn: 'root'
})
export class ProfessorGuard implements CanActivate {
  public constructor(
    private readonly store: Store
  ) {}

  public canActivate(): Observable<boolean> {
    return zip(
      this.store.select(selectIsRole('professor')),
      this.store.select(selectIsRole('coordinator'))
    ).pipe(
      map(([professor, coordinator]) => professor || coordinator)
    )
  }
}
