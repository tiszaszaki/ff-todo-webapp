import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-ff-todo-add-todo-form',
  templateUrl: './ff-todo-add-todo-form.component.html',
  styleUrls: ['./ff-todo-add-todo-form.component.css']
})
export class FfTodoAddTodoFormComponent {
  @Input() descriptionMaxLength!: number;

  validatingForm! : FormGroup;

  constructor() { }

  ngOnInit(): void {
    var tempGroup={
      addTodoNameForm: new FormControl('Example', Validators.required),
      addTodoDescriptionForm: new FormControl('Described', Validators.maxLength(this.descriptionMaxLength))
    };
    this.validatingForm = new FormGroup(tempGroup);
  }

  get controlAddTodoNameForm() {
    return this.validatingForm.get('addTodoNameForm');
  }
  get controlAddTodoDescriptionForm() {
    return this.validatingForm.get('addTodoDescriptionForm');
  }
}
