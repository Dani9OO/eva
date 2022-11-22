import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { AssessmentActions } from '@store/assessment'
import { Assessment } from '@models/assessment'

export const assessmentFeatureKey = 'assessment'

export interface AssessmentState extends EntityState<Assessment> {
  loading: boolean
}

export const adapter: EntityAdapter<Assessment> = createEntityAdapter<Assessment>()

export const initialState: AssessmentState = adapter.getInitialState({
  loading: false
})

export const reducer = createReducer(
  initialState,
  on(AssessmentActions.upsertAssessmentSuccess,
    (state, action) => adapter.upsertOne(action.assessment, state)
  ),
  on(AssessmentActions.loadCareerAssessments,
    (state): AssessmentState => ({ ...state, loading: true })
  ),
  on(AssessmentActions.loadCareerAssessmentsSuccess,
    (state, action) => adapter.upsertMany(action.assessments, { ...state, loading: false })
  ),
  on(AssessmentActions.loadCareerAssessmentsFailure,
    (state): AssessmentState => ({ ...state, loading: false })
  ),
  on(AssessmentActions.clearAssessments,
    state => adapter.removeAll(state)
  )
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()
