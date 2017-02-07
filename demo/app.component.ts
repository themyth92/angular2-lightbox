import { Component } from '@angular/core';
// import { Lightbox, LightboxConfig } from 'lightbox';

@Component({
  selector: 'demo',
  template: `
    <div class="row text-center">
      <div *ngFor="let image of albums; let i=index" class="img-row">
        <img class="img-responsive img-frame" [src]="image.thumb" (click)="open(i)"/>
      </div>
    </div>
  `
})
export class AppComponent {
  albums: Album[] = [];
  options: Object = {};
  constructor() {
    for (let i = 1; i <= 4; i++) {
      const src = 'demo/img/image' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';
      const thumb = 'demo/img/image' + i + '-thumb.jpg';
      let album = {};

      album.src = src;
      album.caption = caption;
      album.thumb = thumb;
      this.albums.push(album);
    }

    // change default config globally
    // this._lightboxConfig.wrapAround = true;
  }

  open(index) {

  }
}
