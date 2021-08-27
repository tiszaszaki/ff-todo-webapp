import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoTaskSortingFormComponent } from './ff-todo-task-sorting-form.component';

describe('FfTodoTaskSortingFormComponent', () => {
  let component: FfTodoTaskSortingFormComponent;
  let fixture: ComponentFixture<FfTodoTaskSortingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoTaskSortingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoTaskSortingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
