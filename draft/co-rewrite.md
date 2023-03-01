# co-rewrite: a restricted logic for ...

- imperative programming is manual managing of states dynamics using discrete steps of computation represented by instructions to produce wanted states
- declarative programming abstracts from states using descriptions usually represented by rules repeatedly applied to parameters in a goal of producing results
- two prominent types of declarative programming are:
    - functional programming may resemble a version of hilbert calculus with typing support
    - logic programming may resemble a version of sequent calculus with typing support
- co-rewrite framework resembles logic programming, applying a novel algebraic graph rewriting approach to logic programming

## table of contents

- [1. introduction]()
- [2. deriving co-rewrite programming framework]()
    - [2.1. main rule]()
        - [2.1.a. cnf/dnf]()
            - [2.1.a.i. read cnf]()
            - [2.1.a.ii. write dnf]()
        - [2.1.b. nested rules]()
            - [2.1.b.i. read rules]()
            - [2.1.b.ii. write rules]()
        - [2.1.c. variables]()
        - [2.1.d. chaining rules]()
    - [2.2. final appearance of co-rewrite]()
- [3. some examples of co-rewrite programs]()
    - [3.1. basic]()
    - [3.2. intermediate]()
    - [3.3. advanced]()
- [...]()

## 1. introduction

- co-rewrite graph rewriting algebra is based on implicative and its dual, co-implicative rewriting.
- typing rules and function rules in co-rewrite are formed using the same notion of rules, allowing types to be created by functions.
- co-rewrite specific graph rewriting algebra combined with typing rules may reduce proof searching space, often avoiding otherwise possible combinatorial explosion.
- another specificity of co-rewrite is that it operates on s-exprs. S-exprs, being simple, but powerful data definition format, make co-rewrite suitable for symbolic data analysis and synthesis.

## 2. deriving co-rewrite programming framework

- logic, what *is* with constructive proofs, what *is not* with proofs by contradiction, co-rewrite hybrid approach
- a kind of restricted logic based on: and, or, impl; and their negations: nand, nor, nimpl
- operating on s-exprs

### 2.1. main rule

- top rule: implication `A -> B`

- ```
  (RULE (READ ...) (WRITE ...))
  ```

- `READ` recognizes input; `WRITE` generates output
- roles of rules: rules as functions, rules as types

#### 2.1.a. cnf/dnf

- `READ` and `WRITE` sections may contain cnf or dnf

##### 2.1.a.i. read cnf

- and `A /\ B /\ ...`
- or `A \/ B \/ ...`
- cnf `(... /\ (A \/ B \/ ...) /\ ...)`

- ```
  (READ ... (DIS A B ...) ...)
  ```

##### 2.1.a.ii. write dnf

- nand `A <> B <> ...` === `~(A /\ B /\ ...)`
- nor `A >< B >< ...` === `~(A \/ B \/ ...)`
- co-cnf is a kind of dnf `(... <> (A >< B >< ...) <> ...)` === `~(... /\ (A \/ B \/ ...) /\ ...)`

- ```
  (WRITE ... (CON A B ...) ...)
  ```

#### 2.1.b. nested rules

- `READ` and `WRITE` sections may nest rules

##### 2.1.b.i. read rules

- imply `A -> B`
- `(... /\ (A -> B) /\ ...)`
- reading from and writing to `READ` section
- rules depend on other conjuncts from the `READ` section
- rules reduce to sequents

- ```
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

##### 2.1.b.ii. write rules

- nimply, but written in reversed order as co-implication `B -< A` === `~(B <- A)`
- `(... <> (B -< A) <> ...)` === `~(... /\ (B <- A) /\ ...)`
- reading from and writing to `WRITE` section
- rules depend on other disjuncts from the `WRITE` section
- rules again reduce to sequents

- ```
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

#### 2.1.c. variables

- to mark an identifier identical within read and write expressions - useful to define functions or parameterized types

- ```
  (
      MATCH
      (VAR (ID ... ...) ...)
      (
          RULE ...
      )
  )
  ```

#### 2.1.d. chaining rules

- every rule may have a `CHAIN` section
- it specifies what elements of input type are chained to what elements of output type

- ```
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

### 2.4. final appearance of co-rewrite

- resuming, we start from top rule that is in fact a `READ` rule
- each `READ` section contains a conjunction of s-exprs, conjunction of disjunctions, or conjunction of read rules
- each `WRITE` section contains a disjunction of s-exprs, disjunction of conjunctions, or disjunction of write rules

- ```
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

- further branching of rules in higher levels is rarely necessary
- a word about rules as functions, rules as types

- ```
    <top> := (RULE (READ <read>+) (WRITE <write>+))
  
   <read> := (DIS <s-expr>+)
           | (RULE (READ <read>+) (CHAIN <read>+)? (WRITE <write>+))
           | (MATCH (VAR (ID <var-name> <var-type>)+) <read>)
  
  <write> := (CON <s-expr>+)
           | (RULE (WRITE <write>+) (CHAIN <write>+)? (READ <read>+))
           | (MATCH (VAR (ID <var-name> <var-type>)+) <write>)
  ```

## 3. some examples of co-rewrite programs

### 3.1. basic

### 3.2. intermediate

### 3.3. advanced

## ...

```
/\
\/
<>
><
->
>->
( )>-( )->( )
-<
<-<
( )<-( )-<( )
```
