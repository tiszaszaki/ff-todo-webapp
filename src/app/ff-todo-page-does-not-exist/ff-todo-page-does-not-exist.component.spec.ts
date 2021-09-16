import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoPageDoesNotExistComponent } from './ff-todo-page-does-not-exist.component';

describe('FfTodoPageDoesNotExistComponent', () => {
  let component: FfTodoPageDoesNotExistComponent;
  let fixture: ComponentFixture<FfTodoPageDoesNotExistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoPageDoesNotExistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoPageDoesNotExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
