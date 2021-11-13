# introduction to intermezzo rewriting system

> // under construction //

## table of contents

- [ ] 1. introduction
- [ ] 2. theoretical background
    - [ ] 2.1. syntax
    - [ ] 2.2. semantics
        - [ ] 2.2.1. elementary expressions
        - [ ] 2.2.2. composite expressions
        - [ ] 2.2.3. matching expressions
- ?. practical examples
    - ?. algorithms
        - ?. binary integer arithmetic implementation
        - ?. Euclid's greatest common divisor
    - ?. code compiling
        - ?. integer arithmetic to webassembly
        - ?. Turing machines to intermezzo
    - ?. general computing
        - ?. untyped lambda calculus
- ?. conclusion

## introduction

## theoretical background

### syntax

          <start> := <ruleset>
          
        <ruleset> := (RULESET <rules>)
        
          <rules> := <rule> <rules>
                   | <rule>
                   
           <rule> := <stdrule>
                   | <mchrule>
                   
        <stdrule> := (RULE <lft> <rgt>)
        
            <lft> := top
                   | <comp-expr>
                   
            <rgt> := <comp-expr>
                   | bot
                   
        <mchrule> := (MATCH (ID <eqs>) <ruleset>)
          
            <eqs> := <eq> <eqs>
                   | <eq>
           
             <eq> := (EQ <elem-expr> <comp-expr>)

### semantics

Semantics are defined by rhombus containing input syntax rules, semantic connective rules, and output syntax rules. The rhombus is diverging branches from `top` downwards, in a direction of deduction, forming an initial deduction tree. The rhombus is also diverging branches from `bot` upwards, in a direction of abduction, forming an opposed abduction tree. These branches meet at the middle semantics section, thus forming a complete inference system.

                                     top 
                                       
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
          ||                 SEMANTIC CONNECTIVES                ||
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
                                       
                                     bot

Related to a system it is describing, the rhombus is entirely consisted of directed production rules linking `top` and `bot`. In this setup, we provide an input as a string expression. The task is to extract the output string expression. As a first step, we verify if the input deduces from `top` in a process called forward chaining, using provided production rules. If that is the case, to compute the output, next we try to abduce the input from `bot` in a process called backward chaining, using provided production rules. If such an abduction is possible, the output is then contained in the composed abduction tree. Lastly, we have to select the appropriate output that is represented by a combination of left-side elementary expressions. There may be many valid parallel output candidates, but we choose the one closest one to the first available link to `bot`.

#### elementary expressions

    /*
        conversation example
    */
    
    (
        RULESET
        
        (RULE top <hi computer>          )
        (RULE top <isn't world beautiful>)
        (RULE top <bye computer>         )

        (RULE           <hi computer> <hello entity>  )
        (RULE <isn't world beautiful> <yes, it is>    )
        (RULE          <bye computer> <goodbye entity>)

        (RULE   <hello entity> bot)
        (RULE     <yes, it is> bot)
        (RULE <goodbye entity> bot)
    )

#### composite expressions

    /*
        toy making decision
    */
    
    (
        RULESET
        
        (RULE     top <a <child> is good>)
        (RULE <child> <girl>             )
        (RULE <child> <boy>              )
        
        (RULE <a girl is good> <Nick makes a toy doll>)
        (RULE  <a boy is good> <Nick makes a toy car> )
        
        (RULE           <toy doll> <toy>)
        (RULE            <toy car> <toy>)
        (RULE <Nick makes a <toy>> bot  )
    )

#### matching expressions

    /*
        job title decision
    */
    
    (
        RULESET
        
        (RULE      top <<person> <job>>)
        (RULE <person> <Jane>          )
        (RULE <person> <John>          )
        (RULE    <job> <drives rocket> )
        (RULE    <job> <heals people>  )

        (
            MATCH
            (ID (EQ <P> <person>))
            (RULESET (RULE <<P> drives rocket> <astronaut <P>>))
        )
        
        (
            MATCH
            (ID (EQ <P> <person>))
            (RULESET (RULE <<P> heals people> <doctor <P>>))
        )

        (RULE        <astronaut> <title> )
        (RULE           <doctor> <title> )
        (RULE             <Jane> <person>)
        (RULE             <John> <person>) 
        (RULE <<title> <person>> bot     )
    )

