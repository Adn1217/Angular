import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';


interface MyCustomNotification {
  icon: 'success' | 'error' | 'warning' | 'info' | 'question',
  title?: string,
  text: string,
  footer?: string,
  position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end',
  showCloseButton?: boolean,
  showCancelButton?: boolean,
  showDenyButton?: boolean,
  focusConfirm?: boolean,
  focusDeny?: boolean,
  confirmButtonText?: string,
  cancelButtonText?: string,
  denyButtonText?: string,
  timer?: number,
  reverseButtons?: boolean
}

interface MyCustomToastNotification {
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

  private notifier = Swal.mixin(<MyCustomNotification>{});
  private notifier$ = new Subject<MyCustomNotification>();
  private toastNotifier$ = new Subject<MyCustomNotification>();
  private toastNotifier = Swal.mixin(<MyCustomToastNotification>{});

  constructor() { 
    this.notifier$.subscribe({
      next: (myNotification) => {
        Swal.fire({...myNotification})
      }
    })
    
    this.toastNotifier$.subscribe({
      next: (myNotification) => {
        this.toastNotifier.fire({...myNotification})
      }
    })
  }

  showSuccess(title: string, text: string): void {
    this.notifier$.next({
      icon: 'success',
      title: '' || title, 
      text: text,
    })
  }
  
  showConfirm(title: string, text: string, icon?: 'warning' | 'info' | 'question'): void {
    this.notifier$.next({
      icon: icon || 'question',
      title: title || '', 
      text: text,
      showDenyButton: true,
      focusConfirm: false,
      focusDeny: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
      reverseButtons: true
    })
  }
  
  getConfirm(title: string, text: string, icon?: 'warning' | 'info' | 'question'): any {
    return (Swal.mixin({
      icon: icon || 'question',
      title: title || '', 
      text: text,
      showDenyButton: true,
      focusConfirm: false,
      focusDeny: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No',
      reverseButtons: true
    }))
  }
  
  showError(title: string, text: string): void {
    this.notifier$.next({
      icon: 'error',
      title: title,
      text: text,
    })
  }

  showSuccessToast(title: string, text: string, timer: number, showConfButton?: boolean, position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end'): void {

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
