import { NgModule } from "@angular/core";
import { Result } from "./misc/result";
import {Logger, LoggerService} from "./misc/logger/logger-service";
import {WorkerService} from './sections/canva-background/worker-service.module';
@NgModule({
        imports: [
          Result
        ],
        exports: [Result],
        providers: [
          {
            provide: Logger,
            useClass: LoggerService
          },
          {
            provide: WorkerService
          },
        ]
    }
)


export class SharedModule{

}
