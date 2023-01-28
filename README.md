```
// work in progress //
```
<p align="center">
    <img width="50%" src="media/systemath-promo.svg"/>
</p>

```
project status:
    [ ] alpha conception
        [x] theorizing
        [ ] programming
            [x] parsing input s-exprs
            [x] pattern matching with basic input (extensional reasoning)
            [ ] nondeterministic reasoning
            [ ] pairing input to output
            [ ] nested scoping
            [ ] variables support (intensional reasoning)
            [ ] finalizing tasks and packaging executables
    [ ] beta testing and revising code
    [ ] gamma release
```

Check out the current code performing at [online playground](https://systemath.github.io/systemath-core/playground/).

# Systemath

_**tags:** metacompiling, expression synthesis, automated theorem proving_

## table of contents

- [1. about systemath](#1-about-systemath)
- [2. how does it work?](#2-how-does-it-work)
- [3. project specifics](#3-project-specifics)
- [4. work done so far](#4-work-done-so-far)
- [5. future plans](#5-future-plans)

## 1. about systemath

*Systemath* is a tool for transforming any [s-expr](https://en.wikipedia.org/wiki/S-expression) input to any s-expr output using its own [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) as a [rule-based system](https://en.wikipedia.org/wiki/Rule-based_system). *Systemath* may be used for a wide range of computing tasks, but its main intentions are to support [metacompiling](https://en.wikipedia.org/wiki/Compiler-compiler), [program synthesis](https://en.wikipedia.org/wiki/Program_synthesis), and [automated theorem proving](https://en.wikipedia.org/wiki/Automated_theorem_proving).

## 2. how does it work?

In *systemath*, we provide three sets of rules: one for input, one for output, and one for chaining between them. Input rule set branches from the source constant forwards to *concrete input*. Output rule set branches from the target constant backwards to *abstract output*. Chaining rules that branch between input and output. If there exist a provable chaining connection between input and output then *concrete output* is back-propagated from the concrete input.

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

This is a symmetrical process, meaning that like we can ask what is an output of a certain input, we can also ask what input yields a certain output. Answering these questions utilize graph rewriting processes called forward and backward chaining, respectively.

## 3. project specifics

*Systemath* takes an input file, an arbitrary metaprogram, and constructs an output file from the input file using the metaprogram. The metaprogram is actually a set of formulas similar to those in mathematics with the difference that the *systemath* formulas may transform not only math expressions, but also any kind of s-exprs.

To get a glimpse on how a *systemath* metaprogram looks like, here's a quick example:

```
/*
    Systemath cat/dog decision example
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
        (EQUAL (input (hearing meows)) (output (being cat)))
        (EQUAL (input (hearing barks)) (output (being dog)))
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

A lot of research is invested in conceptualisation of *systemath*, and it is still heavily under construction. During its conceptualisation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Curious readers may want to skim over [historical documents directory](https://github.com/systemath/systemath-core/tree/master/history) that collect the successive iterations.

The current iteration is explained in actual [working draft](draft/systemath.md), and its implementation is [in progress](https://systemath.github.io/systemath-core/playground/). Expect updates to working draft during implementation phase.

Related to *systemath*, various experiments in Javascript were conducted with term rewriting concepts, finally achieving some promising results. Please refer to [Rewrite.js](https://github.com/contrast-zone/rewrite.js) project for more information about the latest experiment.

## 5. future plans

We are continuing our efforts to actively work on *systemath*, hoping to get closer to actual implementation.

```
// work in progress //
```

