import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoAddTodoFormComponent } from './ff-todo-add-todo-form.component';

describe('FfTodoAddTodoFormComponent', () => {
  let component: FfTodoAddTodoFormComponent;
  let fixture: ComponentFixture<FfTodoAddTodoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoAddTodoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoAddTodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
