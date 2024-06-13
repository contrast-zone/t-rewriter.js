examples = {
"test0" :
`
/*
    stress test
*/

(
    RULE
    (
        READ
        
        (RULE (READ) (WRITE {goes [name] [[b] [c]]}))
        
        (RULE (READ [name]) (WRITE Milo))
        (RULE (READ [name]) (WRITE Nora))

        (RULE (READ [b]) (WRITE [z z]))
        (RULE (READ [[z z] [c]]) (WRITE [miu [c1]]))
        (RULE (READ [c1]) (WRITE [h mau i]))
        (
            MATCH
            (VAR <X> <Y>)
            (RULE (READ [<X> [h <Y> i]]) (WRITE [<X> <Y>]))
        )
        (RULE (READ [miu mau]) (WRITE meow))

        (RULE (READ [b]) (WRITE [wow 1]))
        (RULE (READ [c]) (WRITE [wow 2]))
        (
            MATCH
            (VAR <X> <Y> <Z>)
            (RULE (READ [[wow <X>] [wow <Y>]]) (WRITE [unb <Z> <Z>]))
        )
        (RULE (READ [unb xyz xyz]) (WRITE bark))
    )
    (
        CHAIN
        
        (
            MATCH
            (VAR <X>)
            (RULE (READ {goes <X> meow}) (WRITE {isA <X> cat}))
        )
        (
            MATCH
            (VAR <X>)
            (RULE (READ {goes <X> bark}) (WRITE {isA <X> dog}))
        )
    )
    (
        WRITE
        
        (RULE (READ Milo) (WRITE [name]  ))
        (RULE (READ Nora) (WRITE [name]  ))
        (RULE (READ cat ) (WRITE [living]))
        (RULE (READ dog ) (WRITE [living]))
        
        (RULE (READ {isA [name] [living]}) (WRITE))
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
    RULE
    (
        READ
        (RULE (READ) (WRITE (hearing <voice>)))
        
        (RULE (READ <voice>) (WRITE barks            ))
        (RULE (READ <voice>) (WRITE meows            ))
    )
    (
        CHAIN
        (RULE (READ (hearing meows)) (WRITE (being cat)))
        (RULE (READ (hearing barks)) (WRITE (being dog)))
    )
    (
        WRITE
        (RULE (READ cat           ) (WRITE <living>))
        (RULE (READ dog           ) (WRITE <living>))
        
        (RULE (READ (being <living>)) (WRITE))
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
    CHAIN
    (
        READ
        (WRITE {hello machine})
    )
    (
        CHAIN
        (RULE (READ {hello machine}) (WRITE {hello world}))
    )
    (
        WRITE
        (READ {hello world})
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

(RULE (READ {hello machine}) (WRITE {hello world}))
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

(
    MATCH
    (VAR <Name>)
    (RULE (READ {greet <Name>}) (WRITE {hello <Name>}))
)
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
    CHAIN
    (RULE (READ {isGood girl}) (WRITE {makeToy doll}))
    (RULE (READ {isGood boy} ) (WRITE {makeToy car} ))
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
    CHAIN
    (RULE (READ (sunIs rising) ) (WRITE (itIs morning)  ))
    (RULE (READ (sunIs falling)) (WRITE (itIs afternoon)))

    (RULE (READ (itIs morning)  ) (WRITE (shadowsLean west)))
    (RULE (READ (itIs afternoon)) (WRITE (shadowsLean east)))

    (RULE (READ (shadowsLean west)) (WRITE (shadowsDo shrink)))
    (RULE (READ (shadowsLean east)) (WRITE (shadowsDo expand)))
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
    CHAIN
    (
        MATCH
        (VAR <O1> <O2>)
        (
            RULE
            (READ (orbitsAround <O1> <O2>))
            (WRITE (weightsMoreThan <O2> <O1>))
        )
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
    CHAIN
    (
        MATCH
        (VAR <Name>)
        (
            RULE
            (READ {isDoing <Name> drivingRocket})
            (WRITE {isTitled <Name> astronaut})
        )
    )
    (
        MATCH
        (VAR <Name>)
        (
            RULE
            (READ {isDoing <Name> healingPeople})
            (WRITE {isTitled <Name> doctor})
        )
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
    RULE
    (
        READ
        
        (RULE (READ) (WRITE {orbitsAround [object] [object]}))
        
        (RULE (READ [object]) (WRITE sun  ))
        (RULE (READ [object]) (WRITE earth))
        (RULE (READ [object]) (WRITE moon ))
    )
    (
        CHAIN
        (
            MATCH
            (VAR <O1> <O2>)
            (
                RULE
                (READ {orbitsAround <O1> <O2>})
                (WRITE {attractsMoreThan <O2> <O1>})
            )
        )
        (
            MATCH
            (VAR <O1> <O2>)
            (
                RULE
                (READ {attractsMoreThan <O1> <O2>})
                (WRITE {weightsMoreThan <O1> <O2>})
            )
        )
    )
    (
        WRITE
        
        (RULE (READ sun  ) (WRITE [object]))
        (RULE (READ earth) (WRITE [object]))
        (RULE (READ moon ) (WRITE [object]))
        
        (RULE (READ {weightsMoreThan [object] [object]}) (WRITE))
    )
)
`,
"example-3-2-1-input":
`
{orbitsAround earth sun}
`,

"example-2-3-1":
`
/*
    student decision
    
     input: \`(isBeingEducated <Name>)\`
    output: \`(isAStudent <Name>)\`
*/

(
    CHAIN
    (
        MATCH
        (VAR <Name>)
        (
            RULE
            (READ (isBeingEducated <Name>))
            (WRITE (attendsSchool <Name>) (attendsCollege <Name>))
        )
    )
    (
        MATCH
        (VAR <Name>)
        (
            RULE
            (READ (attendsCollege <Name>))
            (WRITE (isAStudent <Name>))
        )
    )
    (
        MATCH
        (VAR <Name>)
        (
            RULE
            (READ (attendsSchool <Name>))
            (WRITE (isAStudent <Name>))
        )
    )
)
`,
"example-2-3-1-input":
`
(isBeingEducated Jane)
`,

"example-2-3-2":
`
/*
    computer expert decision
    
     input: \`(buildsARobot <Name>)\`
    output: \`(isAComputerExpert <Name>)\`
*/

(
    CHAIN
    (
        MATCH
        (VAR <Name>)
        (
            RULE
            (READ (buildsARobot <Name>))
            (WRITE (mastersHardware <Name>))
        )
    )
    (
        MATCH
        (VAR <Name>)
        (
            RULE
            (READ (buildsARobot <Name>))
            (WRITE (mastersSoftware <Name>))
        )
    )
    (
        MATCH
        (VAR <Name>)
        (
            RULE
            (READ (mastersSoftware <Name>) (mastersHardware <Name>))
            (WRITE (isAComputerExpert <Name>))
        )
    )
)
`,
"example-2-3-2-input":
`
(buildsARobot Jane)
`,

"example-3-2-3":
`
/*
    world spinning decision
    
     input: \`{peopleAre happy/sad}\`
    output: \`{stillTurns world}\`
*/

(
    RULE
    (
        READ
        
        (RULE (READ) (WRITE {peopleAre [mood]}))
        
        (RULE (READ [mood]) (WRITE happy))
        (RULE (READ [mood]) (WRITE sad  ))
    )
    (
        WRITE
        
        (RULE (READ world) (WRITE [object]))
        
        (RULE (READ {stillTurns [object]}) (WRITE))
    )
)
`,
"example-3-2-3-input":
`
{peopleAre happy}
`,

"example-eq":
`
/*
    equality predicate hack
    
     input: \`(iseql <X> <Y>)\`
    output: \`true/false\`
*/

(
    CHAIN
    (
        MATCH
        (VAR <X>)
        (RULE (READ (iseql <X> <X>)) (WRITE T))
    )
    (
        MATCH
        (VAR <X> <Y>)
        (RULE (READ (iseql <X> <Y>)) (WRITE F))
    )
)
`,
"example-eq-input":
`
(iseql (x + 1) (x + 1))
`,

"example-branch":
`
/*
    branching choice
    
     input: \`{if <condition> then <whentrue> else <whenfalse>}\`
    output: \`<whentrue>/<whenfalse>\`
*/

(
    RULE
    (
        READ
        
        (
            MATCH
            (VAR <X> <Y>)
            (RULE (READ) (WRITE {if [bool] then <X> else <Y>}))
        )
        
        (RULE (READ [bool]) (WRITE true))
        (RULE (READ [bool]) (WRITE false))
    )
    (
        CHAIN
        (
            MATCH
            (VAR <X> <Y>)
            (RULE (READ {if true then <X> else <Y>}) (WRITE <X>))
        )
        (
            MATCH
            (VAR <X> <Y>)
            (RULE (READ {if false then <X> else <Y>}) (WRITE <Y>))
        )
    )
    (
        WRITE
        (MATCH (VAR <Output>) (RULE (READ <Output>) (WRITE)))
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
    RULE
    (
        READ
        
        (RULE (READ) (WRITE [bool]))
        
        (RULE (READ [bool]) (WRITE {not [bool]}        ))
        (RULE (READ [bool]) (WRITE {and [bool] [bool]} ))
        (RULE (READ [bool]) (WRITE {or [bool] [bool]}  ))
        (RULE (READ [bool]) (WRITE {impl [bool] [bool]}))
        (RULE (READ [bool]) (WRITE {eq [bool] [bool]}  ))
        (RULE (READ [bool]) (WRITE [const]             ))
        
        (RULE (READ [const]) (WRITE true ))
        (RULE (READ [const]) (WRITE false))
    )
    (
        CHAIN
        
        // truth table for \`not\` operator
        (RULE (READ {not true }) (WRITE false))
        (RULE (READ {not false}) (WRITE true ))
        
        // truth table for \`and\` operator
        (RULE (READ {and true  true }) (WRITE true ))
        (RULE (READ {and true  false}) (WRITE false))
        (RULE (READ {and false true }) (WRITE false))
        (RULE (READ {and false false}) (WRITE false))
        
        // truth table for \`or\` operator
        (RULE (READ {or true  true }) (WRITE true ))
        (RULE (READ {or true  false}) (WRITE true ))
        (RULE (READ {or false true }) (WRITE true ))
        (RULE (READ {or false false}) (WRITE false))
        
        // truth table for \`impl\` operator
        (RULE (READ {impl true  true }) (WRITE true ))
        (RULE (READ {impl true  false}) (WRITE false))
        (RULE (READ {impl false true }) (WRITE true ))
        (RULE (READ {impl false false}) (WRITE true ))
        
        // truth table for \`eq\` operator
        (RULE (READ {eq true  true }) (WRITE true ))
        (RULE (READ {eq true  false}) (WRITE false))
        (RULE (READ {eq false true }) (WRITE false))
        (RULE (READ {eq false false}) (WRITE true ))
    )
    (
        WRITE
        
        (RULE (READ true ) (WRITE))
        (RULE (READ false) (WRITE))
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
    RULE
    (
        READ
        
        (RULE (READ) (WRITE {add [num] [num]}))
        
        (RULE (READ [num]  ) (WRITE [digit]        ))
        (RULE (READ [num]  ) (WRITE {[num] [digit]}))
        (RULE (READ [digit]) (WRITE 0              ))
        (RULE (READ [digit]) (WRITE 1              ))
    )
    (
        CHAIN
        
        // entry point
        (MATCH (VAR <A> <B>) (RULE (READ {add <A> <B>}) (WRITE [add <A> <B>])))

        // both numbers single digits
                             (RULE (READ [add       0       0]) (WRITE                         0))
                             (RULE (READ [add       0       1]) (WRITE                         1))
                             (RULE (READ [add       1       0]) (WRITE                         1))
                             (RULE (READ [add       1       1]) (WRITE {                    1 0}))
        
        // first number multiple digits, second number single digit
        (MATCH (VAR <A>    ) (RULE (READ [add {<A> 0}       0]) (WRITE {                  <A> 0})))
        (MATCH (VAR <A>    ) (RULE (READ [add {<A> 0}       1]) (WRITE {                  <A> 1})))
        (MATCH (VAR <A>    ) (RULE (READ [add {<A> 1}       0]) (WRITE {                  <A> 1})))
        (MATCH (VAR <A>    ) (RULE (READ [add {<A> 1}       1]) (WRITE {          [add 1 <A>] 0})))
        
        // first number single digit, second number multiple digits
        (MATCH (VAR <B>    ) (RULE (READ [add       0 {<B> 0}]) (WRITE {                  <B> 0})))
        (MATCH (VAR <B>    ) (RULE (READ [add       0 {<B> 1}]) (WRITE {                  <B> 1})))
        (MATCH (VAR <B>    ) (RULE (READ [add       1 {<B> 0}]) (WRITE {                  <B> 1})))
        (MATCH (VAR <B>    ) (RULE (READ [add       1 {<B> 1}]) (WRITE {          [add 1 <B>] 0})))
        
        // both numbers multiple digits
        (MATCH (VAR <A> <B>) (RULE (READ [add {<A> 0} {<B> 0}]) (WRITE {        [add <A> <B>] 0})))
        (MATCH (VAR <A> <B>) (RULE (READ [add {<A> 0} {<B> 1}]) (WRITE {        [add <A> <B>] 1})))
        (MATCH (VAR <A> <B>) (RULE (READ [add {<A> 1} {<B> 0}]) (WRITE {        [add <A> <B>] 1})))
        (MATCH (VAR <A> <B>) (RULE (READ [add {<A> 1} {<B> 1}]) (WRITE {[add 1 [add <A> <B>]] 0})))
    )
    (
        WRITE

        (RULE (READ 0              ) (WRITE [digit]))
        (RULE (READ 1              ) (WRITE [digit]))
        (RULE (READ [digit]        ) (WRITE [num]  ))
        (RULE (READ {[num] [digit]}) (WRITE [num]  ))

        (RULE (READ [num]) (WRITE))
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
    RULE
    (
        READ
        
        (RULE (READ) (WRITE {leq [num] [num]}))
        
        (RULE (READ [num]  ) (WRITE [digit]        ))
        (RULE (READ [num]  ) (WRITE {[num] [digit]}))
        (RULE (READ [digit]) (WRITE 0              ))
        (RULE (READ [digit]) (WRITE 1              ))
    )
    (
        CHAIN

        // leq predicate
        (MATCH (VAR <X> <Y>) (RULE (READ {leq <X> <Y>}) (WRITE [leqUtil [cmp <X> <Y>]])))
        (RULE (READ [leqUtil gt]) (WRITE false))
        (RULE (READ [leqUtil eq]) (WRITE true))
        (RULE (READ [leqUtil lt]) (WRITE true))
        
        // both numbers single digits
                             (RULE (READ [cmp       0       0]) (WRITE                 eq))
                             (RULE (READ [cmp       0       1]) (WRITE                 lt))
                             (RULE (READ [cmp       1       0]) (WRITE                 gt))
                             (RULE (READ [cmp       1       1]) (WRITE                 eq))
        
        // first number multiple digits, second number single digit
        (MATCH (VAR <A>    ) (RULE (READ [cmp {<A> 0}       0]) (WRITE [[cmp <A>   0] eq])))
        (MATCH (VAR <A>    ) (RULE (READ [cmp {<A> 0}       1]) (WRITE [[cmp <A>   0] lt])))
        (MATCH (VAR <A>    ) (RULE (READ [cmp {<A> 1}       0]) (WRITE [[cmp <A>   0] gt])))
        (MATCH (VAR <A>    ) (RULE (READ [cmp {<A> 1}       1]) (WRITE [[cmp <A>   0] eq])))
        
        // first number single digit, second number multiple digits
        (MATCH (VAR <B>    ) (RULE (READ [cmp       0 {<B> 0}]) (WRITE [[cmp   0 <B>] eq])))
        (MATCH (VAR <B>    ) (RULE (READ [cmp       0 {<B> 1}]) (WRITE [[cmp   0 <B>] lt])))
        (MATCH (VAR <B>    ) (RULE (READ [cmp       1 {<B> 0}]) (WRITE [[cmp   0 <B>] gt])))
        (MATCH (VAR <B>    ) (RULE (READ [cmp       1 {<B> 1}]) (WRITE [[cmp   0 <B>] eq])))
        
        // both numbers multiple digits
        (MATCH (VAR <A> <B>) (RULE (READ [cmp {<A> 0} {<B> 0}]) (WRITE [[cmp <A> <B>] eq])))
        (MATCH (VAR <A> <B>) (RULE (READ [cmp {<A> 0} {<B> 1}]) (WRITE [[cmp <A> <B>] lt])))
        (MATCH (VAR <A> <B>) (RULE (READ [cmp {<A> 1} {<B> 0}]) (WRITE [[cmp <A> <B>] gt])))
        (MATCH (VAR <A> <B>) (RULE (READ [cmp {<A> 1} {<B> 1}]) (WRITE [[cmp <A> <B>] eq])))
        
        // reduce to final value
        (MATCH (VAR <N>) (RULE (READ [gt <N>]) (WRITE gt )))
        (MATCH (VAR <N>) (RULE (READ [lt <N>]) (WRITE lt )))
        (MATCH (VAR <N>) (RULE (READ [eq <N>]) (WRITE <N>)))
    )
    (
        WRITE
        
        (RULE (READ true ) (WRITE))
        (RULE (READ false) (WRITE))
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
    (VAR <X> <M> <N>)
    (
        RULE
        (
            READ
            (RULE (READ) (WRITE ((lmbd <X>) <M>) <N>))
        )
        (
            WRITE
            (RULE (READ <N>) (WRITE <X>))
            (RULE (READ <M>) (WRITE))
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
    CHAIN
    
    // intermediate expression
    (
        MATCH
        (VAR <X> <Y> <M>)
        (
            RULE
            (
                READ
                ((lmbd <X>) <M>)
            )
            (
                WRITE
                (<intrmd> <X> <Y> <M>)
            )
        )
    )

    // alpha conversion
    (
        MATCH
        (VAR <X> <Y> <M>)
        (
            RULE
            (
                READ
                (<intrmd> <X> <Y> <M>)
                <X>
            )
            (
                WRITE
                <Y>
            )
        )
    )
    
    // beta reduction
    (
        MATCH
        (VAR <X> <Y> <M> <N>)
        (
            RULE
            (
                READ
                ((<intrmd> <X> <Y> <M>) <N>)
            )
            (
                WRITE
                <M>
            )
        )
    )
    (
        MATCH
        (VAR <X> <Y> <M> <N>)
        (
            RULE
            (
                READ
                ((<intrmd> <X> <Y> <M>) <N>)
                <Y>
            )
            (
                WRITE
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
    CHAIN
    
    // combinators definition
    (
        MATCH
        (VAR <A>)
        (RULE (READ I) (WRITE (impl <A> <A>)))
    )
    (
        MATCH
        (VAR <A> <B>)
        (RULE (READ K) (WRITE (impl <A> (impl <B> <A>))))
    )
    (
        MATCH
        (VAR <A> <B> <C>)
        (RULE (READ S) (WRITE (impl (impl <A> (impl <B> <C>)) (impl (impl <A> <B>) (impl <A> <C>)))))
    )
    
    // combinators application
    (
        MATCH
        (VAR <A> <B>)
        (RULE (READ ((impl <A> <B>) <A>)) (WRITE <B>))
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
    CHAIN
    
    /*
        proving system
    */

    (MATCH (VAR <A>) (RULE (READ {Assume <A>}) (WRITE <A>)))
    
    (MATCH (VAR <A> <B>) (RULE (READ {andIntro  <A> <B>                                       }) (WRITE {and <A> <B>} )))
    (MATCH (VAR <A> <B>) (RULE (READ {andElim1  {and <A> <B>}                                 }) (WRITE <A>           )))
    (MATCH (VAR <A> <B>) (RULE (READ {andElim2  {and <A> <B>}                                 }) (WRITE <B>           )))
    (MATCH (VAR <A> <B>) (RULE (READ {orIntro1  <A>                                           }) (WRITE {or <A> <B>}  )))
    (MATCH (VAR <A> <B>) (RULE (READ {orIntro2  <B>                                           }) (WRITE {or <A> <B>}  )))
    (MATCH (VAR <A> <B>) (RULE (READ {orElim    {or <A> <B>} {flws <A> False} {flws <B> False}}) (WRITE False         )))
    (MATCH (VAR <A> <B>) (RULE (READ {implIntro {flws <A> <B>}                                }) (WRITE {impl <A> <B>})))
    (MATCH (VAR <A> <B>) (RULE (READ {implElim  {impl <A> <B>} <A>                            }) (WRITE <B>           )))
    (MATCH (VAR <A> <B>) (RULE (READ {eqIntro   {impl <A> <B>} {impl <B> <A>}                 }) (WRITE {eq <A> <B>}  )))
    (MATCH (VAR <A> <B>) (RULE (READ {eqElim1   {eq <A> <B>} <A>                              }) (WRITE <B>           )))
    (MATCH (VAR <A> <B>) (RULE (READ {eqElim2   {eq <A> <B>} <B>                              }) (WRITE <A>           )))
    (MATCH (VAR <A>    ) (RULE (READ {notIntro  {flws <A> False}                              }) (WRITE {not <A>}     )))
    (MATCH (VAR <A>    ) (RULE (READ {notElim   {not <A>} <A>                                 }) (WRITE False         )))
    (MATCH (VAR <A>    ) (RULE (READ {X         False                                         }) (WRITE <A>           )))
    (MATCH (VAR <A>    ) (RULE (READ {IP        {flws {not <A>} False}                        }) (WRITE <A>           )))
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
    CHAIN
    
    /*
        proving system
    */

    (MATCH (VAR a) (RULE (READ ([Assume] a)) (WRITE a)))
    
    (MATCH (VAR a b) (RULE (READ ([andIntro]  a b                                   )) (WRITE (and a b) )))
    (MATCH (VAR a b) (RULE (READ ([andElim1]  (and a b)                             )) (WRITE a         )))
    (MATCH (VAR a b) (RULE (READ ([andElim2]  (and a b)                             )) (WRITE b         )))
    (MATCH (VAR a b) (RULE (READ ([orIntro1]  a                                     )) (WRITE (or a b)  )))
    (MATCH (VAR a b) (RULE (READ ([orIntro2]  b                                     )) (WRITE (or a b)  )))
    (MATCH (VAR a b) (RULE (READ ([orElim]    (or a b) (flws a False) (flws b False))) (WRITE False     )))
    (MATCH (VAR a b) (RULE (READ ([implIntro] (flws a b)                            )) (WRITE (impl a b))))
    (MATCH (VAR a b) (RULE (READ ([implElim]  (impl a b) a                          )) (WRITE b         )))
    (MATCH (VAR a b) (RULE (READ ([eqIntro]   (impl a b) (impl b a)                 )) (WRITE (eq a b)  )))
    (MATCH (VAR a b) (RULE (READ ([eqElim1]   (eq a b) a                            )) (WRITE b         )))
    (MATCH (VAR a b) (RULE (READ ([eqElim2]   (eq a b) b                            )) (WRITE a         )))
    (MATCH (VAR a  ) (RULE (READ ([notIntro]  (flws a False)                        )) (WRITE (not a)   )))
    (MATCH (VAR a  ) (RULE (READ ([notElim]   (not a) a                             )) (WRITE False     )))
    (MATCH (VAR a  ) (RULE (READ ([X]         False                                 )) (WRITE a         )))
    (MATCH (VAR a  ) (RULE (READ ([IP]        (flws (not a) False)                  )) (WRITE a         )))

    // (A /\\ B) -> ~(~ A \\/ ~ B)
    (RULE (READ f1      ) (WRITE ([Assume] (and A B)                   )))
    (RULE (READ   f2    ) (WRITE ([Assume] (or (not A) (not B))        )))
    (RULE (READ     f3  ) (WRITE ([Assume] (not A)                     )))
    (RULE (READ       f4) (WRITE ([andElim1] f1                        ))) // A
    (RULE (READ       f5) (WRITE ([notElim] f3 f4                      ))) // False
    (RULE (READ     f6  ) (WRITE ([Assume] (not B)                     )))
    (RULE (READ       f7) (WRITE ([andElim2] f1                        ))) // B
    (RULE (READ       f8) (WRITE ([notElim] f6 f7                      ))) // False
    (RULE (READ     f9  ) (WRITE ([orElim] f2 (flws f3 f5) (flws f6 f8)))) // False
    (RULE (READ   f10   ) (WRITE ([notIntro] (flws f2 f9)              ))) // ~ ((~ A) \\/ (~ B))
    (RULE (READ th1     ) (WRITE ([implIntro] (flws f1 f10)            ))) // (A /\\ B) -> (~ ((~ A) \\/ (~ B)))
    
    // ~(~A \\/ ~B) -> (A /\\ B)
    (RULE (READ f11     ) (WRITE ([Assume] (not (or (not A) (not B)))  )))
    (RULE (READ   f12   ) (WRITE ([Assume] (not A)                     )))
    (RULE (READ     f13 ) (WRITE ([orIntro1] f12                       ))) // (~ A) \\/ UNDEFINED
    (RULE (READ     f14 ) (WRITE ([notElim] f11 f13                    ))) // False
    (RULE (READ   f15   ) (WRITE ([IP] (flws f12 f14)                  ))) // A
    (RULE (READ   f16   ) (WRITE ([Assume] (not B)                     )))
    (RULE (READ     f17 ) (WRITE ([orIntro2] f16                       ))) // UNDEFINED \\/ (~ B)
    (RULE (READ     f18 ) (WRITE ([notElim] f11 f17                    ))) // False
    (RULE (READ   f19   ) (WRITE ([IP] (flws f16 f18)                  ))) // B
    (RULE (READ   f20   ) (WRITE ([andIntro] f15 f19                   ))) // A /\\ B
    (RULE (READ th2     ) (WRITE ([implIntro] (flws f11 f20)           ))) //(~ ((~ A) \\/ (~ B))) -> (A /\\ B)
    
    // (A /\\ B) <-> ~(~A \\/ ~B)
    (RULE (READ (CHECK DeMorgan)) (WRITE ([eqIntro] th1 th2))) // (A /\\ B) <-> (~ ((~ A) \\/ (~ B)))
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
    RULE
    (
        READ

        /*
            axioms
        */        

        (
            MATCH
            (VAR <P> <Q>)
            (RULE (READ) (WRITE (impl <P> (impl <Q> <P>))))
        )
        (
            MATCH
            (VAR <P> <Q> <R>)
            (RULE (READ) (WRITE (impl (impl <P> (impl <Q> <R>)) (impl (impl <P> <Q>) (impl <P> <R>)))))
        )
        (
            MATCH
            (VAR <P> <Q>)
            (RULE (READ) (WRITE (impl (impl (not <P>) (not <Q>)) (impl <Q> <P>))))
        )

        /*
            modus ponens
        */

        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ (impl <A> <B>) <A>) (WRITE <B>))
        )
        
        /*
            [and intro]
        */

        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ <A> <B>) (WRITE (and <A> <B>)))
        )
        
        /*
            [or intro]
        */

        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ <A>) (WRITE (or <A> <B>)))
        )
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ <B>) (WRITE (or <A> <B>)))
        )
        
        /*
            [eq intro]
        */

        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ (and (impl <A> <B>) (impl <B> <A>))) (WRITE (eq <A> <B>)))
        )
    )
    (
        WRITE
        (RULE (READ "valid") (WRITE))
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
    RULE
    (
        READ
        
        /*
            [not intro]
             A |- false
            ------------
                ~ A
        */
        (
            MATCH
            (VAR <A>)
            (RULE (READ) (WRITE (not <A>) <A>))
        )
        (
            MATCH
            (VAR <A>)
            (RULE (READ false) (WRITE (not <A>)))
        )
        
        /*
            [and intro]
               A, B
            ----------
              A /\ B
        */
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ <A> <B>) (WRITE (and <A> <B>)))
        )
        
        /*
            [or intro]
                A       B
            -------- --------
             A \/ B   A \/ B
        */
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ <A>) (WRITE (or <A> <B>)))
        )
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ <B>) (WRITE (or <A> <B>)))
        )
        
        /*
            [impl intro]
             A |- B
            --------
             A -> B
        */
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ) (WRITE (impl <A> <B>) <A>))
        )
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ <B>) (WRITE (impl <A> <B>)))
        )
        
        /*
            [eq intro]
             A -> B /\ B -> A
            ------------------
                 A <-> B
        */
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ (and (impl <A> <B>) (impl <B> <A>))) (WRITE (eq <A> <B>)))
        )
    )
    (
        CHAIN
    )
    (
        WRITE
        
        /*
            [exist quant elim]
              ((exists X) A)
            -------------------
             ~((forall X) ~ A)
        */
        (
            MATCH
            (VAR <X> <Y> <A>)
            (RULE (READ ((exists <X>) <A>)) (WRITE (not ((forall <X>) (not <A>)))))
        )
        
        /*
            [univ quant elim]
              ((forall X) A)
            ------------------
             Y -> (A [X := Y])
        */
        (
            MATCH
            (VAR <X> <Y> <A>)
            (RULE (READ ((forall <X>) <A>)) (WRITE (impl <X> (subst <A> <X> <Y>))))
        )
        
        /*
            [eq elim]
                 A <-> B
            ------------------
             A -> B /\ B -> A
        */
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ (eq <A> <B>)) (WRITE (and (impl <A> <B>) (impl <B> <A>))))
        )
        
        /*
            [impl elim]
             A -> B
            --------
             A |- B 
        */
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ (impl <A> <B>) <A>) (WRITE  <B>))
        )
        
        /*
            [and elim]
             A /\ B   A /\ B
            -------- --------
                A       B
        */
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ (and <A> <B>)) (WRITE <A>))
        )
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ (and <A> <B>)) (WRITE <B>))
        )
        
        /*
            [or elim]
              A \/ B
            ----------
               A, B
        */
        (
            MATCH
            (VAR <A> <B>)
            (RULE (READ (or <A> <B>)) (WRITE <A> <B>))
        )
        
        /*
            [not elim]
                ~ A
            ------------
             A |- false
        */
        (
            MATCH
            (VAR <A>)
            (RULE (READ (not <A>) <A>) (WRITE false))
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
    propositional logic theorem validator
    
     input: propositional logic expression
    output: \`true\` if expression is valid
*/

(
    RULE
    (
        READ
        
        (RULE (READ) (WRITE [bool]))
        
        (RULE (READ [bool]) (WRITE {not [bool]}        ))
        (RULE (READ [bool]) (WRITE {and [bool] [bool]} ))
        (RULE (READ [bool]) (WRITE {or [bool] [bool]}  ))
        (RULE (READ [bool]) (WRITE {impl [bool] [bool]}))
        (RULE (READ [bool]) (WRITE {eq [bool] [bool]}  ))
        (RULE (READ [bool]) (WRITE <ATOMIC>            ))
    )
    (
        CHAIN
        
        // converting to negation and disjunction
        (MATCH (VAR <A> <B>) (RULE (READ {and <A> <B>} ) (WRITE {not {or {not <A>} {not <B>}}}     )))
        (MATCH (VAR <A> <B>) (RULE (READ {impl <A> <B>}) (WRITE {or {not <A>} <B>}                 )))
        (MATCH (VAR <A> <B>) (RULE (READ {eq <A> <B>}  ) (WRITE {and {impl <A> <B>} {impl <B> <A>}})))
        
        // truth table
        (RULE (READ {not true} ) (WRITE false))
        (RULE (READ {not false}) (WRITE true ))
        (MATCH (VAR <A>) (RULE (READ {or true <A>} ) (WRITE true)))
        (MATCH (VAR <A>) (RULE (READ {or false <A>}) (WRITE <A> )))
        
        // reduction algebra
        (MATCH (VAR <A>) (RULE (READ {not {not <A>}}) (WRITE <A>)))
        (MATCH (VAR <A>) (RULE (READ {or <A> <A>}   ) (WRITE <A>)))
        
        // law of excluded middle
        (MATCH (VAR <A>) (RULE (READ {or <A> {not <A>}}) (WRITE true)))
        
        // modus ponens
        (MATCH (VAR <A> <B>) (RULE (READ {not {or {not <A>} {not {or {not <A>} <B>}}}}) (WRITE <B>)))
        
        // resolution rule
        (MATCH (VAR <A> <B> <C>) (RULE (READ {not {or {not {or <A> <B>}} {not {or {not <A>} <C>}}}}) (WRITE {or <B> <C>})))
        
        // distributivity and commutativity laws
        (MATCH (VAR <A> <B> <C>) (RULE (READ {or <A> {or <B> <C>}}) (WRITE {or {or <A> <B>} <C>})))
        (MATCH (VAR <A> <B>    ) (RULE (READ {or <A> <B>}         ) (WRITE {or <B> <A>}         )))
    )
    (
        WRITE
        (RULE (READ true) (WRITE))
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
    RULE
    (
        READ
        
        (RULE (READ) (WRITE [step]))
        
        (RULE (READ [step]) (WRITE {AND-INTRO [step]}  ))
        (RULE (READ [step]) (WRITE {IMPL-INTROL [step]}))
        (RULE (READ [step]) (WRITE {IMPL-INTROR [step]}))
        (RULE (READ [step]) (WRITE {EQ-INTRO [step]}   ))
        (RULE (READ [step]) (WRITE {NEG-EVALT [step]}  ))
        (RULE (READ [step]) (WRITE {NEG-EVALF [step]}  ))
        (RULE (READ [step]) (WRITE {DBLNEG [step]}     ))
        (RULE (READ [step]) (WRITE {OR-EVAL1L [step]}  ))
        (RULE (READ [step]) (WRITE {OR-EVAL1R [step]}  ))
        (RULE (READ [step]) (WRITE {OR-EVAL2L [step]}  ))
        (RULE (READ [step]) (WRITE {OR-EVAL2R [step]}  ))
        (RULE (READ [step]) (WRITE {EXMIDL [step]}     ))
        (RULE (READ [step]) (WRITE {EXMIDR [step]}     ))
        (RULE (READ [step]) (WRITE {OR-INTRO [step]}   ))
        (RULE (READ [step]) (WRITE <ANY>               ))
    )
    (
        CHAIN
        
        // mappings to negation and disjunction
        
        (MATCH (VAR <A> <B>) (RULE (READ {AND-INTRO {not {or {not <A>} {not <B>}}}}    ) (WRITE {and <A> <B>} )))
        (MATCH (VAR <A> <B>) (RULE (READ {IMPL-INTROR {or {not <A>} <B>}}              ) (WRITE {impl <A> <B>})))
        (MATCH (VAR <A> <B>) (RULE (READ {IMPL-INTROL {or <B> {not <A>}}}              ) (WRITE {impl <A> <B>})))
        (MATCH (VAR <A> <B>) (RULE (READ {EQ-INTRO {and {impl <A> <B>} {impl <B> <A>}}}) (WRITE {eq <A> <B>}  )))
        
        // reduction main algebra
        
        (RULE (WRITE {not true} ) (READ {NEG-EVALF false}))
        (RULE (WRITE {not false}) (READ {NEG-EVALT true}))
        
        (MATCH (VAR <A>) (RULE (READ {DBLNEG <A>}) (WRITE {not {not <A>}})))
        
        (MATCH (VAR <A>) (RULE (READ {OR-EVAL1L true}) (WRITE {or true <A>})))
        (MATCH (VAR <A>) (RULE (READ {OR-EVAL1R true}) (WRITE {or <A> true})))
        
        (MATCH (VAR <A>) (RULE (READ {OR-EVAL2L <A>}) (WRITE {or <A> false})))
        (MATCH (VAR <A>) (RULE (READ {OR-EVAL2R <A>}) (WRITE {or false <A>})))
        
        (MATCH (VAR <A>) (RULE (READ {EXMIDL true}) (WRITE {or <A> {not <A>}})))
        (MATCH (VAR <A>) (RULE (READ {EXMIDR true}) (WRITE {or {not <A>} <A>})))
        
        (MATCH (VAR <A>) (RULE (READ {OR-INTRO <A>}) (WRITE {or <A> <A>})))
        
        // distributivity and commutativity laws
        
        (MATCH (VAR <A> <B> <C>) (RULE (READ {or {or <A> <B>} <C>}) (WRITE {or <A> {or <B> <C>}})))
        (MATCH (VAR <A> <B>    ) (RULE (READ {or <B> <A>}         ) (WRITE {or <A> <B>}         )))
    )
    (
        WRITE
        
        (RULE (READ {not [bool]}        ) (WRITE [bool]))
        (RULE (READ {and [bool] [bool]} ) (WRITE [bool]))
        (RULE (READ {or [bool] [bool]}  ) (WRITE [bool]))
        (RULE (READ {impl [bool] [bool]}) (WRITE [bool]))
        (RULE (READ {eq [bool] [bool]}  ) (WRITE [bool]))
        (RULE (READ <ATOMIC>            ) (WRITE [bool]))
        
        (RULE (READ [bool]) (WRITE))
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
"example-proofsyn":
`
/*
    propositional logic proof synthesis
*/

(
    RULE
    (
        READ
        
        (RULE (READ) (WRITE [bool]))
        
        (RULE (READ [bool]) (WRITE {not [bool]}        ))
        (RULE (READ [bool]) (WRITE {and [bool] [bool]} ))
        (RULE (READ [bool]) (WRITE {or [bool] [bool]}  ))
        (RULE (READ [bool]) (WRITE {impl [bool] [bool]}))
        (RULE (READ [bool]) (WRITE {eq [bool] [bool]}  ))
        (RULE (READ [bool]) (WRITE <ATOMIC>            ))
    )
    (
        CHAIN
        
        // mappings to negation and disjunction
        
        (MATCH (VAR <A> <B>) (RULE (READ {and <A> <B>} ) (WRITE {AND-INTRO {not {or {not <A>} {not <B>}}}}    )))
        (MATCH (VAR <A> <B>) (RULE (READ {impl <A> <B>}) (WRITE {IMPL-INTROL {or {not <A>} <B>}}              )))
        (MATCH (VAR <A> <B>) (RULE (READ {impl <A> <B>}) (WRITE {IMPL-INTROR {or <B> {not <A>}}}              )))
        (MATCH (VAR <A> <B>) (RULE (READ {eq <A> <B>}  ) (WRITE {EQ-INTRO {and {impl <A> <B>} {impl <B> <A>}}})))
        
        // reduction main algebra
        
        (RULE (READ {not true} ) (WRITE {NEG-EVALF false}))
        (RULE (READ {not false}) (WRITE {NEG-EVALT true}))
        
        (MATCH (VAR <A>) (RULE (READ {not {not <A>}}) (WRITE {DBLNEG <A>})))
        
        (MATCH (VAR <A>) (RULE (READ {or true <A>}) (WRITE {OR-EVAL1L true})))
        (MATCH (VAR <A>) (RULE (READ {or <A> true}) (WRITE {OR-EVAL1R true})))
        
        (MATCH (VAR <A>) (RULE (READ {or <A> false}) (WRITE {OR-EVAL2L <A>})))
        (MATCH (VAR <A>) (RULE (READ {or false <A>}) (WRITE {OR-EVAL2R <A>})))
        
        (MATCH (VAR <A>) (RULE (READ {or <A> {not <A>}}) (WRITE {EXMIDL true})))
        (MATCH (VAR <A>) (RULE (READ {or {not <A>} <A>}) (WRITE {EXMIDR true})))
        
        (MATCH (VAR <A>) (RULE (READ {or <A> <A>}) (WRITE {OR-INTRO <A>})))
        
        // distributivity and commutativity laws
        
        (MATCH (VAR <A> <B> <C>) (RULE (READ {or <A> {or <B> <C>}}) (WRITE {or {or <A> <B>} <C>})))
        (MATCH (VAR <A> <B>    ) (RULE (READ {or <A> <B>}         ) (WRITE {or <B> <A>}         )))
    )
    (
        WRITE

        (RULE (READ {AND-INTRO [step]}  ) (WRITE [step]))
        (RULE (READ {IMPL-INTROL [step]}) (WRITE [step]))
        (RULE (READ {IMPL-INTROR [step]}) (WRITE [step]))
        (RULE (READ {EQ-INTRO [step]}   ) (WRITE [step]))
        (RULE (READ {NEG-EVALT [step]}  ) (WRITE [step]))
        (RULE (READ {NEG-EVALF [step]}  ) (WRITE [step]))
        (RULE (READ {DBLNEG [step]}     ) (WRITE [step]))
        (RULE (READ {OR-EVAL1L [step]}  ) (WRITE [step]))
        (RULE (READ {OR-EVAL1R [step]}  ) (WRITE [step]))
        (RULE (READ {OR-EVAL2L [step]}  ) (WRITE [step]))
        (RULE (READ {OR-EVAL2R [step]}  ) (WRITE [step]))
        (RULE (READ {EXMIDL [step]}     ) (WRITE [step]))
        (RULE (READ {EXMIDR [step]}     ) (WRITE [step]))
        (RULE (READ {OR-INTRO [step]}   ) (WRITE [step]))
        (RULE (READ <ANY>               ) (WRITE [step]))
        
        (RULE (READ [step]) (WRITE))
    )
)
`,
"example-proofsyn-input":
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

