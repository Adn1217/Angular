import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { users, teachers } from 'src/app/usuarios/modelos';
import { UserService } from 'src/app/usuarios/user.service';
import { Observable } from 'rxjs'
@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent {

  teacherDetails$?: Observable<teachers | undefined>
  teacherId: string

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute ){
    this.teacherId = this.activatedRoute.snapshot.params['id'];
    this.teacherDetails$ = this.userService.getTeacherById(this.teacherId);
  }

}
