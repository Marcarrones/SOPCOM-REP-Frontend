import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointService } from 'src/app/services/endpoint.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {

  public filterChunk = 'id';
  public filterControlChunk: FormControl;
  public filterTool = "id";
  public filterControlTool: FormControl;
  public filterArtefact = "id";
  public filterControlArtefact: FormControl;
  public filterActivity = "id";
  public filterControlActivity: FormControl;
  public filterRole = "id";
  public filterControlRole: FormControl;

  constructor(
    private endpointService: EndpointService,
    private router: Router,
    public navigatorService: NavigatorService
  ) { }

  ngOnInit(): void {
    this.initializeFilters();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.endpointService.getAllMethodChunk().subscribe(chunks => {
      this.navigatorService.methodChunkList = chunks;
      this.navigatorService.methodChunkFilteredList = chunks;
    })

    this.endpointService.getAllMethodElementsByType(1).subscribe(tools => {
      this.navigatorService.toolList = tools;
      this.navigatorService.toolFilteredList = tools;
    })
    this.endpointService.getAllMethodElementsByType(2).subscribe(artefacts => {
      this.navigatorService.artefactList = artefacts;
      this.navigatorService.artefactFilteredList = artefacts;
    })
    this.endpointService.getAllMethodElementsByType(3).subscribe(activities => {
      this.navigatorService.activityList = activities;
      this.navigatorService.activityFilteredList = activities;
    })
    this.endpointService.getAllMethodElementsByType(4).subscribe(roles => {
      this.navigatorService.roleList = roles
      this.navigatorService.roleFilteredList = roles
    })
  }

  public tabChanged(event) {
    if(this.navigatorService.allowChange) {
      if(event.index == 0) this.router.navigate(['/method-chunks'])
      if(event.index == 1) this.router.navigate(['/tools'])
      if(event.index == 2) this.router.navigate(['/artefacts'])
      if(event.index == 3) this.router.navigate(['/activities'])
      if(event.index == 4) this.router.navigate(['/roles'])
    }
  }

  public initializeFilters() {
    this.filterControlChunk = new FormControl("");
    this.filterControlChunk.valueChanges.subscribe(value => {
      if(this.filterChunk == 'id') {
        this.navigatorService.methodChunkFilteredList = this.navigatorService.methodChunkList.filter(t => t.id.includes(value))
      } else if(this.filterChunk == 'name') {
        this.navigatorService.methodChunkFilteredList = this.navigatorService.methodChunkList.filter(t => t.name.includes(value))
      }
    })
    this.filterControlTool = new FormControl("");
    this.filterControlTool.valueChanges.subscribe(value => {
      if(this.filterTool == 'id') {
        this.navigatorService.toolFilteredList = this.navigatorService.toolList.filter(t => t.id.includes(value))
      } else if(this.filterTool == 'name') {
        this.navigatorService.toolFilteredList = this.navigatorService.toolList.filter(t => t.name.includes(value))
      }
    })
    this.filterControlArtefact = new FormControl("");
    this.filterControlArtefact.valueChanges.subscribe(value => {
      if(this.filterArtefact == 'id') {
        this.navigatorService.artefactFilteredList = this.navigatorService.artefactList.filter(t => t.id.includes(value))
      } else if(this.filterArtefact == 'name') {
        this.navigatorService.artefactFilteredList = this.navigatorService.artefactList.filter(t => t.name.includes(value))
      }
    })
    this.filterControlActivity = new FormControl("");
    this.filterControlActivity.valueChanges.subscribe(value => {
      if(this.filterActivity == 'id') {
        this.navigatorService.activityFilteredList = this.navigatorService.activityList.filter(t => t.id.includes(value))
      } else if(this.filterActivity == 'name') {
        this.navigatorService.activityFilteredList = this.navigatorService.activityList.filter(t => t.name.includes(value))
      }
    })
    this.filterControlRole = new FormControl("");
    this.filterControlRole.valueChanges.subscribe(value => {
      if(this.filterRole == 'id') {
        this.navigatorService.roleFilteredList = this.navigatorService.roleList.filter(t => t.id.includes(value))
      } else if(this.filterRole == 'name') {
        this.navigatorService.roleFilteredList = this.navigatorService.roleList.filter(t => t.name.includes(value))
      }
    })
  }
}
