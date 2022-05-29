import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EndpointService } from 'src/app/services/endpoint.service';
import { MethodElementDialogComponent } from 'src/app/components/method-element/method-element-dialog/method-element-dialog.component';

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
    private endpointService: EndpointService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.data.subscribe(params => {
      this.type = params['type'];
      this.typeStr = params['typeStr'];
    });
  }

  ngOnInit(): void {

    this.endpointService.getAllMethodElementsByType(this.type).subscribe(data => {
      console.log(data)
      this.methodElementList = data;
    })
  }

  openDialog(id) {
    const dialogRef = this.dialog.open(MethodElementDialogComponent, {
      width: '250px',
      data: {id: id},
    });
  }

}
