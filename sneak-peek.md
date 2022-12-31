# sneak peek to source code appearance

## 1. tricosm

- gradually typed metalanguage in three degrees

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

