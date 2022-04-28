import { Exp ,Program ,isVarRef,isProcExp,isDefineExp, makePrimOp } from '../imp/L3-ast' ;
import {Result ,makeOk ,makeFailure,mapResult,safe3,bind,safe2} from '../shared/result' ;
import {isBoolExp ,isNumExp ,isPrimOp ,isIfExp ,isAppExp ,isProgram, makeStrExp,isStrExp} from './L31-ast' ;
import {map} from 'ramda'
import { first } from '../shared/list';

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => 
   isProgram(exp) ? safe2((firstExps:string[] , lastExp :string)=> ProgramToPython(firstExps,lastExp))
   (mapResult(l2ToPython ,exp.exps.splice(0,exp.exps.length-1)),l2ToPython(exp.exps[exp.exps.length-1])) :
   isBoolExp(exp) ? makeOk(exp.val ? "true" : "false") :
   isNumExp(exp)? makeOk(exp.val.toString()) :
   isVarRef (exp ) ? makeOk (exp.var) :
   isPrimOp (exp) ? makeOk((PrimToPython(exp.op))):
   isDefineExp(exp)?bind(l2ToPython(exp.val ), ( val: string) => makeOk(`${exp.var.var} = ${val}`)):
   isProcExp(exp) && exp.body.length===1 ? bind(mapResult(l2ToPython ,exp.body), (body : string[]) => makeOk(`(lambda ${map(v => v.var, exp.args).join()} : ${body.join(" ")})`)):
   isProcExp(exp) &&exp.body.length>1? bind (mapResult( l2ToPython , exp.body) ,  (body: string[] ) =>  makeOk(`(lambda ${map(v => v.var, exp.args).join()} : {${body.slice(0,body.length -1).join(" ")}; return ${body[body.length -1]}})`)) :
   isIfExp(exp) ? safe3((test : string, then : string, alt: string) => makeOk('(' + then + " if " +test+ " else " +alt +")"))
   (l2ToPython(exp.test), l2ToPython( exp.then), l2ToPython(exp.alt) ) :
   isAppExp(exp) ? AppToPython(exp.rator,exp.rands):
   makeFailure(`exprssion ${exp} not in L2`)


const ProgramToPython = (fExp :string[] , lExp :string) : Result<string> =>
   fExp.length===0 ? makeOk (lExp) :makeOk (`${fExp.join("\n")}\n${lExp}`)

const AppToPython = (rator :Exp , rands :Exp[]) :Result<string> =>  
   isPrimOp(rator)? safe2((r :string,rs:string[])=> PrimToPythonGood(r,rs))(l2ToPython(rator),mapResult(l2ToPython,rands)):
   safe2((r:string,rs:string[])=>ComToPython(r,rs)) (l2ToPython(rator), mapResult(l2ToPython,rands)) ;
   
   
const PrimToPythonGood =(rator :string ,rands:string[]) :Result<string> =>
rator==="not" ? makeOk(`(${rator} ${rands.join()})`) :
( rator ==="boolean?" || rator==="number?" )? PrimToPythonGoodnumOrBol(rator,rands) :
makePrimOk(rator,rands);

const makePrimOk=(ra :string , rands:string[]):Result<string> =>
makeOk(`(${rands.join(` ${ra} `)})`);

const PrimToPythonGoodnumOrBol =(rator :string ,rands:string[]) :Result<string> =>
   makeOk(`(lambda ${ rands[0] } : (type(${rands[0]}) == ${PrimToPython(rator)})`) ;
    
const ComToPython =(r :string ,rs:string[]) :Result<string> => makeOk(`${r}(${rs.join()})`)


const PrimToPython =(p:string):string =>
p === "=" ?"=="   :
p ==="eq" ?"=="   :
p === "or" ? "||" :
p ==="and"?"&&"   :
p;