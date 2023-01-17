    // work in progress //

# Systemath

> **[intended audience]**  
> Beginners in language parsing, term rewriting, and deductive systems

> **[short description]**  
> *Systemath* represents a graph rewriting system and logical inference engine with various use cases like metacompiling, expression synthesis, or automated theorem proving.
>
> Graph rewriting is a method of reconstructing one form of data from another form of data. In this reconstruction, also a new data may be introduced, or existing data may be eliminated to suit our requirements. To be able to do this, *systemath* uses a set of user definable formulas of a form similar to that one in mathematics with the difference that *systemath* formulas may transform not only math expressions, but also any kind of data.
>
> Logical inference in *systemath* implicitly relates existing formulas or their parts by proper logical connectives. Thus, each formula in *systemath* becomes either logical implication or logical equivalence, while their mutual interrelation simplifies logical reasoning about different forms of data they operate on. This logical reasoning corresponds to a kind of logic that naturally emerges from mathematical aspect of rules.


## table of contents

- [x] [1. introduction](#1-introduction)
- [x] [2. theoretical background](#2-theoretical-background)
    - [x] [2.1. syntax](#21-syntax)
    - [x] [2.2. semantics](#22-semantics)
        - [x] [2.2.1. rule basics](#221-rule-basics)
            - [x] [elementary rules](#elementary-rules)
            - [x] [composite rules](#composite-rules)
            - [x] [term alternations](#term-alternations)
            - [x] [pattern matching](#pattern-matching)
        - [x] [2.2.2. advanced logic of rules](#222-advanced-logic-of-rules)
            - [x] [truth and falsity](#truth-and-falsity)
            - [x] [nondeterministic disjunction](#nondeterministic-disjunction)
            - [x] [nondeterministic conjunction](#nondeterministic-conjunction)
            - [x] [higher order rules](#higher-order-rules)
    - [x] [2.3. summary](#23-summary)
- [ ] [3. practical examples](#3-practical-examples)
    - [x] [3.1. metacompiling](#31-metacompiling)
    - [ ] [3.2. expression synthesis](#32-expression-synthesis)
    - [x] [3.3. automated theorem proving](#33-automated-theorem-proving)
- [x] [4. related work](#4-related-work)
- [x] [5. conclusion](#5-conclusion)
- [x] [6. glossary](#6-glossary)

## 1. introduction

*Systemath* represents a *graph rewriting* system and *logical inference* engine with various use cases like *metacompiling*, *expression synthesis*, or *automated theorem proving*.

Seeing *systemath* as a metacomipling mechanism, for each area of interest, one is able to define input and output language while stating equalities between input and output expressions. From this information, *systemath* is able to translate arbitrary input language expressions to consequent output language expressions.

Seeing *systemath* as expression synthesis mechanism `// work in progress //`, one is able to define a constructive enumeration of functions in specific area of interest. Given such an enumeration, we can input a set of set of mappings from function parameters to function results. *Systemath* is able to test these inputs against enumerated functions, extracting as output those functions on which input parameters/results pairs hold.

Seeing *systemath* as automated theorem proving mechanism, it enables defining various theories. If such theories are defined in a way that avoids infinite rule applications, we may automatically test various theorems that hold on given theories. Moreover, one is able to construct correct reasoning sequences that led to given theorems.

To process all these kinds of activities, and possibly more, *systemath* uses its own *declarative* *metalanguage* imbued with symmetrically opposed elements. In a pursuit of being comprehensive in its computing capabilities, inputs and outputs are taking a form of *s-exprs* which are proven to cover a wide range of possible data excerpts. While *systemath* metalanguage operates on user definable forms of inputs and outputs, it also provides a method to link those two by optionally Turing complete parametric rules of equivalence. As a result, we have a completely automated computation system with a plethora of possible use cases.

In this exposure, we explain how *systemath* arranges its expressions in a goal of solving different problems. In section [2. theoretical background] we examine syntax and semantics of *systemath*, in section [3. practical examples] we examine a few concrete examples of abstract *systemath* application, section [4. related work] points to some of related programming systems, section [5. conclusion] briefly summarizes the essence of the whole exposure, while section [6. glossary] holds outside Wikipedia links to notions that are used to be formatted in *cursive* style in this document.

## 2. theoretical background

Being a declarative programming language, *systemath* tries to be a blend of graph rewriting system and logical inference engine.

Graph rewriting is a method of reconstructing one form of data from another form of data. In this reconstruction, also a new data may be introduced, or existing data may be eliminated to suit our requirements. To be able to do this, *systemath* uses a set of user definable formulas of a form similar to that one in mathematics with the difference that *systemath* formulas may transform not only math expressions, but also any kind of data.

Logical inference in *systemath* implicitly relates existing formulas or their parts by proper logical connectives. Thus, each formula in *systemath* becomes either logical implication or logical equivalence, while their mutual interrelation simplifies logical reasoning about different forms of data they operate on. This logical reasoning corresponds to a kind of logic that naturally emerges from mathematical aspect of rules.

After a short introduction to *systemath* syntax in [syntax] section, we prepared a few characteristic examples in [semantics] section, ranging from the simplest one inputting `hello machine` and outputting `hello world`, to gradually more complex ones involving even nondeterministic reasoning and higher order rules. Here, we will learn how to simply input and output s-exprs, how to use alternations, how pattern matching works, and lastly, we will scratch the surface of logical reasoning in *systemath*. Hopefully, we will gather enough knowledge to grapple with concrete examples in [practical examples] section.

### 2.1. syntax

In computer science, the *syntax* of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language.

*Systemath* metalanguage resembles a kind of s-exprs. S-expr is a form of data widely popularized by *Lisp* family of programming languages. S-exprs are consisted of lists of atoms or other s-exprs where lists are surrounded by parenthesis. In *systemath*, the first list element to the left determines a type of a list. There are a few predefined types used for data transformation depicted by the following relaxed kind of *Backus-Naur form* rules:

```
   <start> := <fwd-mtch>
            | <bck-mtch>

<fwd-mtch> := (MATCH <var> <fwd-rule>+)
            | <fwd-rule>

<bck-mtch> := (MATCH <var> <bck-rule>+)
            | <bck-rule>

<eql-mtch> := (MATCH <var> <eql-rule>+)
            | <eql-rule>

     <var> := (VAR (ID <ID> <TERM>)+)

<fwd-rule> := (RULE (READ <fwd-mtch>*) (CHAIN <eql-mtch>*)? (WRITE <bck-mtch>*))
            | <TERM>

<bck-rule> := (RULE (WRITE <bck-mtch>*) (CHAIN <eql-mtch>*)? (READ <fwd-mtch>*))
            | <TERM>

<eql-rule> := (EQUAL <TERM>+)
```

The above grammar rules defines the syntax of *systemath*. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one ore more occurrences, `...*` for zero or more occurrences, `...?` for optional single occurrence, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the *systemath* language.

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments begin with `//`, and reach the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

Readers not familiar to Backus-Naur form are invited to investigate it more thoroughly because Backus-Naur form is a basis of *systemath* expression forming and expression recognition engine.

In *systemath* metalanguage, there is no additional type checking, meaning that every expression valid in the above grammar is also valid in *systemath*. However, we may form *systemath* valid constructions that regardless of input may never return a successful response. Some of such cases indicate inconsistency in grammar rules and always cause an input *parsing* error. Other such cases are not indicated by *systemath* because they may already fall into category of theoretically undecidable proof constructions. For more information about this undecidability, interested readers may examine *Gödel's incompleteness theorems* and *halting problem*.

### 2.2. semantics

*Semantics* is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to interpretation of syntactically correct expression. To know what an expression means, it is enough to know how it translates to a form that is already understood by a target environment. *systemath* deals with such translations at metalevel using graph rewriting and logical inference, and in this section, we are dealing with semantics of *systemath*.

#### 2.2.1. rule basics

*Systemath* metalanguage is consisted of rules analogous to those found in mathematics, but they operate on custom s-exprs. Graph rewriting process in *systemath* may be depicted by successive application of these rules to an input s-expr until we reach an acceptable form of output s-expr.

In this section, we introduce a few kinds of basic rule application processes related to graph rewriting that consequently may turn into a *Turing complete* system. Turing completeness is a measure of computational completeness of some system. Although Turing completeness implies ultimately broad computational possibilities, unfortunately, it also implies a possibility to form computations that execute in infinitely long time. There exist some mechanisms to successfully avoid some of the infinities of computations in a form of restricting *recursion* depth, but we will not deal with them in this exposure.

##### elementary rules

Typical "hello world" example in *systemath* would look like this:

```
/*
    simple input/output example
    
    input: `(hello machine)`
    output: `(hello world)`
*/

(RULE (READ (hello machine)) (WRITE (hello world)))
```

The example simply inputs an s-expr `(hello machine)`, and outputs the s-expr `(hello world)`. Here, we show an elementary rule with its characteristic mandatory `READ` and `WRITE` sections filled with s-expr terms.

##### composite rules

Let's complicate the above example a bit. We will introduce the `CHAIN` section between `READ` and `WRITE` sections, and fill all three sections with elementary rules. The new example will behave exactly the same like the above example, with the difference that it enables us to internally analyze composite rules behavior in *systemath*:

```
/*
    simple input/output example
    
    input: `(hello machine)`
    output: `(hello world)`
*/

(
    RULE
    (
        READ
        (RULE (READ) (WRITE (hello machine)))
    )
    (
        CHAIN
        (EQUAL (hello machine) (hello world))
    )
    (
        WRITE
        (RULE (WRITE (hello world)) (READ))
    )
)
```

The topmost rule contains three sections: `READ`, `CHAIN`, and `WRITE`. The `READ` section defines a form of input, the `WRITE` section defines a form of output, while the `CHAIN` section serves as a connection between input and output.

The topmost `READ` section hods rules from which the input should always be derivable. We start with an empty `READ` side of those rules, possibly recursively chaining the `WRITE` sides to other rules `READ` sides, ending with actual input on the `WRITE` side. Rules in this section are written in a forward `(RULE (READ ...) (WRITE ...))` manner.

The topmost `WRITE` section hods rules from which the output should always be derivable. We start with an empty `READ` side of those rules, possibly recursively chaining the `WRITE` sides to other rules `READ` sides, ending with actual output on the `WRITE` side. Rules in this section are written in a backward `(RULE (WRITE ...) (READ ...))` manner.

The topmost `CHAIN` section rules is where the actual inference of output from input happens. At least one element of at least one `EQUAL` rule should match the input (the topmost `READ` section), while at least one element of at least one `EQUAL` rule should match the output (the topmost `WRITE` section). Other `EQUAL` rules serve as a possibly recursive chain between input and output. If such a chaining is possible, an output is generated relative to the input. Only allowed rules in this section are `EQUAL` rules.

The example again inputs an s-expr `(hello machine)`, and outputs the s-expr `(hello world)`, this time utilizing the `CHAIN` section.

> **[note card]**  
> Remember that, if present, rules in all `READ` sections are always written in forward `(RULE (READ ...) (WRITE ...))` manner, while rules in all `CHAIN` and `WRITE` sections are always written in backward `(RULE (WRITE ...) (READ ...))` manner. Elements in `EQUAL` rules are commutative.

Of course this is still just a very simple example that does not justify the rules complexity introduced by *systemath*, but let's continue to the next example to see what happens.

##### term alternations

Sometimes rules have to allow alternations between s-expr terms. Let's examine the following example to understand the purpose of alternation terms:

```
/*
    toy making decision
    
    input: `(isGood girl/boy)`
    output: `(makeToy doll/car)`
*/

(
    RULE
    (
        READ
        (RULE (READ      ) (WRITE (isGood child)))
        (RULE (READ child) (WRITE girl boy      ))
    )
    (
        CHAIN
        (EQUAL (isGood girl) (makeToy doll))
        (EQUAL  (isGood boy) (makeToy car) )
    )
    (
        WRITE
        (RULE (WRITE      doll car) (READ toy))
        (RULE (WRITE (makeToy toy)) (READ    ))
    )
)
```

If we have more than one term at the `WRITE` section of rule, those terms are considered as a part of a *logical disjunction*. As a consequence the inference algorithm behind *systemath* may choose which one to pick when pattern matching input/output. The first one that matches input/output is taken to hold.

In the topmost `READ` section, we can see how we paired `child` term with a disjunction of `girl` and `boy` terms. This means that `(isGood child)` s-expr can be substituted with `(isGood girl)` or `(isGood boy)`. Likewise, in the topmost `WRITE` section, we can see how we paired `toy` term with a disjunction of `doll` and `car` terms. This means that `(makeToy toy)` s-expr can be substituted with `(makeToy doll)` or `(makeToy car)`. This process is called rewriting, and we are here applying it to terms.

Right between the topmost `READ` and `WRITE` sections, we put the `CHAIN` section that holds rules about pairing input to output. This `CHAIN` says that if we input `(isGood girl)`, the output `(makeToy doll)` is generated, while if we input `(isGood boy)`, the output `(makeToy car)` is generated.

Still, the whole *systemath* formalism may seem like a bit of an overkill for this purpose, but the next example may justify all the trouble with the rules complexity.

##### pattern matching

To get a feeling what pattern matching is all about, let's examine the following example:

```
/*
    job title decision
    
    input: `(isDoing Jane/John (driving rocket)/(healing people))`
    output: `(isTitled Jane/John astronaut/doctor)`
*/

(
    RULE
    (
        READ
        (RULE (READ       ) (WRITE (isDoing person job)             ))
        (RULE (READ person) (WRITE Jane John                        ))
        (RULE (READ    job) (WRITE (driving rocket) (healing people)))
    )
    (
        CHAIN
        (
            MATCH
            (VAR (ID <P> person))
            (EQUAL (isDoing <P> (driving rocket)) (isTitled <P> astronaut))
        )
        (
            MATCH
            (VAR (ID <P> person))
            (EQUAL (isDoing <P> (healing people)) (isTitled <P> doctor))
        )
    )
    (
        RULE
        (RULE (WRITE        astronaut doctor) (READ title ))
        (RULE (WRITE               Jane John) (READ person))
        (RULE (WRITE (isTitled person title)) (READ       ))
    )
)
```

The input expectedly takes a person's name (`Jane` or `John`) and a person's job (`driving rocket` or `healing people`) in s-expr term `(isDoing person job)`. The output is a titled person in s-expr term `(isTitled person title)` with person being `Jane` or `John`, and title  being `astronaut` or `doctor`.

The chaining section is again where all the fun is happening. We are assigning the correct title to the unknown person `<P>`, depending only on her/his job. If the person drives a rocket, (s)he is an astronaut, and if the person heals people, (s)he is a doctor. Here we have rules of the form:

```
(
    MATCH
    (VAR (ID <...identifier...> <...type...>))
    (EQUAL ...)
)
```
    
`(MATCH ...)` rules serve to assign a type range to an identifier, and more importantly, to mark the identifier identical within incoming and outgoing terms. In the previous example we have two such rules, one for each job. Naturally, there may be examples with more than one identifier, accordingly adding a new `(ID ...)` expression for each identifier under the `(VAR ...)` expression. The same identifier may also be used multiple times at the same side of a rule when all the instances of the identifier are required to match exactly the same expression.

Note that `(MATCH ...)` expressions may also embrace `(RULE ...)` instead of `(EQUAL ...)` expressions if they are hosted in `READ` or `WRITE` sections.

#### 2.2.2. advanced logic of rules

*Systemath* rules correspond to a certain form of logic rules heavily inspired by those from *sequent calculus*. Sequent calculus is a beautiful logical proving system conceived by German mathematician and logician Gerhard Gentzen. Corresponding to sequents, *systemath* rules of the form `(RULE (READ A1 A2 ...) (WRITE B1 B2 ...))` resemble sequents of the form `A1 \/ A2 \/ ... -> B1 /\ B2 /\ ...`. Corresponding to broader mathematical logic, rules of the form `(EQUAL A B)` resemble logical formulas of the form `A <-> B`. Inherently to these two forms, there emerges a logical deduction that is capable to naturally reason about different kinds of theories.

Although we could somehow get away without these logical features while still keeping *systemath* in Turing complete zone, we feel that the noted features greatly simplify logical reasoning in many cases, so we choose them to be a standard part of *systemath* framework.

In this section, we take a look at empty cause/consequence sides of rules, we reconsider *disjunctions* and additionally *conjunctions* in rules, and we analyze how higher order rules map to those of first order using sequent calculus transformation formulas. We will later use this knowledge in [examples] section to construct a simple theorem proving system for propositional logic.

##### truth and falsity

As stated by sequent calculus, rules of the form `(RULE ...)` hold conjunctions on the `READ` side, and disjunctions on the `WRITE` side. The common knowledge in mathematical logic states that a conjunction made of zero elements evaluates to logical truth, while a disjunction made of zero elements evaluates to logical falsity. Thus, if we would want to (partially) define constants `⊤` (truth) and `⊥` (falsity), in *systemath* we may write: 

```
(RULE (READ  ) (WRITE ⊤))
(RULE (READ ⊥) (WRITE  ))
```
More thorough truth/falsity definition may be found in [examples] section. Analyzing the first line, truth emerges from zero elements conjunction. Analyzing the second line, falsity reduces to zero length disjunction. Here we can make a clear distinction between `READ` and `WRITE` sides, making them exhibit different concepts and behavior.

Considering this behavior, *systemath* uses "falsity as an error" approach in constructing expressions. This means that if we define an expression to reduce to zero length disjunction (falsity), *systemath* excludes it from further computation. Sometimes, this may be useful in defining various expressions. For example, we may want to define a set of all the integers without zero. In this case, we may want to write something like:

```
(RULE (READ    N) (WRITE /[0-9]+/))
(RULE (READ /0+/) (WRITE         ))
```

This example defines a set of natural numbers `N`, and uses embedded *regular expressions* as a tool for defining syntax of numeric literals. Naturally, in place of regular expressions, we may use any symbol to reduce to falsity if that is our intention.

##### nondeterministic disjunction

Until now, we used only deterministic computations, meaning we regarded only one thread in the inference. But sometimes it is useful to combine more than one threads, and we call this behavior as nondeterminism. In a case of disjunction, let's consider the following abstract example:

```
01 (RULE (READ) (WRITE A B))
02
03 (RULE (READ A) (WRITE x))
04 (RULE (READ B) (WRITE x))
05
06 (RULE (READ x) (WRITE success))
```
Line numbers to the left are here just for easier referencing, and are not a part of *systemath* metalanguage. Rule in line `01` introduces a disjunction (alternation) of `A` and `B`. We set the goal of outputting `success` in line `06`. To be able to do this, we have to match the `READ` side of line `06` with `x`. In the line `01`, if we rewrite terms `A` and `B` to `x` and `x` by rules in lines `03` and `04`, we set the inference line to reach the output `success`.

This pattern is a common way to deduce a single conclusion from a disjunction of assumptions, i.e. when *algebraic sum* of assumptions is said to hold.

##### nondeterministic conjunction

Nondeterministic conjunction behaves in a similar way as nondeterministic conjunction, only in a reversed way. Hence, in the following example:

```
01 (RULE (READ) (WRITE x))
02
03 (RULE (READ x) (WRITE A))
04 (RULE (READ x) (WRITE B))
05 
06 (RULE (READ A B) (WRITE success))
```

we introduce an `x` in line `01`. The goal is to reach output `success` in the line `06`. To do this, we have to introduce both `A` and `B` threads, as stated in `READ` section in line `06`. We accomplish this in lines `03` and `04` by deducing both `A` and `B` from `x`. This sets the inference line to reach the output `success`.

This pattern is a common way to deduce a single conclusion from a conjunction of assumptions, i.e. when *algebraic product* of assumptions is said to hold.

##### higher order rules

Now it is the time to introduce higher order rules. Higher order rule is a rule that has another rule either in `READ` or in `WRITE` section. This opens the door of making assumptions imply new rules, or making conclusions depend on existence of other rules. For an example excerpt, we may form the following rule set:

```
...
(
    RULE
    (
        READ
        (RULE (READ (add 2 3)) (WRITE 5))
    )
    (WRITE "the math is correct")
)
...
```

This higher order rule outputs the string `"the math is correct"` only if there exists an assertion of the rule `2 + 3 -> 5` (or in our terms, `(RULE (READ (add 2 3)) (WRITE 5))`).

In another example excerpt of higher order rule, we may write:

```
...
(
    RULE
    (READ "the math is correct")
    (
        WRITE
        (RULE (READ (add 2 3)) (WRITE 5))
    )
)
...
```

This higher order rule implies `2 + 3 -> 5` (or in our terms, `(RULE (READ (add 2 3)) (WRITE 5))`) only if there exists an assertion string `"the math is correct"`.

We may use these example excerpts in `READ` sections unchanged, or in `WRITE` sections reversed. There is one interesting remark regarding to the most of the previous examples in this exposure: they mostly represent one composite higher order rule consisted of elementary first order rules in `READ` and `WRITE` sections.

For the end of the [advanced logic of rules] section, just as an intriguing curiosity, we bring sequent calculus formulas for "flattening" higher order rules to first order ones:

```
[right implication]
 Γ |- Δ, A -> B
----------------
  Γ, A |- Δ, B

[left implication]
 Γ, A -> B |- Δ       Γ, A -> B |- Δ
----------------    -----------------
   Γ |- Δ, A            Γ, B |- Δ

```

These rules simplify a software implementation of *systemath* because we only have to deal with first order expressions after applying the rules. As a mind exercise, how would we write these rules in *systemath* terms? <sub>(spoiler: all three kinds of implications (`->`, `|-`, and `---` inference lines) are of the same kind, but of a different order)</sub>

### 2.3. summary

Semantics of *systemath* is contained within composing three kinds of rules: forward, backward, and equality rules in `READ`, `WRITE`, and `CHAIN` sections. Composition of these rules may be visualized by a vertically split rhombus diagram representing a composite forward rule as a whole on the left, and a composite backward rule as a whole on the right side. Composite rules consist of other composite or elementary rules. Elementary rules are made only of s-expr terms without `CHAIN` section.

```
- - - - - - - - - - - - - - - - - - - -   - - - - - - - - - - - - - - - - - - - -
|                                     |   |                                     |
|     ||                        [READ]|   |[WRITE]                       /\     |
|     ||                              |   |                             //\\    |
|     ||                             /|   |\                           //||\\   |
|     ||                           / \|   |/ \                           ||     |
|     ||                         / \ /|   |\ / \                         ||     |
|     ||                       / \ / \|   |/ \ / \                       ||     |
|     ||                     /        |   |        \                     ||     |
|     ||                   /  FORWARD |   | BACKWARD \                 B ||     |
|     || F               /      RULES |   | RULES      \               A ||     |
|   D || O             /              |   |              \             C || A   |
|   E || R           / \ / \ / \ / \ /|   |\ / \ / \ / \ / \           K || B   |
|   D || W         / \ / \ / \ / \ / \|   |/ \ / \ / \ / \ / \         W || D   |
|   U || A       /                    |   |                    \       A || U   |
|   C || R   [CHAIN]   EQUALITY RULES |   | EQUALITY RULES   [CHAIN]   R || C   |
|   T || D       \                    |   |                    /       D || T   |
|   I ||           \ / \ / \ / \ / \ /|   |\ / \ / \ / \ / \ /           || I   |
|   O || R           \ / \ / \ / \ / \|   |/ \ / \ / \ / \ /           R || O   |
|   N || U             \              |   |              /             U || N   |
|     || L               \   BACKWARD |   | FORWARD    /               L ||     |
|     || E                 \    RULES |   | RULES    /                 E ||     |
|     ||                     \        |   |        /                     ||     |
|     ||                       \ / \ /|   |\ / \ /                       ||     |
|     ||                         \ / \|   |/ \ /                         ||     |
|     ||                           \ /|   |\ /                           ||     |
|   \\||//                           \|   |/                             ||     |
|    \\//                             |   |                              ||     |
|     \/                       [WRITE]|   |[READ]                        ||     |
|                                     |   |                                     |
- - - - - - - - - - - - - - - - - - - -   - - - - - - - - - - - - - - - - - - - -
```

This semantic rhombus shows how all types of the rules may be combined in a systematic whole representing a *systemath* metaprogram. In the inference process, the rhombus branches from the top to bottom. The rhombus also branches from the bottom to top. If two branchings can meet in the middle, then input is translated to output using chaining rules.

Resuming all learned by now, all of the above examples may seem like a very basic insight into the *systemath* essence, but these kinds of formations are really all we need to express an entire computational range of different transformations. With what we learned by now about *systemath*, we are able to transcribe *any* input s-expr to *any* output s-expr, no matter of how interlinked they may be. This is guaranteed by Turing completeness which is an inherent design feature of *systemath*.

With this section, we are concluding theoretical *systemath* exposure. A few more or less advanced examples showing *systemath* in all its shine (for better or for worse) are covered in the section [practical examples].

## 3. practical examples

In this section we bring three representative examples of using *systemath*, namely: metacompiling for selected problem in compiler construction, expression synthesis for selected task in mathematics, and automated theorem proving for propositional logic.

### 3.1. metacompiling

Compiling is a process of translating a certain language source code to other language source code, typically assembler. In this section, we bring a solution of example problem of determining expression types. Our source language has a function `add` that sums two number literals which may be integers or floats. The functions may be nested one within another. However, Our target language has two different version of `add` function for adding two numbers, depending on what types the numbers are, namely: `i32.add` or `f64.add`. The functions may also be nested one within another. Our task is to compile the source language code to target language code.

The following solution automatically decides which function version in target language to use, `i32.add` or `f64.add`, and it works correctly with functions nested to whatever depth they may be:

```
(
    RULE
    (
        READ
        (RULE (READ      ) (WRITE exp              ))
        (RULE (READ exp  ) (WRITE int float        ))
        (RULE (READ int  ) (WRITE (add int int)    ))
        (RULE (READ int  ) (WRITE /[0-9]+/         ))
        (RULE (READ float) (WRITE (add float float)))
        (RULE (READ float) (WRITE /[0-9]+\.[0-9]+/ ))
        (RULE (READ float) (WRITE int              ))
    )
    (
        CHAIN
        (
            MATCH
            (VAR (ID <X> int))
            (EQUAL <X> <X>)
        )
        (
            MATCH
            (VAR (ID <X> int) (ID <Y> int))
            (EQUAL (add <X> <Y>) (i32.add <X> <Y>))
        )

        (
            MATCH
            (VAR (ID <X> float))
            (EQUAL <X> <X>)
        )
        (
            MATCH
            (VAR (ID <X> float) (ID <Y> float))
            (EQUAL (add <X> <Y>) (f64.add <X> <Y>))
        )
    )
    (
        WRITE
        (RULE (WRITE                   int) (READ float))
        (RULE (WRITE      /[0-9]+\.[0-9]+/) (READ float))
        (RULE (WRITE (f64.add float float)) (READ float))
        (RULE (WRITE              /[0-9]+/) (READ int  ))
        (RULE (WRITE     (i32.add int int)) (READ int  ))
        (RULE (WRITE             int float) (READ expr ))
        (RULE (WRITE                  expr) (READ      ))
    )
)
```

The example exhibits intended behavior with the following pairs of input/output:

- input s-expr `          (add 2 4)` yields output s-expr `(i32.add 2 4)              `
- input s-expr `        (add 2 0.4)` yields output s-expr `(f64.add 2 0.4)            `
- input s-expr `      (add 0.2 0.4)` yields output s-expr `(f64.add 0.2 0.4)          `
- input s-expr `(add 0.1 (add 2 3))` yields output s-expr `(f64.add 0.1 (i32.add 2 3))`

As a mind exercise, how would we extend the input `add` function to accept strings, finally caught by `str.add` output function?

### 3.2. expression synthesis

```
f (2) = 5;
f (4) = 9;
f (3) = 7;
```
=>
```
f(x) = 2 * x + 1
```

### 3.3. automated theorem proving

In mathematics and computer science, the *entscheidungsproblem* is a challenge posed by David Hilbert and Wilhelm Ackermann in 1928. The problem asks for an algorithm that considers, as input, a statement and answers "Yes" or "No" according to whether the statement is universally valid, i.e., valid in every structure satisfying the axioms.

Although entscheidungsproblem is generally undecidable, there exist a subset of logic on which entschedungsproblem can be solved: *propositional logic*. Propositional logic is a branch of logic that deals with propositions (which can be true or false) and relations between propositions, including the construction of arguments based on them. Compound propositions are formed by connecting propositions by logical connectives. Unlike first-order logic, propositional logic does not deal with non-logical objects, predicates about them, or quantifiers. However, all the machinery of propositional logic is included in first-order logic and higher-order logics. In this sense, propositional logic is the foundation of first-order logic and higher-order logic.

In this section we bring a solution to enscheidungsproblem for propositional logic. The example takes a s-expr containing a logic formula and outputs that formula only if it is universally valid (i.e. it represents an axiom or theorem). If the formula is not universally valid, the example reports an error.

```
/*
    entscheidungsproblem solution for propositional logic
    
    input: a theorem
    output: the same input theorem if the input is successful
*/

(
    RULE
    (
        READ
        /*
            [true intro]
              A
            ------
             true
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ <A>) (WRITE true))
        )
        
        /*
            [true elim]
               true
            ----------
             A, (~ A)
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ true) (WRITE <A> (~ <A>)))
        )
        
        /*
            [false intro]
                 A
            ----------
             A, false
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ <A>) (WRITE <A> false))
        )
        
        /*
            [false elim]
             false   false
            ------- -------
               A     (~ A)
        */
        (
            MATCH
            (VAR (ID <A>))
            (RULE (READ false) (WRITE <A>    ))
            (RULE (READ false) (WRITE (~ <A>)))
        )

        /*        
            [id intro]
             A |- true
            -----------
                 A
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ (RULE (READ <A>) (WRITE true))) (WRITE <A>))
        )

        /*        
            [id elim]
             true |- A
            -----------
                 A
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ (RULE (READ true) (WRITE <A>))) (WRITE <A>))
        )

        /*
            [neg intro]
             A |- false
            ------------
                ~ A
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ (RULE (READ <A>) (WRITE false))) (WRITE (not <A>)))
        )

        /*
            [neg elim]
             (~ A) |- false
            ----------------
                   A
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ (RULE (READ (not <A>)) (WRITE false))) (WRITE <A>))
        )
        
        /*
            [and intro]
               A, B
            ----------
              A /\ B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ <A> <B>) (WRITE (and <A> <B>)))
        )

        /*
            [and elim]
             A /\ B   A /\ B
            -------- --------
                A       B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (and <A> <B>)) (WRITE <A>))
            (RULE (READ (and <A> <B>)) (WRITE <B>))
        )

        /*
            [or intro]
                A       B
            -------- --------
             A \/ B   A \/ B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ <A>) (WRITE (or <A> <B>)))
            (RULE (READ <B>) (WRITE (or <A> <B>)))
        )

        /*
            [or elim]
              A \/ B
            ----------
               A, B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (or <A> <B>)) (WRITE <A> <B>))
        )
        
        /*
            [impl intro]
             ((A |- B), A) |- B
            --------------------
                   A -> B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (RULE (READ (RULE (READ <A>) (WRITE <B>)) <A>) (WRITE <B>))) (WRITE (impl <A> <B>)))
        )
        
        /*
            [impl elim]
             A -> B, A
            -----------
                 B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (impl <A> <B>) <A>) (WRITE <B>))
        )
        
        /*
            [eq intro]
             A |- B, B |- A
            ----------------
                A <-> B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (RULE (READ <A>) (WRITE <B>)) (RULE (READ <B>) (WRITE <A>))) (WRITE (eq <A> <B>)))
        )

        /*
            [eq elim]
             A <-> B    A <-> B
            ---------  ---------
              A |- B    B |- A
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (eq <A> <B>)) (WRITE (RULE (READ <A>) (WRITE <B>))))
            (RULE (READ (eq <A> <B>)) (WRITE (RULE (READ <B>) (WRITE <A>))))
        )
        
        // seed
        (RULE (READ) (WRITE true))
    )
    (
        CHAIN
    )
    (
        WRITE
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (WRITE (eq <A> <B>)) (READ logic))
        )
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (WRITE (impl <A> <B>)) (READ logic))
        )
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (WRITE (or <A> <B>)) (READ logic))
        )
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (WRITE (and <A> <B>)) (READ logic))
        )
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (WRITE (not <A>)) (READ logic))
        )
        (RULE (WRITE false) (READ logic))
        (RULE (WRITE  true) (READ logic))
        (RULE (WRITE logic) (READ      ))
    )
)
```

The example successfully accepts the following inputs:

- `((P -> Q) /\ P) -> Q` - Modus Ponens in input as: `(impl (and (impl P Q) P) Q)`
- `((P -> Q) /\ (Q -> R)) -> (P -> R)` - Hypothetical Syllogism in input as: `(impl (and (impl P Q) (impl Q R)) (impl P R))`
- `(A /\ B) <-> ~((~ A) \/ (~ B))` - De Morgan's law in input as: `(eq (and A B) (not (and (not A) (not B))))`
- other theorems in propositional logic

Inputs of formulas that are not universally valid yield an error.

As a mind exercise, how would we turn the output of this example to `YES` or `NO` instead of outputting the exact input or yielding an error? <sub>(spoiler: the entire metaprogram may be a rule wrapped within even higher order rule;)</sub>

## 4. related work

*Systemath* is a metaprogramming formalization in the guise of rule-based programming system. *Systemath* is also a kind of graph/term rewriting system. There exist a lot of systems in all of these categories. Interested readers are invited to investigate other languages in these fields by visiting the following links:

- [Metaprogramming languages](https://en.wikipedia.org/wiki/List_of_programming_languages_by_type#Metaprogramming_languages)
- [Rule-based languages](https://en.wikipedia.org/wiki/List_of_programming_languages_by_type#Rule-based_languages)
- [Term rewriting systems](https://en.wikipedia.org/wiki/Category:Term-rewriting_programming_languages)

## 5. conclusion

In the [introduction] section, we made some motivating promises about this exposure. In the [theoretical background] section, we started from a few very simple examples, complicating them mildly further down the documentation, aiming to reach a solid ground for presenting more complicated and meaningful ones. In the [examples] section, we finally took a glimpse on metacompiling, expression synthesis, and automated theorem proving as representative examples of using *systemath*, hopingly approaching promises from the start.

In this document, we presented a relatively simple computational technology based on a selection of existing simple, but intriguing foundations of knowledge about knowledge. Presented metalanguage uses graph rewriting methods to rewrite input knowledge excerpts to output knowledge excerpts. As graph rewriting may stand for a very broad range of activities, there are very few restrictions on what *systemath* can actually do, as long as it is related to data computation.

## 6. glossary
[algebraic data type](https://en.wikipedia.org/wiki/Algebraic_data_type)  
[automated theorem proving](https://en.wikipedia.org/wiki/Automated_theorem_proving)  
[Backus-Naur form](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form)  
[declarative programming](https://en.wikipedia.org/wiki/Declarative_programming)  
[Gödel's incompleteness theorems](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems)  
[Entscheidungsproblem](https://en.wikipedia.org/wiki/Entscheidungsproblem)  
[graph rewriting](https://en.wikipedia.org/wiki/Graph_rewriting)  
[halting problem](https://en.wikipedia.org/wiki/Halting_problem)  
[Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language))  
[logical conjunction](https://en.wikipedia.org/wiki/Logical_conjunction)  
[logical disjunction](https://en.wikipedia.org/wiki/Logical_disjunction)  
[logical inference](https://en.wikipedia.org/wiki/Inference)  
[metacompiler](https://en.wikipedia.org/wiki/Compiler-compiler)  
[metalanguage](https://en.wikipedia.org/wiki/Metalanguage)  
[parsing](https://en.wikipedia.org/wiki/Parsing)  
[program synthesis](https://en.wikipedia.org/wiki/Program_synthesis)  
[Propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus)  
[recursion](https://en.wikipedia.org/wiki/Recursion)  
[regular expression](https://en.wikipedia.org/wiki/Regular_expression)  
[s-expr](https://en.wikipedia.org/wiki/S-expression)  
[semantics](https://en.wikipedia.org/wiki/Semantics)  
[sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus)  
[syntax](https://en.wikipedia.org/wiki/Syntax_(programming_languages))  
[Systemath](https://github.com/systemath)  
[Turing completeness](https://en.wikipedia.org/wiki/Turing_completeness)  

    // work in progress //
