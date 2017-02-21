import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  Renderer
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'lb-overlay',
  template: '',
  host: { class: 'lightboxOverlay animation fadeInOverlay' }
})
export class LightboxOverlayComponent implements AfterViewInit, OnDestroy {
  @Input() options;
  constructor(
    private _elemRef: ElementRef,
    private _rendererRef: Renderer,
    @Inject(DOCUMENT) private _documentRef: DOCUMENT,
    @Inject('Window') private _windowRef: Window,
  ) {}

  public ngAfterViewInit(): void {
    const width = this._getOverlayWidth();
    const height = this._getOverlayHeight();
    const fadeDuration = this.options.fadeDuration;

    this._rendererRef.setElementStyle(this._elemRef.nativeElement, 'width', `${width}px`);
    this._rendererRef.setElementStyle(this._elemRef.nativeElement, 'height', `${height}px`);
    this._rendererRef.setElementStyle(this._elemRef.nativeElement, 'display', 'block');
    this._rendererRef.setElementStyle(this._elemRef.nativeElement,
      '-webkit-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._elemRef.nativeElement,
      '-animation-duration', `${fadeDuration}s`);
  }

  private _getOverlayWidth(): number {
    return Math.max(
      this._documentRef.body.scrollWidth,
      this._documentRef.body.offsetWidth,
      this._documentRef.documentElement.clientWidth,
      this._documentRef.documentElement.scrollWidth,
      this._documentRef.documentElement.offsetWidth
    ); 
  }

  private _getOverlayHeight(): number {
    return Math.max(
      this._documentRef.body.scrollHeight,
      this._documentRef.body.offsetHeight,
      this._documentRef.documentElement.clientHeight,
      this._documentRef.documentElement.scrollHeight,
      this._documentRef.documentElement.offsetHeight
    ); 
  }
}
