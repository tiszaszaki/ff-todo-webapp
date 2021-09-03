export class Todo {
  public id!: number;
  public name!: String;
  public description!: String;
  public phase!: number;
  public dateModified!: Date;
  public dateCreated!: Date;
  public deadline?: Date;
  
  public descriptionLength?: number;
  public taskCount?: number;

  tasks?: Task[];
}
