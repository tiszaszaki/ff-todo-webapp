import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoHeaderComponent } from './ff-todo-header.component';

describe('FfTodoHeaderComponent', () => {
  let component: FfTodoHeaderComponent;
  let fixture: ComponentFixture<FfTodoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
