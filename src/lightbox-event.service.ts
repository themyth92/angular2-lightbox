import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

export enum LIGHTBOX_EVENT {
  CHANGE_PAGE = 1,
  CLOSE = 2,
  OPEN = 3
};

@Injectable()
export class LightboxEvent {
  private _eventSrc: BehaviorSubject;
  public eventObs$: any;
  constructor() {
    this._eventSrc = new BehaviorSubject<number>(LIGHTBOX_EVENT.OPEN);
    this.eventObs$ = this._eventSrc.asObservable();
  }

  broadcastLightboxEvent(event): void {
    this._eventSrc.next(event);
    if (event === LIGHTBOX_EVENT.CLOSE) {
      this._eventSrc.next(LIGHTBOX_EVENT.OPEN);
    }
  }
}