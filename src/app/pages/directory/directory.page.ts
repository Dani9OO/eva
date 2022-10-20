import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { AppUser } from '@models/user'
import { Store } from '@ngrx/store'
import { selectAllUsers } from '@selectors/user'
import { UserActions } from '@store/user'

@Component({
  selector: 'eva-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss']
})
export class DirectoryPage implements OnInit {
  public users$: Observable<AppUser[]>

  public constructor(
    private readonly store: Store
  ) { }

  public ngOnInit(): void {
    this.store.dispatch(UserActions.loadUsers({}))
    this.users$ = this.store.select(selectAllUsers)
  }

  public toggleAdmin(user: AppUser): void {
    this.store.dispatch(UserActions.toggleAdmin({ user }))
  }
}
