
    // under construction //
    
    // although sharing similarity with sequent calculus, it provides a different proving procedure (a constructive one)
    
# Introduction to *expression logic* and its implementation

> __*[Intended audience]*__  
> *Beginners in language parsing, term rewriting, and logic deduction*

> __*[Short description]*__  
> *Languages can be seen as descriptions of streams of symbols used to carry on, process, and exchange informations. Expression logic is also a language, but it is a general kind of metalanguage capable of describing and hosting any other language. Expression logic is also able to perform any intermediate data processing upon recognizing hosted language expressions. Being a general kind of metalanguage, expression logic represents all of the following:*
> 
> - *Expression recognizer and generator*  
> - *SMT solver*  
> - *Deductive system*  
> - *Term rewriting framework*  
> - *Metatheory language formalization*  
> 
> *These descriptions render expression logic as a general solution verifier and problem solver, which seems to be a required minimum characteristic to process a wider range of formal languages. In this short exposure, we explore basic principles and reveal initial thoughts behind expression logic.*

> __*[References]*__  
> *[Wikipedia web site](https://en.wikipedia.org)*

## table of contents

- [x] [1. introduction](#1-introduction)  
- [x] [2. expression logic](#2-expression-logic)  
    - [x] [2.1. expression logic syntax](#21-expression-logic-syntax)  
    - [x] [2.2. expression logic semantics](#22-expression-logic-semantics)  
        - [x] [2.2.1. context free grammars](#221-context-free-grammars)
        - [x] [2.2.2. towards turing completeness](#222-towards-turing-completeness)
        - [x] [2.2.3. settling with positive logic](#223-settling-with-positive-logic)
- [ ] [3. implementation](#3-implementation)  
    - [ ] [3.1. converting rulesets to sequents](#31-converting-rulesets-to-sequents)  
    - [ ] [3.2. inference process](#32-inference-process)  
    - [ ] [3.3. extracting output](#33-extracting-output)  
- [ ] [4. conclusion](#4-conclusion)  
        
## 1. introduction

*Expression logic* is an implementation of a [deductive system](https://en.wikipedia.org/wiki/Formal_system#Deductive_system) based on a novel kind of satisfiability modulo theory solver ([SMT solver](https://en.wikipedia.org/wiki/Satisfiability_modulo_theories)). Its ambition is to be able to stand behind functionalities of a wide range of formal languages, and as such, it may be considered as a kind of [metalanguage](https://en.wikipedia.org/wiki/Metalanguage).

There are two important aspects of defining formal languages that *expression logic* aims to cover:

1. defining syntax - flexible textual expression oriented nature of *expression logic* allows to describe a general class of language grammars without posing any restrictions by any means. While different syntax setups may be given merely an aesthetic value, they also have an influence on human understanding of what we are trying to communicate using a formal language. Thus, a well designed syntax of a formal language affects our degree of productivity when using such a language. Syntax in *expression logic* is defined by a set of rules guiding a correct expression formation within the languages terms.  

2. defining semantics - computationally complete nature of *expression logic* allows to translate hosted language expressions to any other formal language expressions, considering such a translation meaningful and possible. In terms of semantics, understanding an expression is related to ability to translate the observed expression to a form that could already be understood by a target environment. As source and target environments may stand for exactly the same medium, the same formalism used for translating may be used for expressing discrete steps in a role of a computation process.  

Nevertheless, in some cases, these aspects of syntax and semantics may lose a clear line of distinction while providing their definitions in a form of [axiomatic system](https://en.wikipedia.org/wiki/Axiomatic_system). Thus, in *expression logic*, both of syntax and semantic aspects are defined by the same form of [term rewriting](https://en.wikipedia.org/wiki/Rewriting) rules.

From a certain point of view, *expression logic* represents a rule-based term rewriting system in a logic disguise. Appearance of *expression logic* code resembles a classical logic without negation. Logical expressions, upon invoking inference engine, are normalized to a set of very simple production rules (axioms in a form of sequents) used to carry on the entire inference process.

The rules, when (even recursively) applied to each other, assemble possibly infinite set of all expressions that belong to defined formal language. Validating an external input expression then represents recognizing exact expression instance from that set. As an outcome of this procedure, problem solving becomes outputting specific expression instance that lays between rule development starting point and finally recognized input expression.

Provided the planned functionality, *expression logic* may cover a broad area of possible applications:

- deductive reasoning about arbitrary formal language expressions (for example, program correctness indication)  
- general problem solving, performing solution extraction from initial problem setups (for example, program execution)  
- translating between arbitrary formal language source and target environments (for example, program compiling)  

A range of use of this kind is something we may already expect from a rule-based deductive system. Certainly, *expression logic* may find its use in less demanding tasks such as implementing a compiler for template based graphical user interface language. But its full potential may be unleashed only in systems that include automated decision making processes, like in symbolic artificial intelligence systems. However, symbolic artificial intelligence is still being an open research domain. Thus we shouldn't disregard some less ambitious uses including formalizing different scientific fields, taking advatage of their mutual interaction to produce results of our interests.

## 2. expression logic

Probably the clearest analogy to *expression logic* is that it may be seen as a form of a deductive system adjusted to operate on strings of characters. Let's shortly overview the most used deductive systems in area of logical inference. [Hilbert style deduction](https://en.wikipedia.org/wiki/Hilbert_system), [natural deduction](https://en.wikipedia.org/wiki/Natural_deduction), and [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus) all belong to a class of deductive systems. They are characterized by respectively increasing number of included primitive logical operators. Hilbert style deduction incorporates only [implication](https://en.wikipedia.org/wiki/Material_conditional) where all injected rules take a form of `A -> B`. Natural deduction adds [conjunction](https://en.wikipedia.org/wiki/Logical_conjunction) to the left implication side, so that rules take a form of `A1 /\ A2 /\ ... /\ An -> B`. Sequent calculus further extends the basic language by including right side [disjunction](https://en.wikipedia.org/wiki/Logical_disjunction), like in `A1 /\ A2 /\ ... /\ An -> B1 \/ B2 \/ ... \/ Bn`.

The price paid for the simple syntax of Hilbert-style deduction is that complete formal proofs tend to get extremely long. In contrast, more complex syntax like in natural deduction or sequent calculus leads to shorter formal proofs. This difference in proof lengths exists because often, on higher levels of abstraction, we would want to use the benefits of conjunction and disjunction constructs. Since Hilbert-style deduction doesn't provide these constructs as primitive operators, we would have to bring their explicit definitions into the implicational proof system, which is not needed in a case of sequent calculus. Analogous judgement may be also brought in comparing natural deduction to sequent calculus.

In contrast to Hilbert style deduction and natural deduction, sequent calculus comes in a package with a full set of mappings from basic [logical connectives](https://en.wikipedia.org/wiki/Logical_connective) to uniform [*sequents*](https://en.wikipedia.org/wiki/Sequent). Logic operators appear natural enough to be fluently used in defining various languages, while *sequents* appear simple enough to be reasoned about, which are both important qualities for choosing a base for underlying inference algorithm. One may say that sequent calculus characteristic mappings from logical connectives to sequents may seem imbued with elegant symmetry. Lack of these mappings in cases of Hilbert style deduction and natural deduction is compensated by non-primitive definitions of logical connectives, but we take a stand that those definitions do not reflect the elegance found in sequent calculus mappings.

Although sequent calculus, comparing to Hilbert style deduction and natural deduction, may not seem like the simplest solution on first sight, we find it reasonable to base *expression logic* precisely on sequent calculus because in the long run, benefits seem to be worth the effort. After all, the simplistic duality elegance of sequent calculus transformations seem too valuable to be left aside in a favor of simpler systems. We are taking a stand that the mentioned duality deserves a special treatment which sequent calculus provides us with by its definition. Thus, we choose sequent calculus as a foundation basis for defining languages and performing inference in *expression logic*.

By the definition, *expression logic* extends a subset of sequent calculus (precisely, sequent calculus without negation) to operate on strictly scoped rulesets. Further, individual rulesets are strictly determined to which input segments they apply. If an input expression is conforming related ruleset, the same ruleset is considered as basis for constructing an output expression, replacing segments of related input. Such output is then left for processing to an output environment such as processor, operating system, arbitrary programming language environment, or even a web browser.

To that extent, the essence of *expression logic* is in translating between user-defined formal language and already existing language of output environment. This conforms to a presumption that, generally speaking, semantics of user defined formal language may be considered as merely a ruleset for translation to an output language that is already understood by output environment.

In this section we introduce a mechanism which *expression logic* is using to perform such a translation. Moreover, while performing such a translation, we may carry out any computational process represented by an inference mechanism analogous to deductive reasoning supported by *expression logic*. Let's start with *expression logic* syntax, then move on to its semantics.

### 2.1. expression logic syntax

In computer science, the [syntax](https://en.wikipedia.org/wiki/Syntax_(programming_languages)) of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language.

While forming syntax of *expression logic*, an attempt was made in finding a right balance between syntax simplicity and actual language intuitional usability. Although possible, simpler syntax would expose lesser number of semantically more complicated essential rules, thus we opted for more optimal greater number of simpler essential rules that are easier to understand, learn, and finally use. Still, comparing to potentially unlimited complexity syntaxes of languages it can host, one may say that *expression logic* syntax takes a relatively simple form.

[Formal grammar](https://en.wikipedia.org/wiki/Formal_grammar) of *expression logic* may be represented by the following, relaxed kind of [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) notation:


         start := logic
         
         logic := identifier : atom . logic
                | sequence <-> logic
                | sequence -> logic
                | sequence \/ logic
                | sequence /\ logic
                | sequence
                
      sequence := primary _ sequence
                | primary sequence
                | primary

       primary := (logic)
                | atom

          atom := identifier
                | literal

Precedence is defined as folows, from lowest to highest: `<->`, `->`, `\/`, `/\`. Binary logical operators `->` and `<->` associate to the right, while other logical binary operators are commutative. `expression` and `sequence` a posteriori inference associate in a way it is defined by applied rulesets, and may be rendered as ambiguous constructs if defined in a such way by logic rules.

Atoms in sequences may be delimited by a whitespace or a `_` character. When atoms are delimited by a whitespace, they are expected to be optionally delimited by whitespace in input expressions. When atoms are delimited by `_` characters, they are expected to be connected in input without whitespace.

Identifiers are strings of characters beginning with letters and containing letters or numbers while literals are strings of characters enclosed within double quotes.

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to humans, and may be placed wherever a whitespace is expected. Single line comments are introduced by `//`, and reach until the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

### 2.2. expression logic semantics

The essence of *expression logic* inference mechanism is in translating input string to output string. To examine how the inference mechanism works, let's imagine a waterfall. The `goal` atom is placed at the waterfall source (figure 1). The waterfall splits downwards connecting identifiers and literals using asserted rules. The waterfall may form any number of lakes towards its bottom where lakes represent literals. These lakes may be continuous in a sense that they represent sequences composed only of literals. Valid input to *expression logic* depends on asserted rules, and it stands for any continuous lake below the `goal` atom (figure 2). In this configuration, an output represents a continuous lage between input and `goal` atom which is closest to the `goal` atom (figure 3). It is posssible that output equals to input if there is no continuous string of literals upwards from the input. In short, we connect literals from input to output using rules in the following setup: `a continuous lake (input string) → ... → the topmost continuous lake (output string) → ... → waterfall source (goal)`.

                 Goal                          Goal                          Goal
                  /\                            /\                            /\ 
                 /\/\                          /\/\                          /\/\ 
                /\/\/\                        /\/\/\                        /\/\/\ 
               /\/\/\/\                      /\/\/\/\                      -output-
              /\/\/\/\/\                    /\/\/\/\/\                    /\/\/\/\/\ 
             /\/\/\/\/\/\                  /\/\/\/\/\/\                  /\/\/\/\/\/\ 
            /\/\/\/\/\/\/\                /\/\/\/\/\/\/\                /\/\/\/\/\/\/\ 
           /\/\/\/\/\/\/\/\              -----input------              -----input------
          /\/\/\/\/\/\/\/\/\            /\/\/\/\/\/\/\/\/\            /\/\/\/\/\/\/\/\/\ 
         /\/\/\/\/\/\/\/\/\/\          /\/\/\/\/\/\/\/\/\/\          /\/\/\/\/\/\/\/\/\/\ 
        /\/\/\/\/\/\/\/\/\/\/\        /\/\/\/\/\/\/\/\/\/\/\        /\/\/\/\/\/\/\/\/\/\/\ 
                 ....                          ....                          ....
                 
               figure 1                      figure 2                      figure 3

Using *expression logic* language may be guided in various ways, while specific approaches may turn into a real work of art. In this section, we examine a usage of certain logic constructs which may be utilized to restrain interpretation of input in a certain predictive way.

#### 2.2.1. context free grammars

Context free grammars provide means of defining input language alphabet, and are consisted of [productions](https://en.wikipedia.org/wiki/Production_(computer_science)). Productions in context free grammars are consisted of left side identifiers and right side sequences of identifiers and literals. To express production rules in *expression logic*, we map them to a conjunction of respective implications, swapping left and right sides of each production. For example, we may form the following grammar:

        /*
            human verification
        */
        
        ( person "is a human" -> goal ) /\
        
        ( "Jane" -> person ) /\
        ( "John" -> person ) /\
        ( "Jill" -> person )

In terms of *expression logic, this grammar may accept exactly three different forms of input: `Jane is a human`, `John is a human`, and `Jill is a human`. Inference engine climbs up the rule tree until it reaches the `goal` atom when it concludes correctness of input. The output of this example is the exact input string because it is at the same time the topmost continuous sequence of literals.

Context free grammars are very expressive constructs, and they formation may be a subject of thorough study. Interested readers are invited to search the web for more information on context free grammars.

#### 2.2.2. towards turing completeness

When a language is said to be [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), that means it poses no restrictions on its computability capability. *Expression logic* is Turing complete language, and it achieves Turing completeness by extending context free grammar production rules by two constructs: left side sequences and variables (remember that productions are written in *expression logic* in reverse). Using these extensions, we may turn *expression logic* implications to functions representing the essence of Turing completeness.

We can illustrate this behavior by an example:

        /*
            title decision
        */
        
        ( title person -> goal ) /\
        
        ( "astronaut" -> title ) /\
        (   "fireman" -> title ) /\
        (    "doctor" -> title ) /\
        
        ( "Jane" -> person ) /\
        ( "Jill" -> person ) /\
        ( "John" -> person ) /\
        
        ( P:person . ( P "drives rocket" -> "astronaut" P ) ) /\
        ( P:person . ( P "puts out fire" -> "fireman" P   ) ) /\
        ( P:person . (  P "heals people" -> "doctor" P    ) )

In this example, we attached varibles to some formulas using notation `variable:domain . formula`. To digress, we may use multiple variables on the same formula, like in: `X1:Domain1 . X2:Domain2 . ... . formula involving X1, X2, ...`. An input to this example may be a statement that Jane, Jill, or John drives rocket, puts out fire, or heals people. Inference engine climbs up the rule tree and conlcludes that Jane, Jill, or John has a title of being is an astronaut, firman or doctor. For example, an input `Jill heals people` yields the output `doctor Jill`.

Within this example we are only scratching the surface of everything that is possible using functions. Functions may represent complex logic or arithmetic formations, or even programming functions capable of computing any result, without any constraints. Functions may even be recursive, in which case we should take responsibility for taming pitfalls like infinite recursions.


#### 2.2.3. settling with positive logic

Although constructs we have learned about by now are computationally complete, because of reasons already stated in this exposure, we choose to extend our language by two important constructs: implications with left-side conjunctions and right-side disjunctions. As we will se later, in section [3. implementation], all other *expression logic* formulas may be reduced to these constructs.

As an example of right side disjunctions, we bring the following example:

        /*
            educational system decision
        */
        
        ( person "is in educational system" -> goal ) /\
        
        ( "Jane" -> person ) /\
        ( "Jill" -> person ) /\
        ( "John" -> person ) /\
        
        ( P:person . ( P "attends kindergarten" -> P "is in educational system"                   ) ) /\
        ( P:person . (       P "attends school" -> P "is in educational system"                   ) ) /\
        ( P:person . (   P "is being eduacated" -> P "attends kindergarten" \/ P "attends school" ) )

Within this example, passing an input `Jill is being educated` would yield the output `Jill is in educational system`. It takes a bit of logical speculation to understand why this input manages to climb up the inference tree, reaching the `goal` atom. Namely, expressions like `(a -> c) /\ (b -> c)` are equal to `(a \/ b) -> c`. This fact provides a fundamental reasoning for reaching the `goal` atom.

As an example of left side conjunctions, we bring the following example:

        /*
            computer expert decision
        */
        
        ( person "is a computer expert" -> goal ) /\
        
        ( "Jane" -> person ) /\
        ( "Jill" -> person ) /\
        ( "John" -> person ) /\
        
        ( P:person . ( P "masters software" /\ P "masters hardware" -> P "is a computer expert" ) ) /\
        ( P:person . (                           P "builds a robot" -> P "masters software"     ) ) /\
        ( P:person . (                           P "builds a robot" -> P "masters hardware"     ) )

Within this example, passing an input `Jill builds a robot` would yield the output `Jill is a computer expert`. It takes a bit of logical speculation to understand why this input manages to climb up the inference tree, reaching the `goal` atom. Namely, expressions like `(c -> a) /\ (c -> b)` are equal to `c -> (a /\ b)`. This fact provides a fundamental reasoning for reaching the `goal` atom.

Seeing these examples, it becomes clear why we chose to care only about implications with left-side conjunctions and right-side disjunctions: it is because left-side disjunctions and right-side conjunctions may be represented by conjunctions of plain implications. In a similar way, implications placed at the left or right sides of other implications may be reduced to plain implications, as shown in section [3. implementation].

Here we conclude section [[2. expression logic](#2-expression-logic)] definition exposure. The following section deals with specific *expression logic* implementation related to sequent calculus.

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

Priorly to performing inference, our goal is to convert all the *expression logic* logical formulas to only sequents. We start with *expression logic* logical formula, placing it to the right of turnstyle symbol, while leaving the left side empty. That will be our initial expression to acquire normalized *sequent* set using the following rules:

                      A <-> B
    <-> rule:  ----------------------
                (A -> B) /\ (B -> A)
    
    
                   Γ, A /\ B |- Δ                             Γ |- Δ, A /\ B      
    L/\ rule:     ----------------            R/\ rule: --------------------------
                    Γ, A, B |- Δ                         Γ |- Δ, A      Γ |- Δ, B 
    
      
                    Γ, A \/ B |- Δ                             Γ |- Δ, A \/ B 
    L\/ rule: --------------------------      R\/ rule:       ----------------
               Γ, A |- Δ      Γ, B |- Δ                         Γ |- Δ, A, B  
     
     
                    Γ, A -> B |- Δ                             Γ |- Δ, A -> B 
    L-> rule: --------------------------      R-> rule:       ----------------
               Γ, B |- Δ      Γ |- Δ, A                         Γ, A |- Δ, B  


One may freely change the order of the arguments in each side of turnstyle symbol, while `Γ` and `Δ` stand for possible additional arguments. These rules are taken from [logical biconditional](https://en.wikipedia.org/wiki/Logical_biconditional) and [reduction tree](https://en.wikipedia.org/wiki/Sequent_calculus#Reduction_trees) sections on [Wikipedia web site](https://en.wikipedia.org).

Starting with any logical formula in *expression logic*, by a series of steps, the right side of the turnstile can be processed until it includes only atomic symbols. Then, the same is done for the left side. Since every logical operator of *expression logic* appears in one of the rules above, and is omitted by the rule, the process terminates when no logical operators remain: the formula has been decomposed to *sequents* suitable to be used in inference process.

### 3.2. inference process

Finally we come to the part of inferring input expression from *sequents*. After the above conversion of *expression logic* logical formulas, we get the *sequent* set which we use to infer an input expression. Our inference algorithm works in the following way: as a presumption, previously mentioned atom `goal` has to be exclusively included in the right side of at least one *sequent* from the set. We recursively [abduce](https://en.wikipedia.org/wiki/Abductive_reasoning) from `goal` atom in a series of inference steps. The initial `goal` atom is placed to the right, and we follow the inference branching in backwards direction from right to left, while trying to construct the input expression. During the entire construction from `goal` atom, we are expecting *sequent* left sides to match other *sequent* right sides, and finally, to match parts of the input expression. Naturally, this procedure is taking into consideration that *sequent* left sides may be conjunctions, while *sequent* right sides may be disjunctions.

We present creation of the inference algorithm in three successive versions, each extending the previous one, introducing more general level of expressivity:

1. **v-parse-crux** algorithm handles context free grammar equivalent subset of the abduction process
2. **v-parse-plus** algorithm extends the original algorithm to handle right side sequences of atoms, together with variables notation.
3. **v-parse-star** algorithm finally extends the previous one to handle left side conjunctions and right side disjunctions.

Version (1) is the simplest one, and may be compared to the current mainstream status of parsing technology. Version (2) with its extensions already brings in the Turing completeness. Version (3) is the final algorithm version, supporting complete interpretation of normalized sequents. Although one may argue that version (3) may not be unconditionally necessary because version (2) is already Turing complete, we are taking the stand that introduction of conjunction and disjunction connectives greatly simplifies formalization of different systems, and we decide to keep it as a core part of the inference system.

##### v-parse-crux algorithm

It is time to describe *v-parse-crux* algorithm that parses input text against context free grammar rules. The version of algorithm presented in this section distinguishes between terminals and non-terminals. Input text is expected to be [lexed](https://en.wikipedia.org/wiki/Lexical_analysis) into an array of words prior to actual parsing.

    FUNCTION Parse (grammar, start, words)
        DECLARE chart := [][];
        MergeItem (0, [start, END_OF_FILE], 0, {Sequence: [], Index: -1, Inherited: [], Inheritors: [], Parents: [], Previous: []}, null);
        FOR each new column in chart DO
            FOR each new item in column DO
                FOR each production in grammar WHERE item.Sequence[item.Index] == production.Right DO
                    MergeItem (column.Index, production.Left, 0, item);

        RETURN MakeAst ();

        PROCEDURE MergeItem (offset, sequence, index, parent, previous)
            DECLARE item := chart[offset].FIND (sequence, index);
            IF not found item THEN
                item := {Sequence: sequence, Index: index, Inherited: [], Inheritors: [], Parents: [], Previous: []};
                chart[offset].ADD (item);

            IF previous not in item.Previous THEN
                item.Previous.push (previous);

            IF parent not in item.Parents THEN
                item.Parents.ADD (parent);
                IF item.index + 1 < item.sequence.length THEN
                    IF item.Sequence[item.Index] is terminal at words[offset] THEN
                        MergeItem (offset + 1, item.sequence, item.index + 1, parent);

                FOR each x in [parent] UNION parent.Inherited DO
                    FOR each y in [item] UNION item.Inheritors DO
                        IF y.Index + 1 == y.Sequence.LENGTH THEN
                            IF (x.Sequence, x.Index) not in y.Inherited THEN
                                y.Inherited.ADD (x);
                                x.Inheritors.ADD (y);

                            IF x.Index + 1 < x.Sequence.LENGTH THEN
                                IF y.Sequence[y.Index] is terminal at words[offset] THEN
                                    FOR each z in x.Parents DO
                                        MergeItem (offset + 1, x.Sequence, x.Index + 1, x.Parents[z]);

        FUNCTION MakeAST ()
            DECLARE item := chart[words.LENGTH].FIND (END_OF_FILE);
            IF not found item THEN
                RETURN "Error at: " + Chart.LENGTH;
                
            DECLARE parents := [];
            DO
                IF item.Index > 0 THEN
                    item := item.Previous[0];
                    childTreeItem := {Sequence: [], Index: -1};
                
                ELSE
                    item := item.Parent;
                    childTreeItem := treeItem;
                
                IF childTreeItem.Index == childTreeItem.Sequence.LENGTH - 1 THEN
                    parents.ADD ({Sequence: item.Sequence, Index: item.Index, Children: []});
                
                treeItem := parents.LAST;
                treeItem.Children[childTreeItem.Index] := childTreeItem;
                
                IF childTreeItem.Index == 0 THEN
                    parents.REMOVE_LAST ();
                
            WHILE parents.LENGTH > 0;
            
            RETURN treeItem;

This algorithm is a chart based algorithm that groups parsing items into columns. Columns correspond to offsets from the beginning of input sequence. Columns are incrementally processed, never looking back into the previous columns in the chart. Algorithm stores generated items in the chart as pairs of a sequence and an index of the sequence element. This way it is always possible to know what is ahead element of the current item (we just increment the index attribute by one) without looking to back columns.

The main function `Parse` serves as a loop over chart columns, productions and their alternations. The loop functions as a [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) to reach all the tokens relative to `start` symbol. It repeatedly calls `MergeItem` procedure to populate the chart onwards. `MergeItem` procedure creates a new item in appropriate column determined by `offset` only if an item with similar `Sequence` and `Index` attributes doesn't already exist in that column. If the item exists, its data is accumulated by a newly introduced `parent` value. The algorithm ends when it visits all the populated columns in the chart.

    ...

The algorithm exhibits very well behavior regarding to parsing possibly ambiguous grammars when encountering multiple replacement rules for a single value. After parsing, if `END_OF_FILE` starting sequence element can be found at the first column offset behind the last input token, the parsing is considered successful. If a parsing error occurs, `END_OF_FILE` will not be placed at appropriate place, and then the produced chart may be additionally analyzed for errors. Thus, in the case of an error, it may be relatively simple to output *"Expected expression `E` at offset `N`"* error forms by observing only the last populated column in the resulting chart.

##### v-parse-plus algorithm

We will allow a bit more of necessary complexity

    // under construction //

##### v-parse-star algorithm

The final touch to support sequents
    
    // under construction //

### 3.3. extracting output

In the abduction process, if we can construct the exact form of input expression from the `goal` atom, we may conclude that *input expression entails the `goal` atom*, and we use the successful inference branching from the process as a proof of this conclusion. Successful inference branching is then used for extracting the output of the whole process. The output then represents *a proof fragment closest to the `goal` atom, that is self sufficient to form a whole of continuous string of literals*.

    // under construction //

## 4. conclusion

    // under construction - simplicity versus usability? //

The essence of *expression logic* is in grounding various user definable languages to outer environment (in a form of processor, operating system, existing programming language, or even a web browser). Without the outer environment, *expression logic* is pretty much useless, just like speaking doesn't make much sense if there is no one listening. As a part of the interpretation chain, a listener is the one who is responsible for a reaction to *expression logic* output.

Constructing the output supplied to a listener is peformed starting from input expressions associated with logical rulesets, while rulesets internally translate to *sequents* known from sequent calculus. Such simple, yet enough expressive *sequents* are then interpreted by novel inference algorithm that resembles logical abduction. If the input expressions can be abduced from provided *sequents*, the abduction proof is used as a basis for constructing the output. The output then constitutes a result of a computation associated to input by underlying ruleset.

    // under construction - possible use cases and expected influence to scientific field and software industry //
    
