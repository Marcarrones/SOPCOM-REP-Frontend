import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MethodChunkComponent } from './components/method-chunk/method-chunk.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path: 'method-chunk', component: MethodChunkComponent},
  //{path: 'tool', component: MethodElementComponent},
  //{path: 'artefact', component: MethodChunkComponent},
  //{path: 'activity', component: MethodChunkComponent},
  //{path: 'role', component: MethodChunkComponent},
  //{path: 'criterion', component: MethodChunkComponent},
  //{path: '', component: HomeComponent},
  //{path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
