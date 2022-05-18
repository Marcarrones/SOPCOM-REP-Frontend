import { Component, Input, OnInit } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-method-chunk',
  templateUrl: './method-chunk.component.html',
  styleUrls: ['./method-chunk.component.css']
})
export class MethodChunkComponent implements OnInit {

  @Input() id: string | undefined;

  constructor(
    private endpoint: EndpointService
  ) { }

  ngOnInit(): void {
    if(this.id !== undefined) {
      this.endpoint.getMethodChunkById(this.id).subscribe(data => console.log(data))
    }
  }

}
