import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoFooterComponent } from './ff-todo-footer.component';

describe('FfTodoFooterComponent', () => {
  let component: FfTodoFooterComponent;
  let fixture: ComponentFixture<FfTodoFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
