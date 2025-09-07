import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingLogosComponent } from './floating-logos.component';

describe('FloatingLogosComponent', () => {
  let component: FloatingLogosComponent;
  let fixture: ComponentFixture<FloatingLogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingLogosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingLogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
