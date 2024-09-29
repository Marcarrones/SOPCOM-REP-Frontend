import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
  <h1 mat-dialog-title>Confirm</h1>
  <div mat-dialog-content>{{confirmMessage}}</div>
  <div mat-dialog-actions>
    <button mat-raised-button style="color: #fff;background-color: #153961;" (click)="dialogRef.close(true)">Confirm</button>
    <button mat-raised-button (click)="dialogRef.close(false)">Cancel</button>
  </div>`,
})
export class ConfirmDialogComponent {
  
  public confirmMessage: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
  ) { }
}
