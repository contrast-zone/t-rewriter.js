# *v-parse* algorithm

    // under construction //
    
## introduction

One may find surprising that novel inference engine behind *exp-log* is based on original parsing technology which should perfectly correspond to logical abduction process. The abduction process is utilizing sequents borrowed from [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus), a well known logical formalism for constructing logic proofs. However, although borrowed sequents are a backbone of *exp-log*, we observe them a bit differently than in usual sequent calculus interpretation. This allows us to use the abduction process as a main guide towards automatic construction of output from provided input while still keeping *exp-log* in the light of a [logic programming](https://en.wikipedia.org/wiki/Logic_programming) tool.


### inference process

The algorithm bases its functionality on [*sequents*](https://en.wikipedia.org/wiki/Sequent) that constitute ruleset. Our inference algorithm works in the following way: as a presumption, the `goal` atom has to be exclusively included in the right side of at least one *sequent* from the set. We recursively [abduce](https://en.wikipedia.org/wiki/Abductive_reasoning) from the `goal` atom in a series of inference steps. With the initial `goal` atom placed to the right, we follow the inference branching in backwards direction from right to left, while trying to construct the input expression. During the entire construction from the `goal` atom, we are expecting *sequent* left sides to match other *sequent* right sides, and in the end of the process, to match parts of the input expression. Naturally, this process is taking into consideration that *sequent* left sides may be conjunctions, while *sequent* right sides may be disjunctions.

We present creation of the inference algorithm in three successive iterations, each extending the previous one, introducing more general level of expressivity:

1. **v-parse-crux** algorithm handles context free grammar equivalent subset of the abduction process
2. **v-parse-plus** algorithm extends the original algorithm to handle right side sequences of atoms, together with variables notation.
3. **v-parse-star** algorithm finally extends the previous one to handle left side conjunctions and right side disjunctions.

Version (1) is the simplest one, and may be compared to the current mainstream status of parsing technology. Version (2) with its extensions already brings term rewriting. Version (3) is the final algorithm version, supporting complete interpretation of normalized sequents. Although one may argue that version (3) may not be unconditionally necessary because version (2) is already Turing complete, we are taking the stand that introduction of conjunction and disjunction connectives greatly simplifies formalization of different systems, and we decide to keep the connectives as a core part of the inference system.

##### v-parse-crux algorithm

*V-parse-crux* algorithm parses input text against context free grammar rules. The algorithm operates on [context free grammars](https://en.wikipedia.org/wiki/Context-free_grammar). The version of algorithm presented in this section distinguishes between terminals and non-terminals. Input text is expected to be [lexed](https://en.wikipedia.org/wiki/Lexical_analysis) into an array of words prior to actual parsing.

    FUNCTION Parse (grammar, start, words)
        DECLARE chart := [][];
        
        MergeItem (0, [start, END_OF_FILE], 0, {Sequence: [], Index: -1, Inherited: [], Inheritors: [], Parents: [], Previous: []}, NULL);
        FOR each new column in chart DO
            FOR each new item in column DO
                FOR each production in grammar WHERE item.Sequence[item.Index] == production.Right DO
                    MergeItem (column.Index, production.Left, 0, item, NULL);

        RETURN MakeSyntaxTree ();

        PROCEDURE MergeItem (offset, sequence, index, parent, previous)
            DECLARE item := chart[offset].FIND (sequence, index);

            IF not found item THEN
                item := {Sequence: sequence, Index: index, Inherited: [], Inheritors: [], Parents: [], Previous: []};
                chart[offset].ADD (item);

            IF previous is not NULL and previous not in item.Previous THEN
                item.Previous.ADD (previous);

            IF parent not in item.Parents THEN
                item.Parents.ADD (parent);
                FOR each x in [parent] UNION parent.Inherited DO
                    FOR each y in [item] UNION item.Inheritors DO
                        IF y.Index + 1 == y.Sequence.LENGTH THEN
                            IF (x.Sequence, x.Index) not in y.Inherited THEN
                                y.Inherited.ADD (x);
                                x.Inheritors.ADD (y);

                            IF x.Index + 1 < x.Sequence.LENGTH THEN
                                IF y.Sequence[y.Index] is terminal THEN
                                    IF y.Sequence[y.Index] == words[offset] THEN
                                        FOR each z in x.Parents DO
                                            MergeItem (offset + 1, x.Sequence, x.Index + 1, x.Parents[z], item);

                IF item.index + 1 < item.sequence.length THEN
                    IF item.Sequence[item.Index] is terminal THEN
                        IF item.Sequence[item.Index] == words[offset] THEN
                            MergeItem (offset + 1, item.sequence, item.index + 1, parent, item);

        FUNCTION MakeSyntaxTree ()
            DECLARE item, reachParent, parents, treeItem, childTreeItem;
            
            item := chart[words.LENGTH].FIND (END_OF_FILE);
            IF not found item THEN
                RETURN "Error at: " + chart.LENGTH;
            
            parents := [{Sequence: [start, END_OF_FILE], Index: 1, Children: []}];
            WHILE parents.LENGTH > 0;
                IF item.Index > 0 THEN
                    reachParent := item;
                    FOR each p in item.Previous DO
                        IF reachParent is direct or indirect parent of p THEN
                            item := p;

                    childTreeItem := words[item.offset];
                    parents.LAST.Index := parents.LAST.Index - 1;

                ELSE
                    IF item.Sequence == reachParent.Sequence and item.Index == reachParent.Index - 1 THEN
                        reachParent := {sequence: parents[parents.length - 1].sequence, index: parents[parents.length - 1].index + 1};

                    FOR each p in item.Parents DO
                        IF reachParent is direct or indirect parent of p THEN
                            item := p;
                            EXIT FOR;
                            
                    childTreeItem := treeItem;
                
                IF item.Index == item.Sequence.LENGTH - 1 THEN
                    parents.ADD ({Sequence: item.Sequence, Index: item.Index, Children: []});
                
                treeItem := parents.LAST;
                treeItem.Children[childTreeItem.Index] := childTreeItem;
                
                IF treeItem.Index == 0 THEN
                    parents.REMOVE_LAST ();                
            
            RETURN treeItem;

This algorithm is a chart based algorithm that groups parsing items into columns. Columns correspond to offsets from the beginning of input sequence. Columns are incrementally processed, never looking back into the previous columns in the chart. Algorithm stores generated items in the chart as pairs of a sequence and an index of the sequence element. This way it is always possible to know what is ahead element of the current item (we just increment the index attribute by one, possibly refering to parents of the current item if the index points to the last element) without looking to back columns.

The main function `Parse` serves as a loop over chart columns, productions and their alternations. The loop behaves as a [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search) to reach all the tokens relative to `start` symbol. It repeatedly calls `MergeItem` procedure to populate the chart onwards. When the parsing is over (there are no additional columns and items in the chart), `Parse` function returns a call to `MakeSyntaxTree` function that composes a parse tree from the chart.

`MergeItem` procedure creates a new item in appropriate column determined by `offset` only if an item with similar `Sequence` and `Index` attributes doesn't already exist in that column. If the item exists, an array of its direct and indirect parents and children is accumulated. Then the algorithm visits all the existing terminal children in itme's `inheritors` attribute, while we pick the next item from all the parents in item's `Inherited` attribute to insert it to the next column of the chart. The next item is thus put on schedule to be processed by `Parse` function in the future steps.

After parsing, if `END_OF_FILE` starting sequence element can be found at the first column offset behind the last input token, the parsing is considered successful. If a parsing error occurs, `END_OF_FILE` will not be placed at appropriate place, and the produced chart may be additionally analyzed for errors. Thus, in the case of an error, it may be relatively simple to report `Expected expression E at offset N` type of errors by observing only the last populated column in the resulting chart.

Algorithm produces chart containing all (successful and unsuccessful) attempts in constructing input string. To actually do something meaningful from the algorithm output, we need to convert it to syntax tree suitable for traversing and further processing. `MakeSyntaxTree` function converts the output chart to such a syntax tree. It starts from the `END_OF_FILE` element, and assembles the tree in backwards fassion, towards the uppermost `goal` element. In a case of successfuly ambiguous parsed contents, the function outputs the first successful syntax tree regarding to parse rules ordering.

Let's say that the entire algorithm exhibits very well behavior regarding to parsing possibly ambiguous grammars when encountering multiple successful productions for the same input.

##### v-parse-plus algorithm

We will allow a bit more of necessary complexity for supporting right side sequences and variables.

    // under construction //

##### v-parse-star algorithm

The final touch to support sequents
    
    // under construction //

### extracting output

In the abduction process, if we can construct the exact form of input expression from the `goal` atom, we may conclude that *input expression entails the `goal` atom*, and we use the successful inference branching from the process as a proof of this conclusion. Then, from successful inference branching, we extract the output of the whole process. Our output will represent *a proof fragment closest to the `goal` atom, that is self sufficient to form a whole of continuous string of literals*.

    // under construction //

