import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Workday } from 'src/app/shared/models/workday';
import { AuthService } from 'src/app/core/services/auth.service';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { Router } from '@angular/router';

@Component({
  selector: 'al-workday-form',
  templateUrl: './workday-form.component.html',
  styles: []
})
export class WorkdayFormComponent implements OnInit {
  workdayForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private workdaysService: WorkdaysService,
		private authService: AuthService) { }

	ngOnInit() {
		this.workdayForm = this.createWorkdayForm();
	}

	get dueDate() { return this.workdayForm.get('dueDate'); }
	get notes() { return this.workdayForm.get('notes'); }
	get tasks() { return this.workdayForm.get('tasks') as FormArray; }

	onDateSelected(displayDate: string) {
		this.workdaysService.getWorkdayByDate(displayDate).subscribe(workday => {
			if(!workday) {
				while(this.tasks.length !== 0) {
					this.tasks.removeAt(0);
				}
				this.notes.reset();
				return;
			}
			
			this.notes.setValue(workday.notes);
			workday.tasks.forEach(task => {
				const taskField: FormGroup = this.fb.group({
					title: task.title,
					todo: task.todo,
					done: task.done
				});
				this.tasks.push(taskField);
			});
		}); 
	}

	createWorkdayForm(): FormGroup {
		return this.fb.group({
			'dueDate': ['', [
				Validators.required
			]],
			'tasks': this.fb.array([], [
				Validators.required,
				Validators.maxLength(6)
			]),
			'notes': ['', [
				Validators.maxLength(1000)
			]]
		});
	}

	submit(): void {
		const userId: string = this.authService.currentUser.id;
		const workday: Workday = new Workday({...{ userId: userId }, ...this.workdayForm.value});

		this.workdaysService.save(workday).subscribe(
			_ => this.router.navigate(['/app/planning']),
			_ => this.workdayForm.reset()
	  );
	}

 }
