import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Survey } from 'Survey';
import { SURVEYS } from 'Survey';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  todayDate: Date=new Date();
  surveys: Survey[]=SURVEYS;
  validSurveys:Survey[]=SURVEYS;
  editMode: boolean=false;
  currentId:string='';
  @ViewChild('surveyForm',{read:NgForm})form :any ;


  constructor(private router: Router,private http: HttpClient,) { }

  ngOnInit(): void {
    this.getData();

  }

//ready to add function to jump to response page

  getData(){

    try {
      this.http.get<Survey[]>('/Survey').subscribe(data=>{
        this.surveys=data.filter((t) => { return new Date(t.endDate) >= this.todayDate && new Date(t.startDate)<= this.todayDate });;

      });

    } catch (error) {
      console.log(error);

    }


  }


  response(_id:string): void {

    this.router.navigate(['response'],{queryParams:{_id:_id} });


  }





}
