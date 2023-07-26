import { Pipe, PipeTransform } from '@angular/core';
import { users } from 'src/app/usuarios/modelos';

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {

  transform(value: users, ...args: unknown[]): unknown {

    if (args[0] === '1'){
      let values = [value.nombres, value.apellidos];
      let fullname = values.join(' ');
      return fullname;
    }else if (args[0] === '0'){
      let values = [value.apellidos, value.nombres];
      let fullname = values.join(' ');
      return fullname;
    }else {
      return null
    }
  }

}
