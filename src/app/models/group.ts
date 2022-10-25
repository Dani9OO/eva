export type Quarter = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type Shift = 'morning' | 'evening'

export interface Group {
  id?: string
  calendar: string
  career: string
  letter: string
  quarter: Quarter
  shift: Shift
}
