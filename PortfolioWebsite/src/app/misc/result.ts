import {Injectable, NgModule} from "@angular/core";
import {LoggerService, SERVICELOGLEVEL} from './logger/logger-service';

@NgModule({
    imports:[],
    exports: []
})
@Injectable({providedIn: 'root'})
export class Result implements Result{
    constructor(private logger: LoggerService){
    }

    /***
     * Returns a success object indicating a successful operation.
     */
    isSuccess(data: any): Success {
      this.logger.log("Success.", SERVICELOGLEVEL.Info);
      return ({
            result: true,
            data: data
        } as Success);
    }

    /***
     * Returns a failure object indication a failed opertaion.
     */
    isFailure(message: string): Failure {
      this.logger.log(`Failed with error.}`, SERVICELOGLEVEL.Error);
        return ({
            result: false,
            error: new Error(message)
        } as Failure);
    }
}

export interface Result {

    isSuccess(data: any): Success;

    isFailure(message: string): Failure;
}

export interface Success {
    result: boolean;
    data: any[];

}

export interface Failure {
    result: boolean;
    error: Error;
}
