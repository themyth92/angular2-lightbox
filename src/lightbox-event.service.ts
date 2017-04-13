import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export interface IEvent {
  id: LIGHTBOX_EVENT;
  data?: any;
}

export interface IAlbum {
  src: string;
  caption?: string;
  thumb: string;
}

export enum LIGHTBOX_EVENT {
  CHANGE_PAGE = 1,
  CLOSE = 2,
  OPEN = 3
};

@Injectable()
export class LightboxEvent {
  private _lightboxEventSource: Subject<Object>;
  public lightboxEvent$: Observable<Object>;
  constructor() {
    this._lightboxEventSource = new Subject<Object>();
    this.lightboxEvent$ = this._lightboxEventSource.asObservable();
  }

  broadcastLightboxEvent(event: any): void {
    this._lightboxEventSource.next(event);
  }
}
