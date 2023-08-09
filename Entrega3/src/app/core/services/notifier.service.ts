import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';


interface MyCustomNotificacion {
  icon: 'success' | 'error' | 'warning' | 'info' | 'question',
  title?: string,
  text: string,
  footer?: string,
  position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end',
  showCloseButton?: boolean,
  showCancelButton?: boolean,
  showDenyButton?: boolean,
  focusConfirm?: boolean,
  confirmButtonText?: string,
  cancelButtonText?: string,
  denyButtonText?: string,
  timer?: number
}
interface MyCustomToastNotificacion {
  icon: 'success' | 'error' | 'warning' | 'info' | 'question',
  title?: string,
  text: string,
  position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end',
  showConfirmButton?: boolean,
  confirmButtonText?: string,
  timer?: number,
  timerProgressBar: boolean,
  toast: boolean,
}

@Injectable({
  providedIn: 'root'
})


export class NotifierService {

  private notifier$ = new Subject<MyCustomNotificacion>();
  private toastNotifier$ = new Subject<MyCustomNotificacion>();
  private toastNotifier = Swal.mixin(<MyCustomToastNotificacion>{});

  constructor() { 
    this.notifier$.subscribe({
      next: (myNotification) => {
        Swal.fire(myNotification.title, myNotification.text, myNotification.icon)
      }
    })
    
    this.toastNotifier$.subscribe({
      next: (myNotification) => {
        this.toastNotifier.fire({title: myNotification.title, text: myNotification.text, icon: myNotification.icon})
      }
    })
  }

  showSucess(title: string, text: string): void {
    this.notifier$.next({
      icon: 'success',
      title: '' || title, 
      text: text,
    })
  }
  
  showError(title: string, text: string): void {
    this.notifier$.next({
      icon: 'error',
      title: title,
      text: text,
    })
  }

  showSucessToast(title: string, text: string, timer: number, showConfButton?: boolean, position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end'): void {

    this.toastNotifier = Swal.mixin({
      toast: true,
      timer: timer || 3000,
      timerProgressBar: timer ? true : false,
      showConfirmButton: showConfButton || false,
      position: position || 'top-end',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    this.toastNotifier$.next({
      icon: 'success',
      title: title,
      text: text,
    })
  }
}
