```
// work in progress //
```

# t-rewriter.js

_**tags:** type system, term graph rewriting, production rules, automated reasoning_

```
project status:
    [ ] alpha conception
        [x] theorizing
        [ ] implementing
            [x] main loop
            [x] variables substitution
            [ ] types (to do: [ ] deep rules; [ ] deep variables)
            [ ] error messages
            [ ] stress test
    [ ] beta testing and revising code
    [ ] gamma release
```

Check out the current code performing at [online playground](https://contrast-zone.github.io/t-rewriter.js/playground/).

## table of contents

- [1. project specifics](#1-project-specifics)
- [2. work done so far](#2-work-done-so-far)
- [3. future plans](#3-future-plans)

## 1. project specifics

*t-rewriter.js* is a [term graph rewriting](https://en.wikipedia.org/wiki/Graph_rewriting#Term_graph_rewriting) tool for transforming any input [s-expr](https://en.wikipedia.org/wiki/S-expression) to any output s-expr using a [rule-based system](https://en.wikipedia.org/wiki/Rule-based_system). The main intention of *t-rewriter.js* is to support [automated reasoning](https://en.wikipedia.org/wiki/Automated_reasoning).

*t-rewriter.js* code represents a program that is actually a set of formulas performing similar to those in mathematics with the difference that the *t-rewriter.js* formulas may transform not only math expressions, but also any kinds of s-exprs.

To get a glimpse on how a *t-rewriter.js* program looks like, here's a quick example:

```
(
    RULE
    (
        READ
        
        (RULE (READ) (WRITE {goes [name] [voice]}))
        
        (RULE (READ [name] ) (WRITE Milo))
        (RULE (READ [name] ) (WRITE Nora))
        (RULE (READ [voice]) (WRITE bark))
        (RULE (READ [voice]) (WRITE meow))
    )
    (
        CHAIN
        
        (
            MATCH
            (VAR <X>)
            (RULE (READ {goes <X> meow}) (WRITE {isA <X> cat}))
        )
        
        (
            MATCH
            (VAR <X>)
            (RULE (READ {goes <X> bark}) (WRITE {isA <X> dog}))
        )
    )
    (
        WRITE
        
        (RULE (READ Milo) (WRITE [name]  ))
        (RULE (READ Nora) (WRITE [name]  ))
        (RULE (READ cat ) (WRITE [living]))
        (RULE (READ dog ) (WRITE [living]))
        
        (RULE (READ {isA [name] [living]}) (WRITE))
    )
)
```

This program does the following:

- reading an input containing `{goes Nora meow}` or `{goes Milo meow}` writes an output containing `{isA Nora cat}` or `{isA Milo cat}`
- reading an input containing `{goes Nora bark}` or `{goes Milo bark}` writes an output containing `{isA Nora dog}` or `{isA Milo dog}`
- reading any other input yields an error message

## 2. work done so far

A lot of research is invested in conceptualisation of *t-rewriter.js*, and it is still heavily under construction. During its conceptualisation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Curious readers may want to skim over [historical documents directory](https://github.com/mind-child/t-rewriter.js/tree/master/history) that collect the successive iterations.

The current iteration is explained in actual [working draft](draft/reasoner.md), and its [implementation](https://contrast-zone.github.io/t-rewriter.js/playground/) is in progress. Expect considerable updates to working draft during the implementation phase.

Related to *t-rewriter.js*, various experiments in Javascript were conducted with term rewriting concepts, finally achieving some promising results. Please refer to [rewrite.js repository](https://github.com/contrast-zone/rewrite.js) for more information about the latest experiment.

## 3. future plans

*t-rewriter.js* is an experimental platform used for conceptual testing of term graph rewriting. Positive results of this experiment would place foundations for the future programming framework whose purpose would be building artificial intelligence. We are continuing our efforts to actively work on *t-rewriter.js*, hoping to get closer to the planned programming framework.

```
// work in progress //
```

