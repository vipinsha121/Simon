import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Requirement2ModalComponent } from './requirement2-modal.component';

describe('Requirement2ModalComponent', () => {
  let component: Requirement2ModalComponent;
  let fixture: ComponentFixture<Requirement2ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Requirement2ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Requirement2ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
