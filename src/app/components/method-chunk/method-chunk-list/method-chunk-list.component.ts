import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-method-chunk-list',
  templateUrl: './method-chunk-list.component.html',
  styleUrls: ['./method-chunk-list.component.css']
})
export class MethodChunkListComponent implements OnInit {

  constructor(
    public navigatorService: NavigatorService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

}
