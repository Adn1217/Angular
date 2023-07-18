import {Component, Input, Output, EventEmitter} from '@angular/core';
import { users } from '../modelos';



@Component({
  selector: 'app-tabla',
  styleUrls: ['./tabla.component.css'],
  templateUrl: './tabla.component.html',
})

export class TablaComponent {

  displayedColumns: string[] = ['id', 'nombre completo', 'edad', 'correo', 'acciones'];

  @Input()
  dataSource: users[] = [];

  @Output()
  deleteUser = new EventEmitter<users>();

  @Output()
  updateUser = new EventEmitter<users>();

}
