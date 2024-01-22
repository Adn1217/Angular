import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { userRol, users } from 'src/app/usuarios/modelos';
import { UserService } from 'src/app/usuarios/user.service';
import { Observable, takeUntil, Subject, Subscription, BehaviorSubject, take } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { Store } from '@ngrx/store';
import { selectAuthUserValue } from 'src/app/store/selectors/auth.selectors';
import { authActions } from 'src/app/store/actions/auth.actions';
import { Router } from '@angular/router';


const minCharPwdLength: number = 8;
const minCharUserLength: number = 5;
interface RegisterModel {
  nombres: FormControl<string| null>;
  apellidos: FormControl<string | null>;
  usuario: FormControl<string | null>;
  edad: FormControl<number | null>;
  correo: FormControl<string | null>;
  password: FormControl<string | null>;
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
      password: ['', [Validators.required, Validators.minLength(minCharPwdLength)]],
      })
  
  userList: Observable<users[]>

  userListObserver: Observable<users[]>;
  userListSubscription?: Subscription;
  destroyed = new Subject<boolean>(); 
  isLoading$: Observable<boolean>;
  editionNote = ''
  
  userRol: userRol = null;

  selectedId: string | null = null;

  @Input()
  ingreso: boolean = false;

  // @Input()
  showForm: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private userService: UserService, private notifier: NotifierService, private store: Store, private router: Router){

    this.isLoading$ = this.userService.isLoading$;
    this.userListObserver = userService.getUsers().pipe(takeUntil(this.destroyed));
    this.userList = this.userListObserver; // Reemplaza la subscripcion al usar pipe async.

    this.store.select(selectAuthUserValue).pipe(take(1)).subscribe({
      next: (authUser) => {
        if(authUser){
          this.userRol = authUser?.role
        }else{
          const authUser = localStorage.getItem('AuthUser');
          const authUserJSON = authUser && JSON.parse(authUser);
          this.userRol = authUserJSON?.role;
          if(authUserJSON?.id){
            const regUser = this.userService.getUserById(authUserJSON.id);
            regUser.subscribe({
              next: (regUser) => {
                console.log('Usuario regUser: ', regUser);
                if(regUser){
                  this.store.dispatch(authActions.setAuthUser({authUser: regUser}))
                }else{
                  localStorage.removeItem('AuthUser') 
                  this.store.dispatch(authActions.logoutAuthUser())
                  this.router.navigate(['/login'])
                }
              }
            })
          }
        }
      }
    })
    }

  ngOnDestroy(): void {
    // this.userListSubscription.unsubscribe(); // Reemplazado por el takeUntil
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

  toggleShowForm(){
    this.showForm = !this.showForm;
  }
  
  handleSubmit(event: Event){
   
    // this.showFormChange.emit();
    this.toggleShowForm();
    const newUser = {
      id: new Date().getTime().toString(),
      nombres: this.userModel.value.nombres || '',
      apellidos: this.userModel.value.apellidos || '',
      usuario: this.userModel.value.usuario || '',
      edad: this.userModel.value.edad || 18,
      correo: this.userModel.value.correo || '',
      password: this.userModel.value.password || '',
      role: 'user' as const
    }

    this.userService.createUser(newUser);
    this.userModel.reset();
    // console.log(this.userModel.controls);
  }
  
  handleCancel(){
    this.toggleShowForm();
    this.userModel.reset();
    this.selectedId = null;
  }
  
  async handleDeleteUser(userToDelete: users ){
    let confirmModal = this.notifier.getConfirm('',`¿Está seguro que desea eliminar el usuario ${userToDelete.nombres} ${userToDelete.apellidos}?`, 'warning');
    let confirmation = await confirmModal.fire();
    
    if(userToDelete && confirmation.isConfirmed){
      this.userService.deleteUser(userToDelete);
      // this.notifier.showSuccessToast(`Se ha eliminado el profesor con id: ${userToDelete.id}`,'', 3000, false)
      console.log("Se elimina usuario con id: ", userToDelete.id)
      }
  }

  handleUpdateUser(originalUser: users){

    const {id, role, ...rest} = originalUser;
    const userUpdatedInForm = {...rest};
    this.editionNote = 'Recuerde, pare editar seleccionar nuevamente el lápiz.'

    if(!this.showForm){
      this.userModel.setValue(userUpdatedInForm);
      this.toggleShowForm();
      // this.showFormChange.emit();
    }else if (this.showForm && this.userModel.status === 'INVALID'){
      this.userModel.setValue(userUpdatedInForm);
    }else{
      let userToUpdate: users | undefined;
      this.userList.subscribe({
        next: (users) => {
          userToUpdate = users.find((user) => user.id === id);
        }
      })
      // const userToUpdate = this.userList.find((user) => user.id === id);
      if(userToUpdate && this.userModel.status === 'VALID'){

        const updatedUser = {
          nombres: this.userModel.value.nombres || '',
          apellidos: this.userModel.value.apellidos || '',
          usuario: this.userModel.value.usuario || '',
          edad: this.userModel.value.edad || 18,
          correo: this.userModel.value.correo || '',
          password: this.userModel.value.password || '',
          role: role || 'user' as const,
        }

        this.userService.updateUser({id: id, ...updatedUser});
 
        this.userModel.reset();
        this.editionNote = '';
        this.toggleShowForm();
        // this.showFormChange.emit();
        this.notifier.showSuccess('',`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
        // alert(`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
      }else{
        this.userModel.markAllAsTouched;
      }
    }
  }

}
