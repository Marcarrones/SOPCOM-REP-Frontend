import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { Network } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { EndpointService } from 'src/app/services/endpoint.service';
import { MapComponent } from '../map/map.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigatorService } from 'src/app/services/navigator.service';
import { ActivatedRoute, Router } from '@angular/router';


//declare var vis:any;



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
  @Input() prueba_id: MapComponent;
  @Input() prueba_name: MapComponent;
  @Input() info_completa: string;
  @Input() acceso: boolean;

  constructor(
    private endpointService: EndpointService,
    private _snackBar: MatSnackBar,
    public navigatorService: NavigatorService,
    private router: Router,
  ) {  }

  ngOnInit(): void {
    console.log(this.acceso);
    if(this.acceso != true){
    this.nodes = new DataSet([
      { id: 1, label: "Start", title: 1 },
      { id: 2, label: "Stop", title: 2 }
    ]);
    this.edges = new DataSet([
    ]);
  }else{
    var info = JSON.parse(this.info_completa);
    var auxnodes : any = [];
    var auxedges : any = [];
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
      }else{
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
  }

    // create an array with edges
    

    var treeData = {
      nodes: this.nodes,
      edges: this.edges
    };

    this.loadVisTree(treeData);

    //var selected;
    var c = this.networkContainer.nativeElement;
    this.network.on("click",  (params) => {
      params.event = "[original event]";
      this.paramsauxiliar = params;
      this.selected = this.network.getNodeAt(params.pointer.DOM)
      console.log(
        "ID de Nodo Seleccionado: " + this.network.getNodeAt(params.pointer.DOM)
      );
});


  }

  



  


  loadVisTree(treedata) {
    var a = this;
    var options = {
      physics: false,
      interaction: { hover: true, multiselect: false },
      manipulation: {
        enabled: false,
        addNode: function(nodeData,callback) {
          nodeData.id = a.nodeLabel.nativeElement.value,
          nodeData.label = a.nodeLabel.nativeElement.value,
          nodeData.title = a.nodeLabel.nativeElement.value,
          //tamany++;
          callback(nodeData);
        },
        addEdge: (edgeData,callback) => {
          this.addStrategy_dos(edgeData.from, edgeData.to);
          callback(edgeData);
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
    var x = this.network.clustering.findNode(this.nodeLabel.nativeElement.value);
    if(this.nodeLabel.nativeElement.value != x){
    this.network.addNodeMode();
    }else{
      alert('Node name already exists');
    }
    }

  public modoEditEdge() {
    var x = this.network.clustering.findNode('S_' + this.createSt.nativeElement.value);
    console.log(x);
    if('S_' + this.createSt.nativeElement.value != x){
    this.network.addEdgeMode();
    }else{
      alert('Strategy name already exists');
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
        alert('Delete Strategies before deleting Node');
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
    try {
      var pos1 = this.network.getPosition(a);
      var pos2 = this.network.getPosition(b);
      console.log(pos1.x, pos2.x);
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
      console.log(N);
      console.log(ST);
    
    N.forEach(async x => {
      let dataN = {name: x.options.label, map: this.prueba_id};
        await this.endpointService.addNewGoal(dataN).subscribe(data => {
        console.log("data", data)
        //if(!this.dialog)this.router.navigate(['/map', this.map.id]);
    })
    });


    ST.forEach(async x => {
      let source = x.edges[0].fromId;
      let target = x.edges[1].toId;
      let dataST = {id:x.options.label, name: x.options.label, goal_tgt: target, goal_src: source};
        await this.endpointService.addNewStrategy(dataST).subscribe(data => {
        console.log("data", data)
        //if(!this.dialog)this.router.navigate(['/map', this.map.id]);
    })
    });
    





    this.router.navigate(['/map', this.prueba_id]);
    
      
    


    //console.log(this.network.params);
    //console.log(this.prueba_id);
    //console.log(this.prueba_name);
  }

  public objectToArray(obj) {
    return Object.keys(obj).map(function (key) {
      obj[key].id = key;
      return obj[key];
    });
  }

  

  
















  public async submitFinal(){

    let body = this.stringifyMap();


  
    await this.endpointService.addMap(body).subscribe(data => {
          console.log("data", data)
          this.prueba_id = data.id;
          this._snackBar.open("Map added!", 'X', {duration: 3000, panelClass: ['green-snackbar']});
          this.navigatorService.refreshMapList();
          //if(!this.dialog)this.router.navigate(['/map', this.map.id]);
      })
          //this.navigatorService.refreshMapList();
          //this.router.navigate(['/map', this.prueba_id]);  
          console.log('creacio map completa')    
      //return true;

      
      
      /*
      await this.endpointService.addMap(body).subscribe(data => {
        console.log("data", data)
        this.prueba_id = data.id;
        this._snackBar.open("Map added!", 'X', {duration: 3000, panelClass: ['green-snackbar']});
        this.navigatorService.refreshMapList();
        //if(!this.dialog)this.router.navigate(['/map', this.map.id]);
    })*/

      this.nada();
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

}
