import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { LightboxEvent, LIGHTBOX_EVENT, IEvent } from './lightbox-event.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: '[lb-overlay]',
  template: '',
  host: {
    '(click)': 'close()',
    '[class]': '_classList'
  }
})
export class LightboxOverlayComponent implements AfterViewInit, OnDestroy {
  @Input() options: any;
  @Input() cmpRef: any;
  private _subscription: Subscription;
  private _classList: string;
  constructor(
    private _elemRef: ElementRef,
    private _rendererRef: Renderer,
    private _lightboxEvent: LightboxEvent,
    @Inject(DOCUMENT) private _documentRef: any
  ) {
    this._classList = 'lightboxOverlay animation fadeInOverlay';
    this._subscription = this._lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));
  }

  public ngAfterViewInit(): void {
    const fadeDuration = this.options.fadeDuration;

    this._rendererRef.setElementStyle(this._elemRef.nativeElement,
      '-webkit-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._elemRef.nativeElement,
      '-animation-duration', `${fadeDuration}s`);
    this._sizeOverlay();
  }

  public close(): void {
    // broadcast to itself and all others subscriber including the components
    this._lightboxEvent.broadcastLightboxEvent({ id: LIGHTBOX_EVENT.CLOSE, data: null });
  }

  @HostListener('window:resize')
  public onResize(): void {
    this._sizeOverlay();
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private _sizeOverlay(): void {
    const width = this._getOverlayWidth();
    const height = this._getOverlayHeight();

    this._rendererRef.setElementStyle(this._elemRef.nativeElement, 'width', `${width}px`);
    this._rendererRef.setElementStyle(this._elemRef.nativeElement, 'height', `${height}px`);
  }

  private _onReceivedEvent(event: IEvent): void {
    switch (event.id) {
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
