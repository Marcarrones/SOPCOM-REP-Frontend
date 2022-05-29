import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-method-element-dialog',
  templateUrl: './method-element-dialog.component.html',
  styleUrls: ['./method-element-dialog.component.css']
})
export class MethodElementDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
    console.log("HOLA")
    console.log(this.data)
  }

}
