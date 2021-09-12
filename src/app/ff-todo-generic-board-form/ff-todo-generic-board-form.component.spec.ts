import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoGenericBoardFormComponent } from './ff-todo-generic-board-form.component';

describe('FfTodoGenericBoardFormComponent', () => {
  let component: FfTodoGenericBoardFormComponent;
  let fixture: ComponentFixture<FfTodoGenericBoardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoGenericBoardFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoGenericBoardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
