import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoCardRefreshingComponent } from './ff-todo-card-refreshing.component';

describe('FfTodoCardRefreshingComponent', () => {
  let component: FfTodoCardRefreshingComponent;
  let fixture: ComponentFixture<FfTodoCardRefreshingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoCardRefreshingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoCardRefreshingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
