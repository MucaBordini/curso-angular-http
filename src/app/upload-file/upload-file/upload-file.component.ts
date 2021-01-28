import { environment } from './../../../environments/environment';
import { UploadFileService } from './../upload-file.service';
import { Component, OnInit } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { filterResponse, uploadProgress } from 'src/app/shared/rxjs-operators';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit {
  files: Set<File>;

  progresso = 0;

  constructor(private uploadService: UploadFileService) {}

  ngOnInit(): void {}

  onChange(event) {
    const selectedFiles = <FileList>event.srcElement.files;
    const fileNames = [];
    this.files = new Set();
    for (let i = 0; i < selectedFiles.length; i++) {
      fileNames.push(selectedFiles[i].name);
      this.files.add(selectedFiles[i]);
    }

    document.getElementById('customFileLabel').innerHTML = fileNames.join(', ');

    this.progresso = 0;
  }

  onUpload() {
    if (this.files && this.files.size > 0) {
      this.uploadService
        .upload(this.files, environment.BASE_URL + '/upload')
        .pipe(
          uploadProgress(progress => {
            console.log(progress);
            this.progresso = progress
          }),
          filterResponse()
        )
        .subscribe(response => console.log('Upload concluído'));

    }
  }
}
