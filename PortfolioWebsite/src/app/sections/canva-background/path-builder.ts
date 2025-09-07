import {ElementRef, Injectable} from '@angular/core';
import {Path} from './canva-models';
import {ResourceManagerService} from '../../misc/resource-manager';
import {RefService} from './ref-service';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PathBuilder {

  PATHDEFINITIONS = ['pages', 'paths'];

  /**
   * A list of Path definitions.
   * */
  pathDefinitions: {[key:string]: Path} = {};

  _paths : {[key:string] : Path} = {};

  addToPaths(k: string, path: Path){
    this._paths[k] = path;
    this.pathChange.next(this._paths);
  }

  private pathChange = new Subject<{[key: string]: Path}>();
  public pathChange$ = this.pathChange.asObservable();

  nodes: {[key: string | number] : ElementRef} = {};

  /**
   *
   * */
  constructor(private resMng: ResourceManagerService, private refService: RefService) {
    // get all user defined paths
    this.resMng.getPaths(this.PATHDEFINITIONS).then(pathData=>{
      if (pathData instanceof Object) {
        Object.keys(pathData).map((k : string) => {
          let cur = (pathData as any)[k] as Path ;
          // @ts-ignore
          this.pathDefinitions[k] = pathData[k];
        });
      }
    });
    this.refService.registerChanges$.subscribe({
      next: (data) => {
        data.projectRefs._results.forEach((elem: ElementRef) => {
          this.nodes[elem.nativeElement.title] = elem;
        });
        Object.entries(this.pathDefinitions).forEach(pathDef => {
          const k = pathDef[0];
          const val = pathDef[1];

          if(val.nodeDefinitions.every(i => this.nodes[i])){
            val.nodeReferences = val.nodeDefinitions.map(entry => {
              return this.nodes[entry];
            });
            this.addToPaths(k, val);
          }
        });
      }
    });
  }
}
