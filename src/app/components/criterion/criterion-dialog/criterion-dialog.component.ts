import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriterionComponent } from '../criterion.component';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-criterion-dialog',
  templateUrl: './criterion-dialog.component.html',
  styleUrls: ['./criterion-dialog.component.css']
})
export class CriterionDialogComponent implements OnInit {

  @ViewChild(CriterionComponent) criterionComponent: CriterionComponent;

  public editable = true;

  constructor(
    public dialogRef: MatDialogRef<CriterionComponent>,
    public endpointService: EndpointService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
    this.editable = !this.endpointService.isRepoPublic();
  }

  public async saveCriterion() {
    let correct = await this.criterionComponent.saveCriterion()
    console.log(correct)
    if(correct) {
      this.closeDialog(this.criterionComponent.criterion.id)
    }
  }
  
  public closeDialog(id?) {
    console.log(id)
    this.dialogRef.close(id);
  }
}
