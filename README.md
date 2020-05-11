# Esperas

*[Abstract]*  

*(under construction) Esperas will be a library for implementing arbitrary metalanguages. Our starting point is handling context free grammars by a novel v-parser algorithm. Then we introduce a couple of extensions to the original algorithm to arrive at supporting a kind of Turing complete grammars, aiming at relative simplicity of use against resulting output chart clarity in a way similar to constructive theorem proving.*

## contents

- [x] [1. introduction](#1-introduction)  
- [ ] [2. building a Turing complete grammar language](#2-building-a-turing-complete-grammar-language)
    - [x] [2.1. context free grammars](#21-context-free-grammars)  
        - [x] [2.1.1. pseudocode 1](#211-pseudocode-1)  
    - [x] [2.2. right side phrases](#22-right-side-phrases)  
        - [x] [2.2.1. pseudocode 2](#221-pseudocode-2)  
    - [x] [2.3. logic structure](#23-logic-structure)  
        - [x] [2.3.1. conversion between conjunctive and disjunctive normal forms](#231-conversion-between-conjunctive-and-disjunctive-normal-forms)
        - [x] [2.3.2. nesting logical formulas inside sequences](#232-nesting-logical-formulas-inside-sequences)
        - [x] [2.3.3. resolution abduction rule in logic](#233-resolution-abduction-rule-in-logic)
        - [x] [2.3.4. pseudocode 3](#234-pseudocode-3)  
    - [ ] [2.4. variables](#24-variables)  
        - [ ] [2.4.1. pseudocode 4](#241-pseudocode-4)  
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

Incorporating the whole phrases to production rules right sides, the rewriting rules take a form:

    β -> α

where `β` and `α` are sequences of strings. Definition of this type of grammars and their ability to develop `α` sides of rules towards `β` side input sequences is similar to the modified context-free grammars definition, except that the `α` sides may also be sequences of strings. Of course, like in context-free grammars, it is possible to produce ambiguous grammars when there are multiple productions with the similar right side phrases. Again, we begin the process of parsing by providing the initial starting right-side phrase which we develop towards left-sides according to production rules. The success of production continuation down the parse tree requires preceding left side phrase to be equal or a subset of continuing right side phrase.

There is one important behavior that makes our approach different from [unrestricted grammars](https://en.wikipedia.org/wiki/Unrestricted_grammar) (see type-0 grammar in [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy)). In unrestricted grammars, it is possible to combine merely *parts* of neighbour production resolvents to form a single base for new production resolvents. Although this behavior is what makes unrestricted grammars Turing complete, because of this behavior, unrestricted grammars are very complicated to reason about. To avoid this phrase fragmentation, we take another approach: we pose a strict parent-child structure policy where, to produce a parent resolvent, the whole child, or a whole of all neighbour children formation should be taken into account when matching production bases. This preserves a general tree structure that is simple to reason about.

Because of this adjustment, although introducing right side phrases still does not make our approach Turing complete on its own, it is an imortant step towards building a Turing complete framework. Introducing a notion of variables a bit later, section 2.4. will make our framework Turing complete while retaining structuring of the wholes as strict parent-child relations.

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
    16                 IF production.Right equals match or (Parse (grammar, production.Right, match, [recItem] UNION rec)).Success is true THEN
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

The code changes are visible in the main loop (lines 7-9) that now call `DoMatch` procedure (lines 13-17) twice, once for specific sequence item, and once for the whole sequence. `DoMatch` procedure tries to match parts or entire left rule sides to the right rule sides. In a case of parts, it is enough to graphically test match equivalence, but in a case of entire phrases, the left side text could be required to be fully parsed against the right side start phrase in its own sandbox. In this sandboxing, we are avoiding unnecessarry recursive loops by utilizing `rec` array function parameter.

There exists an optimization that is left out for code clarity, but would increase the speed of parsing. It is a [memoization](https://en.wikipedia.org/wiki/Memoization) technique optimizing cases where a function is repeatedly called with the same parameters. Since in call to `Parse` function (line 16) the same parameters always draw the same result, on each call to `Parse` function, parsing success could be paired to call parameters and memorized in parameters-result table. This array could then be checked on each call to `Parse` function, just to return the same result if we encounter the same parameters setup again, thus avoiding repeating the speed sensitive call to `Parse` function.

The content of `MergeItem` procedure remained unchanged comparing to the first pseudocode 1 version.

### 2.3. logic structure

[Logic](https://en.wikipedia.org/wiki/Logic) is the systematic study of the form of valid inference, and the most general laws of truth. A valid inference is one where there is a specific relation of logical support between the assumptions of the inference and its conclusion. In ordinary discourse, inferences may be signified by words such as therefore, thus, hence, ergo, and so on.

What do we get by introducing logic to parsing? Logical operators like *and*, *or*, *not*, and *implication* are being embedded within natural languages that we naturally use in our dayly lives, and as such, make good candidates in forming our thoughts to generally reason about parsing grammars we work on. Once that grammars are conceptualized, logic allows us to translate our grammars in normalized compact forms, and to extract information we need about them on demand. Utilizing logic framework, we are in possesion of methods that parform extraction of all the knowledge implicitly contained in a set of assumptions represented by our initial grammar constructs. Such a logical inference completeness is welcomed both in scientific analysis and in activities related to the daily use of computers, in general.

[Zeroth-order logic](https://en.wikipedia.org/wiki/Zeroth-order_logic) is [first-order logic](https://en.wikipedia.org/wiki/First-order_logic) without [variables](https://en.wikipedia.org/wiki/Variable_(mathematics)) or [quantifiers](https://en.wikipedia.org/wiki/Quantifier_(logic)). In our interpretation, we consider zeroth-order logic as a form of [propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus) that allows relating [propositions](https://en.wikipedia.org/wiki/Propositions) in phrases represented by propositional sequences. In this section we will show how to turn zeroth-order logic expressions into parsing grammar definitions suitable for algorithmic input parsing. We will use some of well known methods of logic conversion to [conjunctive normal form](https://en.wikipedia.org/wiki/Conjunctive_normal_form). Then we will show how to process conjunctive normal forms by abduction analog of the well known [logic resolution](https://en.wikipedia.org/wiki/Resolution_(logic)) method.

#### 2.3.1. conversion between conjunctive and disjunctive normal forms

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

In this section we learned how to convert logical formulas between CNF and DNF. Using described methods, conversion from CNF to DNF may take an exponential amount of combinatorial complexity, but conversion from DNF to CNF takes a linear amount of combinatorial complexity. Luckily for us (or maybe because we are using what we are provided with), we are interested in this second, faster kind of conversion in producing our parser. Keeping our formulas in CNF will open the doors for extracting grammar rules by logical resolution abduction, is covered in the next section.

#### 2.3.2. nesting logical formulas inside sequences

Because we deal with sequences in the process of parsing, it is possible to nest logical formulas inside sequences. With a simple extraction of nested formulas outside sequences, we are able to convert them to ordinary CNF expressions. For example, we may encounter the following sequence, nesting a logic expression `B \/ C`:

    A (B \/ C) D

To convert this form to a regular CNF, we introduce a new atom `X`, and write the following:

    (A X D) /\ (X -> (B \/ C))
    
which is equivalent to:

    (A X D) /\ (~ X \/ B \/ C)

We process these kinds of expressions as noted in the following sections.

#### 2.3.3. resolution abduction rule in logic

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

We will refer to this rule as a *resolution abduction* rule.

To apply *resolution abduction* rule to parsing, we consider a set of logical formulas as parsing rules. After conversion of grammar expressed by logic formulas to CNF, we isolate single element disjunctions, and declare them as start symbols. Then we repeatedly apply *resolution abduction* rule to move up the syntax tree. Two elements disjunctions are treated as standard left-right rule pairs, with a difference that left match yields negated right side, and right match yields negated left side. In a case of more than two elements disjunctions we have to be careful to treat the *resolution abduction* results as conjunctions, requiring all the conjunction elements to be successfully parsed to move to the next sequence element.

#### 2.3.4. pseudocode 3

Here, we present a variation of *V-Parser* algorithm that operates on logic structure grammars. This variation takes *CNF* as input grammar instead of flat two-elements productions.

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
    15             FOR each disjunction in grammar DO
    16                 FOR i = 0 TO disjunction.LENGTH DO
    17                     IF disjunction != disj and i != disjunction.INDEX_OF (complemented disj[index]) THEN
    18                         MergeItem (column.Index, disjunction, i, 1, parents);
    19
    20     PROCEDURE MergeItem (offset, disj, disjindex, seqindex, parents)
    21         item ← chart[offset].FIND (disj, disjIndex, seqIndex);
    22         IF not found item THEN
    23             item ← {Disj: disj, DisjIndex: disjIndex, SeqIndex: seqIndex, Inherited: [], Inheritors: [], Parents: [], SuccChildren: []};
    24             chart[offset].ADD (item);
    25 
    26         FOR each parent in parents DO
    27             IF parent not in item.Parents THEN
    28                 item.Parents.ADD (parent);
    29                 InitSuccess (parent, disj);
    30                 IF item is terminal and (item succeeded in lexed at offset) THEN
    31                     NotifySuccess (item);
    32                     
    33                 FOR each x in [parent] UNION parent.Inherited DO
    34                     FOR each y in [item] UNION item.Inheritors DO
    35                         IF y.SeqIndex + 1 == y.Disj[y.DisjIndex].LENGTH
    36                             IF (x.Disj, x.DisjIndex, x.SeqIndex) not in y.Inherited THEN
    37                                 x.Inheritors.ADD (y);
    38                                 y.Inherited.ADD (x);
    39        
    40                         IF x.SeqIndex + 1 < x.Disj[x.DisjIndex].LENGTH THEN
    41                             IF y is terminal and (IsSuccess (x) or x.Disj[x.DisjIndex][0] == "~") THEN
    42                                 MergeItem (offset + 1, x.Disj, x.DisjIndex, x.SeqIndex + 1, x.Parents);
    43
    44     PROCEDURE InitSuccess (parent, disj)
    45         IF not parent.SuccChildren.FIND (duality, disj) THEN
    46             parent.SuccChildren.ADD ({Disj: disj, Success: []});
    47     
    48     PROCEDURE NotifySuccess (item)
    49         IF (item.SeqIndex + 1 == item.Disj[item.DisjIndex].LENGTH) or (item.Disj[item.DisjIndex][0] == "~") THEN
    50             FOR each parent in item.parents DO
    51                 d ← parent.SuccChildren.FIND (item.Disj);
    52                 IF found d and {Disj: item.Disj, DisjIndex: item.DisjIndex} not in d.Success THEN
    53                     d.Success.ADD ({Disj: item.Disj, DisjIndex: item.DisjIndex});
    54                     NotifySuccess (parent);
    55    
    56     PROCEDURE IsSuccess (item)
    57         FOR each child in item.SuccChildren DO
    58             IF child.Success.LENGTH == child.Disj.LENGTH - 1 THEN
    59                 RETURN true;
    60     
    61         RETURN false

The algorithm input this time is changed to accept text lexed into tokens which may be negated or non-negated. The output chart again holds sequences with indexes corresponding to sequence atoms, acceptable by `MergeItem` procedure, but this time the sequences are represented in a form of pairs of a disjunction and an index of particular disjunct. There is also an indicator wired at the position `0` of each sequence that says if the sequence is complemented (value `~`) or not (any other value). In addition, `SuccChildren` attribute serves for verifying the success of parsing every disjunct in child disjunctions.

The first visible difference to the prior algorithm is modification of the main loop in `DoMatch` function to also range over disjuncts in disjunctions (lines 15-18), according to *resolution abduction* rule.

Procedure `MergeItem` is more or less unchanged, except dealing with conjunctions or negations (lines 29-31). This requires inclusion of functions `InitSuccess`, `NotifySuccess`, and `IsSuccess` described between lines 44-61.

`InitSuccess` initializes each item with `SuccChildren` content where item's child disjunctions are enumerated. For each item, to proceed with parsing, it is required that all the disjuncts (except the anchor one) from `Disj` attribute are successfully parsed. But why all the disjuncts have to be successful to conclude the success? It is because the *resolution abduction rule* turns disjunctions into conjunctions of complemented disjuncts. Thus, we have to keep track of each suceeded disjunct to successfully move towards end of text input. `NotifySuccess` function simply passes the success indicator (line 53) over all the parents of item, recursively. `IsSuccess` function conveniently returns true if all the child disjuncts are successfull.

To detect if the whole parsing process is successful, it is still necessary to handle a kind of `END_OF_FILE` atom like in unmodified verion of *Esperas* algorithm, just to verify if the parsing has terminated exactly at the actual text input length. Note that no checks for contratiction are made by the parsing function.

### 2.4. variables

Let's shed some light to grammars from a bit different point of view. Each grammar rule is an equivalent to a [function](https://en.wikipedia.org/wiki/Function_(mathematics)) mapping from the left rule side to the right rule side. We may consider a set of grammar rules as a complex function composition defined in a [declarative](https://en.wikipedia.org/wiki/Declarative_programming) way, while we may consider the staring sequence as the end result of this complex function. By walking down the grammar tree, we reach for different parameter setups for the function, and combination of those parameters is what is being matched by the input string that we try to parse. Looking from this angle, it seems reasonable to conceptualize a notion of abstraction variables that would reside within function parameters and a function result, enabling phrases to be instantiated by specific values on demand. Thus, we will extend our grammar language to support phrases that may contain variables, and we will name these kinds of phrases as *generic phrases*.

We may describe variables as placeholders that accept values varying within their type bounds. This property is already achieved on its own with alternate productions. However, variables have one important property not contained within current production system: identical matching at multiple placeholders. To distinct between variables, we will enclose variables within a number od point braces that will denote a degree of variables. Point braces resemble the essence of a-expressions from Logos computing language. We will not go into deeper detail with analyzing a-expressions. Instead, we will only overview contures of the variable system, while interested readers are invited to learn more about it at [Logos home page](https://github.com/e-teoria/Logos).

The following productions describe a type of integers:

           zero -> < int > ;
    one < int > -> < int >

This inductive definition describes a type `< int >` that we may use to form other expressions like a function of incrementing by one:
 
    < < ( > >
        < int > -> < X > ;
        increment "(" < < X > > ")" -> one < < X > >
    < < ) > >

Expressions `< &ob >` and `< &cb >` stand for opened brace and closed brace, respectively. The first line `< < ( > >` denotes the beginning of operating scope of inner variables. The second line defines a type `< int >` of variable `X` enclosed in a pair of point braces. The third line uses that variable enclosed in double pair of point braces. The last line `< < ) > >` denotes the ending of operating scope of inner variables. The connection between the declaration `< X >` and the use `< < X > >` is the following: variables with the same name, but with different number of point braces implicitly behave like productions composed of variables with lower number of point braces and variables with higher number of point braces (in our example: `< X > -> < < X > >`), with the additional important property that within the same scope, similar variables enclosed within similar number of point braces match the same expressions only defined by similar lower degree variables.

As another example, we may form the following production scope:

    < < ( > >
        < int > -> < X > ;
        < < X > > ^ 2 -> < < X > > * < < X > >
    < < ) > >    

Using this scope, given a starting sequence `zero * zero`, it is possible to parse input text `zero ^ 2`.

This last adjustment finally makes our framework Turing complete while retaining structuring of the wholes as strict parent-child relations.

#### 2.4.1. pseudocode 4

*... to do ...*

## 3. use case: extense framework

*... to do ...*

A term rewriting system is possible where parsing rules are completely customizable, operating on user defined language. For example, we may have defined the following toy language, accepting a sequence of integers:

      ... < seq > ... -> < top > /\
    < int > , < seq > -> < seq > /\
              < int > -> < seq > /\
                 zero -> < int > /\
          one < int > -> < int > /\
              < top >

and we may have defined rewrite rules representing functions:

                             int -> < x >                   /\
    < < ( > >     succ < < x > > -> one < < x > > < < ) > > /\
    < < ( > > pred one < < x > > -> < < x > >     < < ) > > 

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
                                 int -> < x > /\
            < < ( > > succ < < x > > -> one < < x > > < < ) > >
        )
        ,
        (
            pred one zero
        ) <~~ (
                                     int -> < x > /\ 
            < < ( > > pred one < < x > > -> < < x > > < < ) > >
        )
        ...
    ) <~~ (
          ... < seq > ... -> < top > /\
        < int > , < seq > -> < seq > /\
                  < int > -> < seq > /\
                     zero -> < int > /\
              one < int > -> < int >
                  < top >
    )

The outermost grammar node expects a sequence of integers. Expressions `succ <x> ~~> one <x>` and `pred one <x> ~~> <x>` represent addon rewrite rules, and are being treated as parsing rules. Because the parser expects `int` to be read at appropriate places, we may write expressions like `succ zero` or `pred one zero` wherever `int` is expected, under scopes where these functions are defined. In this system, type-checking is done entirely by the underlying parser, observing the base grammar. Parser initially expects some forms of expressions which are then passed from right to left sides of rewriting rules in higher grammars, while reporting a parsing errors on incorrect sub-expression types.

With this system it is possible to start with, for example a valid assembler grammar language, and to extend it by higher level language rules, showing how to transpile these higher level language expressions to assembler expressions. It shouldn't be a problem to mix in several different higher level languages with their own rules, or maybe to define even higher structures that transpile to these higher level languages, which at the end of the process transpile to assembler.

### 3.1. classical logic

[Classical logic](https://en.wikipedia.org/wiki/Classical_logic) (or standard logic) is the intensively studied and most widely used class of logics. The important part of our logic definition is in handling variables. We use universal and existential [quantifiers](https://en.wikipedia.org/wiki/Quantifier_(logic)) to bound variables which we extrude from related constant expressions by implications that introduce fresh variables (`<y>` in the following definition). As expected in higher order logic, variables may stand for constants, functions, or predicates.

    (
        // example logic expressions
        ( ∀ x . ∀ y . ~ ( x /\ y ) <-> ~ x \/ ~ y ) /\
        ( ∀ x . ∀ y . ~ ( x \/ y ) <-> ~ x /\ ~ y )
        
    ) <~~ < ( >
        // syntax
        (      ∃ < atom > . < eq > -> < top >  ) /\
        (      ∀ < atom > . < eq > -> < top >  ) /\
        (                   < eq > -> < top >  ) /\
        (    < impl > "<->" < eq > -> < eq >   ) /\
        (                 < impl > -> < eq >   ) /\
        (    < and > "->" < impl > -> < impl > ) /\
        (                  < and > -> < impl > ) /\
        (      < and > "/\" < or > -> < and >  ) /\
        (                   < or > -> < and >  ) /\
        (      < or > "\/" < not > -> < or >   ) /\
        (                  < not > -> < or >   ) /\
        (             "~" < pred > -> < not >  ) /\
        ( < atom > "(" < seq > ")" -> < pred > ) /\
        (                 < prim > -> < pred > ) /\
        (       < atom > , < seq > -> < seq >  ) /\
        (                 < atom > -> < seq >  ) /\
        (          "(" < top > ")" -> < prim > ) /\
        (                 < atom > -> < prim > ) /\
        ( /[_A-Za-z][_0-9A-Za-z]*/ -> < atom > ) /\
        
        // semantics
        < < ( > >
            (  < top > -> < a > ) /\
            (  < top > -> < b > ) /\
            ( < atom > -> < x > ) /\
                
            ( < < a > > "<->" < < b > > -> ( < < a > > <-> < < b > > )                              ) /\
            (  < < a > > "->" < < b > > -> ( < < a > > -> < < b > > )                               ) /\
            (  < < a > > "/\" < < b > > -> < < a > > /\ < < b > >                                   ) /\
            (  < < a > > "\/" < < b > > -> < < a > > \/ < < b > >                                   ) /\
            (             "~" < < a > > ->  ~ < < a > >                                             ) /\
            (       ∀  < < x > > . < a > -> ( ( < b > -> < x > ) /\ ( < < x > > -> < < a > > ) )     ) /\
            (       ∃  < < x > > . < a > -> ( ( < b > -> < x > ) /\ ~ ( < < x > > -> ~ < < a > > ) ) )
        < < ) > >
    < ) >
        
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
        ( λ x . ( x x ) ) ( ( λ x . ( x x ) ) 2 )
        
    ) <~~ < ( >
        // top
        < λterm > /\

        // syntax
        (                 < λvar > -> < λterm >   ) /\
        (   λ < λvar > . < λterm > -> < λterm >   ) /\
        (    < λterm > < primary > -> < λterm >   ) /\
        (              < primary > -> < λterm >   ) /\
        (        "(" < λterm > ")" -> < primary > ) /\
        (                 < λvar > -> < primary > ) /\
        ( /[_A-Za-z][_0-9A-Za-z]*/ -> < λvar >    ) /\

        // semantics
        < < ( > >
            ( < λterm > -> < M > ) /\
            ( < λterm > -> < N > ) /\
            (  < λvar > -> < x > ) /\
            (     < x > -> < N > ) /\
            
            (
                (
                    (
                        (
                            "(" ( ( λ < < x > > . < < M > > ) -> < λterm > ) ")"
                        ) -> < primary >
                    ) -> < λterm >
                ) < < N > > -> < < M > >
            )
        < < ) > >
    < ) >
    
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
        (  s 0 => 0 R s  ) ,
        (  s 1 => 1 R s  ) ,
        
        ( s () => () L a ) ,
        
        (  a 1 => 0 L a  ) ,
        
        (  a 0 => 1 R f  ) ,
        
        (  f 0 => 0 R f  ) ,
        (  f 1 => 1 R f  ) ,
        
        ( f () => () R h ) :
        
        // initial tape setup
        ( () s 1 0 0 1 () )
        
    ) <~~ < ( >
        // top
        < seq > : "(" < tape > ")" /\

        ( /[a-z]/ -> < state > ) /\
        (       0 -> < bit >   ) /\
        (       1 -> < bit >   ) /\
        (    "()" -> < bit >   ) /\
        
        // tape syntax
        ( < state > < bit > -> < head >  ) /\
        (           < bit > -> < cell >  ) /\
        (          < head > -> < cell >  ) /\
        ( < tape > < cell > -> < tape >  ) /\
        (          < cell > -> < tape >  ) /\
    
        // instructions syntax
        (                                             L -> < dir > ) /\
        (                                             R -> < dir > ) /\
        ( "(" < head > => < bit > < dir > < state > ")" -> < ins > ) /\
        (                           < ins > "," < seq > -> < seq > ) /\
        (                                       < ins > -> < seq > )
        
        // extracting each instruction and the tape
        < < ( >
            ( < < ins > > , < < seq > > -> < < ins > > /\ < < seq > > ) /\
            ( ( < < ins > > -> < < seq > > ) -> < < ins > > )
            ( < seq > : < < tape > > -> < < tape > > )
        < < ) > > /\
        
        // changing bit and state, and moving head to the right
        < < ( > >
            // declarations
            ( < bit > -> < newBit > ) /\
            ( < state > -> < newState > ) /\
            
            // prepare
            "(" < < state > > < < bit > > => < < newBit > > R < < newState > > ")" -> (
                (
                    < < state > > < < bit > > -> < cell >
                ) -> (
                    < < newBit > > R < < newState > > -> < cell >
                )
            ) /\

            // finalize
            (
                (
                    (
                        < < tape > > (
                            < < newBit > > R < < newState > > -> < cell >
                        )
                    ) (
                        < < bit > > -> < cell >
                    )
                ) -> ( 
                    (
                        < < tape > > (
                            < < newBit > > -> < cell >
                        )
                    ) (
                        < < newState > > < < bit > > -> < cell >
                    ) 
                )
            )
        < < ) > >
        
        // changing bit and state, and moving head to the left
        < < ( > >
            // declarations
            ( < bit > -> < newBit > ) /\
            ( < state > -> < newState > ) /\
            
            // prepare
            "(" < < state > > < < bit > > => < < newBit > > L < < newState > > ")" -> (
                (
                    < < state > > < < bit > > -> < cell >
                ) -> (
                    < < newBit > > L < < newState > > -> < cell >
                )
            ) /\

            // finalize
            (
                (
                    (
                        < < tape > > (
                            < < bit > > -> < cell >
                        )
                    ) (
                        < < newBit > > L < < newState > > -> < cell >
                    )
                ) -> ( 
                    (
                        < < tape > > (
                            < < newState > > < < bit > > -> < cell >
                        )
                    ) (
                        < < newBit > > -> < cell >
                    ) 
                )
            )
        < < ) > >
    < ) >
    
    
## 4. implementation

test js code here: [(version 0.1, only context free grammar)](https://e-teoria.github.io/Esperas/test)

*... to do ...*
