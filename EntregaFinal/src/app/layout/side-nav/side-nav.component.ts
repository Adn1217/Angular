import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from 'src/app/store/actions/auth.actions';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {

  constructor(private store: Store, private router: Router){

  }
  
  @Input()
  sideBarOpen: boolean = false;

  handleLogout(){
    this.router.navigate(['/login']); 
    this.store.dispatch(authActions.logoutAuthUser());
  }

}
