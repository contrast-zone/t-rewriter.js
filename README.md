    // work in progress - theorizing //

<p align="center">
    <img width="50%" src="media/7promo.svg"/>
</p>

# Tricosm

Tricosm is a tool for transforming any [s-expr](https://en.wikipedia.org/wiki/S-expression) input to any s-expr output using its own [metalanguage](https://en.wikipedia.org/wiki/Metalanguage). As s-expr is a format capable of holding any data, Tricosm belongs to a category of data processing tools. Tricosm may be used for a wide range of computing tasks, but its main intentions are to support [automated theorem proving](https://en.wikipedia.org/wiki/Automated_theorem_proving), [program synthesis](https://en.wikipedia.org/wiki/Program_synthesis), and [metacompiling](https://en.wikipedia.org/wiki/Compiler-compiler).

## 1. why tricosm?

With a latest rise of artificial neural network (ANN) implementations, it seems that it may represent a future of programming. Projects like GPT-X have shown a real value in everyday programming. Such projects are being trained, and they take input to produce output. Still, ANN-s seem to be untamed from the aspect of certainity of output relevance to input.

In a symbolic approach that Tricosm is taking to produce outputs from inputs, there is an analogy from ANN-s to Tricosm in which the training process is replaced by algorithm synthesis. It is possible to feed to Tricosm a formula in a form like `f (program (input) -> output) -> program` where function `program` is being constructed and returned by higher order function `f`. Advantages of this approach over training ANN-s may be significantly shorter learning time, as well as possibility of adjusting a percent of certainity up to 100% in constructing outputs.

Incidentally, Tricosm may support a processes in an impotrant area of computing: compiler construction (metacompiling). We hope that hobby language builders may find an interest to use Tricosm in their programming language experiments. Another area of computing that may benefit from Tricosm is theorem proving. We hope that also hobby researchers may find Tricosm an interesting tool in their work.

We are taking a stand that fields of using Tricosm is actually inexhaustible area, considering possible program synthesis, but the metacompiling and theorem proving ones seem to be reasonable application fields from an aspect of attracting actual users. If you have ideas about other reasonable applications, please join the Tricosm discussion area.

## 2. project specifics

Tricosm takes an input file, an arbitrary metaprogram, and constructs an output file from the input file using the metaprogram. The metaprogram is actually a set of formulas similar to those in math science with the difference that the Tricosm formulas may transform not only math expressions, but also any kind of s-exprs.

To get a glimpse on how a Tricosm metaprogram looks like, here's a quick example:

```
(COMMENT Tricosm cat/dog decision example)

(
    LOGOS-RULE
    (
        READ
        (CHAOS-RULE (READ      ) (WRITE (input (hearing voice))))
        (CANON-RULE (READ voice) (WRITE barks meows            ))
    )
    (
        CHAIN
        (CANON-RULE (WRITE (input (hearing meows))) (READ (output (being cat))))
        (CANON-RULE (WRITE (input (hearing barks))) (READ (output (being dog))))
    )
    (
        WRITE
        (CANON-RULE (WRITE                 cat dog) (READ living))
        (CHAOS-RULE (WRITE (output (being living))) (READ       ))
    )
)
```

This metaprogram does the following:

- feeding an input file containing `(input (hearing meows))` writes an output file containing `(output (being cat))`
- feeding an input file containing `(input (hearing barks))` writes an output file containing `(output (being dog))`
- feeding any other input yields an error message

## 3. work done so far

A lot of research is invested in conceptualisation of Tricosm, and it is still heavily under construction. During its conceptualisation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Curious readers may want to skim over [historical documents directory](https://github.com/tricosm/tricosm/tree/master/history) that theorize about the successive iterations (notice that we recycled some names for parts of the latest Tricosm iteration).

The most recent iteration [draft document](draft/tricosm.md) is in preparation phase.

Related to Tricosm, various experiments in Javascript were conducted with term rewriting concepts, finally achieving some promising results. Please refer to [Rewrite.js](https://github.com/contrast-zone/rewrite.js) project for more information about the latest experiment.

## 4. future plans

We are continuing our efforts to actively work on Tricosm, hoping to get closer to actual implementation.

    // work in progress - theorizing //
