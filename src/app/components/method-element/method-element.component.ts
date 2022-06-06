import { Component, OnInit, Input } from '@angular/core';
import { MethodElement } from 'src/app/models/method-element';
import { EndpointService } from 'src/app/services/endpoint.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
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
        console.log(this.methodElement)
        console.log(JSON.stringify(this.methodElement))
        setTimeout(() => {this.loaded = true;}, 2000)
      })
    } else {
      this.methodElement = new MethodElement("", "", false, "", "", this.type, [], [], []);
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
      type: this.methodElement.type
    };
  }

  public saveMethodElement() {
    let data = JSON.stringify(this.methodElement);
    if(this.id !== undefined && this.id !== null) {
      console.log("Update method element", this.methodElement, this.methodElementFormGroup.controls['description'])
      this.endpointService.updateMethodElement(this.id, data).subscribe( data => {
        console.log("UPDATE", data)
      })
    } else {
      console.log("Post method element", this.methodElement)
      this.endpointService.addMethodElement(data).subscribe( data => {
        console.log("POST", data)
      })
    }
  }

  public deleteMethodElement() {
    console.log("Delete method element", this.methodElement)
    this.endpointService.deleteMethodElement(this.id).subscribe( data => {
      console.log("DELETE", data)
    })
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

  public dropped(event) {
    console.log(event)
  }
}
