import { Rubric } from '@models/rubric'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, RubricState, rubricFeatureKey } from './rubric.reducer'

export const selectRubricState = createFeatureSelector<RubricState>(rubricFeatureKey)

export const selectAllRubrics = createSelector(
  selectRubricState,
  selectAll
)

export const selectLoading = createSelector(
  selectRubricState,
  (state) => state.loading
)

export const selectRubrics = (calendar: string, career: string) => createSelector(
  selectAllRubrics,
  (rubrics) => {
    const groups: { [k: string]: Rubric[] } = {}
    rubrics.filter(rubric => rubric.calendar === calendar && rubric.career === career).forEach(rubric => {
      if (!groups[rubric.category || 'none']) groups[rubric.category || 'none'] = []
      groups[rubric.category || 'none'].push(rubric)
    })
    return groups
  }
)
