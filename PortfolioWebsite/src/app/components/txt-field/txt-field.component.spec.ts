import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxtFieldComponent } from './txt-field.component';
import { assert } from 'console';

describe('TxtFieldComponent', () => {
  let component: TxtFieldComponent;
  let fixture: ComponentFixture<TxtFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TxtFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxtFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
