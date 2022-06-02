import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MethodElementComponent } from '../method-element.component';

@Component({
  selector: 'app-method-element-dialog',
  templateUrl: './method-element-dialog.component.html',
  styleUrls: ['./method-element-dialog.component.css']
})
export class MethodElementDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MethodElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  @ViewChild(MethodElementComponent) meComponent: MethodElementComponent;

  ngOnInit(): void {
    console.log("HOLA")
    console.log(this.data)
  }

  public saveMethodElement() {
    this.meComponent.saveMethodElement();
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
