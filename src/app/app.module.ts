import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MethodChunkComponent } from './components/method-chunk/method-chunk.component';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home/home.component';
import { MethodElementComponent } from './components/method-element/method-element.component';
import { MethodElementListComponent } from './components/method-element/method-element-list/method-element-list.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MethodElementDialogComponent } from './components/method-element/method-element-dialog/method-element-dialog.component';
import { MethodElementDetailComponent } from './components/method-element/method-element-detail/method-element-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MethodChunkListComponent } from './components/method-chunk/method-chunk-list/method-chunk-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { AddNewValueDialog, CriterionComponent, RemoveValueDialog, UpdateCriterionDialog, UpdateValueDialog } from './components/criterion/criterion.component';
import { CriterionListComponent } from './components/criterion/criterion-list/criterion-list.component';
import { CriterionDetailComponent } from './components/criterion/criterion-detail/criterion-detail.component';
import { CriterionDialogComponent } from './components/criterion/criterion-dialog/criterion-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GoalComponent } from './components/goal/goal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MapComponent } from './components/Maps/map/map.component';
import { MapDetailComponent } from './components/Maps/map-detail/map-detail.component';
import { GrafComponent } from './components/Maps/graf/graf.component';
import { RepositoryModalComponent } from './components/repository-modal/repository-modal.component';
import { NoRepositorySelectedComponent } from './no-repository-selected/no-repository-selected.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    MethodChunkComponent,
    HomeComponent,
    MethodElementComponent,
    MethodElementListComponent,
    MethodElementDialogComponent,
    MethodElementDetailComponent,
    NavigatorComponent,
    MethodChunkListComponent,
    CriterionComponent,
    CriterionListComponent,
    CriterionDetailComponent,
    CriterionDialogComponent,
    GoalComponent,
    UpdateCriterionDialog,
    AddNewValueDialog,
    UpdateValueDialog,
    RemoveValueDialog,
    MapComponent,
    MapDetailComponent,
    GrafComponent,
    RepositoryModalComponent,
    NoRepositorySelectedComponent,
    
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    MatInputModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    AppRoutingModule,
    MatGridListModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTabsModule,
    MatDividerModule,
    MatIconModule,
    DragDropModule,
    MatSelectModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
