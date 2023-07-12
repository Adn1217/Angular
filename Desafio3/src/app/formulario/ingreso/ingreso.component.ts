import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

interface UserModel {
  email: FormControl<string | null>;
  password: FormControl<string | null>
}

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})


export class IngresoComponent {
  
  userModel: FormGroup<UserModel>

  @Input() 
  ingreso: boolean = true;

  constructor(private formBuilder: FormBuilder){
    this.userModel = this.formBuilder.group({
      email: [''],
      password: ['']
    })
    console.log("UserModel: ", this.userModel.value)
  }
  @Output()
  changeView = new EventEmitter();

  @Output()
  ingresoChange = new EventEmitter();

  handleChangeView(event: Event){
    event.preventDefault();
    this.ingresoChange.emit(!this.ingreso)
    this.changeView.emit(event);
  }
}
