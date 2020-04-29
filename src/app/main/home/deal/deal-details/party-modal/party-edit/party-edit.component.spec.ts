import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyEditComponent } from './party-edit.component';

describe('PartyEditComponent', () => {
  let component: PartyEditComponent;
  let fixture: ComponentFixture<PartyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
