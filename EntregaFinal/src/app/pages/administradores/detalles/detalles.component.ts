import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { teachers, users } from 'src/app/usuarios/modelos';
import { UserService } from 'src/app/usuarios/user.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent {

  adminDetails$?: Observable<users | teachers | undefined>
  adminId: string
  userType: string

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute ){
    this.adminId = this.activatedRoute.snapshot.params['id'];
    this.userType = this.activatedRoute.snapshot.queryParams['userType'];
    // console.log(`userType: ${this.userType} - adminId: ${this.adminId}`)
    
    if (this.userType === 'teacher'){
      this.adminDetails$ = this.userService.getTeacherById(this.adminId);
    }else if (this.userType === 'user'){
      this.adminDetails$ = this.userService.getUserById(this.adminId);
    }
  }
}
