import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoGenericPivotFormComponent } from './ff-todo-generic-pivot-form.component';

describe('FfTodoGenericPivotFormComponent', () => {
  let component: FfTodoGenericPivotFormComponent;
  let fixture: ComponentFixture<FfTodoGenericPivotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoGenericPivotFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoGenericPivotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
