import { Injectable } from '@angular/core'
import { DataService } from '@classes/data-service'
import { Firestore, query, where, getDocs, updateDoc, getDoc, deleteDoc } from '@angular/fire/firestore'
import { from, Observable, map } from 'rxjs'
import { Team } from '@models/team'
import { take, switchMap } from 'rxjs/operators'
import { Role } from '@models/role'

@Injectable({
  providedIn: 'root'
})
export class TeamService extends DataService<Team> {
  public constructor(
    protected readonly firestore: Firestore
  ) {
    super('Team', firestore)
  }

  public getTeams(calendar: string, career: string): Observable<Team[]> {
    const q = query(this.collection, where('calendar', '==', calendar), where('career', '==', career))
    return from(getDocs(q)).pipe(
      take(1),
      map(result => result.docs.map(document => ({ id: document.id, ...document.data() })))
    )
  }

  public findUserTeam(calendar: string, user: string, role: Role): Observable<Team> {
    if (role !== 'alumni') throw new Error('Only alumni can be part of a team')
    const q = query(this.collection, where('calendar', '==', calendar), where('members', 'array-contains', user))
    return from(getDocs(q)).pipe(
      take(1),
      map(result => ({ id: result.docs[0].id, ...result.docs[0].data() }))
    )
  }

  public updateTeamMembers(id: string, user: string, operation: 'push' | 'pull'): Observable<Team> {
    const ref = this.doc(this.path, id)
    return from(getDoc(ref)).pipe(
      map(result => result.data()),
      switchMap(team => {
        const members = [...team.members]
        if (operation === 'push') members.push(user)
        else {
          const index = members.findIndex(member => member === user)
          if (index !== -1) members.splice(index, 1)
        }
        if (members.length === team.members.length) throw Error('User does not belong to this team')
        if (members.length === 0) return from(deleteDoc(ref)).pipe(
          map(() => undefined)
        )
        else return from(updateDoc(ref, { ...team, members })).pipe(
          map(() => ({ ...team, members }))
        )
      })
    )
  }
}
