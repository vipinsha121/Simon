import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RequiredLoanFieldsComponent } from './required-loan-fields.component';

describe('RequiredLoanFieldsComponent', () => {
  let component: RequiredLoanFieldsComponent;
  let fixture: ComponentFixture<RequiredLoanFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequiredLoanFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredLoanFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
