import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { CoordinatorActions } from '@store/coordinator'
import { Coordinator } from '@models/coordinator'

export const coordinatorFeatureKey = 'coordinator'

export interface CoordinatorState extends EntityState<Coordinator> {
  loading: boolean
}

export const adapter: EntityAdapter<Coordinator> = createEntityAdapter<Coordinator>()

export const initialState: CoordinatorState = adapter.getInitialState({
  loading: false
})

export const reducer = createReducer(
  initialState,
  on(CoordinatorActions.upsertCoordinator,
    (state, action) => adapter.removeMany(
      Object.values(state.entities)
        .filter(coordinator => coordinator.calendar === action.coordinator.calendar && coordinator.career === action.coordinator.career)
        .map(group => group.id),
      state
    )
  ),
  on(CoordinatorActions.upsertCoordinatorSuccess,
    (state, action) => adapter.upsertOne(action.coordinator, state)
  ),
  on(CoordinatorActions.loadCoordinators,
    (state): CoordinatorState => ({ ...state, loading: true })
  ),
  on(CoordinatorActions.loadCoordinatorsSuccess,
    (state, action) => adapter.upsertMany(action.coordinators, { ...state, loading: false })
  ),
  on(CoordinatorActions.loadCoordinatorsFailure,
    (state): CoordinatorState => ({ ...state, loading: false })
  ),
  on(CoordinatorActions.clearCoordinators,
    state => adapter.removeAll(state)
  )
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()
