import { State, bind } from "./state";

export type Queue = number[];

export const enqueue = (x:number) : State <Queue,undefined>  => {
    const f = (Q :Queue) : [Queue , undefined] => {
        return [Q.concat(x), undefined];
    }
    return f;
} 
export const dequeue : State <Queue,number> = (Q:Queue):[Queue,number] => {return [Q.slice(1), Q[0]];}
 
export const queueManip : State <Queue,number> = bind(dequeue,(x)=>bind( enqueue(2*x),()=> bind( enqueue(x/3),()=>dequeue)));                   
