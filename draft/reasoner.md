```
// under construction //
```

> *[Short description] Presenting a novel algebraic graph rewriting approach, Reasoner has some properties of both functional and logic programming (prevailing on logic programming) without a special treatment of either paradigm. Reasoner takes a form of syntactically restricted, but semantically complete typed logic dealing only with implication, co-implication, conjunctive normal form (CNF) and disjunctive normal form (DNF). We use implication to branch out from problem setup, and co-implication to branch backwards into final solution. CNF and DNF implicitly logically relate neighbor rules, their inputs and their outputs. All these operators mutually compose recursively in a seamless, consistent way from the aspect of our version of constructive logic.*


# Reasoner: a logic framework for automated reasoning

Imperative programming is manual managing of states dynamics using discrete steps of computation represented by instructions to produce wanted states. In contrast to imperative, declarative programming abstracts from states using descriptions usually represented by rules repeatedly applied to parameters in a goal of producing results. Declarative programming paradigm describes the appearance of *Reasoner*.

Two prominent types of declarative programming are functional and logic programming. Presenting a novel algebraic graph rewriting approach, *Reasoner* has some properties of both functional and logic programming (prevailing on logic programming) without a special treatment of either paradigm.

Let's also mention here that rules in *Reasoner* operate on, and pattern match against s-expr data. S-exprs, being simple, but powerful data definition format make *Reasoner* suitable for symbolic data analysis and synthesis. Symbolic data may also be used as a medium to describe various domain specific languages. By expressing object code in terms of symbolic data, it is possible to automatically reason about existing object code in order to produce new object code. That process may be referred as program analysis and synthesis.

## table of contents

- [1. introduction]()
- [2. reasoner framework basics]()
    - [2.1. syntax]()
    - [2.2. semantics]()
- [3. some examples]()
    - [3.1. basic]()
    - [3.2. intermediate]()
    - [3.3. advanced]()
- [...]()

## 1. introduction

Before we drift into the essence of automated reasoning by *Reasoner*, let's sketch some motivating features of *Reasoner*. These features place *Reasoner* between logical and functional framework, embracing both kinds of systems with the same universal rule treatment.

*Reasoner* graph rewriting algebra is based on implicative and its dual, co-implicative rewriting. Dual reasoning in *Reasoner* spans by rules from two sides between input and output typing rules, recursively connecting two referent points during proof search. Such approach reduces proving search space, often avoiding otherwise possible combinatorial explosion.

This particular form of dual reasoning is made possible by observing each rule as a function from its input to its output. The input side of a rule may be considered as a set of accepting values (input type), while the output side may be considered as a set of producing values (output type). In between the input/output types, we may place a set of chaining rules (the function body) that map different values of the input type to different values of the output type. As all types may be produced by a set of rewriting rules, we finally get uniform appearance of all three notions: input, chain, and output, each represented by a set or rules, altogether forming a single composite rule in a role of a typed function.

These features are implemented in a way that naturally arises from logical origins in the basics of *Reasoner*. There are two kinds of types depending on implicative side of rules: conjunctive and disjunctive types. Regarding these kinds, they embrace two kinds of rules: implicative and co-implicative rules. We treat these constructs in a logically symmetrical way. The resulting formation lets us to recursively compose rules in a seamless, consistent way from the aspect of our version of constructive logic.

Section 2 deals with syntax and semantics of *Reasoner*, while section 3 brings us some examples...

## 2. reasoner framework basics

*Reasoner* resembles a kind of restricted logic based on four operators: [and](https://en.wikipedia.org/wiki/Logical_conjunction), [or](https://en.wikipedia.org/wiki/Logical_disjunction), [impl](https://en.wikipedia.org/wiki/Material_conditional); and [nimpl](https://en.wikipedia.org/wiki/Converse_nonimplication). Notice that there is no [negation](https://en.wikipedia.org/wiki/Negation) operator. These operators combine in a certain way which determines types of rule input and output sides, finally landing at [conjunctive normal form](https://en.wikipedia.org/wiki/Conjunctive_normal_form) (CNF) or [disjunctive normal form](https://en.wikipedia.org/wiki/Disjunctive_normal_form) (DNF) molds. CNF molds use and, or, impl operators; DNF molds use their duals: or, and, nimpl, respectively. These molds consistently align implicative with its dual, co-implicative proving segment in the inference process.

... about proving process ...

### 2.1. syntax

- a relaxed kind of EBNF rules for syntax of *Reasoner* expressions:
  ```
  <top> := <conjunction>
  
  <conjunction> := (CON <conjunct>+)
                 | <s-expr>
  
  <disjunction> := (DIS <disjunct>+)
                 | <s-expr>
  
     <conjunct> := <disjunction>
                 | (FORE <conjunction> <conjunction>? <disjunction>)
                 | (MATCH (VAR (ID <var-name> <var-type>)+) <conjunct>)
  
     <disjunct> := <conjunction>
                 | (BACK <conjunction> <disjunction>? <disjunction>)
                 | (MATCH (VAR (ID <var-name> <var-type>)+) <disjunct>)
  ```
- conjunctions and disjunctions are contexts which determine possibility of implication, co-implication, other conjunctions, and other disjunctions appearance
- elementary terms are s-exprs, and may be placed anywhere
- conjunction (`CON`) may contain implications (`FORE`), and disjunctions (`DIS`)
- disjunction (`DIS`) may contain co-implications (`BACK`), and conjunctions (`CON`)
- variable use is noted by `(MATCH (VAR (ID var1-name var1-type) (ID var2-name var2-type) ...) ...)`

### 2.2. semantics

- every rule inpl and nimpl contains input and output sections, and may or may not have a chain section
- if the chain section is present, it specifies what elements of input type are chained to what elements of output type so that final input and output may be intersected only by those elements
- without chain it's recognize and produce
- a word about rules as functions, rules as types, rules as other means of computation

#### 2.2.1. about the automated reasoning process

- In logic, we differentiate two kinds of proofs: constructive proofs that describe what *is*, and proofs by contradiction that describe what *is not*. *Reasoner* uses both approaches with its dual reasoning. For reasoning about input types, it uses implicative constructive proofs, and for reasoning about output types, it uses co-implicative proofs by contradiction. In practice, these two kinds of proving processes may be implemented with the similar algorithm by simply negating rules prior to applying contradiction proofs, and then negating the results back, once that the proof is obtained.

## 3. some examples of Reasoner programs

- half even numbers
  ```
  (
      FORE
      (
          CON
          (DIS (half <x>))
          (FORE (CON <x>) (DIS 0 (succ (succ X))))
      )
      (
          CON
          (FORE (CON (half 0)) (DIS 0))
          (
              MATCH
              (VAR (ID <x> ANY))
              (
                  FORE 
                  (CON (half (succ (succ <x>))))
                  (DIS (succ (half <x>)))
              )
          )
      )
      (
          DIS
          (BACK (CON (succ <x>)) (DIS <x>))
          (BACK (CON 0         ) (DIS <x>))
          (CON <x>)
      )
  )
  ```

### 3.1. basic

### 3.2. intermediate

### 3.3. advanced

## ...

```
/\
\/
->
>->
( )>-( )->( )
-<
<-<
( )<-( )-<( )
```

- Uniform multipurpose rules in *Reasoner* enable description of types and functions by the same notions. Because of this property, types have first-class treatment, allowing them to be created as results of other functions. This kind of type flexibility, obviously, raises a bar in *Reasoner* rule expressiveness.

```
// under construction //
```
