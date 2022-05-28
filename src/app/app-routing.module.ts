import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MethodChunkComponent } from './components/method-chunk/method-chunk.component';
import { HomeComponent } from './components/home/home/home.component';
import { MethodElementComponent } from './components/method-element/method-element-detail/method-element.component';
import { MethodElementListComponent } from './components/method-element/method-element-list/method-element-list.component';

const routes: Routes = [
  {path: 'method-chunk', component: MethodChunkComponent},
  {path: 'tool/:id', component: MethodElementComponent},
  {path: 'tool', component: MethodElementComponent},
  {path: 'tools', component: MethodElementListComponent},
  {path: 'artefact/:id', component: MethodChunkComponent},
  {path: 'artefact', component: MethodChunkComponent},
  {path: 'artefacts', component: MethodElementListComponent},
  {path: 'activity/:id', component: MethodChunkComponent},
  {path: 'activity', component: MethodChunkComponent},
  {path: 'activities', component: MethodElementListComponent},
  {path: 'role', component: MethodChunkComponent},
  {path: 'roles', component: MethodElementListComponent},
  //{path: 'criterion', component: MethodChunkComponent},
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
