import { Injectable } from '@angular/core';
import { Values } from 'src/utils/values';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  constructor(
    private http: HttpClient
  ) { }

  private URL = Values.SERVER_URL + Values.SERVER_PORT + Values.ENTRY_FILE;

  public getAllMethodChunk() {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK;
    console.log(request)
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getMethodChunkById(id) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + id;
    console.log(request)
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getAllMethodElementsByType(type) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '?type=' + type;
    console.log(request)
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getMethodElement(id) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id;
    console.log(request)
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public updateMethodElement(id, data) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id;
    console.log(request, data)
    return new Observable;
    //return this.http.put<any[]>(request, data).pipe(map(response => response));
  }

  public addMethodElement(data) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT;
    console.log(request, data)
    return new Observable;
    //return this.http.post<any[]>(request, data).pipe(map(response => response));
  }

  public deleteMethodElement(id) {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + id;
    console.log(request)
    return new Observable;
    //return this.http.delete<any[]>(request).pipe(map(response => response));
  }

  public getAllMethodElementRelationTypes() {
    const request = this.URL + Values.RESOURCES.METHOD_ELEMENT + '/' + Values.RESOURCES.RELATIONS + '/' + Values.RESOURCES.TYPES;
    console.log(request);
    return this.http.get<any[]>(request).pipe(map(response => response));
  }

  public getAllCriterions() {
    const request = this.URL + Values.RESOURCES.CRITERION;
    return this.http.get<any[]>(request).pipe(map(response => response));
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
  
}
