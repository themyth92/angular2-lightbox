import { Injectable } from '@angular/core';

@Injectable()
export class LightboxConfig {
  fadeDuration: number = 0.7;
  resizeDuration: number = 0.5;
  fitImageInViewPort: boolean = true;
  positionFromTop: number = 20;
  showImageNumberLabel: boolean = false;
  alwaysShowNavOnTouchDevices: boolean = false;
  wrapAround: boolean = false;
  disableKeyboardNav: boolean = false;
}
