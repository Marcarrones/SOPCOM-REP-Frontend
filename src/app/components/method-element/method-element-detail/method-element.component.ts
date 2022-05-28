import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MethodElement } from 'src/app/models/method-element';
import { EndpointService } from 'src/app/services/endpoint.service';
@Component({
  selector: 'app-method-element',
  templateUrl: './method-element.component.html',
  styleUrls: ['./method-element.component.css']
})
export class MethodElementComponent implements OnInit {

  @Input() id: string;
  public typeStr: string;
  public type: number = 0;

  public loaded
  
  public methodElement;

  constructor(
    private endpointService: EndpointService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id2 = this.route.snapshot.paramMap.get('id')!;
    if(this.id === undefined && this.route.snapshot.paramMap.get('id')! !== null) this.id = this.route.snapshot.paramMap.get('id')!;
    console.log(this.id)
    this.typeStr = this.router.url.slice(1)
    this.type = this.getTypeId(this.router.url.slice(1));
    if(this.id !== undefined) {
      this.endpointService.getMethodElement(this.id).subscribe(data => {
        this.methodElement = this.parseMethodElement(data)
        setTimeout(() => {this.loaded = true;}, 2000)
        
      })
    } else {
      this.methodElement = new MethodElement("", "", false, "", "", this.type, [], [], []);
      this.loaded = true;
    }
  }

  private getTypeId(type): number {
    if(type == "tools") return 1;
    if(type == "artefacts") return 2;
    if(type == "activities") return 3;
    if(type == "roles") return 4;
    return 0;
  }

  private parseMethodElement(data) {
    return new MethodElement(data['0']['id'], data['0']['name'], data['0']['abstract'], data['0']['description'], data['0']['figure'], this.type, [], [], []);
  }

}
