import { Component, Input, OnInit } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint.service';
import { MethodElement } from 'src/app/models/method-element';
import { MethodChunk } from 'src/app/models/method-chunk';
import { Goal } from 'src/app/models/goal';
import { Criterion } from 'src/app/models/criterion';

@Component({
  selector: 'app-method-chunk',
  templateUrl: './method-chunk.component.html',
  styleUrls: ['./method-chunk.component.css']
})
export class MethodChunkComponent implements OnInit {

  @Input() id: string;
  
  private methodChunk: MethodChunk;
  
  constructor(
    private endpoint: EndpointService
  ) { }

  ngOnInit(): void {
    if(this.id !== undefined) {
      this.endpoint.getMethodChunkById(this.id).subscribe(data => console.log(data))
    }
  }

}
