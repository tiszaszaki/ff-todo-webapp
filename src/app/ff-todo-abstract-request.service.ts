import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from './board';
import { Todo } from './todo';
import { Task } from './task';
import { PivotResponse } from './pivot-response';

@Injectable({
  providedIn: 'root'
})
export abstract class FfTodoAbstractRequestService {
  abstract getBoard(id : number) : Observable<Board>;
  abstract getBoardIds() : Observable<Number[]>;
  abstract addBoard(board: Board): Observable<Board>;
  abstract editBoard(id : number, patchedBoard: Board): Observable<void>;
  abstract removeBoard(id: number): Observable<void>;

  abstract getBoardNameMaxLength() : Observable<Number>;
  abstract getBoardDescriptionMaxLength() : Observable<Number>;
  abstract getBoardAuthorMaxLength() : Observable<Number>;

  abstract getBoardReadonlyTodosSetting(id : number) : Observable<Boolean>;
  abstract setBoardReadonlyTodosSetting(id : number, readonly: Boolean) : Observable<void>;
  abstract getBoardReadonlyTasksSetting(id : number) : Observable<Boolean>;
  abstract setBoardReadonlyTasksSetting(id : number, readonly: Boolean) : Observable<void>;

  abstract getTodo(id : number) : Observable<Todo>;
  abstract getTodos() : Observable<Todo[]>;
  abstract getTodosFromBoard(id : number) : Observable<Todo[]>;
  abstract addTodo(id : number, todo: Todo): Observable<Todo>;
  abstract editTodo(id : number, patchedTodo: Todo): Observable<void>;
  abstract cloneTodo(id : number, phase : number, boardId : number): Observable<Todo>;
  abstract removeTodo(id: number): Observable<void>;
  abstract removeAllTodos(id: number): Observable<Number>;

  abstract getTodoNameMaxLength() : Observable<Number>;
  abstract getTodoDescriptionMaxLength() : Observable<Number>;
  abstract getTodoPhaseRange() : Observable< Array<Number> >;
  abstract getTodoPhaseName(idx : number) : Observable<String>;

  abstract getTasks() : Observable<Task[]>;
  abstract getTasksFromTodo(todoId: number): Observable<Task[]>;
  abstract addTask(task: Task, todoId: number): Observable<Task>;
  abstract editTask(patchedTask: Task): Observable<void>;
  abstract removeTask(id: number): Observable<void>;
  abstract removeAllTasks(id: number): Observable<Number>;

  abstract getTaskNameMaxLength() : Observable<Number>;

  abstract pivotQuery(pivotId: string) : Observable<PivotResponse>;
}
