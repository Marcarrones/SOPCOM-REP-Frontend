import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-map-detail',
  templateUrl: './map-detail.component.html',
  styleUrls: ['./map-detail.component.css']
})
export class MapDetailComponent implements OnInit {
  
  public id;

  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public navigatorService: NavigatorService
  ) { }

  ngOnInit(): void {
    //this.id = this.route.snapshot.paramMap.get('id')!;
  }
/*
  public saveCriterion() {
    this.mapComponent.saveCriterion();
  }

  public deleteCriterion() {
    this.criterionComponent.deleteCriterion();
  }

  public goBack() {
    if((this.criterionComponent.edit && confirm("Are you sure you want to stop editing? Unsaved changes will be lost!")) || !this.criterionComponent.edit) {
      this.router.navigate(['/criterions'])
    }
  }
*/
}