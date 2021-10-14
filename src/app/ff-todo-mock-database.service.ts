import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Board } from './board';
import { Task } from './task';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class FfTodoMockDatabaseService implements InMemoryDbService {
  createDb() {
    const tasks : Task[] = [
      {id:0, name:'3D mélyvíz', done:false, todoId: 0},
      {id:1, name:'Főharcok',   done:false, todoId: 0},

      {id:2, name:'MÁV', done:false, todoId: 1},

      {id:3, name:'J', done:false, todoId: 2},
      {id:4, name:'a', done:false, todoId: 2},
      {id:5, name:'n', done:false, todoId: 2},
      {id:6, name:'c', done:false, todoId: 2},
      {id:7, name:'s', done:false, todoId: 2},
      {id:8, name:'i', done:false, todoId: 2}
    ];
    const todos : Todo[] = [
      {id:0, name:'Sonic', description:'Fejlesztése', phase:0, dateCreated: new Date(), dateModified: new Date(), boardId: 0},
      {id:1, name:'Álláskeresés', description:'Folyamatban', phase:1, dateCreated: new Date(), dateModified: new Date(), boardId: 0},
      {id:2, name:'Nevem', description:'Kiíratása', phase:2, dateCreated: new Date(), dateModified: new Date(), boardId: 0}
    ];
    const boards: Board[] = [
      {id:0, name:'Első tábla', description:'', author:'', dateCreated: new Date(), readonlyTodos: false, readonlyTasks: false}
    ];

    let genStr = 'FeketeJános';

    for (var idx1 = 0; idx1 < genStr.length; idx1++) {
      let c1 = genStr[idx1];
      let id = this.genId(todos);
      const todo: Todo = {id: id, name: c1, description: '', phase: 0, dateCreated: new Date(), dateModified: new Date(), boardId: 0};
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

    return {board: boards, todo: todos, task: tasks};
  } 

  genId(anylist: any[]): number {
    let id0 : number = 0;
    return ((anylist.length > 0) ? (Math.max(...anylist.map(entity => entity.id)) + 1) : id0);
  }

  constructor() { }
}
