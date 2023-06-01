```
// under construction //
```

# Reasoner: a logic framework for metacompiling, program synthesis, and automated reasoning

> **[intended audience]**
> Beginners in language parsing, term rewriting, and deductive systems

> **[Short description]**
> *Reasoner* represents a term graph rewriting system and logical inference engine with various use cases like metacompiling, program synthesis, or automated theorem proving. Providing its own metalanguage, *Reasoner* implements a rule based declarative programming paradigm that shares properties of both functional and logic programming.
> 
> Rules in *Reasoner* are analogous to those found in mathematics, but they operate on custom s-expressions. In a naive interpretation, *term graph rewriting* process in *Reasoner* may be depicted by successive application of these rules to input s-expression until we reach an acceptable form of output s-expression.
> 
> Rules in *Reasoner* correspond to a certain form of logic rules heavily inspired by those from *sequent calculus*. Following that direction, mutual interrelation between such formulas simplifies functional composition and logical reasoning about different forms of data they operate on.
> 
> In this exposure, we introduce the relatively simple but comprehensive computing technology behind *Reasoner*.

## table of contents

- [x] [1. introduction]()
- [x] [2. theoretical background]()
    - [x] [2.1. syntax]()
    - [ ] [2.2. semantics]()
        - [ ] [2.1.1. rules]()
            - [ ] [constants]()
            - [ ] [variables]()
        - [ ] [2.1.2. rule systems]()
            - [ ] [constants]()
            - [ ] [variables]()
            - [ ] [nondeterminism]()
            - [ ] [higher order rules]()
            - [ ] [embedded rule systems]()
- [ ] [3. practical examples]()
    - [ ] [3.1. metacompiling]()
    - [ ] [3.2. program synthesis]()
    - [ ] [3.3. automated reasoning]()
- [ ] [4. conclusion]()

## 1. introduction

Characteristic of today widespread [imperative programming](https://en.wikipedia.org/wiki/Imperative_programming) is manual managing of state dynamics by program instructions to produce wanted states. In contrast to imperative, [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) abstracts from states using descriptions usually represented by rules repeatedly applied to parameters in a goal of producing wanted results. *Reasoner* falls into the category of declarative programming paradigm.

Two most prominent types of declarative programming are [functional](https://en.wikipedia.org/wiki/Functional_programming) and [logic programming](https://en.wikipedia.org/wiki/Logic_programming). Presenting a novel [algebraic](https://en.wikipedia.org/wiki/Algebraic_data_type) [term graph](https://en.wikipedia.org/wiki/Term_graph) [rewriting](https://en.wikipedia.org/wiki/Rewriting) approach, *Reasoner* exhibits properties of both functional and logic programming worlds without a special treatment of either paradigm. This is made possible by using rules in a form of [sequents](https://en.wikipedia.org/wiki/Sequent) known from [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus).

Sequents in *Reasoner* operate on [s-expression](https://en.wikipedia.org/wiki/S-expression) data. S-expressions are valuable legacy from [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) family of programming languages. Being simple, but powerful data definition format, S-expressions make *Reasoner* suitable for symbolic data analysis and synthesis in functional-logic environment. Symbolic data may also be used as a medium to describe various domain specific languages in *Reasoner* by [metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming). By expressing programs in terms of symbolic data, it is possible to automatically reason about existing programs in order to produce new programs. That process may be referred as program analysis and synthesis, and it is a key feature of *Reasoner*.

## 2. theoretical background

Being a declarative programming language, *Reasoner* tries to be a blend of term graph rewriting system and logical inference engine.

Term graph rewriting is a method of reconstructing one form of data from another form of data. In this reconstruction, also a new data may be introduced, or existing data may be eliminated to suit our requirements. To be able to do this, *Reasoner* uses a set of user definable rules of a form similar to formulas in mathematics with the difference that *Reasoner* rules may transform not only math expressions, but also any kind of data.

Logical inference in *Reasoner* implicitly relates existing rules or their parts by proper logical connectives. Thus, each rule in *Reasoner* becomes logical implication, while their mutual interrelation simplifies logical reasoning about different forms of data they operate on. This logical reasoning corresponds to a kind of logic that naturally emerges from algebraic aspect of rules, which is conveniently captured by sequents form of rules.

Probably the clearest analogy to *Reasoner* is that it may be seen as a form of a [deductive system](https://en.wikipedia.org/wiki/Formal_system#Deductive_system) specifically adjusted to operate on s-expressions. Let's shortly overview the most used deductive systems in area of logical inference. [Hilbert style deduction](https://en.wikipedia.org/wiki/Hilbert_system), [natural deduction](https://en.wikipedia.org/wiki/Natural_deduction), and [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus) all belong to a class of deductive systems. They are characterized by respectively increasing number of included primitive logical operators. Hilbert style deduction incorporates only [implication](https://en.wikipedia.org/wiki/Material_conditional) where all injected rules take a form of `A -> B`. Natural deduction adds [conjunction](https://en.wikipedia.org/wiki/Logical_conjunction) to the left implication side, so that rules take a form of `A1 /\ A2 /\ ... /\ An -> B`. Sequent calculus further extends the basic language by including right side [disjunction](https://en.wikipedia.org/wiki/Logical_disjunction), like in `A1 /\ A2 /\ ... /\ An -> B1 \/ B2 \/ ... \/ Bn`.

The price paid for the simple syntax of Hilbert-style deduction is that complete formal proofs tend to get extremely long. In contrast, more complex syntax like in natural deduction or sequent calculus leads to shorter formal proofs. This difference in proof lengths exists because often, on higher levels of abstraction, we would want to use the benefits of conjunction and disjunction constructs. Since Hilbert-style deduction doesn't provide these constructs as primitive operators, we would have to bring their explicit definitions into the implicational proof system, which could be avoided in a case of natural deduction in a certain extent, or sequent calculus in even greater extent.

In contrast to Hilbert style deduction and natural deduction, sequent calculus comes in a package with a full set of mappings from basic [logical connectives](https://en.wikipedia.org/wiki/Logical_connective) to uniform [*sequents*](https://en.wikipedia.org/wiki/Sequent). Logic operators appear natural enough to be fluently used in performing inference, while *sequents* appear simple enough to be reasoned about, which are both important qualities for choosing a base for underlying inference algorithm. One may say that sequent calculus characteristic mappings from logical connectives to sequents may seem imbued with elegant symmetry. In cases of Hilbert style deduction and natural deduction, lack of these mappings is compensated by non-primitive definitions of logical connectives, but we take a stand that those definitions do not reflect the elegance found in sequent calculus mappings.

Although sequent calculus, comparing to Hilbert style deduction and natural deduction, may not seem like the simplest solution on first glance, we find it reasonable to base *Reasoner* exactly on sequent calculus because, in the long run, benefits seem to be worth the effort. After all, the simplistic duality elegance of sequent calculus transformations seem too valuable to be left aside in a favor of simpler systems. We are taking a stand that the mentioned duality deserves a special treatment which sequent calculus provides us with by its definition. Thus, we choose sequent calculus as a foundation basis for performing inference in *Reasoner*.

By the definition, *Reasoner* borrows *sequents* from sequent calculus, and extends them by a notion of variables. Although *Reasoner* is sharing some primitive foundations with sequent calculus, beyond borrowed sequents it employs its own novel proving method during logical reasoning process, namely making use of two-sided [constructive proofs](https://en.wikipedia.org/wiki/Constructive_proof). This allows us to generate a meaningful s-expression output upon providing rule system and s-expression input.

!!!
After a short introduction to *Reasoner* syntax in [syntax] section, we prepared a few characteristic examples in [semantics] section, ranging from the simplest one inputting `hello machine` and outputting `hello world`, to gradually more complex ones involving even nondeterministic reasoning and higher order rules. Here, we will learn how to simply input and output s-expressions, how to use alternations, how pattern matching works, and lastly, we will scratch the surface of logical reasoning in *Reasoner*. Hopefully, we will gather enough knowledge to grapple with more complex examples in [practical examples] section.
!!!

### 2.1. syntax

In computer science, the [syntax](https://en.wikipedia.org/wiki/Syntax) of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language.

*Reasoner* language itself resembles a kind of s-expression. S-expressions are consisted of lists of atoms or other s-expressions where lists are surrounded by parenthesis. In *Reasoner*, the first list element to the left determines a type of a list. There are a few predefined list types used for data transformation depicted by the following relaxed kind of [Backus-Naur form](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) rules:

```
      <start> := <mtch-rule>
               | <rule-system>

  <mtch-rule> := (MATCH (VAR <variable>+) <rule>)
               | <rule>

       <rule> := (RULE (READ <conjunct>*) (WRITE <disjunct>*))

<rule-system> := (RSYS (ITYPE <mtch-rule>+) (CHAIN <mtch-rule>+) (OTYPE <mtch-rule>+))

   <conjunct> := <S-EXPRESSION>

   <disjunct> := <S-EXPRESSION>

   <variable> := <ATOM>
```

The above grammar rules defines the syntax of *Reasoner*. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one ore more occurrences, `...*` for zero or more occurrences, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the *Reasoner* language. Note that `<conjunct>*` and `<disjunct>*` constructs are sometimes interpreted as `<conjunct>` and `<disjunct>`, or `<conjunct>+` and `<disjunct>+`, depending on appearance in different contexts.

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments begin with `//`, and reach the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

In *Reasoner* language, there is no additional type checking, meaning that every expression valid in the above grammar is also valid in *Reasoner*. However, we may form *Reasoner* valid constructions that regardless of input may never return a successful response. Some of such cases indicate inconsistency in rules and always cause an input or output error.

!!!
Other such cases are not indicated by *Reasoner* because they may already fall into category of theoretically undecidable proof constructions. For more information about this undecidability, interested readers may examine [Gödel's incompleteness theorems](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems) and [halting problem](https://en.wikipedia.org/wiki/Halting_problem).
!!!

### 2.2. semantics

[Semantics](https://en.wikipedia.org/wiki/Semantics) is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to interpretation of syntactically correct expressions. To know what an expression means, it is enough to know how it translates to a form that is already understood by a target environment. In this section, we are dealing with an intuitive semantics of *Reasoner*.

#### 2.1.1. rules

##### constants

##### variables

#### 2.2.2. rule systems

##### constants

##### variables

##### nondeterminism

##### higher order rules

## 3. practical examples

### 3.1. metacompiling

### 3.2. program synthesis

### 3.3. automated reasoning

## 4. conclusion

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
          (FORE (CON <x>) (DIS 0              ))
          (FORE (CON <x>) (DIS (succ (succ X))))
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
  
- is even

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
