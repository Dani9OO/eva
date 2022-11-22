import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, AssessmentState, assessmentFeatureKey } from './assessment.reducer'

export const selectAssessmentState = createFeatureSelector<AssessmentState>(assessmentFeatureKey)

export const selectAllAssessments = createSelector(
  selectAssessmentState,
  selectAll
)

export const selectLoading = createSelector(
  selectAssessmentState,
  (state) => state.loading
)

export const selectAssessments = (calendar: string, career: string) => createSelector(
  selectAllAssessments,
  (assessments) => assessments.filter(a => a.calendar === calendar && a.career === career)
)

export const selectAssessmentsMissing = createSelector(
  selectAllAssessments,
  (assessments) => !assessments.length
)
