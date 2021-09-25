# exp-log

    // under construction - merely a partial implementation //

## about the project

Formal languages are usually considered as formations dedicated to accomplishing diverse tasks. *exp-log* is also a language, and it is an implementation of a [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system) that aims to be a host for a variety of kinds of formal languages. By its design, *exp-log* represents an embodiment of a general problem solving technique, being able to support a diversity of hosted languages intentions and purposes.

The name *exp-log* is a phrase coined from *[EXP]ression-[LOG]ic*, and it stands for a [logic programming](https://en.wikipedia.org/wiki/Logic_programming) language that mediates between input and output expressions. Provided a uniform kind of custom [logic rules](https://en.wikipedia.org/wiki/Rule_of_inference) for each intention and purpose, *exp-log* performs its functionality by [axiomatic](https://en.wikipedia.org/wiki/Axiom) translating between input and output expressions.

Seeing *exp-log* as a programming language that operates on other formal languages, it provides a particular form of data computation: for each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) operating on specific forms of data (input), yielding specific forms of computation results (output). To that extent, *exp-log* also represents a language implementing [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm.

## expected appearance

To get a glimpse of how *(once it is finished)* interfacing with *exp-log* would look like, we bring the following ruleset:

    /*
        dog/cat decision example
        
        input: `*subject* barks/meows`
        output: `*subject* is a dog/cat`
    */

    (
        RULESET
        
        // input syntax
        (IMP (CON         ) (DIS "<name> barks"  ))
        (IMP (CON         ) (DIS "<name> meows"  ))
        (IMP (CON "<name>") (DIS "<name><letter>"))
        (IMP (CON "<name>") (DIS "<letter>"      ))
        ...

        // semantics
        (
            MATCH
            (ID (X name))
            (RULESET (IMP (CON "<X> barks") (DIS "<X> is a dog")))
        )
        (
            MATCH
            (ID (X name))
            (RULESET (IMP (CON "<X> meows") (DIS "<X> is a cat")))
        )

        // output syntax
        ...
        (IMP (CON "<letter>"       ) (DIS "<name>"))
        (IMP (CON "<name><letter>" ) (DIS "<name>"))
        (IMP (CON "<name> is a dog") (DIS         ))
        (IMP (CON "<name> is a cat") (DIS         ))
    )

*Exp-log* uses the following syntax abbreviations: `RULESET` for set of rules, `IMP` for implication, `CON` for conjunction, `DIS` for disjunction, `MATCH` for non-teminal matching, and `ID` for non-terminals that appear identical at different places under the matching scope. Within strings, non-terminals are embraced inside `<` and `>` symbols.

Feeding an input `Nora meows` to the above ruleset should yield the output `Nora is a cat`.

What is really happening is that we follow a inference line from any of the starting (empty `CON`) expressions to the input terminal sequence. Then we continue the same line from the input expression to any of the ending (empty `DIS`) expressions. If such a inference line exists, our output is then represented by a whole of continuous terminal sequence closest to the ending expression.

## current status

A lot of research is invested in creation of *exp-log*, and it is still under construction. During its creation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration (curious readers may want to skim over historical documents explaining [logos](history/aug-2019-logos.md) and [expression logic](history/aug-2021-expression-logic.md) iterations). The most recent iteration [draft document](exp-log.md) is in preparation phase.

*exp-log* bases its functionality on a novel *v-parse* algorithm. The algorithm creation is divided into three successive iterations, each being a superset of the previous one. This is the current project roadmap with *finished* marks:

1. [x] v-parse-crux algorithm (context free grammar parsing algorithm)
2. [ ] v-parse-plus algorithm (term rewriting extension)
3. [ ] v-parse-star algorithm (logic programming extension)

If one is interested in details about the current project iteration exposure, there are two partial resources to check out:

- [a draft document explaining v-parse algorithm (under construction)](v-parse-algorithm.md)
- [online interpreter for exp-log (v-parse-crux algorithm phase)](https://contrast-zone.github.io/exp-log/playground)
