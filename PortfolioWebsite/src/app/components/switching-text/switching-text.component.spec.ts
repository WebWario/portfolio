import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchingTextComponent } from './switching-text.component';

describe('SwitchingTextComponent', () => {
  let component: SwitchingTextComponent;
  let fixture: ComponentFixture<SwitchingTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchingTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchingTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
