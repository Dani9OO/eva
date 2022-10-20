import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { AppUser } from '@models/user'
import { Store } from '@ngrx/store'
import { selectAllUsers, selectLoading } from '@selectors/user'
import { UserActions } from '@store/user'
import { RefresherCustomEvent, SearchbarCustomEvent } from '@ionic/angular'
import { selectFilteredUsers } from '../../store/user/user.selectors'

@Component({
  selector: 'eva-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss']
})
export class DirectoryPage implements OnInit {
  public users$: Observable<AppUser[]>
  public loading$: Observable<boolean>

  public constructor(
    private readonly store: Store
  ) { }

  public ngOnInit(): void {
    this.store.dispatch(UserActions.loadUsers({}))
    this.users$ = this.store.select(selectAllUsers)
    this.loading$ = this.store.select(selectLoading)
  }

  public toggleAdmin(user: AppUser): void {
    this.store.dispatch(UserActions.toggleAdmin({ user }))
  }

  public refresh(event: Event): void {
    const ev = event as RefresherCustomEvent
    this.store.dispatch(UserActions.loadUsers({ force: true }))
    ev.target.complete()
  }

  public filter(event: Event): void {
    const ev = event as SearchbarCustomEvent
    this.users$ = this.store.select(ev.target.value ? selectFilteredUsers(ev.target.value) : selectAllUsers)
  }
}
