import { TestBed } from '@angular/core/testing';

import { FfTodoAlertService } from './ff-todo-alert.service';

describe('FfTodoAlertService', () => {
  let service: FfTodoAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfTodoAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
