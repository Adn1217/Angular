import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { users, teachers } from 'src/app/usuarios/modelos';
import { UserService } from 'src/app/usuarios/user.service';
@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent {

  teacherDetails?: teachers
  teacherId: string

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute ){
    this.teacherId = this.activatedRoute.snapshot.params['id'];
    this.teacherDetails = this.userService.getTeacherById(this.teacherId);

  }

}
