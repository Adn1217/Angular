import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { users, teachers } from '../modelos';



@Component({
  selector: 'app-tabla',
  styleUrls: ['./tabla.component.css'],
  templateUrl: './tabla.component.html',
})

export class TablaComponent implements OnChanges {

  displayedColumns: string[] = ['id', 'nombre completo', 'edad', 'correo', 'acciones'];

  @Input()
  dataSource: users[] | teachers[] = [];

  @Input()
  title: string = '';

  @Output()
  deleteUser = new EventEmitter<users | teachers>();

  @Output()
  updateUser = new EventEmitter<users | teachers>();

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
