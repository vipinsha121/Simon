import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExternalParticipantComponent } from './add-external-participant.component';

describe('AddExternalParticipantComponent', () => {
  let component: AddExternalParticipantComponent;
  let fixture: ComponentFixture<AddExternalParticipantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExternalParticipantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExternalParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
