import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRoundedBlockDirective]',
  
})
export class RoundedBlockDirective implements OnInit {
  @Input() nota: number = 0;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    console.log(this.elementRef);
    console.log(this.nota);
   }
   ngOnInit() {
    if(this.nota < 3 ){
      console.log(this.nota);
      this.renderer.setStyle(this.elementRef.nativeElement, 'border-color', 'red')
      this.renderer.setStyle(this.elementRef.nativeElement, 'text-decoration', 'underline');
      this.renderer.setStyle(this.elementRef.nativeElement, 'border-radius', '5px');
      this.renderer.setStyle(this.elementRef.nativeElement, 'border-style', 'dotted');
      this.renderer.setStyle(this.elementRef.nativeElement, 'border-width', '5px');
    }
   }
   
}
