import { Color } from './color.model';

import { Position } from '../interfaces/position.interface';

export class Pixel {
  private x: number = 0;
  private y: number = 0;

  public color: Color;

  constructor(pos: Position = { x: 0, y: 0 }, color: Color = new Color()) {
    this.position = pos;
    this.color = color;
  }

  public get position(): Position {
    return { x: this.x, y: this.y };
  }

  public set position(pos: Position) {
    this.x = pos.x;
    this.y = pos.y;
  }
}
