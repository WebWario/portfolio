import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TxtFieldComponent } from '../txt-field/txt-field.component';


@Component({
  selector: 'app-text-box',
  imports: [],
  templateUrl: './text-box.component.html',
  styleUrl: './text-box.component.scss'
})
export class TextBoxComponent{

  @Input()
  icon?: string;

  @Input()
  title?: string;

  @Input()
  isActive?: boolean;

  toggleIsActive(){
    this.isActive = !this.isActive;
  }
}
