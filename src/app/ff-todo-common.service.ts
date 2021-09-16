import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FfTodoCommonService {

  public phase_labels!: String[];
  public phaseNum!: number;

  public boardSelected!: Number;

  public displayDateFormat!: string;
  public inputDateFormat!: string;

  public boardDescriptionMaxLength! : number;
  public todoDescriptionMaxLength! : number;

  public enableRestoreTodos!: Boolean;

  public todosearchexec!: Boolean;
  public readonlyTodo!: Boolean;
  public readonlyTask!: Boolean;

  public todo_count!: number;

  public todo_searching_casesense!: Boolean;
  public todo_searching_highlight!: Boolean;
  public todo_searching_rules!: Map<String,String>;

  constructor() {
    this.phase_labels = ['Backlog', 'In progress', 'Done'];
    this.phaseNum = this.phase_labels.length;

    this.inputDateFormat = 'yyyy-MM-dd HH:mm:ss';
    this.displayDateFormat = 'yyyy-MM-dd HH:mm:ss.sss';

    this.todoDescriptionMaxLength = 1024;
    this.boardDescriptionMaxLength = 1024;

    this.todo_searching_casesense = false;
    this.todo_searching_highlight = false;

    this.todo_searching_rules = new Map<String,String>();
  }
}
