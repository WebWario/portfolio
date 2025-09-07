/**
 * Service for geometric calculations.
 * */
export class GeometryService {

  /**
   * Interpolates linearly between two points.
   *
   * @param p1 a point on the line
   * @param p2 a point on the line
   * @returns m,b linear params as object.
   * */
  static linearInterpolation(p1, p2){
    const m = (p2.y - p1.y) / (p2.x - p1.x);
    const b = p1.y - m*p1.x;
    return {m: m, b: b};
  }

  /**
   * Get a point on the line with params m, b and the x coordinate x.
   *
   * @param m the slope of the line
   * @param b the y-axis schnittpunkt of the line
   * @param x the x part of a coordinate that should be on the line
   * */
  static getLinePoint(m, b, x){
    return {x: x, y: m*x + b};
  }

  /**
   * Gets a valid x value that is in between p1 and p2.
   *
   * @param p1 the first point.
   * @param p2 the second point.
   * */
  static midX(p1, p2){
    return p1.x + (p2.x - p1.x) / 2;
  }
}












