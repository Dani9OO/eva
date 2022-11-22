export type Grade = 0 | 8 | 9 | 10

export interface AssessmentResult {
  rubric: string
  grade: Grade
}

export interface Assessment {
  id?: string
  createdBy: string
  team: string
  group: string
  career: string
  calendar: string
  result: AssessmentResult[]
}
