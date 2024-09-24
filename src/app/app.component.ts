import { Component, OnInit } from '@angular/core';
import { Repository } from './models/repository';
import { RepositoryModalComponent } from './components/repository-modal/repository-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EndpointService } from './services/endpoint.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public selectedRepository : Repository | null;

  constructor(
    private endpointSertvice : EndpointService,
    private matDialog: MatDialog
  )
  { }

  ngOnInit(): void {
    this.endpointSertvice.selectedRepository.subscribe((value) => {
      this.selectedRepository = value;
      console.log("app.component", this.selectedRepository);
    });
  }


  title = 'SOPCOM_personal-frontend';

  public openRepositoryModal() {
    this.matDialog.open(RepositoryModalComponent, {
      //width: '50%',
    });
  }
}
