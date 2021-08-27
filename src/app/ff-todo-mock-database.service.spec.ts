import { TestBed } from '@angular/core/testing';

import { FfTodoMockDatabaseService } from './ff-todo-mock-database.service';

describe('FfTodoMockDatabaseService', () => {
  let service: FfTodoMockDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FfTodoMockDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
