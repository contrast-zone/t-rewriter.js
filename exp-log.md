# log-exp basics

## Semantics

Semantic are defined by rhombus containing input syntax rules, semantic connections rules, and output syntax rules. The rhombus is diverging branches from facts in a direction of deduction, forming a initial deduction tree. The rhombus is also diverging branches from goals in a direction of abduction, forming a opposed abduction tree. Branches meet at the middle of rhombus, making it a complete inference system.

                                    FACTS
                                       
        D ||                         / \                         /\
        E ||                       / \ / \                      //\\
        D ||                     / \ / \ / \                   //||\\
        U ||                   / \ / \ / \ / \                   ||
        C ||                 /                 \                 ||
        T ||                     INPUT SYNTAX                    ||
        I ||             /                         \             ||
        O ||           / \ / \ / \ / \ / \ / \ / \ / \           ||
        N ||         / \ / \ / \ / \ / \ / \ / \ / \ / \         ||
          ||       / \ / \ / \ / \ / \ / \ / \ / \ / \ / \       ||
          ||     /                                         \     ||
          ||                    SEMANTIC RULES                   ||
          ||     \                                         /     ||
          ||       \ / \ / \ / \ / \ / \ / \ / \ / \ / \ /       ||
          ||         \ / \ / \ / \ / \ / \ / \ / \ / \ /         || A
          ||           \ / \ / \ / \ / \ / \ / \ / \ /           || B
          ||             \                         /             || D
          ||                    OUTPUT SYNTAX                    || U
          ||                 \                 /                 || C
          ||                   \ / \ / \ / \ /                   || T
        \\||//                   \ / \ / \ /                     || I
         \\//                      \ / \ /                       || O
          \/                         \ /                         || N
                                       
                                    GOALS

We provide input as a terminal sequence. The task is to extract output. First we verify if input deduces from facts. If that is the case, to compute output, we abduce from goals to input. Output is then contained in the way of this abduction. There may be many output candidates, but we choose the one that is represented by the first sequence composed only of terminals, closest to the first resulting goal.

### terminals

    /*
        hello world
    */
    
    (          fact -> "Hi computer" ) /\
    ( "Hi computer" -> "Hello world" ) /\
    ( "Hello world" -> goal          )


### non-terminals

    /*
        toy making decision
    */
    
    (  fact -> child "is good" ) /\
    ( child -> "Girl"          ) /\
    ( child -> "Boy"           ) /\
    
    ( "Girl is good" -> "Nick made a toy doll" ) /\
    (  "Boy is good" -> "Nick made a toy car"  ) /\
    
    (        "toy doll" -> toy  ) /\
    (         "toy car" -> toy  ) /\
    ( "Nick made a" toy -> goal )
    

### variables

    /*
        title decision
    */
    
    ( fact -> person job ) /\
    ( person -> "Jane" ) /\
    ( person -> "John" ) /\
    ( job -> "drives rocket" ) /\
    ( job -> "heals people"  ) /\

    ( P:person . ( P "drives rocket" -> "astronaut" P ) ) /\
    ( P:person . (  P "heals people" -> "doctor" P    ) ) /\

    ( "astronaut" -> title ) /\
    (    "doctor" -> title ) /\
    ( "Jane" -> person ) /\
    ( "John" -> person ) /\ 
    ( title person -> goal )


### conjunctions and disjunctions

    /*
        better future decision
    */
    
    ( fact -> person "is being educated" ) /\
    ( person -> "Jane" ) /\
    ( person -> "John" ) /\

    ( P:person . (    P "is being educated" -> P "attends kindergarten" \/ P "attends school" ) ) /\
    
    ( P:person . ( P "attends kindergarten" -> P "builds a better future" ) ) /\
    ( P:person . (       P "attends school" -> P "builds a better future" ) ) /\
    
    ( "Jane" -> person ) /\
    ( "John" -> person ) /\
    ( person "builds a better future" -> goal )


    /*
        computer expert decision
    */
    
    ( fact -> person "constructs a robot" ) /\
    ( person -> "Jane" ) /\
    ( person -> "John" ) /\
    
    ( P:person . ( P "constructs a robot" -> P "masters software" ) ) /\
    ( P:person . ( P "constructs a robot" -> P "masters hardware" ) ) /\

    ( P:person . ( P "masters software" /\ P "masters hardware" -> P "is a computer expert" ) ) /\
    
    ( "Jane" -> person ) /\
    ( "John" -> person ) /\
    ( person "is a computer expert" -> goal )
