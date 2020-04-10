import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Workday } from 'src/app/shared/models/workday';
import { Task } from 'src/app/shared/models/task';
import { ToastrService } from './toastr.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class WorkdaysService {

  constructor(
    private http: HttpClient,
    private dateService: DateService,
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private loaderService: LoaderService) { }

  save(workday: Workday) {
    const url = `${environment.firebase.firestore.baseURL}/workdays?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdayForFirestore(workday);
    const jwt: string = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${jwt}`
      })
    };

    this.loaderService.setLoading(true);

    return this.http.post(url, data, httpOptions).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre journée de travail a été enregistré avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  /**
   * Return Firestore's workday.
   * 
   * @params date - 20/04/2020 
   */
  getWorkdayByDate(date: string): Observable<Workday|null> {
    console.log('getWorkdayByDate', date);

    const url = `${environment.firebase.firestore.baseURL}:runQuery?key=${environment.firebase.apiKey}`;
    const data = this.getSructuredQuery(date);
    const jwt: string = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${jwt}`
      })
    };

    return this.http.post(url, data, httpOptions).pipe(
      switchMap((data: any) => {
        if(!data[0].document) { return of(null); }
        return of(this.getWorkdayFromFirestore(data[0].document.fields));
      })
    );
  }

  private getWorkdayFromFirestore(fields): Workday {
    const tasks: Task[] = [];
    
    fields.tasks.arrayValue.values.forEach(data => {
      const task: Task = new Task({
        completed: data.mapValue.fields.completed.booleanValue,
        done: data.mapValue.fields.done.integerValue,
        title: data.mapValue.fields.title.stringValue,
        todo: data.mapValue.fields.todo.integerValue
      });
      tasks.push(task);
    });

    return new Workday({
      userId: fields.userId.stringValue,
      notes: fields.notes.stringValue,
      displayDate: fields.displayDate.stringValue,
      dueDate: fields.dueDate.integerValue,
      tasks: tasks
    });
  }

  private getSructuredQuery(date: string): Object {
    return {
      'structuredQuery': {
        'from': [{
          'collectionId': 'workdays'
        }],
        'where': {
          'fieldFilter': {
            'field': { 'fieldPath': 'displayDate' },
            'op': 'EQUAL',
            'value': { 'stringValue': date }
          }
        },
        'limit': 1
      }
    };
  }

  private getWorkdayForFirestore(workday: Workday): Object {
    const dueDate: number = new Date(workday.dueDate).getTime();
    const displayDate: string = this.dateService.getDisplayDate(new Date(workday.dueDate));
    const tasks: Object = this.getTaskListForFirestore(workday.tasks);

		return {
			fields: {
        dueDate: { integerValue: dueDate },
        displayDate: { stringValue: displayDate },
				tasks: tasks,
        notes: { stringValue: workday.notes },
        userId: { stringValue: workday.userId }
			}
		};
  }

  private getTaskListForFirestore(tasks: Task[]): Object {
    const taskList = {
      arrayValue: {
        values: []
      }
    };

    tasks.forEach(task => {
      taskList.arrayValue.values.push(this.getTaskForFirestore(task))
    });

    return taskList;
  }

  private getTaskForFirestore(task: Task): Object {
    return {
      mapValue: {
        fields: {
          title: { stringValue: task.title },
          todo: { integerValue: task.todo },
          done: { integerValue: task.done },
          completed: { booleanValue: false } 
        }
      }
    }
  }

}
