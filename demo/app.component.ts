import { Component, Inject } from '@angular/core';
import { Lightbox } from 'lightbox';

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
  private _albums: Array<Object> = [];
  private _options: Object = {};

  constructor(private _lightbox: Lightbox) {
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
  }

  open(index: number) {
    this._lightbox.open(this._albums, index);
  }
}
