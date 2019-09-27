# esperas

*[Abstract]*  

*... Our starting point will be handling context free grammar (CFG) equivalent by the v-parser algorithm. Then, we will extend this CFG equivalent to handle logic based extension of CFG, thus bringing in a logical reasoning about parsed content. Finally, we will introduce a parsing template engine by a slight modification of our logical parsing system, only to handle variables. This final touch will make Esperas a Turing complete parser...*

## contents
- [x] [1. introduction](#1-introduction)  
- [ ] [2. extending grammar language](#2-extending-grammar-language)  
    - [x] [2.1. context free domain: phrase flat structure grammar](#21-context-free-domain-phrase-flat-structure-grammar)  
        - [x] [2.1.1. pseudocode 1](#211-pseudocode-1)  
    - [ ] [2.2. syntactic logic domain: phrase logic structure grammar](#22-syntactic-logic-domain-phrase-logic-structure-grammar)  
        - [x] [2.2.1. conversion between conjunctive and disjunctive normal form](#221-conversion-between-conjunctive-and-disjunctive-normal-form)  
        - [x] [2.2.2. conversion to sequential normal form](#222-conversion-to-sequential-normal-form)  
        - [x] [2.2.3. resolution abduction rule in logic](#223-resolution-abduction-rule-in-logic)  
        - [x] [2.2.4. applying logic to parsing](#224-applying-logic-to-parsing)  
        - [ ] [2.2.5. pseudocode 2](#225-pseudocode-2)  
    - [ ] [2.3. turing complete domain: template logic structure grammar](#23-turing-complete-domain-template-logic-structure-grammar)  
        - [ ] [2.3.1. pseudocode 3](#231-pseudocode-3)  
- [ ] [3. implementation](#3-implementation)  

## 1. introduction

*Esperas* is a Javascript implementation of a novel v-parser algorithm. [Parsing, syntax analysis, or syntactic analysis](https://en.wikipedia.org/wiki/Parsing) is the process of analysing a string of symbols, either in natural language, computer languages or data structures, conforming to the rules of a formal grammar. Within computational linguistics the term is used to refer to the formal analysis by a computer of a sentence or other string of words into its constituents, resulting in a [parse tree](https://en.wikipedia.org/wiki/Parse_tree) showing their syntactic relation to each other, which may also contain semantic and other information.

*Esperas* is born as a series of milestones in a process of development of universal computational language called [*Logos*](https://github.com/e-teoria/Logos). As *Logos* is trying to provide a method to describe any other computational or descriptional language, *Esperas* will try to tame the very notion of [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) that can be used as a platform to host the *Logos* language. Our starting point will be handling [context free grammar (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) equivalent by the v-parser algorithm. Then, we will extend this CFG equivalent to handle [logic](https://en.wikipedia.org/wiki/Logic) based extension of CFG, thus bringing in a logical reasoning about parsed content. Finally, we will introduce a parsing [template engine](https://en.wikipedia.org/wiki/Template_processor#Template_engine_2) by a slight modification of our logical parsing system, only to handle variables. This final touch will make *Esperas* a [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) parser, not only ready to host *Logos* in the first place, but also making itself a universal programming library that is able to analyze and parse any other language, given arbitrary grammar definitions for those languages.

## 2. extending grammar language

In this section we will extend context free grammar first to *syntactic logic grammar*, and then to *Turing complete grammar* domain. To do this, it will be necessary to rearrange grammar appearance from a form handled by usual context free grammar to a form that is much closer to [propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus). Although there will be some differences to classical understanding of propositional logic, with this rearrangement, we will be able to interpret our logic-like expressions as a possible parsing grammar definitions. Moreover, these logic-like grammars will support usual logic transformations like [De Morgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws), as well as basic logical reasoning like [resolution rule](https://en.wikipedia.org/wiki/Resolution_(logic)), which we will use to transform *syntactic logic grammars* to a form acceptable by the *v-parser* algorithm with some minimal adjustments. Finally, with introduction of variables into our grammars, we will turn the grammars into Turing complete *templates*, which should satisfy demands that arise from requirements of hosting *Logos* language mentioned in introduction section. 

### 2.1. context free domain: phrase flat structure grammar

Usual context free grammars take form of `A -> α` production rule patterns, where in parsing we seek for the left production sides to parse the right production sides. Alternations are there expressed by repeating the same *left side* across multiple production rules. However, this is inconsistent with logic expressions where the following rules apply:

      A -> B,   A -> C
    ————————————————————
       A -> (B /\ C)


      B -> A,   C -> A
    ————————————————————
       (B \/ C) -> A

In logic, alternations may be formed by repeating the same *right side* across multiple rules. Therefore, to synchronize our grammar language with logic, we will swap positions of left and right sides of productions in our grammars, and we will refer to this form of grammar as *phrase flat structure grammar*. Although this adjustment doesn't really shake foundations of defining grammars, it is a necessary adjustment to proceed with extending our grammar language. Following the above laws, all our grammar rules now take the following form:

    α -> A
    
where the left side is a sequence of non-terminals and terminals, while the right side is a non-terminal. Now, in parsing we seek for the right rule sides to parse the left rule sides, while we express alternations by repeating the same right side across multiple rules. Obviously, this adjustment has exactly the same level of expressivity as context free grammars.

#### 2.1.1. pseudocode 1

Here, we present *v-parser* algorithm that operates on classical [context free grammars (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) (or phrase flat structure grammar because phrase flat structure grammar is basically just a CFG written differently) where each production rule is expressed in the following form:

    A -> α

In the above pattern, `A` is a single non-terminal, while `α` is a sequence of terminals and non-terminals. Alternations are expressed by repeating the same left side across multiple productions.

    01 DECLARE chart: [][], text: STRING;
    02 
    03 FUNCTION Parse (grammar, input)
    04     text ← input;
    05     chart.CLEAR ();
    06     MergeItem (0, [grammar.START_SEQUENCE], 0, null);
    07     FOR each new column in chart DO
    08         FOR each new item in column DO
    09             FOR each production of item.Sequence[item.Index] in grammar DO
    10                 MergeItem (column.Index, production.sequence, 0, item);
    11 
    12     RETURN chart;
    13 
    14 PROCEDURE MergeItem (offset, sequence, index, parent)
    15     item ← chart[offset].FIND (sequence, index);
    16     IF not found item THEN
    17         item ← {Sequence: sequence, Index: index, Inherited: [], Inheritors: [], Parents: []};
    18         chart[offset].ADD (item);
    19 
    20     IF parent not in item.Parents THEN
    21         item.Parents.ADD (parent);
    22         FOR each x in [parent] UNION parent.Inherited DO
    23             FOR each y in [item] UNION item.Inheritors DO
    24                 IF y.Index + 1 == y.Sequence.LENGTH
    25                     IF (x.Sequence, x.Index) not in y.Inherited THEN
    26                         x.Inheritors.ADD (y);
    27                         y.Inherited.ADD (x);
    28
    29                 IF x.Index + 1 < x.Sequence.LENGTH THEN
    30                     IF y is terminal succeeded in text at offset THEN
    31                         FOR each z in x.Parents DO
    32                             MergeItem (offset + y.LENGTH, x.Disj, x.DisjIndex, x.SeqIndex + 1, z);
    
This algorithm is a chart based algorithm that groups parsing items into columns. Columns correspond to offsets from the beginning of input string. Columns are incrementally processed, never looking back into the previous columns in the chart. Algorithm stores its items in the chart as pairs of a sequence and an index of the sequence element. This way it is always possible to know what is ahead element of the current item (we just increment the index attribute by one).

The main function `Parse` serves as a loop over columns, productions and their alternations. The loop functions as a [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) to reach all the terminals relative to START_SEQUENCE. It repeatedly calls `MergeItem` procedure to populate the chart onwards. `MergeItem` procedure creates a new item in appropriate column determined by `offset` only if an item with similar `Sequence` and `Index` attributes doesn't already exist in that column. If the item exists, its data is accumulated by a newly introduced `parent` value. The algorithm ends when it visits all the populated columns in the chart.

The essence of the algorithm may be found in merging passed items to existing column items. When the passed item is merged, it looks up all the accumulated parents inside `Inherited` attribute (line 22), and tries to merge their successors (line 32) to all the children of the existing item inside `Inheritors` attribute (line 23). To do this, the algorithm tracks what is to be merged and where it is supposed to be merged for each item (lines 26-27). Of course, if we want this merging to take a place, there are some conditions to be met:

1. (line 24) the index of items in children has to be equal to the children sequences lengths (sucessor is allowed to apply);
2. (line 25) items from the first loop that are already processed as a value of `Inherited` attribute are ignored;
3. (line 29) the index of successors in parents has to be less than the parents sequences lengths (there is an available successor);
4. (line 30) the last condition takes care of scheduling the next item to be breadth-first searched only if item from the second loop is successfully parsed terminal relative to its offset in input text.

When inserting a new item that has no match at specified column, in the second `FOR` loop of `MergeItem` procedure, we consider only inserted item instead of the whole `Inheritors` range. This occurs naturally because `Inheritor` attribute of new items is declared empty.

The algorithm exhibits very well behavior regarding to parsing possibly ambiguous grammars. An easy way to indicate a parsing success is to compose a sequence of a `grammar.START_SEQUENCE` and `END_OF_FILE`, and then to pass it to the `Parse` function instead of the real `START_SEQUENCE`. After parsing, if `END_OF_FILE` can be found at apropriate place, the parsing is considered successful. If a parsing error occurs, `END_OF_FILE` will not be in the corresponding column offset, and then, the produced chart can be additionally analyzed for errors. In the case of an error, it may be relatively easy to output *"Expected terminal `X` at offset `Y`"* error forms by observing only the last populated column in the resulting chart.

### 2.2. syntactic logic domain: phrase logic structure grammar

[Logic](https://en.wikipedia.org/wiki/Logic) is the systematic study of the form of valid inference, and the most general laws of truth. A valid inference is one where there is a specific relation of logical support between the assumptions of the inference and its conclusion. In ordinary discourse, inferences may be signified by words such as therefore, thus, hence, ergo, and so on.

What do we get by introducing logic to parsing? Logic provides us with methods to extract all the knowledge implicitly contained in a set of assumptions. It allows us to keep our assumptions in normalized compact form, and to extract information we need about them on demand. In this section we will show how to turn a kind of logic expressions into parsing grammar definitions. We will use some of well known methods of logic conversion to [conjunctive normal form](https://en.wikipedia.org/wiki/Conjunctive_normal_form) and *sequential normal form*. Then we will show how to process conjunctive normal forms by abduction analog of the well known [logic resolution](https://en.wikipedia.org/wiki/Resolution_(logic)) to produce the implicitly contained knowledge. Finally, we will realize that this knowledge is, in our case, composed of grammar rules compatible with an extension of v-parser, ready to syntactically analyze any portion of texts written in formal languages defined in our new syntactic logic system.

#### 2.2.1. conversion between conjunctive and disjunctive normal form

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

In this section we learned how to convert logical formulas between CNF and DNF. Using described methods, conversion from CNF to DNF may take an exponential amount of combinatorial complexity, but conversion from DNF to CNF takes a linear amount of combinatorial complexity. Luckily for us (or maybe because we are using what we are provided with), we are interested in this second, faster kind of conversion in producing our parser. Keeping our formulas in CNF will open the doors for extracting grammar rules by logical resolution abduction, which is covered in the next section.

#### 2.2.2. sequential normal form

To apply logic to parsing, we have to complicate a bit our logic language. We start with [propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus), and extend it by a notion of sequences. Sequences are natural ingradient of parsers, so we have to include them into our language in a such way that they support basic logical rules and transformations. We write sequences as atoms delimited by a whitespace, like in the following example:

    A B C ...

Not to restrict expresivity of our language, we want to wire operators inherited from propositional logic into sequences, both from outside and from inside of sequences. Like there exist duality between logical `/\` and `\/` operators, it will be necessary to distinct two dual kinds of sequences that emerge from using negation outside of sequences. We can notice that sequences are merely conjunctions with a strict order of conjuncts. To convert our expression to sequential normal form, we have to apply the negation to each sequence element, but we have to keep in mind that our sequences then  become their dual operations analogous to disjunction. To distinct between sequence expressions and their duals, we will write prefix `&` to sequences, while we will write prefix `|` to their duals. Following an analogy to [De Morgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws), we provide the next two rules for translating sequences towards sequential normal form:

      ~(& A B C ...)
    ———————————————————
     (| ~A ~B ~C ...)
     

      ~(| A B C ...)
    ———————————————————
     (& ~A ~B ~C ...)

Regular sequences denoted by `&` succeed when all of its elements succeed, while success of sequence dual denoted by `|` is related to its `&` counterpart: it succeeds when negation of its counterpart fails.

We continue with operators `/\` and `\/` combined from inside of sequences. We provide the following two rules as analogs to [distributive laws](https://en.wikipedia.org/wiki/Distributive_property), to further shift the conversion towards sequential normal form:

        A (B /\ C) D
    ————————————————————
     (A B D) /\ (A C D)


        A (B \/ C) D
    ————————————————————
     (A B D) \/ (A C D)

We say that a sequence expresssion is in sequential normal form when tere are no negations outside of sequences, and no `/\` and `\/` operators inside of sequences. In the rest of the exposure, we will use a combination of conjunctive normal form and sequential normal form, and call it *conjunctive sequential normal form*.

#### 2.2.3. resolution abduction rule in logic

[Resolution rule](https://en.wikipedia.org/wiki/Resolution_(logic)) in propositional logic is a single valid inference rule that produces a new clause implied by two clauses containing complementary literals. A literal is a propositional variable or the negation of a propositional variable. Two literals are said to be complements if one is the negation of the other (in the following, `~C` is taken to be the complement to `C`). The resulting clause contains all the literals that do not have complements. Formally:

      A1 \/ A2 \/ ... \/ C,    B1 \/ B2 \/ ... \/ ~C
    ——————————————————————————————————————————————————
             A1 \/ A2 \/ ... \/ B1 \/ B2 \/ ...

where `Ai`, `Bi` and C are literals.

[Modus ponens](https://en.wikipedia.org/wiki/Modus_ponens) can be seen as a special case of resolution (of a one-literal clause and a two-literal clause). 

      P -> Q,    P
    ————————————————
           Q

is equivalent to:

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

The above two inference steps combined and treated wih a negation at a proper places are equivalent to the following one:

      ~A1 \/ ~A2 \/ ... \/ C,    C
    —————————————————————————————————
             A1 /\ A2 /\ ...

We will refer to this rule as a *resolution abduction* rule. Be sure to get familiar with this rule because we will use it in the following section to extract grammar rules from CNF based grammar language. 

#### 2.2.4. applying logic to parsing

In this section we will overview the syntactic logic parsing process on a specific example. To analyze the example, we will use the *resolution abduction* rule explained in the previous section. As our example, we choose noting an existence of an intercontinental football match game. Only acceptable strings would be pairs of any two continent names except where both continents are the same. This would be our initial grammar:

    (
        (
            "Arctic" \/
            "North America" \/
            "Europe" \/
            "Asia" \/
            "South America" \/
            "Africa" \/
            "Australia" \/
            "Antarctic"
        ) -> Continent
    ) /\ (
        (
            (
                (& Continent " - " Continent)
            ) /\ ~(
                "Arctic - Arctic" \/
                "North America - North America" \/
                "Europe - Europe" \/
                "Asia - Asia" \/
                "South America - SouthAmerica" \/
                "Africa - Africa" \/
                "Australia - Australia" \/
                "Antarctic - Antarctic"
            )
        ) -> FootballMatch
    ) /\ (
        FootballMatch -> Start
    )
    
We can recognize three main grammar rules, one for each of `Continent`, `FootballMatch`, and `Start` symbols. This example supersedes expressivity of context free grammar domain because we use *not* and *and* operators to conveniently express the example requirements. We will refer to this kind of grammars as a *phrase logic structure grammar*.

To consider CNF as a medium for expressing grammar rules, we have to define a rule by which we convert implication to a disjunction:

       A -> B
    ———————————
      ~A \/ B

Now we are ready to convert the whole example to CNF, as explained in section 3.2.1.

    (
        ~"Arctic" \/ Continent
    ) /\ (
        ~"North America" \/ Continent
    ) /\ (
        ~"Europe" \/ Continent
    ) /\ (
        ~"Asia" \/ Continent
    ) /\ (
        ~"South America" \/ Continent
    ) /\ (
        ~"Africa" \/ Continent
    ) /\ (
        ~"Australia" \/ Continent
    ) /\ (
        ~"Antarctic" \/ Continent
    ) /\ (
        (| ~Continent ~" - " ~Continent) \/
        "Arctic - Arctic" \/
        "North America - North America" \/
        "Europe - Europe" \/
        "Asia - Asia" \/
        "South America - SouthAmerica" \/
        "Africa - Africa" \/
        "Australia - Australia" \/
        "Antarctic - Antarctic" \/
        FootballMatch
    ) /\ (
        ~FootballMatch \/ Start
    )

Each conjunct in resulting CNF expression holds dijunctions that are considered to be separate grammar rules. Now that we converted our example to CNF, to parse a text by this grammar, we are required to abduce from the `Start` symbol backwards using the *resolution abduction* rule. The first abduction step depth returns `FootballMatch` expression. From this expression, the second step depth returns:

    (& Continent " - " Continent") /\
    ~"Arctic - Arctic" /\
    ~"North America - North America" /\
    ~"Europe - Europe" /\
    ~"Asia - Asia" /\
    ~"South America - SouthAmerica" /\
    ~"Africa - Africa" /\
    ~"Australia - Australia" /\
    ~"Antarctic - Antarctic"

Parsing this step rejects all the inputs of two same continents. The third, and the final step depth returns a disjunction of all the non-negated continents that fit into `& Continent - Continent` expression. At the end, this grammar accepts strings like `Arctic - Antarctic` and `Asia - Africa`, but not strings like `Australia - Australia`.

We should note that we are treating negation differently than in classical logic. Although there is a similarity between our "complement" operation and logical "not" operator, the diference is in that logical "not" operator requires a negated expression to be explicitly stated to hold, while our "complement" holds for any other expression except the complemented one, analogously to [set algebra](https://en.wikipedia.org/wiki/Algebra_of_sets) complements. Nevertheless, we are keeping a stand that the reasoning extrapolated from logic still holds in our system.

#### 2.2.5. pseudocode 2

### 2.3. turing complete domain: template logic structure grammar

#### 2.3.1. pseudocode 3  

## 3. implementation

test it [here](https://e-teoria.github.io/Esperas/test)
