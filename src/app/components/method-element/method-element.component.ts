import { Component, OnInit, Input } from '@angular/core';
import { MethodElement } from 'src/app/models/method-element';
import { EndpointService } from 'src/app/services/endpoint.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigatorService } from 'src/app/services/navigator.service';
import { Values } from 'src/utils/values';
@Component({
  selector: 'app-method-element',
  templateUrl: './method-element.component.html',
  styleUrls: ['./method-element.component.css']
})
export class MethodElementComponent implements OnInit {

  @Input() id: string | null;
  @Input() typeStr: string;
  @Input() type: number;
  @Input() edit = false;
  @Input() reduced = true;

  public loaded
  
  public methodElement;
  public figureUrl = '';
  public figure;
  public figureChanged = false;

  public methodElementFormGroup: FormGroup = new FormGroup({});

  constructor(
    private endpointService: EndpointService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public navigatorService: NavigatorService
  ) {
  }

  ngOnInit(): void {
    if(this.id !== undefined && this.id !== null && this.id !== "") {
      this.endpointService.getMethodElement(this.id).subscribe(data => {
        if(data['error'] !== undefined) {
          this.id = null;
          this.methodElement = new MethodElement("", "", false, "", "", this.type, [], [], []);
        } else {
          this.methodElement = this.parseMethodElement(data)
        }
        this.buildFormControl();
        this.loaded = true;
      })
    } else {
      this.methodElement = new MethodElement("", "", false, "", "", this.type, [], [], []);
      this.edit = true;
      this.navigatorService.allowChange = false;
      this.buildFormControl();
      this.loaded = true;
    }
  }

  private buildFormControl() {
    this.methodElementFormGroup = new FormGroup({
      id: new FormControl({value:this.methodElement.id, disabled: (this.id !== undefined && this.id !== null) || !this.edit}, Validators.required),
      name: new FormControl({value:this.methodElement.name, disabled: !this.edit}, Validators.required),
      description: new FormControl({value:this.methodElement.description, disabled: !this.edit}),
      abstract: new FormControl({value:this.methodElement.abstract, disabled: !this.edit})
    })
    this.methodElementFormGroup.valueChanges.subscribe(values => {
      if(this.id === undefined || this.id === null) this.methodElement.id = values['id'];
      this.methodElement.name = values['name'];
      this.methodElement.description = values['description'];
      this.methodElement.abstract = values['abstract']
    })
  }

  private parseMethodElement(data) {
    if(data['figure'] !== null && data['figure'] !== '') this.figureUrl = Values.SERVER_URL + Values.SERVER_PORT + data['figure']
    return new MethodElement(data['id'], data['name'], data['abstract'], data['description'], data['figure'], this.type, data['to']['meStrRel'], data['from']['meStrRel'], data['to']['actRel'], data['from']['actRel'], data['to']['artRel'], data['from']['artRel']);
  }

  private stringifyMethodElement() {
    let aux = {
      id: this.methodElement.id,
      name: this.methodElement.name,
      abstract: this.methodElement.abstract,
      description: this.methodElement.description,
      figure: this.methodElement.figure,
      type: this.methodElement.type,
      me_struct_rel: this.methodElement.me_struct_rel_from,
      activity_rel: this.methodElement.activity_rel_from,
      artefact_rel: this.methodElement.artefact_rel_from
    };
    return JSON.stringify(aux);
  }

  public async saveMethodElement() {
    if(this.methodElementFormGroup.valid) {
      let data = this.stringifyMethodElement();
      if(this.id !== undefined && this.id !== null) {
        this.endpointService.updateMethodElement(this.id, data).subscribe( data => {
          if(data === null) {
            this.uploadFigure()
            this._snackBar.open(this.typeStr + " updated!", 'X', {duration: 2000, panelClass: ['green-snackbar']});
            this.id = this.methodElement.id
            this.refreshAndRoute()
            return true;
          } else {
            this._snackBar.open(data['error'], 'X', {duration: 2000, panelClass: ['green-snackbar']});
            return false;
          }
        })
      } else {
        this.endpointService.addMethodElement(data).subscribe( data => {
          if(data['error'] === undefined) {
            this.id = this.methodElement.id
            this.uploadFigure();
            this._snackBar.open(this.typeStr + " added!", 'X', {duration: 2000, panelClass: ['green-snackbar']});
            this.refreshAndRoute()
            return true;
          } else {
            this._snackBar.open(data['error'], 'X', {duration: 2000, panelClass: ['green-snackbar']});
            return false
          }
        })
      }
      return true;
    } else {
      this._snackBar.open("Missing required data", 'X', {duration: 2000, panelClass: ['green-snackbar']});
      return false
    }
  }

  private uploadFigure() {
    if(this.figureChanged) { 
      let figureFormData = new FormData()
      figureFormData.append('figure', this.figure)
      this.endpointService.addMethodElementFigure(this.id, figureFormData).subscribe(data => {
        this._snackBar.open("Figure updated!", 'X', {duration: 2000, panelClass: ['green-snackbar']});
      })
    }
  }

  private refreshAndRoute() {
    this.navigatorService.refreshMethodElementList(this.type);
    if(this.reduced) this.router.navigate(['/method-element', this.id])
  }

  public deleteMethodElement() {
    this.endpointService.deleteMethodElement(this.id).subscribe( data => {
      this.navigateToList();
    })
  }

  public navigateToList() {
    this.navigatorService.refreshMethodElementList(this.type);
    if(this.type == 1) this.router.navigate(['/tools'])
    if(this.type == 2) this.router.navigate(['/artefacts'])
    if(this.type == 3) this.router.navigate(['/activities'])
    if(this.type == 4) this.router.navigate(['/roles'])
  }

  public changeEditStatus() {
    this.edit = !this.edit
    if(this.methodElementFormGroup.controls['name'].disabled) this.methodElementFormGroup.controls['name'].enable();
    else this.methodElementFormGroup.controls['name'].disable();
    if(this.methodElementFormGroup.controls['abstract'].disabled) this.methodElementFormGroup.controls['abstract'].enable();
    else this.methodElementFormGroup.controls['abstract'].disable();
    if(this.methodElementFormGroup.controls['description'].disabled) this.methodElementFormGroup.controls['description'].enable();
    else this.methodElementFormGroup.controls['description'].disable();
    if(this.methodElementFormGroup.controls['figure'].disabled) this.methodElementFormGroup.controls['figure'].enable();
    else this.methodElementFormGroup.controls['figure'].disable();
  }

  public droppedStructRel(event) {
    if(event.item.data.id === this.id) {
      this._snackBar.open("Invalid relation", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return;
    }
    if(this.methodElement.me_struct_rel_from.findIndex((element) => element.id == event.item.data.id) == -1 && 
    this.methodElement.activity_rel_from.findIndex((element) => element.id == event.item.data.id) == -1 && 
    this.methodElement.artefact_rel_from.findIndex((element) => element.id == event.item.data.id) == -1) {
      let relation = {id: event.item.data.id, rel: null}
      this.methodElement.me_struct_rel_from.push(relation);
    } else {      
      this._snackBar.open("Invalid relation", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }
  }

  public droppedActivityEvent(event) {
    if(event.item.data.id === this.id) {
      this._snackBar.open("Invalid relation", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return;
    }
    if(this.methodElement.activity_rel_from.findIndex((element) => element.id == event.item.data.id) == -1 && 
    this.methodElement.me_struct_rel_from.findIndex((element) => element.id == event.item.data.id) == -1) {
      let relation = {id: event.item.data.id, rel: null}
      this.methodElement.activity_rel_from.push(relation);
    } else {      
      this._snackBar.open("Invalid relation", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }
  }

  public droppedArtefactRel(event) {
    if(event.item.data.id === this.id) {
      this._snackBar.open("Invalid relation", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return;
    }
    if(this.methodElement.artefact_rel_from.findIndex((element) => element.id == event.item.data.id) == -1 && 
    this.methodElement.me_struct_rel_from.findIndex((element) => element.id == event.item.data.id) == -1) {
      let relation = {id: event.item.data.id, rel: null}
      this.methodElement.artefact_rel_from.push(relation);
    } else {      
      this._snackBar.open("Invalid relation", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }
  }

  public selectedStructRel(i, value) {
    this.methodElement.me_struct_rel_from[i]['rel'] = value
  }

  public selectedActRel(i, value) {
    this.methodElement.activity_rel_from[i]['rel'] = value
  }

  public selectedArtRel(i, value) {
    this.methodElement.artefact_rel_from[i]['rel'] = value
  }

  public removeStructRel(index) {
    this.methodElement.me_struct_rel_from.splice(index, 1)
  }

  public removeActRel(index) {
    this.methodElement.activity_rel_from.splice(index, 1)
  }

  public removeArtRel(index) {
    this.methodElement.artefact_rel_from.splice(index, 1)
  }

  public fileChanged(event) {
    this.figureChanged = true;
    this.figure = event.target.files[0];
  }
  
}
