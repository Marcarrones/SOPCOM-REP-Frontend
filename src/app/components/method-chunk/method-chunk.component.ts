import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint.service';
import { MethodElement } from 'src/app/models/method-element';
import { MethodChunk } from 'src/app/models/method-chunk';
import { Goal } from 'src/app/models/goal';
import { Criterion } from 'src/app/models/criterion';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MethodElementDialogComponent } from '../method-element/method-element-dialog/method-element-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { GoalComponent } from '../goal/goal.component';
import { MethodElementComponent } from '../method-element/method-element.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CriterionComponent } from '../criterion/criterion.component';
import { CriterionDialogComponent } from '../criterion/criterion-dialog/criterion-dialog.component';

@Component({
  selector: 'app-method-chunk',
  templateUrl: './method-chunk.component.html',
  styleUrls: ['./method-chunk.component.css']
})
export class MethodChunkComponent implements OnInit {
  
  public mode: ProgressSpinnerMode = 'indeterminate';
  public loaded = false;
  public hasChanges = false;

  public methodChunk;
  public params;
  public id;
  public goalsFilter: Observable<string[]>;

  public showPlaceHolderActivity = true;
  public showPlaceHolderTool = true;
  public showPlaceHolderSituation = true;
  public showPlaceHolderProductPart = true;
  public showPlaceHolderRole = true;
  public showPlaceHolderCriterion = true;

  public methodChunkFormGroup: FormGroup;
  public intentionFormControl: FormControl;

  @ViewChild(MethodElementComponent) activity: MethodElementComponent;

  constructor(
    private endpointService: EndpointService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public navigatorService: NavigatorService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.navigatorService.allowChange = false;
    this.id = this.route.snapshot.paramMap.get('id')!;
    if(this.id !== undefined && this.id !== null && this.id !== "") {
      this.endpointService.getMethodChunkById(this.id).subscribe(data => {
        if(data['error']  === undefined) {
          this.methodChunk = this.parseMethodChunk(data)
          this.initializeFormControls()
          this.loaded = true
        } else {
          this.navigatorService.tableView = false;
          this._snackBar.open(data['error'], 'X', {duration: 2000, panelClass: ['blue-snackbar']});
          this.router.navigate(['/method-chunk'])
        }
      })
    } else {
      this.navigatorService.tableView = false;
      this.methodChunk = new MethodChunk("", "", "", false, null, null, [], [], [], [], [], [], [], [], []);
      this.initializeFormControls()
      this.loaded = true;
    }
  }

  private initializeFormControls() {
    this.methodChunkFormGroup = new FormGroup({
      id: new FormControl({value: this.methodChunk.id, disabled: (this.id !== null && this.id !== undefined && this.id !== '')}, Validators.required),
      name: new FormControl({value: this.methodChunk.name, disabled: false}, Validators.required),
      description: new FormControl({value: this.methodChunk.description, disabled: false})
    })
    this.methodChunkFormGroup.valueChanges.subscribe(values => {
      this.hasChanges = true;
      if(this.id === null || this.id === undefined || this.id === '') this.methodChunk.id = values['id'];
      this.methodChunk.name = values['name'];
      this.methodChunk.description = values['description']
    })
    if(this.methodChunk.intention !== undefined && this.methodChunk.intention !== null)
      this.intentionFormControl = new FormControl(this.methodChunk.intention.name, Validators.required)
    else this.intentionFormControl = new FormControl('', Validators.required)
    this.goalsFilter = this.intentionFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  public intentionSelected(event) {
    this.hasChanges = true;
    let index = this.navigatorService.goalList.findIndex(goal => goal.name == event.option.value)
    if(index !== -1) this.methodChunk.intention = new Goal(this.navigatorService.goalList[index]['id'], event.option.value)
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
    let me_struct_rel_to: any[];
    let me_struct_rel_from: any[];
    let activity_rel_to: any[];
    let activity_rel_from: any[];
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
    me_struct_rel_to = data['Related chunks']['to']['me_struct_rel'] !== undefined ? data['Related chunks']['to']['me_struct_rel'] : [];
    me_struct_rel_from = data['Related chunks']['from']['me_struct_rel'] !== undefined ? data['Related chunks']['from']['me_struct_rel'] : [];
    activity_rel_to = data['Related chunks']['to']['activity_rel'] !== undefined ? data['Related chunks']['to']['activity_rel'] : [];
    activity_rel_from = data['Related chunks']['from']['activity_rel'] !== undefined ? data['Related chunks']['from']['activity_rel'] : [];
    return new MethodChunk(data['id'], data['name'], data['description'], data['abstract'], goal, activity, tools, situation, productPart, roles, contextCriteria, me_struct_rel_to, me_struct_rel_from, activity_rel_to, activity_rel_from);
  }

  private isMethodChunkValid() {
    if(!this.methodChunkFormGroup.valid) {
      this._snackBar.open("Missing ID or name", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return false;
    }
    if(!this.methodChunk.intention === null || this.methodChunk.intention === undefined) {
      this._snackBar.open("An intention is required", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return false;
    }
    if(this.methodChunk.processPart === null || this.methodChunk.processPart === undefined) {
      this._snackBar.open("An activity is required", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return false;
    }
    return true;
  }

  public saveMethodChunk() {
    if(this.isMethodChunkValid()) {
      this.hasChanges = false;
      let body = this.stringifyMethodChunk();
      if(this.id !== undefined && this.id !== null && this.id !== "") {
        this.endpointService.updateMethodChunk(this.id, body).subscribe(response => {
          if(response === null) {
            this.navigatorService.refreshMethodChunkList();
            this._snackBar.open("Chunk updated successfully", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.router.navigate(['/method-chunk', this.id])
          }
        })
      } else {
        this.endpointService.addNewMethodChunk(body).subscribe(response => {
          if(response['error'] === undefined) {
            this.navigatorService.refreshMethodChunkList();
            this._snackBar.open("Chunk added successfully", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.router.navigate(['/method-chunk', response['id']])
          }
        })
      }
    }
  }

  public deleteMethodChunk() {
    this.hasChanges = false;
    this.endpointService.deleteMethodChunk(this.id).subscribe(response => {
      this.navigatorService.refreshMethodChunkList()
      this.router.navigate(['/method-chunk'])
    })
  }

  public stringifyMethodChunk() {
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
      contextCriteria.push({criterionId: cc.criterionId, value: cc.values.map(v => v.id)});
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
      data: {id: id, type: type != 5 ? type : 2, typeStr: typeStr},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result !== null && result !== undefined) {
        this.hasChanges = true;
        if(type == 1) this.methodChunk.tools.push(new MethodElement(result, "", false, "", "", 1));
        if(type == 2) this.methodChunk.situation.push(new MethodElement(result, "", false, "", "", 2));
        if(type == 3) this.methodChunk.processPart = new MethodElement(result, "", false, "", "", 3);
        if(type == 4) this.methodChunk.roles.push({me: new MethodElement(result, "", false, "", "", 1), isSet: false});
        if(type == 5) this.methodChunk.productPart.push(new MethodElement(result, "", false, "", "", 2));
      }
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
    this.hasChanges = true;
    this.methodChunk.processPart = null;
  }

  public addActivity(event) {
    this.hasChanges = true;
    this.methodChunk.processPart = new MethodElement(event.item.data.id, event.item.data.name, false, "", "", 3)
  }

  public addTool(event) {
    this.hasChanges = true;
    if(this.methodChunk.tools.findIndex(element => element.id == event.item.data.id) !== -1) {
      this._snackBar.open("Invalid tool", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    } else {
      this.methodChunk.tools.push(event.item.data)
    }
  }

  public addConsumedArtefact(event) {
    this.hasChanges = true;
    if(this.methodChunk.situation.findIndex(element => element.id == event.item.data.id) !== -1) {
      this._snackBar.open("Invalid tool", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    } else {
      this.methodChunk.situation.push(event.item.data)
    }
  }

  public addProducedArtefact(event) {
    this.hasChanges = true;
    if(this.methodChunk.productPart.findIndex(element => element.id == event.item.data.id) !== -1) {
      this._snackBar.open("Invalid tool", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    } else {
      this.methodChunk.productPart.push(event.item.data)
    }
  }

  public addRole(event) {
    this.hasChanges = true;
    if(this.methodChunk.roles.findIndex(element => element.id == event.item.data.id) !== -1) {
      this._snackBar.open("Invalid tool", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    } else {
      this.methodChunk.roles.push({me: event.item.data, isSet: false})
    }
  }

  public addCriterion(event) {
    this.hasChanges = true;
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
    this.hasChanges = true;
    this.methodChunk.tools.splice(index, 1)
  }

  public removeConsumedArtefact(index) {
    this.hasChanges = true;
    this.methodChunk.situation.splice(index, 1)
  }

  public removeProducedArtefact(index) {
    this.hasChanges = true;
    this.methodChunk.productPart.splice(index, 1)
  }

  public removeRole(index) {
    this.hasChanges = true;
    this.methodChunk.roles.splice(index, 1)
  }

  public removeCriterion(index) {
    this.hasChanges = true;
    this.methodChunk.contextCriteria.splice(index, 1)
  }

  public openCriterionDialog() {
    const dialogRef = this.dialog.open(CriterionDialogComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.hasChanges = true;
      console.log(result)
      if(result !== null && result !== undefined) {
        console.log(result)
        let index = this.navigatorService.criterionList.findIndex(element => element.criterionId == result)
        let criterion = this.navigatorService.criterionList[index]
        if(index !== -1) {
          criterion['allValues'] = this.navigatorService.criterionList[index]['values']
        }
        criterion['valuesNamesArray'] = []
        this.methodChunk.contextCriteria.push(criterion)
      }
    });
  }

  public criterionValueChanges(criterion, event) {
    this.hasChanges = true;
    let values: any[] = [];
    for(let v of event) {
      let index = criterion.allValues.findIndex(av => av.name == v)
      if(index != -1) values.push(criterion.allValues[index])
    }
    criterion.values = values;
  }

  public exportPDF() {
    let jspdf = new jsPDF('p','pt', 'a4');
    autoTable(jspdf, {html: '#table'})
    jspdf.save(this.methodChunk.id + '.pdf');
  }

}
