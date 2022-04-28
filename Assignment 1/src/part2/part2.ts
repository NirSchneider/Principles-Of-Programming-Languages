import * as R from "ramda";

const stringToArray = R.split("");

/* Question 1 */
export const countVowels : (s:string)=> number = (s:string) => 
    R.filter((x:String) => (x ==='a')|| (x === 'e') || (x === 'i') || (x === 'o') || (x === 'u') ||
    (x ==='A')|| (x === 'E') || (x === 'I') || (x === 'O') || (x === 'U') , stringToArray(s)).length;

interface myVar {
    output:string;
    prevCh:string;
    counter :number;
}
/* Question 2 */

export const runLengthEncoding : (str:string)=> string = (str:string) =>{  
    const a = R.reduce((acc:myVar, curr:string) => {
       return (curr !== acc.prevCh && acc.output ==="" ) ?  
            {output: curr ,prevCh:curr ,counter: acc.counter}
        : (curr !== acc.prevCh && acc.output !== "" && acc.counter>1) ?
            {output: acc.output + acc.counter+curr, counter:1 , prevCh:curr}
        : (curr !== acc.prevCh && acc.output !== "" && acc.counter===1) ?
            {output : acc.output + curr , prevCh :curr , counter:1 }
        : {output :acc.output ,prevCh: acc.prevCh ,counter: acc.counter+1} ;
        }
        , {output: "",prevCh: "",counter: 1}
        , stringToArray(str));

        return a.counter===1 ? a.output : a.output+a.counter
  
}

    
/* Question 3 */
export const isPaired :(s:string)=>boolean = (s:string) =>
    isPaired1(s,"");


export const isPaired1 : (s:string, stack:string) => boolean = (s:string, stack:string) =>{
    const open  = "([{";
    const close = ")]}";
    
    const isOpen : (ch:string) => boolean = (ch:string) =>
        open.indexOf(ch) !== -1;
    
    
    const isClose : (ch : string) => boolean = (ch:string) =>
        close.indexOf(ch) !== -1;
    
    const isMatching : (chOpen:string, chClose:string) => boolean = (chOpen:string, chClose:string) => 
        open.indexOf(chOpen) === close.indexOf(chClose) ;
    
    
    const isBalanced : (input:string, stack:string) => boolean = (input:string, stack:string) => 
           R.isEmpty(input) ?
                R.isEmpty(stack)
            : isOpen(input.charAt(0)) ?
                isBalanced(/*allButFirst*/input.slice(1), input.charAt(0) + stack)
            : isClose(input.charAt(0)) ?
                !R.isEmpty(stack) && isMatching(stack.charAt(0), input.charAt(0))
                  && isBalanced(/*allButFirst*/input.slice(1), /*allButFirst*/stack.slice(1))
            : isBalanced(/*allButFirst*/input.slice(1), stack);
    
    
    return R.isEmpty(s) ?
         R.isEmpty(stack)
    : isOpen(/*firstChar*/s.slice(0,1)) ?
        isBalanced(/*allButFirst*/s.slice(1), stack + /*firstChar*/s.slice(0,1))
    : isClose(/*firstChar*/s.slice(0,1)) ?
       !R.isEmpty(stack) && isMatching(/*firstChar*/s.slice(0,1), /*lastChar*/stack)
        && isBalanced(/*allButFirst*/s.slice(1), /*allButLast*/stack.slice(1))
  :
     false;

}



    