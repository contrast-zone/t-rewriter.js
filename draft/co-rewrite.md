# 1. co-rewrite as restricted logic

- imperative programming is manual managing of states dynamics using discrete steps of computation represented by instructions to produce wanted states
- declarative programming abstracts from states using descriptions usually represented by rules to be repeatedly applied to parameters to produce results
    - common functional programming is equivalent to hilbert systems
    - common logic programming is equivalent to sequent calculi
- co-rewrite resembles logic programming

## 1.2. forming co-rewrite rules

- logic, what *is*, what *is not*, constructive proofs, proofs by contradiction
- a kind of restricted logic based on and, or, impl, nand, nor, nimpl
- using sequents as functions
- using sequents as types

```
  <top> := (RULE (READ <read>+) (WRITE <write>+))

 <read> := (CON <S-EXPR>+)
         | (RULE (READ <read>+) (WRITE <write>+))

<write> := (DIS <S-EXPR>+)
         | (RULE (WRITE <write>+) (READ <read>+))
```

- operating on s-exprs

### 1.2.1. main rule

- connects input-output
- recognizing input / generating output <=> types of input / output
- top rule
- implication `A -> B`

```
(RULE (READ ...) (WRITE ...))
```

- `READ` recognizes; `WRITE` generates

#### 1.2.1.a. cnf/dnf

- `READ` and `WRITE` sections may contain cnf or dnf

##### 1.2.1.a.i. read cnf

- and `A /\ B /\ ...`
- or `A \/ B \/ ...`
- cnf `(... /\ (A \/ B \/ ...) /\ ...)`

```
(READ ... (DIS A B ...) ...)
```

##### 1.2.1.a.ii. write dnf

- nand `A <> B <> ...` === `~(A /\ B /\ ...)`
- nor `A >< B >< ...` === `~(A \/ B \/ ...)`
- co-cnf `(... <> (A >< B >< ...) <> ...)` === `~(... /\ (A \/ B \/ ...) /\ ...)`

```
(WRITE ... (CON A B ...) ...)
```

#### 1.2.1.b. nested rules

- `READ` and `WRITE` sections may nest rules

##### 1.2.1.b.i. read rules

- imply `A -> B`
- `(... /\ (A -> B) /\ ...)`
- reading from and writing to `READ` section
- rules depend on other conjuncts in the `READ` section
- rules reduce to sequents

```
(
    READ
    ...
    (
        RULE
        (READ ...)
        (WRITE ...)
    )
    ...
)
```

##### 1.2.1.b.ii. write rules

- nimply, but written in reversed order (co-implication) `B -< A` === `~(B <- A)`
- `(... <> (B -< A) <> ...)` === `~(... /\ (B <- A) /\ ...)`
- reading from and writing to `WRITE` section
- rules depend on other disjuncts in the `WRITE` section
- rules again reduce to sequents

```
(
    WRITE
    ...
    (
        RULE
        (WRITE ...)
        (READ ...)
    )
    ...
)
```

#### 1.2.1.c. free combining

- resuming, we start from top rule that is in fact a `READ` rule
- each `READ` section contains a conjunction of s-exprs, disjunctions, or read rules
- each `WRITE` section contains a disjunction of s-exprs, conjunctions, or write rules

```
(
    RULE
    (
        READ
        ...
        (DIS ...)
        ...
        (
            RULE
            (
                READ ...
            )
            (
                WRITE ...
            )
        )
        ...
    )
    (
        WRITE
        ...
        (CON ...)
        ...
        (
            RULE
            (
                WRITE ...
            )
            (
                READ ...
            )
        )
        ...
    )
)
```

- further branching of rules in higher levels rarely necessary

#### 1.2.1.d chaining rules

- every rule may have a `CHAIN` section
- it specifies what elements of input type are chained to what elements of output type

```
(
    RULE
    (
        READ ...
    )
    (
        CHAIN ...
    )
    (
        WRITE ...
    )
)
```
- using a set of rules in `READ` section as an input type
- using a set of rules in `CHAIN` section as a function from input to output
- using a set of rules in `WRITE` section as an output type
- chained `READ` rules have their `CHAIN` sections in a form of `READ` sections
- chained `WRITE` rules have their `CHAIN` sections in a form of `WRITE` section

## 1.3. some examples of co-rewrite programs

```
<>
><
->
>->
( )>-( )->( )
-<
<-<
( )<-( )-<( )
```
