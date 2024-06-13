import { createUuid } from '../tools.ts'

interface ShapeProp {
  type: number
  [key: string]: any
}
export default class Shape {
  public label: string = ''
  public coor: Array<any> = []
  public strokeStyle: string = ''
  public fillStyle: string = ''
  public labelFillStyle: string = ''
  public textFillStyle: string = ''
  public labelFont: string = ''
  public type: number = 0 // 形状
  public active: boolean = false
  public creating: boolean = false
  public dragging: boolean = false
  public index: number
  public uuid: string = createUuid()
  public id?: number
  public count?: number
  constructor(item: ShapeProp, index: number) {
    this.index = index
    Object.assign(this, item)
  }
}
