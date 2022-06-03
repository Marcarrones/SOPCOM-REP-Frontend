import { Injectable } from '@angular/core';
import { EndpointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  public methodChunkList: any[] = []
  public toolList: any[] = []
  public artefactList: any[] = []
  public activityList: any[] = []
  public roleList: any[] = []
  public criterionList: any[] = []

  constructor(
    private endpointService: EndpointService
  ) { }

  public refreshMethodChunkList() {
    this.endpointService.getAllMethodChunk().subscribe(chunks => {
      this.methodChunkList = chunks;
    })
  }

  public refreshMethodElementList(type) {
    this.endpointService.getAllMethodElementsByType(type).subscribe(me => {
      if(type == 1) this.roleList = me
      if(type == 2) this.artefactList = me
      if(type == 3) this.activityList = me
      if(type == 4) this.roleList = me
    })
  }
}
