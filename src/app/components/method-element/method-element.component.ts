import { Component, OnInit, Input } from '@angular/core';
import { MethodElement } from 'src/app/models/method-element';
import { EndpointService } from 'src/app/services/endpoint.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigatorService } from 'src/app/services/navigator.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
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
  @Input() relations = true;

  public loaded
  
  public methodElement;

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
          console.log(this.methodElement)
        }
        this.buildFormControl();
        console.log(this.methodElement)
        console.log(JSON.stringify(this.methodElement))
        this.loaded = true;
      })
    } else {
      this.methodElement = new MethodElement("", "", false, "", "", this.type, [], [], []);
      this.edit = true;
      this.navigatorService.allowChange = false;
      this.buildFormControl();
      this.loaded = true;
    }
    console.log(this.edit)
  }

  private buildFormControl() {
    this.methodElementFormGroup = new FormGroup({
      id: new FormControl({value:this.methodElement.id, disabled: (this.id !== undefined && this.id !== null) || !this.edit}),
      name: new FormControl({value:this.methodElement.name, disabled: !this.edit}),
      description: new FormControl({value:this.methodElement.description, disabled: !this.edit}),
      abstract: new FormControl({value:this.methodElement.abstract, disabled: !this.edit}),
      figure: new FormControl({value:this.methodElement.figure, disabled: !this.edit}) 
    })
    this.methodElementFormGroup.valueChanges.subscribe(values => {
      if(this.id === undefined || this.id === null) this.methodElement.id = values['id'];
      this.methodElement.name = values['name'];
      this.methodElement.description = values['description'];
      this.methodElement.abstract = values['abstract']
    })
  }

  private parseMethodElement(data) {
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

  public saveMethodElement() {
    let data = this.stringifyMethodElement();
    //let data = JSON.stringify(this.methodElement);
    console.log(data)
    if(this.id !== undefined && this.id !== null) {
      console.log("Update method element", this.methodElement, this.methodElementFormGroup.controls['description'])
      this.endpointService.updateMethodElement(this.id, data).subscribe( data => {
        console.log("UPDATE", data)
        this._snackBar.open(this.typeStr + " updated!", 'X', {duration: 2000, panelClass: ['green-snackbar']});
        this.navigatorService.refreshMethodElementList(this.type);
        this.router.navigate(['/home'])
      })
    } else {
      console.log("Post method element", this.methodElement)
      this.endpointService.addMethodElement(data).subscribe( data => {
        console.log("POST", data)
        this._snackBar.open(this.typeStr + " added!", 'X', {duration: 2000, panelClass: ['green-snackbar']});
        this.navigatorService.refreshMethodElementList(this.type);
        this.router.navigate(['/home'])
      })
    }
  }

  public deleteMethodElement() {
    console.log("Delete method element", this.methodElement)
    this.endpointService.deleteMethodElement(this.id).subscribe( data => {
      console.log("DELETE", data)
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
    console.log(this.methodElementFormGroup)
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
      console.log(relation)
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
}
