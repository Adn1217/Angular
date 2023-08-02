import { Directive, OnChanges, SimpleChanges, Input, Renderer2, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appFontSize]'
})
export class FontSizeDirective implements OnChanges {
  fontSize: string = '20px';

  @Input()

  set appFontSize(size: string){
    this.fontSize= size;
  }

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.renderer2.setStyle(this.elementRef.nativeElement, 'font-size', this.fontSize)
  }

}
