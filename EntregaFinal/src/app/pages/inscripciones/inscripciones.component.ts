import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { courses, enrollments, enrollmentsWithCourseAndUser, userRol, users } from 'src/app/usuarios/modelos';
import { Observable, takeUntil, Subject, Subscription, BehaviorSubject, take } from 'rxjs';
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
  
  constructor(private formBuilder: FormBuilder, private enrollmentService: InscripcionesService, private notifier: NotifierService, private store: Store, private userService: UserService, private router: Router){
    this.isLoading$ = this.enrollmentService.isLoading$;
    // this.enrollmentList = this.enrollmentService.getEnrollments().pipe(takeUntil(this.destroyed)) // TakeUntil no es necesario con pipe async.
    // this.userList = this.userListObserver;
    // this.enrollmentList.subscribe({
    //   next: (enrollments) => {
    //     console.log('Inscripciones: ', enrollments);
    //   }
    // })

    // this.store.select(selectEnrollmentList).pipe(take(1)).subscribe({
    //   next: (enrollmentList) => {
    //     console.log('EnrollmentList: ', enrollmentList)
    //   }
    // })
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
    console.log('FormModel: ',this.enrollmentModel.valid)
    this.enrollmentList$ = this.store.select(selectEnrollmentListValue);
    this.enrollmentList$.pipe(takeUntil(this.destroyed)).subscribe({
      next: (enrollmentList) => {
        console.log('EnrollmentList: ', enrollmentList)
      }
    })
    
    this.usersList$ = this.store.select(selectUsersListValue);
    this.usersList$.pipe(take(1)).subscribe({
      next: (usersList) => {
        console.log('usersList: ', usersList)
      }
    })
    
    this.coursesList$ = this.store.select(selectCoursesListValue);
    this.coursesList$.pipe(take(1)).subscribe({
      next: (coursesList) => {
        console.log('coursesList: ', coursesList)
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

  ngOnInit(): void {
    this.store.dispatch(InscripcionesActions.loadInscripciones())
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
    console.log('Usuario elegido: ', userSelected);
    let id: number | undefined = 0;
    this.usersList$.subscribe({
      next: (userList) => {
        userList.map((user) => {
          if(user.nombres === userSelected){
            id = user.id 
            this.enrollmentModel.controls.userId.setValue(id);
          }
        })
      }
    })
    console.log('FormModel: ',this.enrollmentModel.getRawValue())
  }
  
  courseIdChange(courseSelected: string | null){
    console.log('Curso elegido: ', courseSelected);
    let id: number | undefined = 0;
    this.coursesList$.subscribe({
      next: (courseList) => {
        courseList.map((course) => {
          if(course.curso === courseSelected){
            id = course.id 
            this.enrollmentModel.controls.courseId.setValue(id);
            // this.enrollmentModel.patchValue({courseId: id})
          }
        })
      }
    })
    console.log('FormModel: ',this.enrollmentModel.getRawValue())
  }

  handleShowForm(event: Event){
    this.showForm = !this.showForm
    this.store.dispatch(InscripcionesActions.loadUsers());
    this.store.dispatch(InscripcionesActions.loadCourses());
  }

  getFieldControl(field: string): FormControl {
    return this.enrollmentModel.get(field) as FormControl
  }

  getFieldError(field: string): string {
    const fieldControl = this.getFieldControl(field);
    const error = fieldControl.errors || {};
    if(error["required"]){
      return "El campo es necesario"
    }else{
      //  const min = error['min'] || {};
      //  const max = error['max'] || {};
      //  const lackCred =  min.actual - min.min;
      //  const extraCred =  max.actual - max.max;
      //  if (lackCred < 0){
      //   return `El mínimo de créditos es ${minCreditNumber}`
      // }else if (extraCred > 0){
      //   return `El máximo de créditos es ${maxCreditNumber}`
      // }else{
        return `${JSON.stringify(error)}`
      // }
    }
  }
  
  handleSubmit(event: Event){
   
    // this.showFormChange.emit();
    this.showForm = !this.showForm;
    console.log('Modelo: ', this.enrollmentModel.value)
    const newEnrollment = {
      id: new Date().getTime(),
      courseId: this.enrollmentModel.getRawValue().courseId || 0,
      userId: this.enrollmentModel.getRawValue().userId || 0,
      // profesor: this.userModel.value.edad || 18,
    }

    this.enrollmentService.createEnrollment(newEnrollment);
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
      this.enrollmentService.deleteEnrollment(enrollmentToDelete);
      this.store.dispatch(inscripcionesActions.delete({enrollmentToDelete}))
      this.notifier.showSuccessToast(`Se ha eliminado la inscripción con id: ${enrollmentToDelete.id}`,'', 3000, false)
      console.log("Se elimina inscripción con id: ", enrollmentToDelete.id)
      }
  }

  handleUpdateEnrollment(originalEnrollment: enrollmentsWithCourseAndUser){

      this.store.dispatch(InscripcionesActions.loadUsers());
      this.store.dispatch(InscripcionesActions.loadCourses());
      console.log('Inscripción: ', originalEnrollment);
      const {id, ...rest} = originalEnrollment;
      const enrollmentUpdatedInForm = {...rest, user: originalEnrollment.user.nombres, course: originalEnrollment.course.curso};
      this.editionNote = 'Recuerde, pare editar seleccionar nuevamente el lápiz.'

      if(!this.showForm){
        this.enrollmentModel.setValue(enrollmentUpdatedInForm);
        this.showForm = !this.showForm;
        // this.showFormChange.emit();
      }else if (this.showForm && this.enrollmentModel.status === 'INVALID'){
        this.enrollmentModel.setValue(enrollmentUpdatedInForm);
      }else{
        let enrollmentToUpdate: enrollments | undefined;
        this.enrollmentList$.pipe(take(1)).subscribe({
          next: (enrollments) => {
            enrollmentToUpdate = enrollments.find((enrollment) => enrollment.id === id);
          }
        })
        // const userToUpdate = this.userList.find((user) => user.id === id);
        if(enrollmentToUpdate && this.enrollmentModel.status === 'VALID'){

          const updatedEnrollment = {
            courseId: this.enrollmentModel.value.courseId || 0,
            userId: this.enrollmentModel.value.userId || 0,
          // profesor: this.courseModel.value.usuario || '',
          }
          this.enrollmentService.updateEnrollment({id: id, ...updatedEnrollment});

          this.enrollmentModel.reset();
          this.editionNote = ''

          this.showForm = !this.showForm;
          // this.showFormChange.emit();
          this.notifier.showSuccess('',`Se ha actualizado la inscripción con id: ${enrollmentToUpdate.id}`)
          // alert(`Se ha actualizado el usuario con id: ${userToUpdate.id}`)
        }else{
          this.enrollmentModel.markAllAsTouched;
        }
      }
  }
}
