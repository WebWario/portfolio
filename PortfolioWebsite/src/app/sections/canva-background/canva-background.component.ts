import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Failure, Result, Success} from '../../misc/result';
import {SharedModule} from '../../shared-module';
import {ResourceManagerService} from '../../misc/resource-manager';
import {WorkerService} from './worker-service.module';
import {LoggerService, SERVICELOGLEVEL} from '../../misc/logger/logger-service';
import {CanvasWorkerMessage, Path} from './canva-models';
import {PathBuilder} from './path-builder';
import {RefService} from './ref-service';

@Component({
  selector: 'app-canva-background',
  imports: [SharedModule],
  templateUrl:  './canva-background.component.html',
  styleUrl: './canva-background.component.scss'
})
export class CanvaBackgroundComponent implements AfterViewInit, OnDestroy, OnInit{
  public staticCanvaObj?: HTMLCanvasElement | null;

  @ViewChild('canvasDiv') container!: ElementRef<HTMLDivElement>;
  @ViewChild('staticCanvas') staticCanvas! : ElementRef<HTMLCanvasElement>;

  containerResizeObserver = new ResizeObserver(() => {this.onResizeTrigger()})

  /**
   * Canvas context type.
   * */
  public _ctxType? : string;

  /**
   * Last data observed from pathChanges
   * */
  pathData? : {[key: string] : Path};

  /**
   * Canvas height.
   * */
  @Input()
  height?: number;

  /**
   * Canvas width.
   * */
  @Input()
  width?:number;

  /**
   * Selected image index.
   * */
  @Input()
  selectedBgIndex: number = 0;

  /**
   * Canvas web worker.
   * */
  staticWorker?: Worker;

  /**
   * Sets the context of the canvas.
   * Defaults to 2d if ctxType is empty.
   * */
  @Input()
  set ctxType(ctxType: string){
    this.isTxtEmpty(ctxType) ? this._ctxType = '2d' : this._ctxType = ctxType;
  }

  private isTxtEmpty(txt:string): boolean{
    return txt.trim().replace(' ', '').length == 0;
  }

  /**
   * The objects to draw to the canvas.
   * */
  cnfArr: any[] = [];

  /**
   * If the view is fully initialized.
   *
   * Needed to control resize observer callback.
   * */
  initialized: boolean = false;

  /**
   * Get canvas context type. Defaults to '2d'.
   * */
  get ctxType(){
    return this._ctxType ? this._ctxType : '2d';
  }

  constructor(
    private result: Result,
    private workerService: WorkerService,
    private logger: LoggerService,
    private pathBuilder: PathBuilder
    ) {}


  ngOnInit() {
    this.staticWorker = new Worker(new URL('./canva.worker', import.meta.url));
  }

  /**
   * Sets the width and height property based on the container element.
   * */
  public updateCanvasSize() {
    this.updateWidth();
    this.updateHeight();
  }

  /**
   * Updates width property to the container width.
   * */
  private updateWidth(){
    this.width = this.container!.nativeElement.clientWidth;
  }

  /**
   * Updates height property to the container height.
   * */
  private updateHeight(){
    this.height = this.container!.nativeElement.clientHeight;
  }

  /**
   * Observes resizing of ref service trigger.
   *
   * */
  public onResizeTrigger(){
    if(this.initialized && this.pathData){
      this.updateCanvasSize();
      const msg: CanvasWorkerMessage[] = this.workerService.pathToSimplePathMessage(this.pathData);
      if(this.staticWorker){
        this.workerService.clearCanvas(this.staticWorker);
        // canva size needs to be set manually - not via css to take effect
        this.workerService.resizeCanvas(this.staticWorker, this.width, this.height);
        this.workerService.draw(msg, this.staticWorker);
      }
    }
  }

  /**
   * Sets up the canvas object and transfers control to a Webworker.
   *
   * Posts the 'firstDelegate' cmd to the webworker to set up the canvas and the context.
   * */
  ngAfterViewInit(): Success | Failure {
    // create canvas obj
    this.staticCanvaObj = this.staticCanvas.nativeElement;
    this.updateCanvasSize();

    // transfer control
    if (!this.staticCanvaObj) {
      this.logger.log("Static canva object was not initialized.", SERVICELOGLEVEL.Debug);
    } else {
      this.workerService.transferControl({
        cmd: 'firstDelegate',
        ctxType: this.ctxType ? this.ctxType : '2d'
      } as CanvasWorkerMessage, this.staticWorker!, this.staticCanvaObj, this.width!, this.height!);
    }
    this.initialized = true;
    this.containerResizeObserver.observe(this.container.nativeElement);
    // subscribe for drawing
    this.pathBuilder.pathChange$.subscribe({
      next: (data) => {
        this.pathData = data;
        this.onResizeTrigger();
      }
    })
    return this.result.isSuccess([]);
  }

  /**
   * Destroys the web worker to avoid leakage.
   * */
  ngOnDestroy() {
    if(this.staticWorker){
      this.staticWorker.terminate();
    }
  }
}
