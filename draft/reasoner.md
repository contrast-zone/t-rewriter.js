```
// work in progress //
```

# *Reasoner*: a functional-logic framework for automated reasoning

> **[type of document]**  
> Introduction to *Reasoner* functional-logic framework
>
> **[intended audience]**  
> Beginners in language parsing, term rewriting, and deductive systems
> 
> **[Short description]**  
> *Reasoner* represents a typed term graph rewriting system and logical inference engine intended for automated reasoning. Providing its own metalanguage, *Reasoner* implements a rule based engine in a declarative programming paradigm that shares properties of both functional and positive logic programming.
> 
> From the functional aspect, rules in *Reasoner* are analogous to formulas found in mathematics, but they operate on custom s-expressions. In a naive interpretation, term graph rewriting process in *Reasoner* may be depicted as successive application of the rules to input s-expression until there are no more rules to apply.
> 
> From the logic aspect, rules in *Reasoner* correspond to a certain form of positive logic rules inspired by those from *sequent calculus*. Following that direction, mutual interrelation between such rules simplifies functional composition and logical reasoning about different forms of data they operate on.
> 
> In this exposure, we introduce the relatively simple but comprehensive computing technology behind *Reasoner*.

## table of contents

- [x] [1. introduction]()  
- [x] [2. theoretical background]()  
    - [x] [2.1. syntax]()  
    - [x] [2.2. semantics]()  
        - [x] [2.2.1. expressions]()  
        - [x] [2.2.2. rules]()  
        - [x] [2.2.3. rule systems]()  
        - [x] [2.2.4. meta-rules and typing]()  
- [ ] [3. examples]()  
- [x] [4. conclusion]()  

## 1. introduction

Characteristic of nowadays widespread [imperative programming](https://en.wikipedia.org/wiki/Imperative_programming) is manual managing of state dynamics by program instructions to produce wanted states. In contrast to imperative, [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) abstracts from states using descriptions usually represented by rules repeatedly applied to parameters in a goal of producing wanted results. *Reasoner* belongs into the category of declarative programming paradigm.

Two most prominent types of declarative programming are [functional](https://en.wikipedia.org/wiki/Functional_programming) and [logic programming](https://en.wikipedia.org/wiki/Logic_programming). Presenting a novel [algebraic](https://en.wikipedia.org/wiki/Algebraic_data_type) [term graph](https://en.wikipedia.org/wiki/Term_graph) [rewriting](https://en.wikipedia.org/wiki/Rewriting) approach, *Reasoner* exhibits properties of both functional and logic programming worlds without a special treatment of either paradigm. This is made possible by using rewriting rules in a form of positive [sequents](https://en.wikipedia.org/wiki/Sequent).

Strictly speaking, *Reasoner* programming expressions span on a level below functional and logic programming, representing a [rule-based system](https://en.wikipedia.org/wiki/Rule-based_system). We may consider *Reasoner* as an "assembler" for declarative programming. Behavior of rewriting rules in *Reasoner* is very similar to behavior of [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)) in [parsing](https://en.wikipedia.org/wiki/Parsing) expressions, additionally allowing algebraic expression matching to take a place during the parsing process. Algebraic matching is something that naturally arises from using an extended version of production rules involving [conjunctions](https://en.wikipedia.org/wiki/Logical_conjunction) on the left and [disjunctions](https://en.wikipedia.org/wiki/Logical_disjunction) on the right side of the rules, which are exactly qualities belonging to sequents.

The determination of input and output types makes *Reasoner* a typed language. Using typed rules, *Reasoner* term graph rewriting algebra is based on implicative and its dual, co-implicative rewriting. Implication and co-implication show perfectly symmetrical behavior when applying them on the same set of rules in processes of forward and backward chaining. Thus, both processes may be implemented by the same algorithm, changing only the direction of applying rules. Dual reasoning in *Reasoner* flows by rules from two sides between input and output typing rules, connecting the two referent end points during rules application. Typing in *Reasoner* is made possible by observing each rule as a function from its input to its output. The input side of a rule may be considered as a set of accepting values (input type), while the output side may be considered as a set of producing values (output type). In between the input and output end points, we may place a set of chaining rules (the function body) that maps different values of the input type to different values of the output type, turning the rule into a typed function. Because both input and output types may be represented by a set of embedded rewriting rules, we finally get an uniform appearance of all three notions: input, chain, and output, each consisted of their own set of rules, altogether recursively forming a single composite rule in a role of a typed function.

Finally, sequents in *Reasoner* operate on [s-expression](https://en.wikipedia.org/wiki/S-expression) data. S-expressions are a valuable heritage of the [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) family of programming languages. Being a simple, but powerful data definition format, s-expressions make *Reasoner* suitable for symbolic data analysis and synthesis in the surrounding functional-logic environment.

## 2. theoretical background

As a declarative programming language, *Reasoner* implements a term graph rewriting system to be a blend of functional and logical inference engine.

Term graph rewriting is a method of reconstructing one form of data from another form of data. In this reconstruction, a new data may be introduced, or existing data may be eliminated or reshaped to suit our requirements. To be able to do this, *Reasoner* uses a set of user definable rules of a form similar to formulas in mathematics, with the difference that *Reasoner* rules may transform not only math expressions, but also any kind of data in a form of s-expressions.

Logical inference in *Reasoner* implicitly relates existing rules or their parts by proper logical connectives. Thus, each rule in *Reasoner* becomes logical implication, while their mutual interrelation simplifies logical reasoning about different forms of data they operate on. This logical reasoning corresponds to a kind of logic that naturally emerges from the algebraic aspect of rules, which is conveniently captured by [sequent](https://en.wikipedia.org/wiki/Sequent) like rules.

To show a clear correspondence between *Reasoner* rules and sequents, we will use an analogy in which *Reasoner* may be seen as a form of a [deductive system](https://en.wikipedia.org/wiki/Formal_system#Deductive_system) specifically adjusted to operate on s-expressions. Let's shortly overview the most used deductive systems in area of logical inference. [Hilbert style deduction](https://en.wikipedia.org/wiki/Hilbert_system), [natural deduction](https://en.wikipedia.org/wiki/Natural_deduction), and [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus) all belong to a class of deductive systems. They are characterized by respectively increasing number of primitive logical operators. Hilbert style deduction incorporates only [implication](https://en.wikipedia.org/wiki/Material_conditional) where all injected rules take a form of `A -> B`. Natural deduction adds conjunction to the left implication side, so that rules take a form of `A1 /\ A2 /\ ... /\ An -> B`. Sequent calculus further extends the basic language by including right side disjunction, like in `A1 /\ A2 /\ ... /\ An -> B1 \/ B2 \/ ... \/ Bn`.

The price paid for the simple syntax of Hilbert-style deduction is that complete formal proofs tend to get extremely long. In contrast, more complex syntax like in natural deduction or sequent calculus leads to shorter formal proofs. This difference in proof lengths exists because often, on higher levels of abstraction, we would want to use the benefits of conjunction and disjunction constructs. Since Hilbert-style deduction doesn't provide these constructs as primitive operators, we would have to bring their explicit definitions into the implicational proof system, which could be avoided in a case of natural deduction to a certain extent, or sequent calculus to even greater extent.

In contrast to Hilbert style deduction and natural deduction, sequent calculus comes in a package with a full set of mappings from basic [logical connectives](https://en.wikipedia.org/wiki/Logical_connective) to uniform sequents. Logic operators appear natural enough to be fluently used in performing inference, while *sequents* appear simple enough to be reasoned about, which are both important qualities for choosing a base for underlying inference algorithm. One may say that sequent calculus characteristic mappings from logical connectives to sequents may seem imbued with elegant symmetry. In cases of Hilbert style deduction and natural deduction, lack of these mappings is compensated by non-primitive definitions of logical connectives, but we take a stand that those definitions do not reflect the elegance found in sequent calculus mappings.

Although sequent calculus, compared to Hilbert style deduction and natural deduction, may not seem like the simplest solution at first glance, we find it reasonable to base *Reasoner* exactly on sequent calculus because, in the long run, benefits may seem to be worth the effort. After all, the simplistic duality elegance of sequent calculus transformations seem too valuable to be left aside in favor of simpler systems. We are taking a stand that the mentioned duality deserves a special treatment which sequent calculus provides us with by its definition. Thus, we choose sequent calculus as a foundation basis for performing inference in *Reasoner*.

By the definition, *Reasoner* borrows *sequents* from sequent calculus, and extends them by a notion of variables. Although *Reasoner* is sharing some primitive foundations with sequent calculus, beyond borrowed sequents, it employs its own proving method during logical reasoning process, namely making use of [constructive proofs](https://en.wikipedia.org/wiki/Constructive_proof). This allows us to generate a meaningful s-expression output upon providing a computational rule system and s-expression input.

### 2.1. syntax

In computer science, the [syntax](https://en.wikipedia.org/wiki/Syntax) of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language. *Reasoner* language itself resembles a kind of s-expression. S-expressions consist of lists of atoms or other s-expressions where lists are surrounded by parenthesis. In *Reasoner*, the first list element to the left determines a type of a list. There are a few predefined list types used for data transformation depicted by the following relaxed kind of [Backus-Naur form](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) rules:

```
       <start> := (STATELESS <expression>)

  <expression> := (EXP <S-EXPR>)
                | (RULE (READ <expression>+) (CHAIN <expression>*)? (WRITE <expression>+))
                | (MATCH (VAR <ATOM>+) <expression>)
```

The above grammar rules define the syntax of *Reasoner*. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one or more occurrences, `...+` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the *Reasoner* language.

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments begin with `//`, and reach to the end of line. Multiline comments begin with `/*` and end with `*/`, so that everything in between is considered as a comment.

In *Reasoner* language, there is no additional type checking, meaning that every expression valid in the above grammar is also valid in *Reasoner*. However, we may form *Reasoner* valid constructions that regardless of input may never return a successful response. Some of such cases indicate inconsistency in rules and always cause an input or output error.

Other such cases are not indicated by *Reasoner* because they may already fall into the category of theoretically undecidable proof constructions. One strategy to deal with these cases is to restrict the rule recursion depth, suppressing further computation if the recursion reaches the posed limit. For more information about this undecidability, interested readers are invited to examine [Gödel's incompleteness theorems](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems) and [halting problem](https://en.wikipedia.org/wiki/Halting_problem).

### 2.2. semantics

[Semantics](https://en.wikipedia.org/wiki/Semantics) is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to interpretation of syntactically correct expressions. To know what an expression means, it is enough to know how it translates to a form that is already understood by a target environment. In this section, we are dealing with the intuitive semantics of *Reasoner*. Semantics of *Reasoner* will be explained using various simplistic examples and defining what inputs and outputs the examples accept and generate.

#### 2.2.1. expressions

*Reasoner* operates on s-expressions written in `EXP` sections. The simplest example would be outputting an s-expression:

```
/*
    hi there example
    
     input: NIL
    output: `(hi there)'
*/

(
    STATELESS
    (EXP (hi there))
)
```

This example inputs `NIL` atom and outputs `(hi there)` s-expression.

#### 2.2.2. rules

Rules are analogous to implications. They have their input `READ` side and output `WRITE` side, each containing a set of `EXP` sections as conjunction on the `READ` side and a set of `EXP` sections as disjunction on the `WRITE` side.

##### constants

Constants are just that, constant s-expressions without variables:

```
/*
    hello world example
    
     input: `(hello machine)`
    output: `(hello world)`
*/

(
    STATELESS
    (RULE (READ (EXP (hello machine))) (WRITE (EXP (hello world))))
)
```

This example inputs s-expression `(hello machine)` and outputs s-expression `(hello world)`.

##### variables

Variables stand for unknown s-expressions that are yet to be specified. The use of variables is noted using `MATCH` and `VAR` sections:

```
/*
    hello entity example
    
     input: `(greet <name>)`
    output: `(hello <name>)`
*/

(
    STATELESS
    (
        MATCH
        (VAR <X>)
        (RULE (READ (EXP (greet <X>))) (WRITE (EXP (hello <X>))))
    )
)
```

Within a rule, there can be any number of variables, and we can name them however we want. Thus, if we pass an input `(greet John)` to the above example, we get an output `(ḣello John)`.

#### 2.2.3. rule systems

Rule systems are sets of rules working together to produce some results. In this section we are dealing with untyped rule systems using composite rules. Because types in composite rules always have to be specified, to simulate untyped behavior, we make use of variables in surrounding `READ` and `WRITE` sections, noting generic expressions in a form of `(MATCH (VAR <X>) (EXP <X>))`. These expressions stand for any kind of s-expressions.

##### constants

Let's consider a rule system of constant rules:

```
/*
    toy making decision
    
     input: `(isGood girl/boy)`
    output: `(makeToy doll/car)`
*/

(
    STATELESS
    (
        RULE
        (
            READ
            (MATCH (VAR <I>) (EXP <I>))
        )
        (
            CHAIN
            (RULE (READ (EXP (isGood girl))) (WRITE (EXP (makeToy doll))))
            (RULE (READ (EXP (isGood boy) )) (WRITE (EXP (makeToy car) )))
        )
        (
            WRITE
            (MATCH (VAR <O>) (EXP <O>))
        )
    )
)
```

The root rule has a `CHAIN` section composed of two other rules. What rule will be applied to an input, is determined by pattern matching of the rules `READ` side against the input. Thus, inputting `(isGood girl)` to the above example outputs `(makeToy doll)`, while inputting `(isGood boy)` outputs `(makeToy car)`.

##### variables

And here is another rule system, this time using variables:

```
/*
    job title decision
    
     input: `(isDoing <Name> drivingRocket/healingPeople)`
    output: `(isTitled <Name> astronaut/doctor)`
*/

(
    STATELESS
    (
        RULE
        (
            READ
            (MATCH (VAR <I>) (EXP <I>))
        )
        (
            CHAIN
            (
                MATCH
                (VAR <Name>)
                (
                    RULE
                    (READ (EXP (isDoing <Name> drivingRocket)))
                    (WRITE (EXP (isTitled <Name> astronaut)))
                )
            )
            (
                MATCH
                (VAR <Name>)
                (
                    RULE
                    (READ (EXP (isDoing <Name> healingPeople)))
                    (WRITE (EXP (isTitled <Name> doctor)))
                )
            )
        )
        (
            WRITE
            (MATCH (VAR <O>) (EXP <O>))
        )
    )
)
```

If we, for example, input the expression `(isDoing Jane healingPeople)`, we get the output `(isTitled Jane doctor)`.


##### chaining rules together

Rule systems may be composed of rules that chain their `WRITE` side to other rules' `READ` side in producing results. Thus, the two rules `(RULE (READ (EXP a)) (WRITE (EXP b)))` and `(RULE (READ (EXP b)) (WRITE (EXP c)))` may chain into a new rule `(RULE (READ (EXP a)) (WRITE (EXP c)))` in a process of intermediate pattern matching against the expression `b`.

To show in example:

```
/*
    job title decision
    
     input: `thereIsADoctor`
    output: `peopleAreHealthy`
*/

(
    STATELESS
    (
        RULE
        (
            READ
            (MATCH (VAR <I>) (EXP <I>))
        )
        (
            CHAIN
            (
                RULE
                (READ (EXP thereIsADoctor))
                (WRITE (EXP peopleAreHealed))
            )
            (
                RULE
                (READ (EXP peopleAreHealed))
                (WRITE (EXP peopleAreHealthy))
            )
        )
        (
            WRITE
            (MATCH (VAR <O>) (EXP <O>))
        )
    )
)
```

passing input `thereIsADoctor` chains the two rules, finally producing the output `peopleAreHealthy`.

##### algebraic rules

Rules stand for implications with conjunctions on the `READ` sides and disjunctions on the `WRITE` sides. Using this feature, we can compose rules in an [algebraic](https://en.wikipedia.org/wiki/Algebraic_data_type) manner.

Having multiple elements on the `WRITE` sides in one rule, each of those elements may be pattern matched against all the elements of any other rule `READ` side. If such a match is met, and the `WRITE` sides of the later rules are all equal, we may produce the `WRITE` sides of the later rules as a result of the chaining process.

This behavior follows from properties of logic implications in proof construction process:

```
 A -> B \/ C,  B -> D,  C -> D
-------------------------------
            A -> D
```

To show it in example:

```
/*
    student decision
    
     input: `(isBeingEducated <Name>)`
    output: `(isAStudent <Name>)`
*/

(
    STATELESS
    (
        RULE
        (
            READ
            (MATCH (VAR <I>) (EXP <I>))
        )
        (
            CHAIN
            (
                MATCH
                (VAR <Name>)
                (
                    RULE
                    (READ (EXP (isBeingEducated <Name>)))
                    (
                        WRITE
                        (EXP (attendsSchool <Name>))
                        (EXP (attendsCollege <Name>))
                    )
                )
            )
            (
                MATCH
                (VAR <Name>)
                (
                    RULE
                    (READ (EXP (attendsSchool <Name>)))
                    (WRITE (EXP (isAStudent <Name>)))
                )
            )
            (
                MATCH
                (VAR <Name>)
                (
                    RULE
                    (READ (EXP (attendsCollege <Name>)))
                    (WRITE (EXP (isAStudent <Name>)))
                )
            )
        )
        (
            WRITE
            (MATCH (VAR <O>) (EXP <O>))
        )
    )
)
```

The first rule `WRITE` side holds a disjunction where each element matches against `READ` sides of the second and the third rule. Having the same `WRITE` side in the second and the third rule, the chaining may be performed. Thus, inputting `(isBeingEducated Jane)` in this example results with `(isAStudent Jane)` output.

Similar analogy holds in the symmetric case. Having multiple elements on the `READ` sides in one rule, each of those elements may be pattern matched against all the elements of any other rule `WRITE` side. If the such match is met, and the `READ` sides of the later rules are all equal, we may produce the `WRITE` sides of the former rule as a result of the rule chaining process.

This behavior follows from properties of logic implications in proof construction process:

```
 A -> B,  A -> C,  B /\ C -> D
-------------------------------
            A -> D
```

To show it in example:

```
/*
    computer expert decision
    
     input: `(buildsARobot <Name>)`
    output: `(isAComputerExpert <Name>)`
*/

(
    STATELESS
    (
        RULE
        (
            READ
            (MATCH (VAR <I>) (EXP <I>))
        )
        (
            CHAIN
            (
                MATCH
                (VAR <Name>)
                (
                    RULE
                    (READ (EXP (buildsARobot <Name>)))
                    (WRITE (EXP (mastersHardware <Name>)))
                )
            )
            (
                MATCH
                (VAR <Name>)
                (
                    RULE
                    (READ (EXP (buildsARobot <Name>)))
                    (WRITE (EXP (mastersSoftware <Name>)))
                )
            )
            (
                MATCH
                (VAR <Name>)
                (
                    RULE
                    (
                        READ
                        (EXP (mastersSoftware <Name>))
                        (EXP (mastersHardware <Name>))
                    )
                    (WRITE (EXP (isAComputerExpert <Name>)))
                )
            )
        )
        (
            WRITE
            (MATCH (VAR <O>) (EXP <O>))
        )
    )
)
```

The third rule `READ` side holds a conjunction where each element matches against `WRITE` sides of the first and second rule. Having the same `READ` side of the first and second rule, the chaining may be performed. Thus, inputting `(buildsARobot John)` in this example results with `(isAComputerExpert John)` output.

#### 2.2.4. meta-rules and typing

After exposing all of the examples above, we can finally introduce meta-rules and typing in *Reasoner*. By recursively embedding rules within `READ` and `WRITE` sections, we enter the world of seamless rules treatment. That way we can combine rules to the arbitrary complexity measure.

##### meta-rules

Meta-rules are rules whose `READ` or `WRITE` sections contain other rules. In `READ` sections, starting from mandatory standalone `EXP` sections, pattern matching is performed by applying chaining rules towards an input expression. This process is analogous to applying production rules in a process of code parsing. If the input expression can be derived in this process, we proceed to the `WRITE` section to produce the output. In the `WRITE` section, output is produced again starting from mandatory standalone `EXP` sections, but this time we chain the rules backwards, from right to left. If there is more than one production available in constructing the output, the first one is chosen after there are no more applicable rules.

Backward chaining in `WRITE` sections is analogous to forward chaining in `READ` sections. While forward chaining is based on logic [implications](https://en.wikipedia.org/wiki/Material_conditional) with conjunctions and disjunctions, backward chaining is based on their dual, co-implications with disjunctions and conjunctions, respectively. Both processes are perfectly symmetrical from the standpoint of an implementation algorithm, only that in forward chaining we move from left to right, while in backward chaining we move from right to left.

In logic, co-implication operator is not studied as well as the more common implication operator. Co-implication is an expression that we get by negating an implication expression. Logic inference on such expressions is diametrically opposite to traditional logic inference, meaning that for all the inference rules that we can apply within implications, we can apply their inverse within co-implications. This fact follows from the simple way of treating co-implications: when we negate a co-implication expression, we can apply ordinary inference rules on the negation, and when we afterwards negate it back, what we get are results of the inference over the original co-implication expression.

The following example depicts a metarule:

```
/*
    world spinning decision
    
     input: `(peopleAre happy/sad)`
    output: `(stillTurns world)`
*/

(
    STATELESS
    (
        RULE
        (
            READ
            (EXP (peopleAre <mood>))
            (RULE (READ (EXP <mood>)) (WRITE (EXP happy)))
            (RULE (READ (EXP <mood>)) (WRITE (EXP sad  )))
        )
        (
            WRITE
            (RULE (READ (EXP world)) (WRITE (EXP <object>)))
            (EXP (stillTurns <object>))
        )
    )
)
```

This example inputs either `(peopleAre happy)` or `(peopleAre sad)` and outputs `(stillTurns world)` regardless of the passed input.

##### typed rules

Typed rules are rules that include `CHAIN` section in their body, along with `READ` and `WRITE` sections. `READ` and `WRITE` sections in typed rules behave exactly like those in meta-rules, only that now they stand for input and output types ready to be checked against input and output expressions. Actual computation is being performed within the `CHAIN` section containing chaining rules that we already encountered in previous examples.

Thus, the example:

```
/*
    weighting decision
    
     input: `(orbitsAround Sun/Earth/Moon Sun/Earth/Moon)`
    output: `(weightsMoreThan Sun/Earth/Moon Sun/Earth/Moon)`
*/

(
    STATELESS
    (
        RULE
        (
            READ
            (EXP (orbitsAround <object> <object>))
            (RULE (READ (EXP <object>)) (WRITE (EXP Sun  )))
            (RULE (READ (EXP <object>)) (WRITE (EXP Earth)))
            (RULE (READ (EXP <object>)) (WRITE (EXP Moon )))
        )
        (
            CHAIN
            (
                MATCH
                (VAR <O1> <O2>)
                (
                    RULE
                    (READ (EXP (orbitsAround <O1> <O2>)))
                    (WRITE (EXP (attractsMoreThan <O2> <O1>)))
                )
            )
            (
                MATCH
                (VAR <O1> <O2>)
                (
                    RULE
                    (READ (EXP (attractsMoreThan <O1> <O2>)))
                    (WRITE (EXP (weightsMoreThan <O1> <O2>)))
                )
            )
        )
        (
            WRITE
            (RULE (READ (EXP Sun  )) (WRITE (EXP <object>)))
            (RULE (READ (EXP Earth)) (WRITE (EXP <object>)))
            (RULE (READ (EXP Moon )) (WRITE (EXP <object>)))
            (EXP (weightsMoreThan <object> <object>))
        )
    )
)
```

expects an input in a form of `(orbitsAround <X> <Y>)` where `<X>` and `<Y>` stand for `Sun`, `Earth`, or `Moon`. The input is pattern matched against rules in the `READ` section. If the input is correct, the rule chaining is performed to compute the actual result. After computation, the result is pattern matched against rules in the `WRITE` section. As the matching passes, finally, the output in the form of `(weightsMoreThan <Y> <X>)` is produced.

## 3. examples

```
// work in progress //
```

## 4. conclusion

If properly performed, there could be numerous kinds of uses of the *Reasoner* inference mechanism. One use may be in editing input in sessions that produce some mathematical, logical, or other kinds of computations, while looping back to editing sessions until we are satisfied with the output. Some other, maybe industrial use may involve compiling a program source code to some assembly target code. In other situations, it is also included that we could form a personal, classical business, or even scientific knowledge base with relational algebra rules, so we can navigate, search, and extract wanted information. Ultimately, data from the knowledge base could mutually interact using on-demand learned inference rules, thus developing the entire logical reasoning system ready to draw complex decisions on general system behavior. And this partial sketch of possible uses is just a tip of the iceberg because with a kind of system like *Reasoner*, we are entering a nonexhaustive area of general knowledge computing where only our imagination could be a limit.

```
// work in progress //
```

