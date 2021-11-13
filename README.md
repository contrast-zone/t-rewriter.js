# exp-log

    // under construction - merely a partial implementation //

## about the project

As an embodiment of general problem solving strategy related to [term rewriting](https://en.wikipedia.org/wiki/Rewriting), *exp-log* aims to be a host for a variety of kinds of [formal languages](https://en.wikipedia.org/wiki/Formal_language). For each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) in a [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm. Having clearly defined communication input and output forms, *exp-log* performs transition from input to output by additionally defining possibly [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) set of chaining [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)). This sort of arrangement also sheds light on *exp-log* from an angle of [systems](https://en.wikipedia.org/wiki/System) theory, thus broadening a possible range of use cases.

## expected appearance

To get a glimpse of how *(once it is finished)* interfacing with *exp-log* would look like, we bring the following ruleset:

    /*
        dog/cat decision example
        
        input: `*subject* barks/meows`
        output: `*subject* is a dog/cat`
    */
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY    TOP <<name> barks>)
            (ELEMENTARY    TOP <<name> meows>)
            (ELEMENTARY <name> <...>         )
            ...
        )
        (
            CHAIN
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <name>))
                (ELEMENTARY <<X> barks> <<X> is a dog>)
            )
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <name>))
                (ELEMENTARY <<X> meows> <<X> is a cat>)
            )
        )
        (
            OUTPUT
            ...
            (ELEMENTARY             <...> <name>)
            (ELEMENTARY <<name> is a dog> BOT   )
            (ELEMENTARY <<name> is a cat> BOT   )
        )
    )
    
Feeding an input `Nora meows` to the above ruleset should yield the output `Nora is a cat`, while feeding `Milo barks` should yield `Milo is a dog`.

What is really happening is that we try to parse input using rules from `INPUT` section in a forward direction. Then we try to parse the same input using rules from `CHAIN` and `OUTPUT` sections in a backward direction. If everything goes well, our output then represents the first deepest parsing excerpt consisted only of `OUTPUT` rules.

## current status

A lot of research is invested in creation of *exp-log*, and it is still under construction. During its creation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration (curious readers may want to skim over historical documents explaining [logos](history/aug-2019-logos.md) and [expression logic](history/aug-2021-expression-logic.md) iterations). The most recent iteration *exp-log* [draft document](sysop.md) is in preparation phase.

*exp-log* bases its functionality on a novel *v-parse* algorithm. The algorithm creation is divided into three successive iterations, each being a superset of the previous one. This is the current project roadmap with *finished* marks:

1. [ ] v-parse-crux algorithm (elementary terms)
2. [ ] v-parse-plus algorithm (composite terms)
3. [ ] v-parse-star algorithm (term equalization)

If one is interested in details about the current project iteration exposure, there are two partial resources to check out:

- [a draft document explaining v-parse algorithm (context free grammar algorithm phase)](v-parse-algorithm.md)
- [online interpreter for exp-log (context free grammar algorithm phase)](https://contrast-zone.github.io/exp-log/playground)
