import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { inboxSectionComponent } from './inbox-section.component';

describe('MenuSectionComponent', () => {
  let component: inboxSectionComponent;
  let fixture: ComponentFixture<inboxSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ inboxSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(inboxSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
