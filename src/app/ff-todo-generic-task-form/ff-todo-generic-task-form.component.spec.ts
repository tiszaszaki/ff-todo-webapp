import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoGenericTaskFormComponent } from './ff-todo-generic-task-form.component';

describe('FfTodoGenericTaskFormComponent', () => {
  let component: FfTodoGenericTaskFormComponent;
  let fixture: ComponentFixture<FfTodoGenericTaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoGenericTaskFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoGenericTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
