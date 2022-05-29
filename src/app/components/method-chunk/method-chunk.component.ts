import { Component, Input, OnInit } from '@angular/core';
import { EndpointService } from 'src/app/services/endpoint.service';
import { MethodElement } from 'src/app/models/method-element';
import { MethodChunk } from 'src/app/models/method-chunk';
import { Goal } from 'src/app/models/goal';
import { Criterion } from 'src/app/models/criterion';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-method-chunk',
  templateUrl: './method-chunk.component.html',
  styleUrls: ['./method-chunk.component.css']
})
export class MethodChunkComponent implements OnInit {

  @Input() id: string;
  
  public mode: ProgressSpinnerMode = 'indeterminate';
  public loaded = false;

  public methodChunk;

  idFormControl = new FormControl('');
  nameFormControl = new FormControl('');
  descriptionFormControl = new FormControl('');
  intentionFormControl = new FormControl('');
  processPartFormControl = new FormControl('');

  constructor(
    private endpointService: EndpointService
  ) { }

  ngOnInit(): void {
    this.id = "Chu-ReqEli-01";
    console.log(this.id)
    if(this.id !== undefined) {
      this.endpointService.getMethodChunkById(this.id).subscribe(data => {
        this.methodChunk = this.parseMethodChunk(data)
        setTimeout(() => {this.loaded = true;}, 2000)
        
      })
    } else {
      this.methodChunk = new MethodChunk("", "", "", false, new Goal(0, ""), new MethodElement("", "", false, "", "", 3, [], [], []), [], [], [], [], []);
      this.loaded = true;
    }
  }

  private parseMethodChunk(data) {
    console.log(data)
    const goal = new Goal(data['Intention'][0]['id'], data['Intention'][0]['name']);
    console.log(goal);
    let tools: MethodElement[] = [];
    let productPart: MethodElement[] = [];
    let roles: MethodElement[] = [];
    let situation: MethodElement[] = [];
    let contextCriteria: Criterion[] = [];
    for(let t in data['Tools']){
      //tools.push(new MethodElement(data['Tools'][t]['id'], data['Tools'][t]['name'], data['Tools'][t]['description'], "", 1))
    }
    for(let t in data['Situation']){
      //situation.push(new MethodElement(data['Situation'][t]['id'], data['Situation'][t]['name'], data['Situation'][t]['description'], "", 2))
    }
    for(let t in data['Product part']){
      //productPart.push(new MethodElement(data['Product part'][t]['id'], data['Product part'][t]['name'], data['Product part'][t]['description'], "", 2))
    }
    for(let t in data['Roles']){
      //roles.push(new MethodElement(data['Roles'][t]['id'], data['Roles'][t]['name'], data['Roles'][t]['description'], "", 4))
    }
    let activity: MethodElement = new MethodElement(data["Process part"][0]["id"], data["Process part"][0]["name"], data["Process part"][0]["abstract"], data["Process part"][0]["description"], "", 3, [], [], []);
    console.log(tools);
    console.log(productPart);
    console.log(roles);
    console.log(situation);
    console.log(activity);
    return new MethodChunk(data['0']['id'], data['0']['name'], data['0']['description'], data['abstract'], goal, activity, tools, situation, productPart, roles, []);
  }

}
