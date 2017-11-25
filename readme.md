# V-Parser

V-Parser is a nus-product of working on a next generation programming language. It should exhibit nearly linear parsing time, no matter of how ambiguous output abstract syntax forest is. This project is still in experimental stage, prior to uploading actual javascript source code. We expect the full version to be available soon, as our local parsing experiments look cool to us.

    01  DECLARE chart: [][], text: STRING;
    02  
    03  FUNCTION Parse (grammar, input)
    04      text ← input;
    05      chart.CLEAR ();
    06      MergeItem (0, [grammar.TOP_RULE], 0, []);
    07      FOR each new column in chart
    08          FOR each new item in column
    09              FOR each alternation of item.Sequence[item.Index]
    10                  MergeItem (column.Index, alternation.sequence, 0, item.Inheritable);
    11  
    12      RETURN chart;
    13  
    14  PROCEDURE MergeItem (offset, sequence, index, inheritable)
    15      item ← chart[offset].FIND (sequence, index);
    16      IF not found item
    17          item ← {Sequence: sequence, Index: index, Inheritable: [], Inheritors: [], BringOver: []};
    18          chart[offset].ADD (item);
    19  
    20      IF item.Index + 1 < item.Sequence.LENGTH
    21          item.BringOver.MERGE (inheritable);
    22          inheritable ← [item]
    23  
    24      FOR each x in inheritable
    25          x.Inheritors.ADD (item);
    26          FOR each y in item.inheritors
    27              IF (x.Sequence, x.Index) not in y.Inheritable
    28                  y.Inheritable.ADD (x);
    29  
    30              IF y is successfully parsed terminal in text at offset
    31                  MergeItem (offset + y.LENGTH, x.Sequence, x.Index + 1, x.BringOver);
