import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementActionComponent } from './requirement-action.component';

describe('RequirementActionComponent', () => {
  let component: RequirementActionComponent;
  let fixture: ComponentFixture<RequirementActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
