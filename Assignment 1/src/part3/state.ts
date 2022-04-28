import { F } from "ramda";

export type State<S, A> = (initialState: S) => [S, A];

export const bind = <S, A, B>(state: State<S, A>, f:(x: A) => State<S, B>) : State<S, B> => {
    const func = (init:S) : [S, B] => {
        const [Svalue,Avalue] = state(init);
        const out = f(Avalue) ;
        return out(Svalue);
    }
    return func;
}
