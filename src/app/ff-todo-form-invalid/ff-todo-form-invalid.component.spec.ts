import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoFormInvalidComponent } from './ff-todo-form-invalid.component';

describe('FfTodoFormInvalidComponent', () => {
  let component: FfTodoFormInvalidComponent;
  let fixture: ComponentFixture<FfTodoFormInvalidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoFormInvalidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoFormInvalidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
