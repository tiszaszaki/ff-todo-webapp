import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoBootstrapDateTimePickerComponent } from './ff-todo-bootstrap-date-time-picker.component';

describe('FfTodoBootstrapDateTimePickerComponent', () => {
  let component: FfTodoBootstrapDateTimePickerComponent;
  let fixture: ComponentFixture<FfTodoBootstrapDateTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoBootstrapDateTimePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoBootstrapDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
