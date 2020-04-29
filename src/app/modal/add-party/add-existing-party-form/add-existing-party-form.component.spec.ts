import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingPartyFormComponent } from './add-existing-party-form.component';

describe('AddExistingPartyFormComponent', () => {
  let component: AddExistingPartyFormComponent;
  let fixture: ComponentFixture<AddExistingPartyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExistingPartyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExistingPartyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
