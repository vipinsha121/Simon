import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementActionMenuComponent } from './requirement-action-menu.component';

describe('RequirementActionMenuComponent', () => {
  let component: RequirementActionMenuComponent;
  let fixture: ComponentFixture<RequirementActionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementActionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
