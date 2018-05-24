import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageUploaderDropzoneComponent } from './storage-uploader-dropzone.component';

describe('StorageUploaderDropzoneComponent', () => {
  let component: StorageUploaderDropzoneComponent;
  let fixture: ComponentFixture<StorageUploaderDropzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageUploaderDropzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageUploaderDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
