import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { MethodElementComponent } from '../method-element.component';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-method-element-detail',
  templateUrl: './method-element-detail.component.html',
  styleUrls: ['./method-element-detail.component.css']
})
export class MethodElementDetailComponent implements OnInit {

  public params;
  public id;
  public edit = false;
  public editable = true;

  @ViewChild(MethodElementComponent) meComponent: MethodElementComponent;

  constructor(
    private route: ActivatedRoute,
    public navigatorService: NavigatorService,
    public endpointService: EndpointService
  ) {
    this.route.data.subscribe(params => {
      this.params = params;
    });
  }

  ngOnInit(): void {
    this.editable = !this.endpointService.isRepoPublic();
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  public saveMethodElement() {
    this.meComponent.saveMethodElement();
  }
  public deleteMethodElement() {
    this.meComponent.deleteMethodElement();
  }

  public changeEditStatus() {
    if((this.edit && confirm("Are you sure you want to stop editing? Unsaved changes will be lost!")) || !this.edit) {
      this.edit = !this.edit;
      this.navigatorService.allowChange = !this.navigatorService.allowChange;
      this.meComponent.changeEditStatus();
    }
  }

}
