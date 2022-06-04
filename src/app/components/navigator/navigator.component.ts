import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointService } from 'src/app/services/endpoint.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {

  constructor(
    private endpointService: EndpointService,
    private router: Router,
    public navigatorService: NavigatorService
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.endpointService.getAllMethodChunk().subscribe(chunks => {
      this.navigatorService.methodChunkList = chunks;
    })

    this.endpointService.getAllMethodElementsByType(1).subscribe(tools => {
      this.navigatorService.toolList = tools;
    })
    this.endpointService.getAllMethodElementsByType(2).subscribe(artefacts => {
      this.navigatorService.artefactList = artefacts;
    })
    this.endpointService.getAllMethodElementsByType(3).subscribe(activities => {
      this.navigatorService.activityList = activities;
    })
    this.endpointService.getAllMethodElementsByType(4).subscribe(roles => {
      this.navigatorService.roleList = roles
    })
  }

  public tabChanged(event) {
    if(event.index == 0) this.router.navigate(['/method-chunks'])
    if(event.index == 1) this.router.navigate(['/tools'])
    if(event.index == 2) this.router.navigate(['/artefacts'])
    if(event.index == 3) this.router.navigate(['/activities'])
    if(event.index == 4) this.router.navigate(['/roles'])
  }

  public droppedNav(event){
    console.log(event)
  }
}
