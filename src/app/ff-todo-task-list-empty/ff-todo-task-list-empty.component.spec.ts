import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoTaskListEmptyComponent } from './ff-todo-task-list-empty.component';

describe('FfTodoTaskListEmptyComponent', () => {
  let component: FfTodoTaskListEmptyComponent;
  let fixture: ComponentFixture<FfTodoTaskListEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoTaskListEmptyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoTaskListEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
