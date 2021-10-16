import { TestBed } from '@angular/core/testing';

import { FfTodoAbstractRequestService } from './ff-todo-abstract-request.service';

describe('FfTodoAbstractRequestService', () => {
  let service: FfTodoAbstractRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfTodoAbstractRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
