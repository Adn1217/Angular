import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Desafio2';
  estudentFontSize = 16;
  estudiante = [{
    nombre: "Alan",
    nota: 2.8
  },{
    nombre: "Ruben",
    nota: 3.1
  },
  {
    nombre: "Josefina",
    nota: 4.2
  },
  {
    nombre: "Melquiades",
    nota: 4.0
  }];
}
