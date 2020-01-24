# Esperas

*[Abstract]*  

*Esperas represents a library for implementing arbitrary metalanguages. Our starting point is handling context free grammars by a novel v-parser algorithm. Then we introduce a few extensions to the original algorithm to arrive at supporting **type generic-phrase logic-structure grammars**, aiming for relative simplicity of use in a way similar to constructive theorem proving.*

## contents

- [x] [1. introduction](#1-introduction)  
- [x] [2. basic context free grammar parsing algorithm](#2-basic-context-free-grammar-parsing-algorithm)
    - [x] [2.1. pseudocode 0](#21-pseudocode-0)  
- [ ] [3. extending grammar language](#2-extending-grammar-language)  
    - [x] [3.1. type (phrase: specific, structure: pair) grammar](#31-type-phrase-specific-structure-pair-grammar)  
        - [x] [3.1.1. relation to Turing machines](#311-relation-to-Turing-machines)  
        - [ ] [3.1.2. pseudocode 1](#312-pseudocode-1)  
    - [ ] [3.2. type (phrase: generic, structure: pair) grammar](#32-type-phrase-generic-structure-pair-grammar)  
        - [x] [3.2.1. relation to lambda calculus](#321-relation-to-lambda-calculus)  
        - [ ] [3.2.2. pseudocode 2](#322-pseudocode-2)  
    - [ ] [3.3. type (phrase: specific, structure: logic) grammar](#33-type-phrase-specific-structure-logic-grammar)  
        - [x] [3.3.1. relation to zeroth-order logic](#331-relation-to-zeroth-order-logic)  
            - [x] [3.3.1.1. conversion between conjunctive and disjunctive normal forms](#3311-conversion-between-conjunctive-and-disjunctive-normal-forms)  
            - [x] [3.3.1.2. conversion to conjunctive sequential normal form](#3312-conversion-to-conjunctive-sequential-normal-form)  
            - [x] [3.3.1.3. resolution abduction rule in logic](#3313-resolution-abduction-rule-in-logic)  
            - [x] [3.3.1.4. logic puzzle example](#3314-logic-puzzle-example)  
        - [ ] [3.3.2. pseudocode 3](#332-pseudocode-3)  
    - [ ] [3.4. type (phrase: generic, structure: logic) grammar](#34-type-phrase-generic-structure-logic-grammar)  
        - [ ] [3.4.1. metarelation](#341-metarelation)  
        - [ ] [3.4.2. pseudocode 4](#342-pseudocode-4)  
- [ ] [4. implementation](#4-implementation)  

## 1. introduction

*Esperas* is born as an implementation attempt in a process of developing universal computational language named [*Logos*](https://github.com/e-teoria/Logos). As *Logos* is trying to provide a method to describe any other computational or descriptional language, *Esperas* will try to tame the very notion of [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) that can be used as a platform to host the *Logos* language. Nevertheless, *Esperas* will try to retain independency from any particular language (including *Logos*), and may be used as a multi-purpose programming library.

Although we will focus from the start on defining general syntactical properties, the road will finally lead us to defining general semantical properties of set of languages definable in *Esperas*. In our approach, syntax will lose a clear distinction from semantics because certain syntax properties require computational completeness we may only find in semantic definitions. Success of pairing provided grammars with input texts thus depends on supported grammar expressiveness that may even reach for sofisticated computational complexities like in [type checking](https://en.wikipedia.org/wiki/Type_system) or [formal verification](https://en.wikipedia.org/wiki/Formal_verification), under ambrella of [automated theorem proving](https://en.wikipedia.org/wiki/Automated_theorem_proving).

Our starting point in section [2.] will be processing [context-free grammars (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) by a novel *v-parser* algorithm. In section [3.], we describe a series of extensions to the basic *v-parer* algorithm, that aspire to establish more promising ratio of grammar applicability versus grammar complexity. Section [4.] exposes a Javascript *Esperas* implementation.

## 2. basic context free grammar parsing algorithm

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

Proper construction of more complex grammars for particular purposes is a very broad area of investigation, and we will not go further into details in this exposure. Interested readers are invited to search the web for `conext free grammar (CFG)` and `Backus-Naur form (BNF)` for more information on this matter.

### 2.1. pseudocode 0

This is *v-parser* algorithm that parses input text against context free grammar rules. The version of algorithm presented in this section does not distinguish between terminals and non-terminals, thus enabling input text also to contain non-terminals. Input text is also expected to be [lexed](https://en.wikipedia.org/wiki/Lexical_analysis) into an array of tokens prior to actual parsing.

    01 FUNCTION Parse (grammar, start, input)
    02     tokens ← input;
    03     chart ← [][];
    04     MergeItem (0, [start, END_OF_FILE], 0, null);
    05     FOR each new column in chart DO
    06         FOR each new item in column DO
    07             FOR each production where production.left == item.Sequence[item.Index] in grammar DO
    08                 MergeItem (column.Index, production.right, 0, item);
    09 
    10     RETURN {Chart: chart, Success: (is END_OF_FILE in chart[input.LENGTH]?)};
    11 
    12     PROCEDURE MergeItem (offset, sequence, index, parent)
    13         item ← chart[offset].FIND (sequence, index);
    14         IF not found item THEN
    15             item ← {Sequence: sequence, Index: index, Inherited: [], Inheritors: [], Parents: []};
    16             chart[offset].ADD (item);
    17 
    18         IF parent not in item.Parents THEN
    19             item.Parents.ADD (parent);
    20             FOR each x in [parent] UNION parent.Inherited DO
    21                 FOR each y in [item] UNION item.Inheritors DO
    22                     IF y.Index + 1 == y.Sequence.LENGTH
    23                         IF (x.Sequence, x.Index) not in y.Inherited THEN
    24                             x.Inheritors.ADD (y);
    25                             y.Inherited.ADD (x);
    26
    27                     IF x.Index + 1 < x.Sequence.LENGTH THEN
    28                         IF y.Sequence[y.Index] == tokens[offset] THEN
    29                             FOR each z in x.Parents DO
    30                                 MergeItem (offset + 1, x.Sequence, x.SeqIndex + 1, z);
    
This algorithm is a chart based algorithm that groups parsing items into columns. Columns correspond to offsets from the beginning of input sequence. Columns are incrementally processed, never looking back into the previous columns in the chart. Algorithm stores generated items in the chart as pairs of a sequence and an index of the sequence element. This way it is always possible to know what is ahead element of the current item (we just increment the index attribute by one).

The main function `Parse` serves as a loop over chart columns, productions and their alternations. The loop functions as a [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) to reach all the tokens relative to `start` symbol. It repeatedly calls `MergeItem` procedure to populate the chart onwards. `MergeItem` procedure creates a new item in appropriate column determined by `offset` only if an item with similar `Sequence` and `Index` attributes doesn't already exist in that column. If the item exists, its data is accumulated by a newly introduced `parent` value. The algorithm ends when it visits all the populated columns in the chart.

The essence of the algorithm may be found in merging passed items to existing column items. When the passed item is merged, it looks up all the accumulated parents inside `Inherited` attribute (line 20), and tries to merge their successors (line 30) to all the children of the existing item inside `Inheritors` attribute (line 21). To do this, the algorithm tracks what is to be merged and where it is supposed to be merged for each item (lines 24-25). Of course, if we want this merging to take a place, there are some conditions to be met:

1. (line 22) the index of items in children has to be equal to the children sequences lengths (parent sucessor is allowed to apply);
2. (line 23) items from the first loop that are already processed as a value of `Inherited` attribute are ignored;
3. (line 27) the index of successors in parents has to be less than the parents sequences lengths (there is an available parent successor);
4. (line 28) the last condition takes care of scheduling the next item to be breadth-first searched only if item from the second loop matches input token at given offset.

When inserting a new item that has no match at specified column, in the second `FOR` loop of `MergeItem` procedure, we consider only inserted item instead of the whole `Inheritors` range. This occurs naturally because `Inheritor` attribute of new items is declared empty.

The algorithm exhibits very well behavior regarding to parsing possibly ambiguous grammars when encountering multiple replacement rules for a single value. After parsing, if `END_OF_FILE` starting sequence element can be found at the first column offset behind the last input token, the parsing is considered successful. If a parsing error occurs, `END_OF_FILE` will not be placed at appropriate place, and then the produced chart may be additionally analyzed for errors. In the case of an error, it may be relatively easy to output *"Expected expression `X` at offset `Y`"* error forms by observing only the last populated column in the resulting chart.

## 3. extending grammar language

In this section we deal with extensions of original *v-parser* algorithm, originating from the raw lowest level computationally complete version towards higher level user friendly type of grammars. Firstly, we extend our algorithm to embrace [unrestricted grammar](https://en.wikipedia.org/wiki/Unrestricted_grammar) that is proven to be [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness). This step represents a bare minimum that supports any [computable](https://en.wikipedia.org/wiki/Computable_function) relation between a grammar and input text.

However, we also require our system to represent grammars that are confortably and cozy to work with. Following this line of aspiration, we introduce two unrelated extensions along "generic" and "logic" axes. Generic axis is about introducing [generic variables](https://en.wikipedia.org/wiki/Generic_programming) to make grammar definitions similar to [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) easier to implement. Logic axis is about introducing [logic operators](https://en.wikipedia.org/wiki/Logical_connective) to make grammar definitions similar to [zeroth-order logic](https://en.wikipedia.org/wiki/Zeroth-order_logic) easier to implement. Finally, combining extensions over generic and logic axes leads us to "type (phrase: generic, structure: logic) phrase structure grammars", enabling us to handle [higher-order logic](https://en.wikipedia.org/wiki/Higher-order_logic) and [metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming) tasks more easily. This final system may represent a general theorem proving technology ready to cope with questions of connecting starting assumptions to ending conclusions, in a form of connecting grammar rules to input text.

We introduce a nomenclature of this extensions system originating from *type (phrase: specific, structure: pair) grammar* which we use as a synonym for unrestricted grammar. The nomenclature points out relations between "specific" and "generic" phrases, and between "pair" and "logic" structure. We can graphically depict the extensions and their namings by the following diagram:

                       type                                           type
        (phrase: specific, structure: logic)           (phrase: generic, structure: logic)
                      grammar                                        grammar
                         ● ––––––––––––––––––––––––––––––––––––––––––▶ ●
                         ▲                                             ▲
                         |                                             |
                         |                                             |
                   (logic axis)                                        |
                         |                                             |
                         |                                             |
                         |                                             |
                         ● –––––––––––––– (generic axis) ––––––––––––▶ ●
                       type                                           type
        (phrase: specific, structure: pair)            (phrase: generic, structure: pair)
                      grammar                                        grammar

In this diagram, the initial *type (phrase: specific, structure: pair) grammars* are lower-level positioned on a grammar types scale, just like assembler is very much lower-level positioned on a programming language simplicity-of-use scale. With introduction of generic variables and logical reasoning, we try to move further and climb up the grammar types scale to achieve the effect similar to one that higher-level programming languages achieved comparing to assembler. But unlike assembler, for which we don't have opportunity to upgrade from the outside because it is based on strict hardware, *type (phrase: specific, structure: pair) grammars* may be easily extended from the outside by new properties because their interpretation is represented by a flexible software, which we have a chance to carefully adjust according to our requirements. The adjustments that we chose to realize finally lead us to combined *type (phrase: generic, structure: logic) grammar* language, aiming at relative simplicity of use in a way similar to [constructive theorem proving](https://en.wikipedia.org/wiki/Constructive_proof).

### 3.1. type (phrase: specific, structure: pair) grammar

This section will provide an algorithm for parsing *type (phrase: specific, structure: pair) grammars*, which is a synonym for [unrestricted grammars](https://en.wikipedia.org/wiki/Unrestricted_grammar). But before that, we will make a small adjustments to context free grammar language which we will base our new types of grammars on. Usual context free grammars take form of `A -> α` production rule patterns, where in parsing we seek for the left production sides to parse the right production sides. Alternations are there expressed by repeating the same *left sides* across multiple production rules. However, this is inconsistent with classical logic expressions where the following rules hold for implication connective:

      A -> B,   A -> C
    ————————————————————
       A -> (B /\ C)


      B -> A,   C -> A
    ————————————————————
       (B \/ C) -> A

Unlike context free grammar rules, in logic, alternations may be formed by repeating the same *right sides* across multiple rules. Therefore, to synchronize our grammar language with logic, we will swap positions of left and right sides of productions comparing to context-free grammars, and we will refer to this form of grammar as *type (phrase: specific, structure: pair) grammars*. Although this adjustment doesn't really shake foundations of defining grammars, it is a necessary adjustment to proceed with extending our grammar language. Following the above laws, we provide the alternative form of context free grammar rules that now take the following form:

    α -> A
    
where the left side is a sequence of strings, while the right side is a string. From now, in parsing we seek for the right rule sides to parse the left rule sides, while we express alternations by repeating the same right sides across multiple rules. This way we are aligning production formation operator to classical logic.

To proceed with defining *type (phrase: specific, structure: pair) grammars*, all production rules are of the form:

    β -> α

where `β` and `α` are sequences of symbols. Definition of this type of grammars and their ability to develop `α` sides of rules towards `β` side input sequences is similar to the modified context-free grammars definition, except that the `α` sides may also be sequences of strings. Also, like in context-free grammars, it is possible to produce ambiguous grammars when there are multiple productions with the similar right side phrases. Again, to begin the process of parsing we have to provide the starting phrase which we further develop according to production rules.

#### 3.1.1. relation to Turing machines

Here, we will show how to simulate a single tape [Turing machine](https://en.wikipedia.org/wiki/Turing_machine) by *type (phrase: specific, structure: pair) grammar*. A Turing machine is a mathematical model of computation that defines an abstract machine, which manipulates symbols on a strip of tape according to a table of rules. Despite the model's simplicity, given any computer algorithm, a Turing machine capable of simulating that algorithm's logic can be constructed.

The machine operates on an infinite memory tape divided into discrete *cells*. The machine has its *head* that positions over a single cell and can read or write a symbol to the cell. The machine keeps a track of its current *state* from a finite set of states. Finally, the machine has a finite set of *instructions* which direct reading symbols, writing symbols, changing the current machine state and moving the tape to the left or to the right. Each instruction consists of the following:

1. reading the current state and reading a symbol at the position of head
2. depending on (1.), changing the current state and writing a symbol at the position of head
3. either move the tape one cell left or right

The machine repeats these steps until it encounters the halting instruction.

*type (phrase: specific, structure: pair) grammars* (Unrestricted grammars) can simulate a Turing machine by providing equivalents to its instructions in a form of production rules, while the initial symbol sequence on the tape is equivalent to grammar starting phrase. For example, this is how an equivalent of Turing machine that adds 1 to a binary number would look like (visit [this place](https://www.cis.upenn.edu/~matuszek/cit596-2012/NewPages/tm-to-grammar.html) to learn more about the example):

    0 s -> s 0
    1 s -> s 1

    a 0 # -> 0 s #
    a 1 # -> 1 s #
    a # # -> # s #

    a 0 0 -> 0 a 1
    a 1 0 -> 1 a 1
    a # 0 -> # a 1

    1 f -> a 0
    1 f -> a #

    0 f -> f 0
    1 f -> f 1

    0 h # -> 0 f #
    1 h # -> 1 f #

    Abbreviations: s=start, a=add1, f=finish, h=halt

Symbols `0` and `1` denote binary digits, while the letter symbols carry on information about the head position and the current state. `#` symbol is used to determine the beginning and the end of tape operating range. We read all the rules from right to left, meaning that a rule `0 s -> s 0` reads `s 0` and writes `0 s` in producing possible input.

Given the above grammar, if wee supply a starting phrase `# s 1 0 0 1 #` (this is starting setup of the tape and the machine, showing a decimal number 9) as a part of the above grammar, that would be sufficient to correctly parse specific sequence `# 1 0 1 0 h #` (this is ending setup of the tape and the machine after halting, showing a decimal number 10), which represents exactly the starting phrase incremented by one. Parsing any other binary digit combinations to this grammar reports a failure.

#### 3.1.2. pseudocode 1

*... to-do ...*

### 3.2. type (phrase: generic, structure: pair) grammar

Let's shed some light to grammars from a bit different point of view. Each grammar rule is an equivalent to a [function](https://en.wikipedia.org/wiki/Function_(mathematics)) mapping from the right rule side to the left rule side. We may consider a set of grammar rules as a complex function composition defined in a [declarative](https://en.wikipedia.org/wiki/Declarative_programming) way, while we may consider the staring sequence as the end result of the function. By walking down the grammar tree, we reach for different parameter setups for the function, and combination of those parameters is what is being matched by the input string that we try to parse. Looking from this angle, it seems reasonable to conceptualize a notion of abstraction variables that would reside within function parameters and a function result, enabling phrases to be instantiated by specific values on demand. Thus, we will extend our grammar language to support phrases that may contain variables, and we will name these kinds of phrases as "generic phrases". Inheriting formalisms from previous sections, generic phrases may form "generic phrase pairs", making an entrance to our new *type (phrase: generic, structure: pair) grammars*.

To explain how generic phrases behave, let's consider the following productions that describe a set of integers:

    zero -> int
    int one -> int

This grammar reflects [inductive definition](https://en.wikipedia.org/wiki/Inductive_type) of integers. When the starting sequence is `int`, the grammar successfully parses sequences like `zero` (being 0), `zero one` (being 1), `zero one one` (being 2), and so on. Further, let's add one more production to the above two, defining a function of incrementing by one:
 
    increment( <X> ) -> <X> one

In this example, we used variable `X` where we use point braces to denote that `X` is a variable, not a constant phrase. Starting with `int` sequence again, the grammar can now successfully parse sequences like `increment( zero one one one )`, as expected. This is because the right side of production `increment( <X> ) -> <X> one` successfully matches against the left side of production `int one -> int`, thus yielding a sequence `increment( int )`, reflecting substitution of `int` for `<X>`.

It is possible to write any number of the same or different variables at within phrases. It is also possible to construct phrases consisted only of variables, which may find a use in a field of [combinatory logic](https://en.wikipedia.org/wiki/Combinatory_logic). In a case of repeated use of the same variable in the same phrase, during the phrase recognition, the same input fragment is required to match all of the same variable placeholders, like in an example:

    <Y> ^ 2 -> <Y> * <Y>

Given a starting sequence `3 * 3`, we can successfully parse input `3 ^ 2` from this grammar.

With these simple extensions to *generic phrases*, we are already reaching expression semantics which may be also exploited in building general [type systems](https://en.wikipedia.org/wiki/Type_system) without relying on any (usually separated) external resources.

#### 3.2.1. relation to lambda calculus

[Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) (also written as λ-calculus) is a formal system in mathematical logic for expressing computation based on function [abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science)) and [application](https://en.wikipedia.org/wiki/Function_application) using variable binding and substitution. It is very simple, but powerful system. Among other uses it has found a way to be an inspiration for a lot of [functional programming languages](https://en.wikipedia.org/wiki/Functional_programming). In this section, we will show how to express lambda calculus constructs in *type (phrase: generic, structure: pair) grammars*.

Syntax of lambda calculus is surprisingly simple. A lambda term is one or a combination of the following:

- *variable in a form of:* `x`
- *abstraction in a form of:* `λx.M` (where `x` is a variable; `M` is a lambda term)
- *application in a form of:* `(M N)` (where `M` and `N` are lambda terms)

Semantics of lambda calculus, written in a relaxed language, include

- *α-conversion:* `(λx.M) -> (λy.M[x:=y])`
- *β-reduction:* `((λx.M) N) -> (M[x:=N])`

α-conversion is renaming of variables used to avoid [name collisions](https://en.wikipedia.org/wiki/Name_collision). β-reduction is actual operation carying process of replacing bound variables with the argument expression in the body of the abstraction.

Because we are still lacking logical grammar metaprogramming elements, in this moment we are a good mile away from automation of expressing the above definitions and properties in our grammar language. However, related to what we have now, it is possible to manually translate any function abstraction and application rules that are equivalent to the lambda calculus operations. As an example, let's consider the following lambda abstractions assigned to function names `twice` and `double`, written in a relaxed language:

    twice = λ x . x + x
    double = λ x . x * x

We convert the above lambda abstractions to our grammar language in the following way:
    
    twice( <x> ) -> ( <x> + <x> )
    double( <x> ) -> ( <x> * <x> )

We may supply function results or their combination as a starting sequence to parse (correctly) applied parameters to (correctly) combined functions. For example, by supplying starting sequence `( 2 + 2 )` along the above productions, we can successfully parse input `twice( 2 )`. We may even combine results to produce expected combination of applied parameters to functions. Thus, supplying something like `( ( 2 * 2 ) + ( 2 * 2 ) )` as a starting sequence yields something like `twice( double( 2 ) )` as a parsing expectation. Beyond lambda calculus domain, we may also form bidirectional functions, in which case we have to assert a pair of productions flowing in both directions, like in `function( parameters ) -> result` rule paired with `result -> function( parameters )` rule.

#### 3.2.2. pseudocode 2

*... to-do ...*

### 3.3. type (phrase: specific, structure: logic) grammar

[Logic](https://en.wikipedia.org/wiki/Logic) is the systematic study of the form of valid inference, and the most general laws of truth. A valid inference is one where there is a specific relation of logical support between the assumptions of the inference and its conclusion. In ordinary discourse, inferences may be signified by words such as therefore, thus, hence, ergo, and so on.

What do we get by introducing logic to parsing? Logical operators like *and*, *or*, *not*, and *implication* are being embedded in natural languages that we naturally use in our dayly lives, and as such, make good candidates in forming our thoughts to generally reason about parsing grammars we work on. Once that grammars are conceptualized, logic allows us to translate our grammars in normalized compact forms, and to extract information we need about them on demand. Utilizing logic framework, we are in possesion of methods that parform extraction of all the knowledge implicitly contained in a set of assumptions represented by our initial grammar constructs. Such a logical inference completeness is welcomed both in scientific analysis and in activities related to the daily use of computers, in general.

#### 3.3.1. relation to zeroth-order logic

[Zeroth-order logic](https://en.wikipedia.org/wiki/Zeroth-order_logic) is [first-order logic](https://en.wikipedia.org/wiki/First-order_logic) without [variables](https://en.wikipedia.org/wiki/Variable_(mathematics)) or [quantifiers](https://en.wikipedia.org/wiki/Quantifier_(logic)). In our interpretation, we consider zeroth-order logic as a form of [propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus) that allows relating [propositions](https://en.wikipedia.org/wiki/Propositions) in phrases represented by propositional sequences.

In this section we will show how to turn zeroth-order logic expressions into parsing grammar definitions suitable for algorithmic input parsing. We will use some of well known methods of logic conversion to [conjunctive normal form](https://en.wikipedia.org/wiki/Conjunctive_normal_form) and introduce a conversion to a novel *sequential normal form*. Then we will show how to process conjunctive normal forms by abduction analog of the well known [logic resolution](https://en.wikipedia.org/wiki/Resolution_(logic)) method. The abduction will finally allow us to interpret *sequential normal forms* as grammar guidelines needed for parsing input sequences.

##### 3.3.1.1. conversion between conjunctive and disjunctive normal forms

[Conjunctive](https://en.wikipedia.org/wiki/Conjunctive_normal_form) and [disjunctive](https://en.wikipedia.org/wiki/Disjunctive_normal_form) normal forms (CNF and DNF) take a special place in logic, as they reveal some properties of formulas that would be otherwise harder to conclude. Every logic formula can be converted either to conjunctive, either to disjunctive normal form using [double negative law](https://en.wikipedia.org/wiki/Double_negation#Double_negative_elimination), [De Morgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws) and [distributive law](https://en.wikipedia.org/wiki/Distributive_property).

We say that a formula is in CNF when it takes a form:

    (A1 \/ B1 \/ ...) /\ (A2 \/ B2 \/ ...) /\ ...

where each literal may or may not be a negated. Of course, it is possible to have only one [conjunct](https://en.wikipedia.org/wiki/Logical_conjunction), or any [disjunct](https://en.wikipedia.org/wiki/Logical_disjunction) to be composed of only one element. One of special values of CNF is that we can easily tell if the whole formula is tautology. CNF formula is a tautology if all of its conjuncts are tautologies.

Similarly, we say that a formula is in DNF when it takes a form:

    (A1 /\ B1 /\ ...) \/ (A2 /\ B2 /\ ...) \/ ...

where each literal may or may not be a negated. Of course, it is possible to have only one [disjunct](https://en.wikipedia.org/wiki/Logical_disjunction), or any [conjunct](https://en.wikipedia.org/wiki/Logical_conjunction) to be composed of only one element. One of special values of DNF is that we can easily tell if the whole formula is contradictory. DNF formula is contradictory if all of its disjuncts are contradictory.

**Conversion between CNF and DNF** represent the worst cases of combinatorial complexity that we may encounter when converting any formula either to CNF or DNF. It could take an exponential amount of time to convert CNF to DNF formula. For example, if we take a CNF formula:

    (A1 \/ B1) /\ (A2 \/ B2) /\ ... /\ (An \/ Bn)

after conversion to its DNF equivalent, we get:

    (A1 /\ A2 /\ ... /\ An) \/ (B1 /\ A2 /\ ... /\ An)
                            \/
    (A1 /\ B2 /\ ... /\ An) \/ (B1 /\ B2 /\ ... /\ An)
                            \/
    (A1 /\ B2 /\ ... /\ Bn) \/ (B1 /\ B2 /\ ... /\ Bn)

This formula contains 2 to the power of n clauses; each clause contains either Ai or Bi for each i.

We may use analogous transformation for conversion from DNF to CNF, but instead, we may also use a bit of [help](https://en.wikipedia.org/wiki/Conjunctive_normal_form#Conversion_into_CNF) in this case. There exist transformations into CNF that avoid an exponential increase in size by preserving satisfiability rather than equivalence. These transformations are guaranteed to only linearly increase the size of the formula, but introduce new variables. For example, a DNF formula:

    (A1 /\ B1) \/ (A2 /\ B2) \/ ... \/ (An /\ Bn)

can be transformed into CNF by adding variables `Z1`, `...`, `Zn` as follows:

    (Z1 \/ ... \/ Zn) /\ (~Z1 \/ A1) /\ (~Z1 \/ B1) /\ ... /\ (~Zn \/ An) /\ (~Zn \/ Bn)

An interpretation satisfies this formula only if at least one of the new variables is true. If this variable is `Zi`, then both `Ai` and `Bi` are true as well. This means that every model that satisfies this formula also satisfies the original one. On the other hand, only some of the models of the original formula satisfy this one: since the `Zi` are not mentioned in the original formula, their values are irrelevant to satisfaction of it, which is not the case in the last formula. This means that the original formula and the result of the translation are [equisatisfiable](https://en.wikipedia.org/wiki/Equisatisfiability) but not [equivalent](https://en.wikipedia.org/wiki/Logical_equivalence). Nevertheless, regarding to equivalence of the translation, the only difference is that one of `Zi` variables has to be true. Because introduction of `Zi` variables can be internally implemented in a way that they would be unvisible to the outer world, we may safely use this kind of translation as an equivalent to the original set of formulas.

In this section we learned how to convert logical formulas between CNF and DNF. Using described methods, conversion from CNF to DNF may take an exponential amount of combinatorial complexity, but conversion from DNF to CNF takes a linear amount of combinatorial complexity. Luckily for us (or maybe because we are using what we are provided with), we are interested in this second, faster kind of conversion in producing our parser. Keeping our formulas in CNF will open the doors for extracting grammar rules by logical resolution abduction, which is covered in section [3.3.1.3.].

##### 3.3.1.2. conversion to conjunctive sequential normal form

To apply logic to sequence parsing, we have to upgrade our logic language. We start with [propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus), and extend it by a notion of sequences. Sequences are natural ingradient of parsers, so we have to include them into our language in such way that they can support basic logical rules and transformations. We write sequences as atoms delimited by a whitespace, like in the following example:

    A B C ...

Not to restrict expresivity of our language, we want to wire operators inherited from propositional logic into sequences, both from outside and from inside of sequences. Just like there exist a duality between logical `/\` and `\/` operators, it will be necessary to distinct two dual kinds of sequences that emerge from using negation outside of sequences. We may notice that sequences are merely conjunctions with a strict order of conjuncts. To convert our expression to sequential normal form, we have to apply the negation to each sequence element, but we have to keep in mind that our sequences, ordered conjunctions, then become their dual operations analogous to disjunction. To distinct between sequence expressions and their duals, we will write prefix `&` to sequences, while we will write prefix `|` to their duals. Following an analogy to [De Morgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws), we provide the next two rules for translating sequences towards sequential normal form:

      ~(& A B C ...)
    ——————————————————— (1)
     (| ~A ~B ~C ...)
     

      ~(| A B C ...)
    ——————————————————— (2)
     (& ~A ~B ~C ...)

A regular sequence denoted by `&` succeeds when all of its elements succeed, while success of sequence dual denoted by `|` is related to its `&` counterpart: it succeeds when negation of its counterpart form fails.

We continue with translation of operators `/\` and `\/` combined from inside of sequences. The following two rules are analogs to [distributive laws](https://en.wikipedia.org/wiki/Distributive_property), and we use them to further shift the conversion towards sequential normal form:

            sequence A (B /\ C) D
    —————————————————————————————————————— (3)
     sequence (A B D) /\ sequence (A C D)


            sequence A (B \/ C) D
    —————————————————————————————————————— (4)
     sequence (A B D) \/ sequence (A C D)

Rules (3) and (4) are general, and they hold for both `&` and `|` versions of sequences.

After repeatedly applying provided four rules, we reach sequential normal form. Finally, we say that a sequence expresssion is in sequential normal form when tere are no negations outside of sequences, and no `/\` and `\/` operators inside of sequences. In the rest of the exposure, we will use a combination of conjunctive normal form and sequential normal form, and refer to it as *conjunctive sequential normal form (CSNF)*.

##### 3.3.1.3. resolution abduction rule in logic

[Resolution rule](https://en.wikipedia.org/wiki/Resolution_(logic)) in propositional logic is a single valid inference rule that produces a new clause implied by two clauses containing complementary literals. A literal is a propositional variable or the negation of a propositional variable. Two literals are said to be complements if one is the negation of the other (in the following, `~C` is taken to be the complement to `C`). The resulting clause contains all the literals that do not have complements. Formally:

      A1 \/ A2 \/ ... \/ C,    B1 \/ B2 \/ ... \/ ~C
    ——————————————————————————————————————————————————
             A1 \/ A2 \/ ... \/ B1 \/ B2 \/ ...

where `Ai`, `Bi` and `C` are literals.

[Modus ponens](https://en.wikipedia.org/wiki/Modus_ponens) can be seen as a special case of resolution (of a one-literal clause and a two-literal clause): 

      P -> Q,    P
    ————————————————
           Q

is equivalent to

      ~P \/ Q,    P
    —————————————————
            Q

The clause produced by the resolution rule is called the *resolvent* of the two input clauses. When the two clauses contain more than one pair of complementary literals, the resolution rule can be applied (independently) for each such pair; however, the result is always a tautology. The Resolution rule is considered to be sound and complete, so we may use it without worying that there will be any conclusions left behind or forgotten when doing inference.

However, for our purposes of parsing we will examine only a special case of resolution:

      A1 \/ A2 \/ ... \/ C,    ~C
    ———————————————————————————————
             A1 \/ A2 \/ ... 

and we will examine this case *backwards*. Resolution inference is called a form of [*deduction*](https://en.wikipedia.org/wiki/Deductive_reasoning) and it manages to determine consequences of causes. But for our purposes of parsing, we will need to deal with reversed deduction. Reversed deduction is called [*abduction*](https://en.wikipedia.org/wiki/Abductive_reasoning), and it manages to determine causes of consequences.

We start from a logic variable `C`, and we write it as a double negation: `~(~C)`:

      A1 \/ A2 \/ ... \/ C,    ~(~C)
    ————————————————————————————————————
            ~(A1 \/ A2 \/ ...)

and after applying one of [DeMorgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws) we get:

      ~(A1 \/ A2 \/ ...),    DeMorgan's laws
    ——————————————————————————————————————————
                 ~A1 /\ ~A2 /\ ...

The above two inference steps, combined and treated with a negation at convenient places, are equivalent to the following one:

      ~A1 \/ ~A2 \/ ... \/ C,    C
    —————————————————————————————————
             A1 /\ A2 /\ ...

We will refer to this rule as a *resolution abduction* rule. Be sure to get familiar with this rule because we will use it in further sections to extract grammar rules from logic based grammar language. 

##### 3.3.1.4. logic puzzle example

In this section we will solve a logical puzzle using zeroth-order logic inspired by [this logic puzzle generator](https://demonstrations.wolfram.com/PropositionalLogicPuzzleGenerator/). The puzzle is about a simple world that is inhabited by triangles, squares, and pentagons, each with three sizes and two colors. The world is given some general rules about which combination of elements it may contain. The task is to find a possible setup of size, color and shape of these elements.

Considering a world with elements `A`, `B` and `C`, we give the world setup by the following rules:
    
    (
        ~ ( ~ ( Pentagon B ) <-> ( Gray B ) )
    ) /\ (
        ( Small A ) /\ ( Gray B ) -> ( Square C )
    ) /\ (
        ( Pentagon A ) -> ( ( Small B ) \/ ( White A ) )
    ) /\ (
        ~ ( Square C ) -> ( Gray C )
    ) /\ (
        ( Gray B ) -> ( ( Gray A ) /\ ( Square C ) )
    )

Additionally, input grammar setup is given by:

    (
        ( Small \/ Medium \/ Large ) -> Size
    ) /\ (
        ( White \/ Gray ) -> Color
    ) /\ (
        ( Triangle \/ Square \/ Pentagon ) -> Shape
    ) /\ (
        ( A \/ B \/ C ) -> Element
    ) /\ (
        (
            ( Size Element ) \/
            ( Color Element ) \/
            ( Shape Element )
        ) -> Start
    )

Possible input feeds to this grammar is consisted either of `Size` - `Element` sequence, `Color` - `Element` sequence, or `Shape` - `Element` sequence. To solve the puzzle, we first convert both of our logic expresions to *CSNF*, as explained in sections [3.3.1.1.] and [3.3.1.2.]. We get these rules combined with grammar:

    (
        ( | ~Pentagon ~B ) \/ ( & Gray B )
    ) /\ (
        ( | ~Gray ~B ) \/ ( & Pentagon B )
    ) /\ (
        ( | ~Small ~A ) \/ ( | ~Gray ~B ) \/ ( & Square C )
    ) /\ (
        ( | ~Pentagon ~A ) \/ ( & Small B ) \/ ( & White A )
    ) /\ (
        ( & Square C ) \/ ( & Gray C )
    ) /\ (
        ( | ~Gray ~B ) \/ ( & Gray A )
    ) /\ (
        ( | ~Gray ~B ) \/ ( & Square C )
    )
    
    /\
    
    (
        ( & ~Small ) \/ ( & Size )
    ) /\ (
        ( & ~Medium ) \/ ( & Size )
    ) /\ (
        ( & ~Large ) \/ ( & Size )
    ) /\ (
        ( & ~White ) \/ ( & Color )
    ) /\ (
        ( & ~Gray ) \/ ( & Color )
    ) /\ (
        ( & ~Triangle ) \/ ( & Shape )
    ) /\ (
        ( & ~Square ) \/ ( & Shape )
    ) /\ (
        ( & ~Pentagon ) \/ ( & Shape )
    ) /\ (
        ( & ~A ) \/ ( & Element )
    ) /\ (
        ( & ~B ) \/ ( & Element )
    ) /\ (
        ( & ~C ) \/ ( & Element )
    ) /\ (
        ( | ~Size ~Element ) \/ ( & Start )
    ) /\ (
        ( | ~Color ~Element ) \/ ( & Start )
    ) /\ (
        ( | ~Shape ~Element ) \/ ( & Start )
    )

Each conjunct in the above *CSNF* expression holds dijunctions that are considered to be separate grammar rules. Now that we converted our example to *CSNF*, to parse some text by this grammar, we are required to abduce from the `( & Start )` expression backwards using the *resolution abduction* rule. In cases of disjunction consisted of only two elements, we produce a negation of one single element other than matched one. When a disjunction contains more than one element, we produce a conjunction of negated elements, thus requiring to parse both of them. Also, when abducing up the grammar tree, we are required to simultaniously check both positive and negative instances of searched elements, with an effect of reporting parsing error when th both instances succesfully parse.

To finally check which properties of elements `A`, `B` and `C` are possible, we proceed with the following:

- we feed the first input combination of size to the grammar: `Small A`.
    - If the input passes, we get the first property of element `A`.
    - If the input does not pass, we have to repeat check with the next combination, like `Medium A`, then possibly the next one, and so on. Because there is only a finite number of combinations, the process is guaranteed to eventually terminate, either with success or failure. Failure means that the whole grammar setup is contradictory, and it has no solution. 
- Before proceeding with the next property check, we are obligated to manually enrich our grammar rules by confirmed input `( & Small A )`, just to be sure that further checking success emerges only with combinations that are consistent with data gathered from this / previous steps.
- we repeat the process from the beginning, feeding the next input combination of color to be checked: `Gray A`.
- the process ends when we get a combination of all three properties for all three elements.

Just to answer the question stated from this puzzle, one of the complete correct combinations is: `Small A`, `Gray A`, `Pentagon A`, `Small B`, `Gray B`, `Pentagon B`, `Medium C`, `Gray C`, `Square C`.

With this example, we saw how to manually seek for the right combination that satisfy given rules. However, it is possible to fully automatize the whole process of finding a correct combination using only grammar productions. To do this, we have to reach for generic instead of specific phrases. Section [3.4.] deals with this matter, where we finally combine generic phrases with logic structure.

#### 3.3.2. pseudocode 3

*... to-do ...*

### 3.4. type (phrase: generic, structure: logic) grammar


#### 3.4.1. metarelation

#### 3.4.2. pseudocode 4

## 4. implementation

test it here: [(version 0.1, context free grammar)](https://e-teoria.github.io/Esperas/test)
