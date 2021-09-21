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
    const todos : Todo[] = [
      /*
      {id:0, name:'Sonic', description:'Fejlesztése', phase:0, dateCreated: new Date(), dateModified: new Date(),
        tasks: [tasks[0], tasks[1]]},
      {id:1, name:'Álláskeresés', description:'Folyamatban', phase:1, dateCreated: new Date(), dateModified: new Date(),
        tasks: [tasks[2]]},
      {id:2, name:'Nevem', description:'Kiíratása', phase:2, dateCreated: new Date(), dateModified: new Date(),
        tasks: [tasks[3], tasks[4], tasks[5], tasks[6], tasks[7], tasks[8]]}
      */
    ];

    let genStr = 'FeketeJános';

    for (var idx1 = 0; idx1 < genStr.length; idx1++) {
      let c1 = genStr[idx1];
      let id = this.genId(todos);
      const todo: Todo = {id: id, name: c1, description: '', phase: 0, dateCreated: new Date(), dateModified: new Date()};
      todos.push(todo);

      for (var idx2 = 0; idx2 <= idx1; idx2++)
      {
        let c2 = genStr[idx2];
        const task: Task = {id: this.genId(tasks), name: c2, done: false};
        tasks.push(task);
      }
    }

    for (let t of todos)
    {
      t.dateCreated = t.dateModified = new Date();
    }

    return {todo: todos, task: tasks};
  } 

  genId(anylist: any[]): number {
    let id0 : number = 0;
    return ((anylist.length > 0) ? (Math.max(...anylist.map(entity => entity.id)) + 1) : id0);
  }

  constructor() { }
}
