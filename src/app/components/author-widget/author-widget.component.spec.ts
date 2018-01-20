import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorWidgetComponent } from './author-widget.component';

describe('AuthorWidgetComponent', () => {
  let component: AuthorWidgetComponent;
  let fixture: ComponentFixture<AuthorWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
