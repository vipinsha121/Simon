import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySummaryComponent } from './party-summary.component';

describe('PartySummaryComponent', () => {
  let component: PartySummaryComponent;
  let fixture: ComponentFixture<PartySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
