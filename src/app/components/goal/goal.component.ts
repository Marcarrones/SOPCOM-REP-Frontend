import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    public endpointService: EndpointService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public saveGoal() {
    if(this.goal !== '') {
      let data = {name: this.goal};
      this.endpointService.addNewGoal(JSON.stringify(data)).subscribe(data => {
        this.closeDialog()
      })
    } else {
      this._snackBar.open("Name is required", 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }
  }
}
