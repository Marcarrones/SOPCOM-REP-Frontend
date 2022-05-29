import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-method-element-detail',
  templateUrl: './method-element-detail.component.html',
  styleUrls: ['./method-element-detail.component.css']
})
export class MethodElementDetailComponent implements OnInit {

  public params;
  public id;

  constructor(
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(params => {
      this.params = params;
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log(this.params)
  }

}
