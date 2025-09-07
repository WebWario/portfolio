import {Component, Input} from '@angular/core';
import {LoggerService, SERVICELOGLEVEL} from '../../misc/logger/logger-service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-map-legend',
  imports: [
    NgStyle
],
  templateUrl: './map-legend.component.html',
  styleUrl: './map-legend.component.scss'
})
export class MapLegendComponent{

  DEFAULTCOLOR: string = "Grey";

  @Input()
  _title?: string;

  get title(): string | undefined{
    return this._title ?? undefined;
  }

  private _entries : ENTRIES = {};

  @Input()
  set entries(entries: ENTRIES){
    this._entries = entries;
  }

  get entries(){
    return this._entries
  }

  arrayOfEntries(): MapLegendEntry[]{
    return Object.values(this.entries);
  }

  addEntry(id: number | string, entry: MapLegendEntry){
    if(this.entryExist(id)){
      this._entries[id] = entry;
      return;
    }
    this.logger.log("Entry key already in entries. Add failed.",SERVICELOGLEVEL.Debug)
  }

  removeEntry(id: number | string){
    if(this.entryExist(id)){
      (this._entries as any).remove(id);
    }
  }

  updateEntry(id: number | string){
    if(this.entryExist(id)){
      (this._entries as any).remove(id);
    }
  }

  entryExist(id: number | string): boolean {
    return !!Object.keys(this._entries).find((en: number | string) => en == id);
  }

  constructor(private logger : LoggerService) {
  }
}

export type ENTRIES = {
  [key : number | string] : MapLegendEntry;
}

/**
 * Interface for legend entries.
 * */
export interface MapLegendEntry {
  name : string;
  textStyle: any;
  legendStyle?: any;
  options? : ()=>{};
}
