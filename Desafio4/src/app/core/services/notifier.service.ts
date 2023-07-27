import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';


interface MyCustomNotificacion {
  icon: 'success' | 'error' | 'warning' | 'info' | 'question',
  title?: string,
  text: string,
  footer?: string,
  position?: string,
  showCloseButton?: boolean,
  showCancelButton?: boolean,
  showDenyButton?: boolean,
  focusConfirm?: boolean,
  confirmButtonText?: string,
  cancelButtonText?: string,
  denyButtonText?: string
  timer?: number
}

@Injectable({
  providedIn: 'root'
})


export class NotifierService {

  private notifier$ = new Subject<MyCustomNotificacion>();

  constructor() { 
    this.notifier$.subscribe({
      next: (myNotification) => {
        Swal.fire(myNotification.title, myNotification.text, myNotification.icon)
      }
    })
  }

  showSucess(title: string, text: string): void {
    this.notifier$.next({
      icon: 'success',
      text: text,
    })
  }
}
