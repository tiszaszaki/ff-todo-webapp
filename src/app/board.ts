import { Todo } from "./todo";

export class Board {
    public id!: number;
    public name!: String;
    public description!: String;
    public author!: String;
    public dateModified!: Date;
    public dateCreated!: Date;
    public readonlyTodos!: Boolean;
    public readonlyTasks!: Boolean;

    todos?: Todo[];
}
