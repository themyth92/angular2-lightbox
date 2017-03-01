import { Component, Inject } from '@angular/core';
import { Lightbox, LightboxConfig, LightboxEvent, LIGHTBOX_EVENT, IEvent, IAlbum } from 'lightbox';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'demo',
  template: `
    <div class="row text-center">
      <div *ngFor="let image of _albums; let i=index" class="img-row">
        <img class="img-responsive img-frame" [src]="image.thumb" (click)="open(i)"/>
      </div>
    </div>
  `
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
    this._subscription = this._lightboxEvent.lightboxEvent$.subscribe(event => this._onReceivedEvent(event));

    // override the default config
    this._lightbox.open(this._albums, index, { wrapAround: true, showImageNumberLabel: true });
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      this._subscription.unsubscribe();
    }
  }
}
