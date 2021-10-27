import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from './board';
import { Todo } from './todo';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export abstract class FfTodoAbstractRequestService {
  abstract getBoard(id : number) : Observable<Board>;
  abstract getBoards() : Observable<Number[]>;
  abstract addBoard(board: Board): Observable<Board>;
  abstract editBoard(id : number, patchedBoard: Board): Observable<any>;
  abstract removeBoard(id: number): Observable<any>;

  abstract getBoardDescriptionMaxLength() : Observable<Number>;
  abstract getTodoDescriptionMaxLength() : Observable<Number>;
  abstract getTodoPhaseRange() : Observable< Array<Number> >;
  abstract getBoardReadonlyTodosSetting(id : number) : Observable<Boolean>;
  abstract setBoardReadonlyTodosSetting(id : number, readonly: Boolean) : Observable<void>;
  abstract getBoardReadonlyTasksSetting(id : number) : Observable<Boolean>;
  abstract setBoardReadonlyTasksSetting(id : number, readonly: Boolean) : Observable<void>;

  abstract getTodo(id : number) : Observable<Todo>;
  abstract getTodos() : Observable<Todo[]>;
  abstract getTodosFromBoard(id : number) : Observable<Todo[]>;
  abstract addTodo(id : number, todo: Todo): Observable<Todo>;
  abstract editTodo(id : number, patchedTodo: Todo): Observable<any>;
  abstract cloneTodo(id : number, phase : number, boardId : number): Observable<Todo>;
  abstract removeTodo(id: number): Observable<any>;
  abstract removeAllTodos(id: number): Observable<any>;

  abstract getTasksFromTodo(todoId: number): Observable<Task[]>;
  abstract addTask(task: Task, todoId: number): Observable<Task>;
  abstract editTask(patchedTask: Task): Observable<any>;
  abstract removeTask(id: number): Observable<any>;
  abstract removeAllTasks(id: number): Observable<any>;
}
