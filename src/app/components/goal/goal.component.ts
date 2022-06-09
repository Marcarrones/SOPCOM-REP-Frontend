import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EndpointService } from 'src/app/services/endpoint.service';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css']
})
export class GoalComponent implements OnInit {

  public goal = "";

  constructor(
    public dialogRef: MatDialogRef<GoalComponent>,
    public endpointService: EndpointService
  ) { }

  ngOnInit(): void {
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public saveGoal() {
    let data = {name: this.goal};
    console.log(data)
    this.endpointService.addNewGoal(JSON.stringify(data)).subscribe(data => {
      this.closeDialog()
    })
  }
}
