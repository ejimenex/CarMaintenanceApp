import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  template: `
    <ion-searchbar
      [placeholder]="placeholder"
      [value]="searchTerm"
      (ionInput)="onSearch($event)"
      (ionClear)="onClear()">
    </ion-searchbar>
  `
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Search...';
  @Input() searchTerm: string = '';
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  onSearch(event: any) {
    this.search.emit(event.target.value);
  }

  onClear() {
    this.clear.emit();
  }
} 