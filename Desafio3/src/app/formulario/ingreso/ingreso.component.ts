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

handleChangeView(event: Event){
  event.preventDefault();
  this.ingresoChange.emit(!this.ingreso)
  this.changeView.emit(event);
}

}
