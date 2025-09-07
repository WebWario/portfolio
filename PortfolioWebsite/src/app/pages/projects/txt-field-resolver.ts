import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {TxtFieldService} from '../../components/txt-field/txt-field-service';

@Injectable({
  providedIn: "root"
})
export class TxtFieldResolver implements Resolve<{ [key:string| number]:any } | undefined> {

  constructor(private txtFieldService:TxtFieldService) {

  }

  /**
   * Grabs object ID From the activatedroutesnapshot.
   * Gets txtField by id from the synchronized txtFields.
   *
   * @returns {[key:string | number] : any}
   * */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): {[key: number | string] : any} | undefined{
    const id =  route.paramMap.get("id");
    return Object.keys(this.txtFieldService.projectTxtFields).find(k => k == id) ? this.txtFieldService.projectTxtFields![id!] : undefined;
  }
}
