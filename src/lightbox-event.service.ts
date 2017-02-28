import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

export enum LIGHTBOX_EVENT {
  CHANGE_PAGE = 1,
  CLOSE = 2,
  OPEN = 3
};

@Injectable()
export class LightboxEvent {
  private _lightboxEventSource: Subject;
  public lightboxEvent$: any;
  constructor() {
    this._lightboxEventSource = new Subject<number>();
    this.lightboxEvent$ = this._lightboxEventSource.asObservable();
  }

  broadcastLightboxEvent(event): void {
    this._lightboxEventSource.next(event);
  }
}