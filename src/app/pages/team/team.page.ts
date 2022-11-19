import { selectGroupById } from '@selectors/group'
import { selectCareerById } from '@selectors/career'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Calendar } from '@models/calendar'
import { Team } from '@models/team'
import { Store } from '@ngrx/store'
import { Observable, BehaviorSubject } from 'rxjs'
import { selectCalendar, selectTeam } from '@selectors/app'
import { Platform, ModalController, ToastController } from '@ionic/angular'
import { JoinTeamComponent } from './join-team/join-team.component'
import { TeamActions } from '@store/team'
import { ScannerService } from '@services/scanner'
import { Group } from '@models/group'
import { Career } from '@models/career'
import { switchMap } from 'rxjs/operators'
import { Clipboard } from '@capacitor/clipboard'

@Component({
  selector: 'eva-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamPage implements OnInit {
  public calendar$: Observable<Calendar>
  public team$: Observable<Team>
  public qr$: Observable<boolean>
  public readonly hybrid: boolean
  public group$: Observable<Group>
  public career$: Observable<Career>
  private _qr: BehaviorSubject<boolean>

  public constructor(
    private readonly store: Store,
    private readonly platform: Platform,
    private readonly modal: ModalController,
    private readonly scanner: ScannerService,
    private readonly toast: ToastController
  ) {
    this.hybrid = this.platform.is('hybrid')
    this._qr = new BehaviorSubject<boolean>(true)
    this.qr$ = this._qr.asObservable()
  }

  public ngOnInit(): void {
    this.calendar$ = this.store.select(selectCalendar)
    this.team$ = this.store.select(selectTeam)
    this.career$ = this.team$.pipe(switchMap(team => this.store.select(selectCareerById(team.career))))
    this.group$ = this.team$.pipe(switchMap(team => this.store.select(selectGroupById(team.group))))
  }

  public async scan(): Promise<void> {
    if (this.hybrid) {
      const team = await this.scanner.scan()
      this.store.dispatch(TeamActions.joinTeam({ team }))
    } else {
      const modal = await this.modal.create({
        component: JoinTeamComponent
      })
      await modal.present()
      const result = await modal.onWillDismiss()
      if (!result.data || result.role === 'cancel') return
      this.store.dispatch(TeamActions.joinTeam({ team: result.data }))
    }
  }

  public toggleQR(visible: boolean): void {
    this._qr.next(!visible)
  }

  public leaveTeam(): void {
    this.store.dispatch(TeamActions.leaveTeam())
  }

  public async copy(team: string): Promise<void> {
    await Clipboard.write({
      // eslint-disable-next-line id-blacklist
      string: team
    })
    const toast = await this.toast.create({
      duration: 3000,
      message: 'Código de equipo copiado al portapapeles',
      buttons: ['OK']
    })
    await toast.present()
  }
}
