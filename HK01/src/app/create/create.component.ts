import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Survey } from 'Survey';
import { SURVEYS } from 'Survey';
import { Response } from 'Response';
import { RESPONSES } from 'Response';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Chart} from 'chart.js/auto';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';





@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {
  count: number = 1;
  arrayCount: number = 0;
  surveys: Survey[] = SURVEYS;
  responses: Response[] = RESPONSES;
  editMode: boolean = false;
  currentId: string = '';
  displayFormArea = true;
  hiddenButton = true;
  typeArray: boolean[] = [];
  canvasControl: boolean[] = [];
  typeArrayForChart: string[] = [];
  wholeOption: number[][] = [];
  canvasLength: number[] = [];
  max: number = 5;
  responseLength: number = 0;
  charts: Chart[] = [];
  numberOfResponses: number = 0;
  surveyTitle:string =''
  checkAnyResponseDate= true;
  startDate: Date=new Date()




  @ViewChild('surveyForm', { read: NgForm }) form: any;

  constructor(private fb: FormBuilder, private http: HttpClient,private datePipe: DatePipe) { }



  arr = [
    {
      datesArray: [0],
    }
  ];

  surveyForm = this.fb.group({
    _id: [''],
    name: [''],
    author: [''],
    startDate: [''],
    endDate: [''],
    questions: this.fb.array([])


  })

  ngOnInit(): void {
    this.getData();
    this.initCanvas(this.max);
    this.canvasController()
    var date = new Date();
   console.log(this.datePipe.transform(date,'yyyy-MM-ddTHH:mm:ss' ));

  }



  getData() {
    try {
      this.http.get<Survey[]>('/Survey').subscribe(data => {
        this.surveys = data;
      });
    } catch (error) {
      console.log(error);
    }

  }

  showFormArea() {

    this.displayFormArea = false
  }

  get questions(): FormArray {
    return <FormArray>this.surveyForm.get('questions');
  }



  add() {

    if (!this.editMode) {
      // var uuid = uuidv4();
      // this.surveyForm.patchValue({
      //   _id: uuid

      // });
      var survey = this.surveyForm.value

      this.http.post<Survey>('/Survey', survey).subscribe(data => {
        this.surveys.push(data);
      });
      this.surveyForm.patchValue({
        _id: '',
        name: '',
        author: ''

      });

      this.clearFormArray(this.questions);
    }
    else

      this.updateTask(this.currentId);
    this.cancel();

  }




  updateTask(_id: string) {
    var survey = this.surveyForm.value
    console.log(survey);
    console.log(_id);
    // this.http.put<Survey>('/Survey/' + _id, survey).subscribe(data => {
    this.http.put<Survey>('/Survey/' + _id, survey).subscribe(data => {

      this.surveys.push(data);
      // console.log(survey);
      // console.log(_id);
      // console.log(data._id);
    });
    this.getData();
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }


  addItem(): void {
    this.questions.push(this.createRow());
    this.typeArray[this.arrayCount] = false;
    console.log(this.typeArray);
    this.count++;
    this.arrayCount++;
    console.log(this.count);
    console.log(this.arrayCount);
  }

  createRow(): FormGroup {
    return this.fb.group({
      question_id: this.count,
      question: [''],
      option1: ['N/A'],
      option2: ['N/A'],
      option3: ['N/A'],
      option4: ['N/A'],
      type: ['SQ']

    })
  }

  onDeleteItem(id: number): void {
    this.questions.removeAt(id);
    this.typeArray.splice(id, 1);
    console.log(this.typeArray)
    this.arrayCount--;

  }

  onEditClicked(_id: string) {
    this.showFormArea()
    this.currentId = _id;
    let currentSurvey = this.surveys.find((p) => { return p._id === _id });

    var now = new Date();

    // console.log(now);
    // console.log(currentSurvey?.startDate);
    var refStartDate=currentSurvey?.startDate!;
    var refEndDate=currentSurvey?.endDate!;

    // refDate.setMinutes(refDate.getMinutes() -refDate.getTimezoneOffset());
    // console.log(refDate);
    this.surveyForm.patchValue({
      name: currentSurvey?.name,
      author: currentSurvey?.author,
      startDate:this.datePipe.transform(refStartDate,'yyyy-MM-ddTHH:mm:ss' ),
      // startDate:currentSurvey?.endDate,
      endDate: this.datePipe.transform(refEndDate,'yyyy-MM-ddTHH:mm:ss' )

    })



    var arrayLength = Object.keys(currentSurvey?.questions!).length
    var eachQuestion = Object.values(currentSurvey?.questions!)

    this.clearFormArray(this.questions);

    for (let i = 0; i < arrayLength; i++) {

      this.questions.push(this.createRow());
      console.log(this.count);
      this.count++;

      if (eachQuestion[i].type == "MC") {
        this.typeArray[i] = true
      }

      this.questions.controls[i].patchValue({



        question: eachQuestion[i].question,
        option1: eachQuestion[i].option1,
        option2: eachQuestion[i].option2,
        option3: eachQuestion[i].option3,
        option4: eachQuestion[i].option4,
        type: eachQuestion[i].type

      });
    }
    this.editMode = true;
    this.backToTheTop();
  }

  cancel() {

    var survey = this.surveyForm.value
    this.surveyForm.patchValue({
      _id: null,
      name: '',
      author: '',
      startDate: '',
      endDate: ''
    });

    this.clearFormArray(this.questions);
    this.editMode = false;
    this.displayFormArea = true;
    this.backToTheTop();
  }

  onDeleteClicked(_id: string) {
    this.http.delete<Survey>('/Survey/' + _id).subscribe(data => {
      this.currentId = data._id;
    });
    this.getData();
    this.cancel();
  }

  MC(id: number) {
    this.questions.controls[id].patchValue({
      type: "MC",
      option1: "",
      option2: "",
      option3: "",
      option4: ""

    })


    this.typeArray[id] = true
    console.log(this.typeArray)
  }

  SQ(id: number) {
    this.questions.controls[id].patchValue({
      type: "SQ",
      option1: "N/A",
      option2: "N/A",
      option3: "N/A",
      option4: "N/A"

    })


    this.typeArray[id] = false
    console.log(this.typeArray)
  }

  // Statistics-----------------------------------------------------------------------

  getSurveyData(_id: string,position: HTMLElement) {
    this.hiddenButton = false
    this.hideCanvas(this.max);

    let currentSurvey = this.surveys.find((p) => { return p._id === _id });

      this.surveyTitle=currentSurvey!.name


    try {
      this.http.get<Response[]>('/Response').subscribe(data => {
        this.responses = data;

        let currentResponse = this.responses.filter((t) => { return t.refId === _id });

        this.numberOfResponses = currentResponse.length
        if (this.numberOfResponses>0){
          this.checkAnyResponseDate= false;
        }else{
          this.checkAnyResponseDate= true;

        }
        this.responseLength= Object.keys(currentResponse[0].responses).length


        if (currentResponse !== undefined) {

          console.log("ok");

        }
        if (currentResponse === undefined) {
          console.log("undefined");
        }

        // this.responseLength = currentResponse.length
        for (let r = 0; r < this.numberOfResponses; r++) {

          // this.responseLength = Object.keys(currentResponse[0].responses).length

          let answer = Object.values(currentResponse[r].responses)
          for (let i = 0; i < this.responseLength; i++) {
            if (answer[i].type === "MC") {
              this.wholeOption[i] = [0, 0, 0, 0];
              this.typeArrayForChart[i] = "MC";
              //end of checking response mc value switch
            } else if (answer[i].type === "SQ") {
              this.wholeOption[i] = [0, 0];
              this.typeArrayForChart[i] = "SQ";
            }//end of checking response type if
          }//end of checking each response loop

          // console.log(this.wholeOption)
        }//end of checking whole response loop


        for (let r = 0; r < this.numberOfResponses; r++) {
          // let abc = Object.keys(currentResponse[0].responses).length
          let answer = Object.values(currentResponse[r].responses)
          for (let i = 0; i <this.responseLength; i++) {
            if (answer[i].type === "MC") {
              switch (answer[i].option) {
                case 'a': {
                  this.wholeOption[i][0]++;

                  break;
                }
                case 'b': {
                  this.wholeOption[i][1]++;

                  break;
                }
                case 'c': {

                  this.wholeOption[i][2]++;

                  break;
                }
                case 'd': {
                  this.wholeOption[i][3]++;

                  break;
                }
                default: {
                  //statements;
                  break;
                }
              }//end of checking response mc value switch
            } else if (answer[i].type === "SQ") {
              if (answer[i].response !== "") {
                this.wholeOption[i][0]++;
              }
              else {
                this.wholeOption[i][1]++;
              }
            }//end of checking response type if


          }//end of checking each response loop

        }//end of checking whole response loop

        console.log(this.wholeOption)
        console.log(this.typeArrayForChart)
        console.log(this.responseLength)

        for(let i=0;i<this.responseLength;i++){
          let responseData =
          {
            datesArray: this.wholeOption[i],
          }
          this.arr[i]=responseData

        }
        //---------------------------start of plot graph loop----------------------------------------
        this.showCanvas(this.responseLength)

        let localLength = this.responseLength
        let chartLength = this.charts.length
        this.checkDeleteChart(chartLength)

        for (let z = 0; z < localLength; z++) {

          if (this.typeArrayForChart[z] === "MC") {

            const myChart = new Chart("canvas-" + z, {
              type: 'pie',
              data: {
                labels: ['A', 'B', 'C', 'D'],
                datasets: [
                  {
                  label: "Total: ",

                  data: this.wholeOption[z],
                  backgroundColor: [
                    'rgba(255,99,132,0.2',
                    'rgba(54,162,235,0.2)',
                    'rgba(255,206,86,0.2)',
                    'rgba(75,192,192,0.2)'

                  ],
                  borderColor: [
                    'rgba(255,99,132,1',
                    'rgba(54,162,235,1)',
                    'rgba(255,206,86,1)',
                    'rgba(75,192,192,1)'

                  ],
                  borderWidth: 3,
                  hoverOffset: 20,
                }]
              }, options: {

                layout: {
                  padding: 20
                },
                plugins: {
                  title: {
                    display: true,
                    text: 'Question ' + [z + 1]
                  },
                  tooltip: {
                    callbacks: {

                      afterLabel: function (data) {
                        let label = ''
                        let label2 = 0
                        for (let i = 0; i < 4; i++) {

                          label2 = label2 + data.dataset.data[i]


                          label = "Percentage: " + Math.round((data.dataset.data[data.dataIndex]) / label2 * 100).toString() + "%"

                        }
                        return label;
                      }
                    }
                  }
                }
              }

            });
            this.charts[z] = myChart

          } else if (this.typeArrayForChart[z] === "SQ") {

            const myChart = new Chart("canvas-" + z, {
              type: 'pie',
              data: {
                labels: ['Response', 'No Response'],
                datasets: [{
                  label: "Total: ",
                  // data:[20,19,3,5,2,3],
                  data: this.wholeOption[z],
                  backgroundColor: [
                    'rgba(255,99,132,0.2',
                    'rgba(54,162,235,0.2)'

                  ],
                  borderColor: [
                    'rgba(255,99,132,1',
                    'rgba(54,162,235,1)'

                  ],
                  borderWidth: 3,
                  hoverOffset: 20,
                }]
              }, options: {
                layout: {
                  padding: 20
                },
                plugins: {
                  title: {
                    display: true,
                    text: 'Question ' + [z + 1]
                  }, tooltip: {

                    callbacks: {

                      afterLabel: function (data) {
                        let label = ''
                        let label2 = 0
                        for (let i = 0; i < 2; i++) {

                          label2 = label2 + data.dataset.data[i]
                          label = "Percentage: " + Math.round((data.dataset.data[data.dataIndex]) / label2 * 100).toString() + "%"

                        }
                        return label;
                      }
                    }
                  },
                }
              }
            });
            this.charts[z] = myChart
          }
        }
      })



    } catch (error) {
      console.log(error);
    }
    this.typeArrayForChart = [];
    position.scrollIntoView({behavior: 'smooth'});


  }



  canvasController() {
    for (let i = 0; i < this.max; i++) {
      this.canvasControl[i] = true
      // this.canvasControl[i]=false
    }
  }

  addCanvas() {
    let l = this.canvasLength.length
    this.canvasLength[l] = 1
  }
  initCanvas(max: number): void {
    for (let z = 0; z < max; z++) {
      this.addCanvas()
    }

  }
  showCanvas(l: number) {
    for (let z = 0; z < l; z++) {
      this.canvasControl[z] = false
    }
  }
  hideCanvas(l: number) {
    for (let z = 0; z < l; z++) {
      this.canvasControl[z] = true
    }
  }
  checkDeleteChart(length: number) {
    for (let i = 0; i < length; i++) {
      this.charts[i].destroy();
    }
  }
  hideResult() {
    this.hiddenButton = true;
    this.hideCanvas(this.responseLength)
  }
  canadaTimeZone() {
    let Time = new Date().getTimezoneOffset()
    let now = new Date().getTime()
    let now2 = new Date(now - Time * 60000)
    return now2
  }
  savePDF(){
    html2canvas(document.getElementById("exportContent")!).then(canvas => {
      // Few necessary setting options

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var width = pdf.internal.pageSize.getWidth();
      var height = canvas.height * width / canvas.width;
      var position = 0;
      console.log(canvas.height)
      console.log(height)

      pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)


      console.log(height)
        while (height >= 297){

        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG',0,-297,  width, height);
        height-=297
        console.log(height)
      }
      pdf.save('output.pdf'); // Generated PDF
      });
  }

  backToTheTop(){
    window.scrollTo(0, 0);
  }




}

