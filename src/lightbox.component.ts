import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnChanges,
  Renderer,
  SimpleChange,
  ViewChild
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  template: `
    <div class="lb-outerContainer transition" #outerContainer>
      <div class="lb-container" #container>
        <img class="lb-image" [src]="album[currentImageIndex].src" class="lb-image animation fadeIn" [hidden]="_ui.showReloader" #image>
        <div class="lb-nav" [hidden]="!_ui.showArrowNav" #navArrow>
          <a class="lb-prev" [hidden]="!_ui.showLeftArrow" (click)="prevImage()" #leftArrow></a>
          <a class="lb-next"[hidden]="!_ui.showRightArrow" (click)="nextImage()" #rightArrow></a>
        </div>
        <div class="lb-loader" [hidden]="!_ui.showReloader" (click)="close($event)">
          <a class="lb-cancel"></a>
        </div>
      </div>
    </div>
    <div class="lb-dataContainer" [hidden]="_ui.showReloader" #dataContainer>
      <div class="lb-data">
        <div class="lb-details">
          <span class="lb-caption animation fadeIn" [hidden]="!_ui.showCaption" #caption>{{ album[currentImageIndex].caption }}</span>
          <span class="lb-number animation fadeIn" [hidden]="!_ui.showPageNumber" #number>{{ _content.pageNumber }}</span>
        </div>
        <div class="lb-closeContainer">
          <a class="lb-close" (click)="close($event)"></a>
        </div>
      </div>
    </div>`,
  selector: 'lb-content',
  host: {
    class: 'lightbox',
    '(click)': 'close($event)'
  }
})
export class LightboxComponent implements AfterViewInit, OnDestroy {
  @Input() album;
  @Input() currentImageIndex;
  @Input() options;
  
  //@ViewChild('lightbox') _lightboxElem: ElementRef;
  @ViewChild('outerContainer') _outerContainerElem: ElementRef;
  @ViewChild('container') _containerElem: ElementRef;
  @ViewChild('leftArrow') _leftArrowElem: ElementRef;
  @ViewChild('rightArrow') _rightArrowElem: ElementRef;
  @ViewChild('navArrow') _navArrowElem: ElementRef;
  @ViewChild('dataContainer') _dataContainerElem: ElementRef;
  @ViewChild('image') _imageElem: ElementRef;
  @ViewChild('caption') _captionElem: ElementRef;
  @ViewChild('number') _numberElem: ElementRef;

  private _content: object;
  private _ui: object;
  private _cssValue: object;
  private _content: object;
  private _event: object;

  constructor(
    private _elemRef: ElementRef,
    private _rendererRef: Renderer,
    @Inject('Window') private _windowRef: Window,
    @Inject(DOCUMENT) private _documentRef: DOCUMENT
  ) {
    // initialize data
    this.options = this.options || {};
    this.album = this.album || [];
    this.currentImageIndex = this.currentImageIndex || null;

    // control the interactive of the directive
    this._ui = {
      // control the appear of the reloader
      // false: image has loaded completely and ready to be shown
      // true: image is still loading
      showReloader: true,

      // control the appear of the nav arrow
      // the arrowNav is the parent of both left and right arrow
      // in some cases, the parent shows but the child does not show
      showLeftArrow: false,
      showRightArrow: false,
      showArrowNav: false,

      // control whether to show the
      // page number or not
      showPageNumber: false,
      showCaption: false,
    };

    this._content = {
      pageNumber: ''
    };

    this._event = {};
    this._lightboxElem = this._elemRef;
  }

  ngAfterViewInit() {
    // need to init css value here, after the view ready
    // actually these values are always 0
    this._cssValue = {
      containerTopPadding: parseInt(this._getCssStyleValue(this._containerElem, 'padding-top'), 10),
      containerRightPadding: parseInt(this._getCssStyleValue(this._containerElem, 'padding-right'), 10),
      containerBottomPadding: parseInt(this._getCssStyleValue(this._containerElem, 'padding-bottom'), 10),
      containerLeftPadding: parseInt(this._getCssStyleValue(this._containerElem, 'padding-left'), 10),
      imageBorderWidthTop: parseInt(this._getCssStyleValue(this._imageElem, 'border-top-width'), 10),
      imageBorderWidthBottom: parseInt(this._getCssStyleValue(this._imageElem, 'border-bottom-width'), 10),
      imageBorderWidthLeft: parseInt(this._getCssStyleValue(this._imageElem, 'border-left-width'), 10),
      imageBorderWidthRight: parseInt(this._getCssStyleValue(this._imageElem, 'border-right-width'), 10),
    };

    if (this._validateInputData()) {
      this._prepareComponent();
      this._registerImageLoadingEvent();
    }
  }

  ngOnDestroy() {
    this._end();
  }

  close($event: any) {
    if ($event.target.classList.contains('lightbox') ||
      $event.target.classList.contains('lb-loader') ||
      $event.target.classList.contains('lb-close')) {
      // this._activeModalRef.close();
    }
  }

  nextImage() {
    if (this.currentImageIndex === this.album.length - 1) {
      this._changeImage(0);
    } else {
      this._changeImage(this.currentImageIndex + 1);
    }
  }

  prevImage() {
    if (this.currentImageIndex === 0) {
      this._changeImage(this.album.length - 1);
    } else {
      this._changeImage(this.currentImageIndex - 1);
    }
  }

  private _validateInputData() {
    if (this.album &&
      this.album instanceof Array &&
      this.album.length > 0) {
      for (let i = 0; i < this.album.length; i++) {
        // check whether each _nside
        // album has src data or not
        if (this.album[i].src) {
          continue;
        }
 
        throw new Error('One of the album data does not have source data');
      }
    } else {
      throw new Error('No album data or album data is not correct in type');
    }

    // to prevent data understand as string
    // convert it to number
    if (isNaN(this.currentImageIndex)) {
      throw new Error('Current image index is not a number');
    } else {
      this.currentImageIndex = Number(this.currentImageIndex);
    }

    return true;
  }

  private _registerImageLoadingEvent() {
    // start to register the event and
    // be ready for callback
    this._event.load = this._rendererRef.listen(this._imageElem.nativeElement, 'load', () => {
      this._onLoadImageSuccess();
    });
  }

  /**
   * Fire when the image is loaded
   */
  private _onLoadImageSuccess() {
    if (!this.options.disableKeyboardNav) {
      // unbind keyboard event during transition
      this._disableKeyboardNav();
    }

    let imageHeight;
    let imageWidth;
    let maxImageHeight;
    let maxImageWidth;
    let windowHeight;
    let windowWidth;
    let naturalImageWidth;
    let naturalImageHeight;

    // set default width and height of image to be its natural
    imageWidth = naturalImageWidth = this._imageElem.nativeElement.naturalWidth;
    imageHeight = naturalImageHeight = this._imageElem.nativeElement.naturalHeight;
    if (this.options.fitImageInViewPort) {
      windowWidth = this._windowRef.innerWidth;
      windowHeight = this._windowRef.innerHeight;
      maxImageWidth = windowWidth - this._cssValue.containerLeftPadding -
        this._cssValue.containerRightPadding - this._cssValue.imageBorderWidthLeft -
        this._cssValue.imageBorderWidthRight - 20;
      maxImageHeight = windowHeight - this._cssValue.containerTopPadding -
        this._cssValue.containerTopPadding - this._cssValue.imageBorderWidthTop -
        this._cssValue.imageBorderWidthBottom - 120;
      if (naturalImageWidth > maxImageWidth || naturalImageHeight > maxImageHeight) {
        if ((naturalImageWidth / maxImageWidth) > (naturalImageHeight / maxImageHeight)) {
          imageWidth = maxImageWidth;
          imageHeight = parseInt(naturalImageHeight / (naturalImageWidth / imageWidth), 10);
        } else {
          imageHeight = maxImageHeight;
          imageWidth = parseInt(naturalImageWidth / (naturalImageHeight / imageHeight), 10);
        }
      }

      this._rendererRef.setElementStyle(this._imageElem.nativeElement, 'width', `${imageWidth}px`);
      this._rendererRef.setElementStyle(this._imageElem.nativeElement, 'height', `${imageHeight}px`);
    }

    this._sizeContainer(imageWidth, imageHeight);
  }

  private _sizeContainer(imageWidth: number, imageHeight: number) {
    const oldWidth  = this._outerContainerElem.nativeElement.offsetWidth;
    const oldHeight = this._outerContainerElem.nativeElement.offsetHeight;
    const newWidth  = imageWidth + this._cssValue.containerRightPadding + this._cssValue.containerLeftPadding;
    const newHeight = imageHeight + this._cssValue.containerTopPadding + this._cssValue.containerBottomPadding;

    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      this._rendererRef.setElementStyle(this._outerContainerElem.nativeElement, 'width', `${newWidth}px`);
      this._rendererRef.setElementStyle(this._outerContainerElem.nativeElement, 'height', `${newHeight}px`);

      // bind resize event to outer container
      this._event.transitions = [];
      ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd'].forEach(eventName => {
        this._event.transitions.push(
          this._rendererRef.listen(this._outerContainerElem.nativeElement, eventName, event => {
            if (event.target === event.currentTarget) {
              this._postResize(newWidth, newHeight);
            }
          })
        );
      });
    } else {
      this._postResize(newWidth, newHeight);
    } 
  }

  private _postResize(newWidth: number, newHeight: number) {
    // unbind resize event
    if (Array.isArray(this._event.transitions)) {
      this._event.transitions.forEach(eventHandler => {
        eventHandler();
      });

      this._event.transitions = [];
    }

    this._rendererRef.setElementStyle(this._dataContainerElem.nativeElement, 'width', `${newWidth}px`);
    this._showImage();
  }

  private _showImage() {
    this._ui.showReloader = false;
    this._updateNav();
    this._updateDetails();
    if (!this.options.disableKeyboardNav) {
      this._enableKeyboardNav();
    }
  }

  private _prepareComponent() {
    // add css3 animation
    this._addCssAnimation();

    // position the image according to user's option
    this._positionLightBox();
  }

  private _positionLightBox() {
    const top = this.options.positionFromTop;
    const left = 0;

    this._rendererRef.setElementStyle(this._lightboxElem.nativeElement, 'top', `${top}px`);
    this._rendererRef.setElementStyle(this._lightboxElem.nativeElement, 'left', `${left}px`);
  }

  /**
   * addCssAnimation add css3 classes for animate lightbox
   */
  private _addCssAnimation() {
    const resizeDuration = this.options.resizeDuration;
    const fadeDuration = this.options.fadeDuration;

    this._rendererRef.setElementStyle(this._outerContainerElem.nativeElement,
      '-webkit-transition-duration', `${resizeDuration}s`);
    this._rendererRef.setElementStyle(this._outerContainerElem.nativeElement,
      '-transition-duration', `${resizeDuration}s`);
    this._rendererRef.setElementStyle(this._dataContainerElem.nativeElement,
      '-webkit-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._dataContainerElem.nativeElement,
      '-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._imageElem.nativeElement,
      '-webkit-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._imageElem.nativeElement,
      '-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._captionElem.nativeElement,
      '-webkit-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._captionElem.nativeElement,
      '-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._numberElem.nativeElement,
      '-webkit-animation-duration', `${fadeDuration}s`);
    this._rendererRef.setElementStyle(this._numberElem.nativeElement,
      '-animation-duration', `${fadeDuration}s`);
  }

  private _end() {
    if (!this.options.disableKeyboardNav) {
      // unbind keyboard event
      this._disableKeyboardNav();
    }

    if (this._event.load) {
      // unbind all the event
      this._event.load();
    }
  }

  private _updateDetails() {
    // update the caption
    if (typeof this.album[this.currentImageIndex].caption !== 'undefined' &&
      this.album[this.currentImageIndex].caption !== '') {
      this._ui.showCaption = true;
    }

    // update the page number if user choose to do so
    // does not perform numbering the page if the
    // array length in album <= 1
    if (this.album.length > 1 && this.options.showImageNumberLabel) {
      this._ui.showPageNumber = true;
      this._content.pageNumber = this._albumLabel();
    }
  }

  private _albumLabel() {
    // due to {this.currentImageIndex} is set from 0 to {this.album.length} - 1
    return `Image ${Number(this.currentImageIndex + 1)} of ${this.album.length}`;
  }

  private _changeImage(newIndex: number) {
    this.currentImageIndex = newIndex;

    // unbind load event from image first before bind it again
    if (this._event.load) {
      this._event.load();
    }

    this._hideImage();
    this._registerImageLoadingEvent();
  }

  private _hideImage() {
    this._ui.showReloader = true;
    this._ui.showArrowNav = false;
    this._ui.showLeftArrow = false;
    this._ui.showRightArrow = false;
    this._ui.showPageNumber = false;
    this._ui.showCaption = false;
  }

  private _updateNav() {
    const alwaysShowNav = false;

    // check to see the browser support touch event
    try {
      this._documentRef.createEvent('TouchEvent');
      alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices) ? true : false;
    } catch (e) {
      // noop
    }

    // initially show the arrow nav
    // which is the parent of both left and right nav
    this._showArrowNav();
    if (this.album.length > 1) {
      if (this.options.wrapAround) {
        if (alwaysShowNav) {
          // alternatives this.$lightbox.find('.lb-prev, .lb-next').css('opacity', '1');
          this._rendererRef.setElementStyle(this._leftArrowElem.nativeElement, 'opacity', '1');
          this._rendererRef.setElementStyle(this._rightArrowElem.nativeElement, 'opacity', '1');
        }

        // alternatives this.$lightbox.find('.lb-prev, .lb-next').show();
        this._showLeftArrowNav();
        this._showRightArrowNav();
      } else {
        if (this.currentImageIndex > 0) {
          // alternatives this.$lightbox.find('.lb-prev').show();
          this._showLeftArrowNav();
          if (alwaysShowNav) {
            // alternatives this.$lightbox.find('.lb-prev').css('opacity', '1');
            this._rendererRef.setElementStyle(this._leftArrowElem.nativeElement, 'opacity', '1');
          }
        }

        if (this.currentImageIndex < this.album.length - 1) {
          // alternatives this.$lightbox.find('.lb-next').show();
          this._showRightArrowNav();
          if (alwaysShowNav) {
            // alternatives this.$lightbox.find('.lb-next').css('opacity', '1');
            this._rendererRef.setElementStyle(this._rightArrowElem.nativeElement, 'opacity', '1');
          }
        }
      }
    }
  }

  private _showLeftArrowNav() {
    this._ui.showLeftArrow = true;
  }

  private _showRightArrowNav() {
    this._ui.showRightArrow = true;
  }

  private _showArrowNav() {
    this._ui.showArrowNav = true;
  }

  private _enableKeyboardNav() {
    this._event.keyup = this._rendererRef.listenGlobal('document', 'keyup', event => {
      this._keyboardAction(event);
    });
  }

  private _disableKeyboardNav() {
    if (this._event.keyup) {
      this._event.keyup();
    }
  }

  private _keyboardAction($event: any) {
    const KEYCODE_LEFTARROW = 37;
    const KEYCODE_RIGHTARROW = 39;
    const keycode = $event.keyCode;
    const key = String.fromCharCode(keycode).toLowerCase();

    // no need to check for the esc key because
    // it is handled by model directive
    if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
      if (this.currentImageIndex !== 0) {
        this._changeImage(this.currentImageIndex - 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this._changeImage(this.album.length - 1);
      }
    } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
      if (this.currentImageIndex !== this.album.length - 1) {
        this._changeImage(this.currentImageIndex + 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this._changeImage(0);
      }
    }
  }

  private _getCssStyleValue(elem, propertyName) {
    return parseFloat(this._windowRef
      .getComputedStyle(elem.nativeElement, null)
      .getPropertyValue(propertyName));
  }
}