import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementActionSelectComponent } from './requirement-action-select.component';

describe('RequirementActionSelectComponent', () => {
  let component: RequirementActionSelectComponent;
  let fixture: ComponentFixture<RequirementActionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementActionSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementActionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
