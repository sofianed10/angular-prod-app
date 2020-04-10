import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'al-page-not-found',
  templateUrl: './page-not-found.component.html',
  styles: []
})
export class PageNotFoundComponent  {

  constructor(private location: Location) { }

  ngOnInit(): void {
  }
  back() {
    this.location.back();
   }
}
