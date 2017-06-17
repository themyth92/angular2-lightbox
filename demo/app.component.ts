import { Component, Inject } from '@angular/core';
import { Lightbox, LightboxConfig, LightboxEvent, LIGHTBOX_EVENT, IEvent, IAlbum } from 'angular2-lightbox';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'demo',
  template: `
    <div class="column has-text-centered">
      <div class="img-row" *ngFor="let image of _albums; let i=index">
        <img class="img-frame" [src]="image.thumb" (click)="open(i)"/>
      </div>
    </div>
  `,
  host: {
    class: 'columns'
  }
})
export class AppComponent {
  private _albums: Array<IAlbum>;
  private _options: Object;
  private _subscription: Subscription;
  constructor(
    private _lightbox: Lightbox,
    private _lightboxEvent: LightboxEvent,
    private _lighboxConfig: LightboxConfig
  ) {
    this._albums = [];
    this._options = {};
    for (let i = 1; i <= 4; i++) {
      const src = 'demo/img/image' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';
      const thumb = 'demo/img/image' + i + '-thumb.jpg';
      const album = {
         src: src,
         caption: caption,
         thumb: thumb
      };

      this._albums.push(album);
    }

    // set default config
    _lighboxConfig.fadeDuration = 1;
  }

  open(index: number): void {
    this._subscription = this._lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));

    // override the default config
    this._lightbox.open(this._albums, index, { wrapAround: true, showImageNumberLabel: true });
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      this._subscription.unsubscribe();
    }
  }
}
