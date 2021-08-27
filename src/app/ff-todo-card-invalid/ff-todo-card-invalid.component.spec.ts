import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoCardInvalidComponent } from './ff-todo-card-invalid.component';

describe('FfTodoCardInvalidComponent', () => {
  let component: FfTodoCardInvalidComponent;
  let fixture: ComponentFixture<FfTodoCardInvalidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoCardInvalidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoCardInvalidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
