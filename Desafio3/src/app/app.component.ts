import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Desafio3';
  ingreso: boolean = true;

  onChangeView(ingreso: boolean, event: Event){
    alert("Se ha cambiado la vista")
    this.ingreso = ingreso;
    console.log('Ingreso recibido: ', ingreso);
    console.log("Evento: ", event)
  }
}
