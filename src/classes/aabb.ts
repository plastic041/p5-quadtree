import { Point } from "./point";

export class AABB {
  center: Point;
  halfDemension: number;

  constructor(center: Point, halfDemension: number) {
    this.center = center;
    this.halfDemension = halfDemension;
  }

  contains(point: Point) {
    return (
      this.center.x - this.halfDemension <= point.x &&
      this.center.x + this.halfDemension >= point.x &&
      this.center.y - this.halfDemension <= point.y &&
      this.center.y + this.halfDemension >= point.y
    );
  }

  intersects(range: AABB) {
    return (
      this.center.x - this.halfDemension <=
        range.center.x + range.halfDemension &&
      this.center.x + this.halfDemension >=
        range.center.x - range.halfDemension &&
      this.center.y - this.halfDemension <=
        range.center.y + range.halfDemension &&
      this.center.y + this.halfDemension >= range.center.y - range.halfDemension
    );
  }
}
