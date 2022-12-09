export interface Survey{
  _id:string,
  name:string,
  author:string,
  startDate:Date,
  endDate:Date,
  questions:Object
}

export const SURVEYS:Survey[]=[
  {
    _id:'',
    name:'',
    author:'',
    startDate:new Date(),
    endDate:new Date(),
    questions:[]


  }
]
