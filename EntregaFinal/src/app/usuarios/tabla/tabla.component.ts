import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { users, teachers, courses, enrollments, userRol } from '../modelos';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthUserValue } from 'src/app/store/selectors/auth.selectors';



@Component({
  selector: 'app-tabla',
  styleUrls: ['./tabla.component.css'],
  templateUrl: './tabla.component.html',
})

export class TablaComponent implements OnChanges {

  constructor(private router: Router, private store: Store){

    this.store.select(selectAuthUserValue).subscribe({
      next: (authUser) => {
        if(authUser){
          this.userRol = authUser?.role
        }
      }
    })
  }

  displayedColumns: string[] = ['id', 'nombre completo', 'edad', 'correo', 'rol', 'acciones'];

  userRol: userRol = null


  @Input()
  showDetails: boolean = false;

  @Input()
  dataSource: users[] | teachers[] | courses[] | enrollments[] | any[] = [];

  @Input()
  title: string = '';

  @Output()
  deleteUser = new EventEmitter<users | teachers>();

  @Output()
  updateUser = new EventEmitter<users | teachers>();
  
  @Output()
  deleteCourse = new EventEmitter<courses>();

  @Output()
  updateCourse = new EventEmitter<courses>();
  
  @Output()
  updateEnrollment = new EventEmitter<enrollments>();
  
  @Output()
  deleteEnrollment = new EventEmitter<enrollments>();

  @Output()
  showDetailsChange = new EventEmitter<boolean>();

  handleShowDetails(){
    console.log("ShowDetails: ", this.showDetails);
    this.showDetails = !this.showDetails;
    this.showDetailsChange.emit(this.showDetails);
  }

  handleDeleteUser(user: users | teachers){
    this.deleteUser.emit(user);
  }
  
  handleUpdate(entity: users | teachers | courses | enrollments ){
    if('courseId' in entity){
      this.handleUpdateEnrollment(entity);
    }else if ('curso' in entity){
      this.handleUpdateCourse(entity);
    }else {
      this.handleUpdateUser(entity)
    }
  }
  
  handleDelete(entity: users | teachers | courses | enrollments ){
    if('courseId' in entity){
      this.handleDeleteEnrollment(entity);
    }else if ('curso' in entity){
      this.handleDeleteCourse(entity);
    }else {
      this.handleDeleteUser(entity)
    }
  }
  
  handleUpdateUser(user: users | teachers){
    this.updateUser.emit(user);
  }
  
  handleDeleteCourse(course: courses){
    this.deleteCourse.emit(course);
  }
  
  handleUpdateCourse(course: courses){
    this.updateCourse.emit(course);
  }
  
  handleUpdateEnrollment(enrollment: enrollments){
    this.updateEnrollment.emit(enrollment);
  }
  
  handleDeleteEnrollment(enrollment: enrollments){
    this.deleteEnrollment.emit(enrollment);
  }

  ngOnChanges(){
    console.log(this.dataSource);
    if(this.title === 'Profesores'){
      this.displayedColumns = ['id', 'nombre completo', 'edad', 'correo', 'nivel académico', 'materias', 'rol', 'acciones'];
    }else if (this.title === 'Cursos'){
      this.displayedColumns = ['id', 'Curso', 'Créditos', 'acciones'];
    }else if (this.title === 'Inscripciones'){
      this.displayedColumns = ['id', 'idCurso', 'idAlumno', 'acciones'];
    }
  }

}
