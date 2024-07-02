import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { Network } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { EndpointService } from 'src/app/services/endpoint.service';
import { MapComponent } from '../map/map.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigatorService } from 'src/app/services/navigator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-graf',
  templateUrl: './graf.component.html',
  styleUrls: ['./graf.component.css']
})
export class GrafComponent implements OnInit {
  @ViewChild("siteConfigNetwork", { static: true }) networkContainer: ElementRef;
  @ViewChild("nodelabel", { static: true }) nodeLabel: ElementRef;
  @ViewChild("updatename", { static: true }) updateName: ElementRef;
  @ViewChild("createSt", { static: true }) createSt: ElementRef;
  public network: any;
  public selected: any;
  public nodes;
  public edges;
  public paramsauxiliar;
  public prueba_id_aux;
  public goals_de_map : any = [];
  public strategies_de_map : any = [];
  public llistat_goals : any = [];
  public llistat_goals_sense_map : any = [];
  public llistat_goals_del_map : any = [];
  public llistat_strategies : any = [];
  public llistat_strategies_del_map : any = [];
  public ExistentGoalFormControl: FormControl;
  public filteredGoalsBuits: Observable<any[]>;
  @Input() prueba_id: MapComponent;
  @Input() prueba_name: MapComponent;
  @Input() acceso: boolean;
  @Input() readMapid: string;

  public editable = true;

  constructor(
    private endpointService: EndpointService,
    private _snackBar: MatSnackBar,
    public navigatorService: NavigatorService,
    private router: Router,
    public dialogs: MatDialog,
  ) {   }

async ngOnInit() {
  this.editable = !this.endpointService.isRepoPublic();
  // TODO: Disable editing graph if the repository is public
  if(this.acceso != true){ //Creació de Graf, Buit (no existent)
    this.nodes = new DataSet([]);
    this.edges = new DataSet([]);
  } else { //Creació Graf, Lectura de Graf Existent
    var auxnodes : any = [];
    var auxedges : any = [];

    await this.endpointService.getAllGoals().subscribe(data => {
      this.llistat_goals = data;
      //console.log(data);
    })

    await this.endpointService.getGoalsWithoutMap().subscribe(data => {
      this.llistat_goals_sense_map = data;
      //console.log(data);
    })

    await this.endpointService.getAllStrategies().subscribe(data => {
      this.llistat_strategies = data;
      //console.log(data);
    })

    await this.endpointService.getMapStrategies(this.readMapid).subscribe(async datastrategies => {
      //si no hi ha cap strategy al map, activa flag per no crear cap Strategy malament al graf
      let flag = 0;
      if(datastrategies.length != undefined){
        this.llistat_strategies_del_map = datastrategies;
      }else{
        flag = 1;
      }
        await this.endpointService.getMapGoals(this.readMapid).subscribe(async data => {
          this.llistat_goals_del_map = data;
          

            //Crea els nodes, basats en les llistes obtingudes de la BD
            this.llistat_goals_del_map.forEach(x => {
              if(x.id != 'Start' && x.id != 'Stop'){
                auxnodes.push({
                  id: x.id.toString(),
                  label: x.name,
                  x: x.x,
                  y: x.y,
                  font: { size: 15 },
                });
              }
            });

            //Crea les Strategies, Nodes de color blanc amb els edges corresponents
            if(flag == 0){
            this.llistat_strategies_del_map.forEach(x => {
              if(x.id != 'Start' && x.id != 'Stop'){
                auxnodes.push({
                  id: x.id,
                  label: x.name,
                  x: x.x,
                  y: x.y,
                  shape: "box",
                  color: "white",
                  shapeProperties: { borderDashes: [5, 5] },
                });
              }
              auxedges.push({
                from: x.goal_src,
                to: x.id,
                arrows: "to",
              smooth: {type: 'cubicBezier'},
              });
              auxedges.push({
                from: x.id,
                to: x.goal_tgt,
                color: "#2B7CE9",
                arrows: "to",
              smooth: {type: 'cubicBezier'},
              });

            });
          }
            
            
          data.forEach(z => { 
            if(z.name == 'Start' || z.name == 'Stop'){
              auxnodes.push({
                id: z.id,
                label: z.name,
                x: z.x,
                y: z.y,
                font: { size: 15 },
              });
            }
          });




          
          this.nodes = new DataSet(auxnodes);
          this.edges = new DataSet(auxedges);

          var treeData = {
            nodes: this.nodes,
            edges: this.edges
          };
      
          this.loadVisTree(treeData);

          var c = this.networkContainer.nativeElement;
          this.network.on("click",  (params) => { //marca el node seleccionat
          params.event = "[original event]";
          this.paramsauxiliar = params;
          this.selected = this.network.getNodeAt(params.pointer.DOM);
          console.log(
            "ID de Nodo Seleccionado: " + this.network.getNodeAt(params.pointer.DOM)
          );
    });

    this.network.on("dragEnd", async (params) => { // Guarda la posició del node al acabar de moure'l
      params.event = "[original event]";
      this.selected = this.network.getNodeAt(params.pointer.DOM);
      if(params.nodes.length == 0){
      }else{
          await this.updateGraf();
          await this.update_posicio_goal_st();
      }
    });
        })
  })

  
  }
}




  


  loadVisTree(treedata) {
    var a = this;
    var options = {
      physics: false,
      interaction: { hover: true, multiselect: false },
      manipulation: {
        enabled: false,
        addNode: (nodeData,callback) => {
          nodeData.label = a.nodeLabel.nativeElement.value;
          nodeData.title = a.nodeLabel.nativeElement.value;
          nodeData.font = {size: 15};
          if(this.acceso == true){
            let dataN = { name: nodeData.label, map: this.readMapid, x: nodeData.x, y: nodeData.y};
            this.endpointService.addNewGoal(dataN).subscribe(async data => {
              nodeData.id = data['id'].toString();
              this.llistat_goals_del_map.push({'id': data['id'], 'name': nodeData.label})
              callback(nodeData);
              await this.updateGraf();
          })
          }
        },
        addEdge: (edgeData,callback) => {
          if(edgeData.from.startsWith('S_') || edgeData.to.startsWith('S_')){
            this._snackBar.open('You have to choose two Goals to create a Strategy', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
          }else if (edgeData.from == edgeData.to){
            this._snackBar.open('You have to choose 2 different nodes', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
          }else if(this.network.body.nodes[edgeData.to].options.label == 'Start'){
            this._snackBar.open('You cannot choose Start as a target goal', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
          }else if(this.network.body.nodes[edgeData.from].options.label == 'Stop'){
            this._snackBar.open('You cannot choose Stop as a source goal', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
          }else if(this.network.body.nodes[edgeData.to].options.label == 'Stop' && this.network.body.nodes[edgeData.from].options.label == 'Start'){
            this._snackBar.open('You cannot connect Start & Stop directly', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
          }else if(this.llistat_strategies_del_map.find((element) => element.goal_src == edgeData.from && element.goal_tgt == edgeData.to && element.name == this.createSt.nativeElement.value)){
              this._snackBar.open('Strategy with the same name is already assigned', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
          }else{
            this.addStrategy_dos(edgeData.from, edgeData.to);
            callback(edgeData);
          }
          
        },   
      },
    };

    var container = this.networkContainer.nativeElement;
    this.network = new Network(container, treedata, options);

    var that = this;
    this.network.on("hoverNode", function (params) {                  
      //console.log('hoverNode Event:', params);
    });
    this.network.on("blurNode", function(params){
      //console.log('blurNode event:', params);      
    });
  }





  public modoEditNode() {
   var trobat = false;
   
   for (let i = 0; i < this.llistat_goals_del_map.length; i++) {
    if (this.llistat_goals_del_map[i].name == this.nodeLabel.nativeElement.value){
      trobat = true;
      }
    }
    if(trobat == true){
      this._snackBar.open('Goal name already exists in the map', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }else if(this.nodeLabel.nativeElement.value == "" || this.nodeLabel.nativeElement.value.trim().length == 0){
      this._snackBar.open('Goal name can not be empty', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }else{
      this.network.addNodeMode();
    }
  }





  public addStrategy_dos(a, b) {
    if(a.startsWith('S_') || b.startsWith('S_')){
      this._snackBar.open('You have to choose two Goals to create a Strategy', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }else{
      let count = this.llistat_strategies.filter((v) => (v.id.startsWith('S_' + this.createSt.nativeElement.value + '_'))).length;
      let flag = 0; //0 = unico, ninguno con mismo nombre
      if(count == 0){
        //console.log('unico');
      }else{
        flag = 1;
        //console.log('existen ' + count);
      }

      try {
        var pos1 = this.network.getPosition(a);
        var pos2 = this.network.getPosition(b);

        if(flag == 0){ 
          this.nodes.add({
            id: 'S_' + this.createSt.nativeElement.value + '_',
            label: this.createSt.nativeElement.value,
            shape: "box",
            //color: "#FB7E81",
            color: "white",
            x: ((pos1.x + pos2.x) / 2),
            y: ((pos1.y + pos2.y) / 2),
            font: { size: 15 }
          });
        }else{ //si ya existe misma ST, crea id con numero para identificar
          this.nodes.add({
            id: 'S_' + this.createSt.nativeElement.value + '_' + count,
            label: this.createSt.nativeElement.value,
            shape: "box",
            //color: "#FB7E81",
            color: "white",
            x: ((pos1.x + pos2.x) / 2),
            y: ((pos1.y + pos2.y) / 2),
            font: { size: 15 }
          });
        }
      } catch (err) {
        alert(err);
      }
    
      try {
        if(flag == 0){
          this.edges.add({
            from: a,
            to: 'S_' + this.createSt.nativeElement.value + '_',
            arrows: "to",
            smooth: {type: 'cubicBezier'},
          });
        }else{
          this.edges.add({
            from: a,
            to: 'S_' + this.createSt.nativeElement.value + '_' + count,
            arrows: "to",
            smooth: {type: 'cubicBezier'},
          });
        }
        
      } catch (err) {
        alert(err);
      }
    
      try {
        if(flag == 0){
          this.edges.add({
            //id: document.getElementById("edge-id").value + 1,
            from: 'S_' + this.createSt.nativeElement.value + '_',
            to: b,
            arrows: "to",
            color: "#2B7CE9",
            smooth: {type: 'cubicBezier'},
          });
        }else{
          this.edges.add({
            //id: document.getElementById("edge-id").value + 1,
            from: 'S_' + this.createSt.nativeElement.value + '_' + count,
            to: b,
            arrows: "to",
            color: "#2B7CE9",
            smooth: {type: 'cubicBezier'},
          });
        }
        
      } catch (err) {
        alert(err);
      }

      var pos1 = this.network.getPosition(a);
      var pos2 = this.network.getPosition(b);
      let dataSt;

      if(flag == 0){
        dataSt = { id: 'S_' + this.createSt.nativeElement.value + '_', x: ((pos1.x + pos2.x) / 2), y: ((pos1.y + pos2.y) / 2), name: this.createSt.nativeElement.value, goal_tgt: b, goal_src: a};
      }else{
        dataSt = { id: 'S_' + this.createSt.nativeElement.value + '_' + count, x: ((pos1.x + pos2.x) / 2), y: ((pos1.y + pos2.y) / 2), name: this.createSt.nativeElement.value, goal_tgt: b, goal_src: a};

      }
      this.endpointService.addNewStrategy(dataSt).subscribe(async data => {
        await this.updateGraf();
        this.llistat_strategies_del_map.push(dataSt);
        this.llistat_strategies.push(dataSt);
        this.navigatorService.refreshStrategyList();
    })

    }
    
  }





  public async crea_map_inicial(){   
    var N : any = [];
    var ST : any = [];
    var testing =this.objectToArray(this.network.body.nodes);
   
    testing.forEach(x => {
      if(x.id.startsWith('S_')){
        ST.push(x);
      }else{
        N.push(x);
      }
      
    }
      );
 
      this.prueba_id_aux = this.prueba_id;
    
    await N.forEach(async x => {
      var num_map;
      if(x.options.label == 'Start'){
        num_map = 'Start' + this.prueba_id_aux;
      }else if(x.options.label == 'Stop'){
        num_map = 'Stop' + this.prueba_id_aux;
      }else{
        num_map = x.options.label;
      }
      let dataN = {id: num_map, name: num_map, map: this.prueba_id, x: x.x, y: x.y};
        await this.endpointService.addNewGoal(dataN).subscribe(data => {
    })
    });


    ST.forEach(async x => {
      var source;
      var target;
      if(x.edges[0].fromId == 'Start'){
        source = 'Start' + this.prueba_id_aux;
      }else{
        source = x.edges[0].fromId;
      }

      if(x.edges[1].toId == 'Stop'){
        target = 'Stop' + this.prueba_id_aux;
      }else{
        target = x.edges[1].toId;
      }
      let dataST = {id:x.options.label, name: x.options.label, goal_tgt: target, goal_src: source, x: x.x, y: x.y};
      
        await this.endpointService.addNewStrategy(dataST).subscribe(data => {
    })
    });
    this.router.navigate(['/map', this.prueba_id]);
  }



  public objectToArray(obj) {
    return Object.keys(obj).map(function (key) {
      obj[key].id = key;
      return obj[key];
    });
  }

  

  




  public async submitFinal(){
    let body = this.stringifyMap();
    let numerito = +this.prueba_id;
  if(this.prueba_id != undefined && this.prueba_name != undefined ){
    if(!Number.isNaN(numerito)){
    await this.endpointService.addMap(body).subscribe(data => {
          if(data.id == 0){
            this._snackBar.open("Map added!", 'X', {duration: 3000, panelClass: ['green-snackbar']});
            this.navigatorService.refreshMapList();
            this.crea_map_inicial();
            
          }else{
            this._snackBar.open("ID del map ja existeix", 'X', {duration: 3000, panelClass: ['green-snackbar']});
          }
          
      })
    }else{
      this._snackBar.open("Error! ID ha de ser numèrica", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    }
    }else{
      this._snackBar.open("Error! Introdueix ID i Nom", 'X', {duration: 3000, panelClass: ['blue-snackbar']});

    } 
  }
  
  

  public stringifyMap() {
    let jsontesting =this.objectToArray(this.network.body.nodes);
    var real : any = [];
    jsontesting.forEach(x => {
      if(x._localColor == "white"){ //si es ST
        let d = {id: x.id, name: x.options.label, x: x.x, y: x.y, source: x.edges[0].fromId, target: x.edges[1].toId};
        real.push(d);
      }else{ //si es Goal
        let d = {id: x.id, name: x.options.label, x: x.x, y: x.y};
        real.push(d);
      }
    });
    var tt = (JSON.stringify(real));

    let body = {name: this.prueba_name, id: this.prueba_id,};
    return JSON.stringify(body);
  }
  
 








  public async goalsmap(){
    
    this.endpointService.getMapGoals(this.readMapid).subscribe(async data => {
      this.goals_de_map = data;
      
      await this.goals_de_map.forEach(async x => {
        await this.endpointService.goalStrategies(x.name).subscribe(data => {
          if(data.length > 0){
            data.forEach(async x => {
              this.strategies_de_map.push(x);
            });
          }
        });
        });      
        return true;
    });
  }









  public async updateGraf(){
    let body = this.stringifyMap();
    if (!this.editable)
      return;
    
    await this.endpointService.updateMap(this.readMapid, body).subscribe(data => {
      if(data.length > 0){
        data.forEach(async x => {
          this.strategies_de_map.push(x);
        });
      }      
      
    });
    //this._snackBar.open('Graph Updated!', 'X', {duration: 1500, panelClass: ['green-snackbar']});
    //console.log('GRAPH UPDATED!');
  }






///////////////////////////////////////////////////////////////////////////////////////////////


public async getInfoFromMap(){
    
  this.endpointService.getMapGoals(this.readMapid).subscribe(async data => {
    this.goals_de_map = data;

    for (var i = 0, len = this.goals_de_map.length; i < len; i++) {
     
      this.endpointService.goalStrategies(this.goals_de_map[i].name).subscribe(async res => {

      if(res.length > 0){
        await res.forEach(async z => {
          this.strategies_de_map.push(z);
          });
      }
      
          });
        }
      });
}





public testing(){
  this.endpointService.goalStrategies('Stop' + String(this.readMapid)).subscribe(async res => {
    console.log('iter2:');
    console.log(res);
  if(res.length > 0){
    await res.forEach(async z => {
      this.strategies_de_map.push(z);
    });
  }
  
    });
}




public async modoEditNode2(){
  var existeix = false;

  for (var i = 0, len = this.llistat_goals.length; i < len; i++) {
    if(this.nodeLabel.nativeElement.value == this.llistat_goals[i].name){
      existeix = true;
      break;
    }
    }

    var x = this.network.clustering.findNode(this.nodeLabel.nativeElement.value);
      if(this.nodeLabel.nativeElement.value != x && existeix == false){
      await this.network.addNodeMode();
      }else if(existeix == true){
        this._snackBar.open('Node name already exists in DataBase', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      }else{
        this._snackBar.open('Node name already exists', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      }

}





public deleteSelected2() {
  if(this.selected != undefined){
  var starts = "S_";
  var es_st;
  if(typeof this.paramsauxiliar.nodes[0] == 'number'){
   es_st = JSON.stringify(this.paramsauxiliar.nodes[0]).startsWith(starts);
  }else{
    es_st = this.paramsauxiliar.nodes[0].startsWith(starts);
  }

  if(this.network.body.nodes[this.selected].options.label == 'Start' || this.network.body.nodes[this.selected].options.label == 'Stop'){
    this._snackBar.open('You cannot delete Start or Stop goals', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
  }else{
    if(es_st == true){
      if(confirm('Are you sure? The strategy could be associated with a Method Chunk')){
      this.endpointService.deleteStrategyfromMap(this.selected).subscribe(async data => {
        await this.network.deleteSelected();
        this.updateGraf();
        var found = this.llistat_strategies_del_map.find((element) => element.id == this.selected);

        this.network.canvas.redraw();
    })
    }
    }else if(this.paramsauxiliar.edges.length == 0){
      this.endpointService.deleteGoalfromMap(this.selected).subscribe(async data => {
        await this.network.deleteSelected();
        this.updateGraf();
        this.llistat_goals_del_map = this.llistat_goals_del_map.filter((element) => element.id != this.selected);
        this.network.canvas.redraw();
    })
    }else{
      this._snackBar.open('Delete Strategies before deleting Node', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }
  }
  }else{
    this._snackBar.open('Select the element you want to delete', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
  }
}





public async modoEditEdge2() {
  await this.updateGraf();
  var x = this.network.clustering.findNode('S_' + this.createSt.nativeElement.value + '_');
    if(this.createSt.nativeElement.value != "" && this.createSt.nativeElement.value.trim().length != 0){
      this.network.addEdgeMode();
    }else{
      this._snackBar.open('Strategy name can not be empty', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }
  }


  public esborraMapa(){
    if(confirm("Are you sure? You could delete Goals or Strategies associated with Method Chunks")) {
    this.navigatorService.allowChange = false;
    this.endpointService.deleteMap(this.readMapid).subscribe( data => {
        this.navigatorService.refreshMapList();
        this.router.navigate(['/map']);
        this._snackBar.open("Map deleted!", 'X', {duration: 3000, panelClass: ['green-snackbar']});
      })
      this.navigatorService.refreshMapList();
      return true;
    }
  }



 

  public async update_posicio_goal_st(){
    
    //Si es de color blanc (strategy), llavors UpdateStrategy, si no, fa UpdateGoal
    if(this.network.body.nodes[this.selected].options.color.background == 'white'){
      let body = {x: this.network.getPosition(this.selected).x, y: this.network.getPosition(this.selected).y };
      await this.endpointService.updateStrategy(this.selected, body).subscribe(data => {      
      });
    }else{
      let body = {x: this.network.getPosition(this.selected).x, y: this.network.getPosition(this.selected).y };
      await this.endpointService.updateGoal(this.selected, body).subscribe(data => {      
      });
    }    
   }
   



   public changeDialog() {
    if(this.selected != undefined){
    
    const dialogRef = this.dialogs.open(ChangeNameDialog, {
      width: '500px',
      data: {name: this.network.body.nodes[this.selected].options.label}
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result != 0){
        var existeix_goal = false;
  var existeix_st = false;

  for (var i = 0, len = this.llistat_goals_del_map.length; i < len; i++) {
    if(result.nativeElement.value == this.llistat_goals_del_map[i].name){
      existeix_goal = true;
      break;
    }
    }



  if(this.selected != undefined && existeix_goal == false && existeix_st == false && result.nativeElement.value != 'Start' && result.nativeElement.value != 'Stop' && this.network.body.nodes[this.selected].options.label != 'Start' && this.network.body.nodes[this.selected].options.label != 'Stop'){
  try {
    this.nodes.update({
      id:this.selected,
      label: result.nativeElement.value,
    });

    if(this.selected.startsWith('S_')){
      let bodyst = {name: result.nativeElement.value};
      this.endpointService.updateStrategy(this.selected, bodyst).subscribe(data => {    
      });
    }else{
      let body = {name: result.nativeElement.value, x: this.network.getPosition(this.selected).x, y: this.network.getPosition(this.selected).y };
      this.endpointService.updateGoal(this.selected, body).subscribe(data => {      
        this.llistat_goals_del_map = this.llistat_goals_del_map.filter((element) => element.id != this.selected);
        let d = {id: Number(this.selected), name: body.name};
        this.llistat_goals_del_map.push(d);
      });
    }
    this.updateGraf();
  } catch (err) {
    alert(err);
  }
  }else if(existeix_goal == true){
    this._snackBar.open('A Goal already uses this name', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
  }else if(existeix_st != false){
    this._snackBar.open('A Strategy already uses this name', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
  }else if(this.network.body.nodes[this.selected].options.label == 'Start' || this.network.body.nodes[this.selected].options.label == 'Stop'){
    this._snackBar.open('You cannot modify the names of Start and Stop goals', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
  }else{
    alert('Error');
  }
      }else{
        console.log('CANCEL');
      }

    })
  }else{
    this._snackBar.open('You have not selected any element', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
  }
  } 


  public instructions_popup() {    
    const dialogRef = this.dialogs.open(InstructionsDialog, {
      width: '500px',
      data: {}
    })  
  } 






  public funcio_auxiliar(){
    console.log('TestButton:')
    console.log(this.llistat_strategies_del_map);
    console.log('llistat de goals sense map:', this.llistat_goals_del_map);
  }





}




















@Component({
  selector: 'change-map-dialog',
  templateUrl: './change-name-dialog.html',
  styleUrls: ['./change-name-dialog.html']
})
export class ChangeNameDialog {
  @ViewChild("changename", { static: true }) changename: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<ChangeNameDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public endpointService: EndpointService,
    public navigatorService: NavigatorService,
    private _snackBar: MatSnackBar,
    private router: Router,
    
  ) {}

  public name: String = '';

  public ChangeName() {
    this.dialogRef.close(this.changename);
  }

  closeDialog(reload = false): void {
    this.dialogRef.close(0);
  }
}

@Component({
  selector: 'instructions-dialog',
  templateUrl: './instructions-dialog.html',
  styleUrls: ['./instructions-dialog.html']
})
export class InstructionsDialog {
  @ViewChild("instructions", { static: true }) changename: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<InstructionsDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    public endpointService: EndpointService,
    public navigatorService: NavigatorService,
    private _snackBar: MatSnackBar,
    private router: Router,
    
  ) {}

  public name: String = '';

  public ChangeName() {
    this.dialogRef.close(this.changename);
  }

  closeDialog(reload = false): void {
    this.dialogRef.close(0);
  }
}



