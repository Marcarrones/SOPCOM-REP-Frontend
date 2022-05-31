import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MethodChunkComponent } from './components/method-chunk/method-chunk.component';
import { HomeComponent } from './components/home/home/home.component';
import { MethodElementDetailComponent } from './components/method-element/method-element-detail/method-element-detail.component';
import { MethodElementListComponent } from './components/method-element/method-element-list/method-element-list.component';
import { CriterionDetailComponent } from './components/criterion/criterion-detail/criterion-detail.component';
import { CriterionListComponent } from './components/criterion/criterion-list/criterion-list.component';

const routes: Routes = [
  {path: 'method-chunk/:id', component: MethodChunkComponent},
  {path: 'method-chunk', component: MethodChunkComponent},
  //{path: 'method-chunks', component: MethodChunkListComponent},
  {path: 'tool/:id', component: MethodElementDetailComponent, data: {type: 1, typeStr: "Tool"}},
  {path: 'tool', component: MethodElementDetailComponent, data: {type: 1, typeStr: "Tool"}},
  {path: 'tools', component: MethodElementListComponent, data: {type: 1, typeStr: "Tool"}},
  {path: 'artefact/:id', component: MethodElementDetailComponent, data: {type: 2, typeStr: "Artefact"}},
  {path: 'artefact', component: MethodElementDetailComponent, data: {type: 2, typeStr: "Artefact"}},
  {path: 'artefacts', component: MethodElementListComponent, data: {type: 2, typeStr: "Artefact"}},
  {path: 'activity/:id', component: MethodElementDetailComponent, data: {type: 3, typeStr: "Activity"}},
  {path: 'activity', component: MethodElementDetailComponent, data: {type: 3, typeStr: "Activity"}},
  {path: 'activities', component: MethodElementListComponent, data: {type: 3, typeStr: "Activity"}},
  {path: 'role/:id', component: MethodElementDetailComponent, data: {type: 4, typeStr: "Role"}},
  {path: 'role', component: MethodElementDetailComponent, data: {type: 4, typeStr: "Role"}},
  {path: 'roles', component: MethodElementListComponent, data: {type: 4, typeStr: "Role"}},
  {path: 'criterion/:id', component: CriterionDetailComponent},
  {path: 'criterion', component: CriterionDetailComponent},
  {path: 'criterions', component: CriterionListComponent},
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
