import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Criterion } from 'src/app/models/criterion';
import { NavigatorService } from 'src/app/services/navigator.service';
import { EndpointService } from 'src/app/services/endpoint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-criterion',
  templateUrl: './criterion.component.html',
  styleUrls: ['./criterion.component.css']
})
export class CriterionComponent implements OnInit {

  @Input() id;
  public criterion;
  public loaded = false;
  public edit = false;

  public nameFormControl: FormControl;

  constructor(
    public navigatorService: NavigatorService,
    private router: Router,
    private endpointService: EndpointService,
    private _snackBar: MatSnackBar
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
    this.nameFormControl.valueChanges.subscribe(value => this.criterion.name = value)
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
    for(let t in this.criterion.values) {
      if(this.criterion.values[t]['name'] == value) {
        this._snackBar.open("This criterion already has the value " + value, 'X', {duration: 2000, panelClass: ['blue-snackbar']});
        return;
      }
    }
    this.criterion.values.push({name: value})
  }

  public removeValue(index) {
    this.criterion.values.splice(index, 1);
  }

  public saveCriterion() {
    if(this.criterion.values.length < 2) {
      this._snackBar.open("Name is required", 'X', {duration: 2000, panelClass: ['red-snackbar']});
    } else if(!this.nameFormControl.valid) {
      this._snackBar.open("The criterion must have at least 2 values", 'X', {duration: 2000, panelClass: ['red-snackbar']});
    } else {
      let body = this.stringifyCriterion();
      this.endpointService.addCriterion(body).subscribe(data => {
        this._snackBar.open("Criterion added!", 'X', {duration: 2000, panelClass: ['green-snackbar']});
        this.navigatorService.refreshCriterionList();
        this.router.navigate(['/criterion', data['id']])
      })
    }
  }

  public deleteCriterion() {
    this.endpointService.deleteCriterion(this.id).subscribe( data => {
      this.navigatorService.refreshCriterionList();
      this.router.navigate(['/criterion'])
    })
  }

}
