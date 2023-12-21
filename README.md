```
// work in progress //
```

# reasoner.js

_**tags:** type system, term graph rewriting, production rules, automated reasoning_

```
project status:
    [ ] alpha conception
        [x] theorizing
        [ ] implementing
            [x] main loop recognizing unrestricted grammars
            [x] variables substitution (to do: [x] unbound variables; [ ] bidirectional unification)
            [x] gradual typing (to do: [ ] deep rules; [ ] deep variables)
            [ ] non-deterministic sequent matching ([ ] `READ` side; [ ] `WRITE` side)
            [ ] optional `atom` and mandatory `cons` and `list` constructors
            [ ] error messages
            [ ] stress test
    [ ] beta testing and revising code
    [ ] gamma release
```

Check out the current code performing at [online playground](https://contrast-zone.github.io/reasoner.js/playground/).

## table of contents

- [1. project specifics](#1-project-specifics)
- [2. work done so far](#2-work-done-so-far)
- [3. future plans](#3-future-plans)

## 1. project specifics

*reasoner.js* is a [term graph rewriting](https://en.wikipedia.org/wiki/Graph_rewriting#Term_graph_rewriting) tool for transforming any input [s-expr](https://en.wikipedia.org/wiki/S-expression) to any output s-expr using its own [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) as a [rule-based system](https://en.wikipedia.org/wiki/Rule-based_system). Main intention of *reasoner.js* is to support [automated reasoning](https://en.wikipedia.org/wiki/Automated_reasoning).

*reasoner.js* code represents a metaprogram that is actually a set of formulas performing similar to those in mathematics with the difference that the *reasoner.js* formulas may transform not only math expressions, but also any kinds of s-exprs.

To get a glimpse on how a *reasoner.js* metaprogram looks like, here's a quick example:

```
(
    RULE
    (
        READ
        
        (RULE (READ) (WRITE (goes <name> <voice>)))
        
        (RULE (READ <name> ) (WRITE Milo))
        (RULE (READ <name> ) (WRITE Nora))
        (RULE (READ <voice>) (WRITE bark))
        (RULE (READ <voice>) (WRITE meow))
    )
    (
        CHAIN
        
        (
            MATCH
            (VAR <X>)
            (RULE (READ (goes <X> meow)) (WRITE (isA <X> cat)))
        )
        
        (
            MATCH
            (VAR <X>)
            (RULE (READ (goes <X> bark)) (WRITE (isA <X> dog)))
        )
    )
    (
        WRITE
        
        (RULE (READ Milo) (WRITE <name>  ))
        (RULE (READ Nora) (WRITE <name>  ))
        (RULE (READ cat ) (WRITE <living>))
        (RULE (READ dog ) (WRITE <living>))
        
        (RULE (READ (isA <name> <living>)) (WRITE))
    )
)
```

This program does the following:

- feeding an input containing `(goes Nora meow)` or `(goes Milo meow)` writes an output containing `(isA Nora cat)` or `(isA Milo cat)`
- feeding an input containing `(goes Nora bark)` or `(goes Milo bark)` writes an output containing `(isA Nora dog)` or `(isA Milo dog)`
- feeding any other input yields an error message

## 2. work done so far

A lot of research is invested in conceptualisation of *reasoner.js*, and it is still heavily under construction. During its conceptualisation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Curious readers may want to skim over [historical documents directory](https://github.com/mind-child/reasoner.js/tree/master/history) that collect the successive iterations.

The current iteration is explained in actual [working draft](draft/reasoner.md), and its [implementation](https://contrast-zone.github.io/reasoner.js/playground/) is in progress. Expect considerable updates to working draft during the implementation phase.

Related to *reasoner.js*, various experiments in Javascript were conducted with term rewriting concepts, finally achieving some promising results. Please refer to [rewrite.js repository](https://github.com/contrast-zone/rewrite.js) for more information about the latest experiment.

## 3. future plans

We are continuing our efforts to actively work on *reasoner.js*, hoping to get closer to minimum viable product.

```
// work in progress //
```

