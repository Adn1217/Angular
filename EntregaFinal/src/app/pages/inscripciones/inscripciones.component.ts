import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { courses, enrollments, enrollmentsWithCourseAndUser, userRol, users } from 'src/app/usuarios/modelos';
import { Observable, takeUntil, Subject, Subscription, BehaviorSubject, take, skip } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { InscripcionesService } from './inscripciones.service';
import { Store } from '@ngrx/store';
import { inscripcionesActions } from 'src/app/store/actions/inscripciones.actions';
// import { selectEnrollmentList, selectEnrollmentListValue } from 'src/app/store/selectors/inscripciones.selectors';
import { selectAuthUserValue } from 'src/app/store/selectors/auth.selectors';
import { InscripcionesActions } from './store/inscripciones.actions';
import { selectCoursesListValue, selectEnrollmentListValue, selectUsersListValue } from './store/inscripciones.selectors';
import { UserService } from 'src/app/usuarios/user.service';
import { authActions } from 'src/app/store/actions/auth.actions';
import { Router } from '@angular/router';
import { Actions } from '@ngrx/effects';

interface EnrollmentModel {
  courseId: FormControl<number| null>;
  userId: FormControl<number | null>;
  user: FormControl<string | null>;
  course: FormControl<string | null>;
  // profesor: FormControl<string | null>;
}

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent implements OnInit, OnDestroy {

  enrollmentModel : FormGroup<EnrollmentModel> = this.formBuilder.group({
      courseId: [{value:0, disabled:true}, [Validators.required]],
      userId: [{value: 0, disabled: true}, [Validators.required]],
      course: ['', [Validators.required]],
      user: ['', [Validators.required]]
      // profesor: ['', [Validators.required, Validators.minLength(minCharUserLength)]],
      })
  
  enrollmentList$: Observable<enrollments[]>;
  usersList$: Observable<users[]>;
  coursesList$: Observable<courses[]>;

  // userListObserver: Observable<teachers[]>;
  courseListSubscription?: Subscription;
  destroyed = new Subject<boolean>(); 
  showDetails: boolean = false;
  isLoading$: Observable<boolean>;
  editionNote: string = '';
  userChanges: Subscription;
  courseChanges: Subscription;
  userRol: userRol = null;

  @Input()
  ingreso: boolean = false;

  // @Input()
  showForm: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private enrollmentService: InscripcionesService, private notifier: NotifierService, private store: Store, private userService: UserService, private router: Router, private actions$: Actions){
    this.isLoading$ = this.enrollmentService.isLoading$;
    // this.store.dispatch(InscripcionesActions.loadInscripciones())
    this.userChanges = this.enrollmentModel.controls.user.valueChanges.subscribe({
      next: (userSelected) => {
        this.userIdChange(userSelected);
      }
    })
    this.courseChanges = this.enrollmentModel.controls.course.valueChanges.subscribe({
      next: (courseSelected) => {
        this.courseIdChange(courseSelected);
      }
    })
    this.enrollmentList$ = this.store.select(selectEnrollmentListValue);
    this.enrollmentList$.subscribe({})
    
    this.usersList$ = this.store.select(selectUsersListValue);
    this.usersList$.pipe(take(1)).subscribe()
    
    this.coursesList$ = this.store.select(selectCoursesListValue);
    this.coursesList$.pipe(take(1)).subscribe()

    this.actions$.subscribe((action) => {
      if(!action.type.includes('Success')){
        console.log(`------------------------------`);
        console.log(`Acción '${action.type}' disparada: \n`, action);
      }else if (action.type.includes('Failure')){
        console.error(`Acción '${action.type}' disparada: \n`, action);
      }else{
        console.log(`Acción '${action.type}' disparada: \n`, action);
      }
    });
   

  }

  ngOnInit(): void {
    this.store.dispatch(InscripcionesActions.loadInscripciones())    
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
            regUser.pipe(take(1)).subscribe({
              next: (regUser) => {
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

  userIdChange(userSelected: string | null){
    let id: number | undefined = 0;
    this.usersList$.pipe(take(1)).subscribe({
      next: (userList) => {
        userList.map((user) => {
          if(user.nombres === userSelected){
            id = user.id 
            this.enrollmentModel.controls.userId.setValue(id);
          }
        })
      }
    })
  }
  
  courseIdChange(courseSelected: string | null){
    let id: number | undefined = 0;
    this.coursesList$.pipe(take(1)).subscribe({
      next: (courseList) => {
        courseList.map((course) => {
          if(course.curso === courseSelected){
            id = course.id 
            this.enrollmentModel.controls.courseId.setValue(id);
          }
        })
      }
    })
  }

  handleShowForm(event: Event){
    this.showForm = !this.showForm
    this.store.dispatch(InscripcionesActions.loadUsers());
    this.store.dispatch(InscripcionesActions.loadCourses());
  }

  handleSubmit(event: Event){
   
    this.showForm = !this.showForm;
    const newEnrollment = {
      id: new Date().getTime(),
      courseId: this.enrollmentModel.getRawValue().courseId || 0,
      userId: this.enrollmentModel.getRawValue().userId || 0,
    }

    this.store.dispatch(InscripcionesActions.createInscripcion({enrollment: newEnrollment}));
    this.enrollmentModel.reset();
  }

  handleCancel(event: Event){
    this.enrollmentModel.reset();
    this.editionNote = ''
    this.showForm = false;
  }

  async handleDeleteEnrollment(enrollmentToDelete: enrollmentsWithCourseAndUser ){
    let confirmModal = this.notifier.getConfirm('',`¿Está seguro que desea eliminar la inscripción ${enrollmentToDelete.id}?`, 'warning');
    let confirmation = await confirmModal.fire();
    
    if(enrollmentToDelete && confirmation.isConfirmed){
      this.store.dispatch(InscripcionesActions.deleteInscripcion({enrollment: enrollmentToDelete}));
      this.notifier.showSuccessToast(`Se ha eliminado la inscripción con id: ${enrollmentToDelete.id}`,'', 3000, false)
      console.log("Se elimina inscripción con id: ", enrollmentToDelete.id)
      }
  }

  handleUpdateEnrollment(originalEnrollment: enrollmentsWithCourseAndUser){

      this.store.dispatch(InscripcionesActions.loadUsers());
      this.store.dispatch(InscripcionesActions.loadCourses());
      // console.log('Inscripción: ', originalEnrollment);
      const {id, ...rest} = originalEnrollment;
      const enrollmentUpdatedInForm = {...rest, user: originalEnrollment.user.nombres, course: originalEnrollment.course.curso};
      this.editionNote = 'Recuerde, pare editar seleccionar nuevamente el lápiz.'

      if(!this.showForm){
        this.enrollmentModel.setValue(enrollmentUpdatedInForm);
        this.showForm = !this.showForm;
      }else if (this.showForm && this.enrollmentModel.status === 'INVALID'){
        this.enrollmentModel.setValue(enrollmentUpdatedInForm);
      }else{
        let enrollmentToUpdate: enrollments | undefined;
        this.enrollmentList$.pipe(take(1)).subscribe({
          next: (enrollments) => {
            enrollmentToUpdate = enrollments.find((enrollment) => enrollment.id === id);
          }
        })
        if(enrollmentToUpdate && this.enrollmentModel.status === 'VALID'){

          const updatedEnrollment = {
            id: id,
            courseId: this.enrollmentModel.getRawValue().courseId || 0,
            userId: this.enrollmentModel.getRawValue().userId || 0,
          }

          this.store.dispatch(InscripcionesActions.updateInscripcion({enrollment: updatedEnrollment}))
          this.enrollmentModel.reset();
          this.editionNote = ''

          this.showForm = !this.showForm;
          this.notifier.showSuccess('',`Se ha actualizado la inscripción con id: ${enrollmentToUpdate.id}`)
        }else{
          this.enrollmentModel.markAllAsTouched;
        }
      }
  }
}
