# exp-log

    // under construction - merely a partial implementation //

## about the project

*Exp-log* is an implementation of *expression logic* formalism, a [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system) that aims to be a host for a variety of kinds of formal languages. By its design, *exp-log* represents an embodyment of a general problem solving technique, being able to support diversity of hosted languages purposes and intentions.

One may find surprising that novel inference engine behind *exp-log* is based on original parsing technology which should *(if everything goes well)* perfectly correspond to logical abduction process. The abduction process is utilizing sequents borrowed from [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus), a well known logical formalism for constructing logic proofs. However, although borrowed sequents are a backbone of *exp-log*, we observe them a bit differently than in usual sequent calculus interpretation. This allows us to use the abduction process as a main guide towards automatic construction of output from provided input while still keeping *exp-log* in the light of a [logic programming](https://en.wikipedia.org/wiki/Logic_programming) tool.

**possible use cases:**

- scientific
    - formal system definition using arbitrary axiomatic schemata
    - theorem prover using arbitrary inference rules

- industrial
    - programming language parsing and compiling tool
    - rule based, language specific macro system

- universal
    - Turing complete, logic programming supported input to output conversion mechanism

## expected appearance

To get a glimpse of how *(once it is finished)* interfacing with *exp-log* would look like, we bring the following ruleset:

    /*
        dog/cat decision sample
        
        sample input: subject barks/meows
        sample output: subject identification as a dog/cat
    */

    // the goal expression
    ( sentence -> goal ) /\

    // syntax
    ( subject predicate -> sentence  ) /\
    (     /[A-Z][a-z]*/ -> subject   ) /\
    (         /[a-z ]+/ -> predicate ) /\

    // semantics
    ( X:subject . (X "barks" -> X "is a dog") ) /\
    ( X:subject . (X "meows" -> X "is a cat") )

Passing the above ruleset while feeding an input `Nora meows` should yield the output `Nora is a cat`. What is really happening is that we follow an inference line between input and the `goal` atom. Our output then represents a whole of continuous terminal sequence closest to the `goal` atom. If this ruleset remids you of a logic, it is because it is written in a kind of logic, the *expression logic* kind. This logic is specialized for defining syntax and semantics of different formal languages, and it should cope well with general problem solving.

## current project status

A lot of research is invested in creation of *exp-log*, and it is still under construction. During its creation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Currently, *exp-log* is in programming phase.

The current project roadmap with *finished* marks (none yet):

1. [ ] v-parse-crux algorithm (context free grammar parsing algorithm)
2. [ ] v-parse-plus algorithm (Turing complete languages semantics)
3. [ ] v-parse-star algorithm (logic programming support)

If one is interested in details of the current project iteration, there are two partial resources to check out:

- [a document explaining expression logic (under construction)](docs/expression-logic.md)
- [online editor for exp-log (v-parse-crux algorithm phase)](https://contrast-zone.github.io/exp-log/playground)

