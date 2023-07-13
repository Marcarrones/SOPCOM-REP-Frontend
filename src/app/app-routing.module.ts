import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { MethodChunkComponent } from './components/method-chunk/method-chunk.component';
import { HomeComponent } from './components/home/home/home.component';
import { MethodElementDetailComponent } from './components/method-element/method-element-detail/method-element-detail.component';
import { MethodElementListComponent } from './components/method-element/method-element-list/method-element-list.component';
import { MethodChunkListComponent } from './components/method-chunk/method-chunk-list/method-chunk-list.component';
import { CriterionDetailComponent } from './components/criterion/criterion-detail/criterion-detail.component';
import { CriterionListComponent } from './components/criterion/criterion-list/criterion-list.component';
import { MethodElementComponent } from './components/method-element/method-element.component';
import { CriterionComponent } from './components/criterion/criterion.component';
import { MapComponent } from './components/Maps/map/map.component';




@Injectable()
export class ConfirmDeactivateGuardMC implements CanDeactivate<MethodChunkComponent> {
    canDeactivate(target: MethodChunkComponent) {
        if (target.hasChanges) {
            return window.confirm('You have unsaved changes. Are you sure you want to leave?');
        }
        return true;
    }
}

@Injectable()
export class ConfirmDeactivateGuardME implements CanDeactivate<MethodElementDetailComponent> {
    canDeactivate(target: MethodElementDetailComponent) {
        if (target.navigatorService.allowChange) {
            return window.confirm('You have unsaved changes. Are you sure you want to leave?');
        }
        return true;
    }
}
@Injectable()
export class ConfirmDeactivateGuardC implements CanDeactivate<CriterionDetailComponent> {
    canDeactivate(target: CriterionDetailComponent) {
        if (target.navigatorService.allowChange) {
            return window.confirm('You have unsaved changes. Are you sure you want to leave?');
        }
        return true;
    }
}


@Injectable()
export class ConfirmDeactivateGuardM implements CanDeactivate<MapComponent> {
    canDeactivate(target: MapComponent) {
        if (target.navigatorService.allowChange) {
            return window.confirm('You have unsaved changes. Are you sure you want to leave?');
        }
        return true;
    }
}





const routes: Routes = [
  {path: 'method-chunk/:id', component: MethodChunkComponent, canDeactivate:[ConfirmDeactivateGuardMC]},
  {path: 'method-chunk', component: MethodChunkComponent, canDeactivate:[ConfirmDeactivateGuardMC]},
  //{path: 'method-chunks', component: MethodChunkListComponent},
  {path: 'tool/:id', component: MethodElementDetailComponent, data: {type: 1, typeStr: "tool"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'tool', component: MethodElementDetailComponent, data: {type: 1, typeStr: "tool"}, canDeactivate:[ConfirmDeactivateGuardME]},
  //{path: 'tools', component: MethodElementListComponent, data: {type: 1, typeStr: "tool"}},
  {path: 'artefact/:id', component: MethodElementDetailComponent, data: {type: 2, typeStr: "artefact"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'artefact', component: MethodElementDetailComponent, data: {type: 2, typeStr: "artefact"}, canDeactivate:[ConfirmDeactivateGuardME]},
  //{path: 'artefacts', component: MethodElementListComponent, data: {type: 2, typeStr: "artefact"}},
  {path: 'activity/:id', component: MethodElementDetailComponent, data: {type: 3, typeStr: "activity"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'activity', component: MethodElementDetailComponent, data: {type: 3, typeStr: "activity"}, canDeactivate:[ConfirmDeactivateGuardME]},
  //{path: 'activities', component: MethodElementListComponent, data: {type: 3, typeStr: "activity"}},
  {path: 'role/:id', component: MethodElementDetailComponent, data: {type: 4, typeStr: "role"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'role', component: MethodElementDetailComponent, data: {type: 4, typeStr: "role"}, canDeactivate:[ConfirmDeactivateGuardME]},
  //{path: 'roles', component: MethodElementListComponent, data: {type: 4, typeStr: "role"}},
  {path: 'criterion/:id', component: CriterionDetailComponent, canDeactivate:[ConfirmDeactivateGuardC]},
  {path: 'criterion', component: CriterionDetailComponent, canDeactivate:[ConfirmDeactivateGuardC]},
  //{path: 'criterions', component: CriterionListComponent},
  //{path: 'map/:id', component: MapComponent, canDeactivate:[ConfirmDeactivateGuardM]},
  //{path: 'map', component: MapComponent, canDeactivate:[ConfirmDeactivateGuardM]},
  {path: 'map/:id', component: MapComponent},
  {path: 'map', component: MapComponent},
  //maps
  {path: '**', redirectTo: 'method-chunk', pathMatch: 'full'},
  //??
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [
    ConfirmDeactivateGuardMC,
    ConfirmDeactivateGuardME,
    ConfirmDeactivateGuardC,
    ConfirmDeactivateGuardM
]
})
export class AppRoutingModule { }
