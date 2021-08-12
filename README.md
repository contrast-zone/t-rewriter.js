# intelog

    // under construction - merely a partial implementation //

## about the project

Formal languages are usually considered as formations dedicated to accomplishing diverse tasks. *intelog* is also a language, and it is an implementation of a [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system) that aims to be a host for a variety of kinds of formal languages. By its design, *intelog* represents an embodiment of a general problem solving technique, being able to support a diversity of hosted languages intentions and purposes.

The name *intelog* is a phrase coined from *[INTE]rmediate [LOG]ic*, and it stands for a [logic programming](https://en.wikipedia.org/wiki/Logic_programming) language that mediates between input and output expressions. Provided a uniform kind of custom [logic rules](https://en.wikipedia.org/wiki/Rule_of_inference) for each intention and purpose, *intelog* performs its functionality by [axiomatic](https://en.wikipedia.org/wiki/Axiom) translating between input and output expressions.

Seeing *intelog* as a programming language that operates on other formal languages, it provides a particular form of data computation: for each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) operating on specific forms of data (input), yielding specific forms of computation results (output). To that extent, *intelog* also represents a language implementing [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm.

## expected appearance

To get a glimpse of how *(once it is finished)* interfacing with *intelog* would look like, we bring the following ruleset:

    /*
        dog/cat decision sample
        
        sample input: *subject* barks/meows
        sample output: *subject* is a dog/cat
    */

    (
        RULESET
        (VAR )
        
        // the goal expression
        (IMPL (CONJ (SEQ sentence)) (DISJ (SEQ goal)))

        // syntax
        (IMPL (CONJ (SEQ subject predicate)) (DISJ (SEQ sentence )))
        (IMPL (CONJ (SEQ /[A-Z][a-z]*/)    ) (DISJ (SEQ subject  )))
        (IMPL (CONJ (SEQ /[a-z ]+/)        ) (DISJ (SEQ predicate)))

        // semantics
        (
            RULESET
            (VAR (X subject))
            (IMPL (CONJ (SEQ X "barks")) (DISJ (SEQ X "is a dog")))
        )
        (
            RULESET
            (VAR (X subject))
            (IMPL (CONJ (SEQ X "meows")) (DISJ (SEQ X "is a cat")))
        )
    )

*Intelog* uses the following syntax abbreviations: `RULESET` for set of rules, `VAR` for variables, `IMPL` for implication, `CONJ` for conjunction, `DISJ` for disjunction, and `SEQ` for sequence. Feeding an input `Nora meows` to the above ruleset should yield the output `Nora is a cat`. What is really happening is that we follow an inference line from the `goal` atom backwards to the input expression. Our output then represents a whole of continuous terminal sequence closest to the `goal` atom.

## current project status

A lot of research is invested in creation of *intelog*, and it is still under construction. During its creation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration (curious readers may want to skim historical documents explaining [logos](history/aug-2019-logos.md) and [expression logic](history/aug-2021-expression-logic.md) iterations). The most recent iteration draft document is in preparation phase.

*Intelog* bases its functionality on a novel *v-parse* algorithm. The algorithm creation is divided into three successive iterations, each being a superset of the previous one. This is the current project roadmap with *finished* marks:

1. [x] v-parse-crux algorithm (context free grammar parsing algorithm)
2. [ ] v-parse-plus algorithm (term rewriting extension)
3. [ ] v-parse-star algorithm (logic programming extension)

If one is interested in details about the current project iteration, there are two partial resources to check out:

- [a draft document explaining v-parse algorithm (under construction)](v-parse-algorithm.md)
- [online interpreter for intelog (v-parse-crux algorithm phase)](https://contrast-zone.github.io/intelog/playground)

