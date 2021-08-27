export interface Todo {
  id: number;
  name: String;
  description: String;
  phase: number;
  datemodified?: Date;
  datecreated?: Date;
  
  tasks?: Task[];
}
