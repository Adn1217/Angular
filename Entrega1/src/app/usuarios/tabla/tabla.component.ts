import {Component} from '@angular/core';
import { users } from '../modelos';


const USER_DATA = [
  {id: 1, nombres: 'Adrian Alberto', apellidos: "Fernández Cabrera", edad: 32, correo: "adn1217@hotmail.com"},
  {id: 2, nombres: 'Alejandra Paola', apellidos: "Fernández Castro", edad: 31, correo: "alufndz_@gmail.com"},
  {id: 3, nombres: 'Rupertico Adolfo', apellidos: "Herrera Gonzalez", edad: 32, correo: "raherreraG@gmail.com"},
];

@Component({
  selector: 'app-tabla',
  styleUrls: ['./tabla.component.css'],
  templateUrl: './tabla.component.html',
})

export class TablaComponent {

  dataSource: users[] = USER_DATA;
  displayedColumns: string[] = ['id', 'nombre completo', 'edad', 'correo', 'acciones'];
}
