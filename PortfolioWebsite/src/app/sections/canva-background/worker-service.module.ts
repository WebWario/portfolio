import {Failure, Result, Success} from '../../misc/result';
import {ElementRef, Injectable, NgModule} from '@angular/core';
import {LoggerService, SERVICELOGLEVEL} from '../../misc/logger/logger-service';
import {RefService} from './ref-service';
import {CanvasWorkerMessage, Path} from './canva-models';

@NgModule ({
  providers: [Result]
})

/**
 * Handles communications with the canvas worker.
 * */
@Injectable({
  providedIn: "root"
})
export class WorkerService {

  constructor(private result: Result, private logger : LoggerService, private refService: RefService){
  }

  /**
   * Transfers control to the offscreen canvas if web worker exist.
   *
   * Must pass 'firstDelegate' cmd to this function in data.
   *
   * @returns Success if transfer was successful; failure otherwise.
   * */
  transferControl(data: CanvasWorkerMessage, worker: Worker, canvaObj: HTMLCanvasElement, width:number, height:number): Success | Failure {
    if(data.cmd != "firstDelegate"){
      return this.result.isFailure("Only firstDelegate cmd is allowed on transfering offscreen control to web worker.");
    }
    if(!worker){
      return this.result.isFailure("No web worker to pass control to.");
    }
    let offScreen = canvaObj!.transferControlToOffscreen();
    if(!offScreen || offScreen.hasOwnProperty('error')) {
      return this.result.isFailure("Offscreen not created.")
    }
    offScreen!.width = width;
    offScreen!.height = height;

    data.canvas = offScreen;

    worker.postMessage(data, [offScreen]);
    return this.result.isSuccess([data]);
  }

  /**
   * Sends a post message to worker, holding control of OffScreenCanvas to draw line.
   *
   * @param message
   * @param worker the WebWorker to post to.
   * */
  draw(message: CanvasWorkerMessage[], worker: Worker): Success | Failure {
    let res: Success | Failure;
    if(worker){
      const msg = message;
      worker.postMessage(msg);
      res = this.result.isSuccess(true);
    } else {
      res = this.result.isFailure("No worker to post to.")
    }
    return res;
  }

  /**
   * Sends resize cmd to canvas worker.
   * */
  resizeCanvas(worker: Worker, width?: number, height?: number){
    if(!width && !height){
      this.logger.log("Width or height are null.",SERVICELOGLEVEL.Debug);
      return;
    }
    worker!.postMessage(({
      cmd: 'resize',
      width: width,
      height: height
    } as CanvasWorkerMessage));
    this.logger.log("Successfully send canvas resize message.", SERVICELOGLEVEL.Info);
  }

  clearCanvas(worker: Worker){
    worker.postMessage({
      cmd: 'clearCanvas'
    } as CanvasWorkerMessage);
  }

  pathToSimplePathMessage(data: {[key: number | string]: Path}){
    return Object.keys(data).map(k => {
      const cur = data[k];
      let pointArr = cur.nodeReferences.map((ref: ElementRef) => {
        return this.calcRefCenter(ref);
      });
      return ({
        cmd : cur.cmd,
        options: {
          line: cur.line,
          pointArr : pointArr,
          offset: {
            offsetX : cur.offset ? cur.offset.offsetX : undefined,
            offsetY : cur.offset ? cur.offset.offsetY : undefined
          }
        }
      } as CanvasWorkerMessage)
    });
  }

  /**
   * Calculates the center of an element ref bounding box.
   *
   * @returns point object with x, y specifying the center of the ref bounding box.
   * */
  private calcRefCenter(ref: ElementRef){
    const rect = ref.nativeElement.getBoundingClientRect();
    const prntRect = ref.nativeElement.parentElement.getBoundingClientRect();
    const x = rect.x + rect.width / 2 - prntRect.x;
    const y = rect.y + rect.height / 2 - prntRect.y;
    return {x: x, y: y}
  }
}
