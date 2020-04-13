# Esperas

*[Abstract]*  

*(under construction) Esperas will be a library for implementing arbitrary metalanguages. Our starting point is handling context free grammars by a novel v-parser algorithm. Then we introduce a couple of extensions to the original algorithm to arrive at supporting a kind of Turing complete grammars, aiming at relative simplicity of use and resulting output tree clarity in a way similar to constructive theorem proving.*

## contents

- [x] [1. introduction](#1-introduction)  
- [ ] [2. building a Turing complete grammar language](#2-basic-context-free-grammar-parsing-algorithm)
    - [x] [2.1. context free grammars](#21-context-free-grammars)  
        - [x] [2.1.1. pseudocode 1](#211-pseudocode-1)  
    - [x] [2.2. right side phrases](#22-right-side-phrases)  
        - [x] [2.2.1. pseudocode 2](#221-pseudocode-2)  
    - [ ] [2.3. variables](#23-variables)  
        - [ ] [2.3.1. pseudocode 3](#231-pseudocode-3)  
- [ ] [3. use case: extense framework](#3-use-case-extense-framework)  
    - [ ] [3.1. classical logic](#31-classical-logic)  
    - [ ] [3.2. lambda calculus](#32-lambda-calculus)  
    - [ ] [3.3. Turing machines](#33-turing-machines)  
- [ ] [4. implementation](#4-implementation)  

## 1. introduction

*Esperas* is born as an implementation attempt in a process of developing universal computational language. As we are trying to provide a method to describe any computational or descriptional language, *Esperas* will try to tame the very notion of [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) that could be used as a platform to host an arbitrary language. Also, *Esperas* will try to retain independency from any particular language as much as possible, and may be used as a multi-purpose programming library.

Although we will focus from the start on defining general syntactical properties, the road will finally lead us to defining general semantical properties of set of languages definable in *Esperas*. In our approach, syntax will lose a clear distinction from semantics because certain syntax properties require computational completeness we may only find in semantic definitions. Success of pairing provided grammars with input texts thus depends on supported grammar expressiveness that may even reach for sofisticated computational complexities like in [type checking](https://en.wikipedia.org/wiki/Type_system) or [formal verification](https://en.wikipedia.org/wiki/Formal_verification), under umbrella of [automated theorem proving](https://en.wikipedia.org/wiki/Automated_theorem_proving).

## 2. building a Turing complete grammar language

Our starting point this section will be processing [context-free grammars (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) by a novel *v-parser* algorithm. Further development in this section describes a couple of extensions to the basic *v-parser* algorithm that aspire to establish more promising ratio of grammar applicability versus grammar complexity, while finally achieving [Turing completeness](https://en.wikipedia.org/wiki/Turing_completeness).

### 2.1. context free grammars

[Parsing, syntax analysis, or syntactic analysis](https://en.wikipedia.org/wiki/Parsing) is the process of analysing a string of symbols, either in natural language, computer languages or data structures, conforming to the rules of a formal grammar. Within computational linguistics the term is used to refer to the formal analysis by a computer of a sentence or other string of words into its constituents, resulting in a [parse tree](https://en.wikipedia.org/wiki/Parse_tree) showing their syntactic relation to each other, which may also contain semantic and other information.

In formal language theory, a [context-free grammar (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) is a certain type of formal grammar: a set of [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)) that describe all possible strings in a given formal language. Production rules are simple replacements. For example, the rule

    A -> α

where `A` is a string and `α` is a sequence of strings, replaces `A` with `α`. There can be multiple replacement rules for any given value. For example,

    A -> α
    A -> β

means that `A` can be replaced with either `α` or `β`. The left side of the production rule is always a nonterminal symbol. This means that the symbol does not appear in the resulting formal language. So in our case, our language contains the letters `α` and `β` but not `A`.

Here is an example context-free grammar that describes all two-letter sequences containing the letters α or β.

    S -> A A
    A -> α
    A -> β

If we start with the nonterminal symbol `S` then we can use the rule `S -> A A` to turn `S` into `A A`. We can then apply one of the two later rules. For example, if we apply `A -> β` to the first `A` we get `β A`. If we then apply `A -> α` to the second `A` we get `β α`. Since both `α` and `β` are terminal symbols, and in context-free grammars terminal symbols never appear on the left hand side of a production rule, there are no more rules that can be applied. This same process can be used, applying the last two rules in different orders in order to get all possible sequences within our simple context-free grammar.

Usual context free grammars take form of `A -> α` production rule patterns, where in top-down parsing we seek for the left production sides to parse the right production sides. Alternations are there expressed by repeating the same *left sides* across multiple production rules. However, this is inconsistent with classical logic expressions where the following rules hold for implication connective:

      A -> B,   A -> C
    ————————————————————
       A -> (B /\ C)


      B -> A,   C -> A
    ————————————————————
       (B \/ C) -> A

Unlike context free grammar rules, in logic, alternations may be formed by repeating the same *right sides* across multiple rules. Therefore, to synchronize our grammar language with logic, we will swap positions of left and right sides of productions. Following the above laws, we provide the alternative form of context free grammar rules that now take the following form:

    α -> A
    
where the left side is a sequence of strings, while the right side is a string. This way, in top-down parsing we seek for the right rule sides to parse the left rule sides, while we express alternations by repeating the same right sides across multiple rules. Aligning production formation operator to classical logic will also allow us to write more naturally expressions that may correspond to classical function definitions, as we will see in later sections.

Proper construction of more complex grammars for particular purposes is a very broad area of investigation, and we will not go further into those details in this exposure. Interested readers are invited to search the web for *conext free grammar (CFG)* and *Backus-Naur form (BNF)* for more information on this matter.

#### 2.1.1. pseudocode 1

This is *v-parser* algorithm that parses input text against context free grammar rules. The version of algorithm presented in this section does not distinguish between terminals and non-terminals, thus enabling input text also to contain non-terminals. Input text is also expected to be [lexed](https://en.wikipedia.org/wiki/Lexical_analysis) into an array of tokens prior to actual parsing.

    01 FUNCTION Parse (grammar, start, input)
    02     tokens := input;
    03     chart := [][];
    04     MergeItem (0, [start, END_OF_FILE], 0, null);
    05     FOR each new column in chart DO
    06         FOR each new item in column DO
    07             FOR each production where item.Sequence[item.Index] == production.Right in grammar DO
    08                 MergeItem (column.Index, production.Left, 0, [item]);
    09 
    10     RETURN {Chart: chart, Success: (is END_OF_FILE in chart[input.LENGTH]?)};
    11 
    12     PROCEDURE MergeItem (offset, sequence, index, parents)
    13         item := chart[offset].FIND (sequence, index);
    14         IF not found item THEN
    15             item := {Sequence: sequence, Index: index, Inherited: [], Inheritors: [], Parents: []};
    16             chart[offset].ADD (item);
    17 
    18         FOR each parent in parents DO
    19             IF parent not in item.Parents THEN
    20                 item.Parents.ADD (parent);
    21                 FOR each x in [parent] UNION parent.Inherited DO
    22                     FOR each y in [item] UNION item.Inheritors DO
    23                         IF y.Index + 1 == y.Sequence.LENGTH
    24                             IF (x.Sequence, x.Index) not in y.Inherited THEN
    25                                 x.Inheritors.ADD (y);
    26                                 y.Inherited.ADD (x);
    27
    28                         IF x.Index + 1 < x.Sequence.LENGTH THEN
    29                             IF y.Sequence[y.Index] == tokens[offset] THEN
    30                                 MergeItem (offset + 1, x.Sequence, x.Index + 1, x.Parents);

This algorithm is a chart based algorithm that groups parsing items into columns. Columns correspond to offsets from the beginning of input sequence. Columns are incrementally processed, never looking back into the previous columns in the chart. Algorithm stores generated items in the chart as pairs of a sequence and an index of the sequence element. This way it is always possible to know what is ahead element of the current item (we just increment the index attribute by one).

The main function `Parse` serves as a loop over chart columns, productions and their alternations. The loop functions as a [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) to reach all the tokens relative to `start` symbol. It repeatedly calls `MergeItem` procedure to populate the chart onwards. `MergeItem` procedure creates a new item in appropriate column determined by `offset` only if an item with similar `Sequence` and `Index` attributes doesn't already exist in that column. If the item exists, its data is accumulated by a newly introduced `parent` value. The algorithm ends when it visits all the populated columns in the chart.

The essence of the algorithm may be found in merging passed items to existing column items. When the passed item is merged, it looks up all the accumulated parents inside `Inherited` attribute (line 21), and tries to merge their successors (line 30) to all the children of the existing item inside `Inheritors` attribute (line 22). To do this, the algorithm tracks what is to be merged and where it is supposed to be merged for each item (lines 25-26). Of course, if we want this merging to take a place, there are some conditions to be met:

1. (line 23) the index of items in children has to be equal to the children sequences lengths (parent sucessor is allowed to apply);
2. (line 24) items from the first loop that are already processed as a value of `Inherited` attribute are ignored;
3. (line 28) the index of successors in parents has to be less than the parents sequences lengths (there is an available parent successor);
4. (line 29) the last condition takes care of scheduling the next item to be breadth-first searched only if item from the second loop matches input token at given offset.

When inserting a new item that has no match at specified column, in the second `FOR` loop of `MergeItem` procedure, we consider only inserted item instead of the whole `Inheritors` range. This occurs naturally because `Inheritor` attribute of new items is declared empty.

The algorithm exhibits very well behavior regarding to parsing possibly ambiguous grammars when encountering multiple replacement rules for a single value. After parsing, if `END_OF_FILE` starting sequence element can be found at the first column offset behind the last input token, the parsing is considered successful. If a parsing error occurs, `END_OF_FILE` will not be placed at appropriate place, and then the produced chart may be additionally analyzed for errors. In the case of an error, it may be relatively easy to output *"Expected expression `X` at offset `Y`"* error forms by observing only the last populated column in the resulting chart.

### 2.2. right side phrases

Incorporating the whole phrases to production rules right sides, the rewriting rules take the form:

    β -> α

where `β` and `α` are sequences of strings. Definition of this type of grammars and their ability to develop `α` sides of rules towards `β` side input sequences is similar to the modified context-free grammars definition, except that the `α` sides may also be sequences of strings. Of course, like in context-free grammars, it is possible to produce ambiguous grammars when there are multiple productions with the similar right side phrases. Again, we begin the process of parsing by providing the initial starting right-side phrase which we develop towards left-sides according to production rules.

There is one important behavior that makes our approach different from [unrestricted grammars](https://en.wikipedia.org/wiki/Unrestricted_grammar) (see type-0 grammar in [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy)). In unrestricted grammars, it is possible to combine merely *parts* of neighbour production resolvents to form a single base for new production resolvents. Although this behavior is what makes unrestricted grammars Turing complete, because of this behavior, unrestricted grammars are very complicated to reason about. To avoid this phrase fragmentation, we take another approach: we pose a strict parent-child structure policy where, to produce a parent resolvent, the whole child, or a whole of all neighbour children formation should be taken into account when matching production bases. This preserves a general tree structure that is simple to reason about.

Because of this adjustment, although introducing right side phrases still does not make our approach Turing complete on its own, it is an imortant step towards building a Turing complete framework. Introducing a notion of variables a bit later, the following sections will make our framework Turing complete while retaining structuring of the wholes as strict parent-child relations.

#### 2.2.1. pseudocode 2

Here we bring changes to pseudocode 1 to allow processing right side phrases.

    01 FUNCTION Parse (grammar, start, input, rec := [])
    02     tokens := input;
    03     chart := [][];
    04     MergeItem (0, start UNION [END_OF_FILE], 0, null);
    05     FOR each new column in chart DO
    06         FOR each new item in column DO
    07             DoMatch ([item.Sequence[item.Index]], [item], {Start: start, Match: item.Sequence[item.Index], Offset: column.Index});
    08             IF item.Index == 0 and item.Sequence.LENGTH > 1 THEN
    09                 DoMatch (item.Sequence, item.parents, {Start: start, Match: item.Sequence, Offset: column.Index});
    10
    11     RETURN {Chart: chart, Success: (is END_OF_FILE in chart[input.LENGTH]?)};
    12 
    13     PROCEDURE DoMatch (match, parents, recItem)
    14         IF recItem not in rec THEN
    15             FOR each production in grammar DO
    16                 IF match equals production.Right or (Parse (grammar, match, production.Right, [recItem] UNION rec)).Success is true THEN
    17                     MergeItem (column.Index, production.Left, 0, parents);
    18
    19     PROCEDURE MergeItem (offset, sequence, index, parents)
    20         item := chart[offset].FIND (sequence, index);
    21         IF not found item THEN
    22             item := {Sequence: sequence, Index: index, Inherited: [], Inheritors: [], Parents: []};
    23             chart[offset].ADD (item);
    24 
    25         FOR each parent in parents DO
    26             IF parent not in item.Parents THEN
    27                 item.Parents.ADD (parent);
    28                 FOR each x in [parent] UNION parent.Inherited DO
    29                     FOR each y in [item] UNION item.Inheritors DO
    30                         IF y.Index + 1 == y.Sequence.LENGTH
    31                             IF (x.Sequence, x.Index) not in y.Inherited THEN
    32                                 x.Inheritors.ADD (y);
    33                                 y.Inherited.ADD (x);
    34 
    35                         IF x.Index < x.Sequence.LENGTH THEN
    36                             IF y.Sequence[y.Index] == tokens[offset] THEN
    37                                 MergeItem (offset + 1, x.Sequence, x.Index + 1, x.Parents);

The code changes are visible in the main loop (lines 7-9) that now call `DoMatch` procedure (lines 13-17) twice, once for specific sequence item, and once for the whole sequence. `DoMatch` procedure tries to match parts or entire left rule sides to the right rule sides. In a case of parts, it is enough to graphically test match equivalence, but in a case of entire phrases, the right side could be required to be fully parsed against the left side start phrase in its own sandbox. In this parsing, we are avoiding unnecessarry recursive loops by utilizing `rec` array function parameter.

There is an optimization that is left out for code clarity, but would increase the speed of parsing. It is a [memoization](https://en.wikipedia.org/wiki/Memoization) technique optimizing cases where a function is repeatedly called with the same parameters. Since in call to `Parse` function (line 16) the same parameters always draw the same result, on each call to `Parse` function, parsing success could be paired to call parameters and memorized in parameters-result table. This array could be checked on each call to `Parse` function, just to return the same result if we encounter the same parameters setup again, thus avoiding repeating the speed sensitive call to `Parse` function.

The content of `MergeItem` function stayed unchanged comparing to the first pseudocode 1 version.

### 2.3. variables

Let's shed some light to grammars from a bit different point of view. Each grammar rule is an equivalent to a [function](https://en.wikipedia.org/wiki/Function_(mathematics)) mapping from the left rule side to the right rule side. We may consider a set of grammar rules as a complex function composition defined in a [declarative](https://en.wikipedia.org/wiki/Declarative_programming) way, while we may consider the staring sequence as the end result of the function. By walking down the grammar tree, we reach for different parameter setups for the function, and combination of those parameters is what is being matched by the input string that we try to parse. Looking from this angle, it seems reasonable to conceptualize a notion of abstraction variables that would reside within function parameters and a function result, enabling phrases to be instantiated by specific values on demand. Thus, we will extend our grammar language to support phrases that may contain variables, and we will name these kinds of phrases as *generic phrases*.

To explain how generic phrases behave, let's consider the following productions that describe a set of integers:

    zero -> int
    one int -> int

Further, let's add one more production to the above two, defining a function of incrementing by one:
 
    increment ( <X> ) -> one <X>

In this example, we used variable `X` where we use point braces to denote that `X` is a variable, not a constant phrase. Starting with `int` sequence again, the grammar can now successfully parse sequences like `increment ( one one one zero )`, as expected. This is because the right side of production `increment ( <X> ) -> one <X>` successfully matches against the left side of production `one int -> int`, thus reflecting substitution of `int` for `<X>`.

It is possible to write any number of the same or different variables at within phrases. It is also possible to construct phrases consisted only of variables, which may find a use in a field of [combinatory logic](https://en.wikipedia.org/wiki/Combinatory_logic). In a case of repeated use of the same variable in the same phrase, during the phrase recognition, the same input fragment is required to match all of the same variable placeholders, like in an example:

    <Y> ^ 2 -> <Y> * <Y>

Given a starting sequence `3 * 3`, we can successfully parse input text `3 ^ 2` from this grammar.

#### 2.3.1. pseudocode 3

*... to do ...*

## 3. use case: extense framework

A term rewriting system is possible where parsing rules are completely customizable, operating on user defined language. For example, we may have defined the following toy language using `~~>` operator, accepting a sequence of integers:

    ... seq ... ~~> top ;
      int , seq ~~> seq ;
            int ~~> seq ;
           zero ~~> int ;
        one int ~~> int

and we may have defined rewrite rules representing functions:

        succ <x> ~~> one <x> ;
    pred one <x> ~~> <x>

We may cumulatively compose these kinds of grammars using `<~~` operator in the following pattern:
    
    (
        ... expression-1 ...
        
        (
            ... expression-1-1 ...
            ... tree goes on ...
        ) <~~ ( grammar-1-1 )
        
        (
            ... expression-1-2 ...
            ... tree goes on ...
        ) <~~ ( grammar-1-2 )
        
        ...
        
    ) <~~ ( grammar-1 )

where each grammar node applies cumulatively to all sub-tree nodes. The result of parsing this kind of expression would be an abstract syntax tree entirely composed of `grammar-1` rules because: `grammar-1-1`, `grammar-1-2`, ..., should all reduce to `grammar-1`.

Using the rules from the first two examples, we may compose:

    (
        ...
        (
            succ zero
        ) <~~ (
            succ <x> ~~> one <x>
        )
        ,
        (
            pred one zero
        ) <~~ (
            pred one <x> ~~> <x>
        )
        ...
    ) <~~ (
        ... seq ... ~~> top ;
        int "," seq ~~> seq ;
                int ~~> seq ;
               zero ~~> int ;
            one int ~~> int
    )

The outermost grammar node expects a sequence of integers. Expressions `succ <x> ~~> one <x>` and `pred one <x> ~~> <x>` represent addon rewrite rules, and are being treated as parsing rules. Because the parser expects `int` to be read at appropriate places, we may write expressions like `succ zero` or `pred one zero` wherever `int` is expected, under scopes where these functions are defined. In this system, type-checking is done entirely by the underlying parser, observing the base grammar. Parser initially expects some forms of expressions which are then passed from right to left sides of rewriting rules in higher grammars, while reporting a parsing errors on incorrect sub-expression types.

With this system it is possible to start with, for example a valid assembler grammar language, and to extend it by higher level language rules, showing how to transpile these higher level language expressions to assembler expressions. It shouldn't be a problem to mix in several different higher level languages with their own rules, or maybe to define even higher structures that transpile to these higher level languages, which at the end of the process transpile to assembler.

### 3.1. classical logic

[Classical logic](https://en.wikipedia.org/wiki/Classical_logic) (or standard logic) is the intensively studied and most widely used class of logics. The important part of our logic definition is in handling variables. We use universal and existential [quantifiers](https://en.wikipedia.org/wiki/Quantifier_(logic)) to bound variables which we extrude from related constant expressions by implications that introduce fresh variables (`<y>` in the following definition). As expected in higher order logic, variables may stand for constants, functions, or predicates.

    (
        // axioms    
        ( <a> -> ( <b> -> <a> ) ) /\
        ( ( <a> -> ( <b> -> <c> ) ) -> ( ( <a> -> <b> ) -> ( <a> -> <c> ) ) ) /\
        ( ( ~ <a> -> ~ <b> ) -> ( <b> -> <a> ) ) /\
        
        // example logic expressions
        ( ∀ x . ∀ y . ~ ( x /\ y ) -> ~ x \/ ~ y ) /\
        ( ∀ x . ∀ y . ~ ( x \/ y ) -> ~ x /\ ~ y )
        
    ) <~~ (
        // syntax
                    ∃ const . eq ~~> top ;
                    ∀ const . eq ~~> top ;
                              eq ~~> top ;
                      impl -> eq ~~> eq ;
                            impl ~~> eq ;
                     and -> impl ~~> impl ;
                             and ~~> impl ;
                       and /\ or ~~> and ;
                              or ~~> and ;
                       or \/ not ~~> or ;
                             not ~~> or ;
                          ~ prim ~~> not ;
                     "(" top ")" ~~> prim ;
                           const ~~> prim ;
        /[_A-Za-z][_0-9A-Za-z]*/ ~~> const ;
        
        // semantics
        <a> <-> <b> ~~> ( ( ( <a> -> <b> ) -> ( <b> -> <a> ) -> <c> ) -> <c> ) ;
         <a> /\ <b> ~~> ( ( <a> -> <b> -> <c> ) -> <c> ) ;
         <a> \/ <b> ~~> ( ( <a> -> <c>) -> ( <b> -> <c> ) -> <c> ) ;
              ~ <a> ~~> ( <a> -> <c> ) ;
        ∀ <x> . <p> ~~> ( <x> -> <y> ) /\ ( <x> -> <p> ) ;
        ∃ <x> . <p> ~~> ( <x> -> <y> ) /\ ~ ( <x> -> ~ <p> )
        
        // inverse modus ponens
        <x> ~~> ( <x> -> <y> ) /\ <y> ;
    )
        
### 3.2. lambda calculus

[Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) (also written as λ-calculus) is a formal system in mathematical logic for expressing computation based on function [abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science)) and [application](https://en.wikipedia.org/wiki/Function_application) using variable binding and substitution. It is very simple, but powerful system. Among other uses it has found a way to be an inspiration for a lot of [functional programming languages](https://en.wikipedia.org/wiki/Functional_programming).

Syntax of lambda calculus is surprisingly simple. A lambda term is one or a combination of the following:

- *variable in a form of:* `x`
- *abstraction in a form of:* `λx.M` (where `x` is a variable; `M` is a lambda term)
- *application in a form of:* `(M N)` (where `M` and `N` are lambda terms)

Semantics of lambda calculus, written in a relaxed language, include

- *α-conversion:* `(λx.M) -> (λy.M[x:=y])`
- *β-reduction:* `((λx.M) N) -> (M[x:=N])`

α-conversion is renaming of variables used to avoid [name collisions](https://en.wikipedia.org/wiki/Name_collision). β-reduction is actual operation carying process of replacing bound variables with the argument expression in the body of the abstraction.

    (
        // example lambda expression
        ( ( λ x . ( x x ) ) ( ( λ x . ( x x ) ) 2 ) )
        
    ) <~~ (
        // syntax
                           λvar  ~~> λterm ;
                  λ λvar . λterm ~~> λterm ;
                      λterm λvar ~~> λterm ;
                   "(" λterm ")" ~~> λterm ;
        /[_A-Za-z][_0-9A-Za-z]*/ ~~> λvar ;
        
        // semantics
                 λ <x> . <M>  ~~> ( α-λ <y> . <M> ) /\ ( <x> -> <y> ) ;
        ( α-λ <x> . <M> ) <N> ~~> <M> /\ ( <x> -> <N> )
    )
    
### 3.3. Turing machines

A [Turing machine](https://en.wikipedia.org/wiki/Turing_machine) is a mathematical model of computation that defines an abstract machine, which manipulates symbols on a strip of tape according to a table of rules. Despite the model's simplicity, given any computer algorithm, a Turing machine capable of simulating that algorithm's logic can be constructed.

The machine operates on an infinite memory tape divided into discrete *cells*. The machine has its *head* that positions over a single cell and can read or write a symbol to the cell. The machine keeps a track of its current *state* from a finite set of states. Finally, the machine has a finite set of *instructions* which direct reading symbols, writing symbols, changing the current machine state and moving the tape to the left or to the right. Each instruction consists of the following:

1. reading the current state and reading a symbol at the position of head
2. depending on (1.), writing a symbol at the position of head
3. either move the tape one cell left or right and changing the current state

The machine repeats these steps until it encounters the halting instruction.

The following example shows a Turing machine for adding 1 to a n-digits binary number

    (
        // set of instructions (state abbreviations: s=start, a=add one, f=finish, h=halt)
        ( <x> s <y> <z> --> <x> <y> s <z> ) /\
         ( <x> <y> s () --> <x> a <y> () ) /\
          ( <x> <y> a 1 --> <x> a <y> 0 ) /\
          ( <x> a 0 <y> --> <x> 1 f <y> ) /\ 
        ( <x> f <y> <z> --> <x> <y> f <z> ) /\
             ( <x> f () --> <x> h () ) /\
    
        // initial tape setup
        ( () s 1 0 0 1 () )
        
    ) <~~ (
        // sytax for defining a tape
                  <s> ~~> state ;
                  <b> ~~> bit ; 
                 "()" ~~> bit ;
            state bit ~~> head ;
                  bit ~~> cell ;
                 head ~~> cell ;
                 cell ~~> tape ;
            tape cell ~~> tape ;
            
        // syntax for defining instructions
        tape --> tape ~~> step ;
        
        // semantics for processing rules
        <x> ~~> ( <x> --> <y> ) /\ <y>
    )
    
## 4. implementation

test js code here: [(version 0.1, only context free grammar)](https://e-teoria.github.io/Esperas/test)

*... to do ...*
