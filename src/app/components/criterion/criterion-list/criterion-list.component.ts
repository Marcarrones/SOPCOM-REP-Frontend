import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EndpointService } from 'src/app/services/endpoint.service';
import { CriterionDialogComponent } from '../criterion-dialog/criterion-dialog.component';

@Component({
  selector: 'app-criterion-list',
  templateUrl: './criterion-list.component.html',
  styleUrls: ['./criterion-list.component.css']
})
export class CriterionListComponent implements OnInit {

  public criterionList;

  constructor(
    private endpointService: EndpointService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.endpointService.getAllCriterions().subscribe(data => {
      console.log(data)
      this.criterionList = data;
    })
  }

  openDialog(id) {
    const dialogRef = this.dialog.open(CriterionDialogComponent, {
      width: '250px',
      data: {id: id},
    });
  }

}
