import { TestBed } from '@angular/core/testing';

import { FfTodoMockRequestService } from './ff-todo-mock-request.service';

describe('FfTodoMockRequestService', () => {
  let service: FfTodoMockRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfTodoMockRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
