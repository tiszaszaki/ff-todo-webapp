import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoBackendSwitchFormComponent } from './ff-todo-backend-switch-form.component';

describe('FfTodoBackendSwitchFormComponent', () => {
  let component: FfTodoBackendSwitchFormComponent;
  let fixture: ComponentFixture<FfTodoBackendSwitchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoBackendSwitchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoBackendSwitchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
