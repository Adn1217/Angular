import { KeyValue } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorMessagesControl'
})
export class ErrorMessagesControlPipe implements PipeTransform {

  transform(errors: KeyValue<string, any>[], ...args: unknown[]): unknown {
    let errorsLabel: string [] = [''];

    errors.forEach((error) => {
      if(error["key"] === "required"){
        errorsLabel.push("El campo es necesario");
      }else if (error['key'] === "email"){
        errorsLabel.push("Se debe ingresar un email válido.");
      }else if (error['key'] === 'minlength'){
        const longitud = error['value'];
        const lackNumChar =  longitud.actualLength - longitud.requiredLength;
        if (lackNumChar < 0){
          errorsLabel.push(`Longitud mínima de ${longitud.requiredLength} caracteres.`)
        }
      }else if (error['key'] === 'min'){
        const minValue = error['value'];
        const lackValue = minValue.actual - minValue.min;
        if (lackValue < 0){
          errorsLabel.push("Valor mínimo es cero.")
        }
      }else if (error['key'] === 'max'){
        const maxValue = error['value'];
        const excessValue = maxValue.actual - maxValue.max;
        if (excessValue > 0){
          errorsLabel.push(`Valor máximo es ${maxValue.max}`)
        }
      }else if (error['key']) {
          errorsLabel.push(JSON.stringify(error))
      }else{
          errorsLabel.push("¡Se ve bien!");
        }
      })
    const errorLabel = errorsLabel.join(' ');
    return errorLabel;
    }
  }
