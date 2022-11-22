import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, CareerState, careerFeatureKey, selectEntities } from './career.reducer'

export const selectCareerState = createFeatureSelector<CareerState>(careerFeatureKey)

export const selectAllCareers = createSelector(
  selectCareerState,
  selectAll
)

export const selectActiveCareers = createSelector(
  selectAllCareers,
  (careers) => careers.filter(career => !career.archived)
)

export const selectInactiveCareers = createSelector(
  selectAllCareers,
  (careers) => careers.filter(career => career.archived)
)

export const selectInactiveCareersCount = createSelector(
  selectInactiveCareers,
  (careers) => careers.length
)

export const selectCareerEntities = createSelector(
  selectCareerState,
  selectEntities
)

export const selectLoading = createSelector(
  selectCareerState,
  (state) => state.loading
)

export const selectCareerById = (id: string) => createSelector(
  selectCareerEntities,
  (careers) => careers[id]
)

export const selectCareersIn = (ids: string[]) => createSelector(
  selectCareerEntities,
  (careers) => ids.map(id => careers[id])
)
