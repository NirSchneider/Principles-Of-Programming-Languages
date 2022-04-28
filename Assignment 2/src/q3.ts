import { isCompoundSExp,makeCompoundSExp,makeSymbolSExp,SExpValue } from '../imp/L3-value';
import { Result, makeFailure,makeOk } from "../shared/result";
import { map, reduce } from "ramda";
import {makeIfExp,CExp, makeAppExp, makeVarDecl, isBoolExp, isNumExp, isPrimOp, isIfExp, isAppExp, isProgram, isExp, makeProgram, makeNumExp, makeBoolExp, isCExp, makeDefineExp , Binding,ClassExp,makeLetExp,makeBinding,isAtomicExp, AppExp,isLetExp,IfExp ,makeClassExp ,ProcExp,makeProcExp,isLitExp,makePrimOp,makeLitExp,makeVarRef, Exp,isBinding, Program,isStrExp, isVarRef, isVarDecl, isProcExp, isClassExp, isDefineExp, NumExp } from "./L31-ast";
/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/

export const class2proc = (exp:ClassExp) : ProcExp => 
    makeProcExp(exp.fields,[makeProcExp([makeVarDecl("msg")], makeCExpFromBinding(exp.methods))])

const makeCExpFromBinding =(binding :Binding[]):CExp[] =>{
    const x : IfExp[] = [] ;
    for ( var i : number = binding.length-1 ; i >= 0 ;i-- ) {
        x.unshift(makeIfExp(makeAppExp(makePrimOp("eq?"),[makeVarRef("msg"),makeLitExp(makeSymbolSExp(binding[i].var.var))]),
                                makeAppExp(binding[i].val,[]),
                                (i=== binding.length-1) ? makeBoolExp(false): x[0]
                            )
                );
    }
    return [x[0]];
}

export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>  
    isExp(exp)?makeOk(rewriteAllClass( exp )):
    isProgram(exp)?makeOk(makeProgram(map( rewriteAllClass,exp.exps ) ) ):
    makeFailure("Never");


const rewriteAllClass = (exp:Exp) :Exp => 
isCExp(exp) ? rewriteAllClassCexp(exp) :
isDefineExp(exp) ? makeDefineExp(exp.var,rewriteAllClassCexp(exp.val)) :
exp;

const rewriteAllClassCexp = (e:CExp) : CExp => 
    isAtomicExp(e) ? e :
    isLitExp(e) ? e :
    isVarDecl(e) ? e :
    isBinding(e) ? e:
    isLetExp(e) ? makeLetExp(e.bindings,map(rewriteAllClassCexp,e.body)):
    isAppExp(e) ? makeAppExp(rewriteAllClassCexp(e.rator),map(rewriteAllClassCexp,e.rands)) :
    isIfExp(e) ? makeIfExp(rewriteAllClassCexp(e.test),rewriteAllClassCexp(e.then),rewriteAllClassCexp(e.alt)) :
    isProcExp(e) ? makeProcExp(e.args,map(rewriteAllClassCexp, e.body)) :
    isClassExp(e) ?  rewriteAllClassCexp(class2proc(e)):
    e;
    
    