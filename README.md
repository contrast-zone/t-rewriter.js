# exp-log

    // under construction - merely a partial implementation //

## about the project

Formal languages are usually considered as formations dedicated to accomplishing diverse tasks. *exp-log* is also a language, and it is an implementation of a [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system) that aims to be a host for a variety of kinds of formal languages. By its design, *exp-log* represents an embodiment of a general problem solving technique called [term rewriting](https://en.wikipedia.org/wiki/Rewriting), being able to support a diversity of hosted languages intentions and purposes.

Seeing *exp-log* as a programming language that operates on other formal languages, it provides a particular form of data computation: for each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) operating on specific forms of data (input), yielding specific forms of computation results (output). To that extent, *exp-log* also represents a language implementing [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm.

[Production rules](https://en.wikipedia.org/wiki/Production_(computer_science)), as *exp-log* constituents, mediate between source and target expressions. Appearance of source and target expressions is defined by custom input and output syntax production rules. These rules are then linked by custom semantic production rules, rendering the production system whole capable of translating between input and output expressions. This translation has important property of being [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), which means we can potentially construct *any* output from *any* input, supporting *any* kind of meaningful computation process known to us.

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
        (RULE    top <<name> barks>)
        (RULE    top <<name> meows>)
        (RULE <name> ...           )

        // semantics
        (
            MATCH
            (ID (EQ <X> <name>))
            (RULESET (RULE <<X> barks> <<X> is a dog>))
        )
        (
            MATCH
            (ID (EQ <X> <name>))
            (RULESET (RULE <<X> meows> <<X> is a cat>))
        )

        // output syntax
        (RULE               ... <name>)
        (RULE <<name> is a dog> bot   )
        (RULE <<name> is a cat> bot   )
    )

Feeding an input `Nora meows` to the above ruleset should yield the output `Nora is a cat`, while feeding `Milo barks` should yield `Milo is a dog`.

What is really happening is that we follow a inference line from any of the starting `top` expressions to the input expression. Then we continue the same line from the input expression to any of the ending `bot` expressions. If such a inference line exists, our output is then represented by a whole of continuous left side sequence closest to the ending expression.

## current status

A lot of research is invested in creation of *exp-log*, and it is still under construction. During its creation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration (curious readers may want to skim over historical documents explaining [logos](history/aug-2019-logos.md) and [expression logic](history/aug-2021-expression-logic.md) iterations). The most recent iteration [draft document](exp-log.md) is in preparation phase.

*exp-log* bases its functionality on a novel *v-parse* algorithm. The algorithm creation is divided into three successive iterations, each being a superset of the previous one. This is the current project roadmap with *finished* marks:

1. [ ] v-parse-crux algorithm (context free grammar parsing algorithm)
2. [ ] v-parse-plus algorithm (term rewriting extension)
3. [ ] v-parse-star algorithm (logic programming extension)

If one is interested in details about the current project iteration exposure, there are two partial resources to check out:

- [a draft document explaining v-parse algorithm (under construction)](v-parse-algorithm.md)
- [online interpreter for exp-log (context free grammar algorithm phase)](https://contrast-zone.github.io/exp-log/playground)
