import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyRelatedDealsComponent } from './party-related-deals.component';

describe('PartyRelatedDealsComponent', () => {
  let component: PartyRelatedDealsComponent;
  let fixture: ComponentFixture<PartyRelatedDealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyRelatedDealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyRelatedDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
