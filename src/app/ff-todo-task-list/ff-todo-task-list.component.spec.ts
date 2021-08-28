import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoTaskListComponent } from './ff-todo-task-list.component';

describe('FfTodoTaskListComponent', () => {
  let component: FfTodoTaskListComponent;
  let fixture: ComponentFixture<FfTodoTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoTaskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
