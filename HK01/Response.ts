export interface Response{

  _id:string,
  refId:string,
  responseDate:Date
  responses:object
}

export const RESPONSES:Response[]=[
  {
    _id:'',
    refId:'',
    responseDate:new Date(),
    responses:[]
  }
]



