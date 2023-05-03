import {AfterViewInit, Component, NgZone, OnInit} from '@angular/core';
import {DriveService} from "../drive-service/drive-service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(private driveService: DriveService) {
  }

  ngOnInit(): void {
  }

  authorize() {
    this.driveService.authorize();
  }




}
