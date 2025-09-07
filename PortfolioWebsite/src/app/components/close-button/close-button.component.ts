import {Component, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-close-button',
  imports: [],
  templateUrl: './close-button.component.html',
  styleUrl: './close-button.component.scss'
})
export class CloseButtonComponent {

  @Input()
  height: number = 32;

  @Input()
  width: number = 32;

  /**
   * Event send if close button is pressed.
   * */
  closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * closeEvent event emitter. Emits true on close event.
   * */
  closeThis(){
    this.closeEvent.emit(true);
  }
}
