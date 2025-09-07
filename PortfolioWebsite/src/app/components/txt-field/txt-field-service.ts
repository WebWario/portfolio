import {Injectable} from '@angular/core';

@Injectable({providedIn:"root"})
export class TxtFieldService{
  _projectTxtFields: {[key: string | number] : any} = {};

  get projectTxtFields(){
    return this._projectTxtFields;
  }
}
