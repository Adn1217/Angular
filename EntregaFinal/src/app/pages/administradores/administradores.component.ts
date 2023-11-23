import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, concat, map, merge, mergeMap, take, takeUntil } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { authActions } from 'src/app/store/actions/auth.actions';
import { selectAuthUserValue } from 'src/app/store/selectors/auth.selectors';
import { teachers, userRol, users } from 'src/app/usuarios/modelos';
import { UserService } from 'src/app/usuarios/user.service';

const minCharPwdLength: number = 8;
const minCharUserLength: number = 5;
interface AdminModel {
  nombres: FormControl<string| null>;
  apellidos: FormControl<string | null>;
  usuario: FormControl<string | null>;
  edad: FormControl<number | null>;
  correo: FormControl<string | null>;
  password: FormControl<string | null>;
  role: FormControl<userRol>;
}
@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent {
  
  userModel : FormGroup<AdminModel> = this.formBuilder.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    usuario: ['', [Validators.required, Validators.minLength(minCharUserLength)]],
    edad: [0, [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(minCharPwdLength)]],
    role: ['user' as userRol, [Validators.required]],
    })

  completeList: Array<users | teachers> = []
  completeListObserver$: Observable<users[] | teachers[]>;
  userListObserver$: Observable<users[]>;
  completeListSubscription?: Subscription;
  teacherListObserver$: Observable<teachers[]>;
  teacherListSubscription?: Subscription;
  destroyed = new Subject<boolean>(); 
  isLoading$: Observable<boolean>;
  editionNote = ''
  
  userRol: userRol = null

  @Input()
  ingreso: boolean = false;

  // @Input()
  showForm: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private userService: UserService, private notifier: NotifierService, private store: Store, private router: Router){

    this.isLoading$ = this.userService.isLoading$;
    this.userListObserver$ = userService.getUsers().pipe(take(1));
    this.teacherListObserver$ = userService.getTeachers().pipe(take(1));
    this.completeListObserver$ = merge(this.userListObserver$, this.teacherListObserver$).pipe(
      take(2),
      map((newList) => { // TODO: Ajustar para correcta actualización al modificar información (update o delete).
        console.log('New List: ', newList)
        this.completeList = [...this.completeList, ...newList];
        return this.completeList;
      } )
      )
    this.completeListObserver$.subscribe({
      next: (userList) => {
        console.log('Lista completa: ', userList);
      },
      complete: () => {
        console.log('Complete');
        this.completeList = [];
      }
    })


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

  handleSubmit(event: Event){
   
    // this.showFormChange.emit();
    this.showForm = !this.showForm;
    const newUser = {
      id: new Date().getTime(),
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

    const {id, ...rest} = originalUser;
    const userUpdatedInForm = {...rest};
    this.editionNote = 'Recuerde, pare editar seleccionar nuevamente el lápiz.'

    if(!this.showForm){
      this.userModel.setValue(userUpdatedInForm);
      this.showForm = !this.showForm;
      // this.showFormChange.emit();
    }else if (this.showForm && this.userModel.status === 'INVALID'){
      this.userModel.setValue(userUpdatedInForm);
    }else{
      let userToUpdate: users | undefined;
      this.completeListObserver$.subscribe({
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
          correo: this.userModel.value.correo || '  ',
          password: this.userModel.value.password || '',
          role: 'user' as const
        }

        this.userService.updateUser({id: id, ...updatedUser});
 
        this.userModel.reset();
        this.editionNote = '';
        this.showForm = !this.showForm;
        // this.showFormChange.emit();
        this.notifier.showSuccess('',`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
        // alert(`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
      }else{
        this.userModel.markAllAsTouched;
      }
    }
  }


}
