import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-criterion-list',
  templateUrl: './criterion-list.component.html',
  styleUrls: ['./criterion-list.component.css']
})
export class CriterionListComponent implements OnInit {

  constructor(
    public navigatorService: NavigatorService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.navigatorService.allowChange = true;
  }

}
