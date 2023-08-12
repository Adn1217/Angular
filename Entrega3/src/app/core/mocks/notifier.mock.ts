export class NotifierMock {
  showSuccess(title: string, text: string): void {
  }
  
  showConfirm(title: string, text: string, icon?: 'warning' | 'info' | 'question'): void {
  }
  
  getConfirm(title: string, text: string, icon?: 'warning' | 'info' | 'question'): any {
  }
  
  showError(title: string, text: string): void {
  }

  showSuccessToast(title: string, text: string, timer: number, showConfButton?: boolean, position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end'): void {
 
  }
}