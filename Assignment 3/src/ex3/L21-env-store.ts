import { add, map, zipWith } from "ramda";
import { Value } from './L21-value-store';
import { Result, makeFailure, makeOk, bind, either } from "../shared/result";

// ========================================================
// Box datatype
// Encapsulate mutation in a single type.
type Box<T> = T[];
const makeBox = <T>(x: T): Box<T> => ([x]);
const unbox = <T>(b: Box<T>): T => b[0];
const setBox = <T>(b: Box<T>, v: T): void => { b[0] = v; return; }

// ========================================================
// Store datatype
export interface Store {
    tag: "Store";
    vals: Box<Box<Value>[]>;
}

export const isStore = (exp:any):exp is Store => exp.tag==="Store";

export const makeEmptyStore = (): Store =>
                                            ({     
                                                tag: "Store",
                                                vals:makeBox([])
                                            })

export const theStore: Store = makeEmptyStore();

export const extendStore = (s: Store, val: Value): Store => {
    setBox(s.vals,unbox(s.vals).concat([makeBox(val)]))
    return s;
}

export const applyStore = (store: Store, address: number): Result<Value> =>
    ((unbox(store.vals).length) > address && address >= 0 ) ? makeOk(unbox(unbox(store.vals)[address])):
    makeFailure("address isn't valid");

export const setStore = (store: Store, address: number, val: Value): void => 
    setBox(unbox(store.vals)[address],val);
    


// ========================================================
// Environment data type
// export type Env = EmptyEnv | ExtEnv;
export type Env = GlobalEnv | ExtEnv;

interface GlobalEnv {
    tag: "GlobalEnv";
    vars: Box<string[]>;
    addresses: Box<number[]>
}

export interface ExtEnv {
    tag: "ExtEnv";
    vars: string[];
    addresses: number[];
    nextEnv: Env;
}

const makeGlobalEnv = (): GlobalEnv =>
    ({tag: "GlobalEnv", vars: makeBox([]), addresses:makeBox([])});

export const isGlobalEnv = (x: any): x is GlobalEnv => x.tag === "GlobalEnv";

// There is a single mutable value in the type Global-env
export const theGlobalEnv = makeGlobalEnv();

export const makeExtEnv = (vs: string[], addresses: number[], env: Env): ExtEnv =>
    ({tag: "ExtEnv", vars: vs, addresses: addresses, nextEnv: env});

const isExtEnv = (x: any): x is ExtEnv => x.tag === "ExtEnv";

export const isEnv = (x: any): x is Env => isGlobalEnv(x) || isExtEnv(x);

// Apply-env
export const applyEnv = (env: Env, v: string): Result<number> =>
    isGlobalEnv(env) ? applyGlobalEnv(env, v) :
    applyExtEnv(env, v);

const applyGlobalEnv = (env: GlobalEnv, v: string): Result<number> => 
    unbox(env.vars).includes(v) ? makeOk(unbox(env.addresses)[unbox(env.vars).indexOf(v)]):
    makeFailure("the vars doesnt exist");

export const globalEnvAddBinding = (v: string, addr: number): void =>
{
     setBox(theGlobalEnv.vars, unbox(theGlobalEnv.vars).concat([v]));
     setBox(theGlobalEnv.addresses, unbox(theGlobalEnv.addresses).concat([addr]));
}

const applyExtEnv = (env: ExtEnv, v: string): Result<number> =>
    env.vars.includes(v) ? makeOk(env.addresses[env.vars.indexOf(v)]):
    applyEnv(env.nextEnv, v);

export const applyEnvStore = (env:Env, v: string) :Result<Value> =>
    bind(applyEnv(env,v),(addr:number)=>applyStore(theStore,addr));
    