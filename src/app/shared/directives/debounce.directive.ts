import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[debounce]'
})
export class DebounceDirective {
  @Input() debounceTime = 300;
  @Output() debouncedEvent = new EventEmitter<any>();
  
  private subject = new Subject<any>();

  constructor() {
    this.subject.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(value => {
      this.debouncedEvent.emit(value);
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.subject.next(event);
  }
} 