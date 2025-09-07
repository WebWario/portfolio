import {Component} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {LoggerService} from '../../misc/logger/logger-service';

@Component({
  selector: 'app-page-content',
  imports: [
    RouterOutlet
  ],
  templateUrl: './page-content.component.html',
  styleUrl: './page-content.component.scss'
})
export class PageContentComponent {

  constructor(private route: ActivatedRoute, private logger: LoggerService) {
  }

}
