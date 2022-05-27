import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-method-element-list',
  templateUrl: './method-element-list.component.html',
  styleUrls: ['./method-element-list.component.css']
})
export class MethodElementListComponent implements OnInit {

  public loading = true;
  public type: number | undefined = 0;
  public methodElementList: any[] = [];

  constructor(
    private endpointService: EndpointService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.type = this.getTypeId(this.router.url.slice(1));


    this.endpointService.getAllMethodElementsByType(this.type).subscribe(data => {
      console.log(data)
      this.methodElementList = data;
    })
  }

  private getTypeId(type) {
    if(type == "tools") return 1;
    if(type == "artefacts") return 2;
    if(type == "activities") return 3;
    if(type == "roles") return 4;
  }

}
