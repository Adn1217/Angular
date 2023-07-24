import { Injectable } from '@angular/core';
import { users } from './modelos';

@Injectable({
  providedIn: 'root'
})
export class UserService {

private USER_DATA: users[] = [
  {id: 1, nombres: 'Adrian Alberto', apellidos: "Fernández Cabrera", usuario: "adn1217", edad: 32, correo: "adn1217@hotmail.com", password: "12345678"},
  {id: 2, nombres: 'Alejandra Paola', apellidos: "Fernández Castro", usuario: "alu2110", edad: 31, correo: "alufndz_@gmail.com", password: "12345678"},
  {id: 3, nombres: 'Rupertico Adolfo', apellidos: "Herrera Gonzalez", usuario: "ruper12", edad: 32, correo: "raherreraG@gmail.com", password: "12345678"},
];

  constructor() {}
    getUsers(){
      return this.USER_DATA;
    }

    createUser(user: users): void {
      this.USER_DATA = [...this.USER_DATA, user];
    }

    updateUser(userToUpdate: users): void {
      const {id, ...rest} = userToUpdate;
      const NEW_USER_DATA = this.USER_DATA.map((user) => {
        if(user.id === id){
          return {...user, ...rest}
        }else{
          return user
        }
      })
      console.log(NEW_USER_DATA)
      this.USER_DATA = NEW_USER_DATA;
    
    }

    deleteUser(userToDelete: users): void {
      this.USER_DATA = this.USER_DATA.filter((user) => user.id !== userToDelete.id)
    }
}
