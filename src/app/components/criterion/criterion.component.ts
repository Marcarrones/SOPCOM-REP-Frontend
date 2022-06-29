import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Criterion } from 'src/app/models/criterion';
import { NavigatorService } from 'src/app/services/navigator.service';
import { EndpointService } from 'src/app/services/endpoint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

@Component({
  selector: 'app-criterion',
  templateUrl: './criterion.component.html',
  styleUrls: ['./criterion.component.css']
})
export class CriterionComponent implements OnInit {

  @Input() id;
  @Input() dialog = false;
  public criterion;
  public loaded = false;
  public edit = false;

  public nameFormControl: FormControl;

  constructor(
    public navigatorService: NavigatorService,
    private router: Router,
    private endpointService: EndpointService,
    private _snackBar: MatSnackBar,
    public dialogs: MatDialog
  ) { }

  ngOnInit(): void {
    if(this.id !== undefined && this.id !== null &&  this.id !== "") {
      this.endpointService.getCriterionById(this.id).subscribe(data => {
        if(data['error'] === undefined) this.criterion = this.parseCriterion(data);
        else {
          this.edit = true;
          this.criterion = new Criterion(null, "", []);
          this.navigatorService.allowChange = false;
        }
        this.loadFormControls();
        this.loaded = true;
      })
    } else {
      this.criterion = new Criterion(null, "", []);
      this.edit = true;
      this.loadFormControls();
      this.loaded = true;
      this.navigatorService.allowChange = false;
    }
  }

  private parseCriterion(data) {
    this.edit = false;
    return new Criterion(data['id'], data['name'], data['values']);
  }

  private loadFormControls() {
    this.nameFormControl = new FormControl({value: this.criterion.name, disabled: !this.edit}, Validators.required);
    this.nameFormControl.valueChanges.subscribe(value => {
      this.navigatorService.allowChange = true;
      this.criterion.name = value
    })
  }

  public stringifyCriterion() {
    let body = {name: this.criterion.name};
    body['values'] = [];
    for(let v in this.criterion.values) {
      body['values'].push(this.criterion.values[v]['name'])
    }
    return JSON.stringify(body);
  }

  public addValue(value) {
    if(value.value != "") {
      this.navigatorService.allowChange = true;
      for(let t in this.criterion.values) {
        if(this.criterion.values[t]['name'] == value.value) {
          this._snackBar.open("This criterion already has the value " + value.value, 'X', {duration: 3000, panelClass: ['blue-snackbar']});
          return;
        }
      }
      this.criterion.values.push({name: value.value})
      value.value = ""
    }
    else {
      this._snackBar.open("Please enter a name", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    }
  }

  public removeValue(index) {
    this.navigatorService.allowChange = true;
    this.criterion.values.splice(index, 1);
  }

  public async saveCriterion() {
    if(this.criterion.values.length < 2) {
      this._snackBar.open("The criterion must have at least 2 values", 'X', {duration: 3000, panelClass: ['red-snackbar']});
      return false;
    } else if(!this.nameFormControl.valid) {
      this._snackBar.open("Name is required", 'X', {duration: 3000, panelClass: ['red-snackbar']});
      return false;
    } else {
      if(this.navigatorService.criterionList.findIndex(c => c.criterionName == this.criterion.name) !== -1) {
        this._snackBar.open("Duplicate name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
        return false;
      } else {
        this.navigatorService.allowChange = false;
        let body = this.stringifyCriterion();
        await this.endpointService.addCriterion(body).subscribe(data => {
          console.log("data", data)
          this.criterion.id = data['id']
          console.log(this.criterion)
          this._snackBar.open("Criterion added!", 'X', {duration: 3000, panelClass: ['green-snackbar']});
          this.navigatorService.refreshCriterionList();
          if(!this.dialog)this.router.navigate(['/criterion', data['id']])
        })
        return true;
      }
    }
  }

  public deleteCriterion() {
    this.navigatorService.allowChange = false;
    this.endpointService.deleteCriterion(this.id).subscribe( data => {
      this.navigatorService.refreshCriterionList();
      this.router.navigate(['/criterion'])
    })
  }

  public openEditCriterionDialog() {
    const dialogRef = this.dialogs.open(UpdateCriterionDialog, {
      width: '500px',
      data: {id: this.criterion.id}
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result == 1) this.navigatorService.refreshCriterionList();
      this.ngOnInit();
    })
  }

  public openAddNewValueCriterion() {
    const dialogRef = this.dialogs.open(AddNewValueDialog, {
      width: '500px',
      data: {id: this.criterion.id, values: this.criterion.values
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  public openUpdateValueCriterion(value) {
    const dialogRef = this.dialogs.open(UpdateValueDialog, {
      width: '500px',
      data: {idC: this.criterion.id, 
        values: this.criterion.values,
        name: value.name,
        idV: value.id}
    })
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  public openDeleteValueCriterion(value) {
    const dialogRef = this.dialogs.open(RemoveValueDialog, {
      width: '500px',
      data: {idC: this.criterion.id,
        idV: value.id,
        values: this.criterion.values}
    })
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

}

@Component({
  selector: 'update-criterion-dialog',
  templateUrl: 'dialogs/update-criterion-dialog.html',
})
export class UpdateCriterionDialog {
  constructor(
    public dialogRef: MatDialogRef<UpdateCriterionDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public endpointService: EndpointService,
    public navigatorService: NavigatorService,
    private _snackBar: MatSnackBar
  ) {}

  public name: String = '';

  public updateCriterion() {
    if(this.name.length > 0) {
      if(this.navigatorService.criterionList.findIndex(c => c.criterionName == this.name) !== -1) {
        this._snackBar.open("Duplicate name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
      } else {
        let body = {name: this.name}
        this.endpointService.updateCriterion(this.data.id, body).subscribe(data => {
          if(data === null) {
            this.closeDialog(true)
          } else {
            this._snackBar.open("Invalid name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
          }
        })
      }
    } else {
      this._snackBar.open("Invalid name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
    }
  }

  closeDialog(reload = false): void {
    this.dialogRef.close(reload ? 1 : 2);
  }
}

@Component({
  selector: 'add-new-value-dialog',
  templateUrl: 'dialogs/add-new-value-dialog.html',
})
export class AddNewValueDialog {
  constructor(
    public dialogRef: MatDialogRef<AddNewValueDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public endpointService: EndpointService,
    public navigatorService: NavigatorService,
    private _snackBar: MatSnackBar
  ) {}

  public name: String = '';

  public addNewValueCriterion() {
    if(this.name.length > 0) {
      if(this.data.values.findIndex(v => v.name == this.name) !== -1) {
        this._snackBar.open("Duplicate name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
      } else {
        let body = {name: this.name}
        this.endpointService.addValueCriterion(this.data.id, body).subscribe(data => {
          if(data['id']) {
            this.closeDialog()
          } else {
            this._snackBar.open("Invalid name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
          }
        })
      }
    } else {
      this._snackBar.open("Invalid name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'update-value-dialog',
  templateUrl: 'dialogs/update-value-dialog.html',
})
export class UpdateValueDialog {
  constructor(
    public dialogRef: MatDialogRef<UpdateValueDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public endpointService: EndpointService,
    public navigatorService: NavigatorService,
    private _snackBar: MatSnackBar
  ) {
    this.name = this.data.name
  }

  public name: String = '';

  public updateValueCriterion() {
    if(this.name.length > 0) {
      if(this.data.values.findIndex(v => v.name == this.name) !== -1) {
        this._snackBar.open("Duplicate name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
      } else {
        let body = {name: this.name}
        this.endpointService.updateValueCriterion(this.data.idC, this.data.idV, body).subscribe(data => {
          if(data === null) {
            this.closeDialog()
          } else {
            this._snackBar.open("Invalid name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
          }
        })
      }
    } else {
      this._snackBar.open("Invalid name", 'X', {duration: 3000, panelClass: ['red-snackbar']});
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'remove-value-dialog',
  templateUrl: 'dialogs/remove-value-dialog.html',
})
export class RemoveValueDialog {
  constructor(
    public dialogRef: MatDialogRef<RemoveValueDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public endpointService: EndpointService,
    public navigatorService: NavigatorService,
    private _snackBar: MatSnackBar
  ) {}

  public confirmDelete() {
    if(this.data.values.length > 2) {
      this.endpointService.deleteValueCriterion(this.data.idC, this.data.idV).subscribe(data => {
        console.log(data)
        if(data === null) {
          this.closeDialog()
        } else {
          this._snackBar.open(data['error'], 'X', {duration: 3000, panelClass: ['red-snackbar']});
        }
      })
    } else {
      this._snackBar.open("A criterion must have at least 2 values", 'X', {duration: 3000, panelClass: ['red-snackbar']});
    }
  }

    

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
