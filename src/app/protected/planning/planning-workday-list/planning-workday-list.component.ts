import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'al-planning-workday-list',
  templateUrl: './planning-workday-list.component.html',
  styles: []
})
export class PlanningWorkdayListComponent implements OnInit {
public workdays$;
public workdays;
  constructor() { }

  ngOnInit() {
this.workdays = [
{
  dueDate:'Vendredi',remainingTasks : 1 , doneTasks:0},
  {dueDate:'Lundi',remainingTasks : 0 , doneTasks:2},
  {dueDate:'Mardi',remainingTasks : 0 , doneTasks:0}
];
this.workdays$=of(this.workdays).pipe(delay(1000));
  }
// Ajoutez notre gestionnaire d’événement :
onWorkdayRemoved(dueDate: string) {
  this.workdays = this.workdays.filter(workday => 
   !dueDate.includes(workday.dueDate)
  );
  this.workdays$ = of(this.workdays);
 }

}
