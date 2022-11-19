import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { CareerActions } from '@store/career'
import { Career } from '@models/career'

export const careerFeatureKey = 'career'

export interface CareerState extends EntityState<Career> {
  loading: boolean
}

export const adapter: EntityAdapter<Career> = createEntityAdapter<Career>()

export const initialState: CareerState = adapter.getInitialState({
  loading: false
})

export const reducer = createReducer(
  initialState,
  on(CareerActions.upsertCareerSuccess,
    (state, action) => adapter.upsertOne(action.career, state)
  ),
  on(CareerActions.loadCareers,
    (state, action): CareerState => ({ ...state, loading: action.force || state.ids.length === 0 })
  ),
  on(CareerActions.loadCareersSuccess,
    (state, action) => adapter.setAll(action.careers, { ...state, loading: false })
  ),
  on(CareerActions.loadCareersFailure,
    (state): CareerState => ({ ...state, loading: false })
  ),
  on(CareerActions.toggleArchivedSuccess,
    (state, action): CareerState => adapter.updateOne(action.career, state)
  ),
  on(CareerActions.clearCareers,
    state => adapter.removeAll(state)
  ),
  on(CareerActions.loadCareerSuccess,
    (state, action) => adapter.upsertOne(action.career, state)
  )
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()
