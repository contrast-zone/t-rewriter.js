
# exper

    // under construction - merely a partial implementation //

## about the project

As an embodiment of general problem solving strategy related to [term rewriting](https://en.wikipedia.org/wiki/Rewriting), *exper* aims to be a host for a variety of kinds of [formal languages](https://en.wikipedia.org/wiki/Formal_language), exhibiting [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system). For each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) in a [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm. Having clearly defined communication input and output forms, *exper* performs transition from input to output by additionally defining possibly [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) set of chaining [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)). This sort of arrangement also sheds light on *exper* from an angle of [systems](https://en.wikipedia.org/wiki/System) theory, thus broadening a possible range of use cases.

## expected appearance

To get a glimpse of how *(once it is finished)* interfacing with *exper* would look like, we bring the following ruleset:

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
                MATCH
                (IDENTIFY (IDTYPE <X> <name>))
                (
                    ELEMENTARY
                    <<X> barks>
                    <<X> is a dog>
                )
            )
            (
                MATCH
                (IDENTIFY (IDTYPE <X> <name>))
                (
                    ELEMENTARY
                    <<X> meows>
                    <<X> is a cat>
                )
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

What is really happening is that we try to parse an input string using rules from `INPUT` section in a forward direction. Then we try to parse the same input string using rules from `CHAIN` and `OUTPUT` sections in a backward direction. If everything goes well, our output then represents the first deepest parsing excerpt consisted only of `OUTPUT` rules.

## current status

A lot of research is invested in creation of *exper*, and it is still under construction. During its creation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration (curious readers may want to skim over historical documents explaining [logos](history/aug-2019-logos.md) and [expression logic](history/aug-2021-expression-logic.md) iterations). The most recent iteration [intermezzo](intermezzo.md) draft document is in preparation phase.

*Exper* bases its functionality on a novel *v-parse-cfg* algorithm. The exper creation is divided into three successive iterations, each being a superset of the previous one. Additional, fourth iteration deals with input-chain-output treatment. This is the current project roadmap with *finished* marks:

1. [ ] v-parse-crux algorithm (elementary terms)
2. [ ] v-parse-plus algorithm (composite terms)
3. [ ] v-parse-star algorithm (term matching)
4. [ ] input-chain-output connection

If one is interested in details about the current project iteration exposure, there are two partial resources to check out:

- [a draft document explaining v-parse-cfg algorithm](v-parse-cfg.md)
- [online testing environment for v-parse-cfg algorithm](https://contrast-zone.github.io/exper/playground)

