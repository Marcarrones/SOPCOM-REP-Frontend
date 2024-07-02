import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { CriterionComponent } from '../criterion.component';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-criterion-detail',
  templateUrl: './criterion-detail.component.html',
  styleUrls: ['./criterion-detail.component.css']
})
export class CriterionDetailComponent implements OnInit {
  
  public editable = true;
  public id;

  @ViewChild(CriterionComponent) criterionComponent: CriterionComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public navigatorService: NavigatorService,
    public endpointService: EndpointService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.editable = !this.endpointService.isRepoPublic();
  }

  public saveCriterion() {
    this.criterionComponent.saveCriterion();
  }

  public deleteCriterion() {
    this.criterionComponent.deleteCriterion();
  }

  public goBack() {
    if((this.criterionComponent.edit && confirm("Are you sure you want to stop editing? Unsaved changes will be lost!")) || !this.criterionComponent.edit) {
      this.router.navigate(['/criterions'])
    }
  }

}
