
    // under construction //
    
# Introduction to *expression logic* formal language

> __*[Intended audience]*__  
> *Beginners in language parsing, term rewriting, and logic deduction*

> __*[Short description]*__   
> *Languages can be seen as streams of symbols used to carry on, process, and exchange informations. Expression logic is also a language, but it is a general kind of metalanguage capable of describing and hosting any other language. Expression logic is also able to perform any intermediate data processing upon recognizing hosted languages. Being a general kind of metalanguage, expression logic represents all of the following:*
> 
> - *Expression recognizer and generator*  
> - *SMT solver*  
> - *Deductive system*  
> - *Term rewriting framework*  
> - *Metatheory language formalization*  
> 
> *These descriptions render expression logic as a general solution verifier and problem solver, which seems to be a required minimum characteristic to process a wider range of formal languages. In this short exposure, we explore basic principles and reveal initial thoughts behind expression logic.*

> __*[Online testing environment]*__  
> *[under construction - partial context free grammar implementation](https://contrast-zone.github.io/exp-log/test)*

> __*[References]*__  
> *[Wikipedia web site](https://en.wikipedia.org)*

## table of contents

- [x] [1. introduction](#1-introduction)  
- [x] [2. expression logic](#2-expression-logic)  
    - [x] [2.1. expression logic syntax](#21-expression-logic-syntax)  
    - [x] [2.2. expression logic semantics](#22-expression-logic-semantics)  
        - [x] [2.2.1. syntactic patterns](#221-syntactic-patterns)  
        - [x] [2.2.2. semantic patterns](#222-semantic-patterns)  
        - [x] [2.2.3. applying rulesets to expressions](#223-applying-rulesets-to-expressions)  
- [ ] [3. implementation](#3-implementation)  
    - [x] [3.1. converting rulesets to sequents](#31-converting-rulesets-to-sequents)  
    - [ ] [3.2. inference process](#32-inference-process)  
        - [x] [3.2.1. correspondence between production rules and logical implication](#321-correspondence-between-production-rules-and-logical-implication)  
        - [ ] [3.2.2. v-parse algorithm](#322-v-parse-algorithm)  
        - [ ] [3.2.3. v-abduce algorithm](#323-v-abduce-algorithm)  
    - [x] [3.3. extracting output](#33-extracting-output)  
- [ ] [4. conclusion](#4-conclusion)  
        

## 1. introduction

*Expression logic* is an implementation of a [deductive system](https://en.wikipedia.org/wiki/Formal_system#Deductive_system) based on a novel kind of satisfiability modulo theory solver ([SMT solver](https://en.wikipedia.org/wiki/Satisfiability_modulo_theories)). Its ambition is to be able to stand behind functionalities of a wide range of formal languages, and as such, it may be considered as a kind of [metalanguage](https://en.wikipedia.org/wiki/Metalanguage).

There are two important aspects of defining formal languages that *expression logic* aims to cover:

1. defining syntax - flexible textual expression oriented nature of *expression logic* allows to describe a general class of language grammars without posing any restrictions by any means. While different syntax setups may be given merely an aesthetic value, they also have an influence on human understanding of what we are trying to communicate using a formal language. Thus, a well designed syntax of a formal language affects our degree of productivity when using such a language. Syntax in *expression logic* is defined by a set of rules guiding a correct expression formation within the languages terms.  

2. defining semantics - computationally complete nature of *expression logic* allows to translate hosted language expressions to any other formal language expressions, considering such a translation meaningful and possible. In terms of semantics, understanding an expression is bounded to ability to translate the observed expression to a form that could already be understood by a target environment. As source and target environments may stand for exactly the same medium, the same formalism used for translating may be used for expressing discrete steps in a role of a computation process.  

Nevertheless, in some cases, these aspects of syntax and semantics may lose a clear line of distinction while providing their definitions in a form of [axiomatic system](https://en.wikipedia.org/wiki/Axiomatic_system). Thus, in *expression logic*, both of syntax and semantic aspects are defined by the same form of [term rewriting](https://en.wikipedia.org/wiki/Rewriting) system.

Within *expression logic*, we are able to assert a set of rules (axioms) which, when recursively applied to each other, assemble a set of all expressions that belong to defined formal language. Validating an expression then represents recognizing exact expression instance from the set of all possible expressions. As a result of this procedure, problem solving represents extracting a specific expression instance that was formed while developing axioms towards the recognized expression.

Provided the planned functionality, *expression logic* may cover a broad area of possible applications:

- deductive reasoning about arbitrary formal language expressions (for example, program correctness indication)  
- general problem solving, performing solution extraction from initial problem setups (for example, program execution)  
- translating between arbitrary formal language source and target environments (for example, program compiling)  

A range of use of this kind is something we may already expect from a deductive system. Certainly, *expression logic* may find its use in less demanding tasks such as implementing a template based graphical user interface language. But its full potential may be unleashed only in systems that include automated decision making processes, like in symbolic artificial intelligence systems. However, symbolic artificial intelligence is still being an open research domain. Thus we shouldn't disregard some less ambitious uses including formalizing different scientific fields, taking advatage of their mutual interaction to produce results of our interests.

## 2. expression logic

Probably the clearest analogy to *expression logic* is that it may be seen as a form of a deductive system adjusted to operate on strings of characters. Let's shortly overview the most used deductive systems in area of logical inference. [Hilbert style deduction](https://en.wikipedia.org/wiki/Hilbert_system), [natural deduction](https://en.wikipedia.org/wiki/Natural_deduction), and [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus) all belong to a class of deductive systems. They are characterized by respectively increasing number of included primitive logical operators. Hilbert style deduction incorporates only [implication](https://en.wikipedia.org/wiki/Material_conditional) where all injected rules take a form of `A -> B`. Natural deduction adds [conjunction](https://en.wikipedia.org/wiki/Logical_conjunction) to the left implication side, so that rules take a form of `A1 /\ A2 /\ ... /\ An -> B`. Sequent calculus further extends the basic language by including right side [disjunction](https://en.wikipedia.org/wiki/Logical_disjunction), like in `A1 /\ A2 /\ ... /\ An -> B1 \/ B2 \/ ... \/ Bn`.

The price paid for the simple syntax of Hilbert-style deduction is that complete formal proofs tend to get extremely long. In contrast, more complex syntax like in natural deduction or sequent calculus leads to shorter formal proofs. This difference in proof lengths exists because often, on higher levels of abstraction, we would want to use the benefits of conjunction and disjunction constructs. Since Hilbert-style deduction doesn't provide these constructs as primitive operators, we would have to bring their explicit definitions into the implicational proof system, which is not needed in a case of sequent calculus. Analogous judgement may be also brought in comparing natural deduction to sequent calculus.

In contrast to Hilbert style deduction and natural deduction, sequent calculus comes in a package with a full set of mappings from basic [logical connectives](https://en.wikipedia.org/wiki/Logical_connective) to uniform [*sequents*](https://en.wikipedia.org/wiki/Sequent). Logic operators appear natural enough to be fluently used in defining various languages, while *sequents* appear simple enough to be reasoned about, which are both important qualities for choosing a base for underlying inference algorithm. One may say that sequent calculus characteristic mappings from logical connectives to sequents may seem imbued with elegant symmetry. Lack of these mappings in cases of Hilbert style deduction and natural deduction is compensated by non-primitive definitions of logical connectives, but we take a stand that those definitions do not reflect the elegance found in sequent calculus mappings.

Although sequent calculus, comparing to Hilbert style deduction and natural deduction, may not seem like the simplest solution on first sight, we find it reasonable to base *expression logic* precisely on sequent calculus because in the long run, benefits seem to be worth the effort. After all, the simplistic duality elegance of sequent calculus transformations seem too valuable to be left aside in a favor of simpler systems. We are taking a stand that the mentioned duality deserves a special treatment which sequent calculus provides us with by its definition. Thus, we choose sequent calculus as a foundation basis for defining languages and performing inference in *expression logic*.

By the definition, *expression logic* extends a subset of sequent calculus (precisely, sequent calculus without negation) to operate on strictly scoped rulesets. Further, individual rulesets are strictly determined to which input segments they apply. If an input expression is conforming related ruleset, the same ruleset is considered as basis for constructing an output expression, replacing segments of related input. Such output is then left for processing to an output environment such as processor, operating system, arbitrary programming language environment, or even a web browser.

To that extent, the essence of *expression logic* is in translating between user-defined formal language and already existing language of output environment. This conforms to a presumption that, generally speaking, semantics of user defined formal language may be considered merely a ruleset for translation to an output language that is already understood by output environment.

In this section we introduce a mechanism which *expression logic* is using to perform such a translation. Moreover, while performing such a translation, we may carry out any computational process represented by an inference mechanism analogous to deductive reasoning supported by *expression logic*. Let's start with *expression logic* syntax, then move on to its semantics.

### 2.1. expression logic syntax

In computer science, the [syntax](https://en.wikipedia.org/wiki/Syntax_(programming_languages)) of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language. In forming syntax of *expression logic*, an attempt was made in finding a right balance between syntax simplicity and actual language intuitional usability. Although possible, simpler syntax would expose lesser number of semantically more complicated essential rules, thus we opted for more optimal greater number of simpler essential rules that are easier to understand, learn, and finally use. Still, comparing to potentially unlimited complexity syntaxes of languages it can host, one may say that *expression logic* syntax takes a relatively simple form.

[Formal grammar](https://en.wikipedia.org/wiki/Formal_grammar) of *expression logic* may be represented by the following, relaxed kind of [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) notation:

         start := expression

    expression := constant expression
                | computed expression
                | constant
                | computed

      computed := <<expression>> :: <<ruleset>>

       ruleset := logic <- ruleset
                | logic

         logic := sequence <-> logic
                | sequence -> logic
                | sequence /\ logic
                | sequence \/ logic
                | sequence

      sequence := primary _ sequence
                | primary sequence
                | primary

       primary := (ruleset)
                | atom

          atom := Goal
                | @identifier
                | identifier
                | literal

Binary operator `<-` and binary logical operators `<->` and `->` associate to the right, while other logical binary operators are commutative. `expression` and `sequence` a posteriori inference associate in the way it is defined by applied rulesets, and may be rendered as ambiguous constructs.

The above grammar includes (1) arbitrary constant and (2) constrained computed expressions. The former are not further interpreted by *expression logic*, while the later necessarily bind to specific rulesets. Rulesets may form structures noted by back-arrow which defines interoperability between contained logic rules. Further, logic rules are expressed using logic operators excluding negation. Logic operators connect sequences, while sequences are composed of atoms. One of the prominent atomic expressions is atom `Goal` which we use as a base node in developing inference roots towards input expressions.

In addition to the above grammar, user comments that have no meaning to the system, but may be descriptive to humans, and may be placed wherever a whitespace is expected. Single line comments are introduced by `//`, and reach until the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

The following section explains the meaning of expressions writen in the above grammar. More formal explanation details may be found in section [[3. implementation](#3-implementation)].

### 2.2. expression logic semantics

To examine how the inference mechanism works, let's imagine a whole, real, natural tree, from treetop leaves to root endings. In expression logic, there exist an atomic `Goal` node that is placed on the ground, at the junction between root and trunk of the tree. Passed input expression represents the root endings, while ruleset represents possible ways to branch the `Goal` node towards root ends. If this branching is possible (i.e. input expression can be inferred from the `Goal` atom), an ouput may be created. The output then represents the uppermost fragment of the root that is self sufficient to represent a continuous string of literals as a result of the whole computation. That output is where *expression logic* ends its job. From there, the outer environment takes control to interpret the *expression logic* output in a role of applied software for example, possibly further constructing the tree trunk and the treetop in a figurative sense.

Using *expression logic* language may be guided in various ways, while specific approaches may turn into a real work of art. In this section, we examine a usage of certain logic constructs which may be utilized to restrain interpretation of input in a predictive way. We explain a usage of certain syntactic and semantic patterns written in a logic language, guided by creation of a live example: untyped lambda calculus. We will show how to validate lambda expressions while inferring their results using applied rulesets. But before diving deeper into the matter, let's shortly overview lambda calculus definition.

##### about lambda calculus

[Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) (also written as λ-calculus) is a formal system in mathematical logic for expressing computation based on function [abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science)) and [application](https://en.wikipedia.org/wiki/Function_application) using variable binding and substitution. It is very simple, but very powerful system. Its typed version has found a way to be an inspiration for many [functional programming languages](https://en.wikipedia.org/wiki/Functional_programming). In this section we bring untyped version of lambda calculus.

Syntax of lambda calculus is surprisingly simple considering its computational power. A lambda term is one or a combination of the following:

- *variable in a form of:* `x`
- *abstraction in a form of:* `λx.M` (where `x` is a variable; `M` is a lambda term)
- *application in a form of:* `(M N)` (where `M` and `N` are lambda terms)

Semantics of lambda calculus, written in a relaxed language, include

- *α-conversion:* `(λx.M) -> (λy.M[x:=y])`
- *β-reduction:* `((λx.M) N) -> (M[x:=N])`

*α-conversion* is renaming of variables used to avoid [name collisions](https://en.wikipedia.org/wiki/Name_collision). *β-reduction* is actual operation carying process of replacing bound variables with the argument expression in the body of the abstraction. Entire computation of a lambda expression is performed using only *α-conversion* and *β-reduction*: rules. This process relates to applying function parameters to functions, yieldig results which may again be consisted of parameters-to-function application, until we reach atomic expressions that we choose to interpret not by lambda calculus itself, but by a previously determined target environment.

This is a very scanty insight into the lambda calculus, while a broader insight may be obtained in exploring examples of various lambda expressions exclusively based on the above formalism. To acquire details, interested readers are invited to search the web for necessary information, while we move onto explaining syntactic formations in general.

#### 2.2.1. syntactic patterns

In this section we show how to generally express syntax of formal languages in terms of expression logic by examining a case of lambda calculus. We may write down a syntax of a language in a various ways, but we will concentrate only on [context free grammar](https://en.wikipedia.org/wiki/Context-free_grammar) kind.

##### atomic expressions

Our grammar will be composed of atomic expressions that include *literals* in a form of quoted [strings](https://en.wikipedia.org/wiki/String_literal) or [regular expressions](https://en.wikipedia.org/wiki/Regular_expression) enclosed between a pair of `/` characters, *identifiers* noted as unquoted strings, *equivalent identifiers* prefixed by al `@`, and finally, the starting atom `Goal` that is a necessary compound of the most general *expression logic* ruleset.

##### sequences

We will also use *sequences* of atomic expressions delimited by an empty space or by underscore character `_`. In a case of empty space, two delimited atoms are supposed to be recognized by including optional whitespace gap between them, while in a case of underscore, two delimited atoms are supposed to be recognized together, without a whitespace gap between them.

##### rules

Context free grammar is consisted of [productions](https://en.wikipedia.org/wiki/Production_(computer_science)). To express it in *expression logic*, we map all the productions to a conjunction of respective implications, swapping left and right sides of each production. This is how the entire syntax of lambda calculus looks like in *expression logic* terms:

    // syntax
    (                   λterm -> Goal    ) /\
    (       "λ" var "." λterm -> λterm   ) /\
    (           λterm primary -> λterm   ) /\
    (                 primary -> λterm   ) /\
    (           "(" λterm ")" -> primary ) /\
    (                     var -> primary ) /\
    ( /[A-Za-z][_0-9A-Za-z]*/ -> var     )

Here, we used relatively simple syntax expressing patern that starts from `Goal` atom, and branches to the left until an instance expression of described language is recognized or rejected. If the instance expression is recognized, we say that it satisfies necessary reqirement of entiling the `Goal` atom.

#### 2.2.2. semantic patterns

Semantic patterns define meanings of syntactic patterns expressions. Semantic patterns usually take two entailing syntactic wholes and connects them in an implication. There may also be cases in which the left side of the implication is consisted of a conjunction of expressions, and/or the right side is consisted of disjunction of expressions. Generally, all other cases of usage of logical connectives reduce to the previous cases, as shown in section [[3.1. converting rulesets to sequents](#31-converting-rulesets-to-sequents)].

To expose *α-conversion* and *β-reduction* rules of lambda calculus, we may write:

    // alpha conversion
    "λ" @x "." @M -> αconv @y "." @M

and

    // beta reduction
    ("(" αconv @x "." @M ")") @N -> @M

However, these expressions do not contain enough information to finally recognize how to match these rules against input and output of lambda calculus. This happens because the input should be recognized finally using only literals, while the above expressions use ungrounded identifiers `@x`, `@y`, `@M`, and `@N`. To resolve this issue, we corroborate the expressions using `<-` operator that associates a set of rules to pointed expression. The `<-` operator has a limited reach of application to its left side, and doesn't interfere with neighbour rules outside the application scope.

Thus, to correctly write down *α-conversion* and *β-reduction* rules, we use the following pattern:

    // semantics
    (
        (
            // alpha conversion
            "λ" @x "." @M -> αconv @y "." @M
        ) <- (
            // declarations
            ( λterm -> M  ) /\
            (   var -> x  ) /\
            (   var -> y  ) /\
            (    @x -> @y )
        )
    ) /\ (
        (
            // beta reduction
            ("(" αconv @x "." @M ")") @N -> @M
        ) <- (
            // declarations
            ( λterm -> M  ) /\
            ( λterm -> N  ) /\
            (   var -> x  ) /\
            (    @x -> @N )
        )
    )

Now all the identifiers are indirectly grounded to literals, exploiting constructs we defined previously in syntax of lambda calculus. Equivalent literals noted by `@` prefix are supposed to develop to equal expressions in the same instantiation, and we use them as substitutes for variable notions. In contrast, literals noted without `@` prefix may develop to different expressions using rules associated to them.

What we defined by now is sufficient to perform computations required by lambda calculus, but we have to priorly connect syntactic rules to semantic rules. We do that again by using `<-` operator in the following manner:

    // untyped lambda calculus
    (
        // semantics
        ... ruleset ...
    ) <- (
        // syntax
        ... ruleset ...
    )

We are now ready to apply the lambda calculus ruleset to specific lambda expressions, which is covered in the next section.

#### 2.2.3. applying rulesets to expressions

To apply a specific ruleset to an expression recognizable by that ruleset, we use `<< ... expression ... >> :: <<... ruleset ...>>` notation. In a case of lambda calculus, we may write:

    <<
        (λx.(x x)) ((λx.(x x)) 2)
    >> :: <<
        // untyped lambda calculus
        ... ruleset ...
    >>

This expression represents a whole that includes all the information necessary to calculate provided lambda expression. The correct output of this example, as the result of all the function abstractions and applications, is `2 2 2 2`. It is extracted from the inference tree indirectly connecting the input expression to the `Goal` atom using the following condition: the output is constructed from the topmost branches near the `Goal` atom that are self sufficient to form a continuous sequence of literals.

By the definition from [[2.1. expression logic syntax](#21-expression-logic-syntax)] section, we may introduce ruleset application in a sequence with other constant and computed expressions, or we may even nest different ruleset applications, where only fragments affected by applied rulesets are calculated and replaced in output, during the inference process. Even though theoretically it wouldn't make much sense, it would be possible for input to be consisted only of constant expressions. In that case, the output of the inference would be exactly the same as the input expression.

Al last, we are able to examine the entire self-sufficient example of evaluating a lambda calculus term by general lambda calculus syntactic and semantic ruleset:

    <<
        (λx.(x x)) ((λx.(x x)) 2)
    >> :: <<
        // untyped lambda calculus
        (
            // semantics
            (
                (
                    // alpha conversion
                    "λ" @x "." @M -> αconv @y "." @M
                ) <- (
                    // declarations
                    ( λterm -> M  ) /\
                    (   var -> x  ) /\
                    (   var -> y  ) /\
                    (    @x -> @y )
                )
            ) /\ (
                (
                    // beta reduction
                    ("(" αconv @x "." @M ")") @N -> @M
                ) <- (
                    // declarations
                    ( λterm -> M  ) /\
                    ( λterm -> N  ) /\
                    (   var -> x  ) /\
                    (    @x -> @N )
                )
            )
        ) <- (
            // syntax
            (                   λterm -> Goal    ) /\
            (       "λ" var "." λterm -> λterm   ) /\
            (           λterm primary -> λterm   ) /\
            (                 primary -> λterm   ) /\
            (           "(" λterm ")" -> primary ) /\
            (                     var -> primary ) /\
            ( /[A-Za-z][_0-9A-Za-z]*/ -> var     )
        )
    >>

With this example whole we conclude section [[2. expression logic](#2-expression-logic)] definition exposure. The following section deals with specific *expression logic* implementation related to sequent calculus.

## 3. implementation

Creation of *expression logic* output is performed in three stages.

1. The first stage converts *expression logic* logical formulas to *sequents* by using basic sequent calculus transformations. Although sequent calculus transformations are usually used to prove theorems by recognizing tautology in each derived *sequent*, we will use the same transformation only to produce a set of normalized *sequents*.
2. The second stage employs produced *sequents* to perform actual inference by a novel, custom created inference algorithm similar to term rewriting. The inference consists of validation if the input expressions conform applied rulesets, possibly reporting an error if it fails to be inferred from the ruleset.
3. The third, and the final stage, includes extraction of an output from the top of the inference roots generated in stage 2.

This section explains all three stages of performing inference in *expression logic.

### 3.1. converting rulesets to sequents

In this section we explain converting *expression logic* logical formulas to *sequents*. Produced *sequents* themselves are trivial enough to reason about and to base the inference algorithm on them, while in the same time rich enough not to complicate the inference process too much.

*Sequent* set is a set of expressions where each expression takes a form of:

    A1, A2, ..., An |- B1, B2, ..., Bn

The left side of [turnstyle symbol](https://en.wikipedia.org/wiki/Turnstile_(symbol)) entails the right side. Atoms to the left of turnstyle symbol are considered a conjunction, while atoms to the right are considered a disjunction.

Priorly to performing inference, our goal is to convert all the *expression logic* logical formulas only to sequents. We start with *expression logic* logical formula, placing it to the right of turnstyle symbol, while leaving empty the left side. That will be our initial expression to acquire *sequent* set using the following rules:

                      A <-> B
    <-> rule:  ----------------------
                (A -> B) /\ (B -> A)
    
    
                   Γ, A /\ B |- Δ                           Γ |- Δ, A /\ B      
    L/\ rule:     ----------------          R/\ rule: --------------------------
                    Γ, A, B |- Δ                       Γ |- Δ, A      Γ |- Δ, B 
    
      
                    Γ, A \/ B |- Δ                           Γ |- Δ, A \/ B 
    L\/ rule: --------------------------      R\/ rule:     ----------------
               Γ, A |- Δ      Γ, B |- Δ                       Γ |- Δ, A, B  
     
     
                    Γ, A -> B |- Δ                           Γ |- Δ, A -> B 
    L-> rule: --------------------------      R-> rule:     ----------------
               Γ, B |- Δ      Γ |- Δ, A                       Γ, A |- Δ, B  


One may freely change the order of the arguments in each side of turnstyle symbol, while `Γ` and `Δ` stand for possible additional arguments. These rules are taken from [logical biconditional](https://en.wikipedia.org/wiki/Logical_biconditional) and [reduction tree](https://en.wikipedia.org/wiki/Sequent_calculus#Reduction_trees) sections on [Wikipedia web site](https://en.wikipedia.org).

Starting with any logical formula in *expression logic*, by a series of steps, the right side of the turnstile can be processed until it includes only atomic symbols. Then, the same is done for the left side. Since every logical operator of *expression logic* appears in one of the rules above, and is omitted by the rule, the process terminates when no logical operators remain: the formula has been decomposed to *sequents* suitable to be used in inference process.

### 3.2. inference process

Finally we come to the part of inferring input expression from *sequents*. After the above conversion of *expression logic* logical formulas, we get the *sequent* set which we use to infer an input expression. Our inference algorithm works in the following way: as a presumption, previously mentioned atom `Goal` has to be exclusively included in the right side of at least one *sequent* from the set. We recursively [abduce](https://en.wikipedia.org/wiki/Abductive_reasoning) from `Goal` atom in a series of inference steps. The initial `Goal` atom is placed to the right, and we follow the inference branching in backwards direction from right to left, while trying to construct the input expression. During the entire construction from `Goal` atom, we are expecting *sequent* left sides to match other *sequent* right sides, and finally, to match parts of the input expression. Naturally, this procedure is taking into consideration that *sequent* left sides may be conjunctions, while *sequent* right sides may be disjunctions.

The inference algorithm is originating from a novel parsing algorithm developed specifically for a purpose of creating *expression logic*. We are extending this parsing algorithm by left-side conjunctions and right-side disjunctions, which reflects *sequents* translated from *expression logic* logic formulas. This extension is promoting the algorithm into logical abduction algorithm, resembling a kind of satisfiability modulo theory solver. The resulting algorithm possesses some positive speed performance and memory usage characteristics relating to possibly even ambiguous guesting rulesets.

#### 3.2.1. correspondence between production rules and logical implication

It may be shown that developing [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)) known from [context-free grammars (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) represents merely a specific sort of logical abduction process. Further, CFG production rules may be extended to a sort of [unrestricted grammar](https://en.wikipedia.org/wiki/Unrestricted_grammar) rules, while resembling a bigger subset of general abductive reasoning. This section discusses a similarity between production rules used in [parsing](https://en.wikipedia.org/wiki/Parsing) and logical implication used in abduction process.

##### notes about production rules

Parsing, syntax analysis, or syntactic analysis is the process of analysing a string of symbols, either in natural language, computer languages or data structures, conforming to the rules of a formal grammar. Within computational linguistics the term is used to refer to the formal analysis by a computer of a sentence or other string of words into its constituents, resulting in a [parse tree](https://en.wikipedia.org/wiki/Parse_tree) showing their syntactic relation to each other, which may also contain semantic and other information.

In formal language theory, a CFG is a certain type of formal grammar: a set of production rules that describe all possible strings in a given formal language. Production rules are simple replacements. For example, the rule

    A → α

where `A` is a string and `α` is a sequence of strings, replaces `A` with `α`. There can be multiple replacement rules for any given value. For example,

    A → α
    A → β

means that `A` can be replaced with either `α` or `β`. The left side of the production rule is always a nonterminal symbol. This means that the symbol does not appear in the resulting formal language. So in our case, our language contains the letters `α` and `β` but not `A`.

Here is an example context-free grammar that describes all two-letter sequences containing the letters α or β.

    S → A A
    A → α
    A → β

If we start with the nonterminal symbol `S` then we can use the rule `S → A A` to turn `S` into `A A`. We can then apply one of the two later rules. For example, if we apply `A → β` to the first `A` we get `β A`. If we then apply `A → α` to the second `A` we get `β α`. Since both `α` and `β` are terminal symbols, and in context-free grammars terminal symbols never appear on the left hand side of a production rule, there are no more rules that can be applied. This same process can be used, applying the last two rules in different orders in order to get all possible sequences within our simple context-free grammar.

Proper construction of more complex grammars for particular purposes is a very broad area of investigation, and we will not go further into those details in this exposure. Interested readers are invited to search the web for *conext free grammar (CFG)*, *Backus-Naur form (BNF)*, and *parsing algorithms* for more information on this matter.

##### the correspondence

Usual context free grammars take a form of `A → α` production rule patterns, where in top-down parsing, we seek for the left production sides to parse the right production sides. Alternations are there expressed by repeating the same *left sides* across multiple production rules. However, this is inconsistent with classical logic expressions where the following rules hold for implication connective:

      A -> B,   A -> C
    ————————————————————
       A -> (B /\ C)


      B -> A,   C -> A
    ————————————————————
       (B \/ C) -> A

Unlike context free grammar rules, in logic, alternations may be formed by repeating the same *right sides* across multiple rules. Therefore, to synchronize our grammar language with logic, we swap positions of production left and right sides. Following the above laws, we provide an alternative form of context free grammar rules:

    α -> A
    
where the left side is a sequence of strings, while the right side is a string, and the whole expression represents classical implication. This way, in top-down parsing we seek for one rule the right rule side to match against another rule the left rule side.

This seems to be enough to perform usual text parsing by utilizing logical inference, proving that `input string -> start symbol` holds. According to this, we are specifically interested in the case of extending the parsing algorithm by all the notions that logical inference includes in its functionality. This is possible by applying the algorithm to *sequents* instead of production rules.

##### additional notes

The correspondence explanation is based on context free grammars that restricts the right side of implication to a single string, not a sequence of strings, but it can also be applied to unrestricted grammars, the most general grammars from [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy). However, *expression logic* does not resemble the exact behavior as usual interpreting unrestricted grammars.

There is one important behavior difference between unrestricted grammars and our approach. In unrestricted grammars, it is possible to combine merely *parts* of neighbour production resolvents to form a base for new production resolvents. Because of this structure-braking behavior, unrestricted grammars are very complicated to use and reason about. To avoid the phrase fragmentation, we are taking another approach: we pose a strict parent-child structure policy where, to produce a parent resolvent, the *whole* child production resolvent, not merely a *part*, should be taken into account when matching production bases. This preserves a general tree structure that is simpler to use and reason about. At the same time, we are retaining [Turing completeness](https://en.wikipedia.org/wiki/Turing_completeness) by incorporating *identifier equivalece* mechanism as a substitute for variables when expressing functions.

#### 3.2.2. v-parse algorithm

    // under construction

#### 3.2.3. v-abduce algorithm

    // under construction

### 3.3. extracting output

In the abduction process, if we can construct the exact form of input expression from the `Goal` atom, we may conclude that *input expression entails the `Goal` atom*, and we use the successful inference branching from the process as a proof of this conclusion. Successful inference branching is then used for extracting the output of the whole process. The output then represents *a proof fragment closest to the `Goal` atom, that is self sufficient to form a whole of continuous string of literals*.

## 4. conclusion

    // under construction - simplicity versus usability?

The essence of *expression logic* is in grounding various user definable languages to outer environment (in a form of processor, operating system, existing programming language, or even web browser technology). Without the outer environment, *expression logic* is pretty much useless, just like speaking doesn't make much sense if there is no one listening. As a part of the interpretation chain, a listener is the one who is responsible for a reaction to *expression logic* output.

Constructing the output supplied to a listener is peformed starting from input expressions associated with logical rulesets, while rulesets internally translate to *sequents* known from sequent calculus. Such simple, yet enough expressive *sequents* are then interpreted by novel inference algorithm that resembles logical abduction. If the input expressions can be abduced rom provided *sequents*, the abduction proof is used as a basis for constructing the output. The then output constitutes a result of a computation associated to input by underlying ruleset.

    // under construction - possible use cases and expected influence to scientific field and software industry
