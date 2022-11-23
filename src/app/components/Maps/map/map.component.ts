import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { EndpointService } from 'src/app/services/endpoint.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(
    public navigatorService: NavigatorService,
    private router: Router,
    private endpointService: EndpointService,
  ) {  }

  ngOnInit(): void {
    
      /*this.criterion = new Criterion(null, "", []);
      this.edit = true;
      this.loadFormControls();
      this.loaded = true;*/
      this.navigatorService.allowChange = false;
    
  }

}
