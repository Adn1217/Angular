import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';


const minCharLength: number = 8;
interface RegisterModel {
  nombre: FormControl<string | null>;
  apellido: FormControl<string | null>;
  usuario: FormControl<string | null>;
  edad: FormControl<number | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>
}
  
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})


export class RegistroComponent {

  userModel : FormGroup<RegisterModel> = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      edad: [0, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(minCharLength)]]
      })

  @Input()
  ingreso: boolean = false;
  
  constructor(private formBuilder: FormBuilder){
    console.log("UserModel: ", this.userModel.value)
    }
  
  @Output()
  ingresoChange = new EventEmitter();

  @Output()
  changeView = new EventEmitter();

  handleChangeView(event: Event){
    event.preventDefault();
    this.ingresoChange.emit(!this.ingreso)
    this.changeView.emit(event);
  }

  getFieldControl(field: string): FormControl {
    return this.userModel.get(field) as FormControl
  }

  getFieldError(field: string): string {
    const fieldControl = this.getFieldControl(field);
    const error = fieldControl.errors || {};
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
        return `${JSON.stringify(error)}`
        }
    }
  }

  handleSubmit(event: Event){
    const registeredUserInfo = this.userModel.value;
    delete registeredUserInfo["password"];
    alert(`Se ha registrado el usuario:  ${JSON.stringify(registeredUserInfo)}`)
    // console.log("Se ha registrado el usuario: ", JSON.stringify(this.userModel.value))
  }

}
