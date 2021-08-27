import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoSortingFormComponent } from './ff-todo-sorting-form.component';

describe('FfTodoSortingFormComponent', () => {
  let component: FfTodoSortingFormComponent;
  let fixture: ComponentFixture<FfTodoSortingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoSortingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoSortingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
