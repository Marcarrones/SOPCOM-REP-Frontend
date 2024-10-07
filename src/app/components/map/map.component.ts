import { Component, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { EndpointService } from 'src/app/services/endpoint.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataSet } from "vis-data/peer/esm/vis-data";
import { Network, Node, Edge, Data, IdType } from "vis-network/peer/esm/vis-network";
import { Map } from 'src/app/models/map';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Goal } from 'src/app/models/goal';
import { Strategy } from 'src/app/models/strategy';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { v4 as uuidv4 } from 'uuid';

enum EditMode {
  None,
  Goal,
  Strategy,  
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  @ViewChild("map", {static: true}) networkContainer!: ElementRef;
  get hasUnsavedChanges() { 
    return this.mapFormGroup.controls['mapName'].dirty || this.mapFormGroup.controls['mapId'].dirty;
  };
  
  editable : boolean = true;
  // Contains map name/id fields
  mapFormGroup: FormGroup;

  currentMap: Map | undefined;
  
  // Network Graph element
  networkGraph: Network | undefined;
  // Graph options
  // https://visjs.github.io/vis-network/docs/network/
  options: object = {
    physics: false,
    configure: { enabled: false },
    interaction: { 
      hover: true, 
      dragView: true,
    },
    manipulation: {
      enabled: false, // code manipulations still apply
      addNode: (nodeData: Node, callback: any) => this.createNewGoal(nodeData, callback),
      addEdge: (edgeData: Edge, callback: any) => this.createNewStrategy(edgeData, callback),  
    },
  }; 
  // Id of selected node element
  selectedId: IdType | undefined;
  // Contains goal/strategy name fields
  mapEditFormGroup: FormGroup;
  // Graph edit mode
  editMode: EditMode = EditMode.None;
  EditMode = EditMode;


  constructor(
    private navigatorService: NavigatorService,
    private endpointService: EndpointService,
    private dialogs: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {
      this.editable = !this.navigatorService.endpointService.isRepoPublic();

      this.mapFormGroup = new FormGroup({
        mapId: new FormControl({ value: '', disabled: !this.editable }, Validators.required),
        mapName: new FormControl({ value: '', disabled: !this.editable }, Validators.required),
      });

      this.mapEditFormGroup = new FormGroup({
        goalName: new FormControl({ value: '', disabled: !this.editable }),
        strategyName: new FormControl({ value: '', disabled: !this.editable }),
        updateName: new FormControl({ value: '', disabled: !this.editable && this.selectedId == undefined }),
      });
     }

  ngOnInit(){
    var id = this.route.snapshot.paramMap.get('id');
    if(id != null) {
      this.endpointService.getMap(id).subscribe((value) => {
        this.currentMap = value;
        this.mapFormGroup.controls['mapId'].setValue(this.currentMap.id);
        this.mapFormGroup.controls['mapId'].disable();
        this.mapFormGroup.controls['mapName'].setValue(this.currentMap.name);
        this.buildNetworkGraph(this.currentMap);
      });
    }
    console.log("ngOnInit", this.currentMap, this.mapEditFormGroup, this.mapFormGroup);
  }

  // Determines if can update, shows error message if not
  evaluateCanSubmit(isUpdate = false) : boolean {
    var id = this.mapFormGroup.controls['mapId'].value;
    var name = this.mapFormGroup.controls['mapName'].value;
    if (id == '' || name == ''){
      this._snackBar.open("Error! ID and Name cannot be empty", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    } else if(this.navigatorService.mapList.find(map => map.id == id) != undefined && !isUpdate) {
      this._snackBar.open("Error! ID already exists", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    } else {
      return true;
    }
    return false;
  }
  
  submitMap(){
    console.log("submitMap",this, this.currentMap, this.mapFormGroup, this.mapEditFormGroup);
    if (!this.editable)
      return; // Do nothing if not editable 
    var canSubmit = this.evaluateCanSubmit(this.currentMap != undefined);

    // Update
    if (this.currentMap != undefined && canSubmit) { 
        this.endpointService.updateMapName(this.currentMap.id, this.mapFormGroup.controls['mapName'].value).subscribe((_) => {
          this._snackBar.open("Map name updated!", 'X', {duration: 3000, panelClass: ['green-snackbar']});
          this.currentMap = this.currentMap!.clone(this.mapFormGroup.controls['mapName'].value);
          console.log("update", this.currentMap, _);
          this.navigatorService.refreshMapList();
      });
    } 
    // Add map
    else if (canSubmit) { 
      var body = {
        id: this.mapFormGroup.controls['mapId'].value,
        name: this.mapFormGroup.controls['mapName'].value,
        repository: this.endpointService.selectedRepository.value!.id
      };

      this.endpointService.addMap(body).subscribe((map) => {
        this._snackBar.open("Map added!", 'X', {duration: 3000, panelClass: ['green-snackbar']});
        this.navigatorService.refreshMapList();
        this.currentMap = Map.fromJson(map);
        this.buildNetworkGraph(this.currentMap);
      });
    }
  }

  buildNetworkData(map: Map | undefined) : Data {
    const nodes = new DataSet<Node>([]);
    const edges = new DataSet<Edge>([]);
    if (map != undefined) {
      map.goals.forEach(g => nodes.add(g.asNode()));
      map.strategies.forEach(s => {
        nodes.add(s.asNode());
        edges.add(s.asEdge());
      });
    }
    return { nodes, edges };
  }

  buildNetworkGraph(map: Map | undefined) {
    const data = this.buildNetworkData(map);
    console.log("Build Network Graph", map, data, this.networkGraph);
    this.networkGraph = new Network(this.networkContainer!.nativeElement, data, this.options);

    this.networkGraph.on("select", (params) => this.onSelectNode(params));
    this.networkGraph.on("dragEnd", (params) => this.onDragEnd(params));
  }

  instructions_popup() {    
    this.dialogs.open(InstructionsDialog, { width: '50%' })  
  } 

  //#region Network Graph Events
  onSelectNode(selectEvent: any) : Strategy | Goal | undefined {
    this.selectedId = selectEvent.nodes[0] ?? undefined;
    const node = this.selectedIsStrategy() ? 
        this.currentMap!.strategies.find(s => Strategy.findByIdType(s, this.selectedId!)) : 
        this.currentMap!.goals.find(g => g.id == this.selectedId);
    this.mapEditFormGroup.controls['updateName'].setValue(node?.name ?? '');
    console.log("Select", this.selectedId, this);
    return node;
  }

  onDragEnd(dragEndEvent: any) {
    const node = this.onSelectNode(dragEndEvent); // SelectEvent is called before DragEnd
    
    if (this.selectedId != undefined) {
      console.log("DragEnd", dragEndEvent.pointer.canvas, this.selectedId, node);
      if (node != undefined) {
        const body = {
          id: node.id,
          x: dragEndEvent.pointer.canvas.x,
          y: dragEndEvent.pointer.canvas.y,
        };
        if (this.selectedIsStrategy()){
          this.endpointService.updateStrategy(node.id, body).subscribe((_) => {
            this.currentMap!.strategies = this.currentMap!.strategies.filter(s => !Strategy.findByIdType(s, this.selectedId!));
            this.currentMap!.strategies.push(Strategy.fromJson(_));
          });
        } else {
          this.endpointService.updateGoal(node.id, body).subscribe((_) => {
            this.currentMap!.goals = this.currentMap!.goals.filter(g => g.id != this.selectedId);
            this.currentMap!.goals.push(Goal.fromJson(_));
          });
        }
      }
    }
  }
  //#endregion

  //#region Map Actions
  toggleAddElement(editMode: EditMode){
    console.log("Toggle Add Element", editMode, this.editable, this.selectedId);
    if (!this.editable) {
      this._snackBar.open("Error! Map is not editable", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
      editMode = EditMode.None;
    }

    switch (editMode) {
      case EditMode.Goal:
        if (this.mapEditFormGroup.controls['goalName'].value == '') {
          editMode = EditMode.None;
          this._snackBar.open("Error! Goal name cannot be empty", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
        } else
          this.networkGraph!.addNodeMode();
      break;
      case EditMode.Strategy:
        if (this.mapEditFormGroup.controls['strategyName'].value == '') {
          editMode = EditMode.None;
          this._snackBar.open("Error! Strategy name cannot be empty", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
        } else
          this.networkGraph!.addEdgeMode();
      break;
      default:
        this.mapEditFormGroup.controls['goalName'].setValue('');
        this.mapEditFormGroup.controls['strategyName'].setValue('');
        this.networkGraph!.disableEditMode();
      break;
    }
    // update edit mode
    this.editMode = editMode;
  }
  //#endregion

//#region Create New Element
  createNewGoal(nodeData: Node, callback:(nodeData: Node)=> void) {
    console.log("Create new goal", nodeData, this.mapFormGroup, this.mapEditFormGroup);
    const body  = { 
      name: this.mapEditFormGroup.controls['goalName'].value, 
      x: nodeData.x,
      y: nodeData.y,
      map: this.currentMap!.id, 
    };
    this.endpointService.addNewGoal(body).subscribe( data => {
      console.log("New Goal", data, Goal.fromJson(data), callback);
      const newGoal = Goal.fromJson(data);
      this.currentMap!.goals.push(newGoal);
      this.networkGraph!.addNodeMode(); // call again to enable callback
      callback(newGoal.asNode());
      this.networkGraph!.disableEditMode(); // disable after adding node
      this._snackBar.open("Goal added", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    });
    this.toggleAddElement(EditMode.None);
  }

  // Evaluate if can create a new strategy and show error message if not
  evaluateCanCreateNewStrategy(edge: Edge): boolean {
    const from = this.currentMap!.goals.find(g => g.id == (edge.from?.toString() ?? ''));
    const to = this.currentMap!.goals.find(g => g.id == (edge.to?.toString() ?? ''));

    const fromStart = from?.id == this.currentMap!.start.id;
    const fromEnd = from?.id == this.currentMap!.stop.id;
    const toStart = to?.id == this.currentMap!.start.id;
    const toEnd = to?.id == this.currentMap!.stop.id;

    if( from == undefined || to == undefined) {
      this._snackBar.open('You have to choose two Goals to create a Strategy', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return false;
    }else if (from.id == to.id){
      this._snackBar.open('You have to choose 2 different nodes', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return false;
    } else if(fromEnd){
      this._snackBar.open('You cannot choose Stop as a source goal', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return false;
    } else if(toStart){
      this._snackBar.open('You cannot choose Start as a target goal', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return false;
    } else if(fromStart && toEnd){
      this._snackBar.open('You cannot connect Start & Stop directly', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return false;
    } else if(this.currentMap!.strategies.find(s => s.name == this.mapEditFormGroup.controls['strategyName']?.value) != undefined){
      this._snackBar.open('Strategy with the same name is already assigned', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      return false;
    }
    return true;
  }

  createNewStrategy(edgeData: Edge, callback: (edgeData: Edge) => void) {
    console.log("Create new strategy", edgeData, this.mapFormGroup, this.mapEditFormGroup);
    if (this.evaluateCanCreateNewStrategy(edgeData)) {
      const fromPos = this.networkGraph!.getPosition(edgeData.from!);
      const toPos = this.networkGraph!.getPosition(edgeData.to!);
      const body = {
        id: uuidv4(),
        name: this.mapEditFormGroup.controls['strategyName'].value,
        goal_src: edgeData.from?.toString() ?? '',
        goal_tgt: edgeData.to?.toString() ?? '',
        x: ((fromPos.x + toPos.x) / 2),
        y: ((fromPos.y + toPos.y) / 2),
        map: this.currentMap!.id,
      };
      this.endpointService.addNewStrategy(body).subscribe( data => {
        console.log("New Strategy", data, Strategy.fromJson(data));
        const newStrategy = Strategy.fromJson(data);
        this.currentMap!.strategies.push(newStrategy);
        this._snackBar.open("Strategy added", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
        this.buildNetworkGraph(this.currentMap); // rebuild graph
      });
    } 
    this.toggleAddElement(EditMode.None);
  }
//#endregion

//#region Update Element
  updateSelectedElementName() {
    const newValue = this.mapEditFormGroup.controls['updateName'].value;
    if (this.selectedId == undefined){
      this._snackBar.open("Error! No element selected", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    } else if (newValue == '') {
      this._snackBar.open("Error! New name cannot be empty", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    } else {
      const goal = this.currentMap!.goals.find(g => g.id == this.selectedId);
      const strategy = this.currentMap!.strategies.find(s => Strategy.findByIdType(s, this.selectedId!));
      const data = {
        name: newValue,
        x: goal?.x ?? strategy?.x,
        y: goal?.y ?? strategy?.y,
      }
      if (!this.selectedIsStrategy() && goal != undefined && strategy == undefined) {
        this.endpointService.updateGoal(goal.id, data).subscribe((res) => {
          console.log("Update selected element", this.selectedId, this.currentMap, this);
          this.currentMap!.goals = this.currentMap!.goals.filter(g => g.id != this.selectedId);
          this.currentMap!.goals.push(Goal.fromJson(res));
          this.buildNetworkGraph(this.currentMap);
          this._snackBar.open("Goal updated", 'X', { duration: 3000, panelClass: ['blue-snackbar'] });
        });
      } else if (goal == undefined && strategy != undefined) {
        this.endpointService.updateStrategy(strategy.id, data).subscribe((res) => {
          console.log("Update selected element", this.selectedId, this.currentMap, res);
          this.currentMap!.strategies = this.currentMap!.strategies.filter(s => !Strategy.findByIdType(s, this.selectedId));
          this.currentMap!.strategies.push(Strategy.fromJson(res));
          this.buildNetworkGraph(this.currentMap);
          this._snackBar.open("Strategy updated", 'X', { duration: 3000, panelClass: ['blue-snackbar'] });
        });
      } else {
        this._snackBar.open("Error! No element selected", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
      }
    }
  }

//#endregion

//#region Delete Element
  deleteSelectedElement() {
    const goal = this.currentMap!.goals.find(g => g.id == this.selectedId);
    const strategy = this.currentMap!.strategies.find(s => Strategy.findByIdType(s, this.selectedId));
    if (goal != undefined && strategy == undefined) {
      this.deleteGoal(goal, this.currentMap!.strategies.filter(s => s.goal_src == goal!.id || s.goal_tgt == goal!.id));
    } else if (goal == undefined && strategy != undefined){
      this.deleteStartegy(strategy);
    } else {
      this._snackBar.open("Error! No element selected", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    }
  }

  deleteGoal(goal: Goal, relatedStrategies: Strategy[]) {
    console.log("Delete goal", goal);
    if (goal!.name == 'Start' || goal!.name == 'End' || goal!.id == this.currentMap!.start.id || goal!.id == this.currentMap!.stop.id) {
      this._snackBar.open("Error! Cannot delete Start or End goals", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    } else {
      var confirmDialog = this.dialogs.open(ConfirmDialogComponent, { width: '500px' });
      confirmDialog.componentInstance.confirmMessage = "Are you sure you want to delete this goal?";
      if(relatedStrategies.length > 0) {
        confirmDialog.componentInstance.confirmMessage += "\nThis goal is used in " + relatedStrategies.length + " strategies.\n Deleting this goal will also delete the connected strategies.";
      }
      confirmDialog.afterClosed().subscribe((result) => {
        if (result) {
          console.log("Delete selected element", goal);
          this.endpointService.deleteGoalfromMap(this.selectedId).subscribe((_) => {
            this._snackBar.open("Goal deleted", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
            this.currentMap!.goals = this.currentMap!.goals.filter(g => g.id != this.selectedId);
            this.currentMap!.strategies = this.currentMap!.strategies.filter(s => s.goal_src != this.selectedId && s.goal_tgt != this.selectedId);
            //this.networkGraph!.deleteSelected();
            this.buildNetworkGraph(this.currentMap); // rebuild graph
            this.onSelectNode({ nodes: [ undefined ] }); // trigger onSelectedNode
          });
        } else
          console.log("Cancel delete");
      });
      
    }
  }

  deleteStartegy(strategy: Strategy) {
    var confirmDialog = this.dialogs.open(ConfirmDialogComponent, { width: '500px' });
    confirmDialog.componentInstance.confirmMessage = "Are you sure you want to delete this strategy?\n The Strategy could be associated with a MethodChunk."; 
    confirmDialog.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Delete selected element", strategy);
        this.endpointService.deleteStrategyfromMap(strategy.id).subscribe((_) => {
          this._snackBar.open("Strategy deleted", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
          this.currentMap!.strategies = this.currentMap!.strategies.filter(s =>!Strategy.findByIdType(s, this.selectedId!));
          this.networkGraph!.deleteSelected();
          this.onSelectNode({ nodes: [ undefined ] }); // trigger onSelectedNode
        });
      } else
        console.log("Cancel delete");
    });
  }

  deleteMap() {
    console.log("Delete map");
    var confirmDialog = this.dialogs.open(ConfirmDialogComponent, { width: '500px' });
    confirmDialog.componentInstance.confirmMessage = "Are you sure you want to delete this map?";
    confirmDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.endpointService.deleteMap(this.currentMap!.id).subscribe((_) => {
          this._snackBar.open("Map deleted", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
          this.router.navigate(['/maps']);
        });
      } else
        console.log("Cancel delete");
    });
  }
  //#endregion

  selectedIsStrategy() : boolean {
    return this.selectedId != undefined && this.selectedId.toString().startsWith('S_');
  }
}


//#region Instructions Dialog
@Component({
  selector: 'instructions-dialog',
  template: `
  <h1 mat-dialog-title> Instructions </h1>
  <div>
    <h2>1. Create Goal</h2>
    <p>Write the name of the goal in the designated area</p>
    <p>Click Create New Goal</p>
    <p>Select the position in the graph where the goal will be created</p>
    <h2>2. Create Strategy</h2>
    <p>Write the name of the strategy in the designated area</p>
    <p>Click Create New Strategy</p>
    <p>Select the source Goal on the graph and drag the mouse to the Target Goal</p>
    <h2>3. Update Element</h2>
    <p>Select a Strategy or a Goal clicking on it, the color of the selected element will slightly change</p>
    <p>Click on Update Selected Element</p>
    <p>Write the new Name on the designated area and click save</p>
  </div>
  <div mat-dialog-actions>
    <button mat-raised-button class="button-instruction" (click)="closeDialog()"> Close </button>
  </div>
  `,
  styles: [`
    .button-instruction {
      background-color: #ffe066;
      border-width: 0;
      color: #333333;
      cursor: pointer;
      display: inline-block;
      font-family: Roboto, "Helvetica Neue", sans-serif;
      font-size: 14px;
      font-weight: 500;
      list-style: none;
      margin: 0;
      text-align: center;
      transition: all 200ms;
      vertical-align: baseline;
      white-space: nowrap;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      margin-top: 30px;
      box-sizing: border-box;
      position: relative;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      text-decoration: none;
      min-width: 64px;
      line-height: 36px;
      padding: 0 16px;
      border-radius: 4px;
      overflow: visible;
      transform: translate3d(0, 0, 0);
      transition: background 400ms cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    }`,
    `p { margin-left: 1rem; }`
  ],
})
export class InstructionsDialog {
  constructor(
    public dialogRef: MatDialogRef<InstructionsDialog>,
  ) { }

  closeDialog(): void {
    this.dialogRef.close(0);
  }
}
//#endregion
