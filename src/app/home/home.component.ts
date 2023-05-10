import {Component, OnInit} from '@angular/core';
import {DriveService} from "../drive-service/drive-service";
import {DriveUploadResponse, FileDetails} from "../common/types";
import {DRIVE_URL_OF_FILE, FILE_SIZE_5_MB} from "../common/constants";
import {concatMap, tap} from "rxjs";
import {HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  files: File;
  selectedFiles: FileList;
  uploadedFiles: FileDetails[] = [];
  isAccessTokenPresent = false;
  filenames: string[] = [];

  constructor(private driveService: DriveService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.checkAccessToken();
    this.driveService.getAccessTokenRetrievedSubject().subscribe(() => {
      this.checkAccessToken();
    });
  }

  checkAccessToken() {
    if (this.driveService.getAccessToken()) {
      this.isAccessTokenPresent = true;
    } else {
      this.isAccessTokenPresent = false;
    }
  }

  authorize() {
    this.driveService.authorize();
  }

  selectFile(event: Event) {
    // @ts-ignore
    this.selectedFiles = event.target.files;
    this.populateFilenames();
  }

  populateFilenames() {
    this.filenames = [];
    for (const file of Array.from(this.selectedFiles)) {
      this.filenames.push(file.name);
    }
  }

  upload() {
    for (const file of Array.from(this.selectedFiles)) {
      const fileDetails: FileDetails = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      };
      this.uploadedFiles.push(fileDetails);
      if (file.size > FILE_SIZE_5_MB) {
        this.uploadLargeFile(file, fileDetails);
      } else {
        this.uploadSmallFile(file, fileDetails);
      }
    }
  }

  uploadSmallFile(file: File, fileDetails: FileDetails) {
    this.driveService.uploadFileWithMetadata(file)
      .pipe(tap(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // @ts-ignore
          fileDetails.progress = Math.round(100 * event.loaded / event.total);
        }
      }))
      .subscribe((response: HttpEvent<DriveUploadResponse>) => {
        if (response instanceof HttpResponse) {
          const driveResponse: DriveUploadResponse | null = response.body;
          if (driveResponse) {
            fileDetails.driveUrl = DRIVE_URL_OF_FILE + driveResponse.id;
          }
        }
      }, e => {
        this.snackBar.open(e.error.error.message, 'Ok');
      });
  }


  uploadLargeFile(file: File, fileDetails: FileDetails) {
    this.driveService.getLocationForLargeFileUpload(file)
      .pipe(
        concatMap(response => this.driveService.uploadLargeFile(response.headers.get('location') || '', file))
      )
      .pipe(tap(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // @ts-ignore
          fileDetails.progress = Math.round(100 * event.loaded / event.total);
        }
      }))
      .subscribe((response: HttpEvent<DriveUploadResponse>) => {
        if (response instanceof HttpResponse) {
          const driveResponse: DriveUploadResponse | null = response.body;
          if (driveResponse) {
            fileDetails.driveUrl = DRIVE_URL_OF_FILE + driveResponse.id;
          }
        }
      }, e => {
        this.snackBar.open(e.error.error.message, 'Ok');
      });
  }

}
