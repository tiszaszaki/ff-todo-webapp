import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoListPerPhaseComponent } from './ff-todo-list-per-phase.component';

describe('FfTodoListPerPhaseComponent', () => {
  let component: FfTodoListPerPhaseComponent;
  let fixture: ComponentFixture<FfTodoListPerPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoListPerPhaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoListPerPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
