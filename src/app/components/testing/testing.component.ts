import { Component, OnInit } from '@angular/core'
import { FormsModule, FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'

import { ActivatedRoute } from '@angular/router'
import { ChangeDetectorRef } from '@angular/core'


@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private refresh: ChangeDetectorRef
	) { }
	
	ngOnInit() {
		this.createForm()
	}
	
	ngOnChanges() {
		console.log("ngOnChanges")
	}
	
	pokeDerp () {
		this.derp = "poke"
		this.refresh.detectChanges()
		console.log(this.derp)
	}
	
	createdForm: FormGroup
	derp: string

	createForm () {
		this.createdForm = this.fb.group({
			name: this.fb.control("", [Validators.required, Validators.minLength(12), Validators.maxLength(36), Validators.pattern(/[a-zA-Z0-9 ]+/)]),
		})
	}
	
	get name (): FormControl { return this.createdForm.get("name") as FormControl }
}
