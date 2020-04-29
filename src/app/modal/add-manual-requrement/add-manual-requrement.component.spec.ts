import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManualRequrementComponent } from './add-manual-requrement.component';

describe('AddManualRequrementComponent', () => {
  let component: AddManualRequrementComponent;
  let fixture: ComponentFixture<AddManualRequrementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddManualRequrementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManualRequrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
