import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvaBackgroundComponent } from './canva-background.component';

describe('CanvaBackgroundComponent', () => {
  let component: CanvaBackgroundComponent;
  let fixture: ComponentFixture<CanvaBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvaBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvaBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
