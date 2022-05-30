import { Component, OnInit, Input } from '@angular/core';
import { MethodElement } from 'src/app/models/method-element';
import { EndpointService } from 'src/app/services/endpoint.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
@Component({
  selector: 'app-method-element',
  templateUrl: './method-element.component.html',
  styleUrls: ['./method-element.component.css']
})
export class MethodElementComponent implements OnInit {

  @Input() id: string;
  @Input() typeStr: string;
  @Input() type: number;

  public loaded
  
  public methodElement;

  public methodElementFormGroup: FormGroup = new FormGroup({});

  constructor(
    private endpointService: EndpointService
  ) {
  }

  ngOnInit(): void {
    if(this.id !== undefined && this.id !== null && this.id !== "") {
      this.endpointService.getMethodElement(this.id).subscribe(data => {
        if(data['error'] !== undefined) {
          this.methodElement = new MethodElement("", "", false, "", "", this.type, [], [], []);
        } else {
          this.methodElement = this.parseMethodElement(data) 
        }
        this.buildFormControl();
        console.log(this.methodElementFormGroup)
        console.log(this.methodElementFormGroup.get('id'))
        setTimeout(() => {this.loaded = true;}, 2000)
      })
    } else {
      this.methodElement = new MethodElement("", "", false, "", "", this.type, [], [], []);
      this.buildFormControl();
      this.loaded = true;
    }
  }

  private buildFormControl() {
    console.log(this.id)
    this.methodElementFormGroup = new FormGroup({
      id: new FormControl({value:this.methodElement.id, disabled: this.id !== undefined && this.id !== null}),
      name: new FormControl(this.methodElement.name),
      description: new FormControl(this.methodElement.description),
      abstract: new FormControl(this.methodElement.abstract),
      figure: new FormControl(this.methodElement.figure)
    })
    this.methodElementFormGroup.valueChanges.subscribe(values => {
      if(this.id === undefined || this.id === null) this.methodElement.id = values['id'];
      this.methodElement.name = values['name'];
      this.methodElement.description = values['description'];
      this.methodElement.abstract = values['abstract']
    })
  }

  private parseMethodElement(data) {
    return new MethodElement(data['0']['id'], data['0']['name'], data['0']['abstract'], data['0']['description'], data['0']['figure'], this.type, [], [], []);
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
}
