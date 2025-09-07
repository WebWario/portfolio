import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';


@Component({
  selector: 'app-floating-logos',
  imports: [],
  templateUrl: './floating-logos.component.html',
  styleUrl: './floating-logos.component.scss'
})
export class FloatingLogosComponent {

  @Input()
  logos?: string[];

  @ViewChild('logoContainer')
  container!: ElementRef;

}
