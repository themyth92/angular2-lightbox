import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Renderer
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { LightboxEvent, LIGHTBOX_EVENT } from './lightbox-event.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: '[lb-overlay]',
  template: '',
  host: {
    '(click)': 'close()',
    '[class]': '_classList'
  }
})
export class LightboxOverlayComponent implements AfterViewInit, NgOnDestroy {
  @Input() options;
  @Input() cmpRef;
  constructor(
    private _elemRef: ElementRef,
    private _rendererRef: Renderer,
    private _lightboxEvent: LightboxEvent,
    @Inject(DOCUMENT) private _documentRef: DOCUMENT,
    @Inject('Window') private _windowRef: Window,
  ) {
    this._classList = 'lightboxOverlay animation fadeInOverlay';
    this._subscription = this._lightboxEvent.eventObs$.subscribe(event => this._onReceivedEvent(event));
  }

  public ngAfterViewInit(): void {
    const width = this._getOverlayWidth();
    const height = this._getOverlayHeight();
    const fadeDuration = this.options.fadeDuration;

    this._rendererRef.setElementStyle(this._elemRef.nativeElement, 'width', `${width}px`);
    this._rendererRef.setElementStyle(this._elemRef.nativeElement, 'height', `${height}px`);
    this._rendererRef.setElementStyle(this._elemRef.nativeElement,
      '-webkit-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._elemRef.nativeElement,
      '-animation-duration', `${fadeDuration}s`);
  }

  public close(): void {
    // broadcast to itself and all others subscriber including the components
    this._lightboxEvent.broadcastLightboxEvent(LIGHTBOX_EVENT.CLOSE);
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private _onReceivedEvent(event: number): void {
    switch (event) {
      case LIGHTBOX_EVENT.CLOSE:
        this._end();
      break;
      default:
      break;
    }
  }

  private _end(): void {
    this._classList = 'lightboxOverlay animation fadeOutOverlay';

    // queue self destruction after the animation has finished
    // FIXME: not sure if there is any way better than this
    setTimeout(() => {
      this.cmpRef.destroy();
    }, this.options.fadeDuration * 1000);
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
