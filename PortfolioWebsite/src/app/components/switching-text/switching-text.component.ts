import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';

import {interval, Subscription, timeout} from 'rxjs';

@Component({
  selector: 'app-switching-text',
  imports: [],
  templateUrl: './switching-text.component.html',
  styleUrl: './switching-text.component.scss'
})
export class SwitchingTextComponent implements OnInit{

  private readonly TIMEOUT: number = 5000;

  _textArr?: string[];

  @ViewChildren('bullets')
  textBullest!: QueryList<HTMLDivElement>

  @Input()
  set textArr (texts: string[]) {
    this._textArr = texts;
  }

  get textArr ():string[] | undefined{
    return this._textArr
  }

  subscription?: Subscription;

  _curText?: string;

  set curText (txt: string){
    this._curText = txt
  }

  get curText(): string | undefined {
    return this._curText
  }

  selected: number = 0;

  @Input()
  selectedColor: string = "#1446A0"

  @Input()
  selectedBorderColor: string = '#F5D547'

  @Input()
  unSelectedColor: string= '#F5D547'

  ngOnInit() {
    this._curText = this.textArr ? this.textArr[0]: undefined;
    this.startSubscription();
  }

  switchText(next: boolean=false){
    if(this.textArr){
      this.curText = this.curText ?? this.textArr[0]
      const curPos: number = this.textArr?.indexOf(this.curText)
      let direction: number = -1;
      if(next){
        direction=1;
      }
      const nextPos: number = Math.abs((curPos + direction)%this.textArr.length);
      this.curText = this.textArr[ nextPos ];
      this.selected = nextPos;
    }
  }

  selectText(txt: string){
    this.curText = txt;
    this.selected = this.textArr!.indexOf(txt);
  }

  killSubscription(){
    this.subscription?.unsubscribe();
  }

  startSubscription() {
    this.subscription = interval(this.TIMEOUT).subscribe(()=>this.switchText(true))
  }
}
