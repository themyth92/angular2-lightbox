import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject
  Injectable,
  Injector
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { LightboxComponent } from './lightbox.component';

@Injectable()
export class Lightbox {
  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _applicationRef: ApplicationRef,
    @Inject(DOCUMENT) private _documentRef: DOCUMENT
  ) {}

  open(album: Array, curIndex: number = 0, options: Object = {}): Promise {
    const overlayComponentRef = this._createComponent(LightboxOverlayComponent);
    const componentRef = this._createComponent(LightboxComponent);

    return new Promise((resolve, reject) => {
      componentRef.instance.album = album;
      componentRef.instance.currentImageIndex = curIndex;
      componentRef.instance.options = options;
      this._applicationRef.attachView(overlayComponentRef.hostView);
      this._applicationRef.attachView(componentRef.hostView);
      overlayComponentRef.onDestroy(() => {
        this._applicationRef.detachView(overlayComponentRef.hostView);
      });
      componentRef.onDestroy(() => {
        this._applicationRef.detachView(componentRef.hostView);
      });

      this._documentRef.querySelector('body').appendChild(overlayComponentRef.location.nativeElement);
      this._documentRef.querySelector('body').appendChild(componentRef.location.nativeElement);
    });
  }

  _createComponent(ComponentClass: any): ComponentRef {
    const factory = this._componentFactoryResolver.resolveComponentFactory(ComponentClass);
    const component = factory.create(this._injector);

    return component;
  }
}
