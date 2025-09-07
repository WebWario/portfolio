import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoggerService} from './logger/logger-service';
import {Observable} from 'rxjs';
import {TxtMap} from '../components/models/txt-map.model';
import {Path} from '../sections/canva-background/canva-models';

@Injectable(
  {providedIn: 'root'}
)
export class ResourceManagerService{

  readonly JSONURL: string = 'assets/txt.json';

  constructor(private http: HttpClient, private logger: LoggerService){
  }

  /**
   * Gets the txt.json file.
   * Subscribe to the observable to retrieve data.
   *
   * @returns the txt.json file as Observable<any>.
   * */
  public getJsonData(): Observable<any>{
    return this.http.get<any>(this.JSONURL);
  }

  getPaths(keyArr: string[]) {
    return new Promise(resolve => {
      this.getJsonData().subscribe({
        next: (data) => {
          const res = ResourceManagerService.getValRecursive(data, keyArr,0);
          resolve(res);
        }
      })
    });
  }

  /**
   * Maps key and values to a TxtMap object, based on a key arr containing parent keys.
   *
   *
   * @returns promise
   * */
  // TODO: add error handling for missing keys
  toTxtMap(keyArr: string[]) {
    return new Promise(resolve=> {
      this.getJsonData().subscribe({
        next: (data)=> {
          // recursion starts at 0 key
          const res = ResourceManagerService.getValRecursive(data, keyArr, 0);
          resolve(Object.keys(res).map(k=> {
            return ({
              txtKey: k,
              txtValue: res[k].txt,
              icon: res[k].icon? res[k].icon : undefined,
              image: res[k].image? res[k].image: undefined,
              detail: res[k].detail? res[k].detail : undefined,
              link: res[k].link ? res[k].link : undefined,
              organization: res[k].organization ? res[k].organization : undefined,
              subtitle: res[k].subtitle ? res[k].subtitle : undefined
            } as TxtMap)
          }))
        }
      })
    })
  }

  toGraphicNode(keyArr: string[]){
    return new Promise(resolve => {
      this.getJsonData().subscribe({
        next: (data: any)=> {
          const res = ResourceManagerService.getValRecursive(data, keyArr, 0);
          resolve(Object.keys(res).map(k => {
            return ({
              id: res[k].id,
              name: res[k].name ?? undefined,
              position: res[k].position ?? undefined,
              styles: res[k].styles,
              shape: {
                rotation: res[k].shape ? res[k].shape.rotation ?? "vertical" : undefined,
                form: res[k].shape ? res[k].shape.form ?? "line" : undefined,
                textPosition: res[k].shape ? res[k].shape.textPosition ?? "right": undefined
              },
              txtField: res[k].txtField
            });
          }));
        }
      })
    })
  }


  static getValRecursive(dataObject: any, keyArr: string[], idx: number): any{
    if(idx >= keyArr.length){
      return dataObject;
    }
    let curKey = keyArr[idx];

    return ResourceManagerService.getValRecursive(dataObject[curKey], keyArr, idx + 1);
  }

}
