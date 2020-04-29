import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageChangeComponent } from './stage-change.component';

describe('StageChangeComponent', () => {
  let component: StageChangeComponent;
  let fixture: ComponentFixture<StageChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
