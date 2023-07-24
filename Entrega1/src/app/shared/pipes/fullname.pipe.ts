import { Pipe, PipeTransform } from '@angular/core';
import { users } from 'src/app/usuarios/modelos';

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {

  transform(value: users, ...args: unknown[]): unknown {
    let values = [value.nombres, value.apellidos];
    let fullName = values.join(' ');
    return fullName;
  }

}
