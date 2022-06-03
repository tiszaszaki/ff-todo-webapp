import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoTaskIndexComponent } from './ff-todo-task-index.component';

describe('FfTodoTaskIndexComponent', () => {
  let component: FfTodoTaskIndexComponent;
  let fixture: ComponentFixture<FfTodoTaskIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoTaskIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoTaskIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
