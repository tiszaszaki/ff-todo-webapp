import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FfTodoCommonService {

  public phase_labels: String[] = ['Backlog', 'In progress', 'Done'];

  constructor() {
    this.phaseNum = this.phase_labels.length;
    this.todoDescriptionMaxLength = 1024;
    this.boardDescriptionMaxLength = 1024;
  }

  public phaseNum!: number;
  public todoDescriptionMaxLength! : number;
  public boardDescriptionMaxLength! : number;
}
