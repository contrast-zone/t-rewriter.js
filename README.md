# Esperas

*[Abstract]*  

*Esperas represents a library for implementing arbitrary metalanguages. Our starting point is handling context free grammars by a novel v-parser algorithm. Then we introduce a few extensions to the original algorithm to arrive at supporting "generic logic structure grammar" language, aiming for relative use simplicity of use in a way similar to constructive theorem proving.*

## contents
- [x] [1. introduction](#1-introduction)  
- [x] [2. basic context free grammar algorithm](#2-basic-context-free-grammar-algorithm)
    - [x] [2.1. pseudocode 0](#21-pseudocode-0)  
- [x] [3. extending grammar language](#2-extending-grammar-language)  
    - [x] [3.1. phrase pair structure grammar](#31-phrase-pair-structure-grammar)  
        - [x] [3.1.1. relation to Turing machines](#311-relation-to-Turing-machines)  
        - [x] [3.1.2. pseudocode 1](#312-pseudocode-1)  
    - [ ] [3.2. generic pair structure grammar](#32-generic-pair-structure-grammar)  
        - [ ] [3.2.1. relation to lambda calculus](#321-relation-to-lambda-calculus)  
        - [ ] [3.2.2. pseudocode 2](#322-pseudocode-2)  
    - [ ] [3.3. phrase logic structure grammar](#33-phrase-logic-structure-grammar)  
        - [ ] [3.3.1. conversion between conjunctive and disjunctive normal forms](#331-conversion-between-conjunctive-and-disjunctive-normal-forms)  
        - [ ] [3.3.2. conversion to sequential normal form](#332-conversion-to-sequential-normal-form)  
        - [ ] [3.3.3. resolution abduction rule in logic](#333-resolution-abduction-rule-in-logic)  
        - [ ] [3.3.4. relation to zeroth-order logic](#334-relation-to-zeroth-order-logic)  
        - [ ] [3.3.5. pseudocode 3](#335-pseudocode-3)  
    - [ ] [3.4. generic logic structure grammar](#34-generic-logic-structure-grammar)  
        - [ ] [3.4.1. relation to classical logic](#341-relation-to-classical-logic)  
        - [ ] [3.4.2. pseudocode 4](#342-pseudocode-4)  
- [ ] [4. a practical example](#4-a-practical-example)  
- [ ] [5. implementation](#5-implementation)  

## 1. introduction

*Esperas* is born as an implementation attempt in a process of developing universal computational language named [*Logos*](https://github.com/e-teoria/Logos). As *Logos* is trying to provide a method to describe any other computational or descriptional language, *Esperas* will try to tame the very notion of [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) that can be used as a platform to host the *Logos* language. Nevertheless, *Esperas* will try to retain independency from any particular language (including *Logos*), and may be used as a multi-purpose programming library.

Although we will focus from the start on defining general syntactical properties, the road will finally lead us to defining general semantical properties of set of languages definable in *Esperas*. In our approach, syntax will lose a clear distinction from semantics because certain syntax properties require computational completeness we may only find in semantic definitions. Success of pairing provided grammars with input texts thus depends on supported grammar expressiveness that may even reach for sofisticated computational complexities like in [type checking](https://en.wikipedia.org/wiki/Type_system) or [formal verification](https://en.wikipedia.org/wiki/Formal_verification), under ambrella of [automated theorem proving](https://en.wikipedia.org/wiki/Automated_theorem_proving).

Our starting point in section (2.) will be processing [context-free grammars (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) by a novel *v-parser* algorithm. In section (3.), we describe a series of extensions to the basic *v-parer* algorithm, that aspire to establish more promising ratio of grammar applicability versus grammar complexity. In section (4.), we overview a simple practical parsing example using concepts from this exposure. Section (5.) exposes a Javascript *Esperas* implementation.

## 2. basic context free grammar algorithm

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

Proper construction of more complex grammars for particular purposes is a very broad area of investigation, and we will not go further into those details in this exposure. Interested readers are invited to search the web for `conext free grammar (CFG)` and `Backus-Naur form (BNF)` phrases for more information on this matter.

### 2.1. pseudocode 0

The version of *v-parser* algorithm presented in this section does not distinguish between terminals and non-terminals, thus enabling input text to contain non-terminals also. Input text is also expected to be [lexed](https://en.wikipedia.org/wiki/Lexical_analysis) into an array of tokens prior to actual parsing.

    01 FUNCTION Parse (grammar, start, input)
    02     tokens ← input;
    03     chart ← [][];
    04     MergeItem (0, [start, END_OF_FILE], 0, null);
    05     FOR each new column in chart DO
    06         FOR each new item in column DO
    07             FOR each production where production.left == item.Sequence[item.Index] in grammar DO
    08                 MergeItem (column.Index, production.right, 0, item);
    09 
    10     RETURN {Chart: chart, Success: (is END_OF_FILE element of chart[input.LENGTH]?)};
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

In this section we deal with extensions of original *v-parser* algorithm, originating from the raw lowest level computationally complete version towards higher level user friendly type of grammars. Firstly, we extend our algorithm to embrace [unrestricted grammar](https://en.wikipedia.org/wiki/Unrestricted_grammar) that is proven to be [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness). This step represents a bare minimum needed to support any [computable](https://en.wikipedia.org/wiki/Computable_function) relation between a grammar and input text.

However, we also require our system to represent grammars that are confortably and cozy to work with. Following this line of aspiration, we introduce two unrelated extensions along "generic" and "logic" axes. Generic axis is about introducing [generic variables](https://en.wikipedia.org/wiki/Generic_programming) to make grammar definitions similar to [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) easier to implement. Logic axis is about introducing [logic operators](https://en.wikipedia.org/wiki/Logical_connective) to make grammar definitions similar to [zeroth-order logic](https://en.wikipedia.org/wiki/Zeroth-order_logic) easier to implement. At the end, combining generic and logic axes leads us to "generic logic structure grammars", enabling us to handle [metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming) tasks more easily. This final system may represent a general theorem proving technology ready to cope with questions of connecting starting assumptions to final conclusions, in a form of connecting grammar rules to input text.

We introduce a nomenclature of mentioned extensions originating from "phrase pair structure grammar" which is a synonym for "unrestricted grammar". The nomenclature draws relations between "phrase" and "generic" notions, and between "pair" and "logic" notions. We can graphically depict the extensions and their namings in the following diagram:

           phrase logic                         generic logic
         structure grammar                    structure grammar
                 ● ––––––––––––––––––––––––––––––––▶ ●
                 ▲                                   ▲
                 |                                   |
                 |                                   |
    (logic axis) |                                   |
                 |                                   |
                 |                                   |
                 ● ––––––––––––––––––––––––––––––––▶ ●
            phrase pair      (generic axis)     generic pair
         structure grammar                    structure grammar

In this diagram, the originating phrase pair structure grammars are lower-level positioned on a grammar types scale, just like assembler is very much lower-level positioned in a programming language simplicity-of-use scale. With introduction of generic variables and logical reasoning, we try to move further and climb up the grammar types scale to achieve the effect similar to one that higher-level programming languages achieved comparing to assembler. But unlike assembler, for which we don't have opportunity to upgrade from the outside because it is based on strict hardware, phrase pair structure grammars may be easily extended from the outside by new properties because their interpretation is represented by a flexible software, which we have a chance to carefully adjust according to our requirements. The adjustments that we chose to realize, finally lead us to *generic logic structure grammar* language, aiming at relative simplicity of use in a way similar to constructive theorem proving.

### 3.1. phrase pair structure grammar

To be as clear as possible, this section will provide an algorithm for parsing famous [unrestricted grammars](https://en.wikipedia.org/wiki/Unrestricted_grammar), which are synonyms for phrase pair structure grammars. All production rules in phrase pair structure grammars are of the form:

    α -> β

where α and β are sequences of symbols. Definition of the phrase pair structure grammars and their ability to develop rules towards input string is similar to the context-free grammars definition, except that the left side of rules may also be sequences of symbols. Like in context-free grammars, it is also possible to produce ambiguous grammars when there are multiple productions with the similar left side phrases. To begin the process of parsing we have to provide the starting phrase which we further develop according to production rules.

#### 3.1.1. relation to Turing machines

Here, we will show how to simulate a single tape [Turing machine](https://en.wikipedia.org/wiki/Turing_machine) by unrestricted grammars. A Turing machine is a mathematical model of computation that defines an abstract machine, which manipulates symbols on a strip of tape according to a table of rules. Despite the model's simplicity, given any computer algorithm, a Turing machine capable of simulating that algorithm's logic can be constructed.

The machine operates on an infinite memory tape divided into discrete *cells*. The machine has its *head* that positions over a single cell and can read or write a symbol to the cell. The machine keeps a track of its current *state* from a finite set of states. Finally, the machine has a finite set of *instructions* which direct reading symbols, writing symbols, changing the current machine state and moving the tape to the left or to the right. Each instruction consists of the following:

1. reading the current state and reading a symbol at the position of head
2. depending on (1.), changing the current state and writing a symbol at the position of head
3. either move the tape one cell left or right

The machine repeats these steps until it encounters the halting instruction.

Unrestricted grammars can simulate a Turing machine by providing equivalents to its instructions in a form of production rules, while the initial symbol sequence on the tape is equivalent to grammar starting phrase. For example, this is what an equivalent of Turing machine that adds 1 to a binary number would look like (visit [this place](https://www.cis.upenn.edu/~matuszek/cit596-2012/NewPages/tm-to-grammar.html) for more information about the example):

    s 0 -> 0 s
    s 1 -> 1 s

    0 s # -> a 0 #
    1 s # -> a 1 #
    # s # -> a # #

    0 a 1 -> a 0 0
    1 a 1 -> a 1 0
    # a 1 -> a # 0

    a 0 -> 1 f
    a # -> 1 f 

    f 0 -> 0 f
    f 1 -> 1 f

    0 f # -> 0 h #
    1 f # -> 1 h #

    Abbreviations: s=start, a=add1, f=finish, h=halt

Symbols `0` and `1` denote binary digits, while the letter symbols carry on information about the head position and the current state. `#` symbol is used to determine the beginning and the end of tape operating range. If we, for example supply a starting phrase `# s 1 0 0 1 #` (this is starting setup of the tape and the machine showing a decimal number 9) as a part of the above grammar, that would be sufficient to correctly parse specific sequence `# 1 0 1 0 h #` (this is ending setup of the tape and the machine after halting, showing a decimal number 10), which represents exactly the starting phrase incremented by one. Inputting any other binary digit combinations to this grammar reports a parsing failure.

#### 3.1.2. pseudocode 1

What follows is an extension to original *v-parser* algorithm which enables text parsing according to unrestricted grammar rules.

    01 FUNCTION Parse (grammar, start, input)
    02     tokens ← input;
    03     chart ← [][];
    04     MergeItem (0, start UNION [END_OF_FILE], 0, null);
    05     FOR each new column in chart DO
    06         FOR each new item in column DO
    07             FOR i ← item.Index + 1 TO item.Sequence.LENGTH DO
    08                 FOR each production in grammar where Parse (grammar, item.Sequence from item.Index to i, production.left).Success is true DO
    09                     MergeItem (column.Index, production.right, 0, {Parents: item.Parents, Sequence: item.Sequence, From: item.Index, To: i});
    10 
    11     RETURN {Chart: chart, Success: (is END_OF_FILE element of chart[input.LENGTH]?)};
    12 
    13     PROCEDURE MergeItem (offset, sequence, index, parent)
    14         item ← chart[offset].FIND (sequence, index);
    15         IF not found item THEN
    16             item ← {Sequence: sequence, Index: index, Inherited: [], Inheritors: [], Parents: []};
    17             chart[offset].ADD (item);
    18 
    19         IF parent not in item.Parents THEN
    20             item.Parents.ADD (parent);
    21             FOR each x in [parent] UNION parent.Inherited DO
    22                 FOR each y in [item] UNION item.Inheritors DO
    23                     IF y.Index + 1 == y.Sequence.LENGTH
    24                         IF (x.Sequence, x.Index) not in y.Inherited THEN
    25                             x.Inheritors.ADD (y);
    26                             y.Inherited.ADD (x);
    27
    28                     IF x.To < x.Sequence.LENGTH THEN
    29                         IF y.Sequence[y.Index] == tokens[offset] THEN
    30                             FOR each z in x.Parents DO
    31                                 MergeItem (offset + 1, x.Sequence, x.To, z);

There are not much differences to the algorithm version that handles context free grammars. Grammars are now consisted of pairs of sequences. One of the most important changes is in introducing a new loop (line 7) that ranges over multiple sequence elements and matching them against left production sides (line 8). Matching is conveniently done by recursively calling the parsing function. The other important change is treating parents of items as ranges inside parent sequences (line 9). This somewhat changes parsing continuation process (line 31). Overall, the algorithm looks very similar to the original version.

### 3.2. generic pair structure grammar

Let's shed a light to a parsing process from a bit different angle. Each grammar rule represents a function mapping with right side being parameters, and left side being a result. We may consider a set of grammar rules as a complex function composition defined in a [declarative](https://en.wikipedia.org/wiki/Declarative_programming) way, while we may consider the staring sequence as the end result of the function. By walking up the grammar tree, we reach different parameter setups for the function, and those parameters are what is being matched by the input string we are trying to parse. Looking from this point of view, it makes sense to conceptualize a notion of variables that connect function parameters to a function result. We will extend our grammar language to support phrases that may contain variables, and we will name these kinds of phrases as "generic phrases". Generic phrases may form "generic pairs" in out new "generic pair structure grammars".

#### 3.2.1. relation to lambda calculus

#### 3.2.2. pseudocode 2

### 3.3. phrase logic structure grammar

#### 3.3.1. conversion between conjunctive and disjunctive normal forms

#### 3.3.2. conversion to sequential normal form

#### 3.3.3. resolution abduction rule in logic

#### 3.3.4. relation to zeroth-order logic

#### 3.3.5. pseudocode 3

### 3.4. generic logic structure grammar

#### 3.4.1. relation to classical logic

[classical logic](https://en.wikipedia.org/wiki/Classical_logic)

#### 3.4.2. pseudocode 4

## 4. a practical example

## 5. implementation

test it here: [(version 0.1, context free grammar)](https://e-teoria.github.io/Esperas/test)
