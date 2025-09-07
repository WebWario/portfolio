import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {RefService} from '../canva-background/ref-service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})

export class FooterComponent{

  constructor(private ref: RefService) {
  }
}
