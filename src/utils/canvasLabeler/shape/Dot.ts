import Shape from './Shape.ts'

export default class Dot extends Shape {
  public type = 3
  constructor(item: any, index: number) {
    super(item, index)
  }
}
