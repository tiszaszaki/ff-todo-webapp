import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class FfTodoMockDatabaseService implements InMemoryDbService {
  createDb() {
    const todo : Todo[] = [
      {id:0, name:'Sonic', description:'Fejlesztése', phase:0},
      {id:1, name:'Munkám', description:'Folyamatban', phase:1}
    ];
    for (let t of todo)
    {
      t.datecreated = t.datemodified = new Date();
    }
    return {todo};
  }

  genId(todolist: Todo[]): number {
    return todolist.length > 0 ? Math.max(...todolist.map(todo => todo.id)) + 1 : 0;
  }

  constructor() { }
}
