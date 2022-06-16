import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CriterionComponent } from '../criterion.component';

@Component({
  selector: 'app-criterion-dialog',
  templateUrl: './criterion-dialog.component.html',
  styleUrls: ['./criterion-dialog.component.css']
})
export class CriterionDialogComponent implements OnInit {

  @ViewChild(CriterionComponent) criterionComponent: CriterionComponent;

  constructor(
    public dialogRef: MatDialogRef<CriterionComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
    
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
