import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoIndexComponent } from './ff-todo-index.component';

describe('FfTodoIndexComponent', () => {
  let component: FfTodoIndexComponent;
  let fixture: ComponentFixture<FfTodoIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
