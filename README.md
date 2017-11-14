# V-Parser

    DECLARE chart: [][], text: STRING;

    FUNCTION Parse (grammar, input)
        text ← input;
        chart.CLEAR ();
        MergeItem (0, [grammar.TOP_RULE], 0, []);
        FOR each new column in chart
            FOR each new item in column
                FOR each alternation of item.Sequence[item.Index]
                    MergeItem (column.Index, alternation.sequence, 0, item.Inheritable);

        RETURN chart;

    PROCEDURE MergeItem (offset, sequence, index, inheritable)
        item ← chart[offset].FIND (sequence, index);
        IF not found item
            item ← {Sequence: sequence, Index: index, Inheritable: [], Inheritors: [], BringOver: []};
            chart[offset].ADD (item);

        IF item.Index + 1 < item.Sequence.LENGTH
            item.BringOver.MERGE (inheritable);
            inheritable ← [item]

        FOR each x in inheritable
            x.Inheritors.ADD (item);
            FOR each y in item.inheritors
                IF (x.Sequence, x.Index) not in y.Inheritable
                    y.Inheritable.ADD (x);

                IF y is successfully parsed terminal in text at offset
                    MergeItem (offset + y.LENGTH, x.Sequence, x.Index + 1, x.BringOver);
