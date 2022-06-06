import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MethodChunkComponent } from './components/method-chunk/method-chunk.component';
import { HomeComponent } from './components/home/home/home.component';
import { MethodElementDetailComponent } from './components/method-element/method-element-detail/method-element-detail.component';
import { MethodElementListComponent } from './components/method-element/method-element-list/method-element-list.component';
import { MethodChunkListComponent } from './components/method-chunk/method-chunk-list/method-chunk-list.component';
import { CriterionDetailComponent } from './components/criterion/criterion-detail/criterion-detail.component';
import { CriterionListComponent } from './components/criterion/criterion-list/criterion-list.component';

const routes: Routes = [
  {path: 'method-chunk/:id', component: MethodChunkComponent},
  {path: 'method-chunk', component: MethodChunkComponent},
  {path: 'method-chunks', component: MethodChunkListComponent},
  {path: 'tool/:id', component: MethodElementDetailComponent, data: {type: 1, typeStr: "tool"}},
  {path: 'tool', component: MethodElementDetailComponent, data: {type: 1, typeStr: "tool"}},
  {path: 'tools', component: MethodElementListComponent, data: {type: 1, typeStr: "tool"}},
  {path: 'artefact/:id', component: MethodElementDetailComponent, data: {type: 2, typeStr: "artefact"}},
  {path: 'artefact', component: MethodElementDetailComponent, data: {type: 2, typeStr: "artefact"}},
  {path: 'artefacts', component: MethodElementListComponent, data: {type: 2, typeStr: "artefact"}},
  {path: 'activity/:id', component: MethodElementDetailComponent, data: {type: 3, typeStr: "activity"}},
  {path: 'activity', component: MethodElementDetailComponent, data: {type: 3, typeStr: "activity"}},
  {path: 'activities', component: MethodElementListComponent, data: {type: 3, typeStr: "activity"}},
  {path: 'role/:id', component: MethodElementDetailComponent, data: {type: 4, typeStr: "role"}},
  {path: 'role', component: MethodElementDetailComponent, data: {type: 4, typeStr: "role"}},
  {path: 'roles', component: MethodElementListComponent, data: {type: 4, typeStr: "role"}},
  {path: 'criterion/:id', component: CriterionDetailComponent},
  {path: 'criterion', component: CriterionDetailComponent},
  {path: 'criterions', component: CriterionListComponent},
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
