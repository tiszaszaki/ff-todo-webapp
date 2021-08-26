import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoListComponent } from './ff-todo-list.component';

describe('FfTodoListComponent', () => {
  let component: FfTodoListComponent;
  let fixture: ComponentFixture<FfTodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
