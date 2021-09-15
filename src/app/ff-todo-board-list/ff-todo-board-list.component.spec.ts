import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfTodoBoardListComponent } from './ff-todo-board-list.component';

describe('FfTodoBoardListComponent', () => {
  let component: FfTodoBoardListComponent;
  let fixture: ComponentFixture<FfTodoBoardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FfTodoBoardListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FfTodoBoardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
