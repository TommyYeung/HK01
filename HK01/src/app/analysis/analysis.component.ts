import { Component, OnInit  ,ViewChildren ,ElementRef, QueryList } from '@angular/core';
import {Chart} from 'chart.js/auto';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})




export class AnalysisComponent implements OnInit {
  // @ViewChildren('pr_chart', { read: ElementRef }) chartElementRefs: QueryList<ElementRef>;
  dataArray1: number[][]=[[1,2,3,4],[1,2,3,4],[2,1,3,4]];
  dataLength:number=this.dataArray1.length;
  dataLength2:number[]=[];
   x=3
   d=100-3-1
  charts: Chart[] = [];
  arr:any[] = []
  public myChart: Chart | undefined
  display = true;

  constructor(private el:ElementRef) { }

  ngOnInit(): void {

// this.genBarChart()
  this.test(100)
// this. myDrawingFunction(100)


console.log(this.dataLength)
}
add(){
  let l=this.dataLength2.length
  this.dataLength2[l]=1
  console.log(this.dataLength2)
}
delete(d:number){
  for (let z=0;z<d+1;z++){
  let l=this.dataLength2.length
  this.dataLength2.splice(0, 1)
  console.log(this.dataLength2)
  }
}
test(max:number):void{
  for (let z=0;z<100;z++){
    this.add()
  }

}

gen(x:number):void{
this.display=false
  // this.delete(this.d)
this.genPieChart(x)

}
// genBarChart(){
//   const myChart = new Chart("myChart", {
//     type:'bar',
//     data:{
//       labels:['Red','Blue','Yellow','Green','Purple','Orange'],
//       datasets:[{
//         label:'# of Votes',
//         data:[12,19,3,5,2,3],
//         backgroundColor:[
//           'rgba(255,99,132,0.2',
//           'rgba(54,162,235,0.2)',
//           'rgba(255,206,86,0.2)',
//           'rgba(75,192,192,0.2)',
//           'rgba(153,102,255,0.2)',
//           'rgba(255,159,64,0.2)',

//         ],
//         borderColor:[
//           'rgba(255,99,132,1',
//           'rgba(54,162,235,1)',
//           'rgba(255,206,86,1)',
//           'rgba(75,192,192,1)',
//           'rgba(153,102,255,1)',
//           'rgba(255,159,64,1)',
//         ],

//         borderWidth:1

//       }]
//     },

//   });
// }




genPieChart(length:number){

  for (let z=0;z<length;z++){
 const myChart = new Chart("canvas-"+z, {
    type:'pie',
    data:{
      labels:['A','B','C','D'],
      datasets:[{
        label:'# of Votes',
        // data:[20,19,3,5,2,3],
        data:this.dataArray1[z],
        backgroundColor:[
          'rgba(255,99,132,0.2',
          'rgba(54,162,235,0.2)',
          'rgba(255,206,86,0.2)',
          'rgba(75,192,192,0.2)'

        ],
        borderColor:[
          'rgba(255,99,132,1',
          'rgba(54,162,235,1)',
          'rgba(255,206,86,1)',
          'rgba(75,192,192,1)'

        ],
        borderWidth:3,
        hoverOffset: 20,




      }]
    }, options:{
      layout: {
        padding: 20
    }
    }

  });
  this.charts[z]=myChart
}
console.log(this.charts)
}


  trackByFn(index:number){
    return (index);
  }
  // myDrawingFunction(index:number){
  //   this.arr[index] = 'update'
  chartDel(){
for(let i=0;i<3;i++){
   console.log(this.charts[i].canvas)
  this.charts[i].destroy();}

  }



}
