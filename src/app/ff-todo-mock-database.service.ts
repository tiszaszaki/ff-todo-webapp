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
      {todoId:0, id:0, name:'3D mélyvíz', done:false},
      {todoId:0, id:1, name:'Főharcok', done:false},

      {todoId:1, id:2, name:'MÁV', done:false},

      {todoId:2, id:3, name:'J', done:false},
      {todoId:2, id:4, name:'a', done:false},
      {todoId:2, id:5, name:'n', done:false},
      {todoId:2, id:6, name:'c', done:false},
      {todoId:2, id:7, name:'s', done:false},
      {todoId:2, id:8, name:'i', done:false}
    ];
    const todo : Todo[] = [
      {id:0, name:'Sonic', description:'Fejlesztése', phase:0},
      {id:1, name:'Álláskeresés', description:'Folyamatban', phase:1},
      {id:2, name:'Nevem', description:'Kiíratása', phase:2},
      {id:3, name:'J', description:'Nevem betűje', phase:0},
      {id:4, name:'a', description:'Nevem betűje', phase:0},
      {id:5, name:'n', description:'Nevem betűje', phase:0},
      {id:6, name:'c', description:'Nevem betűje', phase:0},
      {id:7, name:'s', description:'Nevem betűje', phase:0},
      {id:8, name:'i', description:'Nevem betűje', phase:0}
    ];
    let idx=0;
    for (let t of todo)
    {
      t.datecreated = t.datemodified = new Date();
      t.tasks = [];
      for (let task of tasks)
      {
        let todoId=((task.todoId !== undefined) ? task.todoId : -1);
        let unmarkedTask=task;

        if (todoId == t.id)
        {
          delete unmarkedTask.todoId;
          t.tasks.push(JSON.parse(JSON.stringify(unmarkedTask)));
        }
      }
    }

    return {todo, task: tasks};
  }

  genId(todolist: Todo[]): number {
    let id0 : number = 0;
    console.log("List length: " + todolist.length);
    return ((todolist.length > 0) ? (Math.max(...todolist.map(todo => todo.id)) + 1) : id0);
  }

  constructor() { }
}
