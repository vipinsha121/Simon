import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddparticipantModelComponent } from './add-internal-participant.component';

describe('AddparticipantModelComponent', () => {
  let component: AddparticipantModelComponent;
  let fixture: ComponentFixture<AddparticipantModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddparticipantModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddparticipantModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
