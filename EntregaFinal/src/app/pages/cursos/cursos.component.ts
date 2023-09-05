import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { courses, userRol } from 'src/app/usuarios/modelos';
import { Observable, takeUntil, Subject, Subscription, BehaviorSubject, take, skip } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { Router } from '@angular/router';
import { CourseService } from './course.service';
import { Store } from '@ngrx/store';
import { selectAuthUserValue } from 'src/app/store/selectors/auth.selectors';
import { UserService } from 'src/app/usuarios/user.service';
import { authActions } from 'src/app/store/actions/auth.actions';


const minCreditNumber: number = 1;
const maxCreditNumber: number = 20;
interface CourseModel {
  curso: FormControl<string| null>;
  creditos: FormControl<number | null>;
  // profesor: FormControl<string | null>;
}

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent {

  courseModel : FormGroup<CourseModel> = this.formBuilder.group({
      curso: ['', [Validators.required]],
      creditos: [0, [Validators.required]],
      // profesor: ['', [Validators.required, Validators.minLength(minCharUserLength)]],
      })
  
  courseList: Observable<courses[]>;

  // userListObserver: Observable<teachers[]>;
  courseListSubscription?: Subscription;
  destroyed = new Subject<boolean>(); 
  showDetails: boolean = false;
  isLoading$: Observable<boolean>;
  editionNote: string = '';
  userRol: userRol = null

  @Input()
  ingreso: boolean = false;

  // @Input()
  showForm: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private courseService: CourseService, private notifier: NotifierService, public router: Router, private store: Store, private userService: UserService){
    this.isLoading$ = this.courseService.isLoading$;
    this.courseList = courseService.getCourses().pipe(takeUntil(this.destroyed)) // TakeUntil no es necesario con pipe async.
    // this.userList = this.userListObserver;
    // this.courseList.subscribe({
    //   next: (courses) => {
    //     console.log('Cursos: ', courses);
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
            const regUser$ = this.userService.getUserById(authUserJSON.id);
            regUser$.pipe(skip(1)).subscribe({
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
    return this.courseModel.get(field) as FormControl
  }

  getFieldError(field: string): string {
    const fieldControl = this.getFieldControl(field);
    const error = fieldControl.errors || {};
    if(error["required"]){
      return "El campo es necesario"
    }else{
       const min = error['min'] || {};
       const max = error['max'] || {};
       const lackCred =  min.actual - min.min;
       const extraCred =  max.actual - max.max;
       if (lackCred < 0){
        return `El mínimo de créditos es ${minCreditNumber}`
      }else if (extraCred > 0){
        return `El máximo de créditos es ${maxCreditNumber}`
      }else{
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
    const newCourse = {
      id: new Date().getTime(),
      curso: this.courseModel.value.curso || '',
      creditos: this.courseModel.value.creditos || 0,
      // profesor: this.userModel.value.edad || 18,
    }

    this.courseService.createCourse(newCourse);
    this.courseModel.reset();
  }

  handleCancel(event: Event){
    this.courseModel.reset();
    this.editionNote = ''
    this.showForm = false;
  }

  async handleDeleteCourse(courseToDelete: courses ){
    let confirmModal = this.notifier.getConfirm('',`¿Está seguro que desea eliminar el curso ${courseToDelete.curso}?`, 'warning');
    let confirmation = await confirmModal.fire();
    
    if(courseToDelete && confirmation.isConfirmed){
      this.courseService.deleteUser(courseToDelete);
      this.notifier.showSuccessToast(`Se ha eliminado el curso con id: ${courseToDelete.id}`,'', 3000, false)
      console.log("Se elimina curso con id: ", courseToDelete.id)
      }
  }

  handleUpdateCourse(originalCourse: courses){

      console.log('Curso: ', originalCourse);
      const {id, ...rest} = originalCourse;
      const courseUpdatedInForm = {...rest};
      this.editionNote = 'Recuerde, pare editar seleccionar nuevamente el lápiz.'

      if(!this.showForm){
        this.courseModel.setValue(courseUpdatedInForm);
        this.showForm = !this.showForm;
        // this.showFormChange.emit();
      }else if (this.showForm && this.courseModel.status === 'INVALID'){
        this.courseModel.setValue(courseUpdatedInForm);
      }else{
        let courseToUpdate: courses | undefined;
        this.courseList.pipe(take(1)).subscribe({
          next: (courses) => {
            courseToUpdate = courses.find((course) => course.id === id);
          }
        })
        // const userToUpdate = this.userList.find((user) => user.id === id);
        if(courseToUpdate && this.courseModel.status === 'VALID'){

          const updatedCourse = {
            curso: this.courseModel.value.curso || '',
            creditos: this.courseModel.value.creditos || 0,
          // profesor: this.courseModel.value.usuario || '',
          }
          this.courseService.updateUser({id: id, ...updatedCourse});

          this.courseModel.reset();
          this.editionNote = ''

          this.showForm = !this.showForm;
          // this.showFormChange.emit();
          this.notifier.showSuccess('',`Se ha actualizado el profesor con id: ${courseToUpdate.id}`)
          // alert(`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
        }else{
          this.courseModel.markAllAsTouched;
        }
      }
  }
}
