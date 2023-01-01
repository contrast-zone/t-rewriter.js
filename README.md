    // work in progress - theorizing //

<p align="center">
    <img width="50%" src="media/7promo.svg"/>
</p>

# Tricosm

Tricosm is a tool for transforming any [s-expr](https://en.wikipedia.org/wiki/S-expression) input to any s-expr output using its own [metalanguage](https://en.wikipedia.org/wiki/Metalanguage). As s-expr is a format capable of holding any data, Tricosm belongs to a category of data processing tools. Tricosm may be used for a wide range of computing tasks, but its main intentions are to support [automated theorem proving](https://en.wikipedia.org/wiki/Automated_theorem_proving), [program synthesis](https://en.wikipedia.org/wiki/Program_synthesis), and [metacompiling](https://en.wikipedia.org/wiki/Compiler-compiler).

## 1. project specifics

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

## 2. work done so far

A lot of research is invested in conceptualisation of Tricosm, and it is still heavily under construction. During its conceptualisation journey, it has been an agile experimenting project, advancing its theoretical background with each iteration. Curious readers may want to skim over [historical documents directory](https://github.com/tricosm/tricosm/tree/master/history) that theorize about the successive iterations (notice that we recycled some names for parts of the latest Tricosm iteration).

The most recent iteration [draft document](draft/tricosm.md) is in preparation phase.

Related to Tricosm, various experiments in Javascript were conducted with term rewriting concepts, finally achieving some promising results. Please refer to [Rewrite.js](https://github.com/contrast-zone/rewrite.js) project for more information about the latest experiment.

## 3. future plans

We are continuing to actively work on Tricosm, hoping to get closer to actual implementation.

    // work in progress - theorizing //


