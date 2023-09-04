import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { enrollments, userRol } from 'src/app/usuarios/modelos';
import { Observable, takeUntil, Subject, Subscription, BehaviorSubject, take } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { InscripcionesService } from './inscripciones.service';
import { Store } from '@ngrx/store';
import { inscripcionesActions } from 'src/app/store/actions/inscripciones.actions';
// import { selectEnrollmentList, selectEnrollmentListValue } from 'src/app/store/selectors/inscripciones.selectors';
import { selectAuthUserValue } from 'src/app/store/selectors/auth.selectors';
import { InscripcionesActions } from './store/inscripciones.actions';
import { selectEnrollmentListValue } from './store/inscripciones.selectors';

interface EnrollmentModel {
  courseId: FormControl<number| null>;
  userId: FormControl<number | null>;
  // profesor: FormControl<string | null>;
}

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent implements OnInit, OnDestroy {

  enrollmentModel : FormGroup<EnrollmentModel> = this.formBuilder.group({
      courseId: [0, [Validators.required]],
      userId: [0, [Validators.required]],
      // profesor: ['', [Validators.required, Validators.minLength(minCharUserLength)]],
      })
  
  enrollmentList: Observable<enrollments[]>;

  // userListObserver: Observable<teachers[]>;
  courseListSubscription?: Subscription;
  destroyed = new Subject<boolean>(); 
  showDetails: boolean = false;
  isLoading$: Observable<boolean>;
  editionNote: string = '';

  userRol: userRol = null;

  @Input()
  ingreso: boolean = false;

  // @Input()
  showForm: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private enrollmentService: InscripcionesService, private notifier: NotifierService, private store: Store){
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
    this.enrollmentList = this.store.select(selectEnrollmentListValue);
    this.enrollmentList.pipe(takeUntil(this.destroyed)).subscribe({
      next: (enrollmentList) => {
        console.log('EnrollmentList: ', enrollmentList)

      }
    })
    
    this.store.select(selectAuthUserValue).pipe(take(1)).subscribe({
      next: (authUser) => {
        if(authUser){
          this.userRol = authUser?.role
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

  handleChangeView(event: Event){
    event.preventDefault();
    this.ingresoChange.emit(!this.ingreso)
    this.changeView.emit(event);
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
    const newEnrollment = {
      id: new Date().getTime(),
      courseId: this.enrollmentModel.value.courseId || 0,
      userId: this.enrollmentModel.value.userId || 0,
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

  async handleDeleteEnrollment(enrollmentToDelete: enrollments ){
    let confirmModal = this.notifier.getConfirm('',`¿Está seguro que desea eliminar la inscripción ${enrollmentToDelete.id}?`, 'warning');
    let confirmation = await confirmModal.fire();
    
    if(enrollmentToDelete && confirmation.isConfirmed){
      // this.enrollmentService.deleteEnrollment(enrollmentToDelete);
      this.store.dispatch(inscripcionesActions.delete({enrollmentToDelete}))
      this.notifier.showSuccessToast(`Se ha eliminado la inscripción con id: ${enrollmentToDelete.id}`,'', 3000, false)
      console.log("Se elimina inscripción con id: ", enrollmentToDelete.id)
      }
  }

  handleUpdateEnrollment(originalEnrollment: enrollments){

      console.log('Inscripción: ', originalEnrollment);
      const {id, ...rest} = originalEnrollment;
      const enrollmentUpdatedInForm = {...rest};
      this.editionNote = 'Recuerde, pare editar seleccionar nuevamente el lápiz.'

      if(!this.showForm){
        this.enrollmentModel.setValue(enrollmentUpdatedInForm);
        this.showForm = !this.showForm;
        // this.showFormChange.emit();
      }else if (this.showForm && this.enrollmentModel.status === 'INVALID'){
        this.enrollmentModel.setValue(enrollmentUpdatedInForm);
      }else{
        let enrollmentToUpdate: enrollments | undefined;
        this.enrollmentList.pipe(take(1)).subscribe({
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
