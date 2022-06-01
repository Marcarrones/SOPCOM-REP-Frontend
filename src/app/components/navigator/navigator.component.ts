import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {

  public methodChunkList: any[] = []
  public toolList: any[] = []
  public artefactList: any[] = []
  public activityList: any[] = []
  public roleList: any[] = []
  public criterionList: any[] = []

  constructor(
    private endpointService: EndpointService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.endpointService.getAllMethodChunk().subscribe(chunks => {
      this.methodChunkList = chunks;
    })

    this.endpointService.getAllMethodElementsByType(1).subscribe(tools => {
      this.toolList = tools;
    })
    this.endpointService.getAllMethodElementsByType(2).subscribe(artefacts => {
      this.artefactList = artefacts;
    })
    this.endpointService.getAllMethodElementsByType(3).subscribe(activities => {
      this.activityList = activities;
    })
    this.endpointService.getAllMethodElementsByType(4).subscribe(roles => {
      this.roleList = roles
    })
  }

  public tabChanged(event) {
    if(event.index == 0) this.router.navigate(['/method-chunks'])
    if(event.index == 1) this.router.navigate(['/tools'])
    if(event.index == 2) this.router.navigate(['/artefacts'])
    if(event.index == 3) this.router.navigate(['/activities'])
    if(event.index == 4) this.router.navigate(['/roles'])
  }

}
