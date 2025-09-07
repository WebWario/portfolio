import {SERVICELOGLEVEL} from '../../misc/logger/logger-service';
import {GeometryService} from './geometry-service';
import {LineOptions} from './canva-models';

/**
 * Class for drawing on canvas.
 * */
export class Painter{

  readonly DEFAULTSTYLE = 'black';
  readonly DEFAULTWIDTH = 5;
  readonly DEFAULTCAP = 'butt';
  readonly DEFAULTDASH = [];
  readonly DEFAULTJOIN = 'miter';

  _canvas?: OffscreenCanvas;
  context?: OffscreenCanvasRenderingContext2D;

  constructor(canvas: OffscreenCanvas){
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d")!;
  }

  set canvas(canvas: OffscreenCanvas){
    this._canvas = canvas;
    this.context = canvas.getContext("2d")!;
  }

  get canvas(): OffscreenCanvas | undefined{
    return this._canvas;
  }

  contextExist():boolean{
    if(!!this.context){
      return true;
    }
    throw new Error("Context does not exist.");
  }

  canvasExist(): boolean {
    if(!!this.canvas){
      return true;
    }
    throw new Error("Canvas does not exist.");
  }

  /**
   * Clears the canvas.
   * */
  clearCanvas(){
    this.contextExist()
    this.context!.clearRect(0,0, this._canvas!.width, this._canvas!.height);
  }

  /**
   * Resizes the canvas.
   * */
  onResize(message: any){
    this.canvasExist();
    if(message.hasOwnProperty("height") && message.hasOwnProperty("width")){
      this.canvas!.height = message.height;
      this.canvas!.width = message.width;
      return;
    }
  }

  /**
   * @returns number is always unequal.
   * */
  unequalToEqual(val: number){
    if (!val){
      throw new Error("Value passed is falsey.");
    }
    return val % 2 === 0 ? val + 1 : val;
  }

  /**
   * Draws a path, adds it to the subpath. Does not begin a new path.
   *
   * If isSubpath is given in the message the path will be added to the subpaths, else beginPath() is called.
   * If style information is passed it will be honored regardless.
   * @returns void
   * @param ctx
   * @param msg
   * */
  drawCurvedPath(msg: any){
    this.contextExist();
    this.curvedMsgValid(msg);

    const radius = msg.options.radius;
    const pointArr = msg.options.pointArray;

    let idx = 0;
    this.context!.beginPath();
    this.context!.strokeStyle = msg.options.strokeStyle;
    this.context!.lineWidth = msg.options.lineWidth;
    while(idx < pointArr.length - 2){
      let pS = pointArr[idx];
      let p3 = pointArr[idx+1];
      let pE = pointArr[idx+2];

      let frstSct = GeometryService.linearInterpolation(pS, p3);
      let p2 = GeometryService.getLinePoint(frstSct.m, frstSct.b, GeometryService.midX(pS, p3));

      let sndSct = GeometryService.linearInterpolation(p3, pE);
      let p4 = GeometryService.getLinePoint(sndSct.m, sndSct.b, GeometryService.midX(p3, pE));
      if(idx === 0){
        this.context!.moveTo(pS.x, pS.y);
      }
      // TODO: non rounded edge on every second corner
      this.context!.lineTo(p2.x, p2.y);
      this.context!.arcTo(p3.x, p3.y, p4.x, p4.y, radius);
      this.context!.lineTo(pE.x, pE.y);
      idx = idx + 1; // TODO: has to do with moving only one at a time and then calling lineTo()
    }
    this.context!.stroke();
  }

  /**
   * Draws a simple line from list start point to list end point through all list points.
   * */
  drawSimplePath(msg: any){
    this.contextExist();
    this.lineMsgValid(msg);

    const offsetX = msg.options.offset.offsetX;
    const offsetY = msg.options.offset.offsetY;
    const pointArr = msg.options.pointArr;
    this.applyLineOptions(msg.options.line);
    this.context!.beginPath();
    for(const [index, point] of pointArr.entries()){
      let x = point.x + offsetX;
      let y = point.y + offsetY;
      if(index != 0){
        this.context!.lineTo(x, y);
      } else if(index == 0){
        this.context!.moveTo(x, y);
      }
    }
    this.context!.stroke()
  }

  /**
   * Applies line options to the current context.
   * */
  private applyLineOptions(lineOptions: LineOptions){
    if(!this.context){
      throw new Error('Cannot apply line options to undefined context.')
    }
    this.context.strokeStyle = lineOptions.strokeStyle ?? this.DEFAULTSTYLE;
    this.context.lineWidth = lineOptions.lineWidth ?? this.DEFAULTWIDTH;
    this.context.lineCap = lineOptions.lineCap ?? this.DEFAULTCAP;
    this.context.setLineDash(lineOptions.lineDash ?? this.DEFAULTDASH);
    this.context.lineJoin = lineOptions.lineJoin ?? this.DEFAULTJOIN;
  }

  curvedMsgValid(msg: any){
    if(!(msg.options.radius)){
      throw new Error(`Message to worker must contain radius. Contained: ${Array.from(msg.options.keys)}`)
    }
    this.lineMsgValid(msg);
  }

  lineMsgValid(msg:any){
    if(!(msg.options.pointArr && msg.options.line)){
      throw new Error(`Message does not contain proper options. Need pointArr, strokeStyle and lineWidth to drawline.`)
    }
  }
}
