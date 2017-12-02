# V-Parser

V-Parser is a nus-product of working on a next generation programming language. It should exhibit nearly linear parsing time, no matter of how ambiguous output abstract syntax forest is. This project is still in experimental stage, prior to uploading actual javascript source code. We expect the full version to be available soon, as our local parsing experiments look cool to us.

## Algorithm
This is a pseudocode for the V-Parser algorithm:

    01  DECLARE chart: [][], text: STRING;
    02 
    03  FUNCTION Parse (grammar, input)
    04      text ← input;
    05      chart.CLEAR ();
    06      MergeItem (0, [grammar.TOP_RULE], 0, null);
    07      FOR each new column in chart
    08          FOR each new item in column
    09              FOR each alternation of item.Sequence[item.Index]
    10                  MergeItem (column.Index, alternation.sequence, 0, item);
    11  
    12      RETURN chart;
    13  
    14  PROCEDURE MergeItem (offset, sequence, index, parent)
    15      item ← chart[offset].FIND (sequence, index);
    16      IF not found item THEN
    17          item ← {Sequence: sequence, Index: index, Inheritable: [], Inheritors: [], BringOver: []};
    18          chart[offset].ADD (item);
    19  
    20      inheritors ← [item] UNION item.Inheritors;
    21      IF item.Index + 1 == item.Sequence.LENGTH THEN
    22          inheritable ← iff (parent is null, [], [parent] UNION parent.Inheritable);
    23      ELSE
    24          inheritable ← [item];
    25          IF parent is not null THEN item.BringOver.ADD_IF_NOT_EXIST (parent);
    26  
    27      FOR each x in inheritable
    28          FOR each y in inheritors
    29              x.Inheritors.ADD (y);
    30              IF (x.Sequence, x.Index) not in y.Inheritable THEN
    31                  y.Inheritable.ADD (x);
    32                  IF x.Index + 1 < x.Sequence.LENGTH AND y is terminal succeeded in text at offset THEN
    33                      FOR each z in x.BringOver
    34                          MergeItem (offset + y.LENGTH, x.Sequence, x.Index + 1, z);

For a sake of simplicity, we present the algorithm that operates on classical context free grammar (CFG) where each rule is represented in the following form:

    X -> A B C ...

where `X` is a rule name, and `A B C ...` is a sequence of rules named: `A`, `B`, `C`, and so on. `A`, `B`, or `C` may be terminal constants, as well. Alternations are noted by having the same rule name on the left side over multiple rule definitions in a grammar.

V-Parser is a chart parser that groups parsing items into columns that correspond to offset from the beginning of input string, while columns are incrementally processed, never looking back into previous columns in the chart. It stores its items as pairs of a sequence and an index of the sequence element. This way it is always possible to know what is an ahead element of the current item (`index + 1`). The main function `Parse` serves as a loop over columns, items and their alternations. It repeatedly calls `MergeItem` procedure to populate the chart onwards. `MergeItem` procedure creates a new item in the current column determined by `offset` only if it doesn't already exist. Properties `Inheritable` and `Inheritors` are used as pointers to parents and items that inherit these pointers, respectively. Parents in `Inheritable` property are accumulated through children, meaning that each child has pointers to all of its direct or indirect parents.

Line 20-25 make sure that `Inheritable` is properly set up in a case of pointing to non-last index of the symbol seuence. `BringOver` property is used to remember parent ahead symbols, and is used when we get to the point when we reach the last sequence symbols in parsing.

Lines 27-34 basically set up `Inheritors` relative to `Inheritable` (line 29), and for each `Inheritor`, parent's `Inheritable` is being assigned (line 31). In the line 34, algorithm possibly populates ahead item in corresponding chart column. The whole loop makes sure that newly realized ahead symbols contained in `Inheritable` are properly distributed over the chart, at positions determined by relevant past parse terminals, including the current one.

The algorithm stops when it runs out of new ahead items in further columns.

Building compact parse forest (CPF) by V-Parser is trivial, because we just have to assign extents to terminals. Reporting errors should also be relatively easy by analysing the last column in the chart.
