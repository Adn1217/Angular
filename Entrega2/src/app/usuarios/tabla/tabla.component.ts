import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { users, teachers } from '../modelos';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tabla',
  styleUrls: ['./tabla.component.css'],
  templateUrl: './tabla.component.html',
})

export class TablaComponent implements OnChanges {

  constructor(private router: Router ){}

  displayedColumns: string[] = ['id', 'nombre completo', 'edad', 'correo', 'acciones'];

  @Input()
  showDetails: boolean = false;

  @Input()
  dataSource: users[] | teachers[] = [];

  @Input()
  title: string = '';

  @Output()
  deleteUser = new EventEmitter<users | teachers>();

  @Output()
  updateUser = new EventEmitter<users | teachers>();

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
  
  handleUpdateUser(user: users | teachers){
    this.updateUser.emit(user);
  }

  ngOnChanges(){
    if(this.title === 'Profesores'){
      this.displayedColumns = ['id', 'nombre completo', 'edad', 'correo', 'nivel académico', 'materias', 'acciones'];
    }
  }

}
