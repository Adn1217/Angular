import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IngresoService } from './services/ingreso.service';
import { UserService } from 'src/app/usuarios/user.service';
import { Router } from '@angular/router';

const minCharLength: number = 8;
interface LoginModel {
  email: FormControl<string | null>;
  password: FormControl<string | null>
}

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})


export class IngresoComponent {
  
  userModel: FormGroup<LoginModel>
  
  @Input() 
  ingreso: boolean = true;

  constructor(private formBuilder: FormBuilder, private service: IngresoService, private usersService: UserService, public router: Router){
    this.userModel = this.formBuilder.group({
      email: ['adn1217@hotmail.com', [Validators.required, Validators.email]],
      password: ['12345678', [Validators.required, Validators.minLength(minCharLength)]]
    })
  }

  @Output()
  changeView = new EventEmitter();

  @Output()
  ingresoChange = new EventEmitter();

  getFieldControl(field: string): FormControl {
    return this.userModel.get(field) as FormControl
  }

  getFieldError(field: string): string {
    const fieldControl = this.getFieldControl(field);
    const error = fieldControl.errors || {};
    console.log(error);
 
    if(error["required"]){
      return "El campo es necesario"
    }else if (error['email']){
      return "Se debe ingresar un email válido."
    }else{
       const longitud = error['minlength'] || {};
       const lackNumChar =  longitud.actualLength - longitud.requiredLength
       if (lackNumChar < 0){
        return "Longitud mínima de 8 caracteres."
       }else {
        return "¡Se ve bien!"
        }
    }
  }

  login(event: Event){
    event.preventDefault();
    const loginUser = {
      email: this.userModel.value.email || '',
      password: this.userModel.value.password || ''
    }
    this.service.login(loginUser)
    // alert(`Se ha ingresado con el correo ${this.userModel.value.email}`)
  }

  handleChangeView(event: Event){
    event.preventDefault();
    this.ingresoChange.emit(!this.ingreso);
    this.changeView.emit(event);
  }
}
