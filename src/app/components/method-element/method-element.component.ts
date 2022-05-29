import { Component, OnInit, Input } from '@angular/core';
import { MethodElement } from 'src/app/models/method-element';
import { EndpointService } from 'src/app/services/endpoint.service';
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

  constructor(
    private endpointService: EndpointService
  ) {
   }

  ngOnInit(): void {
    if(this.id !== undefined && this.id !== null && this.id !== "") {
      console.log("Hola")
      this.endpointService.getMethodElement(this.id).subscribe(data => {
        console.log(data)
        if(data['error'] !== undefined) {
          this.methodElement = this.parseMethodElement(data) 
        } else {
          this.methodElement = new MethodElement("", "", false, "", "", this.type, [], [], []);
        }
        setTimeout(() => {this.loaded = true;}, 2000)
      })
    } else {
      this.methodElement = new MethodElement("", "", false, "", "", this.type, [], [], []);
      this.loaded = true;
    }
  }

  private parseMethodElement(data) {
    return new MethodElement(data['0']['id'], data['0']['name'], data['0']['abstract'], data['0']['description'], data['0']['figure'], this.type, [], [], []);
  }

  public saveMethodElement() {
    let data = JSON.stringify(this.methodElement);
    if(this.id !== undefined) {
      this.endpointService.updateMethodElement(this.id, data).subscribe({

      })
    } else {
      this.endpointService.addMethodElement(data).subscribe({

      })
    }
  }

  public deleteMethodElement() {
    this.endpointService.deleteMethodElement(this.id).subscribe({

    })
  }
}
