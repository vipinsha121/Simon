import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementDocsComponent } from './requirement-docs.component';

describe('RequirementDocsComponent', () => {
  let component: RequirementDocsComponent;
  let fixture: ComponentFixture<RequirementDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
