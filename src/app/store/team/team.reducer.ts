import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { TeamActions } from '@store/team'
import { Team } from '@models/team'

export const teamFeatureKey = 'team'

export interface TeamState extends EntityState<Team> {
  loading: boolean
}

export const adapter: EntityAdapter<Team> = createEntityAdapter<Team>()

export const initialState: TeamState = adapter.getInitialState({
  loading: false
})

export const reducer = createReducer(
  initialState,
  on(TeamActions.upsertTeamSuccess,
    (state, action) => adapter.upsertOne(action.team, state)
  ),
  on(TeamActions.loadTeams,
    (state): TeamState => ({ ...state, loading: true })
  ),
  on(TeamActions.loadTeamsSuccess,
    (state, action) => adapter.setAll(action.teams, { ...state, loading: false })
  ),
  on(TeamActions.loadTeamsFailure,
    (state): TeamState => ({ ...state, loading: false })
  ),
  on(TeamActions.clearTeams,
    state => adapter.removeAll(state)
  )
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()
