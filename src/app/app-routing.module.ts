import { Injectable, NgModule } from '@angular/core';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { MethodChunkComponent } from './components/method-chunk/method-chunk.component';
import { MethodElementDetailComponent } from './components/method-element/method-element-detail/method-element-detail.component';
import { CriterionDetailComponent } from './components/criterion/criterion-detail/criterion-detail.component';
import { MapComponent } from './components/map/map.component';
import { NavigatorService } from './services/navigator.service';


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
    constructor(
        private navigatorService: NavigatorService
    ) {}
    canDeactivate(target: MethodElementDetailComponent) {
        if (this.navigatorService.allowChange) {
            return window.confirm('You have unsaved changes. Are you sure you want to leave?');
        }
        return true;
    }
}
@Injectable()
export class ConfirmDeactivateGuardC implements CanDeactivate<CriterionDetailComponent> {
    constructor(
        private navigatorService: NavigatorService
    ) {}
    canDeactivate(target: CriterionDetailComponent) {
        if (this.navigatorService.allowChange) {
            return window.confirm('You have unsaved changes. Are you sure you want to leave?');
        }
        return true;
    }
}


@Injectable()
export class ConfirmDeactivateGuardM implements CanDeactivate<MapComponent> {
    canDeactivate(target: MapComponent) {
        if (target.hasUnsavedChanges) {
            return window.confirm('You have unsaved changes. Are you sure you want to leave?');
        }
        return true;
    }
}





const routes: Routes = [
  {path: 'method-chunk/:id', component: MethodChunkComponent, canDeactivate:[ConfirmDeactivateGuardMC]},
  {path: 'method-chunk', component: MethodChunkComponent, canDeactivate:[ConfirmDeactivateGuardMC]},
  {path: 'tool/:id', component: MethodElementDetailComponent, data: {type: 1, typeStr: "tool"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'tool', component: MethodElementDetailComponent, data: {type: 1, typeStr: "tool"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'artefact/:id', component: MethodElementDetailComponent, data: {type: 2, typeStr: "artefact"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'artefact', component: MethodElementDetailComponent, data: {type: 2, typeStr: "artefact"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'activity/:id', component: MethodElementDetailComponent, data: {type: 3, typeStr: "activity"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'activity', component: MethodElementDetailComponent, data: {type: 3, typeStr: "activity"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'role/:id', component: MethodElementDetailComponent, data: {type: 4, typeStr: "role"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'role', component: MethodElementDetailComponent, data: {type: 4, typeStr: "role"}, canDeactivate:[ConfirmDeactivateGuardME]},
  {path: 'criterion/:id', component: CriterionDetailComponent, canDeactivate:[ConfirmDeactivateGuardC]},
  {path: 'criterion', component: CriterionDetailComponent, canDeactivate:[ConfirmDeactivateGuardC]},
  {path: 'map/:id', component: MapComponent},
  {path: 'map', component: MapComponent},
  {path: '**', redirectTo: 'method-chunk', pathMatch: 'full'},  
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
