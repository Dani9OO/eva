import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, TeamState, teamFeatureKey } from './team.reducer'

export const selectTeamState = createFeatureSelector<TeamState>(teamFeatureKey)

export const selectAllTeams = createSelector(
  selectTeamState,
  selectAll
)

export const selectLoading = createSelector(
  selectTeamState,
  (state) => state.loading
)

export const selectTeam = (calendar: string, career: string) => createSelector(
  selectAllTeams,
  (teams) => teams.find(team => team.calendar === calendar && team.career === career)
)
