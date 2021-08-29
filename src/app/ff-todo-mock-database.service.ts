import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Task } from './task';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class FfTodoMockDatabaseService implements InMemoryDbService {
  createDb() {
    const tasksForTodo : Task[][] = [
      [
        {id:0, name:'3D mélyvíz', done:false},
        {id:1, name:'Főharcok', done:false},
      ],
      [
        {id:2, name:'MÁV', done:false},
      ],
      [
        {id:3, name:'J', done:false},
        {id:4, name:'a', done:false},
        {id:5, name:'n', done:false},
        {id:6, name:'c', done:false},
        {id:7, name:'s', done:false},
        {id:8, name:'i', done:false}
      ]
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
      var taskList = tasksForTodo[idx];
      t.datecreated = t.datemodified = new Date();
      t.tasks = [];
      if (!taskList) taskList = [];
      for (let task of taskList)
      {
        t.tasks.push(JSON.parse(JSON.stringify(task)));
      }
      idx++;
    }

    return {todo};
  }

  genId(todolist: Todo[]): number {
    let id0 : number = 0;
    console.log("List length: " + todolist.length);
    return ((todolist.length > 0) ? (Math.max(...todolist.map(todo => todo.id)) + 1) : id0);
  }

  constructor() { }
}
