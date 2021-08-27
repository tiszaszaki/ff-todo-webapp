import { TestBed } from '@angular/core/testing';

import { FfTodoServiceService } from './ff-todo-service.service';

describe('FfTodoServiceService', () => {
  let service: FfTodoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfTodoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
