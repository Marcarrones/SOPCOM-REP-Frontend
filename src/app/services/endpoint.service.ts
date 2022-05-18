import { Injectable } from '@angular/core';
import { Values } from 'src/utils/values';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  constructor(
    private http: HttpClient
  ) { }

  private URL = Values.SERVER_URL + Values.SERVER_PORT + Values.ENTRY_FILE;

  public getMethodChunkById(id: string) {
    const request = this.URL + Values.RESOURCES.METHOD_CHUNK + '/' + id;
    console.log(request)
    return this.http.get<any[]>(request).pipe(map(response => response))
  }

}
