import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: ``
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  
  private debouncer: Subject<string> = new Subject<string>();
  private debounceSuscription?: Subscription;

  @Input() 
  public placeholder = 'Search...';

  @Input()
  public initialValue = '';
  
  @Output()
  public onValue = new EventEmitter<string>();
  
  @Output()
  public onDebounce = new EventEmitter<string>();
  
  ngOnInit(): void {
    this.debounceSuscription = this.debouncer
    .pipe(
      debounceTime(1000) //espera 1 segundo para emitir o valor
    )
    .subscribe((searchTerm) => {
      //this.emitValue(searchTerm); <= aplica a todas las busquedas
      this.onDebounce.emit(searchTerm);
    }
  );
}

ngOnDestroy(): void {
  this.debounceSuscription?.unsubscribe();
}

emitValue(value: string): void {
  this.onValue.emit(value);
}

onKeyPress(searchTerm:string){
  this.debouncer.next(searchTerm);  
}

}
