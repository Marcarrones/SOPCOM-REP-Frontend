import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { MethodElementComponent } from '../method-element.component';

@Component({
  selector: 'app-method-element-detail',
  templateUrl: './method-element-detail.component.html',
  styleUrls: ['./method-element-detail.component.css']
})
export class MethodElementDetailComponent implements OnInit {

  public params;
  public id;
  public edit = false;

  @ViewChild(MethodElementComponent) meComponent: MethodElementComponent;

  constructor(
    private route: ActivatedRoute,
    private navigatorService: NavigatorService
  ) {
    this.route.data.subscribe(params => {
      this.params = params;
    });
  }

  ngOnInit(): void {
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
