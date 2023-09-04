import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { users } from 'src/app/usuarios/modelos';
import { UserService } from 'src/app/usuarios/user.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css']
})
export class DetallesComponent {

  userDetails$?: Observable<users | undefined>
  userId: string

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute ){
    this.userId = this.activatedRoute.snapshot.params['id'];
    this.userDetails$ = this.userService.getUserById(this.userId);
  }
}
