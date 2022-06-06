import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-criterion-dialog',
  templateUrl: './criterion-dialog.component.html',
  styleUrls: ['./criterion-dialog.component.css']
})
export class CriterionDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
  }

}
