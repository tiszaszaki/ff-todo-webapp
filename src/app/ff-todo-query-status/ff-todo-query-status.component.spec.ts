import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoQueryStatusComponent } from './ff-todo-query-status.component';

describe('FfTodoQueryStatusComponent', () => {
  let component: FfTodoQueryStatusComponent;
  let fixture: ComponentFixture<FfTodoQueryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoQueryStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoQueryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
