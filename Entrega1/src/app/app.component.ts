import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Entrega 3';
  ingreso: boolean = true;
  sideBarOpen = false;

  @ViewChild("sideBarComponent") 
  drawer? : MatSidenavModule

  onChangeView(event: Event){
    // alert("Se ha cambiado la vista")
    // console.log("Evento recibido en padre: ", event);
    console.log("Se ha cambiado la vista");
  }
  
  toggleSideBar(flag: boolean){
    this.sideBarOpen = flag;
    console.log("SideBarOpen? ", flag);
  }


}
