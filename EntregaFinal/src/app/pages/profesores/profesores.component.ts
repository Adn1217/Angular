
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { users, teachers, userRol } from 'src/app/usuarios/modelos';
import { UserService } from 'src/app/usuarios/user.service';
import { Observable, takeUntil, Subject, Subscription, BehaviorSubject } from 'rxjs';
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
  nivelAcademico: FormControl<string | null>;
  materias: FormControl<string[] | null >;
  correo: FormControl<string | null>;
  password: FormControl<string | null>
}
  
@Component({
  selector: 'app-registro',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})


export class ProfesoresComponent implements OnDestroy {

  userModel : FormGroup<RegisterModel> = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      usuario: ['', [Validators.required, Validators.minLength(minCharUserLength)]],
      edad: [0, [Validators.required]],
      nivelAcademico: ['', [Validators.required]],
      materias: [[''], [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(minCharPwdLength)]]
      })
  
  userList: Observable<teachers[]>;

  // userListObserver: Observable<teachers[]>;
  userListSubscription?: Subscription;
  destroyed = new Subject<boolean>(); 
  isLoading$: Observable<boolean>;
  editionNote: string = '';
  userRol: userRol = null

  @Input()
  ingreso: boolean = false;

  // @Input()
  showForm: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private userService: UserService, private notifier: NotifierService, private store: Store, private router: Router){
    this.isLoading$ = this.userService.isLoading$;
    this.userList = userService.getTeachers().pipe(takeUntil(this.destroyed)) // TakeUntil no es necesario con pipe async.
    // this.userList = this.userListObserver;
    
    this.store.select(selectAuthUserValue).pipe(takeUntil(this.destroyed)).subscribe({
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
  
  navigateTo(page: string){
    console.log(page);
    // this.router.navigate([`${page}`]);
  }

  handleSubmit(event: Event){
   
    // this.showFormChange.emit();
    this.showForm = !this.showForm;
    const newTeacher = {
      id: new Date().getTime(),
      nombres: this.userModel.value.nombres || '',
      apellidos: this.userModel.value.apellidos || '',
      usuario: this.userModel.value.usuario || '',
      edad: this.userModel.value.edad || 18,
      nivelAcademico: this.userModel.value.nivelAcademico || '',
      materias: this.userModel.value.materias || [''],
      correo: this.userModel.value.correo || '',
      password: this.userModel.value.password || '',
      role: 'user' as const
    }

    this.userService.createUser(newTeacher);
    this.userModel.reset();
  }
  
  handleCancel(event: Event){
    this.userModel.reset();
    this.editionNote = ''
    this.showForm = false;
  }

  async handleDeleteUser(userToDelete: users | teachers ){
    let confirmModal = this.notifier.getConfirm('',`¿Está seguro que desea eliminar el profesor ${userToDelete.nombres} ${userToDelete.apellidos}?`, 'warning');
    let confirmation = await confirmModal.fire();
    
    if(userToDelete && confirmation.isConfirmed){
      this.userService.deleteUser(userToDelete);
      // this.notifier.showSuccessToast(`Se ha eliminado el profesor con id: ${userToDelete.id}`,'', 3000, false)
      console.log("Se elimina profesor con id: ", userToDelete.id)
      }
  }

  handleUpdateUser(originalUser: users | teachers){

    if('nivelAcademico' in originalUser){ 
      // console.log('Profesor: ', originalUser);
      const {id, role, ...rest} = originalUser;
      const userUpdatedInForm = {...rest};
      this.editionNote = 'Recuerde, pare editar seleccionar nuevamente el lápiz.'

      if(!this.showForm){
        this.userModel.setValue(userUpdatedInForm);
        this.showForm = !this.showForm;
        // this.showFormChange.emit();
      }else if (this.showForm && this.userModel.status === 'INVALID'){
        this.userModel.setValue(userUpdatedInForm);
      }else{
        let userToUpdate: teachers | undefined;
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
            nivelAcademico: this.userModel.value.nivelAcademico || '',
            materias: this.userModel.value.materias || [''],
            correo: this.userModel.value.correo || '',
            password: this.userModel.value.password || '',
            role: 'user' as const
          }
          this.userService.updateUser({id: id, ...updatedUser});

          this.editionNote = '';
          this.userModel.reset();

          this.showForm = !this.showForm;
          // this.showFormChange.emit();
          this.notifier.showSuccess('',`Se ha actualizado el profesor con id: ${userToUpdate.id}`)
          // alert(`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
        }else{
          this.userModel.markAllAsTouched;
        }
      }
    }
  }
}

