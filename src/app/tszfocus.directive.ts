import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[tszfocus]'
})
export class TiszaSzakiFocusDirective {

  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    this.host.nativeElement.focus();
  }

}
