import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint.service';
import { MethodElement } from 'src/app/models/method-element';
import { MethodChunk } from 'src/app/models/method-chunk';
import { Goal } from 'src/app/models/goal';
import { Criterion } from 'src/app/models/criterion';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MethodElementDialogComponent } from '../method-element/method-element-dialog/method-element-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { GoalComponent } from '../goal/goal.component';
import { MethodElementComponent } from '../method-element/method-element.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-method-chunk',
  templateUrl: './method-chunk.component.html',
  styleUrls: ['./method-chunk.component.css']
})
export class MethodChunkComponent implements OnInit {
  
  public mode: ProgressSpinnerMode = 'indeterminate';
  public loaded = false;

  public methodChunk;
  public params;
  public id;
  public goalsFilter: Observable<string[]>;

  public idFormControl = new FormControl('');
  public nameFormControl = new FormControl('');
  public descriptionFormControl = new FormControl('');
  public intentionFormControl = new FormControl('');
  public processPartFormControl = new FormControl('');

  @ViewChild(MethodElementComponent) activity: MethodElementComponent;

  constructor(
    private endpointService: EndpointService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public navigatorService: NavigatorService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.navigatorService.allowChange = false;
    this.id = this.route.snapshot.paramMap.get('id')!;
    if(this.id !== undefined && this.id !== null && this.id !== "") {
      this.endpointService.getMethodChunkById(this.id).subscribe(data => {
        this.methodChunk = this.parseMethodChunk(data)
        this.initializeFormControls()
        this.loaded = true
      })
    } else {
      this.methodChunk = new MethodChunk("", "", "", false, null, null, [], [], [], [], []);
      this.initializeFormControls()
      this.loaded = true;
    }
  }

  private initializeFormControls() {
    this.goalsFilter = this.intentionFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    console.log(this.goalsFilter)
  }

  private _filter(value) {
    return this.navigatorService.goalList.filter(goal => goal.name.toLowerCase().includes(value.toLowerCase()))
  }

  private parseMethodChunk(data) {
    const goal = new Goal(data['Intention']['id'], data['Intention']['name']);
    let tools: MethodElement[] = [];
    let productPart: MethodElement[] = [];
    let roles: any[] = [];
    let situation: MethodElement[] = [];
    let contextCriteria: any[] = [];
    for(let t in data['Tools']){
      tools.push(new MethodElement(data['Tools'][t]['id'], data['Tools'][t]['name'], data["Process part"]["abstract"], data['Tools'][t]['description'], "", 1, [], [], []))
    }
    for(let t in data['Situation']){
      situation.push(new MethodElement(data['Situation'][t]['id'], data['Situation'][t]['name'], data["Process part"]["abstract"], data['Situation'][t]['description'], "", 2, [], [], []))
    }
    for(let t in data['Product part']){
      productPart.push(new MethodElement(data['Product part'][t]['id'], data['Product part'][t]['name'], data["Process part"]["abstract"], data['Product part'][t]['description'], "", 2, [], [], []))
    }
    for(let t in data['Roles']){
      roles.push({me: new MethodElement(data['Roles'][t]['id'], data['Roles'][t]['name'], data["Process part"]["abstract"], data['Roles'][t]['description'], "", 4, [], [], []), isSet: data['Roles'][t]['isSet']})
      console.log(roles)
    }
    contextCriteria = data['Context Criteria']
    for(let cc in contextCriteria) {
      let index = this.navigatorService.criterionList.findIndex(element => element.criterionId == contextCriteria[cc]['criterionId'])
      if(index !== -1) {
        contextCriteria[cc]['allValues'] = this.navigatorService.criterionList[index]['values']
      }
      contextCriteria[cc]['valuesNamesArray'] = contextCriteria[cc]['values'].map(v => v.name)
    }
    let activity: MethodElement = new MethodElement(data["Process part"]["id"], data["Process part"]["name"], data["Process part"]["abstract"], data["Process part"]["description"], "", 3, [], [], []);
    console.log(tools);
    console.log(productPart);
    console.log(roles);
    console.log(situation);
    console.log(activity);
    console.log(contextCriteria);
    return new MethodChunk(data['id'], data['name'], data['description'], data['abstract'], goal, activity, tools, situation, productPart, roles, contextCriteria);
  }

  public saveMethodChunk() {
    let body = this.stringifyMethodChunk();
    console.log(body)
    if(this.id !== undefined && this.id !== null && this.id !== "") {
      //this.endpointService.updateMethodChunk(this.id, body).subscribe(response => {
      //  console.log("After update", response)
      //  this.ngOnInit()
      //})
    } else {
      //this.endpointService.addNewMethodChunk(body).subscribe(response => {
      //  console.log("After insert", response);
      //  this.ngOnInit()
      //})
    }
  }

  public deleteMethodChunk() {
    this.endpointService.deleteMethodChunk(this.id).subscribe(response => {
      console.log("After delete", response)
    })
  }

  public stringifyMethodChunk() {
    console.log(this.intentionFormControl)
    let body = {
      id: this.methodChunk.id,
      name: this.methodChunk.name,
      description: this.methodChunk.description,
      activity: this.methodChunk.processPart.id,
      intention: this.methodChunk.intention.id
    }
    let tools = this.methodChunk.tools.map(t => t.id);
    body['tools'] = tools;
    let consumedArtefacts = this.methodChunk.situation.map(ca => ca.id);
    body['consumedArtefacts'] = consumedArtefacts;
    let producedArtefacts = this.methodChunk.productPart.map(pa => pa.id);
    body['producedArtefacts'] = producedArtefacts;
    let roles: any[] = [];
    for(let r of this.methodChunk.roles){
      roles.push({id: r.me.id, isSet: r.isSet})
    }
    body['roles'] = roles;
    let contextCriteria: any[] = [];
    for(let cc of this.methodChunk.contextCriteria) {
      contextCriteria.push({criterionId: cc.criterionId, values: cc.values});
    }
    body['contextCriteria'] = contextCriteria;
    return JSON.stringify(body);
  }

  public openMethodElementDialogEdit(id, type, typeStr) {
    const dialogRef = this.dialog.open(MethodElementDialogComponent, {
      width: '1000px',
      data: {id: id, type: type, typeStr: typeStr},
    });
  }

  public openMethodElementDialogNew(id, type, typeStr) {
    const dialogRef = this.dialog.open(MethodElementDialogComponent, {
      width: '1000px',
      data: {id: id, type: type, typeStr: typeStr},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result !== null && result !== undefined) this.methodChunk.processPart = new MethodElement(result, "", false, "", "", 3);
    })
  }

  public openGoalDialog() {
    const dialogRef = this.dialog.open(GoalComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.navigatorService.refreshGoalList();
    });
  }

  public removeActivity() {
    this.methodChunk.processPart = null;
  }

  public addActivity(event) {
    this.methodChunk.processPart = new MethodElement(event.item.data.id, event.item.data.name, false, "", "", 3)
  }

  public addTool(event) {
    if(this.methodChunk.tools.findIndex(element => element.id == event.item.data.id) !== -1) {
      this._snackBar.open("Invalid tool", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    } else {
      this.methodChunk.tools.push(event.item.data)
    }
  }

  public addConsumedArtefact(event) {
    if(this.methodChunk.situation.findIndex(element => element.id == event.item.data.id) !== -1) {
      this._snackBar.open("Invalid tool", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    } else {
      this.methodChunk.situation.push(event.item.data)
    }
  }

  public addProducedArtefact(event) {
    if(this.methodChunk.productPart.findIndex(element => element.id == event.item.data.id) !== -1) {
      this._snackBar.open("Invalid tool", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    } else {
      this.methodChunk.productPart.push(event.item.data)
    }
  }

  public addRole(event) {
    if(this.methodChunk.roles.findIndex(element => element.id == event.item.data.id) !== -1) {
      this._snackBar.open("Invalid tool", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    } else {
      this.methodChunk.roles.push({me: event.item.data, isSet: false})
    }
  }

  public addCriterion(event) {
    if(this.methodChunk.contextCriteria.findIndex(element => element.criterionId == event.item.data.criterionId) !== -1) {
      this._snackBar.open("Invalid criterion", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    } else {
      let criterion = JSON.parse(JSON.stringify(event.item.data));
      let index = this.navigatorService.criterionList.findIndex(element => element.criterionId == criterion['criterionId'])
      if(index !== -1) {
        criterion['allValues'] = this.navigatorService.criterionList[index]['values']
      }
      criterion['valuesNamesArray'] = []
      this.methodChunk.contextCriteria.push(criterion)
    }
  }

  public removeTool(index) {
    this.methodChunk.tools.splice(index, 1)
  }

  public removeConsumedArtefact(index) {
    this.methodChunk.situation.splice(index, 1)
  }

  public removeProducedArtefact(index) {
    this.methodChunk.productPart.splice(index, 1)
  }

  public removeRole(index) {
    this.methodChunk.roles.splice(index, 1)
  }

  public removeCriterion(index) {
    this.methodChunk.contextCriteria.splice(index, 1)
  }

  public criterionValueChanges(criterion, event) {
    let values: any[] = [];
    for(let v of event) {
      let index = criterion.allValues.findIndex(av => av.name == v)
      if(index != -1) values.push(criterion.allValues[index])
    }
    criterion.values = values;
  }

}
