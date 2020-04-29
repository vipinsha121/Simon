import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralFormComponent } from './collateral-form.component';

describe('CollateralFormComponent', () => {
  let component: CollateralFormComponent;
  let fixture: ComponentFixture<CollateralFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
