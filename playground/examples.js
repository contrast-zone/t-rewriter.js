examples = {
"test0" :
`
/*
    stress test
*/

(
    RL
    (
        RD
        
        (RL (RD) (WT {goes [name] [[b] [c]]}))
        
        (RL (RD [name]) (WT Milo))
        (RL (RD [name]) (WT Nora))

        (RL (RD [b]) (WT [z z]))
        (RL (RD [[z z] [c]]) (WT [miu [c1]]))
        (RL (RD [c1]) (WT [h mau i]))
        (RL (VR <X> <Y>) (RD [<X> [h <Y> i]]) (WT [<X> <Y>]))
        (RL (RD [miu mau]) (WT meow))

        (RL (RD [b]) (WT [wow 1]))
        (RL (RD [c]) (WT [wow 2]))
        (RL (VR <X> <Y> <Z>) (RD [[wow <X>] [wow <Y>]]) (WT [unb <Z> <Z>]))
        (RL (RD [unb xyz xyz]) (WT bark))
    )
    (
        CN
        
        (RL (VR <X>) (RD {goes <X> meow}) (WT {isA <X> cat}))
        (RL (VR <X>) (RD {goes <X> bark}) (WT {isA <X> dog}))
    )
    (
        WT
        
        (RL (RD Milo) (WT [name]  ))
        (RL (RD Nora) (WT [name]  ))
        (RL (RD cat ) (WT [living]))
        (RL (RD dog ) (WT [living]))
        
        (RL (RD {isA [name] [living]}) (WT))
    )
)
`,
"test0-input" :
`
{goes Nora meow}
`,

"example0":
`
(
    RL
    (
        RD
        (RL (RD) (WT (hearing <voice>)))
        
        (RL (RD <voice>) (WT barks            ))
        (RL (RD <voice>) (WT meows            ))
    )
    (
        CN
        (RL (RD (hearing meows)) (WT (being cat)))
        (RL (RD (hearing barks)) (WT (being dog)))
    )
    (
        WT
        (RL (RD cat           ) (WT <living>))
        (RL (RD dog           ) (WT <living>))
        
        (RL (RD (being <living>)) (WT))
    )
)
`,
"example0-input":
`
(hearing meows)
</script>

<script id="example1-3" type="text/plain">
/*
    simple input/output example
    
     input: \`{hello machine}\`
    output: \`{hello world}\`
*/

(
    CN
    (
        RD
        (WT {hello machine})
    )
    (
        CN
        (RL (RD {hello machine}) (WT {hello world}))
    )
    (
        WT
        (RD {hello world})
    )
)
`,
"example1-3-input":
`
(hello machine)
`,

"example1-1":
`
/*
    hello world example
    
     input: \`{hello machine}\`
    output: \`{hello world}\`
*/

(RL (RD {hello machine}) (WT {hello world}))
`,

"example1-1-input":
`
{hello machine}
`,

"example1-2":
`
/*
    hello entity example
    
     input: \`{greet <Name>}\`
    output: \`{hello <Name>}\`
*/

(RL (VR <Name>) (RD {greet <Name>}) (WT {hello <Name>}))
`,
"example1-2-input":
`
{greet human}
`,

"example-2-1-1":
`
/*
    toy making decision
    
     input: \`{isGood girl/boy}\`
    output: \`{makeToy doll/car}\`
*/

(
    CN
    (RL (RD {isGood girl}) (WT {makeToy doll}))
    (RL (RD {isGood boy} ) (WT {makeToy car} ))
)
`,
"example-2-1-1-input":
`
{isGood girl}
`,

"example-2-1-2":
`
/*
    shadows decision
    
     input: \`(sunIs rising/falling)\`
    output: \`(shadowsDo expand/shrink)\`
*/

(
    CN
    (RL (RD (sunIs rising) ) (WT (itIs morning)  ))
    (RL (RD (sunIs falling)) (WT (itIs afternoon)))

    (RL (RD (itIs morning)  ) (WT (shadowsLean west)))
    (RL (RD (itIs afternoon)) (WT (shadowsLean east)))

    (RL (RD (shadowsLean west)) (WT (shadowsDo shrink)))
    (RL (RD (shadowsLean east)) (WT (shadowsDo expand)))
)
`,
"example-2-1-2-input":
`
(sunIs rising)
`,

"example-2-2-1":
`
/*
    weighting decision
    
     input: \`(orbitsAround <planet> <planet>)\`
    output: \`(weigthtsMoreThan <planet> <planet>)\`
*/

(
    CN
    (
        RL
        (VR <O1> <O2>)
        (RD (orbitsAround <O1> <O2>))
        (WT (weightsMoreThan <O2> <O1>))
    )
)
`,
"example-2-2-1-input":
`
(orbitsAround Earth Sun)
`,

"example-2-2-2":
`
/*
    job title decision
    
     input: \`{isDoing <Name> drivingRocket/healingPeople}\`
    output: \`{isTitled <Name> astronaut/doctor}\`
*/

(
    CN
    (
        RL
        (VR <Name>)
        (RD {isDoing <Name> drivingRocket})
        (WT {isTitled <Name> astronaut})
    )
    (
        RL
        (VR <Name>)
        (RD {isDoing <Name> healingPeople})
        (WT {isTitled <Name> doctor})
    )
)
`,
"example-2-2-2-input":
`
{isDoing Jane drivingRocket}
`,

"example-3-2-1":
`
/*
    weighting decision
    
     input: \`{orbitsAround sun/earth/moon sun/earth/moon}\`
    output: \`{weigthtsMoreThan sun/earth/moon sun/earth/moon}\`
*/

(
    RL
    (
        RD
        
        (RL (RD) (WT {orbitsAround [object] [object]}))
        
        (RL (RD [object]) (WT sun  ))
        (RL (RD [object]) (WT earth))
        (RL (RD [object]) (WT moon ))
    )
    (
        CN
        (
            RL
            (VR <O1> <O2>)
            (RD {orbitsAround <O1> <O2>})
            (WT {attractsMoreThan <O2> <O1>})
        )
        (
            RL
            (VR <O1> <O2>)
            (RD {attractsMoreThan <O1> <O2>})
            (WT {weightsMoreThan <O1> <O2>})
        )
    )
    (
        WT
        
        (RL (RD sun  ) (WT [object]))
        (RL (RD earth) (WT [object]))
        (RL (RD moon ) (WT [object]))
        
        (RL (RD {weightsMoreThan [object] [object]}) (WT))
    )
)
`,
"example-3-2-1-input":
`
{orbitsAround earth sun}
`,

"example-3-2-3":
`
/*
    world spinning decision
    
     input: \`{peopleAre happy/sad}\`
    output: \`{stillTurns world}\`
*/

(
    RL
    (
        RD
        
        (RL (RD) (WT {peopleAre [mood]}))
        
        (RL (RD [mood]) (WT happy))
        (RL (RD [mood]) (WT sad  ))
    )
    (
        WT
        
        (RL (RD world) (WT [object]))
        
        (RL (RD {stillTurns [object]}) (WT))
    )
)
`,
"example-3-2-3-input":
`
{peopleAre happy}
`,

"example-branch":
`
/*
    branching choice
    
     input: \`{if <condition> then <whentrue> else <whenfalse>}\`
    output: \`<whentrue>/<whenfalse>\`
*/

(
    RL
    (
        RD
        
        (RL (VR <X> <Y>) (RD) (WT {if [bool] then <X> else <Y>}))
        
        (RL (RD [bool]) (WT true))
        (RL (RD [bool]) (WT false))
    )
    (
        CN
        
        (RL (VR <X> <Y>) (RD {if true then <X> else <Y>}) (WT <X>))
            
        (RL (VR <X> <Y>) (RD {if false then <X> else <Y>}) (WT <Y>))
    )
    (
        WT
        (RL (VR <Output>) (RD <Output>) (WT))
    )
)
`,
"example-branch-input":
`
{if true then "Yes, it's true." else "No, it's false."}
`,

"example-bool":
`
/*
    Boolean evaluator
    
     input: Boolean expression
    output: Boolean constant
*/

(
    RL
    (
        RD
        
        (RL (RD) (WT [bool]))
        
        (RL (RD [bool]) (WT {not [bool]}        ))
        (RL (RD [bool]) (WT {and [bool] [bool]} ))
        (RL (RD [bool]) (WT {or [bool] [bool]}  ))
        (RL (RD [bool]) (WT {impl [bool] [bool]}))
        (RL (RD [bool]) (WT {eq [bool] [bool]}  ))
        (RL (RD [bool]) (WT [const]             ))
        
        (RL (RD [const]) (WT true ))
        (RL (RD [const]) (WT false))
    )
    (
        CN
        
        // truth table for \`not\` operator
        (RL (RD {not true }) (WT false))
        (RL (RD {not false}) (WT true ))
        
        // truth table for \`and\` operator
        (RL (RD {and true  true }) (WT true ))
        (RL (RD {and true  false}) (WT false))
        (RL (RD {and false true }) (WT false))
        (RL (RD {and false false}) (WT false))
        
        // truth table for \`or\` operator
        (RL (RD {or true  true }) (WT true ))
        (RL (RD {or true  false}) (WT true ))
        (RL (RD {or false true }) (WT true ))
        (RL (RD {or false false}) (WT false))
        
        // truth table for \`impl\` operator
        (RL (RD {impl true  true }) (WT true ))
        (RL (RD {impl true  false}) (WT false))
        (RL (RD {impl false true }) (WT true ))
        (RL (RD {impl false false}) (WT true ))
        
        // truth table for \`eq\` operator
        (RL (RD {eq true  true }) (WT true ))
        (RL (RD {eq true  false}) (WT false))
        (RL (RD {eq false true }) (WT false))
        (RL (RD {eq false false}) (WT true ))
    )
    (
        WT
        
        (RL (RD true ) (WT))
        (RL (RD false) (WT))
    )
)
`,
"example-bool-input":
`
{
    eq
    {and true false}
    {not {or {not true} {not false}}}
}
`,

"example-binadd":
`
/*
    binary number addition
*/

(
    RL
    (
        RD
        
        (RL (RD) (WT {add [num] [num]}))
        
        (RL (RD [num]  ) (WT [digit]        ))
        (RL (RD [num]  ) (WT {[num] [digit]}))
        (RL (RD [digit]) (WT 0              ))
        (RL (RD [digit]) (WT 1              ))
    )
    (
        CN
        
        // entry point
        (RL (VR <A> <B>) (RD {add <A> <B>}) (WT [add <A> <B>]))

        // both numbers single digits
        (RL              (RD [add       0       0]) (WT                         0))
        (RL              (RD [add       0       1]) (WT                         1))
        (RL              (RD [add       1       0]) (WT                         1))
        (RL              (RD [add       1       1]) (WT {                    1 0}))
        
        // first number multiple digits, second number single digit
        (RL (VR <A>    ) (RD [add {<A> 0}       0]) (WT {                  <A> 0}))
        (RL (VR <A>    ) (RD [add {<A> 0}       1]) (WT {                  <A> 1}))
        (RL (VR <A>    ) (RD [add {<A> 1}       0]) (WT {                  <A> 1}))
        (RL (VR <A>    ) (RD [add {<A> 1}       1]) (WT {          [add 1 <A>] 0}))
        
        // first number single digit, second number multiple digits
        (RL (VR <B>    ) (RD [add       0 {<B> 0}]) (WT {                  <B> 0}))
        (RL (VR <B>    ) (RD [add       0 {<B> 1}]) (WT {                  <B> 1}))
        (RL (VR <B>    ) (RD [add       1 {<B> 0}]) (WT {                  <B> 1}))
        (RL (VR <B>    ) (RD [add       1 {<B> 1}]) (WT {          [add 1 <B>] 0}))
        
        // both numbers multiple digits
        (RL (VR <A> <B>) (RD [add {<A> 0} {<B> 0}]) (WT {        [add <A> <B>] 0}))
        (RL (VR <A> <B>) (RD [add {<A> 0} {<B> 1}]) (WT {        [add <A> <B>] 1}))
        (RL (VR <A> <B>) (RD [add {<A> 1} {<B> 0}]) (WT {        [add <A> <B>] 1}))
        (RL (VR <A> <B>) (RD [add {<A> 1} {<B> 1}]) (WT {[add 1 [add <A> <B>]] 0}))
    )
    (
        WT

        (RL (RD 0              ) (WT [digit]))
        (RL (RD 1              ) (WT [digit]))
        (RL (RD [digit]        ) (WT [num]  ))
        (RL (RD {[num] [digit]}) (WT [num]  ))

        (RL (RD [num]) (WT))
    )
)
`,
"example-binadd-input":
`
{
    add
    {{{1 1} 0} 0}
    {{{0 1} 0} 1}
}
`,

"example-bincompare":
`
/*
    binary number comparison
*/

(
    RL
    (
        RD
        
        (RL (RD) (WT {leq [num] [num]}))
        
        (RL (RD [num]  ) (WT [digit]        ))
        (RL (RD [num]  ) (WT {[num] [digit]}))
        (RL (RD [digit]) (WT 0              ))
        (RL (RD [digit]) (WT 1              ))
    )
    (
        CN

        // leq predicate
        (RL (VR <X> <Y>) (RD {leq <X> <Y>}) (WT [leqUtil [cmp <X> <Y>]]))
        (RL (RD [leqUtil gt]) (WT false))
        (RL (RD [leqUtil eq]) (WT true))
        (RL (RD [leqUtil lt]) (WT true))
        
        // both numbers single digits
                             (RL (RD [cmp       0       0]) (WT                 eq))
                             (RL (RD [cmp       0       1]) (WT                 lt))
                             (RL (RD [cmp       1       0]) (WT                 gt))
                             (RL (RD [cmp       1       1]) (WT                 eq))
        
        // first number multiple digits, second number single digit
        (RL (VR <A>    ) (RD [cmp {<A> 0}       0]) (WT [[cmp <A>   0] eq]))
        (RL (VR <A>    ) (RD [cmp {<A> 0}       1]) (WT [[cmp <A>   0] lt]))
        (RL (VR <A>    ) (RD [cmp {<A> 1}       0]) (WT [[cmp <A>   0] gt]))
        (RL (VR <A>    ) (RD [cmp {<A> 1}       1]) (WT [[cmp <A>   0] eq]))
        
        // first number single digit, second number multiple digits
        (RL (VR <B>    ) (RD [cmp       0 {<B> 0}]) (WT [[cmp   0 <B>] eq]))
        (RL (VR <B>    ) (RD [cmp       0 {<B> 1}]) (WT [[cmp   0 <B>] lt]))
        (RL (VR <B>    ) (RD [cmp       1 {<B> 0}]) (WT [[cmp   0 <B>] gt]))
        (RL (VR <B>    ) (RD [cmp       1 {<B> 1}]) (WT [[cmp   0 <B>] eq]))
        
        // both numbers multiple digits
        (RL (VR <A> <B>) (RD [cmp {<A> 0} {<B> 0}]) (WT [[cmp <A> <B>] eq]))
        (RL (VR <A> <B>) (RD [cmp {<A> 0} {<B> 1}]) (WT [[cmp <A> <B>] lt]))
        (RL (VR <A> <B>) (RD [cmp {<A> 1} {<B> 0}]) (WT [[cmp <A> <B>] gt]))
        (RL (VR <A> <B>) (RD [cmp {<A> 1} {<B> 1}]) (WT [[cmp <A> <B>] eq]))
        
        // reduce to final value
        (RL (VR <N>) (RD [gt <N>]) (WT gt ))
        (RL (VR <N>) (RD [lt <N>]) (WT lt ))
        (RL (VR <N>) (RD [eq <N>]) (WT <N>))
    )
    (
        WT
        
        (RL (RD true ) (WT))
        (RL (RD false) (WT))
    )
)
`,
"example-bincompare-input":
`
{
    leq
    {{{0 1} 0} 1}
    {{{1 1} 0} 1}
}
`,

"example-lmbdcalc":
`
/*
    untyped lambda calculus example
    
     input: lambda expression
    output: evaluated expression
*/
`,
"example-lmbdcalc-input":
`
(((lmbd x) (lmbd y) (y x)) p q)
`,

"example-lmbdcalc1":
`
/*
    untyped lambda calculus example
    
     input: lambda expression
    output: evaluated expression
*/

(
    MATCH
    (VR <X> <M> <N>)
    (
        RL
        (
            RD
            (RL (RD) (WT ((lmbd <X>) <M>) <N>))
        )
        (
            WT
            (RL (RD <N>) (WT <X>))
            (RL (RD <M>) (WT))
        )
    )
)
`,

"example-lmbdcalc2":
`
/*
    untyped lambda calculus example
    
     input: lambda expression
    output: evaluated expression
*/

(
    CN
    
    // intermediate expression
    (
        MATCH
        (VR <X> <Y> <M>)
        (
            RL
            (
                RD
                ((lmbd <X>) <M>)
            )
            (
                WT
                (<intrmd> <X> <Y> <M>)
            )
        )
    )

    // alpha conversion
    (
        MATCH
        (VR <X> <Y> <M>)
        (
            RL
            (
                RD
                (<intrmd> <X> <Y> <M>)
                <X>
            )
            (
                WT
                <Y>
            )
        )
    )
    
    // beta reduction
    (
        MATCH
        (VR <X> <Y> <M> <N>)
        (
            RL
            (
                RD
                ((<intrmd> <X> <Y> <M>) <N>)
            )
            (
                WT
                <M>
            )
        )
    )
    (
        MATCH
        (VR <X> <Y> <M> <N>)
        (
            RL
            (
                RD
                ((<intrmd> <X> <Y> <M>) <N>)
                <Y>
            )
            (
                WT
                <N>
            )
        )
    )
)
`,

"example-lmbdcalc1-input":
`
((((lmbd <a>) ((lmbd <b>) (<b> <a>))) x) y)
`,

"example-ski":
`
/*
    SKI calculus example
    
     input: SKI expression
    output: evaluated expression
*/

(
    CN
    
    // combinators definition
    (
        MATCH
        (VR <A>)
        (RL (RD I) (WT (impl <A> <A>)))
    )
    (
        MATCH
        (VR <A> <B>)
        (RL (RD K) (WT (impl <A> (impl <B> <A>))))
    )
    (
        MATCH
        (VR <A> <B> <C>)
        (RL (RD S) (WT (impl (impl <A> (impl <B> <C>)) (impl (impl <A> <B>) (impl <A> <C>)))))
    )
    
    // combinators application
    (
        MATCH
        (VR <A> <B>)
        (RL (RD ((impl <A> <B>) <A>)) (WT <B>))
    )
)
`,
"example-ski-input":
`
(S (K (S I)) (S (K K) I) x y)
`,

"example-poslog":
`
/*
    to do: positive logic example
    
     input: rules and expression
    output: evaluated expression
*/
`,
"example-poslog-input":
`
(
    POSLOG
    (
        RULES
        (impl (add x 0) x)
        (impl (add x (succ y)) (succ (add x y)))
        (impl (mul x 0) 0)
        (impl (mul x (succ y)) (add x (mul x y)))
    )
    (
        EXPR
        (mul (succ (succ 0)) (succ (succ (succ 0))))
    )
)
`,

"example-loglmbdcalc":
`
/*
    to do: positive logic typed lambda calculus example
    
     input: typed lambda expression
    output: evaluated expression
*/
`,
"example-loglmbdcalc-input":
`
(
    (
        (lmbd x a)
        (lmbd y (impl a b))
        (y x)
    )
    p
    (
        (lmbd x a)
        x
    )
)
`,

"example-proofcheck":
`
/*
    propositional logic proof checker
*/

(
    CN
    
    /*
        proving system
    */

    (MATCH (VR <A>) (RL (RD {Assume <A>}) (WT <A>)))
    
    (MATCH (VR <A> <B>) (RL (RD {andIntro  <A> <B>                                       }) (WT {and <A> <B>} )))
    (MATCH (VR <A> <B>) (RL (RD {andElim1  {and <A> <B>}                                 }) (WT <A>           )))
    (MATCH (VR <A> <B>) (RL (RD {andElim2  {and <A> <B>}                                 }) (WT <B>           )))
    (MATCH (VR <A> <B>) (RL (RD {orIntro1  <A>                                           }) (WT {or <A> <B>}  )))
    (MATCH (VR <A> <B>) (RL (RD {orIntro2  <B>                                           }) (WT {or <A> <B>}  )))
    (MATCH (VR <A> <B>) (RL (RD {orElim    {or <A> <B>} {flws <A> False} {flws <B> False}}) (WT False         )))
    (MATCH (VR <A> <B>) (RL (RD {implIntro {flws <A> <B>}                                }) (WT {impl <A> <B>})))
    (MATCH (VR <A> <B>) (RL (RD {implElim  {impl <A> <B>} <A>                            }) (WT <B>           )))
    (MATCH (VR <A> <B>) (RL (RD {eqIntro   {impl <A> <B>} {impl <B> <A>}                 }) (WT {eq <A> <B>}  )))
    (MATCH (VR <A> <B>) (RL (RD {eqElim1   {eq <A> <B>} <A>                              }) (WT <B>           )))
    (MATCH (VR <A> <B>) (RL (RD {eqElim2   {eq <A> <B>} <B>                              }) (WT <A>           )))
    (MATCH (VR <A>    ) (RL (RD {notIntro  {flws <A> False}                              }) (WT {not <A>}     )))
    (MATCH (VR <A>    ) (RL (RD {notElim   {not <A>} <A>                                 }) (WT False         )))
    (MATCH (VR <A>    ) (RL (RD {X         False                                         }) (WT <A>           )))
    (MATCH (VR <A>    ) (RL (RD {IP        {flws {not <A>} False}                        }) (WT <A>           )))
)
`,

"example-proofcheck-input":
`
/*
    De Morgan's law proof check
*/

{
    // {eq {and A B} {not {or {not A} {not B}}}}
    eqIntro
    {
        // {impl {and A B} {not {or {not A} {not B}}}}
        implIntro
        {
            flws
            {
                Assume
                {and A B}
            }
            {
                // {not {or {not A} {not B}}}
                notIntro
                {
                    flws
                    {
                        Assume
                        {or {not A} {not B}}
                    }
                    {
                        // False
                        orElim
                        {
                            Assume
                            {or {not A} {not B}}
                        }
                        {
                            flws
                            {
                                Assume
                                {not A}
                            }
                            {
                                // False
                                notElim
                                {
                                    Assume
                                    {not A}
                                }
                                {
                                    // A
                                    andElim1
                                    {
                                        Assume
                                        {and A B}
                                    }
                                }
                            }
                        }
                        {
                            flws
                            {
                                Assume
                                {not B}
                            }
                            {
                                // False
                                notElim
                                {
                                    Assume
                                    {not B}
                                }
                                {
                                    // B
                                    andElim2
                                    {
                                        Assume
                                        {and A B}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    {
        // {impl {not {or {not A} {not B}}} {and A B}}
        implIntro
        {
            flws
            {
                Assume
                {not {or {not A} {not B}}}
            }
            {
                // {and A B}
                andIntro
                {
                    // A
                    IP
                    {
                        flws
                        {
                            Assume
                            {not A}
                        }
                        {
                            // False
                            notElim
                            {
                                Assume
                                {not {or {not A} {not B}}}
                            }
                            {
                                // {or {not A} UNDEFINED}
                                orIntro1
                                {
                                    Assume
                                    {not A}
                                }
                            }
                        }
                    }
                }
                {
                    // B
                    IP
                    {
                        flws
                        {
                            Assume
                            {not B}
                        }
                        {
                            // False
                            notElim
                            {
                                Assume
                                {not {or {not A} {not B}}}
                            }
                            {
                                // {or UNDEFINED {not B}}
                                orIntro2
                                {
                                    Assume
                                    {not B}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`,

"example-proofcheck1":
`
/*
    propositional logic proof checker
*/

(
    CN
    
    /*
        proving system
    */

    (MATCH (VR a) (RL (RD ([Assume] a)) (WT a)))
    
    (MATCH (VR a b) (RL (RD ([andIntro]  a b                                   )) (WT (and a b) )))
    (MATCH (VR a b) (RL (RD ([andElim1]  (and a b)                             )) (WT a         )))
    (MATCH (VR a b) (RL (RD ([andElim2]  (and a b)                             )) (WT b         )))
    (MATCH (VR a b) (RL (RD ([orIntro1]  a                                     )) (WT (or a b)  )))
    (MATCH (VR a b) (RL (RD ([orIntro2]  b                                     )) (WT (or a b)  )))
    (MATCH (VR a b) (RL (RD ([orElim]    (or a b) (flws a False) (flws b False))) (WT False     )))
    (MATCH (VR a b) (RL (RD ([implIntro] (flws a b)                            )) (WT (impl a b))))
    (MATCH (VR a b) (RL (RD ([implElim]  (impl a b) a                          )) (WT b         )))
    (MATCH (VR a b) (RL (RD ([eqIntro]   (impl a b) (impl b a)                 )) (WT (eq a b)  )))
    (MATCH (VR a b) (RL (RD ([eqElim1]   (eq a b) a                            )) (WT b         )))
    (MATCH (VR a b) (RL (RD ([eqElim2]   (eq a b) b                            )) (WT a         )))
    (MATCH (VR a  ) (RL (RD ([notIntro]  (flws a False)                        )) (WT (not a)   )))
    (MATCH (VR a  ) (RL (RD ([notElim]   (not a) a                             )) (WT False     )))
    (MATCH (VR a  ) (RL (RD ([X]         False                                 )) (WT a         )))
    (MATCH (VR a  ) (RL (RD ([IP]        (flws (not a) False)                  )) (WT a         )))

    // (A /\\ B) -> ~(~ A \\/ ~ B)
    (RL (RD f1      ) (WT ([Assume] (and A B)                   )))
    (RL (RD   f2    ) (WT ([Assume] (or (not A) (not B))        )))
    (RL (RD     f3  ) (WT ([Assume] (not A)                     )))
    (RL (RD       f4) (WT ([andElim1] f1                        ))) // A
    (RL (RD       f5) (WT ([notElim] f3 f4                      ))) // False
    (RL (RD     f6  ) (WT ([Assume] (not B)                     )))
    (RL (RD       f7) (WT ([andElim2] f1                        ))) // B
    (RL (RD       f8) (WT ([notElim] f6 f7                      ))) // False
    (RL (RD     f9  ) (WT ([orElim] f2 (flws f3 f5) (flws f6 f8)))) // False
    (RL (RD   f10   ) (WT ([notIntro] (flws f2 f9)              ))) // ~ ((~ A) \\/ (~ B))
    (RL (RD th1     ) (WT ([implIntro] (flws f1 f10)            ))) // (A /\\ B) -> (~ ((~ A) \\/ (~ B)))
    
    // ~(~A \\/ ~B) -> (A /\\ B)
    (RL (RD f11     ) (WT ([Assume] (not (or (not A) (not B)))  )))
    (RL (RD   f12   ) (WT ([Assume] (not A)                     )))
    (RL (RD     f13 ) (WT ([orIntro1] f12                       ))) // (~ A) \\/ UNDEFINED
    (RL (RD     f14 ) (WT ([notElim] f11 f13                    ))) // False
    (RL (RD   f15   ) (WT ([IP] (flws f12 f14)                  ))) // A
    (RL (RD   f16   ) (WT ([Assume] (not B)                     )))
    (RL (RD     f17 ) (WT ([orIntro2] f16                       ))) // UNDEFINED \\/ (~ B)
    (RL (RD     f18 ) (WT ([notElim] f11 f17                    ))) // False
    (RL (RD   f19   ) (WT ([IP] (flws f16 f18)                  ))) // B
    (RL (RD   f20   ) (WT ([andIntro] f15 f19                   ))) // A /\\ B
    (RL (RD th2     ) (WT ([implIntro] (flws f11 f20)           ))) //(~ ((~ A) \\/ (~ B))) -> (A /\\ B)
    
    // (A /\\ B) <-> ~(~A \\/ ~B)
    (RL (RD (CHECK DeMorgan)) (WT ([eqIntro] th1 th2))) // (A /\\ B) <-> (~ ((~ A) \\/ (~ B)))
)
`,

"example-proofcheck1-input":
`
(CHECK DeMorgan)
`,

"example-clslog":
`
/*
    propositional logic theorem validity checker
*/

(
    RL
    (
        RD

        /*
            axioms
        */        

        (
            MATCH
            (VR <P> <Q>)
            (RL (RD) (WT (impl <P> (impl <Q> <P>))))
        )
        (
            MATCH
            (VR <P> <Q> <R>)
            (RL (RD) (WT (impl (impl <P> (impl <Q> <R>)) (impl (impl <P> <Q>) (impl <P> <R>)))))
        )
        (
            MATCH
            (VR <P> <Q>)
            (RL (RD) (WT (impl (impl (not <P>) (not <Q>)) (impl <Q> <P>))))
        )

        /*
            modus ponens
        */

        (
            MATCH
            (VR <A> <B>)
            (RL (RD (impl <A> <B>) <A>) (WT <B>))
        )
        
        /*
            [and intro]
        */

        (
            MATCH
            (VR <A> <B>)
            (RL (RD <A> <B>) (WT (and <A> <B>)))
        )
        
        /*
            [or intro]
        */

        (
            MATCH
            (VR <A> <B>)
            (RL (RD <A>) (WT (or <A> <B>)))
        )
        (
            MATCH
            (VR <A> <B>)
            (RL (RD <B>) (WT (or <A> <B>)))
        )
        
        /*
            [eq intro]
        */

        (
            MATCH
            (VR <A> <B>)
            (RL (RD (and (impl <A> <B>) (impl <B> <A>))) (WT (eq <A> <B>)))
        )
    )
    (
        WT
        (RL (RD "valid") (WT))
    )
)
`,
"example-clslog-input":
`
/*
    De Morgan's law
*/

(eq (and A B) (not (or (not A) (not B))))
`,

"example-clslog1":
`
/*
    classical logic example
*/

(
    RL
    (
        RD
        
        /*
            [not intro]
             A |- false
            ------------
                ~ A
        */
        (
            MATCH
            (VR <A>)
            (RL (RD) (WT (not <A>) <A>))
        )
        (
            MATCH
            (VR <A>)
            (RL (RD false) (WT (not <A>)))
        )
        
        /*
            [and intro]
               A, B
            ----------
              A /\ B
        */
        (
            MATCH
            (VR <A> <B>)
            (RL (RD <A> <B>) (WT (and <A> <B>)))
        )
        
        /*
            [or intro]
                A       B
            -------- --------
             A \/ B   A \/ B
        */
        (
            MATCH
            (VR <A> <B>)
            (RL (RD <A>) (WT (or <A> <B>)))
        )
        (
            MATCH
            (VR <A> <B>)
            (RL (RD <B>) (WT (or <A> <B>)))
        )
        
        /*
            [impl intro]
             A |- B
            --------
             A -> B
        */
        (
            MATCH
            (VR <A> <B>)
            (RL (RD) (WT (impl <A> <B>) <A>))
        )
        (
            MATCH
            (VR <A> <B>)
            (RL (RD <B>) (WT (impl <A> <B>)))
        )
        
        /*
            [eq intro]
             A -> B /\ B -> A
            ------------------
                 A <-> B
        */
        (
            MATCH
            (VR <A> <B>)
            (RL (RD (and (impl <A> <B>) (impl <B> <A>))) (WT (eq <A> <B>)))
        )
    )
    (
        CN
    )
    (
        WT
        
        /*
            [exist quant elim]
              ((exists X) A)
            -------------------
             ~((forall X) ~ A)
        */
        (
            MATCH
            (VR <X> <Y> <A>)
            (RL (RD ((exists <X>) <A>)) (WT (not ((forall <X>) (not <A>)))))
        )
        
        /*
            [univ quant elim]
              ((forall X) A)
            ------------------
             Y -> (A [X := Y])
        */
        (
            MATCH
            (VR <X> <Y> <A>)
            (RL (RD ((forall <X>) <A>)) (WT (impl <X> (subst <A> <X> <Y>))))
        )
        
        /*
            [eq elim]
                 A <-> B
            ------------------
             A -> B /\ B -> A
        */
        (
            MATCH
            (VR <A> <B>)
            (RL (RD (eq <A> <B>)) (WT (and (impl <A> <B>) (impl <B> <A>))))
        )
        
        /*
            [impl elim]
             A -> B
            --------
             A |- B 
        */
        (
            MATCH
            (VR <A> <B>)
            (RL (RD (impl <A> <B>) <A>) (WT  <B>))
        )
        
        /*
            [and elim]
             A /\ B   A /\ B
            -------- --------
                A       B
        */
        (
            MATCH
            (VR <A> <B>)
            (RL (RD (and <A> <B>)) (WT <A>))
        )
        (
            MATCH
            (VR <A> <B>)
            (RL (RD (and <A> <B>)) (WT <B>))
        )
        
        /*
            [or elim]
              A \/ B
            ----------
               A, B
        */
        (
            MATCH
            (VR <A> <B>)
            (RL (RD (or <A> <B>)) (WT <A> <B>))
        )
        
        /*
            [not elim]
                ~ A
            ------------
             A |- false
        */
        (
            MATCH
            (VR <A>)
            (RL (RD (not <A>) <A>) (WT false))
        )
    )
)
`,
"example-clslog-input1":
`
/*
    De Morgan's law
*/

(eq (and A B) (not (or (not A) (not B))))
`,
"example-thm":
`
/*
    propositional logic theorem validator (work in progress)
    
     input: theorem
    output: \`true\` if the theorem is valid
*/

(
    RL
    (
        RD
        
        (RL (RD) (WT [bool]))
        
        (RL (RD [bool]) (WT {not [bool]}        ))
        (RL (RD [bool]) (WT {and [bool] [bool]} ))
        (RL (RD [bool]) (WT {or [bool] [bool]}  ))
        (RL (RD [bool]) (WT {impl [bool] [bool]}))
        (RL (RD [bool]) (WT {eq [bool] [bool]}  ))
        (RL (RD [bool]) (WT <ATOMIC>            ))
    )
    (
        CN
        
        // converting to negation and disjunction
        (MATCH (VR <A> <B>) (RL (RD {and <A> <B>} ) (WT {not {or {not <A>} {not <B>}}}     )))
        (MATCH (VR <A> <B>) (RL (RD {impl <A> <B>}) (WT {or {not <A>} <B>}                 )))
        (MATCH (VR <A> <B>) (RL (RD {eq <A> <B>}  ) (WT {and {impl <A> <B>} {impl <B> <A>}})))
        
        // truth table
        (RL (RD {not true} ) (WT false))
        (RL (RD {not false}) (WT true ))
        (MATCH (VR <A>) (RL (RD {or true <A>} ) (WT true)))
        (MATCH (VR <A>) (RL (RD {or false <A>}) (WT <A> )))
        
        // reduction algebra
        (MATCH (VR <A>) (RL (RD {not {not <A>}}) (WT <A>)))
        (MATCH (VR <A>) (RL (RD {or <A> <A>}   ) (WT <A>)))
        
        // law of excluded middle
        (MATCH (VR <A>) (RL (RD {or <A> {not <A>}}) (WT true)))
        
        // modus ponens
        (MATCH (VR <A> <B>) (RL (RD {not {or {not <A>} {not {or {not <A>} <B>}}}}) (WT <B>)))
        
        // resolution rule
        (MATCH (VR <A> <B> <C>) (RL (RD {not {or {not {or <A> <B>}} {not {or {not <A>} <C>}}}}) (WT {or <B> <C>})))
        
        // distributivity and commutativity laws
        (MATCH (VR <A> <B> <C>) (RL (RD {or <A> {or <B> <C>}}) (WT {or {or <A> <B>} <C>})))
        (MATCH (VR <A> <B>    ) (RL (RD {or <A> <B>}         ) (WT {or <B> <A>}         )))
    )
    (
        WT
        (RL (RD true) (WT))
    )
)
`,
"example-thm-input":
`
/*
    De Morgan's law
*/

{
    eq
    {
        and
        A
        B
    }
    {
        not
        {
            or
            {
                not
                A
            }
            {
                not
                B
            }
        }
    }
}
`,
"example-proofana":
`
/*
    propositional logic proof analysis
*/

(
    RL
    (
        RD
        
        (RL (RD) (WT [step]))
        
        (RL (RD [step]) (WT {AND-INTRO [step]}  ))
        (RL (RD [step]) (WT {IMPL-INTROL [step]}))
        (RL (RD [step]) (WT {IMPL-INTROR [step]}))
        (RL (RD [step]) (WT {EQ-INTRO [step]}   ))
        (RL (RD [step]) (WT {NEG-EVALT [step]}  ))
        (RL (RD [step]) (WT {NEG-EVALF [step]}  ))
        (RL (RD [step]) (WT {DBLNEG [step]}     ))
        (RL (RD [step]) (WT {OR-EVAL1L [step]}  ))
        (RL (RD [step]) (WT {OR-EVAL1R [step]}  ))
        (RL (RD [step]) (WT {OR-EVAL2L [step]}  ))
        (RL (RD [step]) (WT {OR-EVAL2R [step]}  ))
        (RL (RD [step]) (WT {EXMIDL [step]}     ))
        (RL (RD [step]) (WT {EXMIDR [step]}     ))
        (RL (RD [step]) (WT {OR-INTRO [step]}   ))
        (RL (RD [step]) (WT <ANY>               ))
    )
    (
        CN
        
        // mappings to negation and disjunction
        
        (MATCH (VR <A> <B>) (RL (RD {AND-INTRO {not {or {not <A>} {not <B>}}}}    ) (WT {and <A> <B>} )))
        (MATCH (VR <A> <B>) (RL (RD {IMPL-INTROR {or {not <A>} <B>}}              ) (WT {impl <A> <B>})))
        (MATCH (VR <A> <B>) (RL (RD {IMPL-INTROL {or <B> {not <A>}}}              ) (WT {impl <A> <B>})))
        (MATCH (VR <A> <B>) (RL (RD {EQ-INTRO {and {impl <A> <B>} {impl <B> <A>}}}) (WT {eq <A> <B>}  )))
        
        // reduction main algebra
        
        (RL (WT {not true} ) (RD {NEG-EVALF false}))
        (RL (WT {not false}) (RD {NEG-EVALT true}))
        
        (MATCH (VR <A>) (RL (RD {DBLNEG <A>}) (WT {not {not <A>}})))
        
        (MATCH (VR <A>) (RL (RD {OR-EVAL1L true}) (WT {or true <A>})))
        (MATCH (VR <A>) (RL (RD {OR-EVAL1R true}) (WT {or <A> true})))
        
        (MATCH (VR <A>) (RL (RD {OR-EVAL2L <A>}) (WT {or <A> false})))
        (MATCH (VR <A>) (RL (RD {OR-EVAL2R <A>}) (WT {or false <A>})))
        
        (MATCH (VR <A>) (RL (RD {EXMIDL true}) (WT {or <A> {not <A>}})))
        (MATCH (VR <A>) (RL (RD {EXMIDR true}) (WT {or {not <A>} <A>})))
        
        (MATCH (VR <A>) (RL (RD {OR-INTRO <A>}) (WT {or <A> <A>})))
        
        // distributivity and commutativity laws
        
        (MATCH (VR <A> <B> <C>) (RL (RD {or {or <A> <B>} <C>}) (WT {or <A> {or <B> <C>}})))
        (MATCH (VR <A> <B>    ) (RL (RD {or <B> <A>}         ) (WT {or <A> <B>}         )))
    )
    (
        WT
        
        (RL (RD {not [bool]}        ) (WT [bool]))
        (RL (RD {and [bool] [bool]} ) (WT [bool]))
        (RL (RD {or [bool] [bool]}  ) (WT [bool]))
        (RL (RD {impl [bool] [bool]}) (WT [bool]))
        (RL (RD {eq [bool] [bool]}  ) (WT [bool]))
        (RL (RD <ATOMIC>            ) (WT [bool]))
        
        (RL (RD [bool]) (WT))
    )
)
`,
"example-proofana-input":
`
/*
    De Morgan's law proof
*/

{
    EQ-INTRO
    {
        AND-INTRO
        {
            not
            {
                or
                {
                    not
                    {
                        IMPL-INTROL
                        {
                            or
                            {
                                DBLNEG
                                {
                                    or
                                    {
                                        not
                                        B
                                    }
                                    {
                                        not
                                        A
                                    }
                                }
                            }
                            {
                                AND-INTRO
                                {
                                    not
                                    {
                                        or
                                        {
                                            not
                                            B
                                        }
                                        {
                                            not
                                            A
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                {
                    not
                    {
                        IMPL-INTROL
                        {
                            or
                            {
                                not
                                {
                                    or
                                    {
                                        not
                                        B
                                    }
                                    {
                                        not
                                        A
                                    }
                                }
                            }
                            {
                                not
                                {
                                    AND-INTRO
                                    {
                                        not
                                        {
                                            or
                                            {
                                                not
                                                B
                                            }
                                            {
                                                not
                                                A
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
`
,
"example-thm2":
`
/*
    propositional logic theorem validator
*/

(
    RL
    (
        RD
        
        (RL (RD) (WT [bool]))
        
        (RL (RD [bool]) (WT {not [bool]}        ))
        (RL (RD [bool]) (WT {and [bool] [bool]} ))
        (RL (RD [bool]) (WT {or [bool] [bool]}  ))
        (RL (RD [bool]) (WT {impl [bool] [bool]}))
        (RL (RD [bool]) (WT {eq [bool] [bool]}  ))
        (RL (RD [bool]) (WT <ATOMIC>            ))
    )
    (
        CN
        
        // converting to implicational logic
        (MATCH (VR <A>    ) (RL (RD {not <A>}    ) (WT {impl <A> false}                        )))
        (MATCH (VR <A> <B>) (RL (RD {or <A> <B>} ) (WT {impl {impl <A> <B>} <B>}               )))
        (MATCH (VR <A> <B>) (RL (RD {and <A> <B>}) (WT {impl {impl <A> {impl <B> false}} false})))
        (MATCH (VR <A> <B>) (RL (RD {eq <A> <B>} ) (WT {and {impl <A> <B>} {impl <B> <A>}}     )))
        /*
        // three stooges
        (MATCH (VR <P> <Q> <R> <S>) (RL (RD {impl {impl {impl <P> <Q>} <R>} {impl {impl <R> <P>} {impl <S> <P>}}}) (WT true)))
        (MATCH (VR <P> <Q> <R> <S>) (RL (RD {impl {impl <R> <P>} {impl <S> <P>}}) (WT {impl {impl <P> <Q>} <R>})))
        (MATCH (VR <A>) (RL (RD <A> ) (WT {impl true <A>} )))
        */

        // inverse Łukasiewicz's axiom
        (MATCH (VR <P> <Q> <R> <S>) (RL (RD {impl {impl <R> <P>} {impl <S> <P>}}) (WT {impl {impl <P> <Q>} <R>})))
        
        // truth table
        //(MATCH (VR <A>) (RL (RD {impl <A> <A>}  ) (WT true)))
        (MATCH (VR <A>) (RL (RD {impl <A> true} ) (WT true)))
        (MATCH (VR <A>) (RL (RD {impl false <A>}) (WT true)))
        (MATCH (VR <A>) (RL (RD {impl true <A>} ) (WT <A> )))

        (MATCH (VR <A>) (RL (RD {impl <A> {impl <A> false}}) (WT false)))
        (MATCH (VR <A>) (RL (RD {impl {impl <A> false} false}) (WT <A>)))

        (MATCH (VR <A> <B> <C>) (RL (RD {impl <A> {impl <B> <C>}}) (WT {impl <B> {impl <A> <C>}})))
        
        /*
        (
            MATCH
            (VR <P> <Q> <R> <S>)
            (
                RL
                (RD {impl {impl <R> <P>} {impl <S> <P>}})
                (WT {case {impl {impl <P> <Q>} <R>}})
            )
        )
        (RL (RD {case true}) (WT true))
        (RL (RD {case false}) (WT invalid))
        (MATCH (VR <X>) (RL (RD {case <X>}) (WT <X>)))
        */

        /*
        (
            MATCH
            (VR <P> <Q> <R> <S>)
            (
                RL
                (RD {impl {impl <R> <P>} {impl <S> <P>}})
                (WT {case {impl {impl <P> <Q>} <R>} {impl {impl <R> <P>} {impl <S> <P>}}})
            )
        )
        (MATCH (VR <Y>)     (RL (RD {case true <Y>} ) (WT true )))
        (MATCH (VR <Y>)     (RL (RD {case false <Y>}) (WT false)))
        (MATCH (VR <X> <Y>) (RL (RD {case <X> <Y>}  ) (WT <Y>  )))
        */

        /*
        // true statements - IKS combinators equivalents
        (MATCH (VR <A>        ) (RL (RD {impl <A> <A>}) (WT true)))
        (MATCH (VR <A> <B>    ) (RL (RD {impl <A> {impl <B> <A>}}) (WT true)))
        (MATCH (VR <A> <B> <C>) (RL (RD {impl {impl <A> {impl <B> <C>}} {impl {impl <A> <B>} {impl <A> <C>}}}) (WT true)))
        */
    )
    (
        WT
        (RL (RD <ANY>) (WT))
    )
)
`,
"example-thm2-input":
`
/*
    De Morgan's law
*/

{
    eq
    {
        and
        A
        B
    }
    {
        not
        {
            or
            {
                not
                A
            }
            {
                not
                B
            }
        }
    }
}
`
}

