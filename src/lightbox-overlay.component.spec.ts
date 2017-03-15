import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { LightboxEvent } from './lightbox-event.service';
import { LightboxOverlayComponent } from './lightbox-overlay.component';

describe('[ Unit - LightboxOverlayComponent ]', () => {
  let fixture: ComponentFixture<LightboxOverlayComponent>;
  let lightboxEvent: LightboxEvent;
  let mockData: any;
  let windowMock: any;

  beforeEach(() => {
    mockData = {
      options: {
        fadeDuration: 1
      }
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LightboxOverlayComponent],
      providers: [
        LightboxEvent,
        { provide: 'Window', useValue: windowMock }
      ]
    });

    fixture = TestBed.createComponent(LightboxOverlayComponent);

    // mock options
    fixture.componentInstance.options = mockData.options;
    fixture.detectChanges();
  });

  beforeEach(inject([LightboxEvent], (lEvent: LightboxEvent) => {
    lightboxEvent = lEvent;
  }));

  it('should init the component with correct styling', () => {
    expect(fixture.nativeElement.getAttribute('class')).toContain('lightboxOverlay animation fadeInOverlay');
    expect(fixture.nativeElement.getAttribute('style'))
      .toMatch(new RegExp(`animation.*${mockData.options.fadeDuration}s`));
  });
});
