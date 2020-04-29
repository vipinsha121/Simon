import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementModalComponent } from './requirement-modal.component';

describe('RequirementModalComponent', () => {
  let component: RequirementModalComponent;
  let fixture: ComponentFixture<RequirementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
