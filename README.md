# exp-log

    // under construction //

## about the project

*Exp-log* is an implementation of *expression logic* formalism, a novel deductive system that aims to be a host for a variety of kinds of formal languages. By its design, it represents an embodyment of a general problem solving technique, supporting diversity of hosted languages purpose and intentions.

One may find surprising that general problem solving technique used in *exp-log* is based on enhanced parsing technology which should (if everything goes well) perfectly correspond to logical abduction process based on sequent calculus, a well known logical formalism for constructing scientific proofs.

## current project status

A lot of research is invested in creation of *exp-log*, and it is still under construction. During its creation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Currently, *exp-log* is in programming phase.

The current project roadmap with *finished* marks:

- [x] v-parse-crux algorithm (novel context free grammar parsing algorithm)
- [ ] v-parse-plus algorithm (enabling Turing complete languages semantics)
- [ ] v-parse-star algorithm (easying up logical reasoning)

If one is interested in details of the current project iteration, there are two partial resources to check out:

- [a document explaining expression logic (under construction)](docs/introduction.md)
- [online editor for exp-log (testing v-parse-crux algorithm)](https://contrast-zone.github.io/exp-log/test)

## expected appearance

To get a glimpse of what would, for example, untyped lambda calculus definition with an evaluation example look like programmed in *exp-log*, we bring the following code:

    <<
        (λx.(x x)) ((λx.(x x)) 2)
    >> :: <<
        // untyped lambda calculus
        (
            // semantics
            (
                (
                    // alpha conversion
                    "λ" @x "." @M -> αconv @y "." @M
                ) <- (
                    // declarations
                    ( λterm -> M  ) /\
                    (   var -> x  ) /\
                    (   var -> y  ) /\
                    (    @x -> @y )
                )
            ) /\ (
                (
                    // beta reduction
                    ("(" αconv @x "." @M ")") @N -> @M
                ) <- (
                    // declarations
                    ( λterm -> M  ) /\
                    ( λterm -> N  ) /\
                    (   var -> x  ) /\
                    (    @x -> @N )
                )
            )
        ) <- (
            // syntax
            (                   λterm -> Goal    ) /\
            (       "λ" var "." λterm -> λterm   ) /\
            (           λterm primary -> λterm   ) /\
            (                 primary -> λterm   ) /\
            (           "(" λterm ")" -> primary ) /\
            (                     var -> primary ) /\
            ( /[A-Za-z][_0-9A-Za-z]*/ -> var     )
        )
    >>

The output of this specific example would be `(2 2) (2 2)`.

Appearance and behavior of the code before `::` operator is entirely dependent of the definition after `::` operator. If the definition remids you of a logic, it is because it is a kind of logic, the *expression logic* kind. This logic is specialized for defining syntax and semantics of different languages, and it should cope well with general problem solving.

But you know how they say: seeing is believing...
