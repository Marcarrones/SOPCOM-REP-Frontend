import { Injectable } from '@angular/core';
import { EndpointService } from './endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  public allowChange = true;
  public tableView = false;
  
  public methodChunkListwithMap: any[] = []
  public methodChunkFilteredListwithMap: any[] = []
  public methodChunkList: any[] = []
  public methodChunkFilteredList: any[] = []
  public toolList: any[] = []
  public toolFilteredList: any[] = []
  public mapList: any[] = []
  public mapFilteredList: any[] = []
  public artefactList: any[] = []
  public artefactFilteredList: any[] = []
  public activityList: any[] = []
  public activityFilteredList: any[] = []
  public roleList: any[] = []
  public roleFilteredList: any[] = []
  public criterionList: any[] = []
  public criterionFilteredList: any[] = []
  public goalList: any[] = []
  public strategyList: any[] = []

  public structRelTypes = []
  public activityRelTypes = []
  public artefactRelTypes = []

  public abstract = false;

  constructor(
    private endpointService: EndpointService
  ) { }

  public refreshMethodChunkList() {
    this.endpointService.getAllMethodChunk().subscribe(chunks => {
      chunks.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
      this.methodChunkList = chunks;
      this.methodChunkFilteredList = chunks;
    })
  }

  public refreshMethodChunkListwithMap() {
    this.endpointService.getAllMethodChunkwithMap().subscribe(chunkss => {
      chunkss.sort((a, b) => a.map.toLowerCase() > b.map.toLowerCase() ? 1 : a.map.toLowerCase() < b.map.toLowerCase() ? -1 : 0)
      this.methodChunkList = chunkss;
      this.methodChunkFilteredList = chunkss;
    })
  }

  public refreshMethodElementList(type) {
    this.endpointService.getAllMethodElementsByType(type).subscribe(me => {
      me.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
      if(type == 1) {
        this.toolList = me
        this.toolFilteredList = me
      }
      if(type == 2) {
        this.artefactList = me
        this.artefactFilteredList = me
      }
      if(type == 3){ 
        this.activityList = me
        this.activityFilteredList = me
      }
      if(type == 4){ 
        this.roleList = me
        this.roleFilteredList = me
      }
    })
  }

  public refreshCriterionList() {
    this.endpointService.getAllCriterions().subscribe(c => {
      c.sort((a, b) => a.criterionName.toLowerCase() > b.criterionName.toLowerCase() ? 1 : a.criterionName.toLowerCase() < b.criterionName.toLowerCase() ? -1 : 0)
      this.criterionList = c;
      this.criterionFilteredList = c;
    })
  }

  public refreshMapList() {
    this.endpointService.getAllMaps().subscribe(c => {
      c.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
      this.mapList = c;
      this.mapFilteredList = c;
    })
  }

  public getAllMethodElementRelationTypes() {    
    this.endpointService.getAllMethodElementRelationTypes().subscribe(data => {
      this.structRelTypes = data['me_struct_rel'];
      this.activityRelTypes = data['activity_rel'];
      this.artefactRelTypes = data['artefact_rel'];
    })
  }

  public refreshGoalList() {
    this.endpointService.getAllGoals().subscribe(data => {
      this.goalList = data;
    })
  }

  public refreshStrategyList() {
    this.endpointService.getAllStrategieswithMaps().subscribe(data => {
      this.strategyList = data;
    })
  }
}
