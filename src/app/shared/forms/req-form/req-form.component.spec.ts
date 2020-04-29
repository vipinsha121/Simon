import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqFormComponent } from './req-form.component';

describe('ReqFormComponent', () => {
  let component: ReqFormComponent;
  let fixture: ComponentFixture<ReqFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
