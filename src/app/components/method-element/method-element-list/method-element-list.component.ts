import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EndpointService } from 'src/app/services/endpoint.service';
import { MethodElementDialogComponent } from 'src/app/components/method-element/method-element-dialog/method-element-dialog.component';
import { NavigatorService } from 'src/app/services/navigator.service';
import { TransitionCheckState } from '@angular/material/checkbox';

@Component({
  selector: 'app-method-element-list',
  templateUrl: './method-element-list.component.html',
  styleUrls: ['./method-element-list.component.css']
})
export class MethodElementListComponent implements OnInit {

  public loading = true;
  public type;
  public typeStr;
  public methodElementList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private navigatorService: NavigatorService
  ) {
    this.route.data.subscribe(params => {
      this.type = params['type'];
      this.typeStr = params['typeStr'];
    });
  }

  ngOnInit(): void {
    this.navigatorService.allowChange = true;
    if(this.type == 1) this.methodElementList = this.navigatorService.toolList;
    if(this.type == 2) this.methodElementList = this.navigatorService.artefactList;
    if(this.type == 3) this.methodElementList = this.navigatorService.activityList;
    if(this.type == 4) this.methodElementList = this.navigatorService.roleList;
    if(this.type == 6) this.methodElementList = this.navigatorService.mapList;
  }

  openDialog(id) {
    const dialogRef = this.dialog.open(MethodElementDialogComponent, {
      width: '250px',
      data: {id: id},
    });
  }

}
