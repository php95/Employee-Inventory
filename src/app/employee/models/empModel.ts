export class EmployeeData {
    id?: number ;
    phone?: string; 
    name?: string; 
    email?: string; 
    date?: Date; 
    salary?: number ;
    country?:{
      name:string,
      code:string
    };
  }