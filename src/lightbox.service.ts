import { ComponentFactoryResolver, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { JitCompiler } from '@angular/compiler';
import { LightboxOverlayComponent } from './lightbox-overlay.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class Lightbox {
  private _compiler: JitCompiler;
  private _componentFactoryResolver: ComponentFactoryResolver;
  private _documentRef: DOCUMENT;

  constructor(
    _compiler: JitCompiler,
    @Inject(DOCUMENT) _documentRef: DOCUMENT
  ) {}

  open(album: Array, curIndex: number = 0, options: Object = {}) {
    // const componentFactory = this._componentFactoryResolver.resolveComponentFactory(LightboxOverlayComponent);
    // const componentRef = this._viewContainerRef.createComponent(componentFactory);

    this._documentRef.querySelector('body').appendChild(componentRef.location.nativeElement);
  }
}
