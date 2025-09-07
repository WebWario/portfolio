/// <reference lib="webworker" />

import {LoggerService, SERVICELOGLEVEL} from '../../misc/logger/logger-service';
import {Painter} from './painter-service';
import {Injector} from '@angular/core';


let PAINTER: Painter;
let CONTEXT : OffscreenCanvasRenderingContext2D;
let CANVAS : OffscreenCanvas;
let LOGGER = new LoggerService();

addEventListener('message', ({ data }) => {
  if(!Array.isArray(data)){
    handler(data);
  } else if(Array.isArray(data)){
    data.forEach(d => {
      handler(d);
    })
  }
  const response = `worker response to ${data}`;
  postMessage(response);
});

let handler = (d: any)=> {
  if(!d){
    LOGGER.log('No data.', SERVICELOGLEVEL.Error);
    throw new Error("Message to web worker must carry data.")
  }

  if (!d.hasOwnProperty('cmd')){
    LOGGER.log('No command specified.', SERVICELOGLEVEL.Error);
    throw new Error("No command specified for Web Worker.");
  }

  const message = d;

  switch(message.cmd){
    case 'firstDelegate':
      if(CANVAS){
        LOGGER.log('Control already transfered.', SERVICELOGLEVEL.Debug);
        break;
      }
      /**
       * Sets the canvas and the corresponding context
       * */
      CANVAS = message.canvas;
      CONTEXT = CANVAS.getContext("2d")!;
      PAINTER = new Painter(CANVAS);
      LOGGER.log('Successfully initialized CANVA.', SERVICELOGLEVEL.Info)
      break;
    case 'resize':
      if(!CANVAS){
        LOGGER.log('No canvas to resize.', SERVICELOGLEVEL.Error);
        break;
      }
      PAINTER.onResize(message);
      LOGGER.log(`Successfully resized to WIDTH: ${d.width}, HEIGHT: ${d.height}`, SERVICELOGLEVEL.Info)
      break;
    case 'drawPath':
      PAINTER.drawCurvedPath(message);
      break;
    case 'drawSimplePath':
      PAINTER.drawSimplePath(message);
      break;
    case 'clearCanvas':
      PAINTER.clearCanvas();
      break;
    default:
      break;
  }
}
