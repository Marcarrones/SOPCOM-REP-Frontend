import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { Network } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { EndpointService } from 'src/app/services/endpoint.service';
import { MapComponent } from '../map/map.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigatorService } from 'src/app/services/navigator.service';
import { ActivatedRoute, Router } from '@angular/router';





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
  @Input() prueba_id: MapComponent;
  @Input() prueba_name: MapComponent;
  @Input() info_completa: string;
  @Input() acceso: boolean;
  @Input() readMapid: string;

  constructor(
    private endpointService: EndpointService,
    private _snackBar: MatSnackBar,
    public navigatorService: NavigatorService,
    private router: Router,
  ) {  }

   async ngOnInit() {
    console.log("acceso:");
    console.log(this.acceso);
    if(this.acceso != true){ //Creació de Graf, Buit
    this.nodes = new DataSet([
      //{ id: "Start", label: "Start", title: 1 },
      //{ id: "Stop", label: "Stop", title: 2 }
    ]);
    this.edges = new DataSet([
    ]);
  }else{ //Lectura de Graf Existent
    //await this.getInfoFromMap();
    //await this.info2();
    //console.log('----------------------------------------');
    //const sleep = (ms) => new Promise(r => setTimeout(r, ms)); //funcio per esperar 1 segon (Millora a fer: Observables, Await, Async per solucionar-ho)
    //await sleep(1000);
    var auxnodes : any = [];
    var auxedges : any = [];
    var info = JSON.parse(this.info_completa);


    await this.endpointService.getAllGoals().subscribe(data => {
      this.llistat_goals = data;
      console.log(data);
    })

    await this.endpointService.getGoalsWithoutMap().subscribe(data => {
      this.llistat_goals_sense_map = data;
      console.log(data);
    })

    await this.endpointService.getAllStrategies().subscribe(data => {
      this.llistat_strategies = data;
      console.log(data);
    })

    await this.endpointService.getMapStrategies(this.readMapid).subscribe(async datastrategies => {
      this.llistat_strategies_del_map = datastrategies;
      console.log('::::::')
      console.log(datastrategies);
    

        await this.endpointService.getMapGoals(this.readMapid).subscribe(async data => {
          this.llistat_goals_del_map = data;
          console.log('llistat goals del mapa antes de los push: ', data);
          console.log('llistat strategies del mapa antes de los push: ', this.llistat_strategies_del_map);
          
    /*Manera antigua pruebas[] no borrar
          info.forEach(x => {
            if(x.id.startsWith('S_')){
              auxnodes.push({
                id: x.id,
                label: x.name,
                x: x.x,
                y: x.y,
                shape: "box",
                color: "#FB7E81",
              });
            }else if(x.id != 'Start' && x.id != 'Stop'){
              console.log(x)
              auxnodes.push({
                id: x.id,
                label: x.name,
                x: x.x,
                y: x.y,
              });
            }
          });
    */

            //Crea els nodes basats en les llistes obtingudes de la BD
            this.llistat_goals_del_map.forEach(x => {
              if(x.id != 'Start' && x.id != 'Stop'){
                auxnodes.push({
                  id: x.id.toString(),
                  label: x.name,
                  x: x.x,
                  y: x.y,
                });
              }
            });
            this.llistat_strategies_del_map.forEach(x => {
              if(x.id != 'Start' && x.id != 'Stop'){
                auxnodes.push({
                  id: x.id,
                  label: x.name,
                  x: x.x,
                  y: x.y,
                  shape: "box",
                  color: "#FB7E81",
                });
              }
            });
            
          data.forEach(z => { 
            if(z.name == 'Start' || z.name == 'Stop'){
              auxnodes.push({
                id: z.id,
                label: z.name,
                x: z.x,
                y: z.y,
              });
            }
          });
/*manera antigua pruebas[]
          info.forEach(x => {
            if(x.id.startsWith('S_')){
              console.log(x)
              auxedges.push({
                from: x.source,
                to: x.id,
                arrows: "to",
              smooth: {type: 'cubicBezier'},
              });
              auxedges.push({
                from: x.id,
                to: x.target,
                color: "#2B7CE9",
                arrows: "to",
              smooth: {type: 'cubicBezier'},
              });
            }
          });
          */
          
          this.llistat_strategies_del_map.forEach(x => {
            console.log(x)
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



          
          this.nodes = new DataSet(auxnodes);
          this.edges = new DataSet(auxedges);

          var treeData = {
            nodes: this.nodes,
            edges: this.edges
          };
      
          this.loadVisTree(treeData);
          console.log(this.network.body);
          //this.network.moveNode(this.network.body.nodes[0]);

          var c = this.networkContainer.nativeElement;
        this.network.on("click",  (params) => {
          params.event = "[original event]";
          this.paramsauxiliar = params;
          this.selected = this.network.getNodeAt(params.pointer.DOM);
          console.log(
            "ID de Nodo Seleccionado: " + this.network.getNodeAt(params.pointer.DOM)
          );
          console.log(this.selected);
          console.log(params.pointer)
    });

    this.network.on("dragEnd", async (params) => {
      params.event = "[original event]";
      console.log('params: ', params);
      this.selected = this.network.getNodeAt(params.pointer.DOM);
          //console.log(
            //'Selected:', this.selected
          //);

      if(params.nodes.length == 0){
          console.log('Screen Dragging');
      }else{
          await this.updateGraf();
          await this.update_posicio_goal_st();
      }
      
      console.log(
        "Node Release"
      );
    });
        })
  })

    

   

    

    console.log('llistat_goals_del_map:');
    console.log(this.llistat_goals_del_map);
    
    
    
   /* Manera antigua de llegir grafs, NO BORRAR
    info.forEach(x => {
      if(x.id.startsWith('S_')){
        auxnodes.push({
          id: x.id,
          label: x.name,
          x: x.x,
          y: x.y,
          shape: "box",
          color: "#FB7E81",
        });
      }else if(x.id != 'Start' && x.id != 'Stop'){
        auxnodes.push({
          id: x.id,
          label: x.name,
          x: x.x,
          y: x.y,
        });
      }
      
    });

    info.forEach(x => {
      if(x.id.startsWith('S_')){
        auxedges.push({
          from: x.source,
          to: x.id,
          arrows: "to",
        smooth: {type: 'cubicBezier'},
        });
        auxedges.push({
          from: x.id,
          to: x.target,
          color: "#2B7CE9",
          arrows: "to",
        smooth: {type: 'cubicBezier'},
        });
      }
      
    });
    
    this.nodes = new DataSet(auxnodes);
    this.edges = new DataSet(auxedges);

    */
  }

    // create an array with edges
    
/*
    var treeData = {
      nodes: this.nodes,
      edges: this.edges
    };

    this.loadVisTree(treeData);
    console.log(this.network.body)
*/
    //var selected;


/*
    var c = this.networkContainer.nativeElement;
    this.network.on("click",  (params) => {
      params.event = "[original event]";
      this.paramsauxiliar = params;
      this.selected = this.network.getNodeAt(params.pointer.DOM);
      console.log(
        "ID de Nodo Seleccionado: " + this.network.getNodeAt(params.pointer.DOM)
      );
      console.log(this.selected);
});

this.network.on("dragEnd",  (params) => {
  params.event = "[original event]";

  this.selected = this.network.getNodeAt(params.pointer.DOM);
      console.log(
        'Selected:', this.selected
      );

  this.updateGraf();
  console.log(
    "Node Release"
  );
});

*/


  }

  



  


  loadVisTree(treedata) {
    var a = this;
    var options = {
      physics: false,
      interaction: { hover: true, multiselect: false },
      manipulation: {
        enabled: false,
        addNode: (nodeData,callback) => {
          //nodeData.id = a.nodeLabel.nativeElement.value;
          nodeData.label = a.nodeLabel.nativeElement.value;
          nodeData.title = a.nodeLabel.nativeElement.value;
          console.log('acceso');
          console.log(this.acceso);
          if(this.acceso == true){
            let dataN = { name: nodeData.label, map: this.readMapid, x: nodeData.x, y: nodeData.y};
            this.endpointService.addNewGoal(dataN).subscribe(async data => {
              console.log('id respuesta a creacion:');
              console.log(data['id']);
              nodeData.id = data['id'].toString();
              console.log('llistat dels goals del mapa:',this.llistat_goals_del_map);
              this.llistat_goals_del_map.push({'id': data['id'], 'name': nodeData.label})
              callback(nodeData);
              await this.updateGraf();
          })
          }
          
        },
        addEdge: (edgeData,callback) => {
          console.log(edgeData);
          console.log('edgedataaa: ', this.network.body.nodes[edgeData.from].options.label, this.network.body.nodes[edgeData.to].options.label);
          if(edgeData.from.startsWith('S_') || edgeData.to.startsWith('S_')){
            //alert('You have to choose two Goals to create a Strategy');
            this._snackBar.open('You have to choose two Goals to create a Strategy', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
          }else if (edgeData.from == edgeData.to){
            //alert('You have to choose 2 different nodes');
            this._snackBar.open('You have to choose 2 different nodes', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
          }else if(this.network.body.nodes[edgeData.to].options.label == 'Start'){
            //alert('You cannot choose Start as a target goal');
            this._snackBar.open('You cannot choose Start as a target goal', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
          }else if(this.network.body.nodes[edgeData.from].options.label == 'Stop'){
            //alert('You cannot choose Stop as a source goal');
            this._snackBar.open('You cannot choose Stop as a source goal', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
          }else if(this.network.body.nodes[edgeData.to].options.label == 'Stop' && this.network.body.nodes[edgeData.from].options.label == 'Start'){
            //alert('You cannot connect Start & Stop directly');
            this._snackBar.open('You cannot connect Start & Stop directly', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
            this.network.disableEditMode();
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
      console.log('hoverNode Event:', params);
    });
    this.network.on("blurNode", function(params){
      console.log('blurNode event:', params);      
    });
  }





  public modoEditNode() {
    /*
    var x = this.network.clustering.findNode(this.nodeLabel.nativeElement.value);
    console.log('x:',x);
    if(this.nodeLabel.nativeElement.value != x){
    this.network.addNodeMode();
    }else{
      alert('Node name already exists');
    }
    */
   console.log('llistat:');
   console.log(this.llistat_goals_del_map[0].name);
   var trobat = false;
   
   for (let i = 0; i < this.llistat_goals_del_map.length; i++) {
    console.log(this.llistat_goals_del_map[i].name);
    if (this.llistat_goals_del_map[i].name == this.nodeLabel.nativeElement.value){
      trobat = true;
    }
  }
     
    if(trobat == true){
      //alert('Goal name already exists in the map');
      this._snackBar.open('Goal name already exists in the map', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }else if(this.nodeLabel.nativeElement.value == "" || this.nodeLabel.nativeElement.value.trim().length == 0){
      this._snackBar.open('Goal name can not be empty', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }else{
      console.log('entra a addnodemode');
      this.network.addNodeMode();
    }


    }



  public modoEditEdge() {
    console.log('modo edit edge');
    var x = this.network.clustering.findNode('S_' + this.createSt.nativeElement.value);
    console.log(x);
    if('S_' + this.createSt.nativeElement.value != x){
    this.network.eableEditMode();
    this.network.addEdgeMode();
    }else{
      //alert('Strategy name already exists');
      this._snackBar.open('Strategy name already exists', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }
    }

  public deleteSelected() {
      //this.nodes.remove({ id: this.selected });
      var tipo = typeof this.paramsauxiliar.nodes[0];
      console.log(this.paramsauxiliar.nodes[0]);
      console.log(typeof this.paramsauxiliar.nodes[0]);
      var starts = "S_";
      var es_st;
      if(typeof this.paramsauxiliar.nodes[0] == 'number'){
       es_st = JSON.stringify(this.paramsauxiliar.nodes[0]).startsWith(starts);
      }else{
        es_st = this.paramsauxiliar.nodes[0].startsWith(starts);
      }
      //console.log(JSON.stringify(this.paramsauxiliar.nodes[0]).startsWith(starts));
      if(this.paramsauxiliar.edges.length == 0 || es_st == true){
        this.network.deleteSelected();
      }else{
        //alert('Delete Strategies before deleting Node');
        this._snackBar.open('Delete Strategies before deleting Node', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      }
    }


  changeName() {
      console.log(this.selected);
      if(this.selected != undefined){
      try {
        this.nodes.update({
          id:this.selected,
          label: this.updateName.nativeElement.value,
        });
        console.log(this.updateName.nativeElement.value);
      } catch (err) {
        alert(err);
      }
    }  
  }




  public addStrategy_dos(a, b) {
    if(a.startsWith('S_') || b.startsWith('S_')){
      //alert('You have to choose two Goals to create a Strategy');
      this._snackBar.open('You have to choose two Goals to create a Strategy', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
    }else{


      try {
        var pos1 = this.network.getPosition(a);
        var pos2 = this.network.getPosition(b);
        console.log(pos1.x, pos2.x);

        console.log('Ids de los dos nodes:');
        console.log(a, b);
        
          this.nodes.add({
            id: 'S_' + this.createSt.nativeElement.value,
            label: this.createSt.nativeElement.value,
            shape: "box",
            color: "#FB7E81",
            x: ((pos1.x + pos2.x) / 2),
            y: ((pos1.y + pos2.y) / 2)
          });
        
        
      } catch (err) {
        alert(err);
      }
    
      try {
        this.edges.add({
          //id: document.getElementById("edge-id").value,
          from: a,
          to: 'S_' + this.createSt.nativeElement.value,
          arrows: "to",
          smooth: {type: 'cubicBezier'},
        });
      } catch (err) {
        alert(err);
      }
    
      try {
        this.edges.add({
          //id: document.getElementById("edge-id").value + 1,
          from: 'S_' + this.createSt.nativeElement.value,
          to: b,
          arrows: "to",
          color: "#2B7CE9",
          smooth: {type: 'cubicBezier'},
        });
      } catch (err) {
        alert(err);
      }

      var pos1 = this.network.getPosition(a);
      var pos2 = this.network.getPosition(b);
      let dataSt = { id: 'S_' + this.createSt.nativeElement.value, x: ((pos1.x + pos2.x) / 2), y: ((pos1.y + pos2.y) / 2), name: this.createSt.nativeElement.value, goal_tgt: b, goal_src: a};
      this.endpointService.addNewStrategy(dataSt).subscribe(async data => {
        await this.updateGraf();
        this.llistat_strategies_del_map.push(dataSt);
    })
    





    }
    
  }


  public async nada(){

   
    var N : any = [];
    var ST : any = [];
    var testing =this.objectToArray(this.network.body.nodes);
    console.log(this.network.body.nodes);
    console.log(testing);

    testing.forEach(x => {
      if(x.id.startsWith('S_')){
        ST.push(x);
      }else{
        N.push(x);
      }
      
    }
      );
      console.log('N:');
      console.log(N);
      console.log('ST:');
      console.log(ST);

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
        //console.log("data", data)
        //if(!this.dialog)this.router.navigate(['/map', this.map.id]);
    })
    });
    //const sleep = (ms) => new Promise(r => setTimeout(r, ms)); //funcio per esperar 1 segon (Millora a fer: Observables, Await, Async per solucionar-ho)
    //await sleep(1000);
    
    

    ST.forEach(async x => {
      console.log("Element de St:");
      console.log(x);
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
      //let source = x.edges[0].fromId;
      //let target = x.edges[1].toId;
      let dataST = {id:x.options.label, name: x.options.label, goal_tgt: target, goal_src: source, x: x.x, y: x.y};
      console.log('Dataset:');
      console.log(dataST);
        await this.endpointService.addNewStrategy(dataST).subscribe(data => {
        console.log("data", data)
        //if(!this.dialog)this.router.navigate(['/map', this.map.id]);
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
    console.log('Datos del mapa:')
    console.log(this.prueba_id);
    console.log(this.prueba_name);
    let numerito = +this.prueba_id;
    /*console.log(numerito )
    if(!Number.isNaN(numerito)){
      console.log('entraaaa');
    }
    console.log(typeof(numerito));*/
  if(this.prueba_id != undefined && this.prueba_name != undefined ){
    if(!Number.isNaN(numerito)){
    await this.endpointService.addMap(body).subscribe(data => {
          console.log("data", data);
          console.log(data);
          console.log('id del mapa:');
          console.log(this.prueba_id);
          if(data.id == 0){
            //this.prueba_id = data.id;
            this._snackBar.open("Map added!", 'X', {duration: 3000, panelClass: ['green-snackbar']});
            this.navigatorService.refreshMapList();
            //this.router.navigate(['/map', this.prueba_id]);
            this.nada();
            
          }else{
            this._snackBar.open("ID del map ja existeix", 'X', {duration: 3000, panelClass: ['green-snackbar']});
          }
          
          //if(!this.dialog)this.router.navigate(['/map', this.map.id]);
      })
    }else{
      this._snackBar.open("Error! ID ha de ser numèrica", 'X', {duration: 3000, panelClass: ['blue-snackbar']});
    }
    }else{
      this._snackBar.open("Error! Introdueix ID i Nom", 'X', {duration: 3000, panelClass: ['blue-snackbar']});

    }
          //this.navigatorService.refreshMapList();
          //this.router.navigate(['/map', this.prueba_id]);  
          console.log('creacio map completa')    
      //return true;

      

      //this.nada();
  }
  
  
  public stringifyMap() {

    let jsontesting =this.objectToArray(this.network.body.nodes);
    var real : any = [];
    jsontesting.forEach(x => {
      if(x._localColor == "#FB7E81"){
        let d = {id: x.id, name: x.options.label, x: x.x, y: x.y, source: x.edges[0].fromId, target: x.edges[1].toId};
        real.push(d);
      }else{
        let d = {id: x.id, name: x.options.label, x: x.x, y: x.y};
        real.push(d);
      }
    });
    var tt = (JSON.stringify(real));

    let body = {name: this.prueba_name, id: this.prueba_id, pruebas: tt};
    return JSON.stringify(body);
  }
  
  public nada2(){
    let jsontesting =this.objectToArray(this.network.body.nodes);
    var real : any = [];
    jsontesting.forEach(x => {
      let d = {id: x.id, name: x.options.label, x: x.x, y: x.y};
      real.push(d);
    });
    console.log(JSON.stringify(real));
  }








  public async goalsmap(){
    
    this.endpointService.getMapGoals(this.readMapid).subscribe(async data => {
      this.goals_de_map = data;
      //console.log(this.goals_de_map);
      //console.log('maps');

      
      await this.goals_de_map.forEach(async x => {
        //console.log(x.name);
        await this.endpointService.goalStrategies(x.name).subscribe(data => {
          if(data.length > 0){
            data.forEach(async x => {
              this.strategies_de_map.push(x);
            });
            //this.strategies_de_map.push(data);
          }
          
        });
        });
        //console.log(this.strategies_de_map);
      
        return true;
    });
  
  }









  public async updateGraf(){
    let body = this.stringifyMap();

    console.log(body);
    console.log(this.readMapid);
    await this.endpointService.updateMap(this.readMapid, body).subscribe(data => {
      console.log('data de updatemap:');
      console.log(data);
      if(data.length > 0){
        data.forEach(async x => {
          this.strategies_de_map.push(x);
        });
        //this.strategies_de_map.push(data);
      }
      console.log('ha entrado en updatemap');
      
      
    });
    //this._snackBar.open('Graph Updated!', 'X', {duration: 1500, panelClass: ['green-snackbar']});
    console.log('GRAPH UPDATED!');
  }









































///////////////////////////////////////////////////////////////////////////////////////////////


public async getInfoFromMap(){
    
  this.endpointService.getMapGoals(this.readMapid).subscribe(async data => {
    this.goals_de_map = data;
    //console.log(this.goals_de_map);
    //console.log('maps');

    console.log('aaa:');
    console.log(this.goals_de_map);      

    

    for (var i = 0, len = this.goals_de_map.length; i < len; i++) {
      console.log(this.goals_de_map[i].name);
      console.log(this.goals_de_map[i]);
      this.endpointService.goalStrategies(this.goals_de_map[i].name).subscribe(async res => {
        console.log('iter:');
        console.log(res);
      if(res.length > 0){
        await res.forEach(async z => {
          this.strategies_de_map.push(z);
        });
      }
      
        });
      }

     

      /*
    await this.goals_de_map.forEach(async x => {
      var nombre = x.name;
      console.log(nombre);

        this.endpointService.goalStrategies(nombre).subscribe(async res => {
          console.log('iter:');
          console.log(res);
        if(res.length > 0){
          await res.forEach(async z => {
            this.strategies_de_map.push(z);
          });
        }
        
      });

      });
      */
      
    
  });
  

}












public async info2(){
/*
  this.endpointService.goalStrategies('Start' + String(this.readMapid)).subscribe(async res => {
    console.log('iter2:');
    console.log(res);
  if(res.length > 0){
    await res.forEach(async z => {
      this.strategies_de_map.push(z);
    });
  }
  
    });*/

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




public tornatext(){
  console.log('Map existent');
}


public async modoEditNode2(){
  //var net =this.objectToArray(this.network.body.nodes);
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
        //alert('Node name already exists in DataBase');
        this._snackBar.open('Node name already exists in DataBase', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      }else{
        //alert('Node name already exists');
        this._snackBar.open('Node name already exists', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
      }

}



changeName2() {

  var existeix_goal = false;
  var existeix_st = false;

  for (var i = 0, len = this.llistat_goals.length; i < len; i++) {
    if(this.updateName.nativeElement.value == this.llistat_goals[i].name){
      existeix_goal = true;
      break;
    }
    }

    for (var i = 0, len = this.llistat_strategies.length; i < len; i++) {
      if(this.updateName.nativeElement.value == this.llistat_strategies[i].name){
        existeix_st = true;
        break;
      }
      }

      console.log('ELEGIDOOO:');
      console.log(this.selected);


  if(this.network.body.nodes[this.selected].options.label == 'Start'){
    console.log('Es UN START');
  }else{
    console.log('NOO ees un start');
  }


  if(this.selected != undefined && existeix_goal == false && existeix_st == false && this.updateName.nativeElement.value != 'Start' && this.updateName.nativeElement.value != 'Stop' && this.network.body.nodes[this.selected].options.label != 'Start' && this.network.body.nodes[this.selected].options.label != 'Stop'){
    console.log(this.updateName.nativeElement.value);
  try {
    this.nodes.update({
      id:this.selected,
      label: this.updateName.nativeElement.value,
    });

    if(this.selected.startsWith('S_')){
      console.log('st');
      console.log(this.selected);
      let bodyst = {name: this.updateName.nativeElement.value};
      console.log(bodyst);
      this.endpointService.updateStrategy(this.selected, bodyst).subscribe(data => {  
        console.log('data de updateStratgy:');    
        console.log(data);  
      });
    }else{
      console.log('node');

      let body = {name: this.updateName.nativeElement.value, x: this.network.getPosition(this.selected).x, y: this.network.getPosition(this.selected).y };
      console.log('booooody:', body);
      console.log("this.selected:")
      console.log(this.selected);
      this.endpointService.updateGoal(this.selected, body).subscribe(data => {      
        console.log(data);  
      });
    }
    this.updateGraf();
  } catch (err) {
    alert(err);
  }
}else if(existeix_goal == true){
  //alert('A Goal already uses this name');
  this._snackBar.open('A Goal already uses this name', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
}else if(existeix_st == true){
  //alert('A Strategy already uses this name');
  this._snackBar.open('A Strategy already uses this name', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
}else if(this.network.body.nodes[this.selected].options.label == 'Start' || this.network.body.nodes[this.selected].options.label == 'Stop'){
  //alert('You cannot modify the names of Start and Stop goals');
  this._snackBar.open('You cannot modify the names of Start and Stop goals', 'X', {duration: 2000, panelClass: ['blue-snackbar']});
}else{
  alert('Error');
}

//this.updateGraf();
}




public deleteSelected2() {
  //this.nodes.remove({ id: this.selected });
  var tipo = typeof this.paramsauxiliar.nodes[0];
  console.log(this.paramsauxiliar.nodes[0]);
  console.log(typeof this.paramsauxiliar.nodes[0]);
  var starts = "S_";
  var es_st;
  if(typeof this.paramsauxiliar.nodes[0] == 'number'){
   es_st = JSON.stringify(this.paramsauxiliar.nodes[0]).startsWith(starts);
  }else{
    es_st = this.paramsauxiliar.nodes[0].startsWith(starts);
  }

  console.log('dadeeeeeees:');
  console.log(this.selected);

  if(this.selected == 'Start' || this.selected == 'Stop'){
    alert('You cannot delete Start or Stop goals');
  }else{
    if(this.paramsauxiliar.edges.length == 0 || es_st == true){
      console.log(this.paramsauxiliar);
      console.log(this.paramsauxiliar.nodes[0]);
      var dataEliminar = {nameG: this.paramsauxiliar.nodes[0], idM: this.readMapid};
      console.log("Node data:");
      console.log(this.selected);
      console.log(this.llistat_goals);
      this.endpointService.deleteGoalfromMap(this.selected).subscribe(async data => {
        //this.updateGraf();
        console.log(data);
        await this.network.deleteSelected();
        console.log('Network:::::');
        console.log(this.network);
        this.updateGraf();

        var found = this.llistat_goals_del_map.find((element) => element.id == this.selected);
        console.log(found);

        console.log('Node deleted');
        this.network.canvas.redraw();
    })
    
      //this.network.deleteSelected();
      
      
    
    }else{
      alert('Delete Strategies before deleting Node :)');
    }

  }

  
}


public async modoEditEdge2() {
  await this.updateGraf();
  console.log('Modo edit edge 2');
  var x = this.network.clustering.findNode('S_' + this.createSt.nativeElement.value);
  console.log(x);
  console.log(this.createSt.nativeElement.value.trim().length == 0)
  if('S_' + this.createSt.nativeElement.value != x){
    if(this.createSt.nativeElement.value != "" && this.createSt.nativeElement.value.trim().length != 0){
      this.network.addEdgeMode();
    }else{
      alert('Strategy name can not be empty');
    }
  }else{
    alert('Strategy name already exists');
  }
  }


  public esborraMapa(){
    if(confirm("Are you sure you want to delete this map?")) {
    console.log(this.readMapid);
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
    console.log('entra a updatepos_goal_st');
    console.log('la info es: ', this.selected);
    
    if(((this.selected).toString()).startsWith("S_")){
      console.log('entra al if');
      let body = {x: this.network.getPosition(this.selected).x, y: this.network.getPosition(this.selected).y };
      await this.endpointService.updateStrategy(this.selected, body).subscribe(data => {      
        console.log(data);  
      });
      
      //this.network.disableEditMode();
    }else{
      console.log('entra al else');
      console.log('el body es: ', this.network.getPosition(this.selected).x, this.network.getPosition(this.selected).y)
      let body = {x: this.network.getPosition(this.selected).x, y: this.network.getPosition(this.selected).y };
      await this.endpointService.updateGoal(this.selected, body).subscribe(data => {      
        console.log(data);  
      });
      //this.network.disableEditMode();
    }

    console.log('fora de updateposgoal')
    
   }
   






  public funcio_auxiliar(){
    console.log('aux:')
    console.log(this.llistat_goals_del_map)   
    console.log(this.llistat_strategies); 
    console.log(this.llistat_strategies_del_map); 
  }





}


