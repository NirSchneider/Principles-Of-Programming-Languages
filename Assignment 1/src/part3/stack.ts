import { State, bind } from "./state";

export type Stack = number[];

export const push = (x:number): State <Stack ,undefined> =>{
    const f = (s:Stack) : [Stack ,undefined] => {
        return [[x].concat(s),undefined]
    }
    return f;
}

export const pop : State <Stack ,number> =(s:Stack):[Stack,number]=> {return[s.slice(1),s[0]];}
    
export const stackManip :State <Stack,any> = bind(pop,(x)=>bind(push(x*x),()=>bind(pop,(y)=>push(x+y))));

