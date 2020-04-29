import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDealComponent } from './assign-deal.component';

describe('AssignDealComponent', () => {
  let component: AssignDealComponent;
  let fixture: ComponentFixture<AssignDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
