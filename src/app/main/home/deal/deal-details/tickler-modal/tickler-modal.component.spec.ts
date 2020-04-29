import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicklerModalComponent } from './tickler-modal.component';

describe('TicklerModalComponent', () => {
  let component: TicklerModalComponent;
  let fixture: ComponentFixture<TicklerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicklerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicklerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
