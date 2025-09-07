
import {AfterViewInit, Component, EventEmitter, Input, OnInit, signal, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {CloseButtonComponent} from '../close-button/close-button.component';
import {txtElement} from '../models/txt-map.model';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {timeout} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-txt-field',
  imports: [CloseButtonComponent],
  templateUrl: './txt-field.component.html',
  styleUrl: './txt-field.component.scss',
  styles: [`
    .fade-in {
      animation: fadeIn 1s ease-out;
    }
    .fade-out {
      animation: fadeOut 1s ease-in forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `],
  standalone: true
})
export class TxtFieldComponent implements OnInit {

  _curTxt?: string;

  @Input()
  set curTxt(val:string){
    this._curTxt = val;
  }

  get curTxt(){
    return this._curTxt ? this._curTxt : "";
  }

  navigate: EventEmitter<"next" | "previous"> = new EventEmitter<"next" | "previous">()

  emitNavigate(direction: "next" | "previous"){
    this.navigate.emit(direction)
  }

  animationEnded: boolean = true;

  _txtElements?: txtElement[];

  @Input()
  set txtElements(elements: txtElement[]){
    this._txtElements = elements;
    if(this.txtElements){
      const vidElement = this.txtElements!.find(elem => elem.type == 'embed');
      this.safeUrl = vidElement ? vidElement.elements[0] : '';
    }
  }

  get txtElements(): txtElement[] | undefined {
    return this._txtElements;
  }

  _image?: any;

  @Input()
  set image(val: any){
    this._image = val;
  }

  get image(): any | undefined{
    return this._image
  }

  _hasClose: boolean = false;

  @Input()
  set hasClose(bool: boolean){
    this._hasClose = bool;
  }

  get hasClose(){
    return this._hasClose;
  }

  closed: EventEmitter<boolean> = new EventEmitter<boolean>();

  close(){
    this.closed.emit(true);
  }

  @Input()
  icon?: string;

  _detail?: any;

  @Input()
  set detail(val: any){
    this._detail = val;
  }

  get detail(){
    return this._detail;
  }

  @Input()
  subtitle?: string;

  _date?: Date;

  @Input()
  set date(dateStr: string){
    this._date = new Date(dateStr);
  }

  _link?: string;
  @Input()
  set link(link: string){
    this._link = link;
  }

  get link():string | undefined {
    return this._link;
  }

  _organization?:string;

  @Input()
  set organization(orga: string){
    this._organization = orga;
  }

  readonly TXTFIELD = 'txtField';

  @ViewChild('close')
  closeButton! :CloseButtonComponent;

  _safeUrl?: SafeResourceUrl | undefined;

  set safeUrl(url: string){
    this._safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  get safeUrl(): SafeResourceUrl | undefined {
    return this._safeUrl;
  }

  constructor(private route: ActivatedRoute, private _sanitizer: DomSanitizer, private router : Router) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(txtField => {
      const data = (txtField as any).txtFieldData;
      const detailData = data['detail'] ?? undefined;
      this.curTxt = data['curTxt'] ?? undefined;
      this.txtElements = data['txtElements'] ?? undefined;
      this.image = data['image'] ?? undefined;
      this.icon = data['icon'] ?? undefined;
      this.detail = data['detail'] ?? undefined;
      this.date = detailData['date'] ?? undefined;
      this.link = detailData['link'] ?? undefined;
      this.organization = detailData['organization'] ?? undefined;
      this.subtitle = data['subtitle'] ?? undefined;
    });
  }
}
