import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoListEmptyComponent } from './ff-todo-list-empty.component';

describe('FfTodoListEmptyComponent', () => {
  let component: FfTodoListEmptyComponent;
  let fixture: ComponentFixture<FfTodoListEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoListEmptyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoListEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
