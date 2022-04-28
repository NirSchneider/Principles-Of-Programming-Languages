/* 2.1 */

import { resolveModuleName } from "typescript"

export const MISSING_KEY = '___MISSING___'

type PromisedStore<K, V> = {
    get(key: K): Promise<V>,
    set(key: K, value: V): Promise<void>,
    delete(key: K): Promise<void>
}

export function makePromisedStore<K, V>(): PromisedStore<K, V> {
    let myMap : Map<K,V> = new Map();
    return {
        get(key: K) {
            return new Promise <V>((res,rej)=>{
                var resultFromGet : V|undefined = myMap.get(key);
                if (resultFromGet == undefined) {
                    return rej(MISSING_KEY)
                }
                else 
                    return res(resultFromGet)
            })
        },
        set(key: K, value: V) {
            return new Promise<void> ((res,rej)=>{
                myMap.set(key,value);
                return res()
            })
        },
        delete(key: K) {
            return new Promise<void> ((res,rej)=>{
            var resultFromGet : V|undefined = myMap.get(key);
            if(resultFromGet == undefined){
                return rej(MISSING_KEY)
            }
            else{
                myMap.delete(key);
                return res();
            }
            })
        },
    }
}

export function getAll <K, V> (store: PromisedStore<K, V>, keys: K[]): Promise<Array<V>> { 
    return Promise.all(keys.map(store.get))
}

/* 2.2 */
const fetch = async <T,R>(store :PromisedStore<T,R>,f:(param:T) => R,param: T): Promise<R> =>{
    try{
        const data = await(store.get(param));
        return data;
    }
    catch {
        store.set(param,f(param));
        return store.get(param);
    }
    
    
}

export function asycMemo<T, R> (f:(param:T) => R):(param:T)=> Promise<R> {
    let store: PromisedStore<T,R> =makePromisedStore<T, R>();
    let returnFunction = (param:T)=>{
            return fetch(store,f,param)
    }
    return returnFunction;
}

/* 2.3 */
export function lazyFilter<T> (genFn:() => Generator<T>,filterFn:(elem:T)=> boolean):()=>Generator<T> {
    function * myGen (){
        for(let x of genFn()){
            if(filterFn(x))
                yield x;
        }
    }
    return ()=>myGen();  
}
export function lazyMap<T, R>(genFn: () => Generator<T>, mapFn: (elem:T) => R): ()=>Generator<R> {
    function * myGen (){
        for(let x of genFn()){
            yield mapFn(x);
        }
    }
    return ()=>myGen(); 
}

/* 2.4 */
// you can use 'any' in this question
export async function asyncWaterfallWithRetry (fns: [()=>Promise<any>,...((arg:any)=>Promise<any>)[]]): Promise<any> { //change!!!!
    let first = fns[0];
    let rest = fns.slice(1);
    let curr = first().then((x:any) => fns[0]()
        .catch(async (reason: any) => await new Promise<any>((resolve) => setTimeout(() => resolve(first()) ,2000))) //first try
        .catch(async (reason: any) => await new Promise<any>((resolve) => setTimeout(() => resolve(first()) ,2000))) //second try
        .catch(async (reason: any) => await new Promise<any>((reject) => reject("failed two retries"))));
    for(let i:number = 0; i < rest.length; i++){
        curr = curr.then((x: any) => rest[i](x)
        .catch(async (reason: any) => await new Promise<any>((resolve) => setTimeout(() => resolve(rest[i](x)) ,2000))) //first try
        .catch(async (reason: any) => await new Promise<any>((resolve) => setTimeout(() => resolve(rest[i](x)) ,2000))) //second try
        .catch(async (reason: any) => await new Promise<any>((reject) => reject("failed two retries"))));
    }
    return curr;
}


