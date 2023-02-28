# 1. semantics

## 1.2. co-rewrite restricted logic as a type system

- logic, what *is*, what *is not*, constructive proofs, proofs by contradiction
- a kind of restricted logic based on and, or, impl, nand, nor, nimpl
- using sequents as functions
- using functions as types

```
  <top> := (RULE (READ <read>+) (WRITE <write>+))

 <read> := (CON <S-EXPR>+)
         | (RULE (READ <read>+) (WRITE <write>+))

<write> := (DIS <S-EXPR>+)
         | (RULE (WRITE <write>+) (READ <read>+))
```

### 1.2.1. main rule

- connects input-output
- recognizing/generating expression
- top rule
- s-expr
- implication `A -> B`

```
(RULE (READ ...) (WRITE ...))
```

- `READ` recognizes; `WRITE` generates

#### 1.2.1.a. cnf/co-dnf

- `READ` and `WRITE` sections may contain cnf or dnf

##### 1.2.1.a.i. read cnf

- and `A /\ B /\ ...`
- or `A \/ B \/ ...`
- `... /\ (A \/ B \/ ...) /\ ...`

```
(READ ... (DIS A B ...) ...)
```

##### 1.2.1.a.ii. write co-dnf

- nand `A <> B <> ...` === `~(A /\ B /\ ...)`
- nor `A >< B >< ...` === `~(A \/ B \/ ...)`
- `... <> (A >< B >< ...) <> ...`

```
(WRITE ... (CON A B ...) ...)
```

#### 1.2.1.b. nested rules

- `READ` and `WRITE` sections may nest rules

##### 1.2.1.b.i. read rules

- imply `A -> B`
- `... /\ (A -> B) /\ ...`
- reading from and writing to `READ` section
- rules depend on other conjuncts in the `READ` section

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
- `... >< (B -< A) >< ...`
- reading from and writing to `WRITE` section
- rules depend on other disjuncts in the `WRITE` section

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

#### 1.2.1.d. free combining

- resuming, we start from top rule that is in fact a `READ` rule
- each `READ` section contains a conjunction of s-exprs, disjunctions, or read rules
- each `WRITE` section contains a disjunction of s-exprs, conjunctions, or write rules
- further branching of rules in higher levels

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

- chainer as a function

<> >< -> -<
( )>-( )->( )
:>->:
( )<-( )-<( )
:<-<:
