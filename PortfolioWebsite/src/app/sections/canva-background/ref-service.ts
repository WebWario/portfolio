import {ElementRef, Injectable, OnChanges, SimpleChanges} from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';

/**
 * The ref service keeps the HTML references for future drawing.
 *
 * When drawing with Abstract-Draw-Config the html element must first be added to the initialized object.
 * */
@Injectable({providedIn: 'root'})
export class RefService {

  registered : any = {}

  private registerChanges = new Subject<any>();
  public registerChanges$ = this.registerChanges.asObservable();

  /**
   * Adds the key:string and value:ElementRef to the initialized property.
   * */
  registerElementRef(key: string, val: ElementRef){
    this.registered[key] = val;
    this.registerChanges.next(this.registered);
  }

}
