import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Entrega 1';
  ingreso: boolean = true;
  sideBarOpen = false;
  showForm = false;

  onChangeView(event: Event){
    this.showForm = false;
  }
  
  toggleSideBar(flag: boolean){
    this.sideBarOpen = flag;
  }

  handleFormView(event: Event){
    this.showForm = !this.showForm;
  }
}
