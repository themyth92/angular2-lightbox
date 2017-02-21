import { BrowserModule } from '@angular/platform-browser';
import { Lightbox } from './lightbox.service';
import { LightboxConfig } from './lightbox-config.service';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { LightboxComponent } from './lightbox.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ LightboxOverlayComponent, LightboxComponent ],
  providers: [
    Lightbox,
    LightboxConfig,
    { provide: 'Window', useValue: window }
  ],
  entryComponents: [ LightboxOverlayComponent, LightboxComponent ]
})
export class LightboxModule { }
