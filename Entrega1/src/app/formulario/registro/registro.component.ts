import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { users } from 'src/app/usuarios/modelos';


const minCharLength: number = 8;
interface RegisterModel {
  nombres: FormControl<string| null>;
  apellidos: FormControl<string | null>;
  usuario: FormControl<string | null>;
  edad: FormControl<number | null>;
  correo: FormControl<string | null>;
  password: FormControl<string | null>
}
  
const USER_DATA = [
  {id: 1, nombres: 'Adrian Alberto', apellidos: "Fernández Cabrera", usuario: "adn1217", edad: 32, correo: "adn1217@hotmail.com", password: "12345678"},
  {id: 2, nombres: 'Alejandra Paola', apellidos: "Fernández Castro", usuario: "alu2110", edad: 31, correo: "alufndz_@gmail.com", password: "12345678"},
  {id: 3, nombres: 'Rupertico Adolfo', apellidos: "Herrera Gonzalez", usuario: "ruper12", edad: 32, correo: "raherreraG@gmail.com", password: "12345678"},
];
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})


export class RegistroComponent {

  userModel : FormGroup<RegisterModel> = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      edad: [0, [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(minCharLength)]]
      })
  
  userList: users [] = USER_DATA;
  // userList: RegisterModel [] = USER_DATA;

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
      this.userList = [...this.userList, {
        id: new Date().getTime(),
        nombres: this.userModel.value.nombres || '',
        apellidos: this.userModel.value.apellidos || '',
        usuario: this.userModel.value.usuario || '',
        edad: this.userModel.value.edad || 18,
        correo: this.userModel.value.correo || '',
        password: this.userModel.value.password || ''}]

    // alert(`Se ha registrado el usuario:  ${JSON.stringify(this.userModel.value)}`)
    // console.log("Se ha registrado el usuario: ", JSON.stringify(this.userModel.value))
  }

  handleDeleteUser(userToDelete: users ){
    if(userToDelete && confirm(`¿Está seguro que desea eliminar el usuario ${userToDelete.nombres + ' ' + userToDelete.apellidos}`)){
      this.userList = this.userList.filter((user) => user.id !== userToDelete.id )
      console.log("Se elimina usuario con id: ", userToDelete.id)
    }
  }

  handleUpdateUser(userUpdated: users){
    const userToUpdate = this.userList.find((user) => user.id === userUpdated.id);
    if(userToUpdate){
      this.userList = this.userList.map((user) => {
        if(user.id === userUpdated.id){
          // return {...user, ...userUpdated}
          return {...user, ...{nombres: this.userModel.value.nombres || '',
          apellidos: this.userModel.value.apellidos || '',
          usuario: this.userModel.value.usuario || '',
          edad: this.userModel.value.edad || 18,
          correo: this.userModel.value.correo || '',
          password: this.userModel.value.password || ''}}
        }else{
          return user
        }
      })
    }
  }

}
