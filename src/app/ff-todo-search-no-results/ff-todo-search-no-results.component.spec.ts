import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoSearchNoResultsComponent } from './ff-todo-search-no-results.component';

describe('FfTodoSearchNoResultsComponent', () => {
  let component: FfTodoSearchNoResultsComponent;
  let fixture: ComponentFixture<FfTodoSearchNoResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoSearchNoResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoSearchNoResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
