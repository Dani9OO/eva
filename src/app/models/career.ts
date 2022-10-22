export type Degree = 'TSU' | 'LIC'

export interface Career {
  id?: string
  abrv: string
  name: string
  degree: Degree
  icon: string
  archived: boolean
}
