import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Repository } from 'src/app/models/repository';
import { EndpointService } from 'src/app/services/endpoint.service';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-repository-modal',
  templateUrl: './repository-modal.component.html',
  styleUrls: ['./repository-modal.component.css']
})

export class RepositoryModalComponent implements OnInit {
  modalTitle = "Select Repository";
  selectedTabIndex = 0;
  // Form
  showStatus = false;

  repositoryList: Repository[] = [];
  selectedRepository : Repository | null;

  selectRepositoryForm : FormGroup;
  updateRepositoryForm : FormGroup;
  createRepositoryForm : FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RepositoryModalComponent>,
    public navigatorService : NavigatorService,
    public endpointService : EndpointService,
    public _snackBar: MatSnackBar
  ) {  
    this.selectRepositoryForm = new FormGroup({
      selectedRepositoryControl: new FormControl()
    });

    this.updateRepositoryForm = new FormGroup({
      repositoryIdControl: new FormControl({value: '', disabled: true}),
      repositoryNameControl: new FormControl(''),
      repositoryDescriptionControl: new FormControl(),
      repositoryStatusSelectControl: new FormControl(),
    });

    this.createRepositoryForm = new FormGroup({
      repositoryIdControl: new FormControl(''),
      repositoryNameControl: new FormControl(''),
      repositoryDescriptionControl: new FormControl(''),
      repositoryStatusSelectControl: new FormControl(navigatorService.repositoryStatusList.find(s => s.name === 'Draft')?.id ?? 1),
    });

  }
  
  ngOnInit(): void {
    this.updateRepositoryList();
    this.endpointService.selectedRepository.subscribe((value) => { 
      this.setSelectedRepository(value);
    });
    this.navigatorService.repositoryList.subscribe((value) => { 
      this.repositoryList = value;
    });
    
  }

  changeTab(tab: number){
    this.selectedTabIndex = tab;
    switch (tab) {
      case 0:
        this.modalTitle = 'Select Repository';
        break;
      case 1:
        this.modalTitle = 'Update Repository';
        break;
      case 2:
        this.modalTitle = 'Create Repository';
        break;
      default:
    }
  }

  public updateRepositoryList() {
    this.navigatorService.refreshRepositoryList();
  }
  
  public onSelectRepository(selectedRepositoryID) {
    var repository = this.navigatorService.repositoryList.value.find(r => r.id === selectedRepositoryID) ?? null;
    console.log("onSelectRepository", selectedRepositoryID, repository);
    this.endpointService.selectedRepository.next(repository); // selectedRepository is set through subscription in ngOnInit
    this._snackBar.open("Repository " + (repository?.name ?? "X") + " selected", "Close", {duration: 5000});
  }
  
  public setSelectedRepository(repository : Repository | null){
    this.selectedRepository = repository;
    this.selectRepositoryForm.controls['selectedRepositoryControl'].setValue(repository?.id);

    this.updateRepositoryForm.controls['repositoryIdControl'].setValue(repository?.id);
    this.updateRepositoryForm.controls['repositoryNameControl'].setValue(repository?.name);
    this.updateRepositoryForm.controls['repositoryDescriptionControl'].setValue(repository?.description);
    this.updateRepositoryForm.controls['repositoryStatusSelectControl'].setValue(repository?.status.id);
  }

  public closeDialog() {
    this.dialogRef.close();
    this.selectedTabIndex = 0;
  }

  public onSubmit() {
    if (this.selectedTabIndex == 1) {
      this.endpointService.updateRepository(this.selectedRepository?.id, this.serializeRepositoryForm(this.updateRepositoryForm, this.selectedRepository)).subscribe(data => {
        this.updateRepositoryList();
        this.endpointService.selectedRepository.next(Repository.fromJson(data)); // selectedRepository is set through subscription in ngOnInit
      });
    } else {
      this.endpointService.addRepository(this.serializeRepositoryForm(this.createRepositoryForm)).subscribe(data => {
        this.updateRepositoryList();
        var repository = Repository.fromJson(data);
        this.endpointService.selectedRepository.next(repository); // selectedRepository is set through subscription in ngOnInit
        this._snackBar.open("Repository " + (repository?.name ?? "X") + " created", "Close", {duration: 5000});
        this.changeTab(0);
      });
    }
    this.closeDialog();
  }

  public deleteSelectedRepository() {
    if (this.selectedRepository == null) {
      this._snackBar.open("No repository selected", "Close", {duration: 2000});
    } else {
      this.endpointService.deleteRepository(this.selectedRepository.id).subscribe(data => {
        this.updateRepositoryList();
        this.endpointService.selectedRepository.next(null);
        this._snackBar.open("Repository deleted successfully", "Close", {duration: 2000});
      });
    }
  }

  private serializeRepositoryForm(formGroup: FormGroup, fallback : Repository | null = null): Repository {
    var r = new Repository(
      formGroup.controls['repositoryIdControl']?.value ?? fallback?.id,
      formGroup.controls['repositoryNameControl']?.value ?? fallback?.name,
      formGroup.controls['repositoryDescriptionControl']?.value ?? fallback?.description,
      formGroup.controls['repositoryStatusSelectControl']?.value ?? fallback?.status,
      fallback?.inUse ?? false // false upon creation
    );
    //console.log('Serialized context: ', c);
    return r;
  }
}