import { Injectable } from '@angular/core';
import { Values } from 'src/utils/values';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  constructor(
    private http: HttpClient
  ) { }

  private URL = Values.SERVER_URL2 + Values.SERVER_PORT2 + Values.ENTRY_FILE;
  private URL2 = Values.SERVER_URL2 + Values.SERVER_PORT2 + Values.ENTRY_FILE;

  public getAllMethodChunk() {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getAllMethodChunkwithMap() {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + 'maps';
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getMethodChunkById(id) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + id;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public addNewMethodChunk(data) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }


  public updateMethodChunk(id, data) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + id;
    return this.http.put<any[]>(request, data).pipe(map(response => response));
  }
  
  public deleteMethodChunk(id) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + id;
    return this.http.delete<any[]>(request).pipe(map(response => response));
  }

  public getAllMethodElementsByType(type) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '?type=' + type;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getMethodElement(id) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public updateMethodElement(id, data) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id;
    return this.http.put<any[]>(request, data).pipe(res => res);
  }

  public addMethodElement(data) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }

  public deleteMethodElement(id) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id;
    return this.http.delete<any[]>(request).pipe(map(response => response));
  }

  public getAllMethodElementRelationTypes() {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + Values.RESOURCES.RELATIONS + '/' + Values.RESOURCES.TYPES;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getAllCriterions() {
    const request = this.URL + Values.RESOURCES.CRITERION;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getAllMaps() {
    const request = this.URL2 + Values.RESOURCES.MAPS;  
    //return this.http.get<any[]>('http://localhost:1031/index.php/maps').pipe(map(response => response));
    return this.http.get<any[]>(Values.URL_V2 + 'maps').pipe(map(response => response));
  }

  public getMap(id) {
    const request = this.URL2 + Values.RESOURCES.MAPS + '/' + id;
    //return this.http.get<any[]>('http://gessi3.essi.upc.edu:1031/index.php/maps/' + id);
    return this.http.get<any[]>(Values.URL_V2 + 'maps/' + id);
  }

  public goalStrategies(name) {
    const request = this.URL2 + Values.RESOURCES.GOAL + '/' + name;
    return this.http.get<any[]>(Values.URL_V2 + 'goal/' + name + '/strategies').pipe(map(response => response));
  }

  public getMapGoals(id) {
    const request = this.URL2 + Values.RESOURCES.MAPS + '/' + id;
    return this.http.get<any[]>(Values.URL_V2 + 'maps/' + id + '/goals');
  }

  public addMap(data) {
    const request = this.URL2 + Values.RESOURCES.MAPS;
    return this.http.post<any>(Values.URL_V2 + 'maps', data)
  }

  public updateMap(id, data) {
    const request = this.URL2 + Values.RESOURCES.MAPS;
    return this.http.put<any>(Values.URL_V2 + 'maps' + '/' + id, data).pipe(map(response => response));
  }

  public updateGoal(id, data) {
    const request = this.URL2 + Values.RESOURCES.GOAL;
    return this.http.put<any>(Values.URL_V2 + 'goal' + '/' + id, data)
  }

  public updateStrategy(id, data) {
    //const request = this.URL2 + Values.RESOURCES.GOAL;
    return this.http.put<any>(Values.URL_V2 + 'strategy' + '/' + id, data)
  }

  public deleteMap(id) {
    const request = this.URL2 + Values.RESOURCES.MAPS + '/' + id;
    return this.http.delete<any[]>(Values.URL_V2 + 'maps' + '/' + id);
  }

  
  public deleteGoalfromMap(id) {
    const request = this.URL2 + Values.RESOURCES.MAPS + '/' + id;
    return this.http.delete<any[]>(Values.URL_V2 + 'goal' + '/' + id);
  }

  public deleteStrategyfromMap(id) {
    const request = this.URL2 + Values.RESOURCES.MAPS + '/' + id;
    return this.http.delete<any[]>(Values.URL_V2 + 'strategy' + '/' + id);
  }
  

  public getCriterionById(id) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + id;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public addCriterion(data) {
    const request = this.URL + Values.RESOURCES.CRITERION;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }

  public updateCriterion(id, data) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + id;
    return this.http.put<any[]>(request, data).pipe(map(response => response));
  }

  public deleteCriterion(id) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + id;
    return this.http.delete<any[]>(request).pipe(map(response => response));
  }

  public getAllGoals() {
    const request = this.URL + Values.RESOURCES.GOAL;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getGoalsWithoutMap() {
    const request = this.URL + Values.RESOURCES.GOAL;
    return this.http.get<any[]>(Values.URL_V2 + 'goal/nomap');
  }

  public getAllStrategies() {
    const request = this.URL2 + Values.RESOURCES.STRATEGY;   
    return this.http.get<any[]>(Values.URL_V2 + 'strategy').pipe(map(response => response));
  }

  public getAllStrategieswithMaps() {
    const request = this.URL2 + Values.RESOURCES.STRATEGY;   
    return this.http.get<any[]>(Values.URL_V2 + 'strategy/maps');
  }

  public getMapStrategies(id) {
    const request = this.URL2 + Values.RESOURCES.STRATEGY;   
    return this.http.get<any[]>(Values.URL_V2 + 'maps/' + id + '/strategies').pipe(map(response => response));
  }

  public addNewGoal(data) {
    const request = this.URL + Values.RESOURCES.GOAL;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }
  public addNewStrategy(data) {
    const request = this.URL + Values.RESOURCES.STRATEGY;
    return this.http.post<any>(Values.URL_V2 + 'strategy', data)
  }

  public addNewGoal2(data) {
    const request = this.URL + Values.RESOURCES.GOAL;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }

  public addMethodElementFigure(id, figure) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id + '/image';
    return this.http.post<any[]>(request, figure).pipe(map(response => response));
  }
  
  public addValueCriterion(idC, data) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + idC + '/' + Values.RESOURCES.VALUES;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }
  
  public updateValueCriterion(idC, idV, data) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + idC + '/' + Values.RESOURCES.VALUES + '/' + idV;
    return this.http.put<any[]>(request, data).pipe(map(response => response));
  }
  
  public deleteValueCriterion(idC, idV) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + idC + '/' + Values.RESOURCES.VALUES + '/' + idV;
    return this.http.delete<any[]>(request).pipe(map(response => response));
  }
}
