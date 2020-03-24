# Esperas

*[Abstract]*  

*(under construction) Esperas will be a library for implementing arbitrary metalanguages. Our starting point is handling context free grammars by a novel v-parser algorithm. Then we introduce a few extensions to the original algorithm to arrive at supporting **type generic-phrase logic-structure grammars**, aiming at relative simplicity of use in a way similar to constructive theorem proving.*

## contents

- [x] [1. introduction](#1-introduction)  
- [x] [2. basic context free grammar parsing algorithm](#2-basic-context-free-grammar-parsing-algorithm)
    - [x] [2.1. pseudocode 0](#21-pseudocode-0)  
- [ ] [3. extending grammar language](#3-extending-grammar-language)  
    - [ ] [3.1. type (phrase: specific, structure: pair) grammar](#31-type-phrase-specific-structure-pair-grammar)  
        - [ ] [3.1.1. pseudocode 1](#311-pseudocode-1)  
    - [ ] [3.2. type (phrase: generic, structure: pair) grammar](#32-type-phrase-generic-structure-pair-grammar)  
        - [ ] [3.2.1. pseudocode 2](#321-pseudocode-2)  
    - [ ] [3.3. type (phrase: specific, structure: logic) grammar](#33-type-phrase-specific-structure-logic-grammar)  
        - [x] [3.3.1. conversion between conjunctive and disjunctive normal forms](#331-conversion-between-conjunctive-and-disjunctive-normal-forms)  
        - [x] [3.3.2. conversion to conjunctive sequential normal form](#332-conversion-to-conjunctive-sequential-normal-form)  
        - [x] [3.3.3. resolution abduction rule in logic](#333-resolution-abduction-rule-in-logic)  
        - [x] [3.3.4. a logic puzzle example](#334-a-logic-puzzle-example)  
        - [x] [3.3.5. pseudocode 3](#335-pseudocode-3)  
    - [ ] [3.4. type (phrase: generic, structure: logic) grammar](#34-type-phrase-generic-structure-logic-grammar)  
        - [ ] [3.4.1. pseudocode 4](#341-pseudocode-4)
- [ ] [4. examples](#4-examples)  
    - [ ] [4.1. Turing machines](#41-Turing-machines)  
    - [ ] [4.2. lambda calculus](#42-lambda-calculus)  
    - [ ] [4.3. classical logic](#43-classical-logic)  
- [ ] [5. implementation](#4-implementation)  

## 1. introduction

*Esperas* is born as an implementation attempt in a process of developing universal computational language named [*Logos*](https://github.com/e-teoria/Logos). As *Logos* is trying to provide a method to describe any other computational or descriptional language, *Esperas* will try to tame the very notion of [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) that can be used as a platform to host the *Logos* language. Nevertheless, *Esperas* will try to retain independency from any particular language (including *Logos*), and may be used as a multi-purpose programming library.

Although we will focus from the start on defining general syntactical properties, the road will finally lead us to defining general semantical properties of set of languages definable in *Esperas*. In our approach, syntax will lose a clear distinction from semantics because certain syntax properties require computational completeness we may only find in semantic definitions. Success of pairing provided grammars with input texts thus depends on supported grammar expressiveness that may even reach for sofisticated computational complexities like in [type checking](https://en.wikipedia.org/wiki/Type_system) or [formal verification](https://en.wikipedia.org/wiki/Formal_verification), under ambrella of [automated theorem proving](https://en.wikipedia.org/wiki/Automated_theorem_proving).

Our starting point in section [2.] will be processing [context-free grammars (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) by a novel *v-parser* algorithm. Section [3.] describes a series of extensions to the basic *v-parser* algorithm that aspire to establish more promising ratio of grammar applicability versus grammar complexity. In section [4.] we explain a few examples of our interest, while section [5.] exposes specific Javascript *Esperas* implementation.

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

Proper construction of more complex grammars for particular purposes is a very broad area of investigation, and we will not go further into those details in this exposure. Interested readers are invited to search the web for *conext free grammar (CFG)* and *Backus-Naur form (BNF)* for more information on this matter.

### 2.1. pseudocode 0

This is *v-parser* algorithm that parses input text against context free grammar rules. The version of algorithm presented in this section does not distinguish between terminals and non-terminals, thus enabling input text to contain non-terminals. Input text is also expected to be [lexed](https://en.wikipedia.org/wiki/Lexical_analysis) into an array of tokens prior to actual parsing.

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

In this section we bring some extensions to original *v-parser* algorithm. We start from extending our algorithm to embrace phrase related definitions. In further extensions, beside requirement for our grammar to be [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), we also require our system to represent grammars that are confortably and cozy to work with. Following these lines of aspiration, we introduce two unrelated extensions along *generic* and *logic* axes. Generic axis is about introducing [generic variables](https://en.wikipedia.org/wiki/Generic_programming) to make grammar definitions similar to [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) easier to implement. Logic axis is about introducing [logic operators](https://en.wikipedia.org/wiki/Logical_connective) to make grammar definitions similar to [zeroth-order logic](https://en.wikipedia.org/wiki/Zeroth-order_logic) easier to implement. Finally, combining extensions over both generic and logic axes leads us to *type (phrase: generic, structure: logic) grammars*, enabling us to handle [higher-order logic](https://en.wikipedia.org/wiki/Higher-order_logic) and [metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming) tasks more easily. This final, [computationally](https://en.wikipedia.org/wiki/Computable_function) complete system may represent a general theorem proving technology ready to cope with questions of connecting starting assumptions to ending conclusions, in a form of connecting input text stream to grammar rules.

We introduce a special nomenclature of this extensions system originating from basic *type (phrase: specific, structure: pair) grammar*. The nomenclature points out relations between "specific" and "generic" phrases, and between "pair" and "logic" structure. We can graphically depict the extensions and their namings by the following diagram:

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

In this diagram, the initial *type (phrase: specific, structure: pair) grammars* are lower-level positioned on a grammar types scale. With introduction of generic variables and logical reasoning, we try to move further and climb up the grammar types scale to achieve double effect: increased expressivity along generic axis, and increased ease of use along logic axis. The adjustments that we chose to realize finally lead us to combined *type (phrase: generic, structure: logic) grammar* language, thus reaching usability similar to one of [constructive theorem proving](https://en.wikipedia.org/wiki/Constructive_proof).

### 3.1. type (phrase: specific, structure: pair) grammar

This section will provide an algorithm for parsing *type (phrase: specific, structure: pair) grammars*. But before that, we will make a small adjustments to context free grammar language which we will base our new types of grammars on. Usual context free grammars take form of `A -> α` production rule patterns, where in parsing we seek for the left production sides to parse the right production sides. Alternations are there expressed by repeating the same *left sides* across multiple production rules. However, this is inconsistent with classical logic expressions where the following rules hold for implication connective:

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

where `β` and `α` are sequences of symbols. Definition of this type of grammars and their ability to develop `α` sides of rules towards `β` side input sequences is similar to the modified context-free grammars definition, except that the `α` sides may also be sequences of strings. Of course, like in context-free grammars, it is possible to produce ambiguous grammars when there are multiple productions with the similar right side phrases. Again, we begin the process of parsing by providing the initial starting right-side phrase which we develop towards left-sides according to production rules.

There is one important behavior that makes *type (phrase: specific, structure: pair) grammars* different from [unrestricted grammars](https://en.wikipedia.org/wiki/Unrestricted_grammar) (see type-0 grammar in [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy)). In unrestricted grammars, it is possible to combine merely *neighbour parts* of neghbour production resolvents to form a single base for new production resolvents. Although this behavior is what makes unrestricted grammars Turing complete, because of this behavior, unrestricted grammars are very complicated to reason about. *Type (phrase: specific, structure: pair) grammars* take another approach: it poses a strict parent-child structure policy where to produce a parent resolvent, the whole child, or a whole of neighbour children formation should be considered when matching production bases. This preserves concise general structure that is simple to reason about. In a short term, this makes *Type (phrase: specific, structure: pair) grammars* questionable in achieving Turing completeness, but already with introduction of generic variables in *Type (phrase: generic, structure: pair) grammars*, we achieve a decent Turing completeness, while retaining a very desirable property of simple and consistent parent-child structure relations.

#### 3.1.1. pseudocode 1

*... to do...*

### 3.2. type (phrase: generic, structure: pair) grammar

Let's shed some light to grammars from a bit different point of view. Each grammar rule is an equivalent to a [function](https://en.wikipedia.org/wiki/Function_(mathematics)) mapping from the right rule side to the left rule side. We may consider a set of grammar rules as a complex function composition defined in a [declarative](https://en.wikipedia.org/wiki/Declarative_programming) way, while we may consider the staring sequence as the end result of the function. By walking down the grammar tree, we reach for different parameter setups for the function, and combination of those parameters is what is being matched by the input string that we try to parse. Looking from this angle, it seems reasonable to conceptualize a notion of abstraction variables that would reside within function parameters and a function result, enabling phrases to be instantiated by specific values on demand. Thus, we will extend our grammar language to support phrases that may contain variables, and we will name these kinds of phrases as "generic phrases". Inheriting formalisms from previous sections, generic phrases may form "generic phrase pairs", making an entrance to our new *type (phrase: generic, structure: pair) grammars*.

To explain how generic phrases behave, let's again consider the following productions that describe a set of integers:

    zero -> int
    int one -> int

Further, let's add one more production to the above two, defining a function of incrementing by one:
 
    increment ( <X> ) -> <X> one

In this example, we used variable `X` where we use point braces to denote that `X` is a variable, not a constant phrase. Starting with `int` sequence again, the grammar can now successfully parse sequences like `increment ( zero one one one )`, as expected. This is because the right side of production `increment ( <X> ) -> <X> one` successfully matches against the left side of production `int one -> int`, thus reflecting substitution of `int` for `<X>`.

It is possible to write any number of the same or different variables at within phrases. It is also possible to construct phrases consisted only of variables, which may find a use in a field of [combinatory logic](https://en.wikipedia.org/wiki/Combinatory_logic). In a case of repeated use of the same variable in the same phrase, during the phrase recognition, the same input fragment is required to match all of the same variable placeholders, like in an example:

    <Y> ^ 2 -> <Y> * <Y>

Given a starting sequence `3 * 3`, we can successfully parse input text `3 ^ 2` from this grammar.

With these simple extensions to support *generic phrases*, we are already reaching expression semantics which we may use to build Turing complete grammars.

#### 3.2.2. pseudocode 2

*... to do ...*

### 3.3. type (phrase: specific, structure: logic) grammar

[Logic](https://en.wikipedia.org/wiki/Logic) is the systematic study of the form of valid inference, and the most general laws of truth. A valid inference is one where there is a specific relation of logical support between the assumptions of the inference and its conclusion. In ordinary discourse, inferences may be signified by words such as therefore, thus, hence, ergo, and so on.

What do we get by introducing logic to parsing? Logical operators like *and*, *or*, *not*, and *implication* are being embedded within natural languages that we naturally use in our dayly lives, and as such, make good candidates in forming our thoughts to generally reason about parsing grammars we work on. Once that grammars are conceptualized, logic allows us to translate our grammars in normalized compact forms, and to extract information we need about them on demand. Utilizing logic framework, we are in possesion of methods that parform extraction of all the knowledge implicitly contained in a set of assumptions represented by our initial grammar constructs. Such a logical inference completeness is welcomed both in scientific analysis and in activities related to the daily use of computers, in general.

[Zeroth-order logic](https://en.wikipedia.org/wiki/Zeroth-order_logic) is [first-order logic](https://en.wikipedia.org/wiki/First-order_logic) without [variables](https://en.wikipedia.org/wiki/Variable_(mathematics)) or [quantifiers](https://en.wikipedia.org/wiki/Quantifier_(logic)). In our interpretation, we consider zeroth-order logic as a form of [propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus) that allows relating [propositions](https://en.wikipedia.org/wiki/Propositions) in phrases represented by propositional sequences. In this section we will show how to turn zeroth-order logic expressions into parsing grammar definitions suitable for algorithmic input parsing. We will use some of well known methods of logic conversion to [conjunctive normal form](https://en.wikipedia.org/wiki/Conjunctive_normal_form) and introduce a conversion to a novel *sequential normal form*. Then we will show how to process conjunctive normal forms by abduction analog of the well known [logic resolution](https://en.wikipedia.org/wiki/Resolution_(logic)) method. The abduction will finally allow us to interpret *sequential normal forms* as grammar guidelines needed for parsing input sequences.

##### 3.3.1. conversion between conjunctive and disjunctive normal forms

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

##### 3.3.2. conversion to conjunctive sequential normal form

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

##### 3.3.3. resolution abduction rule in logic

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

### 3.3.4. logic puzzle example

In this section we will solve a logical puzzle within *type (phrase: specific, structure: logic) grammar*, using zeroth-order logic. The puzzle example is inspired by [this logic puzzle generator](https://demonstrations.wolfram.com/PropositionalLogicPuzzleGenerator/). The problem is about a simple world that is inhabited by triangles, squares, and pentagons, each with three sizes and two colors. The world is given some general rules about relations between elements it may contain. The task is to find a possible setup of size, color and shape of these elements.

Considering a world with elements `A`, `B` and `C`, we give the world setup by the following rules:
    
    ( ~ ( ~ ( Pentagon B ) <-> ( Gray B ) )            ) /\
    ( ( Small A ) /\ ( Gray B ) -> ( Square C )        ) /\
    ( ( Pentagon A ) -> ( ( Small B ) \/ ( White A ) ) ) /\
    ( ~ ( Square C ) -> ( Gray C )                     ) /\
    ( ( Gray B ) -> ( ( Gray A ) /\ ( Square C ) )     )

Additionally, input grammar setup is given by:

    ( ( ( Size Element ) \/ ( Color Element ) \/ ( Shape Element ) ) -> Start   ) /\
    (                                   ( Small \/ Medium \/ Large ) -> Size    ) /\
    (                                              ( White \/ Gray ) -> Color   ) /\
    (                             ( Triangle \/ Square \/ Pentagon ) -> Shape   ) /\
    (                                                ( A \/ B \/ C ) -> Element )

Possible input feeds to this grammar are consisted either of `Size Element` phrase, `Color Element` phrase, or `Shape Element` phrase. To solve the puzzle, we first convert both of our logic expresions to *CSNF*, as explained in sections [3.3.1.] and [3.3.2.]. We form the following *SCNF* expression combined from world rules and input grammar:

    ( ( | ~Pentagon ~B ) \/ ( & Gray B )                   ) /\
    ( ( | ~Gray ~B ) \/ ( & Pentagon B )                   ) /\
    ( ( | ~Small ~A ) \/ ( | ~Gray ~B ) \/ ( & Square C )  ) /\
    ( ( | ~Pentagon ~A ) \/ ( & Small B ) \/ ( & White A ) ) /\
    ( ( & Square C ) \/ ( & Gray C )                       ) /\
    ( ( | ~Gray ~B ) \/ ( & Gray A )                       ) /\
    ( ( | ~Gray ~B ) \/ ( & Square C )                     ) /\
    ( ( | ~Small ) \/ ( & Size )                           ) /\
    ( ( | ~Medium ) \/ ( & Size )                          ) /\
    ( ( | ~Large ) \/ ( & Size )                           ) /\
    ( ( | ~White ) \/ ( & Color )                          ) /\
    ( ( | ~Gray ) \/ ( & Color )                           ) /\
    ( ( | ~Triangle ) \/ ( & Shape )                       ) /\
    ( ( | ~Square ) \/ ( & Shape )                         ) /\
    ( ( | ~Pentagon ) \/ ( & Shape )                       ) /\
    ( ( | ~A ) \/ ( & Element )                            ) /\
    ( ( | ~B ) \/ ( & Element )                            ) /\
    ( ( | ~C ) \/ ( & Element )                            ) /\
    ( ( | ~Size ~Element ) \/ ( & Start )                  ) /\
    ( ( | ~Color ~Element ) \/ ( & Start )                 ) /\
    ( ( | ~Shape ~Element ) \/ ( & Start )                 )

The above example is represented in *type (phrase: specific, structure: logic) grammar*, which is equivalent to *SCNF*. Each conjunct in the *CSNF* expression holds dijunctions that are considered to be separate grammar rules. Now, to parse some text by this grammar, we choose to abduce from the `( & Start )` expression using the *resolution abduction* rule, as explained in section [3.3.3.]. In cases of disjunction consisted of a single element, a parsing error may be reported if we search for the element negation. In cases of disjunction consisted of two elements, we produce a negation of one single element other than searched one. When a disjunction contains more than two elements, we produce a conjunction of negated elements others than searched one, thus requiring to succed to parse all of them. Also, when abducing upwards the grammar tree, it is required to simultaniously check both positive and negative instances of searched elements. This kind of check may report parsing error when both instances succesfully parse.

To finally check which properties of elements `A`, `B` and `C` are possible, we proceed with the following:

- we feed the first input combination of size to the grammar: `Small A`.
    - If the input passes, we get the first property of element `A`.
    - If the input does not pass, we have to repeat check with the next combination, like `Medium A`, then possibly the next one if this one fails, and so on. Because there is only a finite number of combinations, the process is guaranteed to eventually terminate, either with success or failure. Failure means that the whole grammar setup becomes contradictory with the current combination. 
- Before proceeding with the next property check, we are obligated to manually enrich our grammar rules by confirmed input `( & Small A )`, just to be sure that further checking success emerges only with combinations that are consistent with data gathered from this / previous steps.
- we repeat the process from the beginning, feeding the next input combination of color to be checked: `Gray A`.
- the process ends when we get a combination of all three properties for all three elements.

Just to answer the question stated from this puzzle example, one of the complete correct combinations is: `Small A`, `Gray A`, `Pentagon A`, `Small B`, `Gray B`, `Pentagon B`, `Medium C`, `Gray C`, `Square C`.

With this example, we saw how to manually seek for the right combination that satisfy given rules. However, it is possible to fully automatize the whole process of finding a correct combination using only grammar productions. To do this, we have to reach for generic instead of specific phrases. Generic phrases are a matter of section [3.4.], where we finally combine generic phrases with logic structure.

#### 3.3.5. pseudocode 3

As expected, implementing *phrase logic grammar* into V-Parser requires to additionally deal with conjunctions and negations. Here, we present a variation of *V-Parser* algorithm that operates on *phrase logic grammar*. This variation takes CSNF as input grammar, instead of flat productions.

    01 DECLARE chart: [][], lexed: [];
    02 
    03 FUNCTION Parse (grammar, input)
    04     lexed ← input;
    05     chart.CLEAR ();
    06     MergeItem (0, [grammar.START_DISJUNCT], 0, 1, null);
    07     FOR each new column in chart DO
    08         FOR each new item in column DO
    09             FOR each (disjunction containing complemented item.Disj[item.DisjIndex]) in grammar DO
    10                 FOR i = 0 TO disjunction.LENGTH DO
    11                     IF i != disjunction.INDEX_OF (complemented item.Disj[item.DisjIndex]) THEN
    12                         MergeItem (column.Index, disjunction, i, 1, item, false);
    13
    14             FOR each (disjunction containing item.Disj[item.DisjIndex]) in grammar DO
    15                 FOR i = 0 TO disjunction.LENGTH DO
    16                     IF i != disjunction.INDEX_OF (item.Disj[item.DisjIndex])
    17                         MergeItem (column.Index, disjunction, i, 1, item, true);
    18
    19     RETURN chart;
    20 
    21 PROCEDURE MergeItem (offset, disj, disjIndex, seqIndex, parent, duality)
    22     item ← chart[offset].FIND (disj, disjIndex, seqIndex);
    23     IF not found item THEN
    24         item ← {Disj: disj, DisjIndex: disjIndex, SeqIndex: seqIndex, Inherited: [], Inheritors: [], Parents: [], SuccChildren: []};
    25         chart[offset].ADD (item);
    26 
    27     IF parent not in item.Parents THEN
    28         item.Parents.ADD (parent);
    29         InitSuccess (duality, parent, disj);
    30         IF item is terminal and (item succeeded in lexed at offset) THEN
    31             NotifySuccess (duality, item);
    32
    33         FOR each x in [parent] UNION parent.Inherited DO
    34             FOR each y in [item] UNION item.Inheritors DO
    35                 IF y.SeqIndex + 1 == y.Disj[y.DisjIndex].LENGTH
    36                     IF (x.Disj, x.DisjIndex, x.SeqIndex) not in y.Inherited THEN
    37                         x.Inheritors.ADD (y);
    38                         y.Inherited.ADD (x);
    39
    40                 IF x.SeqIndex + 1 < x.Disj[x.DisjIndex].LENGTH THEN
    41                     IF y is terminal and (IsSuccess (duality, x) or x.Disj[x.DisjIndex][0] == "|") THEN
    42                         FOR each z in x.Parents DO
    43                             MergeItem (offset + 1, x.Disj, x.DisjIndex, x.SeqIndex + 1, z, duality);
    44
    45 PROCEDURE InitSuccess (duality, parent, disj)
    46     IF not parent.SuccChildren.FIND (duality, disj) THEN
    47         parent.SuccChildren.ADD ({Duality: duality, Disj: disj, Success: []});
    48 
    49 PROCEDURE NotifySuccess (duality, item)
    50     IF (item.SeqIndex + 1 == item.Disj[item.DisjIndex].LENGTH) or (item.Disj[item.DisjIndex][0] == "|") THEN
    51         FOR each parent in item.parents DO
    52             d ← parent.SuccChildren.FIND (duality, item.Disj);
    53             IF found d and {Disj: item.Disj, DisjIndex: item.DisjIndex} not in d.Success THEN
    54                 d.Success.ADD ({Disj: item.Disj, DisjIndex: item.DisjIndex});
    55                 NotifySuccess (duality, parent);
    56
    57 PROCEDURE IsSuccess (duality, item)
    58     FOR each child in item.SuccChildren DO
    59         IF (child.Duality == duality) and (child.Success.LENGTH == child.Disj.LENGTH - 1) THEN
    60             RETURN true;
    61 
    62     RETURN false

The algorithm input this time is changed to accept text lexed into tokens which may be negated or non-negated. The output chart again holds sequences with indexes corresponding to sequence atoms, acceptable by `MergeItem` procedure, but this time the sequences are represented in a form of pairs of a disjunction and an index of particular disjunct. There is also an indicator wired at the position `0` of each sequence that says if the sequence is regular (value `&`) or its dual (value `|`). In addition, `SuccChildren` attribute serves for verifying the success of parsing every disjunct in child disjunctions.

The first visible difference to the original *Esperas* algorithm is modification of the main loop in `Parse` function to also range over disjuncts in disjunctions (lines 9-17), according to *resolution abduction* rule. The main loop processes both supplied atoms (lines 9-12) and their negations (lines 14-17) for later detection of contradictory input.

Procedure `MergeItem` is more or less unchanged, except dealing with conjunctions, negations, and sequence duals (lines 29-31 and line 41). This requires inclusion of functions `InitSuccess`, `NotifySuccess`, and `IsSuccess` described between lines 45-62.

`InitSuccess` initializes each item with `SuccChildren` content where parsing negations (`Duality`) is noted and item's child disjunctions are enumerated. For each item, to proceed with parsing, it is required that all the disjuncts (except the anchor one) from `Disj` attribute are successfully parsed. But why all the disjuncts have to be successful to conclude the success? It is because the *resolution abduction rule* turns disjunctions into conjunctions of complemented disjuncts. Thus, we have to keep track of each suceeded disjunct to successfully move towards end of text input. `NotifySuccess` function simply passes the success indicator (line 54) over all the parents of item, recursively. `IsSuccess` function conveniently returns true if all the child disjuncts are successfull.

To detect if the whole parsing process is successful, it is still necessary to handle a kind of `END_OF_FILE` atom like in unmodified verion of *Esperas* algorithm, just to verify if the parsing has terminated exactly at the actual text input length. Also, to indicate the success, it is important that for each item in the chart, at least one of two function calls `IsSuccess (true, item)` and `IsSuccess (false, item)` should return `false` to be sure that parsing input is not contradictory.

### 3.4. type (phrase: generic, structure: logic) grammar

We finally arrive at the section that describes combined extension over both axes from our naming nomenclature: generic and logic. We name the resulting grammar as *type (phrase: generic, structure: logic) grammar*. This type of grammar is in disposition of combination of high level abstraction elements we may use for descibing [meta](https://en.wikipedia.org/wiki/Meta) constructs. In other words, this type of grammar is being able to provide reasoning about the reasoning itself by defining mappings from arbitrary chosen generic phrases to fundamental, [functionally complete](https://en.wikipedia.org/wiki/Functional_completeness) set of logic connectives.

As an example of meta-reasoning, we will map our new type of grammar to itself. As a result, we will be able to construct [satisfiable](https://en.wikipedia.org/wiki/Satisfiability) grammars by our parsing system. To accomplish this task, we will define two components of logic: (1) its syntax as a set of only possible correct formations of logic phrases, and (2) its semantics as a set of rules that map syntactically correct logic phrases to certain constructs that are assumed to be already understood by underlying grammatical framework.

    (
        (              eq -> meta  ) /\
        (       impl ↔ eq -> eq    ) /\
        (            impl -> eq    ) /\
        (     conj → impl -> impl  ) /\
        (            conj -> impl  ) /\
        (     disj ∧ conj -> conj  ) /\
        (            disj -> conj  ) /\
        (      neg ∨ disj -> disj  ) /\
        (             seq -> disj  ) /\
        (         neg seq -> seq   ) /\
        (             neg -> seq   ) /\
        (          ¬ prim -> neg   ) /\
        (            prim -> neg   ) /\
        (        ( meta ) -> prim  ) /\
        (             var -> prim  ) /\
        (           const -> prim  ) /\
        (         < var > -> var   ) /\
        ( < /[A-Za-z]+/ > -> var   ) /\
        (     /[A-Za-z]+/ -> const )
    ) /\ (
        ( <a> ↔ <b> <-> ( <a> <-> <b> ) ) /\
        ( <a> → <b> <-> ( <a> -> <b> )  ) /\
        ( <a> ∧ <b> <-> ( <a> /\ <b> )  ) /\
        ( <a> ∨ <b> <-> ( <a> \/ <b> )  ) /\
        (     ¬ <a> <-> ( ~ <a> )       ) /\
        (   ( <a> ) <-> <a>             ) /\
        (   < <a> > <-> <<a>>           )
    )

In the above grammar we can clearly distinct between two segments: former being syntax rules, and later being semantic rules. These two segments are related in a way that only syntactically correct phrases are being treated by semantic rules, while erroneous phrases do not parse at all. The above syntax is being defined using functional equivalent of [context free grammar](https://en.wikipedia.org/wiki/Context-free_grammar)) rules. In semantics segment, we define a meaning of our new set of logic operators (`< ... >`, `( ... )`, `¬`, `∨`, `∧`, `→`, `↔`) that will simply map to our primitive operators (`<...>`, `(...)`, `~`, `\/`, `/\`, `->`, `<->`) described in section [3.3.]. To be able to process the whole grammar example by our parsing system, we are firstly supposed to convert it to *CSNF*, as explained in section [3.3.]. After that, the algorithm in section [3.4.1] applies.

The above grammar accepts `meta` as a starting symbol, and parses any *type (phrase: generic, structure: logic) grammar* that is not contradictory. When there is no parsing errors, we conclude that the input grammar is satisfiable (meaning it has at least one possible satisfactory model). Satisfaction / contradiction proof would be contained within a chart returned by a parsing algorithm from the next section.

#### 3.4.1. pseudocode 4

*... to do ...*

## 4. examples

*... to do ...*

### 4.1. Turing machines

Here, we will show how to simulate a single tape [Turing machine](https://en.wikipedia.org/wiki/Turing_machine) in *type (phrase: generic, structure: logic) grammar*. A Turing machine is a mathematical model of computation that defines an abstract machine, which manipulates symbols on a strip of tape according to a table of rules. Despite the model's simplicity, given any computer algorithm, a Turing machine capable of simulating that algorithm's logic can be constructed.

The machine operates on an infinite memory tape divided into discrete *cells*. The machine has its *head* that positions over a single cell and can read or write a symbol to the cell. The machine keeps a track of its current *state* from a finite set of states. Finally, the machine has a finite set of *instructions* which direct reading symbols, writing symbols, changing the current machine state and moving the tape to the left or to the right. Each instruction consists of the following:

1. reading the current state and reading a symbol at the position of head
2. depending on (1.), writing a symbol at the position of head
3. either move the tape one cell left or right and changing the current state

The machine repeats these steps until it encounters the halting instruction.

The following example shows a Turing machine for adding 1 to a n-digits binary number

    ---------------------------------------------------------

    (
        (         s -> state ) /\
        (         a -> state ) /\
        (         f -> state ) /\
        (         h -> state ) /\
        (         0 -> bit   ) /\
        (         1 -> bit   ) /\
        ( state bit -> head  ) /\
        (        () -> cell  ) /\
        (       bit -> cell  ) /\
        (      head -> cell  ) /\
        (      cell -> tape  ) /\
        ( tape cell -> tape  )
    ) /\ (
        ( <x> s <y> <z> -> <x> <y> s <z> ) /\
        (  <x> <y> s () -> <x> a <y> ()  ) /\
        (   <x> <y> a 1 -> <x> a <y> 0   ) /\
        (   <x> a 0 <y> -> <x> 1 f <y>   ) /\ 
        ( <x> f <y> <z> -> <x> <y> f <z> ) /\
        (      <x> f () -> <x> h ()      )
    ) /\ (
        ( <a> |- <b> ) -> ( <a> -> <b> )
    )

    ---------------------------------------------------------

    State abbreviations: s=start, a=add1, f=finish, h=halt

    ( () s 1 0 0 1 () ) |- ( () 1 0 1 0 h () )

### 4.2. lambda calculus

[Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) (also written as λ-calculus) is a formal system in mathematical logic for expressing computation based on function [abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science)) and [application](https://en.wikipedia.org/wiki/Function_application) using variable binding and substitution. It is very simple, but powerful system. Among other uses it has found a way to be an inspiration for a lot of [functional programming languages](https://en.wikipedia.org/wiki/Functional_programming). In this section, we will show how to express lambda calculus constructs in *type (phrase: generic, structure: logic) grammars*.

Syntax of lambda calculus is surprisingly simple. A lambda term is one or a combination of the following:

- *variable in a form of:* `x`
- *abstraction in a form of:* `λx.M` (where `x` is a variable; `M` is a lambda term)
- *application in a form of:* `(M N)` (where `M` and `N` are lambda terms)

Semantics of lambda calculus, written in a relaxed language, include

- *α-conversion:* `(λx.M) -> (λy.M[x:=y])`
- *β-reduction:* `((λx.M) N) -> (M[x:=N])`

α-conversion is renaming of variables used to avoid [name collisions](https://en.wikipedia.org/wiki/Name_collision). β-reduction is actual operation carying process of replacing bound variables with the argument expression in the body of the abstraction.

    ---------------------------------------------------------

    (
        (              λvar  -> λterm ) /\
        ( ( λ λvar . λterm ) -> λterm ) /\
        (    ( λterm λterm ) -> λterm ) /\
        (        /[A-Za-z]+/ -> λvar  )
    ) /\ (
        ( ( λ <x> . <M> ) -> ( α-λ <y> . <M> ) /\ ( <x> -> <y> ) ) /\
        ( ( ( α-λ <x> . <M> ) <N> ) -> <M> /\ ( <x> -> <N> )     )
    ) /\ (
        ( <a> |- <b> ) -> ( <a> -> <b> )
    )

    ---------------------------------------------------------

    ( ( λ x . x x ) ( ( λ x . x x ) 2 ) ) |- ( 2 2 2 2 )

### 4.3. classical logic

[Classical logic](https://en.wikipedia.org/wiki/Classical_logic) (or standard logic) is the intensively studied and most widely used class of logics. In this section, we will map [higher-order logic](https://en.wikipedia.org/wiki/Higher-order_logic) to our set of primitive operators in *type (phrase: generic, structure: logic) grammar*. The key part of our logic definition is in handling variables. We use universal and existential [quantifiers](https://en.wikipedia.org/wiki/Quantifier_(logic)) to bound variables which we extrude from related constant expressions by implications that introduce fresh variables (`<y>` in the following definition). As expected in higher order logic, variables may stand for constants, functions, or predicates.

    ---------------------------------------------------------

    (
        ( ∀ var . formula -> formula ) /\
        ( ∃ var . formula -> formula ) /\
        (              eq -> formula ) /\
        (       impl ↔ eq -> eq      ) /\
        (            impl -> eq      ) /\
        (     conj → impl -> impl    ) /\
        (            conj -> impl    ) /\
        (     disj ∧ conj -> conj    ) /\
        (            disj -> conj    ) /\
        (      neg ∨ disj -> disj    ) /\
        (             neg -> disj    ) /\
        (          ¬ prim -> neg     ) /\
        (            prim -> neg     ) /\
        (     ( formula ) -> prim    ) /\
        (             var -> prim    ) /\
        (            pred -> prim    ) /\
        (     var ( seq ) -> pred    ) /\
        (     var ( seq ) -> func    ) /\
        (       var , seq -> seq     ) /\
        (             var -> seq     ) /\
        (      func , seq -> seq     ) /\
        (            func -> seq     ) /\
        (     /[A-Za-z]+/ -> var     )
    ) /\ (
        ( ∀ <x> . <p> <-> ( <x> → <y> ) ∧ ( <y> → <p> )                   ) /\
        ( ∃ <x> . <p> <-> ( <x> → <y> ) ∧ ¬ ( <y> → ( ¬ <p> ) )           ) /\
        (     ( <x> ) <-> <x>                                             ) /\
        (       ¬ <a> <-> <a> → <c>                                       ) /\
        (   <a> ∨ <b> <-> ( <a> → <c> ) → ( ( <b> → <c> ) → <c> )         ) /\
        (   <a> ∧ <b> <-> ( <a> → ( <b> → <c> ) ) → <c>                   ) /\
        (   <a> ↔ <b> <-> ( ( <a> → <b> ) → ( ( <b> → <a> ) → <c> ) → <c> )
    ) /\ (
        ( <a> → ( <b> → <a> )                                             ) /\
        ( ( <a> → ( <b> → <c> ) ) → ( ( <a> → <b> ) → ( <a> → <c> ) )     ) /\
        ( ( ¬ <a> → ¬ <b> ) → ( <b> → <a> )                               ) /\
        ( ( ( <a> → <b> ) ∧ <a> ) -> <b>                                  )
    ) /\ (
        ( <a> |- <b> ) -> ( <a> -> <b> )
    )

    ---------------------------------------------------------
    
    ( ∀ X . ∀ Y . ¬ ( X ∧ Y ) ) |- ( ∀ X . ∀ Y . ¬ X ∨ ¬ Y )
    
## 5. implementation

test it here: [(version 0.1, context free grammar)](https://e-teoria.github.io/Esperas/test)

*... to do ...*
