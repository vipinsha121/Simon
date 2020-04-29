import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealMessageComponent } from './deal-message.component';

describe('DealMessageComponent', () => {
  let component: DealMessageComponent;
  let fixture: ComponentFixture<DealMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
