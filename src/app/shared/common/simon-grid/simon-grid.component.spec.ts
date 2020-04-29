import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimonGridComponent } from './simon-grid.component';

describe('SimonGridComponent', () => {
  let component: SimonGridComponent;
  let fixture: ComponentFixture<SimonGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimonGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimonGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
