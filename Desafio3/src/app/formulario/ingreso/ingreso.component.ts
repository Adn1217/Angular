import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})


export class IngresoComponent {
  
@Input() 
ingreso: boolean = true;

@Output()
changeView = new EventEmitter();

@Output()
ingresoChange = new EventEmitter();

handleChangeView(ingreso: boolean, event: Event){
  event.preventDefault();
  console.log("Ingreso recibido en hijo: ", ingreso);
  // this.ingresoChange.emit(!ingreso)
  this.changeView.emit(!ingreso);
}

}
