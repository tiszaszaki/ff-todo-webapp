export class Todo {
  public id!: number;
  public name!: String;
  public description!: String;
  public phase!: number;
  public datemodified?: Date;
  public datecreated?: Date;
  
  public descriptionLength?: number;
  public taskCount?: number;

  tasks?: Task[];
}
