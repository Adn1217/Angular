import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Desafio3';
  ingreso: boolean = true;

  onChangeView(event: Event){
    // alert("Se ha cambiado la vista")
    // console.log("Recibido en padre: ", event);
    console.log("Se ha cambiado la vista");
  }
}
