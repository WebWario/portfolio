import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-user-info',
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  @ViewChild('infoText', {static: false})
  set textElem(elem: HTMLDivElement){
    if(elem){
      this._textElem = elem;
    }
  }

  @Input()
  txts:string[]= [];

  _textElem!: HTMLDivElement;

  @ViewChild('infoIcon')
  infoIcon!: HTMLButtonElement;

  isActive: boolean= false;

  show(){
    this.isActive = true;
  }

  hide(){
    this.isActive = false;
  }

  onMouseMove(event: MouseEvent){
    this.positionInfoElement();
  }

  positionInfoElement(){
    if(!this.textElem || !this.infoIcon){
      return;
    }
    const width = this.textElem.getBoundingClientRect().width;
    this.textElem.getBoundingClientRect().x = this.infoIcon.getBoundingClientRect().x - width;
  }
}
