import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {

  public filterChunk = "name";
  public filterControlChunk: FormControl;
  public filterTool = "name";
  public filterControlTool: FormControl;
  public filterArtefact = "name";
  public filterControlArtefact: FormControl;
  public filterActivity = "name";
  public filterControlActivity: FormControl;
  public filterRole = "name";
  public filterControlRole: FormControl;
  public filterCriterion = "name";
  public filterControlCriterion: FormControl;
  public filterMap = "name";
  public filterControlMap: FormControl;

  constructor(
    private router: Router,
    public navigatorService: NavigatorService
  ) { }

  ngOnInit(): void {
    this.initializeFilters();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.navigatorService.refreshMethodChunkList();

    this.navigatorService.refreshMethodElementList(1);
    this.navigatorService.refreshMethodElementList(2);
    this.navigatorService.refreshMethodElementList(3);
    this.navigatorService.refreshMethodElementList(4);
    this.navigatorService.refreshMethodElementList(6);

    this.navigatorService.refreshCriterionList();
    this.navigatorService.refreshMapList();

    this.navigatorService.getAllMethodElementRelationTypes();

    this.navigatorService.refreshGoalList();
  }

  public tabChanged(event) {
    if(this.navigatorService.allowChange) {
      if(event.index == 0) this.router.navigate(['/method-chunks'])
      if(event.index == 1) this.router.navigate(['/tools'])
      if(event.index == 2) this.router.navigate(['/artefacts'])
      if(event.index == 3) this.router.navigate(['/activities'])
      if(event.index == 4) this.router.navigate(['/roles'])
      if(event.index == 5) this.router.navigate(['/criterions'])
      if(event.index == 6) this.router.navigate(['/maps'])
    }
  }

  public initializeFilters() {
    this.filterControlChunk = new FormControl("");
    this.filterControlChunk.valueChanges.subscribe(value => {
      if(this.filterChunk == 'id') {
        this.navigatorService.methodChunkList.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : a.id.toLowerCase() < b.id.toLowerCase() ? -1 : 0)
        this.navigatorService.methodChunkFilteredList = this.navigatorService.methodChunkList.filter(t => t.id.toLowerCase().includes(value.toLowerCase()))
      } else if(this.filterChunk == 'name') {
        this.navigatorService.methodChunkList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
        this.navigatorService.methodChunkFilteredList = this.navigatorService.methodChunkList.filter(t => t.name.toLowerCase().includes(value.toLowerCase()))
      }
    })
    this.filterControlTool = new FormControl("");
    this.filterControlTool.valueChanges.subscribe(value => {
      if(this.filterTool == 'id') {
        this.navigatorService.toolList.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : a.id.toLowerCase() < b.id.toLowerCase() ? -1 : 0)
        this.navigatorService.toolFilteredList = this.navigatorService.toolList.filter(t => t.id.toLowerCase().includes(value.toLowerCase()))
      } else if(this.filterTool == 'name') {
        this.navigatorService.toolList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
        this.navigatorService.toolFilteredList = this.navigatorService.toolList.filter(t => t.name.toLowerCase().includes(value.toLowerCase()))
      }
    })
    this.filterControlArtefact = new FormControl("");
    this.filterControlArtefact.valueChanges.subscribe(value => {
      if(this.filterArtefact == 'id') {
        this.navigatorService.artefactList.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : a.id.toLowerCase() < b.id.toLowerCase() ? -1 : 0)
        this.navigatorService.artefactFilteredList = this.navigatorService.artefactList.filter(ar => ar.id.toLowerCase().includes(value.toLowerCase()))
      } else if(this.filterArtefact == 'name') {
        this.navigatorService.artefactList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
        this.navigatorService.artefactFilteredList = this.navigatorService.artefactList.filter(ar => ar.name.toLowerCase().includes(value.toLowerCase()))
      }
    })
    this.filterControlActivity = new FormControl("");
    this.filterControlActivity.valueChanges.subscribe(value => {
      if(this.filterActivity == 'id') {
        this.navigatorService.activityList.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : a.id.toLowerCase() < b.id.toLowerCase() ? -1 : 0)
        this.navigatorService.activityFilteredList = this.navigatorService.activityList.filter(ac => ac.id.toLowerCase().includes(value.toLowerCase()))
      } else if(this.filterActivity == 'name') {
        this.navigatorService.activityList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
        this.navigatorService.activityFilteredList = this.navigatorService.activityList.filter(ac => ac.name.toLowerCase().includes(value.toLowerCase()))
      }
    })
    this.filterControlRole = new FormControl("");
    this.filterControlRole.valueChanges.subscribe(value => {
      if(this.filterRole == 'id') {
        this.navigatorService.roleList.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : a.id.toLowerCase() < b.id.toLowerCase() ? -1 : 0)
        this.navigatorService.roleFilteredList = this.navigatorService.roleList.filter(r => r.id.toLowerCase().includes(value.toLowerCase()))
      } else if(this.filterRole == 'name') {
        this.navigatorService.roleList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
        this.navigatorService.roleFilteredList = this.navigatorService.roleList.filter(r => r.name.toLowerCase().includes(value.toLowerCase()))
      }
    })
    this.filterControlCriterion = new FormControl("");
    this.filterControlCriterion.valueChanges.subscribe(value => {
      this.navigatorService.criterionList.sort((a, b) => a.criterionName.toLowerCase() > b.criterionName.toLowerCase() ? 1 : a.criterionName.toLowerCase() < b.criterionName.toLowerCase() ? -1 : 0)
      this.navigatorService.criterionFilteredList = this.navigatorService.criterionList.filter(c => c.criterionName.toLowerCase().includes(value.toLowerCase()))
    })
    this.filterControlMap = new FormControl("");
    this.filterControlMap.valueChanges.subscribe(value => {
      if(this.filterMap == 'id') {
        this.navigatorService.mapList.sort((a, b) => a.id.toLowerCase() > b.id.toLowerCase() ? 1 : a.id.toLowerCase() < b.id.toLowerCase() ? -1 : 0)
        this.navigatorService.mapFilteredList = this.navigatorService.mapList.filter(t => t.id.toLowerCase().includes(value.toLowerCase()))
      } else if(this.filterMap == 'name') {
        this.navigatorService.mapList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
        this.navigatorService.mapFilteredList = this.navigatorService.mapList.filter(t => t.name.toLowerCase().includes(value.toLowerCase()))
      }
    })
  }
}
