import { Point } from "./point";
import { AABB } from "./aabb";
import P5 from "p5";

export class QuadTree {
  capacity: number;
  boundary: AABB;
  points: Point[];

  p5: P5;

  northWest?: QuadTree;
  northEast?: QuadTree;
  southWest?: QuadTree;
  southEast?: QuadTree;

  constructor(boundary: AABB, capacity: number, p5: P5) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.p5 = p5;
  }

  insert(point: Point) {
    if (!this.boundary.contains(point)) {
      // If the point is not in the boundary, point cannot be added
      return false;
    }

    if (this.points.length < this.capacity && !this.northWest) {
      // If the point is in the boundary and the capacity is not reached, add the point
      this.points.push(point);
      return true;
    }

    if (!this.northWest) {
      // If the point is in the boundary and the capacity is reached, subdivide the boundary
      this.subdivide();
    }

    // @ts-expect-error
    if (this.northWest.insert(point)) {
      return true;
    }
    // @ts-expect-error
    if (this.northEast.insert(point)) {
      return true;
    }
    // @ts-expect-error
    if (this.southWest.insert(point)) {
      return true;
    }
    // @ts-expect-error
    if (this.southEast.insert(point)) {
      return true;
    }

    throw new Error("Point cannot be added");
  }

  subdivide() {
    const x = this.boundary.center.x;
    const y = this.boundary.center.y;
    const halfDemension = this.boundary.halfDemension;

    const northWest = new AABB(
      new Point(x - halfDemension / 2, y - halfDemension / 2),
      halfDemension / 2
    );
    this.northWest = new QuadTree(northWest, this.capacity, this.p5);

    const northEast = new AABB(
      new Point(x + halfDemension / 2, y - halfDemension / 2),
      halfDemension / 2
    );
    this.northEast = new QuadTree(northEast, this.capacity, this.p5);

    const southWest = new AABB(
      new Point(x - halfDemension / 2, y + halfDemension / 2),
      halfDemension / 2
    );
    this.southWest = new QuadTree(southWest, this.capacity, this.p5);

    const southEast = new AABB(
      new Point(x + halfDemension / 2, y + halfDemension / 2),
      halfDemension / 2
    );
    this.southEast = new QuadTree(southEast, this.capacity, this.p5);

    for (const point of this.points) {
      this.northWest.insert(point);
      this.northEast.insert(point);
      this.southWest.insert(point);
      this.southEast.insert(point);
    }

    this.points = [];
  }

  queryRange(range: AABB, found: Point[] = []) {
    if (!this.boundary.intersects(range)) {
      return found;
    }

    for (const point of this.points) {
      if (range.contains(point)) {
        found.push(point);
      }
    }

    if (!this.northWest) {
      return found;
    }

    this.northWest.queryRange(range, found);
    // @ts-expect-error
    this.northEast.queryRange(range, found);
    // @ts-expect-error
    this.southWest.queryRange(range, found);
    // @ts-expect-error
    this.southEast.queryRange(range, found);

    return found;
  }

  draw() {
    this.p5.stroke(255);
    this.p5.noFill();
    this.p5.rect(
      this.boundary.center.x,
      this.boundary.center.y,
      this.boundary.halfDemension * 2,
      this.boundary.halfDemension * 2
    );

    for (const point of this.points) {
      this.p5.strokeWeight(1);
      this.p5.point(point.x, point.y);
    }

    if (!this.northWest) {
      return;
    }

    this.northWest?.draw();
    this.northEast?.draw();
    this.southWest?.draw();
    this.southEast?.draw();
  }
}
