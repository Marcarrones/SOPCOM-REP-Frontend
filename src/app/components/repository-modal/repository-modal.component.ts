import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Repository } from 'src/app/models/repository';
import { EndpointService } from 'src/app/services/endpoint.service';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-repository-modal',
  templateUrl: './repository-modal.component.html',
  styleUrls: ['./repository-modal.component.css']
})

export class RepositoryModalComponent implements OnInit {
  // Form

  repositoryList : Repository[];
  selectRepositoryID : string;
  showStatus = false;


  repositoryForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(),
    status : new FormControl(1)
  });

  constructor(
    public dialogRef: MatDialogRef<RepositoryModalComponent>,
    public navigatorService : NavigatorService,
    public endpointService : EndpointService
  ) { }

  ngOnInit(): void {
    this.updateRepositoryList();
    this.endpointService.selectedRepository.subscribe((value) => { this.loadRepository(value); });
  }

  public updateRepositoryList() {
    this.endpointService.getAllRepositories().subscribe(repositories => {
      repositories.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0);
      this.repositoryList = repositories;
    });
    this.navigatorService.refreshRepositoryList();
  }
  
    public loadRepository(repository : Repository | null){
      this.selectRepositoryID = repository?.id ?? "";
      if (repository != null){
        this.repositoryForm.setValue({id : repository!.id, name : repository!.name, description : repository!.description, status : repository.status})
        this.showStatus=true;
      } else {
        this.showStatus = false;
      }
    }

  public closeDialog() {
    this.dialogRef.close();
  }

  public saveDialog() {
    console.log(this.repositoryForm.controls['id'].value);
    let repoWithSameID = this.navigatorService.repositoryList.find(r => r.id == this.repositoryForm.controls['id'].value) != undefined;

    if (repoWithSameID) {
      this.updateRepository();
    } else {
      this.addRepository();
    }
    this.closeDialog();
  }

  public selectRepository(selectedRepositoryID) {
    this.endpointService.selectedRepository.next(this.navigatorService.repositoryList.find(r => r.id == selectedRepositoryID) ?? null);
  }

  public updateRepository() {
    let data = this.formToJSON();
    this.endpointService.updateRepository(this.repositoryForm.controls['id'].value, data)
      .subscribe(_ => {
        this.updateRepositoryList();
        this.endpointService.selectedRepository.next(this.formToRepository());
      });
  }

  public addRepository(){
    this.endpointService.addRepository(this.formToJSON())
      .subscribe(_ => this.updateRepositoryList() );
  }

  public deleteRepository() {
    this.endpointService.deleteRepository(this.selectRepositoryID);
    //this.endpointService.selectedRepository.next(null);
    //this.updateRepositoryList();
  }

  public formToJSON() {
    return JSON.stringify(this.formToRepository());
  }

  public formToRepository() : Repository {
      return {
      id : this.repositoryForm.controls['id'].value,
      name : this.repositoryForm.controls['name'].value,
      description : this.repositoryForm.controls['description'].value,
      status : this.repositoryForm.controls['status'].value ?? this.navigatorService.repositoryStatusList[0].id,
      }
    }
}