import { BrowserModule } from '@angular/platform-browser';
import { Lightbox } from './lightbox.service';
import { LightboxComponent } from './lightbox.component';
import { LightboxConfig } from './lightbox-config.service';
import { LightboxEvent } from './lightbox-event.service';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ LightboxOverlayComponent, LightboxComponent ],
  providers: [
    Lightbox,
    LightboxConfig,
    LightboxEvent,
    { provide: 'Window', useValue: window }
  ],
  entryComponents: [ LightboxOverlayComponent, LightboxComponent ]
})
export class LightboxModule { }
