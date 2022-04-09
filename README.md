# canon

    // under construction //

## about the project

As an embodiment of general problem solving strategy related to [term rewriting](https://en.wikipedia.org/wiki/Rewriting), *canon* aims to be a host for a variety of kinds of [formal languages](https://en.wikipedia.org/wiki/Formal_language), exhibiting [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system). For each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) in a [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm. Having clearly defined communication input and output forms, *canon* performs transition from input to output by additionally defining possibly [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) set of chaining [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)). This sort of arrangement also sheds light on *canon* from an angle of [systems](https://en.wikipedia.org/wiki/System) theory, thus broadening a possible range of use cases.

## expected appearance

To get a glimpse of how *(once it is finished)* interfacing with *canon* would look like, we bring the following ruleset:

    /*
        dog/cat decision example
        
         input: `*subject* barks/meows`
        output: `*subject* is a dog/cat`
    */
    
    (
        RULE
        (
            BACK
            (RULE (BACK       ) (FORE <<name> barks> <<name> meows>))
            (RULE (BACK <name>) (FORE <...>                        ))
            ...
        )
        (
            RULE
            (BACK)
            (
                FORE
                (
                    MATCH
                    (ID <X> <name>)
                    (RULE (FORE <<X> barks>) (BACK <<X> is a dog>))
                )
                (
                    MATCH
                    (ID <X> <name>)
                    (RULE (FORE <<X> meows>) (BACK <<X> is a cat>))
                )
            )
        )
        (
            FORE
            ...
            (RULE (FORE                               <...>) (BACK <name>))
            (RULE (FORE <<name> is a dog> <<name> is a cat>) (BACK       ))
        )
    )
    
Feeding an input `Nora meows` to the above ruleset should yield the output `Nora is a cat`, while feeding `Milo barks` should yield `Milo is a dog`.

What is really happening is that we try to parse an input string using rules from `INPUT` section of `COMPOSITE` rule in a forward direction. Then we try to parse the same input string using rules from `CHAIN` and `OUTPUT` sections of `COMPOSITE` rule in a backward direction. If everything goes well, our output then represents the first deepest parsing excerpt consisted only of rules in `OUTPUT` section of `COMPOSITE` rule.

## current status

A lot of research is invested in creation of *canon*, and it is still under construction. During its creation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration (curious readers may want to skim over historical documents explaining [logos](history/2019-aug-logos.md), [exp-log](history/2021-aug-exp-log.md), and [exp-flow](history/2022-apr-exp-flow.md) iterations). The most recent iteration [canon](canon.md) draft document is in preparation phase.

*Canon* will base its functionality on a [novel *v-parse-cfg* algorithm](https://github.com/contrast-zone/v-parse-cfg). The *canon* creation is divided into three successive iterations dealing with term rewriting rules, each being a superset of the previous one. Additional, fourth iteration deals with semantic rhombus interpretation. Here is the current project roadmap with *finished* marks:

1. [ ] v-parse-crux algorithm (elementary terms interpretation)
2. [ ] v-parse-plus algorithm (composite terms interpretation)
3. [ ] v-parse-star algorithm (term matching interpretation)
4. [ ] forward-chain-backward connection (semantic rhombus interpretation)

If one is interested in details about the preparation for project development, there are some partial resources to check out:

    // under construction //
