```
// work in progress //
```
<p align="center">
    <img width="50%" src="media/co-rewrite-promo.svg"/>
</p>

```
project status:
    [ ] alpha conception
        [x] theorizing
        [ ] implementing
            [x] parsing input s-exprs
            [x] extensional reasoning
                [x] pattern matching involving write side disjunctions
                [x] non-deterministic matching involving read side conjunctions
                [x] pairing input to output
            [ ] intensional reasoning
                [ ] variables support
            [ ] nested rules
            [ ] finalizing tasks
                [ ] sane error messages
                [ ] packaging executables
    [ ] beta testing and revising code
    [ ] gamma release
```

Check out the current code performing at [online playground](https://contrast-zone.github.io/co-rewrite/playground/).

# Co-rewrite

_**tags:** metacompiling, program synthesis, automated logical reasoning_

## table of contents

- [1. about co-rewrite](#1-about-co-rewrite)
- [2. how does it work?](#2-how-does-it-work)
- [3. project specifics](#3-project-specifics)
- [4. work done so far](#4-work-done-so-far)
- [5. future plans](#5-future-plans)

## 1. about co-rewrite

*Co-rewrite* is a [term graph rewriting](https://en.wikipedia.org/wiki/Graph_rewriting#Term_graph_rewriting) tool for transforming any [s-expr](https://en.wikipedia.org/wiki/S-expression) input to any s-expr output using its own [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) as a [rule-based system](https://en.wikipedia.org/wiki/Rule-based_system). *Co-rewrite* may be used for a wide range of computing tasks, but its main intentions are to support [metacompiling](https://en.wikipedia.org/wiki/Compiler-compiler), [program synthesis](https://en.wikipedia.org/wiki/Program_synthesis), and [automated logical reasoning](https://en.wikipedia.org/wiki/Automated_reasoning).

## 2. how does it work?

*Co-rewrite* utilizes term graph rewriting process based on implicative and its dual, co-implicative rewriting. As implicative rewriting may yield a combinatorial explosion, we perform it in combination with co-implicative rewriting, thus reducing the search space in may cases. Combination of implicative and co-implicative rewriting also often avoids unnecessary infinite loops, automatically deliberating us from explicit recursion control in many situations.

In *co-rewrite*, we provide three sets of rules: one for input, one for output, and one for chaining between them. Input rule set branches from the source constant forwards to *concrete input*. Output rule set branches from the target constant backwards to *abstract output*. Chaining rules branch between input and output. If there exist a provable chaining connection between input and output then *concrete output* is back-propagated from the concrete input.

```
        source
          /\
        /\/\/\
      /  INPUT \
    /\/\/\/\/\/\/\
         CHAIN    
    \/\/\/\/\/\/\/
      \ OUTPUT /
        \/\/\/
          \/
        target
```

This is a symmetrical process, meaning that like we can ask what is an output of certain input, we can also ask what input yields certain output. Answering these questions utilizes processes called forward and backward chaining, respectively.

## 3. project specifics

*Co-rewrite* takes an input file, an arbitrary metaprogram, and constructs an output file from the input file using the metaprogram. The metaprogram is actually a set of formulas similar to those in mathematics with the difference that the *co-rewrite* formulas may transform not only math expressions, but also any kind of s-exprs.

To get a glimpse on how a *co-rewrite* metaprogram looks like, here's a quick example:

```
/*
    Co-rewrite cat/dog decision example
*/

(
    RULE
    (
        READ
        (RULE (READ      ) (WRITE (input (hearing voice))))
        (RULE (READ voice) (WRITE barks meows            ))
    )
    (
        CHAIN
        (EQUAL (LEFT (input (hearing meows))) (RIGHT (output (being cat))))
        (EQUAL (LEFT (input (hearing barks))) (RIGHT (output (being dog))))
    )
    (
        WRITE
        (RULE (WRITE                 cat dog) (READ living))
        (RULE (WRITE (output (being living))) (READ       ))
    )
)
```

This metaprogram does the following:

- feeding an input file containing `(input (hearing meows))` writes an output file containing `(output (being cat))`
- feeding an input file containing `(input (hearing barks))` writes an output file containing `(output (being dog))`
- feeding any other input yields an error message

## 4. work done so far

A lot of research is invested in conceptualisation of *co-rewrite*, and it is still heavily under construction. During its conceptualisation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Curious readers may want to skim over [historical documents directory](https://github.com/co-rewrite/co-rewrite-core/tree/master/history) that collect the successive iterations.

The current iteration is explained in actual [working draft](draft/systemath.md), and its implementation is [in progress](https://contrast-zone.github.io/co-rewrite/playground/). Expect updates to working draft during implementation phase.

Related to *co-rewrite*, various experiments in Javascript were conducted with term rewriting concepts, finally achieving some promising results. Please refer to [Rewrite.js](https://github.com/contrast-zone/rewrite.js) project for more information about the latest experiment.

## 5. future plans

We are continuing our efforts to actively work on *co-rewrite*, hoping to get closer to its actual implementation.

```
// work in progress //
```

