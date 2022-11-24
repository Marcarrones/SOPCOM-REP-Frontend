import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from 'src/app/services/navigator.service';
import { EndpointService } from 'src/app/services/endpoint.service';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public edit = false;
  @Input() id;
  public map;
  public loaded = false;
  public nameFormControl: FormControl;
  public idFormControl: FormControl;


  //Sample test data it can be dynamic as well.
  QuestionsForSubmittedAnswersArray: any[] = [
    {
      Goal: '',
      Strategy: '',
      Target: 'Stop',
    }
  ];

  FeedBack!: FormGroup;


  constructor(
    public navigatorService: NavigatorService,
    private router: Router,
    private route: ActivatedRoute,
    private endpointService: EndpointService,
    private http: HttpClient,
    public formBuilder: FormBuilder
  ) {  }


 

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.createContactForm();
    this.sampleData();
    console.log(this.id);
    if(this.id !== undefined && this.id !== null &&  this.id !== "") {
      console.log(this.id);
      this.endpointService.getMapById(this.id).subscribe(data => {
        if(data['error'] === undefined) this.map = this.parseMap(data);
        else {
          this.edit = true;
          this.map = new Map(null);
          this.loadFormControls();
          this.navigatorService.allowChange = false;
        }
        this.loadFormControls();
        this.loaded = true;
      })

    } else {
      this.map = new Map(null);
      this.edit = true;
      this.loadFormControls();
      this.loaded = true;
      this.navigatorService.allowChange = false;

    }
  }


  createContactForm() {
    this.FeedBack = this.formBuilder.group({
      Rows: this.formBuilder.array([this.initRows()]),
    });
  }

  initRows() {
    return this.formBuilder.group({
      Goal: ['Start'],
      Strategy: [''],
      Target: [''],
    });
  }

  get formArr() {
    return this.FeedBack.get('Rows') as FormArray;
  }
  sampleData() {
    this.QuestionsForSubmittedAnswersArray.forEach((row) => {
      this.formArr.push(this.addRow(row));
    });
  }
addRow(obj) {
    return this.formBuilder.group({
      Goal: [obj.Goal],
      Strategy: [obj.Strategy],
      Target: [obj.Target],
    });
  }

  addNewRow() {
    let obj1 = {
      Goal: '',
      Strategy: '',
      Target: 'Stop',
    };
    this.formArr.push(this.addRow(obj1));
  }


  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }


  private parseMap(data) {
    this.edit = false;
    return new Map(data['id']);
  }

  private loadFormControls() {
    this.nameFormControl = new FormControl({value: this.map.name, disabled: !this.edit}, Validators.required);
    this.nameFormControl.valueChanges.subscribe(value => {
      this.navigatorService.allowChange = true;
      this.map.name = value;
    })
    this.idFormControl = new FormControl({value: this.map.id, disabled: !this.edit}, Validators.required);
    this.idFormControl.valueChanges.subscribe(value => {
      this.navigatorService.allowChange = true;
      this.map.id = value;
    })
    
  }

  public creaMap(){
    
    
        /*version buena  1

        this.navigatorService.allowChange = false;
        let body = this.stringifyName();
        this.http.post<any>('http://localhost:3000/maps', body).subscribe(data => {
          this.id = data.id;
          */


      this.navigatorService.allowChange = false;
      let body = this.stringifyName();      
      this.endpointService.addMap(body).subscribe(data => {
      console.log("data", data)
      this.map.id = data.id;
      console.log(this.map)
      this.navigatorService.refreshMapList();
      this.router.navigate(['/map', data['id']])
    })


        this.navigatorService.refreshMapList();
        
        return true;
    
  
  }


  public stringifyName() {
    

    let body = {id: this.map.id, name: this.map.name, author:'fexil'};
    console.log(body);
    
    
    
    //console.log(body);
    //console.log(JSON.stringify(body));
    //return JSON.stringify(body);
    return body;
  }



  public borraMap(){
    
    /*
  this.navigatorService.allowChange = false;
  let body = this.stringifyName();      
  this.endpointService.addMap(body).subscribe(data => {
  console.log("data", data)
  this.map.id = data.id;
  console.log(this.map)
  this.navigatorService.refreshMapList();
})*/
console.log(this.id);
this.navigatorService.allowChange = false;
    this.endpointService.deleteMap(this.id).subscribe( data => {
      this.navigatorService.refreshMapList();
      this.router.navigate(['/map']);
    })


    this.navigatorService.refreshMapList();
    return true;


}


public submitFinal(){

  console.log(this.FeedBack.value);
  //console.log(this.FeedBack.value.Rows.length);
  var tamany = this.FeedBack.value.Rows.length;

  
  //for (let num = 0; num < tamany; num++ ){
    //console.log(this.FeedBack.value.Rows[num]);
  //}


  

  
  this.FeedBack.value.id = this.map.id;
  this.FeedBack.value.name = this.map.name;
  this.FeedBack.value.author = 'felix';


  this.navigatorService.allowChange = false;
      this.endpointService.addMap(this.FeedBack.value).subscribe(data => {
      console.log("data", data)
      this.map.id = data.id;
      console.log(this.map)
      this.navigatorService.refreshMapList();
      this.router.navigate(['/map', data['id']])
    })


        this.navigatorService.refreshMapList();
        
        return true;
}

 
}
