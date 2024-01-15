import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MethodElementComponent } from '../method-element.component';
import { NavigatorService } from 'src/app/services/navigator.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-method-element-dialog',
  templateUrl: './method-element-dialog.component.html',
  styleUrls: ['./method-element-dialog.component.css']
})
export class MethodElementDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MethodElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public navigatorService: NavigatorService,
    private _snackBar: MatSnackBar,
    
  ) { }

  @ViewChild(MethodElementComponent) meComponent: MethodElementComponent;

  ngOnInit(): void {
  }

  public async saveMethodElement() {
    console.log('has_st: ', this.data.existeix_st);
    if(this.data.existeix_st == true && this.meComponent.methodElement.abstract == true){
      console.log('error');
      this.closeDialog();
      this._snackBar.open("An Activity can not be abstract if there is already a Strategy", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    }else{
    let correct = await this.meComponent.saveMethodElement();
    if(correct) {
      console.log('meComponent: ', this.meComponent);
      if(this.meComponent.methodElement.abstract == true){
        this.navigatorService.abstract = true;
      }else if(this.meComponent.methodElement.abstract == false){
        this.navigatorService.abstract = false;
      }
      this.closeDialog(this.meComponent.methodElement.id)
    }
  }
  }

  public closeDialog(id?) {
    this.dialogRef.close(id);
  }
}
