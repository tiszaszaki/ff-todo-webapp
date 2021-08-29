import { TestBed } from '@angular/core/testing';

import { FfTodoRealRequestService } from './ff-todo-real-request.service';

describe('FfTodoRealRequestService', () => {
  let service: FfTodoRealRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfTodoRealRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
