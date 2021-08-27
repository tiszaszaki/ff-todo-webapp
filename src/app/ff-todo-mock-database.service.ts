import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Task } from './task';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class FfTodoMockDatabaseService implements InMemoryDbService {
  createDb() {
    const tasks : Task[] = [
      {id:0, name:'3D mélyvíz', done:false},
      {id:1, name:'Főharcok', done:false},

      {id:2, name:'MÁV', done:false},

      {id:3, name:'J', done:false},
      {id:4, name:'a', done:false},
      {id:5, name:'n', done:false},
      {id:6, name:'c', done:false},
      {id:7, name:'s', done:false},
      {id:8, name:'i', done:false}
    ];
    const todo : Todo[] = [
      {id:0, name:'Sonic', description:'Fejlesztése', phase:0},
      {id:1, name:'Álláskeresés', description:'Folyamatban', phase:1},
      {id:2, name:'Nevem', description:'Kiíratása', phase:2}
    ];
    for (let t of todo)
    {
      t.datecreated = t.datemodified = new Date();
      t.tasks = [];
    }

    /*
    if (todo[0].tasks)
      todo[0].tasks.push(tasks[0], tasks[1]);
    if (todo[1].tasks)
      todo[1].tasks.push(tasks[2]);
    if (todo[2].tasks)
      todo[2].tasks.push(tasks[3], tasks[4], tasks[5], tasks[6], tasks[7], tasks[8]);
    */

    return {todo};
  }

  genId(todolist: Todo[]): number {
    return todolist.length > 0 ? Math.max(...todolist.map(todo => todo.id)) + 1 : 0;
  }

  constructor() { }
}
