```
// under construction //
```

# co-rewrite: a logic framework for automated reasoning

Imperative programming is manual managing of states dynamics using discrete steps of computation represented by instructions to produce wanted states. In contrast to imperative, declarative programming abstracts from states using descriptions usually represented by rules repeatedly applied to parameters in a goal of producing results. Declarative programming paradigm describes the appearance of co-rewrite.

Two prominent types of declarative programming are functional and logic programming. Presenting a novel algebraic graph rewriting approach, co-rewrite has some properties of both functional and logic programming without a special treatment of either paradigm.

Let's also mention here that rules in co-rewrite operate on, and pattern match against s-expr data. S-exprs, being simple, but powerful data definition format make co-rewrite suitable for symbolic data analysis and synthesis. Symbolic data may also be used as a medium to describe various domain specific languages. By expressing object code in terms of symbolic data, it is possible to automatically reason about existing object code in order to produce new object code. That process may be referred as program analysis and synthesis.

## table of contents

- [1. introduction]()
- [2. deriving co-rewrite framework]()
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
    - [2.3. about the automated reasoning process]()
- [3. some examples of co-rewrite programs]()
    - [3.1. basic]()
    - [3.2. intermediate]()
    - [3.3. advanced]()
- [...]()

## 1. introduction

Before we drift into the essence of automated reasoning by co-rewrite, let's sketch some motivating features of co-rewrite. These features place co-rewrite between logical and functional framework, embracing both kinds of systems with the same universal rule treatment.

Co-rewrite graph rewriting algebra is based on implicative and its dual, co-implicative rewriting. Dual reasoning in co-rewrite spans by rules from two sides between input and output typing rules, recursively connecting two referent points during proof search. Such approach reduces proving search space, often avoiding otherwise possible combinatorial explosion.

This particular form of dual reasoning is made possible by observing each rule as a function from its input to its output. The input side of a rule may be considered as a set of accepting values (input type), while the output side may be considered as a set of producing values (output type). In between the input/output types, we may place a set of chaining rules (the function body) that map different values of input type to different values of output type. As all types may be produced by a set of rewriting rules, we finally get uniform appearance of all three notions: input, chain, and output, each represented by a set or rules, altogether forming a single composite rule in a role of a function.

These features are implemented in a way that naturally arises from logical origins in the basics of co-rewrite. There are two kinds of types depending on implicative side of rules: read and write types. Regarding these kinds, they embrace two kinds of rules: read and write rules. We treat read and write implicative sides in a logically symmetrical way. The resulting formation lets us to recursively compose rules in a seamless, consistent way from the aspect of our version of constructive logic.

Section 2 deals with syntax and semantics of co-rewrite, while section 3 brings us some examples...

## 2. deriving co-rewrite framework

Co-rewrite resembles a kind of restricted logic based on four operators: [and](https://en.wikipedia.org/wiki/Logical_conjunction), [or](https://en.wikipedia.org/wiki/Logical_disjunction), [impl](https://en.wikipedia.org/wiki/Material_conditional); and [nimpl](https://en.wikipedia.org/wiki/Converse_nonimplication). Notice that there is no [negation](https://en.wikipedia.org/wiki/Negation) operator in co-rewrite. These operators combine in a certain way which requires rule input sides to hold [conjunctive normal form](https://en.wikipedia.org/wiki/Conjunctive_normal_form) (CNF) of data, and rule output sides to hold [disjunctive normal form](https://en.wikipedia.org/wiki/Disjunctive_normal_form) (DNF) of its elements. Rule input sides use and, or, impl operators; rule output sides use their duals: or, and, nimpl, respectively. This setup consistently aligns implicative with its dual, co-implicative proving technique in the inference process.

We continue by detailed description of how rules in co-rewrite are formed, and how co-rewrite interprets these rules.

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

- cnf `(... /\ (A \/ B \/ ...) /\ ...)`

- ```
  (READ ... (DIS A B ...) ...)
  ```

##### 2.1.a.ii. write dnf

- dnf `(... \/ (A /\ B /\ ...) \/ ...)`

- ```
  (WRITE ... (CON A B ...) ...)
  ```

#### 2.1.b. nested rules

- `READ` and `WRITE` sections may nest rules

##### 2.1.b.i. read rules

- con `(... /\ (A -> B) /\ ...)`
- reading from and writing to `READ` section
- rules depend on other conjuncts from the `READ` section to derive `B`

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

- dis `(... \/ (B -< A) \/ ...)`
- reading from and writing to `WRITE` section
- rules depend on other disjuncts from the `WRITE` section to derive `B`

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

- every rule may or may not have a `CHAIN` section
- if the `CHAIN` section is present, it specifies what elements of input type are chained to what elements of output type so that final output may be intersected by only those chaining rules that lead to pattern matched input

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
- `READ` rules have their `CHAIN` sections in a form of `READ` sections
- `WRITE` rules have their `CHAIN` sections in a form of `WRITE` section
- a word about rules as functions, rules as types, rules as other means of computation

### 2.4. final appearance of co-rewrite

- resuming, we start from top rule that is in fact a `READ` rule
- each `READ` section contains a conjunction holding disjunctions of s-exprs, or read rules
- each `WRITE` section contains a co-conjunction holding co-disjunctions of s-exprs, or write rules

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

- further branching of rules in deeper levels is possible, but rarely necessary

- ```
    <top> := (RULE (READ <read>+) (WRITE <write>+))
  
   <read> := (DIS <s-expr>+)
           | (RULE (READ <read>+) (CHAIN <read>+)? (WRITE <write>+))
           | (MATCH (VAR (ID <var-name> <var-type>)+) <read>)
  
  <write> := (CON <s-expr>+)
           | (RULE (WRITE <write>+) (CHAIN <write>+)? (READ <read>+))
           | (MATCH (VAR (ID <var-name> <var-type>)+) <write>)
  ```

### 2.3. about the automated reasoning process

- In logic, we differentiate two kinds of proofs: constructive proofs that describe what *is*, and proofs by contradiction that describe what *is not*.  Co-rewrite, with its dual reasoning, uses both approaches. For reasoning about input types, it uses constructive proofs, and for reasoning about output types, it uses proofs by contradiction. In practice, these two kinds of proving processes may be implemented by the same algorithm by simply negating rules prior to applying contradiction proofs, and negating the results once that proof is obtained.


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

- Uniform multipurpose rules in co-rewrite enable description of types and functions by the same notions. Because of that property, types have first-class treatment, allowing them to be created as results of other functions. This kind of type flexibility, obviously, raises a bar in co-rewrite rule expressiveness.

```
// under construction //
```
