import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementSideformComponent } from './requirement-sideform.component';

describe('RequirementSideformComponent', () => {
  let component: RequirementSideformComponent;
  let fixture: ComponentFixture<RequirementSideformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementSideformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementSideformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
