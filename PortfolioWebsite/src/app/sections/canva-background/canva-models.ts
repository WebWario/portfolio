import {ElementRef} from '@angular/core';

/**
 * Interface for graphical nodes on project view.
 * */
export interface GraphicNode {
  id: string;
  name?: string;
  position?: {
    start: number, //id of previous starting node,
    distance: number // distance ]0,1[ from starting node
  }
  styles?: any;
  shape?: {
    rotation: "vertical" | "horizontal",
    form: "line" | "box" | "cirlce" | "rounded-rect" | "elipsis",
    textPosition: "right" | "left" | "top" | "bottom"
  };
  txtField?: any;
}

export interface Path {
  cmd: string;
  id: number;
  nodeDefinitions: string[];
  nodeReferences: ElementRef<any>[];
  line?: LineOptions;
  offset?: {
    offsetX: number;
    offsetY: number;
  }
}

export interface LineOptions{
  lineWidth?: number;
  lineDash?: number[];
  lineCap?: "butt" | "round" | "square";
  lineJoin?: "round" | "bevel" | "miter";
  strokeStyle?: string;
}

export interface CurvedPathOptions {
  sourceSelector: string,
  targetSelector: string,
  strokeStyle: string,
  lineWidth: number,
  radius: number,
  section: [any],
  vertical: number,
  horizontal: number
}

export type lineTargetPos = { horizontal: number, vertical: number };

export interface Sections {
  startDom: string,
  h: number,
  w: number
}

/**
 * DOM selector strings for start and end DOM element.
 * */
export interface Selectors {
  start: string;
  end: string;
}

/**
 * Commands currently supported by the canvas-web-worker.
 * */
export type cmd = "resize" | "firstDelegate" | "drawPath" | "clearCanvas" | "drawSimplePath"

/**
 * The minimum message for the canvas worker.
 * Use this as base to send messages.
 * */
export interface CanvasWorkerMessage {
  cmd: cmd,
  canvas?: OffscreenCanvas,
  options?: SimplePathOptions | any
}

export interface SimplePathOptions {
  lineWidth : number;
  strokeStyle: string;
  pointArr: {x: number, y: number}[]
}
