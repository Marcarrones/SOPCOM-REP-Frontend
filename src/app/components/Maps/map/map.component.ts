import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { EndpointService } from 'src/app/services/endpoint.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public edit = false;
  @Input() id;
  public map;
  public loaded = false;

  constructor(
    public navigatorService: NavigatorService,
    private router: Router,
    private route: ActivatedRoute,
    private endpointService: EndpointService,
  ) {  }

  

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log(this.id);
    if(this.id !== undefined && this.id !== null &&  this.id !== "") {
      console.log(this.id);
      this.endpointService.getMapById(this.id).subscribe(data => {
        if(data['error'] === undefined) this.map = this.parseMap(data);
        else {
          this.edit = true;
          this.map = new Map(null);
          this.navigatorService.allowChange = false;
        }
        
        this.loaded = true;
      })

    } else {
      this.map = new Map(null);
      this.edit = true;
      this.loaded = true;
      this.navigatorService.allowChange = false;

    }
  }

  private parseMap(data) {
    this.edit = false;
    return new Map(data['id']);
  }


 
}
