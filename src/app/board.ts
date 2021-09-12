import { Todo } from "./todo";

export class Board {
    public id!: number;
    public name!: String;
    public description!: String;
    public author!: String;
    public dateCreated!: Date;
    public readonlyTodos!: String;
    public readonlyTasks!: String;

    todos?: Todo[];
}
