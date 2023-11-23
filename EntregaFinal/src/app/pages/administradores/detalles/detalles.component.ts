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

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute ){
    this.adminId = this.activatedRoute.snapshot.params['id'];
    this.adminDetails$ = this.userService.getTeacherById(this.adminId);
    this.adminDetails$.subscribe({
      next: (teacherDetails) => { // TODO: No funciona. Ajustar con Merge.
        if(!teacherDetails){
          this.adminDetails$ = this.userService.getUserById(this.adminId);
        }
      }
    })
  }
}
