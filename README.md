# exp-log

    // under construction //

## about the project

    // rule-based programming, logic programming

*Exp-log* is an implementation of *expression logic* formalism, a novel deductive system that aims to be a host for a variety of kinds of formal languages. By its design, it represents an embodyment of a general problem solving technique, supporting diversity of hosted languages purposes and intentions.

One may find surprising that general problem solving technique used in *exp-log* is based on enhanced parsing technology which should (if everything goes well) perfectly corresponds to logical abduction process based on sequents from sequent calculus, a well known logical formalism for constructing scientific proofs.

## possible use cases

scientific:  
- formal system definition using arbitrary axiomatic schemata
- theorem prover using arbitrary inference rules

industrial:  
- rule based, language specific macro system
- programming language compiler kernel

universal:  
- Turing complete, logic programming supported input to output conversion mechanism

## current project status

A lot of research is invested in creation of *exp-log*, and it is still under construction. During its creation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Currently, *exp-log* is in programming phase.

The current project roadmap with *finished* marks:

- [ ] v-parse-crux algorithm (context free grammar parsing algorithm)
- [ ] v-parse-plus algorithm (Turing complete languages semantics)
- [ ] v-parse-star algorithm (higher order logical reasoning)

If one is interested in details of the current project iteration, there are two partial resources to check out:

- [a document explaining expression logic (under construction)](docs/expression-logic.md)
- [online editor for exp-log (testing v-parse-crux algorithm)](https://contrast-zone.github.io/exp-log/playground)

## expected appearance

    // to do: make a tutorial based on this example //

To get a glimpse of how interfacing with *exp-log* would look like, we bring the following ruleset:

    // dog-cat decision
    (
        // output semantics
        (
            // the goal expression
            sentence -> Goal
        ) /\ (
            // decision logic
            (
                ( <x> "barks" -> <x> "is a dog" ) /\
                ( <x> "meows" -> <x> "is a cat" )
            ) <- (
                // declarations
                <x> <-> subject
            )
        )
    ) <- (
        // output syntax
        ( subject predicate -> sentence  ) /\
        (       /[A-Za-z]+/ -> subject   ) /\
        (         /[a-z ]+/ -> predicate ) /\
    )

Passing the above ruleset while feeding an input `Nora meows` should yield the output `Nora is a cat`. If the definition remids you of a logic, it is because it is a kind of logic, the *expression logic* kind. This logic is specialized for defining syntax and semantics of different formal languages, and it should cope well with general problem solving.

But you know how they say - seeing is believing...

