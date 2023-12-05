```
// under construction //
```

# *Reasoner*: a functional-logic framework for automated reasoning

> **[type of document]**
> Introduction to *Reasoner* functional-logic framework
>
> **[intended audience]**  
> Beginners in language parsing, term rewriting, and deductive systems
> 
> **[Short description]**  
> *Reasoner* represents a gradually typed term graph rewriting system and logical inference engine intended for automated reasoning. Providing its own metalanguage, *Reasoner* implements a rule based engine in a declarative programming paradigm that shares properties of both functional and logic programming.
> 
> Rules in *Reasoner* are analogous to formulas found in mathematics, but they operate on custom s-expressions. In a naive interpretation, term graph rewriting process in *Reasoner* may be depicted by successive application of the rules to input s-expression until there is no more rules to apply.
> 
> Rules in *Reasoner* correspond to a certain form of logic rules inspired by those from *sequent calculus*. Following that direction, mutual interrelation between such rules simplifies functional composition and logical reasoning about different forms of data they operate on.
> 
> In this exposure, we introduce the relatively simple but comprehensive computing technology behind *Reasoner*.

## table of contents

- [x] [1. introduction]()
- [ ] [2. motivation]()
- [x] [3. theoretical background]()
    - [x] [3.1. syntax]()
    - [ ] [3.2. semantics]()
        - [ ] [3.2.1. constants]()
        - [ ] [3.2.2. variables]()
        - [ ] [3.2.3. rules]()
        - [ ] [3.2.4. rule systems]()
        - [ ] [3.2.5. metarules and typing]()
- [ ] [4. examples]()
- [ ] [5. conclusion]()

## 1. introduction

Characteristic of nowadays widespread [imperative programming](https://en.wikipedia.org/wiki/Imperative_programming) is manual managing of state dynamics by program instructions to produce wanted states. In contrast to imperative, [declarative programming](https://en.wikipedia.org/wiki/Declarative_programming) abstracts from states using descriptions usually represented by rules repeatedly applied to parameters in a goal of producing wanted results. *Reasoner* belongs into the category of declarative programming paradigm.

Two most prominent types of declarative programming are [functional](https://en.wikipedia.org/wiki/Functional_programming) and [logic programming](https://en.wikipedia.org/wiki/Logic_programming). Presenting a novel [algebraic](https://en.wikipedia.org/wiki/Algebraic_data_type) [term graph](https://en.wikipedia.org/wiki/Term_graph) [rewriting](https://en.wikipedia.org/wiki/Rewriting) approach, *Reasoner* exhibits properties of both functional and logic programming worlds without a special treatment of either paradigm. This is made possible by using rewriting rules in a form of positive [sequents](https://en.wikipedia.org/wiki/Sequent).

Strictly speaking, *Reasoner* programming expressions span on a level below functional and logic programming. We may consider *Reasoner* as an "assembler" for declarative programming. Behavior of rewriting rules in *Reasoner* is very similar to behavior of [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)) in [parsing](https://en.wikipedia.org/wiki/Parsing) expressions, additionally allowing nondeterministic expression matching to take a place during the parsing process. Nondeterministic matching is something that naturally arises from using an extended version of production rules involving [conjunctions](https://en.wikipedia.org/wiki/Logical_conjunction) on the left and [disjunctions](https://en.wikipedia.org/wiki/Logical_disjunction) on the right side of the rules, which are exactly qualities belonging to sequents.

!!!

*Reasoner* also, when one finds it necessary, may support typed rules. This optional determination of input and output types makes *Reasoner* a gradually typed language. When using typed rules, *Reasoner* term graph rewriting algebra is based on implicative and its dual, co-implicative rewriting. Implication and co-implication show perfectly symmetrical behavior when applying them on the same set of rules. Thus, both processes may be implemented by the same algorithm, changing only direction of applying rules. Dual reasoning in *Reasoner* spans by rules from two sides between input and output typing rules, recursively connecting two referent points during rules application. This particular form of dual reasoning is made possible by observing each rule as a function from its input to its output. The input side of a rule may be considered as a set of accepting values (input type), while the output side may be considered as a set of producing values (output type). In between the input and output types, we may place a set of chaining rules (the function body) that map different values of the input type to different values of the output type. Because both input and output types may be produced by a set of embedded rewriting rules, we finally get uniform appearance of all three notions: input, chain, and output, each consisted of their own set of rules, altogether forming a single composite rule in a role of a typed function.

!!!

Finally, sequents in *Reasoner* operate on [s-expression](https://en.wikipedia.org/wiki/S-expression) data. S-expressions are valuable heritage of the [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) family of programming languages. Being simple, but powerful data definition format, s-expressions make *Reasoner* suitable for symbolic data analysis and synthesis in surrounding functional-logic environment.

## 2. motivation

```
    // to do //
```
## 3. theoretical background

As a declarative programming language, *Reasoner* implements a term graph rewriting system to be a blend of functional and logical inference engine.

Term graph rewriting is a method of reconstructing one form of data from another form of data. In this reconstruction, also a new data may be introduced, or existing data may be eliminated or reshaped to suit our requirements. To be able to do this, *Reasoner* uses a set of user definable rules of a form similar to formulas in mathematics, with the difference that *Reasoner* rules may transform not only math expressions, but also any kind of data in a form of s-expressions.

Logical inference in *Reasoner* implicitly relates existing rules or their parts by proper logical connectives. Thus, each rule in *Reasoner* becomes logical implication, while their mutual interrelation simplifies logical reasoning about different forms of data they operate on. This logical reasoning corresponds to a kind of logic that naturally emerges from algebraic aspect of rules, which is conveniently captured by sequent like rules.

To show a clear correspondence between *Reasoner* rules and sequents, we will use an analogy in which *Reasoner* may be seen as a form of a [deductive system](https://en.wikipedia.org/wiki/Formal_system#Deductive_system) specifically adjusted to operate on s-expressions. Let's shortly overview the most used deductive systems in area of logical inference. [Hilbert style deduction](https://en.wikipedia.org/wiki/Hilbert_system), [natural deduction](https://en.wikipedia.org/wiki/Natural_deduction), and [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus) all belong to a class of deductive systems. They are characterized by respectively increasing number of primitive logical operators. Hilbert style deduction incorporates only [implication](https://en.wikipedia.org/wiki/Material_conditional) where all injected rules take a form of `A -> B`. Natural deduction adds [conjunction](https://en.wikipedia.org/wiki/Logical_conjunction) to the left implication side, so that rules take a form of `A1 /\ A2 /\ ... /\ An -> B`. Sequent calculus further extends the basic language by including right side [disjunction](https://en.wikipedia.org/wiki/Logical_disjunction), like in `A1 /\ A2 /\ ... /\ An -> B1 \/ B2 \/ ... \/ Bn`.

The price paid for the simple syntax of Hilbert-style deduction is that complete formal proofs tend to get extremely long. In contrast, more complex syntax like in natural deduction or sequent calculus leads to shorter formal proofs. This difference in proof lengths exists because often, on higher levels of abstraction, we would want to use the benefits of conjunction and disjunction constructs. Since Hilbert-style deduction doesn't provide these constructs as primitive operators, we would have to bring their explicit definitions into the implicational proof system, which could be avoided in a case of natural deduction in a certain extent, or sequent calculus in even greater extent.

In contrast to Hilbert style deduction and natural deduction, sequent calculus comes in a package with a full set of mappings from basic [logical connectives](https://en.wikipedia.org/wiki/Logical_connective) to uniform [*sequents*](https://en.wikipedia.org/wiki/Sequent). Logic operators appear natural enough to be fluently used in performing inference, while *sequents* appear simple enough to be reasoned about, which are both important qualities for choosing a base for underlying inference algorithm. One may say that sequent calculus characteristic mappings from logical connectives to sequents may seem imbued with elegant symmetry. In cases of Hilbert style deduction and natural deduction, lack of these mappings is compensated by non-primitive definitions of logical connectives, but we take a stand that those definitions do not reflect the elegance found in sequent calculus mappings.

Although sequent calculus, comparing to Hilbert style deduction and natural deduction, may not seem like the simplest solution on first glance, we find it reasonable to base *Reasoner* exactly on sequent calculus because, in the long run, benefits may seem to be worth the effort. After all, the simplistic duality elegance of sequent calculus transformations seem too valuable to be left aside in a favor of simpler systems. We are taking a stand that the mentioned duality deserves a special treatment which sequent calculus provides us with by its definition. Thus, we choose sequent calculus as a foundation basis for performing inference in *Reasoner*.

By the definition, *Reasoner* borrows *sequents* from sequent calculus, and extends them by a notion of variables. Although *Reasoner* is sharing some primitive foundations with sequent calculus, beyond borrowed sequents, it employs its own proving method during logical reasoning process, namely making use of [constructive proofs](https://en.wikipedia.org/wiki/Constructive_proof). This allows us to generate a meaningful s-expression output upon providing computational rule system and s-expression input.

!!!
types and function application are both implications
!!!

!!! to do:
- After a short introduction to *Reasoner* syntax in [syntax] section, we prepared a few characteristic examples in [semantics] section, ranging from the simplest one inputting `hello machine` and outputting `hello world`, to gradually more complex ones involving even nondeterministic reasoning and higher order rules. Here, we will learn how to simply input and output s-expressions, how to use alternations, how pattern matching works, and lastly, we will scratch the surface of logical reasoning in *Reasoner*. Hopefully, we will gather enough knowledge to grapple with more complex examples in [examples] section.
!!!

### 3.1. syntax

In computer science, the [syntax](https://en.wikipedia.org/wiki/Syntax) of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language.

*Reasoner* language itself resembles a kind of s-expression. S-expressions are consisted of lists of atoms or other s-expressions where lists are surrounded by parenthesis. In *Reasoner*, the first list element to the left determines a type of a list. There are a few predefined list types used for data transformation depicted by the following relaxed kind of [Backus-Naur form](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) rules:

```
       <start> := (CHAIN <expression>+)
                | <expression>

  <expression> := <S-EXPRESSION>
                | <rule>

        <rule> := (RULE (READ <expression>*) (CHAIN <expression>*)? (WRITE <expression>*))
                | (MATCH (VAR <ATOM>+) <expression>)
```

The above grammar rules defines the syntax of *Reasoner*. To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one ore more occurrences, `...*` for zero or more occurrences, `...?` for optional appearance, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the *Reasoner* language.

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments begin with `//`, and reach the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

In *Reasoner* language, there is no additional type checking, meaning that every expression valid in the above grammar is also valid in *Reasoner*. However, we may form *Reasoner* valid constructions that regardless of input may never return a successful response. Some of such cases indicate inconsistency in rules and always cause an input or output error.

Other such cases are not indicated by *Reasoner* because they may already fall into category of theoretically undecidable proof constructions. For more information about this undecidability, interested readers may examine [Gödel's incompleteness theorems](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems) and [halting problem](https://en.wikipedia.org/wiki/Halting_problem).

### 3.2. semantics

[Semantics](https://en.wikipedia.org/wiki/Semantics) is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to interpretation of syntactically correct expressions. To know what an expression means, it is enough to know how it translates to a form that is already understood by a target environment. In this section, we are dealing with an intuitive semantics of *Reasoner*. Semantics of *Reasoner* will be explaining using various simplistic examples and defining what inputs and outputs the examples accept and generate.

#### 3.2.1. constants

#### 3.2.2. variables

#### 3.2.3. rules

##### constants

```
/*
    hello world example
    
     input: `(hello machine)`
    output: `(hello world)`
*/

`(RULE (READ (hello machine)) (WRITE (hello world)))`
```

##### variables

```
/*
    hello entity example
    
     input: `(greet /name/)`
    output: `(hello /name/)`
*/

(
    MATCH
    (VAR <X>)
    (RULE (READ (greet <X>)) (WRITE (hello <X>)))
)
```

#### 3.2.4. rule systems

##### constants

```
/*
    toy making decision
    
     input: `(isGood girl/boy)`
    output: `(makeToy doll/car)`
*/

(
    CHAIN
    (RULE (READ (isGood girl)) (WRITE (makeToy doll)))
    (RULE (READ (isGood boy) ) (WRITE (makeToy car) ))
)
```

##### variables

```
/*
    job title decision
    
     input: `(isDoing /name/ (driving rocket)/(healing people))`
    output: `(isTitled /name/ astronaut/doctor)`
*/

(
    CHAIN
    (
        MATCH
        (VAR <P>)
        (
            RULE
            (READ (isDoing <P> (driving rocket)))
            (WRITE (isTitled <P> astronaut))
        )
    )
    (
        MATCH
        (VAR <P>)
        (
            RULE
            (READ (isDoing <P> (healing people)))
            (WRITE (isTitled <P> doctor))
        )
    )
)
```

##### nondeterministic rules

```
/*
    student decision
    
     input: `(isBeingEducated /name/)`
    output: `(isAStudent /name/)`
*/

(
    CHAIN
    (
        MATCH
        (VAR <P>)
        (
            RULE
            (READ (isBeingEducated <P>))
            (WRITE (attendsSchool <P>) (attendsCollege <P>))
        )
    )
    (
        MATCH
        (VAR <P>)
        (
            RULE
            (READ (attendsSchool <P>))
            (WRITE (isAStudent <P>))
        )
    )
    (
        MATCH
        (VAR <P>)
        (
            RULE
            (READ (attendsCollege <P>))
            (WRITE (isAStudent <P>))
        )
    )
)
```

```
/*
    computer expert decision
    
     input: `(buildsARobot /name/)`
    output: `(isAComputerExpert /name/)`
*/

(
    CHAIN
    (
        MATCH
        (VAR <P>)
        (
            RULE
            (READ (buildsARobot <P>))
            (WRITE (mastersSoftware <P>))
        )
    )
    (
        MATCH
        (VAR <P>)
        (
            RULE
            (READ (buildsARobot <P>))
            (WRITE (mastersHardware <P>))
        )
    )
    (
        MATCH
        (VAR <P>)
        (
            RULE
            (READ (mastersSoftware <P>) (mastersHardware <P>))
            (WRITE (isAComputerExpert <P>))
        )
    )
)
```

generative grammar - like modus ponens

```
(RULE (READ x (f(x))) (WRITE (g(x))))
```

#### 3.2.5. metarules and typing

```
/*
    world spinning decision
    
     input: `(peopleAre happy/sad)`
    output: `(stillTurns world)`
*/

(
    RULE
    (
        READ
        
        (RULE (READ) (WRITE (peopleAre <mood>)))
        
        (RULE (READ <mood>) (WRITE happy))
        (RULE (READ <mood>) (WRITE sad  ))
    )
    (
        WRITE
        
        (RULE (READ world) (WRITE <object>))
        
        (RULE (READ (stillTurns <object>)) (WRITE))
    )
)
```

```
/*
    weighting decision
    
     input: `(orbitsAround Sun/Earth/Moon Sun/Earth/Moon)`
    output: `(weigthtsMoreThan Sun/Earth/Moon Sun/Earth/Moon)`
*/

(
    RULE
    (
        READ
        
        (RULE (READ) (WRITE (orbitsAround <object> <object>)))
        
        (RULE (READ <object>) (WRITE Sun  ))
        (RULE (READ <object>) (WRITE Earth))
        (RULE (READ <object>) (WRITE Moon ))
    )
    (
        CHAIN
        (
            MATCH
            (VAR <O1> <O2>)
            (
                RULE
                (READ (orbitsAround <O1> <O2>))
                (WRITE (attractsMoreThan <O2> <O1>))
            )
        )
        (
            MATCH
            (VAR <O1> <O2>)
            (
                RULE
                (READ (attractsMoreThan <O1> <O2>))
                (WRITE (weightsMoreThan <O1> <O2>))
            )
        )
    )
    (
        WRITE
        
        (RULE (READ Sun  ) (WRITE <object>))
        (RULE (READ Earth) (WRITE <object>))
        (RULE (READ Moon ) (WRITE <object>))
        
        (RULE (READ (weightsMoreThan <object> <object>)) (WRITE))
    )
)
```

## 4. examples

## 5. conclusion

```
// under construction //
```

---

```
// to do: random thoughts
```

### semantics

[Semantics](https://en.wikipedia.org/wiki/Semantics) is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to interpretation of syntactically correct expressions. To know what an expression means, it is enough to know how it translates to a form that is already understood by a target environment. In this section, we are dealing with an intuitive semantics of *Reasoner*. Semantics of *Reasoner* will be explaining using various simplistic examples and defining what inputs and outputs the examples take and generate.

There are two kinds of top-level expressions in *Reasoner*: rules and rule systems. In following sections we are dealing with these two expression kinds.

#### rules

Using a single rewriting rule represents the simplest way of transforming s-expressions in *Rewrite*. We may think of rules as mathematical formulas operating on s-expressions. Rules have `READ` side and `WRITE` side, and may contain variables. When we pass a s-expression as an input to a rule, if the expression pattern matches against `READ` side, the `WRITE` side of the same rule is reported as an output back to the caller.

##### constants

Rules in *Reasoner* are written in a form of `(RULE (READ ...) (WRITE ...))` expressions. Probably the simplest program in *Rewrite* is `hello world` program:

```
(RULE (READ (hello machine)) (WRITE (hello world)))
```

This program takes `(hello machine)` s-expression as an input, and returns `(hello world)` s-expression as an output. Any other input results with an error. Naturally, `READ` and `WRITE` sides of the rule may hold any kind of s-expressions we find suitable.

##### variables

Within rules we may want to use variables. These kinds of rules are written in a form of `(MATCH (VAR ...) (RULE (READ ...) (WRITE ...)))`. There may be more than one variable in a rule, and they are all enumerated within `VAR` segment. In example, if we write something like:

```
(
    MATCH
    (VAR <X>)
    (RULE (READ (greet <X>)) (WRITE (hello <X>)))
)
```

and we pass `(greet human)` as an input to this program, we get `(hello human)` as an output because variable `<X>` is being substituted by `human` symbol.

We may name variables however we want as long as they represent a single *Reasoner* symbol. Arbitrarily, we may embrace variable names within `<` and `>` characters just to improve code readability, as we did in our example. Also note how we inserted new lines and preceding spaces to the example as another way to improve code readability. Spaces, tabs, and new line characters are all called whitespace characters and they serve as delimiters between symbols.

#### rule systems

Now that we explained how rules behave, we may introduce rule systems. Rule systems are top level constructs containing rules enumerated inside expressions in a form of `(RSYSTEM (ITYPE ...) (CHAIN ...) (OTYPE...))`. `ITYPE` segment holds rules defining input form, `OTYPE` segment holds rules defining output form, while `CHAIN` segment holds rules that represent a link between input and output.

To draw a parallel to functional programming, input rules form an input type, output rules form an output type, while chain rules serve as a computation medium that carries transition from input to output. This way a rule system represents a typed function.

In a parallel to logic programming, rules themselves resemble implications that may have conjunctions on the `READ` side, and disjunctions on the `WRITE` side. As such, rules conform to some logical laws we may use in computation.

Let us explain an evaluation session of a rule system in *Reasoner*. In the start, we provide an input expression, expecting to get back an output expression. To accomplish this, we use rules. In a naive explanation, we begin with an empty `READ` conjunction, branching out towards input expression using only rules from `ITYPE` segment to confirm the input validity. Then we use `CHAIN` segment rules to transform input to output expression. Lastly, we branch in from the output expression to an empty `WRITE` disjunction using only rules from `OTYPE` segment to confirm the output validity.

```
            / \
           ITYPE
        / \ / \ / \
           input     
    / \ / \ / \ / \ / \
           CHAIN    
    \ / \ / \ / \ / \ /
           output     
        \ / \ / \ /
           OTYPE
            \ /
```

In a more accurate explanation, our research in creating *Rewrite* showed that the rule development process is two-way symmetrical. This allows a certain optimization that avoid combinatorial explosion in many cases. Thus, in the final *Rewrite* implementation, we branch using `ITYPE` rules from the top to an input expression to validate its input type. If this branching is successful, next we branch backwards using `OTYPE` and `CHAIN` rules from the bottom to the very same input expression. If this branching is also successful, then we know that the output expression lays somewhere inside the branching. To report the correct output expression, we pick the deepest branch produced only of `OTYPE` rules. We may say that we `ITYPE` rules read from left to right, while `OTYPE` rules read from right to left. Direction of reading `CHAIN` rules depends on whether we are performing forward or backward chaining process.

Because of the nature of the entire process, `ITYPE` segment is required to have at least one rule with an empty `READ` segment (representing top start rule), while `OTYPE` segment is required to have at least one rule with an empty `WRITE` segment (representing bottom start rule).

In the following sections, we bring a few examples using rule systems. We will introduce examples containing constants, variables, as well as examples employing nondeterministic logical reasoning.

