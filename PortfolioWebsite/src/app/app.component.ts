import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from "./sections/header/header.component";
import {FooterComponent} from "./sections/footer/footer.component";
import {LoggerService, SERVICELOGLEVEL} from './misc/logger/logger-service';
import {PageContentComponent} from './sections/page-content/page-content.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    FooterComponent,
    PageContentComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  title = 'CJL DEV';

  isMobile = false;

  constructor(
    private logger: LoggerService,
    private detector: DeviceDetectorService
  ) {
  }

  ngOnInit(): void {
    this.logger.log('AppComponent.ngOnInit', SERVICELOGLEVEL.Info);
    if(this.detector.isMobile()){

    }
  }

}
