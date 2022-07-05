export class Task {
    public id!: number;
    public name!: String;
    public done!: Boolean;
    public dateModified!: Date;
    public dateCreated!: Date;
    public deadline?: Date;

    public todoId?: number;
}
