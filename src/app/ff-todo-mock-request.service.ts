import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Todo } from './todo';
import { Task } from './task';
import { FfTodoCommonService } from './ff-todo-common.service';
import { Board } from './board';

@Injectable({
  providedIn: 'root'
})
export class FfTodoMockRequestService {

  private baseurl = 'ff-todo/';
  private boardPath! : string;
  private todoPath! : string;
  private taskPath! : string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
      private http: HttpClient,
      private common: FfTodoCommonService) {
    this.boardPath = this.baseurl + 'board';
    this.todoPath = this.baseurl + 'todo';
    this.taskPath = this.baseurl + 'task';

    this.common.setRealServiceStatus(false);
  }

  getBoard(id : number) : Observable<Board> {
    return this.http.get<Board>(`${this.boardPath}/${id}`).pipe(
        map((board : Board) => { return board; }),
        tap((board : Board) => console.log(`Fetched Board: (${JSON.stringify(board)})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getBoards() : Observable<Number[]> {
    return this.http.get<Board[]>(`${this.boardPath}`).pipe(
        map((boards : Board[]) => {
          let results: Number[] = [];

          for (let board of boards)
          {
            results.push(board.id);
          }

          return results;
        }),
        tap((todos : Number[]) => console.log(`Fetched ${todos.length} Board ID(s)`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  addBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(`${this.boardPath}`, board, this.httpOptions).pipe(
      tap((newBoard: Board) => console.log(`Added new Board: ${JSON.stringify(newBoard)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editBoard(id : number, patchedBoard: Board): Observable<any> {
    return this.http.put(`${this.boardPath}/${patchedBoard.id}`, patchedBoard).pipe(
      tap(_ => console.log(`Edited Board with ID (${patchedBoard.id}) to (${JSON.stringify(patchedBoard)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeBoard(id: number): Observable<any> {
    return this.http.delete(`${this.boardPath}/${id}`).pipe(
      tap(_ => console.log(`Removed Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  getBoardDescriptionMaxLength() : Observable<Number> {
    return of(1024);
  }

  getTodoDescriptionMaxLength() : Observable<Number> {
    return of(1024);
  }

  getTodoPhaseRange() : Observable< Array<Number> > {
    return of([0,2]);
  }

  getBoardReadonlyTodosSetting(id : number) : Observable<Boolean> {
    return this.http.get<Board>(`${this.boardPath}/${id}`).pipe(
      map((board : Board) => { return board.readonlyTodos; }),
      tap((readonly : Boolean) => console.log(`Fetched Read-only Todos settings for Board with ID (${id}): (${readonly})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  setBoardReadonlyTodosSetting(id : number, readonly: Boolean) : Observable<void> {
    return this.http.get<Board>(`${this.boardPath}/${id}`).pipe(
      map((board : Board) => {
        let patchedBoard = board;
        patchedBoard.readonlyTodos = readonly;
        this.http.put(`${this.boardPath}/${patchedBoard.id}`, patchedBoard).pipe(
          tap(_ => console.log(`Set Read-only Todos settings for Board with ID (${id}) to (${readonly})`)),
          catchError((error: HttpErrorResponse) => {
            console.error(error);
            return throwError(error);
          })
        );
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  getBoardReadonlyTasksSetting(id : number) : Observable<Boolean> {
    return this.http.get<Board>(`${this.boardPath}/${id}`).pipe(
      map((board : Board) => { return board.readonlyTasks; }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
  );
  }

  setBoardReadonlyTasksSetting(id : number, readonly: Boolean) : Observable<void> {
    return of();
  }

  getTodo(id : number) : Observable<Todo> {
    return this.http.get<Todo>(`${this.todoPath}/${id}`).pipe(
        tap((todo : Todo) => console.log(`Fetched Todo: (${JSON.stringify(todo)})`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodos() : Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.todoPath}`).pipe(
        map((todos : Todo[]) => {
          return todos;
        }),
        tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s)`)),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        })
    );
  }

  getTodosFromBoard(id : number) : Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.todoPath}`).pipe(
      map((todos : Todo[]) => {
        let results: Todo[] = [];

        for (let todo of todos)
        {
          if (todo.boardId == id)
          {
            results.push(todo);
          }
        }

        return results;
      }),
      tap((todos : Todo[]) => console.log(`Fetched ${todos.length} Todo(s) from Board with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  addTodo(id : number, todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.todoPath}`, todo, this.httpOptions).pipe(
      tap((newTodo: Todo) => console.log(`Added new Todo: ${JSON.stringify(newTodo)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTodo(id : number, patchedTodo: Todo): Observable<any> {
    patchedTodo.dateModified = new Date();
    return this.http.put(`${this.todoPath}/${patchedTodo.id}`, patchedTodo).pipe(
      tap(_ => console.log(`Edited Todo with ID (${patchedTodo.id}) to (${JSON.stringify(patchedTodo)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  cloneTodo(id : number, phase : number, boardId : number): Observable<void> {
    return of();
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete(`${this.todoPath}/${id}`).pipe(
      tap(_ => console.log(`Removed Todo with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeAllTodos(id: number): Observable<any> {
    return of([]);
  }

  getTasksFromTodo(todoId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.taskPath}`).pipe(
      map((tasks : Task[]) => {
        let filtered_tasks: Task[] = [];
        for (let task of tasks)
        {
          if (task.todoId == todoId)
          {
            filtered_tasks.push(task);
          }
        }
        console.log(`Fetched ${filtered_tasks.length} Task(s) from Todo with ID (${todoId})`);
        return filtered_tasks;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  addTask(task: Task, todoId: number): Observable<Task> {
    return this.http.post<Task>(`this.taskPath`, task, this.httpOptions).pipe(
      tap((newTask: Task) => console.log(`Added new Task for Todo with ID (${todoId}): ${JSON.stringify(newTask)}`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    )
  }

  editTask(patchedTask: Task): Observable<any> {
    return this.http.put(`this.taskPath/patchedTask.id`, patchedTask).pipe(
      tap(_ => console.log(`Edited Task with ID (${patchedTask.id}) to (${JSON.stringify(patchedTask)})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  checkTask(id: number): Observable<any> {
    return of([]);
  }

  removeTask(id: number): Observable<any> {
    return this.http.delete(`this.taskPath/id`).pipe(
      tap(_ => console.log(`Removed Task with ID (${id})`)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  removeAllTasks(id: number): Observable<any> {
    return of([]);
  }

}
