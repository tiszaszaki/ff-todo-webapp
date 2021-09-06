import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoAlertListComponent } from './ff-todo-alert-list.component';

describe('FfTodoAlertListComponent', () => {
  let component: FfTodoAlertListComponent;
  let fixture: ComponentFixture<FfTodoAlertListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoAlertListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoAlertListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
