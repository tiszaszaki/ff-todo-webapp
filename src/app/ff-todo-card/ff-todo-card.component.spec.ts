import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoCardComponent } from './ff-todo-card.component';

describe('FfTodoCardComponent', () => {
  let component: FfTodoCardComponent;
  let fixture: ComponentFixture<FfTodoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
