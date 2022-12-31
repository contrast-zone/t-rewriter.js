    // work in progress //

# three levels of typing in tricosm

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
.   1. chaos    .   untyped   .   untyped   . 
.               .             .             .
.   2. canon    .   typed     .   untyped   . 
.               .             .             .
.   3. logos    .   typed     .   typed     .
.               .             .             .
. . . . . . . . . . . . . . . . . . . . . . .
```

All three typing levels are [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), meaning whatever we can do with types, we can do it without types and vice versa. Depending on a typing level, introduction of types introduces the metalanguage complexity, but it ensures absence of unintentional programming errors, which is a very desirable property of a programming language. Also, comparing the highest to lower typing levels, using types may even reduce computation search space for results, and may gain a significant computation time reduction.

To compare more closely the tree levels of typing, let's consider the famous [Curry-Howard correspondence](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence) which states that constructing a proof correspond to constructing a program. In this way, everything we say about proofs applies to programs, also.

Tricosm typing levels:
1. chaos
    - here we don't predict a type of input nor output
    - chaos may be used for unguided theorem proving by manual construction, not reporting input errors when incorrectly applying theorems
2. canon
    - here we predict a type of input, but a type of output is unknown
    - canon may be used for guided theorem proving by manual construction, reporting input errors when incorrectly applying theorems
3. logos
    - here we predict a type of input and output
    - logos may be used for automated theorem proving, possibly reporting entire proofs as algorithms for abstract transforming input to output

Intentionally scarce document exposing the three typing levels compaison examples is [here](sneak-peek.md).

---

# sneak peek to source code appearance

## 1. tricosm

- gradually typed metalanguage in three degrees

### 1.1. chaos

- we don't predict a type of input nor output; output has access to input s-expr fragments.

```
/*
    dog/cat decision example, chaos degree
    
     input: `(input (name *subject*) (voice barks/meows))`
    output: `(output (isADog/isACat *subject*))`
*/

(
    CHAOS-RULE
    (
        READ input
    )
    (
        WRITE (
            switch
            input.voice
            (
                (case barks (output (isADog input.name))
                (case meows (output (isACat input.name))
                (case else UNDEFINED)
            )
        )
    )
)
```

still:

- `(input (name Nora) (voice meows))` yields `(output (isACat *Nora*))`
- `(input (name Milo) (voice barks))` yields `(output (isADog *Milo*))`

### 1.2. canon

- we predict a type of input, but a type of output is unknown; output still has access to input s-expr fragments.

```
/*
    dog/cat decision example, canon degree
    
     input: `(input (name *subject*) (voice barks/meows))`
    output: `(output (isADog/isACat *subject*))`
*/

(
    CANON-RULE
    (
        READ
        (CHAOS-RULE (READ       ) (WRITE (input (name named) (voice voiced)))) 
        (CHAOS-RULE (READ  named) (WRITE /[A-Za-z]+/                        ))
        (CHAOS-RULE (READ voiced) (WRITE barks meows                        ))
    )
    (
        WRITE (
            switch
            input.voice
            (
                (case barks (output (isADog input.name))
                (case meows (output (isACat input.name))
                (case else UNDEFINED)
            )
        )
    )
)
```

still:

- `(input (name Nora) (voice meows))` yields `(output (isACat *Nora*))`
- `(input (name Milo) (voice barks))` yields `(output (isADog *Milo*))`

### 1.3. logos

- we predict a type of input and output; now we can do a proper chaining between them.

```
/*
    dog/cat decision example, logos degree
    
     input: `(input (name *subject*) (voice barks/meows))`
    output: `(output (isADog/isACat *subject*))`
*/

(
    LOGOS-RULE
    (
        READ
        (CHAOS-RULE (READ       ) (WRITE (input (name named) (voice voiced)))) 
        (CHAOS-RULE (READ  named) (WRITE /[A-Za-z]+/                        ))
        (CHAOS-RULE (READ voiced) (WRITE barks meows                        ))
    )
    (
        CHAIN
        (
            MATCH
            (VAR <X> /[A-Za-z]+/)
            (
                CHAOS-RULE 
                (WRITE (input (name <X>) (voice barks)))
                (READ  (output (isADog <X>)))
            )
        )
        (
            MATCH
            (VAR <X> /[A-Za-z]+/)
            (
                CHAOS-RULE 
                (WRITE (input (name <X>) (voice meows)))
                (READ  (output (isACat <X>)))
            )
        )
    )
    (
        WRITE
        (
            (CHAOS-RULE (WRITE                                     /[A-Za-z]+/) (READ named))
            (CHAOS-RULE (WRITE (output (isADog named)) (output (isACat named))) (READ      ))
        )
    )
)
```

still:

- `(input (name Nora) (voice meows))` yields `(output (isACat *Nora*))`
- `(input (name Milo) (voice barks))` yields `(output (isADog *Milo*))`

    // work in progress //

