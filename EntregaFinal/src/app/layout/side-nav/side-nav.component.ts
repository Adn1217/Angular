import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { authActions } from 'src/app/store/actions/auth.actions';
import { selectAuthUserValue } from 'src/app/store/selectors/auth.selectors';
import { users } from 'src/app/usuarios/modelos';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {

  authUser$: Observable<users | null> = this.store.select(selectAuthUserValue)
  // public activatedRoute$: Observable<UrlSegment[]> = this.activatedRoute.url;

  constructor(private store: Store, private router: Router ){
  }
  
  @Input()
  sideBarOpen: boolean = false;

  handleLogout(){
    this.router.navigate(['/login']); 
    this.store.dispatch(authActions.logoutAuthUser());
  }

}
