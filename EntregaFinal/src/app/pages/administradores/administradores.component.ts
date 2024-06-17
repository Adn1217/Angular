import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, combineLatest, concat, forkJoin, map, merge, mergeMap, skip, take, takeUntil } from 'rxjs';
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
  nivelAcademico?: FormControl<string | null >;
  materias?: FormControl<string[] | null >;
  correo: FormControl<string | null>;
  password: FormControl<string | null>;
  role: FormControl<userRol>;
}

type userTypes = 'user' | 'teacher'
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
    nivelAcademico: new FormControl(null),
    materias: new FormControl(null),
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(minCharPwdLength)]],
    role: ['user' as userRol, [Validators.required]],
    }) as FormGroup<AdminModel> // Cast para poder inicializar campos opcionales.

  completeList: Array<users | teachers> = []
  completeListObserver$: Observable<(users | teachers)[]>;
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
  showTypeUserSelector: boolean = false;
  typeUserSelection: userTypes = 'user';

  selectedId: string | null = null;
  
  constructor(private formBuilder: FormBuilder, private userService: UserService, private notifier: NotifierService, private store: Store, private router: Router){

    this.isLoading$ = this.userService.isLoading$;
    this.userListObserver$ = userService.getUsers().pipe(takeUntil(this.destroyed));
    this.teacherListObserver$ = userService.getTeachers().pipe(takeUntil(this.destroyed));
    // this.completeListObserver$ = forkJoin<[users[], teachers[]]>([this.userListObserver$, this.teacherListObserver$]).pipe(
    //   map((newList) => {
    //     // console.log('New List: ', newList)
    //     return [...newList[0],...newList[1]]
    //   } )
    //   ) // NO actualiza para creación de nuevos usuarios/profesores.

    this.completeListObserver$ = combineLatest([this.userListObserver$, this.teacherListObserver$]).pipe(
      map((newList) => {
      // console.log('New List: ', newList)
      return [...newList[0],...newList[1]]
      } ));
    // this.completeListObserver$.subscribe({
    //   next: (userList) => {
    //     // console.log('Lista completa: ', userList);
    //     this.completeList = [];
    //   },
    //   complete: () => {
    //     // console.log('Complete');
    //     this.completeList = [];
    //   }
    // })


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
    this.showTypeUserSelector = false;
  }

  handleAddButton(){
    this.toggleShowForm();
    this.showTypeUserSelector = true;
  }

  handleUserTypeSelection(value: string){
    this.typeUserSelection = value as userTypes;
    // console.log('Tipo de usuario seleccionado: ', this.typeUserSelection);
  }

  handleSubmit(event: Event){
   
    // this.showFormChange.emit();
    this.toggleShowForm();
    let newUser = {
      id: new Date().getTime().toString(),
      nombres: this.userModel.value.nombres || '',
      apellidos: this.userModel.value.apellidos || '',
      usuario: this.userModel.value.usuario || '',
      edad: this.userModel.value.edad || 18,
      correo: this.userModel.value.correo || '',
      password: this.userModel.value.password || '',
      role: this.userModel.value.role || 'user' as const
    }

    if(this.typeUserSelection === 'teacher'){
      newUser = {...newUser, 
        ...{
          nivelAcademico: this.userModel.value.nivelAcademico || '',
          materias: [this.userModel.value.materias] || ['']
        }
      }
    }
    // console.log('newUser ', newUser);
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

  handleUpdateUser(originalUser: users | teachers){

    const { id, ...rest } = originalUser
    const userUpdatedInForm = rest;
    let isTeacher: boolean = false

    this.editionNote = 'Recuerde, para editar seleccionar nuevamente el lápiz.'

    if(!this.showForm){
      this.userModel.setValue({
        nivelAcademico: null, 
        materias: null,
        ...userUpdatedInForm});
      this.showForm = !this.showForm;
      // this.showFormChange.emit();
    }else if (this.showForm && this.userModel.status === 'INVALID'){
      this.userModel.setValue({
        nivelAcademico: null, 
        materias: null,
        ...userUpdatedInForm});
    }else{
      let userToUpdate: users | teachers | undefined;
      // console.log('userUpdatedInForm: ', userUpdatedInForm)
      if ('nivelAcademico' in userUpdatedInForm){
        isTeacher = true;
        this.teacherListObserver$.subscribe({
          next: (users) => {
            userToUpdate = users.find((user) => user.id === id);
          }
        })
      }else{
        this.userListObserver$.subscribe({ 
          next: (users) => {
            userToUpdate = users.find((user) => user.id === id);
          }
        })
      }
      // const userToUpdate = this.userList.find((user) => user.id === id);
      if(userToUpdate && this.userModel.status === 'VALID'){

        let updatedUser = {
          nombres: this.userModel.value.nombres || '',
          apellidos: this.userModel.value.apellidos || '',
          usuario: this.userModel.value.usuario || '',
          edad: this.userModel.value.edad || 18,
          correo: this.userModel.value.correo || '  ',
          password: this.userModel.value.password || '',
          role: this.userModel.value.role || 'user' as const
        }

        if(isTeacher){
          updatedUser = {...updatedUser, 
            ...{ 
              nivelAcademico: this.userModel.value.nivelAcademico, 
              materias: [this.userModel.value.materias]
            }
          }
        }
        // console.log('updatedUser: ', {id: id, ...updatedUser})
        this.userService.updateUser({id: id, ...updatedUser});
 
        this.userModel.reset();
        this.editionNote = '';
        this.showForm = !this.showForm;
        // this.showFormChange.emit();
        this.notifier.showSuccess('',`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
        // alert(`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
      }else if (!userToUpdate){
        this.notifier.showError('',`No se ha encontrado el usuario con id: ${id}`)
      }else{
        this.userModel.markAllAsTouched;
      }
    }
  }


}
