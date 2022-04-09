# introduction to canon programming

    // under construction //

> __*[Intended audience]*__  
> *Beginners in language parsing, term rewriting, and logic deduction*

> __*[Short description]*__  
>

> __*[References]*__  
> *[Wikipedia web site](https://en.wikipedia.org)*

## table of contents

- [ ] [1. introduction](#1-introduction)
- [ ] [2. theoretical background](#2-theoretical-background)
    - [ ] [2.1. syntax](#21-syntax)
    - [ ] [2.2. semantics](#22-semantics)
        - [ ] [2.2.1. semantic rhombus](#221-semantic-rhombus)
        - [ ] [2.2.2. tutorial examples](#222-tutorial-examples)
        - [ ] [2.2.3. resume](#223-resume)
- [ ] [3. practical examples](#3-practical-examples)
    - [ ] [3.1. turing machines](#31-turing-machines)
    - [ ] [3.2. lambda calculus](#32-lambda-calculus)
    - [ ] [3.3. entscheidungsproblem](#33-entscheidungsproblem)
- [ ] [4. related work](#4-related-work)
- [ ] [5. conclusion](#5-conclusion)

## 1. introduction

## 2. theoretical background

    fore rule
    implication
    `a ---> b`
    `~a \/ b`
    
    back rule
    converse nonimplication
    `a <-/- b`
    `~a /\ b`
    
    logical rules inspired by sequents which we applied to term parsing and rewriting
    restricted logic applied to term rewriting
    restricted in a way of how expressions can be formed
    restricted expressions make a predictable subset of logic suitable for term parsing and rewriting
    we formed exactly two symmetric rules such that algorithms for processing one type of rule works with the other type of rule in the similar way, only applied backwards
    nondeterminism
    blend of logic and rewriting system

### 2.1. syntax

In computer science, the [syntax](https://en.wikipedia.org/wiki/Syntax_(programming_languages)) of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language.

[Formal grammar](https://en.wikipedia.org/wiki/Formal_grammar) of *Canon* may be represented by the following, relaxed kind of [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) notation:

        <start> := <fore-mtch>
                 | <back-mtch>

    <fore-mtch> := (MATCH <id>+ <fore-rule>)
                 | <fore-rule>
    
    <back-mtch> := (MATCH <id>+ <back-rule>)
                 | <back-rule>

          <id> := (ID <ELEM-TERM> <COMP-TERM>)

    <fore-rule> := (RULE (BACK <fore-elem>*) <fore-rule>? (FORE <back-elem>*))

    <back-rule> := (RULE (FORE <back-elem>*) <back-rule>? (BACK <fore-elem>*))

    <fore-elem> := <COMP-TERM>
                 | <fore-mtch>

    <back-elem> := <COMP-TERM>
                 | <back-mtch>

To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one ore more occurences, `...*` for zero or more occurences, `...?` for optional single occurence, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the *Canon* language.

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments are introduced by `//`, and reach until the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

Note that the above grammar merely indicates existence of `<ELEM-TERM>` (elementary terms) and `<COMP-TERM>` (composite terms), which we will have a chance to examine thorougly in the semantics section.

### 2.2. semantics

[Semantics](https://en.wikipedia.org/wiki/Semantics) is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to interpretation of syntactically correct expression. To know what an expression means, it is enough to know how to translate the expression to a form that is already understood by a target environment. Semantics of *Canon* deals with such translations at metalevel.

The current section covers *Canon* specific implementation of rule structuring and appearance of terms over which the rules operate. We will overview *Canon* inference process in detail on a few simple but representative examples that may be extrapolated to describe a variety of different systems.

#### 2.2.1. semantic rhombus

Semantics of *Canon* may be described by a rhombus containing `forward rules`, `chaining rules`, and `backward rules`. The rhombus is diverging branches from `BACK` (conjunction) downwards, in a direction of forward rules, forming initial deduction tree. The rhombus is also diverging branches from `FORE` (disjunction) upwards, in a direction of backward rules, forming opposed abduction tree. The deduction and abduction tree branches are required to meet at the middle area of `chaining rules`, thus forming a complete inference system.

          ||                         BACK                          /\
          ||                                                      //\\
          ||                          / \                        //||\\
          ||                        / \ / \                        || 
          ||                      / \ / \ / \                      ||  
          ||                    / \ / \ / \ / \                    ||
          ||                  /                 \                  ||
          || F              /    FORWARD RULES    \              B ||  
          || O            /                         \            A ||  
        D || R          / \ / \ / \ / \ / \ / \ / \ / \          C || A
        E || W        / \ / \ / \ / \ / \ / \ / \ / \ / \        K || B
        D || A      / \ / \ / \ / \ / \ / \ / \ / \ / \ / \      W || D
        U || R    /                                         \    A || U
        C || D                   CHAINING RULES                  R || C
        T ||      \                                         /    D || T
        I || R      \ / \ / \ / \ / \ / \ / \ / \ / \ / \ /        || I
        O || U        \ / \ / \ / \ / \ / \ / \ / \ / \ /        R || O
        N || L          \ / \ / \ / \ / \ / \ / \ / \ /          U || N
          || E            \                         /            L ||  
          || S              \    BACKWARD RULES   /              E ||  
          ||                  \                 /                S ||  
          ||                    \ / \ / \ / \ /                    ||  
          ||                      \ / \ / \ /                      ||  
          ||                        \ / \ /                        ||  
        \\||//                        \ /                          ||  
         \\//                                                      ||
          \/                          FORE                         ||

Related to an arbitrary system it is describing, the rhombus is entirely consisted of directed production rules linking `BACK` and `FORE` placeholders. When interpreting the rhombus on a specific example, we provide an input as a string expression. The task is to extract the output string expression. As the first step, we verify if the input deduces from `BACK` placeholder in a process called forward chaining, using provided `forward rules`. If the deduction is successful, the input is further developed by `chaining rules` and intersected by abduction from `FORE` placeholder in a process called backward chaining, using provided `backward rules`. If the intersection is successful, appropriate output is extracted from the abduction tree, conforming only `backward rules`. There may be many valid parallel output candidates, but we choose the deepest one from the first available backward link to `FORE` placeholder.

Observing the inference process from the inside, the explained procedure is a combination of forward and backward chaining processes. Observing from the outside as a whole, the entire procedure is called forward chaining. It answers the question: "If the input is X, what is an output of the system?" Nevertheless, observing from the outside, one may also be interested in backward chaining, answering questions like: "What should be an input if the output of the system is Y?" Utilizing directed production rules, the procedure for obtaining answers to the later question is similar to the procedure for obtaining answers to the former question. The only difference would be that we have to read all the rules backwards in the same procedure of inferring the answer. Symmetrical treatment of forward/backward rules ensures that we can use the same algorithm in both cases.

Because *Canon* systems operate on sequences of characters, we can interpret forward and backward rules in a sense of incoming and outgoing syntax rules while interpreting chaining rules in a sense of semantic connections between input and output language. This makes *Canon* suitable for representing a variety of languages based on production rules definitions.

#### 2.2.2. tutorial examples

Rough theoretical explanations always seem strange while reading them for the first time. That is why we prepared a few characteristic examples in this section, ranging from the simplest one outputting `hello world` to more complex ones, involving even nondeterministic reasoning.

##### hello world example

    /*
        "hello world" example
    */

    (RULE (BACK <>) (FORE <hello world>))

##### elementary terms

    /*
        conversation example
    */
    
    (
        RULE
        (
            BACK
            (
                RULE 
                (BACK)
                (
                    FORE
                    <hi computer>
                    <isn't the world beautiful>
                    <bye computer>
                )
            )
        )
        (
            RULE
            (BACK)
            (
                FORE
                (RULE (FORE               <hi computer>) (BACK <hello entity>  ))
                (RULE (FORE <isn't the world beautiful>) (BACK <yes, it is>    ))
                (RULE (FORE              <bye computer>) (BACK <goodbye entity>))
            )
        )
        (
            FORE
            (
                RULE 
                (
                    FORE
                    <hello entity>
                    <yes, it is>
                    <goodbye entity>
                )
                (BACK)
            )
        )
    )

##### composite terms

    /*
        toy making decision
    */
    
    (
        RULE
        (
            BACK
            <a <child> is good>
            (RULE (BACK <child>) (FORE <girl>))
            (RULE (BACK <child>) (FORE <boy> ))
        )
        (
            RULE
            (BACK)
            (
                FORE
                (RULE (FORE <a <girl> is good>) (BACK <Nick makes a <toy doll>>))
                (RULE (FORE  <a <boy> is good>) (BACK <Nick makes a <toy car>> ))
            )
        )
        (
            FORE
            (RULE (FORE <toy doll>) (BACK <toy>))
            (RULE (FORE  <toy car>) (BACK <toy>))
            <Nick makes a <toy>>
        )
    )

##### pattern matching

    /*
        job title decision
    */
    
    (
        RULE
        (
            BACK
            <<person> <job>>
            (RULE (BACK <person>) (FORE <Jane>         ))
            (RULE (BACK <person>) (FORE <John>         ))
            (RULE (BACK    <job>) (FORE <drives rocket>))
            (RULE (BACK    <job>) (FORE <heals people> ))
        )
        (
            RULE
            (BACK)
            (
                FORE
                (
                    MATCH
                    (ID <P> <person>)
                    (RULE (FORE <<P> <drives rocket>>) (BACK <<astronaut> <P>>))
                )
                (
                    MATCH
                    (ID <P> <person>)
                    (RULE (FORE <<P> <heals people>>) (BACK <<doctor> <P>>))
                )
            )
        )
        (
            RULE
            (RULE (FORE <astronaut>) (BACK <title> ))
            (RULE (FORE    <doctor>) (BACK <title> ))
            (RULE (FORE      <Jane>) (BACK <person>))
            (RULE (FORE      <John>) (BACK <person>))
            <<title> <person>>
        )
    )

##### nondeterministic disjunction

    /*
        student decision
    */
    
    (
        RULE
        (
            BACK
            <<person> is being educated>
            (RULE (BACK <person>) (FORE <Jane> <John>))
        )
        (
            RULE
            (BACK)
            (
                FORE
                (
                    MATCH
                    (ID <P> <person>)
                    (RULE (FORE <<person> is being educated>) (BACK <<person> attends school>))
                )
                (
                    MATCH
                    (ID <P> <person>)
                    (RULE (FORE <<person> is being educated>) (BACK <<person> attends college>))
                )
                (
                    MATCH
                    (ID <P> <person>)
                    (RULE (FORE <<P> attends school> <<P> attends college>) (BACK <<P> is student>))
                )
            )
        )
        (
            FORE
            (RULE (FORE <jane> <john>) (BACK <person>))
            <<person> is student>
        )
    )

##### nondeterministic conjunction

    /*
        computer expert decision
    */
    
    (
        RULE
        (
            BACK
            <<person> builds a robot>
            (RULE (BACK <person>) (FORE <Jane> <John>))
        )
        (
            RULE
            (BACK)
            (
                FORE
                (
                    MATCH
                    (ID <P> <person>)
                    (RULE (FORE <<P> builds a robot>) (BACK <<P> masters software> <<P> masters hardware>)
                )
                (
                    MATCH
                    (ID <P> <person>)
                    (RULE (FORE <<P> masters software>) (BACK <<P> is computer expert>))
                )
                (
                    MATCH
                    (ID <P> <person>)
                    (RULE (FORE <<P> masters hardware>) (BACK <<P> is computer expert>))
                )
            )
        )
        (
            FORE
            (RULE (FORE <jane> <john>) (BACK <person>))
            <<person> is computer expert>
        )
    )

#### 2.2.3. resume

Resuming all learned by now, all of the above examples may seem like a very simple insight into *Canon* essence, but these kinds of formations are really all we need to express all the computational range promised in the introduction section of this exposure. With what we learned by now about *Canon*, we are able to transcribe *any* input form to *any* output form, no matter of how interlinked they are. This is sometimes referred to as Turing completeness.

With this section, we are concluding theoretical *Canon* exposure. A few more or less advanced examples showing *Canon* in all its shine are covered in the section: [3. practical examples](#3-practical-examples).

## 3. practical examples

In this section we bring three illustrative examples using only constructs learned in section [2. theoretical background](#2-theoretical-background). We will see how to express (1) Turing machines, (2) untyped lambda calculus, (3) entscheidungsmaschine, and (4) metarule engine. The choice of examples is represenative for showing how *Canon* handles different formal systems. The choice of examples is also representative for showing the universality of problem range on which *Canon* can provide a solution.

### 3.1. turing machines

[Automata theory](https://en.wikipedia.org/wiki/Automata_theory) is the study of abstract machines and automata, as well as the computational problems that can be solved using them. It is a theory in theoretical computer science. The word automata (the plural of automaton) comes from the Greek word αὐτόματος, which means "self-acting, self-willed, self-moving". An automaton (Automata in plural) is an abstract self-propelled computing device which follows a predetermined sequence of operations automatically.

A [Turing machine](https://en.wikipedia.org/wiki/Turing_machine) is an automata and mathematical model of computation that defines an abstract machine, which manipulates symbols on a strip of tape according to a table of rules. Despite the model's simplicity, given any computer algorithm, a Turing machine capable of simulating that algorithm's logic can be constructed.

The machine operates on an infinite memory tape divided into discrete *cells*. The machine has its *head* that positions over a single cell and can read or write a symbol to the cell. The machine keeps a track of its current *state* from a finite set of states. Finally, the machine has a finite set of *instructions* which direct reading symbols, writing symbols, changing the current machine state and moving the tape to the left or to the right. Each instruction consists of the following:

1. reading the current state and reading a symbol at the position of head
2. depending on (1.), writing a symbol at the position of head
3. either move the tape one cell left or right and changing the current state

The machine repeats these steps until it encounters the halting instruction.

Turing machine defined in *Canon* terms takes this form:

***

An input to the above example could be an an instruction set for adding 1 to a specified binary number:

    (s#0 to 0Rs#, s#1 to 1Rs#, s#() to ()La#, a#1 to 0La#, a#0 to 1Rf#, f#0 to 0Rf#, f#1 to 1Rf#, f#() to ()Rh#): (()s#1001())

Here we have a set of instructions (state abbreviations are: `s#` for start, `a#` for add one, `f#` for finish, and  `h#` for halt), and a binary number `1001` prepended and postpended by `()` to indicate tape bounds. After processing, the example should expectedly output:

    ()1010()

The above example processes input in a single cycle. It is also possible to construct multi-cycle automata that allows to successively input more data as the process goes on. That kind of automata would exhange its states between cycles by feeding output back to input, along additional data, on each cycle.

It is common knowledge that Turing machine is taken as the most general kind of automata able to process any kind of input. Thus, by implementing Turing machine in terms of *Canon*, we are showing that any other kind of automata ([finite state machines](https://en.wikipedia.org/wiki/Finite-state_machine), [pushdown automata](https://en.wikipedia.org/wiki/Pushdown_automaton), ...) can also be implemented within. However, in practice, Turing machines are not commonly used in regular mainstream programming, yet they are only used in scientific researches to express some notions of mathematical computations. More common models of computation actively used in practical programming are covered in the following sections (functional and logic programming).

### 3.2. lambda calculus

[Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) (also written as λ-calculus) is a formal system in mathematical logic for expressing computation based on function [abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science)) and [application](https://en.wikipedia.org/wiki/Function_application) using variable binding and substitution. It is very simple, but very powerful system. Its typed version has found a way to be an inspiration for many [functional programming languages](https://en.wikipedia.org/wiki/Functional_programming). In this section we bring untyped version of lambda calculus.

Syntax of lambda calculus is surprisingly simple considering its computational power. A lambda term is one or a combination of the following:

- *variable in a form of:* `x`
- *abstraction in a form of:* `λx.M` (where `x` is a variable; `M` is a lambda term)
- *application in a form of:* `(M N)` (where `M` and `N` are lambda terms)

Semantics of lambda calculus, written in a relaxed language, include

- *α-conversion:* `(λx.M) -> (λy.M[x:=y])`
- *β-reduction:* `((λx.M) N) -> (M[x:=N])`

*α-conversion* is renaming of variables used to avoid [name collisions](https://en.wikipedia.org/wiki/Name_collision). *β-reduction* is actual operation carying process of replacing bound variables with the argument expression in the body of the abstraction. Entire computation of a lambda expression is performed using only *α-conversion* and *β-reduction*: rules. This process relates to applying function parameters to functions, yieldig results which may again be consisted of parameters-to-function application, until we reach atomic expressions that we choose to interpret not by lambda calculus itself, but by a previously determined target environment.

This is a very scanty insight into the lambda calculus, while a broader insight may be obtained in exploring examples of various lambda expressions exclusively based on the above formalism. To acquire details, interested readers are invited to search the web for necessary information.

The following example inputs a lambda expression and ouputs its evaluated form. The essence of the process is in two composite rules that operate under certain assumptions. Compare alpha conversion rule and beta reduction rule to the above definition of these processes.

***

This example evaluates lambda expressions, and as such, accepts inputs like `((λx.(x x)) ((λx.(x x)) a))`, in which case it yields the output like `((a a) (a a))`.

### 3.3. entscheidungsproblem

In mathematics and computer science, the [Entscheidungsproblem](https://en.wikipedia.org/wiki/Entscheidungsproblem) is a challenge posed by David Hilbert and Wilhelm Ackermann in 1928. The problem asks for an algorithm that considers, as input, a statement and answers "Yes" or "No" according to whether the statement is universally valid, i.e., valid in every structure satisfying the axioms (see [validity](https://en.wikipedia.org/wiki/Validity_(logic)#Valid_formula)).

Although entscheidungsproblem is generally undecidable, there exist a subset of logic on which entschedungsproblem can be solved: propositional logic. [Propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus) is a branch of logic that deals with propositions (which can be true or false) and relations between propositions, including the construction of arguments based on them. Compound propositions are formed by connecting propositions by logical connectives. Unlike first-order logic, propositional logic does not deal with non-logical objects, predicates about them, or quantifiers. However, all the machinery of propositional logic is included in first-order logic and higher-order logics. In this sense, propositional logic is the foundation of first-order logic and higher-order logic.

In this section we bring a solution to enscheidungsproblem for [implicational propositional logic](https://en.wikipedia.org/wiki/Implicational_propositional_calculus). Since propositional logic can be reduced to implicational propositional logic, we consider that the solution holds for propositional logic, as well.

***

We put the three implicational logic axioms as the input top expressions, from which we may branch out to every other tautology that holds in propositional logic. Thus, the example accepts only implicational logic tautologies, reporting an error otherwise, which is analogous to what entscheidungsproblem asks to be solved. In the case of correct input, the output is exact copy of input.
    
## 4. related work

*Canon* is a metaprogramming system in the guise of rule-based programming system. There exist a lot of systems in both metaprogramming and rule-based programming field. Rather than thoroughly elaborating similarities and differences between *Canon* and each such system known to us, we bring hyperlinks to brief descriptions of selected languages from both fields, arranged in alphabetical order:

- [Metaprogramming languages](https://en.wikipedia.org/wiki/List_of_programming_languages_by_type#Metaprogramming_languages)
    - [META II](https://en.wikipedia.org/wiki/META_II)
    - [OMeta](https://en.wikipedia.org/wiki/OMeta)
    - [TREE META](https://en.wikipedia.org/wiki/TREE-META)
    
- [Rule-based languages](https://en.wikipedia.org/wiki/List_of_programming_languages_by_type#Rule-based_languages)
    - [Constraint Handling Rules](https://en.wikipedia.org/wiki/Constraint_Handling_Rules)
    - [Drools](https://en.wikipedia.org/wiki/Drools)
    - [GOAL agent programming language](https://en.wikipedia.org/wiki/GOAL_agent_programming_language)
    - [Jess](https://en.wikipedia.org/wiki/Jess_(programming_language))
    - [Prolog](https://en.wikipedia.org/wiki/Prolog)
    - [XSLT](https://en.wikipedia.org/wiki/XSLT)

## 5. conclusion

The most generally speaking, *Canon* may be used to express a wide variety of languages. Different languages may be used to express a wide variety of systems. Different systems, in turn may be used to express a wide variety of processes we experience around us. Being natural or artificial, many of these processes may deserve our attention while understanding and mastering them may be of certain importance to us. What will *Canon* represent, and where it will be used depends only on our imagination because with a kind of system like *Canon*, we are entering a nonexhaustive area of general knowledge computing where only our imagination could be a limit.

    // under construction //
    
