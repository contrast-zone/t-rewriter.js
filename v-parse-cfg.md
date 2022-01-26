# *v-parse-cfg* algorithm

*V-parse-cfg* algorithm parses input text against context free grammar rules. The algorithm operates on [context free grammars](https://en.wikipedia.org/wiki/Context-free_grammar). The version of algorithm presented in this section distinguishes between terminals and non-terminals. Input text is expected to be [lexed](https://en.wikipedia.org/wiki/Lexical_analysis) into an array of words prior to actual parsing.

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
                            EXIT FOR

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

`MergeItem` procedure creates a new item in appropriate column determined by `offset` only if an item with similar `Sequence` and `Index` attributes doesn't already exist in that column. If the item exists, an array of its direct and indirect parents and children is accumulated. Then the algorithm visits all the existing terminal children in item's `inheritors` attribute, while we pick the next item from all the parents in item's `Inherited` attribute to insert it to the next column of the chart. The next item is thus put on schedule to be processed by `Parse` function in the future steps.

After parsing, if `END_OF_FILE` starting sequence element can be found at the first column offset behind the last input token, the parsing is considered successful. If a parsing error occurs, `END_OF_FILE` will not be placed at appropriate place, and the produced chart may be additionally analyzed for errors. Thus, in the case of an error, it may be relatively simple to report `Expected expression E at offset N` type of errors by observing only the last populated column in the resulting chart.

The algorithm produces chart containing all (successful and unsuccessful) attempts in constructing input string. To actually do something meaningful from the algorithm output, we need to convert it to a syntax tree suitable for traversing and further processing. `MakeSyntaxTree` function converts the output chart to such a syntax tree. It starts from the `END_OF_FILE` element, and assembles the tree in backwards fassion, towards the uppermost `goal` element. In a case of ambiguous successfuly parsed contents, the function outputs the first successful syntax tree regarding to parse rules ordering.

Let's mention that the entire algorithm exhibits very well behavior regarding to parsing possibly ambiguous grammars when encountering multiple successful productions for the same input.

    // under construction //

