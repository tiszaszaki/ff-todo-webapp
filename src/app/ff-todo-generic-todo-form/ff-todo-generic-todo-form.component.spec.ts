import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoGenericTodoFormComponent } from './ff-todo-generic-todo-form.component';

describe('FfTodoGenericTodoFormComponent', () => {
  let component: FfTodoGenericTodoFormComponent;
  let fixture: ComponentFixture<FfTodoGenericTodoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoGenericTodoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoGenericTodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
