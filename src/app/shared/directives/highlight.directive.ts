import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective implements OnInit {
  @Input() highlight: string = '';
  @Input() highlightColor: string = 'yellow';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.highlight) {
      this.highlightText();
    }
  }

  private highlightText() {
    const text = this.el.nativeElement.textContent;
    const regex = new RegExp(`(${this.highlight})`, 'gi');
    this.el.nativeElement.innerHTML = text.replace(regex, `<mark style="background-color: ${this.highlightColor}">$1</mark>`);
  }
} 