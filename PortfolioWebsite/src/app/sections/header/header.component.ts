import {AfterViewInit, Component, EventEmitter, Output, QueryList, ViewChild} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {RefService} from '../canva-background/ref-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private ref: RefService) {
  }

  selected :string = 'home';

  @Output()
  selectedTab : EventEmitter<string> = new EventEmitter<string>();

  emitSelected(tab: string){
    this.selected = tab;
    this.selectedTab.emit(tab)
  }
}
