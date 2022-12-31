<p align="center">
   <img src="media/7logo-192.png"/>
</p>

    // work in progress - theorizing //

# Tricosm

Tricosm is a tool for transforming any [s-expr](https://en.wikipedia.org/wiki/S-expression) input to any s-expr output using its own [metalanguage](https://en.wikipedia.org/wiki/Metalanguage). As s-expr is a format capable of holding any data, Tricosm belongs to a category of data processing tools. Tricosm may be used for a wide range of programming tasks, but its main intention is to support [theorem proving](https://en.wikipedia.org/wiki/Automated_theorem_proving), [program synthesis](https://en.wikipedia.org/wiki/Program_synthesis), and [metacompiling](https://en.wikipedia.org/wiki/Compiler-compiler).

## 1. project specifics

Tricosm is a system that takes an input file, an arbitrary metaprogram, and constructs an output file from the input file using the metaprogram. The metaprogram is actually a set of formulas similar to those in math science with the differnce that the Tricosm formulas may transform not only math expressions, but also any kind of s-exprs.


## 2. three levels of typing in tricosm

Tricosm metalanguage is a [gradually typed](https://en.wikipedia.org/wiki/Gradual_typing) language with support for [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type). Gradual typing means that we may, or may not use types in constructing metaprograms. From algebraic data types, Tricosm reproduces sums and products.

Tricosm distincts three levels of typing, varying on input and output type assignments. The three levels are depicted by the following table:

```
. . . . . . . . . . . . . . . . . . . . . . .
.                                           .
.          tricosm levels of typing         .
.                                           .
. . . . . . . . . . . . . . . . . . . . . . .
.               .             .             .
.   level       .   input     .   output    . 
.               .             .             .
. . . . . . . . . . . . . . . . . . . . . . . 
.               .             .             .
.   0. chaos    .   untyped   .   untyped   . 
.               .             .             .
.   1. canon    .   typed     .   untyped   . 
.               .             .             .
.   2. logos    .   typed     .   typed     .
.               .             .             .
. . . . . . . . . . . . . . . . . . . . . . .
```

All three typing levels are [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), meaning whatever we can do with types, we can do it without types and vice versa. Depending on a typing level, introduction of types introduces the metalanguage complexity, but it ensures absence of unintentional programming errors, which is a very desirable property of a programming language. Also, comparing the highest to lower typing levels, using types may even reduce computation search space for results, and may gain a significant computation time reduction.

To compare more closely the tree levels of typing, let's consider the famous [Curry-Howard correspondence](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence) which states that constructing a proof correspond to constructing a program. In this way, everything we say about proofs applies to programs, also.

Tricosm typing levels:
0. chaos
    - here we don't predict a type of input nor output
    - chaos may be used for unguided theorem proving by manual construction, not reporting input errors when incorrectly applying theorems
1. canon
    - here we predict a type of input, but a type of output is unknown
    - canon may be used for guided theorem proving by manual construction, reporting input errors when incorrectly applying theorems
2. logos
    - here we predict a type of input and output
    - logos may be used for automated theorem proving, possibly reporting entire proofs as algorithms for abstract transforming input to output

Intentionally scarce document exposing the three typing levels compaison examples is [here](sneak-peek.md).

## 3. work done so far

A lot of research is invested in conceptualisation of Tricosm, and it is still heavily under construction. During its conceptualisation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Curious readers may want to skim over [historical documents directory](https://github.com/tricosm/tricosm/tree/master/history) that theorize about successive iterations (notice that we recycled some names for parts of the latest Tricosm iteration). The most recent iteration draft document is in preparation phase and it is basically only a syntax sugar over the [latest historical iteration](https://github.com/tricosm/tricosm/blob/master/history/2022-apr-latest-canon.md) representing logos, with addition of two lower level typing systems.

Related to Tricosm, various experiments in Javascript were conducted with term rewriting concepts, achieving some promising results. Please refer to [Rewrite.js](https://github.com/contrast-zone/rewrite.js) project for more information about the latest experiment.

## 4. future plans

We are continuing to actively work on Tricosm, hoping to get closer to actual implementation.

    // work in progress - theorizing //
