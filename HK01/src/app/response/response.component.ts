
import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormArray, FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Survey } from 'Survey';
import { SURVEYS } from 'Survey';
import { RESPONSES } from 'Response';
import { Response } from 'Response';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { STRING_TYPE } from '@angular/compiler';
import {v4 as uuidv4} from 'uuid';
import { Router } from '@angular/router';



@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss']
})
export class ResponseComponent implements OnInit {
  count:number=1;
  id:string|null;
  surveyName: string | undefined;
  refId: string='';
  username: string = '';
  responseDate:Date = this.canadaTimeZone()
  questionArray:string[]=[];
  option1Array:string[]=[];
  option2Array:string[]=[];
  option3Array:string[]=[];
  option4Array:string[]=[];
  typeArray:boolean[]=[];
  typeRefArray:string[]=[];
  surveys: Survey[]=SURVEYS;
  responses:Response[]=RESPONSES;
  editMode: boolean=false;
  currentId:string='';


  @ViewChild('responseForm',{read:NgForm})form :any ;



  constructor(private http: HttpClient, private route: ActivatedRoute,private fb:FormBuilder,private router:Router) {
    this.id=this.route.snapshot.queryParamMap.get('_id');
  }



  responseForm=this.fb.group({
    _id:[''],
    refId:[''],
    responseDate: this.canadaTimeZone(),
    responses:this.fb.array([])


  })

  ngOnInit(): void {
    this.getData();

  }
  getData(){

    try {
      this.http.get<Survey[]>('/Survey').subscribe(data=>{
        this.surveys=data;
        const currentSurvey = this.surveys.find((p)=>{return p._id==this.id});


        this.surveyName=currentSurvey?.name;
        this.refId=this.id as string;

        var arrayLength = Object.keys(currentSurvey?.questions!).length
        var eachQuestion=Object.values(currentSurvey?.questions!)

        console.log(eachQuestion)
        console.log(eachQuestion[0].option1)

        this.clearFormArray(this.questions);


        for (let z=0;z<arrayLength;z++){

          this.questions.push(this.createRow());
          // console.log(this.count);
          this.count++;

          this.questionArray[z]=eachQuestion[z].question;
          this.option1Array[z]=eachQuestion[z].option1;
          this.option2Array[z]=eachQuestion[z].option2;
          this.option3Array[z]=eachQuestion[z].option3;
          this.option4Array[z]=eachQuestion[z].option4;
          this.typeRefArray[z]=eachQuestion[z].type;

          if(eachQuestion[z].type=="MC"){

            this.typeArray[z]=true;

          }else{
            this.typeArray[z]=false;
          }

          this.questions.controls[z].patchValue({

            type:eachQuestion[z].type});

        }


      console.log(this.option1Array)
      console.log(this.option2Array)
      console.log(this.option3Array)
      console.log(this.option4Array)
      console.log(this.typeArray)

      });
    } catch (error) {
      console.log(error);
    }
  }

  get questions():FormArray{
    return<FormArray>this.responseForm.get('responses');
  }

  createRow():FormGroup{
    return this.fb.group({
      response_id:this.count,
      response:[''],
      option:[''],
      type:['']

    })
  }
  submit(){

    var uuid=uuidv4();

    this.responseForm.patchValue({
      _id:'',

      refId: this.id,
      // refId:this.refId,
      responseDate:this.responseDate

    });

    var response=this.responseForm.value

      this.http.post<Response>('/Response',response).subscribe(data=>{
           this.responses.push(data);

  });
  this.router.navigate(['survey']);

  }

  cancel(){
    this.router.navigate(['survey'])
  }



  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  canadaTimeZone(){
    let Time =new Date().getTimezoneOffset()
    let now=new Date().getTime()
    let now2=new Date(now-Time* 60000)
    return now2
  }


  }





