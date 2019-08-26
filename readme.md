# esperas

> Flipping table
>  
>     (╯°□°）╯︵ ┻━┻  
>   
> when I'm studying and it says:  
> "A metatheory is a theory whose  
> subject matter is some theory."  

*[Abstract]*  

*... Our starting point will be handling context free grammar (CFG) equivalent by the v-parser algorithm. Then, we will extend this CFG equivalent to handle logic based extension of CFG, thus bringing in a logical reasoning about parsed content. Finally, we will introduce a parsing template engine by a slight modification of our logical parsing system, only to handle variables. This final touch will make Esperas a Turing complete parser...*

## contents
- [x] 1. introduction  
- [x] 2. v-parser algorithm  
- [ ] 3. extending grammar language  
    - [ ] 3.1. context free domain: phrase flat structure grammar  
    - [ ] 3.2. syntactic logic domain: phrase logic structure grammar  
    - [ ] 3.3. turing complete domain: template logic structure grammar  
- [ ] 4. implementation  

## 1. introduction

*Esperas* is a Javascript implementation of a novel v-parser algorithm. [Parsing, syntax analysis, or syntactic analysis](https://en.wikipedia.org/wiki/Parsing) is the process of analysing a string of symbols, either in natural language, computer languages or data structures, conforming to the rules of a formal grammar. Within computational linguistics the term is used to refer to the formal analysis by a computer of a sentence or other string of words into its constituents, resulting in a [parse tree](https://en.wikipedia.org/wiki/Parse_tree) showing their syntactic relation to each other, which may also contain semantic and other information.

*Esperas* is born as a series of milestones in a process of development of universal computational language called [*Logos*](https://github.com/e-teoria/Logos). As *Logos* is trying to provide a method to describe any other computational or descriptional language, *Esperas* will try to tame the very notion of [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) that can be used as a platform to host the *Logos* language. Our starting point will be handling [context free grammar (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) equivalent by the v-parser algorithm. Then, we will extend this CFG equivalent to handle [logic](https://en.wikipedia.org/wiki/Logic) based extension of CFG, thus bringing in a logical reasoning about parsed content. Finally, we will introduce a parsing [template engine](https://en.wikipedia.org/wiki/Template_processor#Template_engine_2) by a slight modification of our logical parsing system, only to handle variables. This final touch will make *Esperas* a [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) parser, not only ready to host *Logos* in the first place, but also making itself an universal javascript programming library that is able to analyze and parse any other language, given arbitrary grammar definitions for those languages.

## 2. v-parser algorithm

Here, we present *v-parser* algorithm that operates on classical [context free grammars (CFG)](https://en.wikipedia.org/wiki/Context-free_grammar) where each production rule is expressed in the following form:

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
    23             IF x.Index + 1 < x.Sequence.LENGTH THEN
    24                 FOR each y in [item] UNION item.Inheritors DO
    25                     IF y.Index + 1 == y.Sequence.LENGTH OR y is terminal THEN
    26                         IF (x.Sequence, x.Index) not in y.Inherited THEN
    27                             x.Inheritors.ADD (y);
    28                             y.Inherited.ADD (x);
    29                             
    30                             IF y is terminal succeeded in text at offset THEN
    31                                 FOR each z in x.Parents DO
    32                                     MergeItem (offset + y.LENGTH, x.Sequence, x.Index + 1, z);

This algorithm is a chart based algorithm that groups parsing items into columns. Columns correspond to offsets from the beginning of input string. Columns are incrementally processed, never looking back into the previous columns in the chart. Algorithm stores its items in the chart as pairs of a sequence and an index of the sequence element. This way it is always possible to know what is ahead element of the current item (we just increment the index attribute by one).

The main function `Parse` serves as a loop over columns, productions and their alternations. The loop functions as a [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) to reach all the terminals relative to START_SEQUENCE. It repeatedly calls `MergeItem` procedure to populate the chart onwards. `MergeItem` procedure creates a new item in appropriate column determined by `offset` only if an item with similar `Sequence` and `Index` attributes doesn't already exist in that column. If the item exists, its data is accumulated by a newly introduced `parent` value. The algorithm ends when it visits all the populated columns in the chart.

The essence of the algorithm may be found in merging passed items to existing column items. When the passed item is merged, it looks up all the accumulated parents inside `Inherited` attribute (line 22), and tries to merge their successors (line 32) to all the children of the existing item inside `Inheritors` attribute (line 24). To do this, the algorithm tracks what is to be merged and where it is supposed to be merged for each item (lines 27-28). Of course, if we want this merging to take a place, there are some conditions to be met:

1. (line 23) the index of successors in parents has to be less than the parents sequences lengths (there is an available successor);
2. (line 25) the index of items in children has to be equal to the children sequences lengths (sucessor is allowed to apply);
3. (line 26) items from the first loop that are already processed as a value of `Inherited` attribute are ignored;
4. (line 30) the last condition takes care of scheduling the next item to be breadth-first searched only if item from the second loop is successfully parsed terminal relative to its offset in input text.

When inserting a new item that has no match at specified column, in the second `FOR` loop of `MergeItem` procedure, we consider only inserted item instead of the whole `Inheritors` range. This occurs naturally because `Inheritor` attribute of new items is declared empty.

The algorithm exhibits very well behavior regarding to parsing possibly ambiguous grammars. An easy way to indicate parsing success is to compose a sequence of a `grammar.START_SEQUENCE` and `END_OF_FILE`, and then to pass it to the `Parse` function instead of the real `START_SEQUENCE`. After parsing, if `END_OF_FILE` can be found at apropriate place, the parsing is considered successful. If a parsing error occurs, `END_OF_FILE` will not be in the corresponding column offset, and the produced chart can be additionally analyzed for errors. Then it may be relatively easy to output *"Expected `X` at `Y`"* error forms by observing only the last populated column in the resulting chart.

## 3. extending grammar language

In this section we will extend context free grammar first to *syntactic logic grammar*, and then to *Turing complete grammar* domain. To do this, it will be necessary to rearrange grammar appearance from a form handled by usual context free grammar to a form that is much closer to [propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus). Although there will be some differences to classical understanding of propositional logic, with this rearrangement, we will be able to interpret our logic-like expressions as a possible parsing grammar definitions. Moreover, these logic-like grammars will support usual logic transformations like [De Morgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws), as well as basic logical reasoning like [resolution rule](https://en.wikipedia.org/wiki/Resolution_(logic)), which we will use to transform *syntactic logic grammars* to a form acceptable by the *v-parser* algorithm with some minimal adjustments. Finally, with introduction of variables into our grammars, we will turn them into Turing complete *templates*, which should satisfy demands that arise from requirements of hosting the *Logos* language mentioned in introduction section. 

### 3.1. context free domain: phrase flat structure grammar

Usual context free grammars take form of `A -> α`, where in parsing we seek for the left production sides to parse the right production sides. Alternations are there expressed by repeating the same left side across multiple production rules. However, this is inconsistent with logic expressions where these rules apply:

      A -> B,   A -> C
    ————————————————————
       A -> (B and C)


      B -> A,   C -> A
    ————————————————————
       (B or C) -> A

Therefore, to synchronize our grammar language with logic, we will swap positions of left and right sides of productions in our grammars, and we will refer to this form of grammar as *phrase flat structure grammar*. Although this adjustment doesn't shake foundations of defining grammars, it is a necessary adjustment to proceed with extending our grammar language. Following the above laws, all our grammar rules now take the following form:

    α -> A
    
where the left side is a sequence of non-terminals and terminals, while the right side is a non-terminal. Now, in parsing we seek for the right rule sides to parse the left rule sides, while we express alternations by repeating the same right side across multiple rules. Obviously, this adjustment has exactly the same level of expressivity as context free grammars, and it doesn't require any major change of the original *v-parser* algorithm.

### 3.2. syntactic logic domain: phrase logic structure grammar
### 3.3. turing complete domain: template logic structure grammar

## 4. implementation

