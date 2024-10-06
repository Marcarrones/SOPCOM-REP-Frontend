import { Injectable } from '@angular/core';
import { Values } from 'src/utils/values';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Repository } from '../models/repository';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { Map } from '../models/map';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  public selectedRepository : BehaviorSubject<Repository | null> = new BehaviorSubject<Repository | null>(null);
  private repositoryParam : string = [Values.RESOURCES.REPOSITORY,'=', (this.selectedRepository == undefined ? '1' : (this.selectedRepository.value?.id))].join(''); // puto js 

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { 
    this.selectedRepository.subscribe((value) => { // updates the repositoryParam when the selectedRepository changes
      this.repositoryParam = [Values.RESOURCES.REPOSITORY,'=', (value == undefined ? '1' : value.id)].join(''); 
      this.router.navigate(['/']);
    }); 
  }
  private URL = Values.SERVER_URL + Values.SERVER_PORT_V3 + Values.ENTRY_FILE;
  //private URL2 = Values.SERVER_URL2 + Values.SERVER_PORT2 + Values.ENTRY_FILE;


// --------------- REPOSITORIES --------------- 
  public isRepoPublic() { 
    console.log("isRepoPublic", this.selectedRepository.value);
    return (this.selectedRepository.value?.status.name ?? 'Public') == 'Public';
  }


  // GET /index.php/repository/status
  public getRepositoryStatus() {
    const request = this.URL + Values.RESOURCES.REPOSITORY + '/' + Values.RESOURCES.STATUS;
    return this.http.get<any[]>(request).pipe(map(response => response));  
  }

  // GET /index.php/repository
  public getAllRepositories(){
    const request = this.URL + Values.RESOURCES.REPOSITORY;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // GET /index.php/repository/id
  public getRepository(id){
    const request = this.URL + Values.RESOURCES.REPOSITORY + '/' + id;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // POST /index.php/repository
  public addRepository(data){
    const request = this.URL + Values.RESOURCES.REPOSITORY;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }
  // PUT /index.php/repository
  public updateRepository(id, data){
    const request = this.URL + Values.RESOURCES.REPOSITORY + '/' + id;
    return this.http.put<any[]>(request, data).pipe(map(response => response));
  }
  // DELETE /index.php/repository/id
  public deleteRepository(id){
    const request = this.URL + Values.RESOURCES.REPOSITORY + '/' + id;
    var response = new BehaviorSubject<any>(1); // this is needed to ensure delete is sent even if caller isn't subscribing
    this.http.delete<any[]>(request).subscribe((x) => {
      response.next(x);
      response.complete();
    });
    return response;
  }

// --------------- METHOD CHUNKS --------------- 
  // GET /index.php/method-chunk
  public getAllMethodChunk() {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '?' + this.repositoryParam;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // GET /index.php/method-chunk/maps
  public getAllMethodChunkwithMap() {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + Values.RESOURCES.MAPS + '?' + this.repositoryParam;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // GET /index.php/:id
  public getMethodChunkById(id) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + id;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // POST /index.php/method-chunk
  public addNewMethodChunk(data) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }
  // PUT /index.php/method-chunk/:id
  public updateMethodChunk(id, data) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + id;
    return this.http.put<any[]>(request, data).pipe(map(response => response));
  }
  // DELETE /index.php/method-chunk/:id
  public deleteMethodChunk(id) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + id;
    return this.http.delete<any[]>(request).pipe(map(response => response));
  }

// ---------------  METHOD ELEMENTS --------------- 
  // GET /index.php/method-elements?type & repository
  public getAllMethodElementsByType(type) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '?type=' + type + '&' + this.repositoryParam;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // GET /index.php/method-elements/:id
  public getMethodElement(id) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // PUT /index.php/method-elements/:id
  public updateMethodElement(id, data) {
    console.log("updateMethodElement");
    console.log(data);
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id;
    return this.http.put<any[]>(request, data).pipe(res => res);
  }
  // POST /index.php/method-elements
  public addMethodElement(data) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }
  // DELETE /index.php/method-elements/:id
  public deleteMethodElement(id) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id;
    return this.http.delete<any[]>(request).pipe(map(response => response));
  }
  // GET /index.php/method-elements/relations/types
  public getAllMethodElementRelationTypes() {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + Values.RESOURCES.RELATIONS + '/' + Values.RESOURCES.TYPES;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  // ---------------  CRITERIONS --------------- 
  // GET /index.php/criterions
  public getAllCriterions() {
    const request = this.URL + Values.RESOURCES.CRITERION + '?' + this.repositoryParam;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // GET /index.php/criterion/:id
  public getCriterionById(id) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + id;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // POST /index.php/criterion
  public addCriterion(data) {
    const request = this.URL + Values.RESOURCES.CRITERION;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }
  // PUT /index.php/criterion/:id
  public updateCriterion(id, data) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + id;
    return this.http.put<any[]>(request, data).pipe(map(response => response));
  }
  // DELETE /index.php/criterion
  public deleteCriterion(id) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + id;
    return this.http.delete<any[]>(request).pipe(map(response => response));
  }

  // --------------- MAPS --------------- 
  // GET /index.php/maps
  public getAllMaps() : Observable<Map[]> {
    const request = this.URL + Values.RESOURCES.MAPS + '?' + this.repositoryParam;  
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // GET /index.php/maps/:id
  public getMap(id) : Observable<Map> {
    const request = this.URL + Values.RESOURCES.MAPS + '/' + id + '?fullMap=true';
    return this.http.get<any>(request).pipe(map(Map.fromJson));
  }
  // POST /index.php/maps
  public addMap(data) {
    const request = this.URL + Values.RESOURCES.MAPS;
    return this.http.post<any>(request, data)
  }
  // PUT /index.php/maps
  public updateMapName(id, name: string) {
    const request = this.URL + Values.RESOURCES.MAPS + '/' + id + '?' + this.repositoryParam;
    var response = new BehaviorSubject<any>(1); // this is needed to ensure updte is sent even if caller isn't subscribing
    this.http.put<any>(request, { name: name }).subscribe((x) => { 
      response.next(x); 
      response.complete();
    });
    return response;
  }
  // DELETE /index.php/maps/:id
  public deleteMap(id) {
    const request = this.URL + Values.RESOURCES.MAPS + '/' + id;
    return this.http.delete<any[]>(request);
  }
  // DELETE /index.php/goals/:id
  public deleteGoalfromMap(id) {
    const request = this.URL + Values.RESOURCES.GOAL + '/' + id;
    return this.http.delete<any[]>(request);
  }
  // GET /index.php/maps/:id/goals
  public getMapGoals(id) {
    const request = this.URL + Values.RESOURCES.MAPS + '/' + id + '/' + Values.RESOURCES.GOAL;
    return this.http.get<any[]>(request);
  }
  // GET /index.php/goals/:name
  public goalStrategies(name) {
    const request = this.URL + Values.RESOURCES.GOAL + '/' + name;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // PUT /index.php/goals
  public updateGoal(id, data) {
    const request = this.URL + Values.RESOURCES.GOAL + '/' + id;
    return this.http.put<any>(request, data)
  }
  // PUT /index.php/strategy/:id
  public updateStrategy(id, data) {
    const request = this.URL + Values.RESOURCES.STRATEGY + '/' + id;
    return this.http.put<any>(request, data)
  }
  // DELETE /index.php/strategy/:id
  public deleteStrategyfromMap(id) {
    const request = this.URL + Values.RESOURCES.STRATEGY + '/' + id;
    return this.http.delete<any[]>(request);
  }
  // GET /index.php/goals
  public getAllGoals() {
    const request = this.URL + Values.RESOURCES.GOAL;
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // GET /index.php/goals/nomap
  public getGoalsWithoutMap() {
    const request = this.URL + Values.RESOURCES.GOAL + '/nomap';
    return this.http.get<any[]>(request);
  }
  // GET /index.php/strategy
  public getAllStrategies() {
    const request = this.URL + Values.RESOURCES.STRATEGY;   
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // GET /index.php/strategy/maps
  public getAllStrategieswithMaps() {
    const request = this.URL + Values.RESOURCES.STRATEGY + '/' + Values.RESOURCES.MAPS;   
    return this.http.get<any[]>(request);
  }
  // GET /index.php/maps/:id/strategy
  public getMapStrategies(id) {
    const request = this.URL + Values.RESOURCES.MAPS + '/' + id + '/' + Values.RESOURCES.STRATEGY;   
    return this.http.get<any[]>(request).pipe(map(response => response));
  }
  // POST /index.php/goals
  public addNewGoal(data) {
    const request = this.URL + Values.RESOURCES.GOAL;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }
  // POST /index.php/strategy
  public addNewStrategy(data) {
    const request = this.URL + Values.RESOURCES.STRATEGY;
    return this.http.post<any>(request, data)
  }

/*public addNewGoal2(data) {
    const request = this.URL + Values.RESOURCES.GOAL;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }*/
  // POST /index.php/method-element/:id/image
  public addMethodElementFigure(id, figure) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id + '/image';
    return this.http.post<any[]>(request, figure).pipe(map(response => response));
  }
  // POST /index.php/criterion/:idC/values
  public addValueCriterion(idC, data) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + idC + '/' + Values.RESOURCES.VALUES;
    return this.http.post<any[]>(request, data).pipe(map(response => response));
  }
  // PUT /index.php/criterion/:idC/values/:idV
  public updateValueCriterion(idC, idV, data) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + idC + '/' + Values.RESOURCES.VALUES + '/' + idV;
    return this.http.put<any[]>(request, data).pipe(map(response => response));
  }
  // DELETE /index.php/criterion/:idC/values/:idV
  public deleteValueCriterion(idC, idV) {
    const request = this.URL + Values.RESOURCES.CRITERION + '/' + idC + '/' + Values.RESOURCES.VALUES + '/' + idV;
    return this.http.delete<any[]>(request).pipe(map(response => response));
  }
}
