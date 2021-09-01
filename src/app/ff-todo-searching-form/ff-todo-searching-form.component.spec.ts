import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoSearchingFormComponent } from './ff-todo-searching-form.component';

describe('FfTodoSearchingFormComponent', () => {
  let component: FfTodoSearchingFormComponent;
  let fixture: ComponentFixture<FfTodoSearchingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoSearchingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoSearchingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
