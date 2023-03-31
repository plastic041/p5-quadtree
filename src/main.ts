import P5 from "p5";
import { QuadTree } from "./classes/quadtree";
import { AABB } from "./classes/aabb";
import { Point } from "./classes/point";

// @ts-expect-error app is not used but it is required to run the sketch
const app = new P5((p5: P5) => {
  let qt: QuadTree;

  p5.setup = () => {
    p5.createCanvas(800, 800);

    qt = new QuadTree(new AABB(new Point(400, 400), 400), 2, p5);

    p5.rectMode(p5.CENTER);
    p5.strokeWeight(2);
  };

  p5.draw = () => {
    p5.background(0);

    if (p5.mouseIsPressed) {
      // if left mouse button is pressed
      if (p5.mouseButton === p5.LEFT) {
        for (let i = 0; i < 1; i++) {
          const m = new Point(
            p5.mouseX + p5.random(-5, 5),
            p5.mouseY + p5.random(-5, 5)
          );
          qt.insert(m);
        }
      }
    }

    qt.draw();

    const range = new AABB(new Point(p5.mouseX, p5.mouseY), 100);

    p5.stroke(0, 255, 0);
    p5.noFill();
    p5.rect(
      range.center.x,
      range.center.y,
      range.halfDemension * 2,
      range.halfDemension * 2
    );

    const points = qt.queryRange(range);

    for (const point of points) {
      p5.push();
      p5.strokeWeight(4);
      p5.point(point.x, point.y);
      p5.pop();
    }
  };
}, document.getElementById("app")!);
