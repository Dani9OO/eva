/* eslint-disable @typescript-eslint/naming-convention */

import { Degree } from '@models/career'

export class Quarters {
  public readonly advanced?: [4, 5, 6]
  public readonly standard?: [1, 2, 3]
  private readonly TSU: [1, 2, 3, 4, 5, 6] = [1, 2, 3, 4, 5, 6]
  private readonly LIC: [7, 8, 9, 10] = [7, 8, 9, 10]

  public constructor(
    private readonly degree: Degree
  ) {
    if (degree !== 'TSU') return
    this.advanced = [4, 5, 6]
    this.standard = [1, 2, 3]
  }

  public get all(): number[] {
    return this[this.degree]
  }
}
