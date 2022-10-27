import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { RubricActions } from '@store/rubric'
import { Rubric } from '@models/rubric'

export const rubricFeatureKey = 'rubric'

export interface RubricState extends EntityState<Rubric> {
  loading: boolean
}

export const adapter: EntityAdapter<Rubric> = createEntityAdapter<Rubric>()

export const initialState: RubricState = adapter.getInitialState({
  loading: false
})

export const reducer = createReducer(
  initialState,
  on(RubricActions.upsertRubricSuccess,
    (state, action) => adapter.upsertOne(action.rubric, state)
  ),
  on(RubricActions.loadRubrics,
    (state): RubricState => ({ ...state, loading: true })
  ),
  on(RubricActions.loadRubricsSuccess,
    (state, action) => adapter.upsertMany(action.rubrics, { ...state, loading: false })
  ),
  on(RubricActions.loadRubricsFailure,
    (state): RubricState => ({ ...state, loading: false })
  ),
  on(RubricActions.clearRubrics,
    state => adapter.removeAll(state)
  )
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()
