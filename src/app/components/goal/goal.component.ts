import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EndpointService } from 'src/app/services/endpoint.service';
import { NavigatorService } from 'src/app/services/navigator.service';

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
    private navigatorService: NavigatorService
  ) { }

  ngOnInit(): void {
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public saveGoal() {
    if(this.goal !== '') {
      if(this.navigatorService.goalList.findIndex(g => g.name == this.goal) !== -1) {
        this._snackBar.open("Duplicate name", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
      } else {
        let data = {name: this.goal};
        this.endpointService.addNewGoal(JSON.stringify(data)).subscribe(data => {
          this.closeDialog()
        })
      }
    } else {
      this._snackBar.open("Name is required", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    }
  }
}
