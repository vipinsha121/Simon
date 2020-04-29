import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementAddComponent } from './requirement-add.component';

describe('RequirementAddComponent', () => {
  let component: RequirementAddComponent;
  let fixture: ComponentFixture<RequirementAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
