import { Component, OnInit, Input } from '@angular/core'

import { Author } from '../../objects/Resource'

@Component({
  selector: 'app-author-widget',
  templateUrl: './author-widget.component.html',
  styleUrls: ['./author-widget.component.scss']
})
export class AuthorWidgetComponent implements OnInit {
	@Input() author: Author
	@Input() categories: Array<string>
	
	constructor() { }
	
	ngOnInit() {
	}

}
