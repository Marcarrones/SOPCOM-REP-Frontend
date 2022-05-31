import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-criterion',
  templateUrl: './criterion.component.html',
  styleUrls: ['./criterion.component.css']
})
export class CriterionComponent implements OnInit {

  @Input() id: number | null;

  constructor() { }

  ngOnInit(): void {
  }

}
