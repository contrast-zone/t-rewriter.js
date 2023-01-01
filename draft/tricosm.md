    // work in progress //

# tricosm three levels of typing

Tricosm metalanguage is a [gradually typed](https://en.wikipedia.org/wiki/Gradual_typing) language with implicit support for [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type). Gradual typing means that we may, or may not use types in constructing metaprograms.

Tricosm uses a kind of typing other than widely used functional kind. To be clear, types still represent a form of data expected to be met at certain positions in code. But Tricosm types resemble a possibility of reaching expected s-exprs from starting s-expr by graph rewriting methods.

Tricosm distincts between three levels of typing, varying on input and output type assignments. The three levels are depicted by the following table:

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
.   1. chaos    .   untyped   .   untyped   . 
.               .             .             .
.   2. canon    .   typed     .   untyped   . 
.               .             .             .
.   3. logos    .   typed     .   typed     .
.               .             .             .
. . . . . . . . . . . . . . . . . . . . . . .
```

All three typing levels support [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) computation, meaning whatever we can compute using one typing level, we can compute using any other typing level and vice versa. Even though moving from lower to higher typing level introduces the metalanguage complexity, that ensures proper reporting of unintentional programming errors, which is a very desirable property of a programming language. Also, the highest typing level may even reduce computation search space for results, and may gain a significant computation time reduction.

To compare more closely all tree levels of typing, let's consider the famous [Curry-Howard correspondence](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence) which states that constructing a proof corresponds to constructing a program. A proof is a way to construct conclusion from assumptions using theorems while a program is a way to construct output from input using code statements/instructions. In this way, everything we say about proofs applies also to programs.

Categorizing Tricosm typing levels, we get these level descriptions:
1. chaos
    - here we don't predict a type of input nor output
    - chaos may be used for unguided theorem proving by manual construction, not reporting input errors when incorrectly applying theorems
2. canon
    - here we predict a type of input, but a type of output is unknown
    - canon may be used for guided theorem proving by manual construction, reporting input errors when incorrectly applying theorems
3. logos
    - here we predict a type of input and output
    - logos may be used for automated theorem proving, possibly reporting entire proofs as algorithms for abstract transforming input to output

## 1. chaos

- if we don't predict a type of input nor output, then the output has access to input s-expr fragments by using the dot operator.

```
(COMMENT tricosm chaos example: cat/dog decision example)

(
    CHAOS-RULE
    (
        READ
    )
    (
        WRITE (
            switch
            .input.hearing
            (
                (case barks (output (being dog))
                (case meows (output (being cat))
                (case else UNDEFINED)
            )
        )
    )
)
```

- input `(input (hearing meows))` yields output `(output (being cat))`
- input `(input (hearing barks))` yields output `(output (being dog))`
- any other input yields `UNDEFINED`

## 2. canon

- if we predict a type of input, but a type of output is unknown, then the output still has access to input s-expr fragments by using the dot operator.

```
(COMMENT tricosm canon example: cat/dog decision example)

(
    CANON-RULE
    (
        READ
        (CHAOS-RULE (READ      ) (WRITE (input (hearing (voice)))))
        (CANON-RULE (READ voice) (WRITE barks meows              ))
    )
    (
        WRITE (
            switch
            .input.hearing
            (
                (case barks (output (being dog))
                (case meows (output (being cat))
            )
        )
    )
)
```

- input `(input (hearing meows))` yields output `(output (being cat))`
- input `(input (hearing barks))` yields output `(output (being dog))`
- any other input yields an error message

## 3. logos

- if we predict a type of input and output, then we can make a proper chaining between them.

```
(COMMENT Tricosm cat/dog decision example)

(
    LOGOS-RULE
    (
        READ
        (CHAOS-RULE (READ      ) (WRITE (input (hearing (voice)))))
        (CANON-RULE (READ voice) (WRITE barks meows              ))
    )
    (
        CHAIN
        (CANON-RULE (WRITE (input (hearing meows))) (READ (output (being cat))))
        (CANON-RULE (WRITE (input (hearing barks))) (READ (output (being dog))))
    )
    (
        WRITE
        (CANON-RULE (WRITE                   cat dog) (READ living))
        (CHAOS-RULE (WRITE (output (being (living)))) (READ       ))
    )
)
```

- input `(input (hearing meows))` yields output `(output (being cat))`
- input `(input (hearing barks))` yields output `(output (being dog))`
- any other input yields an error message

    // work in progress //

