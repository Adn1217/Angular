import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { users } from 'src/app/usuarios/modelos';
import { UserService } from 'src/app/usuarios/user.service';
import { Observable, takeUntil, Subject } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';


const minCharPwdLength: number = 8;
const minCharUserLength: number = 5;
interface RegisterModel {
  nombres: FormControl<string| null>;
  apellidos: FormControl<string | null>;
  usuario: FormControl<string | null>;
  edad: FormControl<number | null>;
  correo: FormControl<string | null>;
  password: FormControl<string | null>
}
  
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})


export class RegistroComponent implements OnDestroy {

  userModel : FormGroup<RegisterModel> = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      usuario: ['', [Validators.required, Validators.minLength(minCharUserLength)]],
      edad: [0, [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(minCharPwdLength)]]
      })
  
  userList: users [] = [];

  userListObserver: Observable<users[]>;
  destroyed = new Subject<boolean>(); 

  @Input()
  ingreso: boolean = false;

  @Input()
  showForm: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private userService: UserService, private notifier: NotifierService){

    this.userListObserver = userService.getUsers().pipe(takeUntil(this.destroyed));
    this.userListObserver.subscribe({
      next: (users) => {
        this.userList = users;
        console.log(users);
      }
    })

    }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }
  
  @Output()
  ingresoChange = new EventEmitter();

  @Output()
  changeView = new EventEmitter();
  
  @Output()
  showFormChange = new EventEmitter();

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
   
    this.showFormChange.emit();
    const newUser = {
      id: new Date().getTime(),
      nombres: this.userModel.value.nombres || '',
      apellidos: this.userModel.value.apellidos || '',
      usuario: this.userModel.value.usuario || '',
      edad: this.userModel.value.edad || 18,
      correo: this.userModel.value.correo || '',
      password: this.userModel.value.password || ''}

    this.userService.createUser(newUser);
    this.userModel.reset();
    console.log(this.userModel.controls);
  }

  handleDeleteUser(userToDelete: users ){
  if(userToDelete && confirm(`¿Está seguro que desea eliminar el usuario ${userToDelete.nombres + ' ' + userToDelete.apellidos}`)){
    this.userService.deleteUser(userToDelete);
    this.notifier.showSucessToast(`Se ha eliminado el usuario con id: ${userToDelete.id}`,'', 3000, false)
    console.log("Se elimina usuario con id: ", userToDelete.id)
    }
  }

  handleUpdateUser(originalUser: users){

    const {id, ...rest} = originalUser;
    const userUpdatedInForm = {...rest};

    if(!this.showForm){
      this.userModel.setValue(userUpdatedInForm);
      this.showFormChange.emit();
    }else if (this.showForm && this.userModel.status === 'INVALID'){
      this.userModel.setValue(userUpdatedInForm);
    }else{
      const userToUpdate = this.userList.find((user) => user.id === id);
      if(userToUpdate && this.userModel.status === 'VALID'){

        const updatedUser = {nombres: this.userModel.value.nombres || '',
        apellidos: this.userModel.value.apellidos || '',
        usuario: this.userModel.value.usuario || '',
        edad: this.userModel.value.edad || 18,
        correo: this.userModel.value.correo || '',
        password: this.userModel.value.password || ''}
        this.userService.updateUser({id: id, ...updatedUser});
 

        // Object.keys(this.userModel.controls).forEach( key => {
        //   console.log(key);
        //   this.userModel.get(key)?.markAsUntouched;
        //   if(key === 'edad'){
        //     this.userModel.get(key)?.setValue(0)
        //   }else{
        //     this.userModel.get(key)?.setValue('')
        //   }
        // })
    
        this.userModel.reset();

        this.showFormChange.emit();
        this.notifier.showSucess('',`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
        // alert(`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
      }else{
        this.userModel.markAllAsTouched;
      }
    }
  }

}
