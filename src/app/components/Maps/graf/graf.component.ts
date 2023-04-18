import { Component, OnInit, ViewChild } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { Network } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";
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

  constructor() { }

  ngOnInit(): void {
    this.nodes = new DataSet([
      { id: 1, label: "Start", title: 1 },
      { id: 2, label: "Stop", title: 2 }
    ]);

    // create an array with edges
    this.edges = new DataSet([
    ]);

    var treeData = {
      nodes: this.nodes,
      edges: this.edges
    };

    this.loadVisTree(treeData);

    //var selected;
    var c = this.networkContainer.nativeElement;
    this.network.on("click",  (params) => {
      params.event = "[original event]";
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
    console.log(this.nodeLabel.nativeElement.value);
    this.network.addNodeMode();
    }

  public modoEditEdge() {
    this.network.addEdgeMode();
    }

  public deleteSelected() {
      this.nodes.remove({ id: this.selected });
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
        id: this.createSt.nativeElement.value,
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
        to: this.createSt.nativeElement.value,
        arrows: "to",
        smooth: {type: 'cubicBezier'},
      });
    } catch (err) {
      alert(err);
    }
  
    try {
      this.edges.add({
        //id: document.getElementById("edge-id").value + 1,
        from: this.createSt.nativeElement.value,
        to: b,
        arrows: "to",
        color: "#2B7CE9",
        smooth: {type: 'cubicBezier'},
      });
    } catch (err) {
      alert(err);
    }
  }

  

}
