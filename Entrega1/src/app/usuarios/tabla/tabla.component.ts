import {Component, Input} from '@angular/core';
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

}
