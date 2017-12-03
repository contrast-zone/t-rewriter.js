# V-Parser

V-Parser is a nus-product of working on a next generation programming language. It is Javascript implementation of BNF-ish context free grammar (CFG) parser with compact parse forest (CPF) output. It should exhibit nearly linear parsing time, no matter of how ambiguous output abstract syntax forest is. To write grammars and test V-Parser, we have provided an [online grammar developement environment](http://moony.atspace.cc/v-parser). 

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

V-Parser is a chart parser that groups parsing items into columns that correspond to offset from the beginning of input string. Columns are incrementally processed, never looking back into previous columns in the chart. V-Parser stores its items in chart as pairs of a sequence and an index of the sequence element. This way it is always possible to know what is an ahead element of the current item (we just increment `index` property). The main function `Parse` serves as a loop over columns, items and their alternations. It repeatedly calls `MergeItem` procedure to populate the chart onwards.

`MergeItem` procedure creates a new item in the current column determined by `offset` only if the item doesn't already exist. Properties `Inheritable` and `Inheritors` are used as pointers to parents and items that inherit these pointers, respectively. Parents in `Inheritable` property are accumulated over children, meaning that each child keeps pointers to all of its direct or indirect parents.

Lines 20-25 make sure that `Inheritable` is properly set up in a case of pointing to non-last index of the symbol seuence. `BringOver` property is used to remember parent ahead symbols, and is used when we get to the point when we reach the last sequence symbols in parsing.

Lines 27-34 loop over each `inheritable`, and further reach to each `inheritor`. If `inheritor` is a successfully parsed terminal, and if `inheritable` is an item with non-last index, algorithm populates ahead item in corresponding chart column. The whole loop basically makes sure that newly realized ahead symbols are properly distributed over the chart, at positions determined by relevant past parse terminals, including the current one.

The algorithm stops when it runs out of new items in further columns.

Building compact parse forest (CPF) by V-Parser is trivial, because we just have to assign parsed extents to terminals. Reporting errors should also be relatively easy by analysing the last column in the chart.

## Implementation
The first thing that makes this implementation of the parser different from others is its compact parse forest (CPF) output. Given an input grammar-tree, CPF takes almost the same form as the input. The only difference is enrichment by `extents` property at objects that represent terminals. These `extents` hold an information about where the terminals occur in parsed input string, also as which is their right extent. If we want to later process CPF, we have to keep track of these `extents`, constructing the actual sequences of rules by investigating extents of their direct / indirect terminals. It appears that this is just enough to recreate parsed input string, by pairing the right extents of previous rules to the left extents of next rules in sequences. CPF is being extremely friendly to memory, as it holds minimal range of informations about parsing. However, we have to be careful when processing CPF because it also holds informations about uncompletely parsed sequences. That means that prior to processing a sequence at given place, we have to check if the sequence is parsed up to its last element. Once we know this, we can be sure that the sequence fits into given place. Otherwise, we can use this incompleteness to indicate an error in parsing the sequence at given place.

Input of this implementation is also somewhat different from what is usually seen in other parsers. It is a kind of structured BNF-ish rules that are passed in a form of JSON. These rules modularly fit one into another, thus forming a grammar tree. The grammar tree is cloned upon parsing and reused to build CPF.

Grammar tree is built from alternations, sequences, subtypes, scripts and special objects that are used to denote a rule name, a reference to another rule, or a costant string, including regexps. Objects representing a grammar tree are distinguished by names of their properties. Thus, alternations are written in a following way:

    {alternation: [...]}

Sequences are framed by:

    {sequence: [...]}

Subtypes are used to group grammar rules into trees. Priorly to building a subtype, we need to pass a subtype name in a form of:

    {exp: ...}

where the value of `exp` property is a valid rule name. Finally, a subtype with name `Test` is formed in a following way:

    {
        type: {exp : "Test"},
        subtype: ...
    }

Subtype names are representing anchors that can be used for referencing them from other grammar places. References are written by `exp` property, whose value is a dot delimeted path to rule. The first path element can be omitted, starting a path by a dot, meaning that we refer to path elements from the root of the grammar. Also, we can skip path parts, while the code searches all the child nodes for a subtype with given name. In example, if we want to refer to a subtype `Test`, we write:

    {exp: ".Test"}

References get enriched by `reference` property that points to actual anchor inside grammar tree after parsing. It can be useful for processing resulting CPF.

Constant strings are also noted by `exp` property, whose value is enclosed in quotes. We can use a double quote, a single quote, or a back quote to denote a constant. Example:

    {exp: "'const'"}

We can also specify regexps to match in places of parsing. We enclose regexps in forward slashes, possibly followed by `i` character to denote case insensitive match. Example:

    {exp: "/[A-z]+/"}

Finally, we can pass functions to parser to use scripting:

    {
        script: function (text, offset) {
            ...
            return int;
        }
    }

These kind of functions take two parameters, namely input string and offset of current parsing pointer. After some processing, the function returns the right extent of successful parse, or -1 to indicate unsuccessful parse. Unfortunately, scripting is not supported by our online grammar development environment, but we can use it in actual code in an editor of your choice.. 

Given these building blocks, we construct a grammar tree. Actual parsing is done from Javascript in a following way:

    inputString = ...;
    grammar = {...};
    CPFOuput = parser.parseCFG (grammar, inputString);

Don't forget to include `v-parser.js` at appropriate place before using the library.
