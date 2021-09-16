import { TestBed } from '@angular/core/testing';

import { FfTodoCommonService } from './ff-todo-common.service';

describe('FfTodoCommonService', () => {
  let service: FfTodoCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfTodoCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
