import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import {RefService} from '../../sections/canva-background/ref-service';

@Component({
  selector: 'app-multi-button',
  imports: [],
  templateUrl: './multi-button.component.html',
  styleUrl: './multi-button.component.scss'
})
export class MultiButtonComponent {

  /**
   * If the button is next
   * */
  isNext: boolean = true;

  /**
   * Entries to switch through
   * */
  @Input()
  entries: any[] = [];

  @ViewChild('multiButton') multiButtonRef!: ElementRef<HTMLDivElement>;

  /**
   * Emits the currently selected entry.
   * */
  @Output()
  curSelection: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Emitter function for curSelection.
   * */
  emitCur(index: number){
    this.curSelection.emit(this.entries[index]);
  }

  /**
   * The currently selected index. Default is 0.
   * */
  @Input()
  curIndex : number = 0;

  constructor(private refService: RefService){
  }

  /**
   * Emits the next entry.
   * Rolls over.
   * */
  changeEntry(){
    console.log(this.isNext, this.curIndex);
    if(this.isNext){
      this.curIndex = (this.curIndex + 1) % this.entries.length;
      this.emitCur(this.curIndex);
    } else{
      this.curIndex = this.curIndex - 1 >= 0 ? (this.curIndex - 1) % this.entries.length : this.entries.length - 1;
      this.emitCur(this.curIndex);
    }
  }

  handleMouseOver(ev: MouseEvent, isNxt: boolean){
    ev.stopPropagation();
    this.isNext = isNxt;
  }

  /**
   * Stops propagation of mouse event and changes entry on click.
   * */
  handleClick(ev: MouseEvent){
    ev.stopPropagation();
    this.changeEntry();
  }
}
