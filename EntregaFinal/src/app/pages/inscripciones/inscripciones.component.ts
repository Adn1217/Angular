import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators  } from '@angular/forms';
import { enrollments } from 'src/app/usuarios/modelos';
import { Observable, takeUntil, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { Router } from '@angular/router';
import { InscripcionesService } from './inscripciones.service';

interface EnrollmentModel {
  idCurso: FormControl<number| null>;
  idAlumno: FormControl<number | null>;
  // profesor: FormControl<string | null>;
}

@Component({
  selector: 'app-inscripciones',
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css']
})
export class InscripcionesComponent {

  enrollmentModel : FormGroup<EnrollmentModel> = this.formBuilder.group({
      idCurso: [0, [Validators.required]],
      idAlumno: [0, [Validators.required]],
      // profesor: ['', [Validators.required, Validators.minLength(minCharUserLength)]],
      })
  
  enrollmentList: Observable<enrollments[]>;

  // userListObserver: Observable<teachers[]>;
  courseListSubscription?: Subscription;
  destroyed = new Subject<boolean>(); 
  showDetails: boolean = false;
  isLoading$: Observable<boolean>;
  editionNote: string = '';

  @Input()
  ingreso: boolean = false;

  // @Input()
  showForm: boolean = false;
  
  constructor(private formBuilder: FormBuilder, private enrollmentService: InscripcionesService, private notifier: NotifierService, public router: Router){
    this.isLoading$ = this.enrollmentService.isLoading$;
    this.enrollmentList = this.enrollmentService.getEnrollments().pipe(takeUntil(this.destroyed)) // TakeUntil no es necesario con pipe async.
    // this.userList = this.userListObserver;
    this.enrollmentList.subscribe({
      next: (enrollments) => {
        console.log('Inscripciones: ', enrollments);
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
  
  navigateTo(page: string){
    console.log(page);
    // this.router.navigate([`${page}`]);
  }

  handleSubmit(event: Event){
   
    // this.showFormChange.emit();
    this.showForm = !this.showForm;
    const newEnrollment = {
      id: new Date().getTime(),
      idCurso: this.enrollmentModel.value.idCurso || 0,
      idAlumno: this.enrollmentModel.value.idAlumno || 0,
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
      this.enrollmentService.deleteEnrollment(enrollmentToDelete);
      this.notifier.showSuccessToast(`Se ha eliminado la inscripción con id: ${enrollmentToDelete.id}`,'', 3000, false)
      console.log("Se elimina inscrición con id: ", enrollmentToDelete.id)
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
        this.enrollmentList.subscribe({
          next: (enrollments) => {
            enrollmentToUpdate = enrollments.find((enrollment) => enrollment.id === id);
          }
        })
        // const userToUpdate = this.userList.find((user) => user.id === id);
        if(enrollmentToUpdate && this.enrollmentModel.status === 'VALID'){

          const updatedEnrollment = {
            idCurso: this.enrollmentModel.value.idCurso || 0,
            idAlumno: this.enrollmentModel.value.idAlumno || 0,
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
