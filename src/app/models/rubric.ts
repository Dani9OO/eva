import { Quarter } from './group'

export type Skills = 'SOFT' | 'HARD'

export type Weight = {
  [k in Quarter as string]?: number;
};

export interface Rubric {
  id?: string
  criteria: string
  skills: Skills
  weight: Weight
  category?: string
  calendar: string
  career: string
}
