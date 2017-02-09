import { BrowserModule } from '@angular/platform-browser';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { Lightbox } from './lightbox.service';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ LightboxOverlayComponent ],
  providers: [
    Lightbox,
    { provide: 'Window', useValue: window }
  ],
  entryComponents: [ LightboxOverlayComponent ],
})
export class LightboxModule { }
