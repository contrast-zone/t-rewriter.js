
    // under construction //

# introduction to canon programming language

> __*[Intended audience]*__  
> Beginners in language parsing, term rewriting, and deductive systems

> __*[Short description]*__  
> As an embodiment of general problem solving strategy related to [term rewriting](https://en.wikipedia.org/wiki/Rewriting), *Canon* aims to be a host for a variety of kinds of [formal languages](https://en.wikipedia.org/wiki/Formal_language), exhibiting [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system). For each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) in a [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm. Having clearly defined communication input and output forms, *Canon* performs transition from input to output by additionally defining possibly [expressive, functional, and semantic complete](https://en.wikipedia.org/wiki/Completeness_(logic)) set of chaining [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)). This sort of arrangement also sheds light on *Canon* from an angle of [systems](https://en.wikipedia.org/wiki/System) theory, thus broadening a possible range of use cases.

> __*[References]*__  
> [Wikipedia web site](https://en.wikipedia.org)

## table of contents

- [x] [1. introduction](#1-introduction)
- [x] [2. theoretical background](#2-theoretical-background)
    - [x] [2.1. syntax](#21-syntax)
    - [x] [2.2. semantics](#22-semantics)
        - [x] [2.2.1. semantic rhombus](#221-semantic-rhombus)
        - [x] [2.2.2. tutorial examples](#222-tutorial-examples)
        - [x] [2.2.3. summary](#223-summary)
- [x] [3. practical examples](#3-practical-examples)
    - [x] [3.1. logic programming](#31-logic-programming)
    - [x] [3.2. functional programming](#32-functional-programming)
    - [x] [3.3. automata programming](#33-automata-programming)
- [x] [4. related work](#4-related-work)
- [x] [5. conclusion](#5-conclusion)

## 1. introduction

Formal languages are usually considered as formations dedicated to accomplishing diverse tasks. *Canon* is also a language, and it is an implementation of a [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system) that aims to be a host for a variety of kinds of other formal languages. By its design, *Canon* represents an embodiment of a general problem solving strategy related to [term rewriting](https://en.wikipedia.org/wiki/Rewriting), being able to support a diversity of hosted languages intentions and purposes.

Seeing *Canon* as a programming language that operates on other formal languages, it provides a particular form of data computation: for each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/domain-specific_language) operating on specific forms of data (input), yielding specific forms of computation results (output). To that extent, *Canon* also represents a language implementing [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm.

[Production rules](https://en.wikipedia.org/wiki/Production_(computer_science)), as *Canon* constituents, mediate between source and target expressions. Appearance of source and target expressions is defined by custom input and output syntax production rules. These rules are then complemented by custom chaining semantic production rules, rendering the [production system](https://en.wikipedia.org/wiki/Production_system_(computer_science)) capable of translating between input and output expressions. Translating mechanism in a case of *Canon* has important property of being [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), which means we can construct *any* output from *any* input, potentially supporting *any* kind of meaningful computation process in between.

Shedding light from another angle, a [system](https://en.wikipedia.org/wiki/System) is a group of interacting or interrelated elements that act according to a set of rules to form a unified whole. When searching the Internet for examples of a system, we may find that an example of a system is the way someone organizes their closet. Also, an example of a system is all the organs that work together for digestion. More abstract example would be a set or arrangement of things so related or connected as to form a unity or organic whole. Other examples may include a solar system, school system, system of highways. An important conceptual asset of each system is existence of input and output between system and its surroundings. Systems, having clearly defined interdependent input and output, may also be described by sets of *Canon* production rules. Considering its computational completeness, *Canon* does not pose any restrictions on any kinds of systems it may describe. Thus, possible application of *Canon* rulesets reaches even to simulating a wide range of systems we may see around us. This should not be such a surprise since many formal languages intentions are exactly describing behavior of different system wholes.

In this exposure, we will explain how *Canon* arranges its expressions in a goal of solving different problems, as well as representing different languages. In section [[2. theoretical background](#2-theoretical-background)] we examine syntax and semantics of *Canon*, in section [[3. practical examples](#3-practical-examples)] we examine a few concrete examples of applying *Canon* to abstract problem solving systems, section [[4. related work](#4-related-work)] lists some of related programming systems, while section [[5. conclusion](#5-conclusion)] briefly summarizes the essence of the whole exposure.

## 2. theoretical background

*Canon* tries to be a blend of [logical inference](https://en.wikipedia.org/wiki/Inference) engine and [term rewriting](https://en.wikipedia.org/wiki/Rewriting) system. [Productions rules](https://en.wikipedia.org/wiki/Production_(computer_science)) in *Canon* resemble [modus ponens](https://en.wikipedia.org/wiki/Modus_ponens) with [nondeterministic](https://en.wikipedia.org/wiki/Nondeterministic_programming) considerations involving [logical conjunctions](https://en.wikipedia.org/wiki/Logical_conjunction) and [logical disjunctions](https://en.wikipedia.org/wiki/Logical_disjunction). These rules appear a lot like well known [sequents](https://en.wikipedia.org/wiki/Sequent) from [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus) with a few important modifications:

1. the rules may be written in a forward or backward manner:  
    Forward rules are analogous to [material implication](https://en.wikipedia.org/wiki/Material_conditional), while backward rules are analogous to [converse nonimplication](https://en.wikipedia.org/wiki/Converse_nonimplication). In our understanding, we hold that these rules correspond to [deduction](https://en.wikipedia.org/wiki/Deductive_reasoning) and [abduction](https://en.wikipedia.org/wiki/Abductive_reasoning), respectively. This combination of rules is chosen because of their symetric property, such that algorithms for processing one type of rules works with the other type of rules in a similar manner, only applied backwards. Both kinds of rules, as it will be explained, are used to restrain possibly infinite production rules divergence between starting input and final output terms.

2. the rules may be combined only in a precisely restricted manner:  
    In a way, we may say that we use a kind of restricted logic expressions applied to term rewriting. The introduced restrictions make a predictable logic subset suitable for term rewriting, while retaining Turing completeness as an important property of *Canon* programming system. Later, we will bring some mnemonic assets in a hope to successfully cope with potential expression complexity.

In this section we are explaining *Canon* rule system syntax and defining how should it behave in practice. Although they may seem simple, basic constructs we will learn about in this section are enough to accomplish a whole variety of computation kinds hiding behind arbitrary languages.

### 2.1. syntax

In computer science, the [syntax](https://en.wikipedia.org/wiki/Syntax_(programming_languages)) of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language.

[Formal grammar](https://en.wikipedia.org/wiki/Formal_grammar) of *Canon* may be represented by the following, relaxed kind of [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) notation:

        <start> := <fore-mtch>
                 | <back-mtch>

     <fwd-mtch> := (MATCH <id>+ <fwd-rule>)
                 | <fwd-rule>
    
     <bck-mtch> := (MATCH <id>+ <bck-rule>)
                 | <bck-rule>

           <id> := (ID <ELEM-TERM> <COMP-TERM>)

     <fwd-rule> := (RULE (BACK <fwd-mtch>*) (CHAIN <bck-mtch>*)? (FORE <bck-mtch>*))
                 | <COMP-TERM>

     <bck-rule> := (RULE (FORE <bck-mtch>*) (CHAIN <bck-mtch>*)? (BACK <fwd-mtch>*))
                 | <COMP-TERM>

To interpret these grammar rules, we use special symbols: `<...>` for noting identifiers, `... := ...` for expressing assignment, `...+` for one ore more occurences, `...*` for zero or more occurences, `...?` for optional single occurence, and `... | ...` for alternation between expressions. All other symbols are considered as parts of the *Canon* language.

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to readers, and may be placed wherever a whitespace is expected. Single line comments are introduced by `//`, and reach until the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

Note that the above grammar merely indicates existence of `<ELEM-TERM>` (elementary terms) and `<COMP-TERM>` (composite terms), which we will have a chance to examine thorougly in the semantics section.

A rule, being forward (`fwd-rule`) or backward (`bck-rule`) rule, is imaginary depicted by an arrow pointing from `BACK` parameter to `FORE` parameter. As `BACK` and `FORE` parameters may flip their places in different rules, the arrow may point to the right in cases of forward rules, or to the left in cases of backward rules. We may use the direction of such arrows as a mnemonic for tracking a direction of term rewriting flow in *Canon*.

Further, a `BACK` parameter list represents a logical conjunction. Such conjunction can host only plain terms and forward rules, while empty `BACK` list stands for `TOP` element. If forward rules are present in `BACK` list, they are used as a base for deduction. The deduction output is then interpreted as corresponding parent rule input. Each `BACK` parameter is required to hold at least one plain term.

Conversely, a `FORE` parameter list represents a logical disjunction. Such disjunction can host only plain terms and backward rules, while empty `FORE` list stands for `BOT` element. If backward rules are present in `FORE` list, they are used as a base for abduction. The abduction output is then interpreted as corresponding parent rule output. Each `FORE` parameter is required to hold at least one plain term.

`CHAIN` parameter list may or may not be present in forward and backward rules. If `CHAIN` parameter is not present, it is assumed that `FORE` parameter list immediately follows from `BACK` parameter list. If `CHAIN` parameter is present, it is required that its contained rules provably link `FORE` list with `BACK` list. `CHAIN` parameter list always resembles the similar appearance and behavior like `FORE` one, regardless of whether it belongs to the forward or backward rule. The only difference is that `CHAIN` list isn't required to hold at least one plain term, yet it may be consisted only of backward rules.

In *Canon* there is no additional type checking, meaning that every expression valid in the above grammar is also valid in *Canon*. However, we may form *Canon* valid constructions that regardless of input never return a successful response. Such cases are not indicated by *Canon* because they may already fall into category of theoretically undecidabile proof constructions. For more information about this undecidability, interested reders may examine [Gödel's incompleteness theorems](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems) and [halting problem](https://en.wikipedia.org/wiki/Halting_problem).

### 2.2. semantics

[Semantics](https://en.wikipedia.org/wiki/Semantics) is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to interpretation of syntactically correct expression. To know what an expression means, it is enough to know how to translate the expression to a form that is already understood by a target environment. Semantics of *Canon* deals with such translations at metalevel.

The current section covers *Canon* specific implementation of rule structuring and appearance of terms over which the rules operate. Firstly, we will introduce the semantic rhombus mnemonic diagram for interpreting *Canon* rules. Next, we will overview *Canon* inference process in detail on a few simple but representative examples that may be extrapolated to describe a variety of different systems. Lastly, we will summarize what we have learned in this section.

#### 2.2.1. semantic rhombus

Semantics of *Canon* is contained within composing two kinds of rules: forward and backward rules. Composition of these rules may be described by a vertically split rhombus diagram representing a complex forward rule as a whole on the left, and a complex backward rule as a whole on the right side. Complex rules consist of other complex or simple rules. Simple rules are made of two sides (vertically) simply linked without any internal structure.

     ----------------------------------   ---------------------------------- 
    |                                  | |                                  |
    |     ||                      BACK | | FORE                      /\     |
    |     ||                           | |                          //\\    |
    |     ||                          /| |\                        //||\\   |
    |     ||                        / \| |/ \                        ||     |
    |     ||                      / \ /| |\ / \                      ||     |
    |     ||                    / \ / \| |/ \ / \                    ||     |
    |     ||                  /        | |        \                  ||     |
    |     ||                /  FORWARD | | BACKWARD \              B ||     |
    |     || F            /      RULES | | RULES      \            A ||     |
    |   D || O          /              | |              \          C || A   |
    |   E || R        / \ / \ / \ / \ /| |\ / \ / \ / \ / \        K || B   |
    |   D || W      / \ / \ / \ / \ / \| |/ \ / \ / \ / \ / \      W || D   |
    |   U || A    /                    | |                    \    A || U   |
    |   C || R    chain BACKWARD RULES | | chain BACKWARD RULES    R || C   |
    |   T || D    \                    | |                    /    D || T   |
    |   I ||        \ / \ / \ / \ / \ /| |\ / \ / \ / \ / \ /        || I   |
    |   O || R        \ / \ / \ / \ / \| |/ \ / \ / \ / \ /        R || O   |
    |   N || U          \              | |              /          U || N   |
    |     || L            \   BACKWARD | | FORWARD    /            L ||     |
    |     || E              \    RULES | | RULES    /              E ||     |
    |     ||                  \        | |        /                  ||     |
    |     ||                    \ / \ /| |\ / \ /                    ||     |
    |     ||                      \ / \| |/ \ /                      ||     |
    |     ||                        \ /| |\ /                        ||     |
    |   \\||//                        \| |/                          ||     |
    |    \\//                          | |                           ||     |
    |     \/                      FORE | | BACK                      ||     |
    |                                  | |                                  |
     ----------------------------------   ----------------------------------

The left side of the rhombus depicts complex forward rule. It is containing arranged `forward rules`, `chain backward rules`, and `backward rules`. The same side of the rhombus is diverging branches from `BACK` node downwards, in a direction of forward rule, forming the initial deduction tree. The same side of the rhombus is also diverging branches from `FORE` node upwards, in a direction of backward rule, forming the opposed abduction tree. The deduction and abduction branchings of the left side are required to be linked by the middle area of `chain backward rules`, thus forming a complete inference system from `BACK` node to `FORE` node.

The right side of the rhombus depicts complex backward rule. It is similar to the left side, only flipped upside-down.

Describing both sides of rhombus, related to an arbitrary system it is describing, the rhombus is entirely consisted of directed production rules linking `BACK` and `FORE` placeholders. When interpreting the rhombus on a specific example, we provide an input as a string expression. The task is to extract the output string expression. As the first step, we verify if the input deduces from `BACK` placeholder in a process called forward chaining, using provided `forward rules`. If the deduction is successful, the input is further developed by `chain backward rules` and intersected by abduction from `FORE` placeholder in a process called backward chaining, using provided `backward rules`. If the intersection is successful, appropriate output is extracted from the abduction tree, conforming only `backward rules`. There may be many valid parallel output candidates, but we choose the deepest one from the first available backward link to `FORE` placeholder.

Observing the inference process from the inside, the explained procedure is a combination of forward and backward chaining processes. Observing from the outside as a whole, the entire procedure is called forward chaining. It answers the question: "If the input is X, what is an output of the system?" However, observing from the outside, one may also be interested in backward chaining, answering questions like: "What should be an input if the output of the system is Y?" Utilizing directed production rules, the procedure for obtaining answers to the later question is similar to the procedure for obtaining answers to the former question. The only difference would be that we have to read all the rules in the opposite direction in the same procedure of inferring the answer. Symmetrical treatment of forward and backward rules ensures possibility to use the same algorithm in both cases.

Because *Canon* systems operate on sequences of characters, we can interpret forward and backward rules in a sense of incoming and outgoing syntax rules while interpreting chaining rules in a sense of semantic connections between input and output language. This is what makes *Canon* suitable for representing a variety of languages based on production rules.

#### 2.2.2. tutorial examples

Dry theoretical explanations may seem strange while reading them for the first time. That is why we prepared a few characteristic examples in this section, ranging from the simplest one inputting `hello machine` and outputting `hello world`, to gradually more complex ones involving even nondeterministic reasoning. Here, we will learn how to simply input and output strings, how to use elementary and composite terms, how pattern matching works, and lastly, we will scratch the surface of nondeterministic reasoning. Hopefully, we will gather enough knowledge to grapple with concrete examples in section [[3. practical examples](#3-practical-examples)].

##### simple input/output example

Typical "hello world" example in *Canon* would look like this:

    /*
        simple input/output example
        
        input: `hello machine`
        output: `hello world`
    */

    (RULE (BACK <hello machine>) (FORE <hello world>))

The example simply inputs a string `hello machine`, and outputs the string `hello world`.

##### elementary terms

Terms are records enclosed between `<` and `>` symbols. They are asserted in rules incoming and outgoing placeholders. we destinct between elementary and composite terms, regarding to their internal structure.

The simplest form of terms is elementary term form. Elementary term is a record encosed between a single pair of `<` and `>` symbols, not containing other terms within.

The following example uses only elementary terms:

    /*
        conversation example
        
        input: `hi computer / isn't the world beautiful / bye computer`
        output: `hello entity / yes, it is / goodbye entity`
    */
    
    (
        RULE
        (
            BACK
            (
                RULE 
                (BACK)
                (
                    FORE
                    <hi computer>
                    <isn't the world beautiful>
                    <bye computer>
                )
            )
        )
        (
            CHAIN
            (RULE (FORE               <hi computer>) (BACK <hello entity>  ))
            (RULE (FORE <isn't the world beautiful>) (BACK <yes, it is>    ))
            (RULE (FORE              <bye computer>) (BACK <goodbye entity>))
        )
        (
            FORE
            (
                RULE 
                (
                    FORE
                    <hello entity>
                    <yes, it is>
                    <goodbye entity>
                )
                (BACK)
            )
        )
    )
    
This example describes a simple process of pairing input to output expressions. Observing the system it describes, passing the input: `hi computer`, the output: `hello entity` is produced; passing the input: `isn't the world beautiful`, the output: `yes, it is` is produced; passing the input: `bye computer`, the output `goodbye entity` is produced; passing any other input generates a syntax error.

Notice the empty `BACK` parameter list in side incoming and outgoing rules. As alredy noted, empty `BACK` parameter list stands for `TOP` type, an analog to `truth` constant in logic. A rule with empty `BACK` list is considered as starting/finishing point in incoming/outgoing sections. All other rules ought to be interlinked between these empty `BACK` lists.

##### composite terms and term alternations

Composite terms are consisted of more than one elementary terms, each enclosed within its own `<` and `>` symbols pair. For example, `<It's a <adjective> day>` is a composite term embracing `<adjective>` elementary term. Another example of composite term may be `<<noun> is <adjective>>` containing `<noun>` and `<adjective>` elementary terms. We may nest composite and elementary terms within composite terms in any count and depth we want, but in the most cases, one or two levels should be enough to harness the purpose of composite terms.

Let's examine the following example to understand the purpose of composite terms:

    /*
        toy making decision
        
        input: `a girl/boy is good`
        output: `Nick makes a toy doll/car`
    */
    
    (
        RULE
        (
            BACK
            (RULE (BACK        ) (FORE <a <child> is good>))
            (RULE (BACK <child>) (FORE <girl> <boy>       ))
        )
        (
            CHAIN
            (RULE (FORE <a <girl> is good>) (BACK <Nick makes a <toy doll>>))
            (RULE (FORE  <a <boy> is good>) (BACK <Nick makes a <toy car>> ))
        )
        (
            FORE
            (RULE (FORE <toy doll> <toy car>) (BACK <toy>))
            (RULE (FORE <Nick makes a <toy>>) (BACK      ))
        )
    )

In the topmost `BACK` section, we can see how we paired `<child>` with `<girl>` and `<boy>` terms. This means that `<a <child> is good>` term can be substituted for `<a <girl> is good>` or `<a <boy> is good>`. This is called term rewriting. To get more informed about term rewriting, or specifically in this case about context free grammars, interested readers are invited to study [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy) of formal languages.

Continuing with examining the example, what is happening in the topmost `FORE` section? It indirectly recognizes `<Nick makes a <toy doll>>` or `<Nick makes a <toy car>>` using the symmetric mechanism to the one we encountered in input section. But to be sure that Nick doesn't make a toy car for a girl, or a toy doll for a boy, we use the correct pairing in the chaining section.

> __*[note card]*__  
> In the `RULE` section, between incoming, chaining, and outgoing sections, there exists a peculiar model of rule interaction. Rules from incoming section may interact with reversed rules from outgoing section, and vice versa. Similarly, rules from chaining section may interact with reversed rules from incoming and outgoing sections. At last, rules from incoming and outgoing sections do not have an access to rules from chaining section. We choose this rule interaction model because it has some positive properties regarding to forward and backward chaining. Although it may seem a bit unusual, nevertheless, because there may exist a frequent need for reaching noted kinds of rules within noted sections, this interaction model deliberates us from unnecessary duplicating exact or reversed definitions of the rules.

Still, the whole *Canon* system may seem like a bit of an overkill for this example also, but let's hope the next section will justify all the trouble with rules complexity.

##### pattern matching

To get a feeling what pattern matching is all about, let's examine the following example:

    /*
        job title decision
        
        input: `Jane/John drives rocket / heals people`
        output: `astronaut/doctor Jane/John`
    */
    
    (
        RULE
        (
            BACK
            (RULE (BACK         ) (FORE <<person> <job>>              ))
            (RULE (BACK <person>) (FORE <Jane> <John>                 ))
            (RULE (BACK    <job>) (FORE <drives rocket> <heals people>))
        )
        (
            CHAIN
            (
                MATCH
                (ID <P> <person>)
                (RULE (FORE <<P> <drives rocket>>) (BACK <<astronaut> <P>>))
            )
            (
                MATCH
                (ID <P> <person>)
                (RULE (FORE <<P> <heals people>>) (BACK <<doctor> <P>>))
            )
        )
        (
            RULE
            (RULE (FORE <astronaut> <doctor>) (BACK <title> ))
            (RULE (FORE        <Jane> <John>) (BACK <person>))
            (RULE (FORE   <<title> <person>>) (BACK         ))
        )
    )

The input expectedly takes a person's name (`Jane` or `John`) and a person's job (`drives rocket` or `heals people`). The output is a titled person (`astronaut` or `doctor`).

The chaining section is where all the fun is happening. We are assigning the correct title to the unknown person `<P>`, depending only on her/his job. If the person drives a rocket, (s)he is an astronaut, and if the person heals people, (s)he is a doctor. Rules of the form:

    (
        MATCH
        (ID <...identifier...> <...type...>)
        (RULE ...)
    )
    
serve to assign a type range to an identifier, and more importantly, to mark the identifier equal within incoming and outgoing terms. In the previous example we have two such rules, one for each job. Naturally, there may be examples with more than one identifier, accordingly adding a new `(ID ...)` expression for each identifier under the `(MATCH ...)` expression. The same identifier may also be used multiple times at the same side of a rule when all the instances of the identifier are required to match exactly the same expression.

##### nondeterministic disjunction

As an example of nondeterministic disjunctions, we bring the following example:

    /*
        student decision
        
        input: `Jane/John is being educated`
        output `Jane/John is a student`
    */
    
    (
        RULE
        (
            BACK
            (RULE (BACK         ) (FORE <<person> is being educated>))
            (RULE (BACK <person>) (FORE <Jane> <John>               ))
        )
        (
            CHAIN
            (
                MATCH
                (ID <P> <person>)
                (RULE (FORE <<P> is being educated>) (BACK <<P> attends school>))
            )
            (
                MATCH
                (ID <P> <person>)
                (RULE (FORE <<P> is being educated>) (BACK <<P> attends college>))
            )
            (
                MATCH
                (ID <P> <person>)
                (RULE (FORE <<P> attends school> <<P> attends college>) (BACK <<P> is a student>))
            )
        )
        (
            FORE
            (RULE (FORE           <jane> <john>) (BACK <person>))
            (RULE (FORE <<person> is a student>) (BACK         ))
        )
    )

Within this example, passing an input `John is being educated` would finally yield the output `John is a student`. It takes a bit of logical speculation to understand how this input manages to climb up the inference branches in connecting empty `BACK` lists. Namely, expressions like `(A -> C) /\ (B -> C)` are equal to `(A \/ B) -> C`. This fact provides a fundamental reasoning for connecting the empty `BACK` lists in the above case.

> __*[note card]*__  
> remember that `FORE` parameter always holds disjunctions.

Following this philosophy, there are three rules in the `CHAIN` rule list. The first two rules match against the third rule, successfully connecting incoming and outgoing terms.

Athough we could get away without this feature while still keeping *Canon* Turing complete, we hold that the noted feature simplifies logical reasoning in many cases, so we choose it to be a standard part of *Canon* system.

##### nondeterministic conjunction

As an example of nondeterministic conjunctions, we bring the following example:

    /*
        computer expert decision
        
        input: `Jane/John builds a robot`
        output: `Jane/john is a computer expert`
    */
    
    (
        RULE
        (
            BACK
            (RULE (BACK         ) (FORE <<person> builds a robot>))
            (RULE (BACK <person>) (FORE <Jane> <John>            ))
        )
        (
            CHAIN
            (
                MATCH
                (ID <P> <person>)
                (RULE (FORE <<P> builds a robot>) (BACK <<P> masters software> <<P> masters hardware>)
            )
            (
                MATCH
                (ID <P> <person>)
                (RULE (FORE <<P> masters software>) (BACK <<P> is a computer expert>))
            )
            (
                MATCH
                (ID <P> <person>)
                (RULE (FORE <<P> masters hardware>) (BACK <<P> is a computer expert>))
            )
        )
        (
            FORE
            (RULE (FORE                   <jane> <john>) (BACK <person>))
            (RULE (FORE <<person> is a computer expert>) (BACK         ))
        )
    )

Within this example, passing an input `Jane builds a robot` would finally yield the output `Jane is a computer expert`. Again, it takes a bit of logical speculation to understand how this input manages to climb up the inference branches in connecting empty `BACK` lists. Namely, expressions like `(C -> A) /\ (C -> B)` are equal to `C -> (A /\ B)`. This fact provides a fundamental reasoning for connecting the empty `BACK` lists in the above case.

> __*[note card]*__  
> remember that `BACK` parameter always holds conjunctions.

Following this philosophy, there are three rules in the `CHAIN` rule list. The first rule matches against the other two rules, successfully connecting incoming and outgoing terms.

Athough we could get away without this feature while still keeping *Canon* Turing complete, we hold that the noted feature simplifies logical reasoning in many cases, so we choose it to be a standard part of *Canon* system.

#### 2.2.3. summary

Resuming all learned by now, all of the above examples may seem like a very basic insight into the *Canon* essence, but these kinds of formations are really all we need to express all the computational range promised in the introduction section of this exposure. With what we learned by now about *Canon*, we are able to transcribe *any* input form to *any* output form, no matter of how interlinked they may be. This is sometimes referred to as Turing completeness.

With this section, we are concluding theoretical *Canon* exposure. A few more or less advanced examples showing *Canon* in all its shine, for better or for worse, are covered in the section: [3. practical examples](#3-practical-examples).

## 3. practical examples

In this section we bring three illustrative examples using only constructs learned in section [2. theoretical background](#2-theoretical-background). We will see how to express (1) entscheidungsmaschine, (2) untyped lambda calculus, and (3) Turing machines. The choice of examples is represenative for showing how *Canon* handles different formal systems. The choice of examples is also representative for showing the universality of problem range on which *Canon* can provide a solution.

### 3.1. logic programming

In mathematics and computer science, the [Entscheidungsproblem](https://en.wikipedia.org/wiki/Entscheidungsproblem) is a challenge posed by David Hilbert and Wilhelm Ackermann in 1928. The problem asks for an algorithm that considers, as input, a statement and answers "Yes" or "No" according to whether the statement is universally valid, i.e., valid in every structure satisfying the axioms (see [validity](https://en.wikipedia.org/wiki/Validity_(logic)#Valid_formula)).

Although entscheidungsproblem is generally undecidable, there exist a subset of logic on which entschedungsproblem can be solved: propositional logic. [Propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus) is a branch of logic that deals with propositions (which can be true or false) and relations between propositions, including the construction of arguments based on them. Compound propositions are formed by connecting propositions by logical connectives. Unlike first-order logic, propositional logic does not deal with non-logical objects, predicates about them, or quantifiers. However, all the machinery of propositional logic is included in first-order logic and higher-order logics. In this sense, propositional logic is the foundation of first-order logic and higher-order logic.

In this section we bring a solution to enscheidungsproblem for [implicational propositional logic](https://en.wikipedia.org/wiki/Implicational_propositional_calculus). Since propositional logic can be reduced to implicational propositional logic, we consider that the solution holds for propositional logic, as well.

    /*
        enscheidungsproblem for implicational propositional logic
        
        input: tatology
        output: the same input tautology if the input is successful
    */
    
    (
        RULE
        (
            BACK
            
            // axioms
            (
                MATCH
                (ID <a> <formula>) (ID <b> <formula>)
                <<a> → <<b> → <a>>>
            )
            (
                MATCH
                (ID <a> <formula>) (ID <b> <formula>) (ID <c> <formula>)
                <<<a> → <<b> → <c>>> → <<<a> → <b>> → <<a> → <c>>>>
            )
            (
                MATCH
                (ID <a> <formula>) (ID <b> <formula>)
                <<<<a> → <b>> → <a>> → <a>>
            )
            
            // modus ponens
            (            
                MATCH
                (ID <a> <formula>) (ID <b> <formula>)
                (RULE (BACK <<a> → <b>> <a>) (FORE <b>))
            )

            // formula formation
            (RULE (BACK <formula>) (FORE <<formula> → <formula>>))
            (RULE (BACK <formula>) (FORE <atom>))
            (RULE (BACK <atom>) (FORE <⊥>))
            (RULE (BACK <atom>) (FORE <a>))
            ...
            (RULE (BACK <atom>) (FORE <z>))
            
            // normalization braces
            (            
                MATCH
                (ID <a> <formula>)
                (RULE (BACK <a>) (FORE <(<a>)>))
            )
        )
        (
            FORE
            <formula>
        )
    )

We put the three implicational logic axioms as the input top expressions, from which we may branch out to every other tautology that holds in propositional logic. Thus, the example accepts only implicational logic tautologies, reporting an error otherwise, which is analogous to what entscheidungsproblem asks to be solved. In the case of correct input, the output is exact copy of input.

### 3.2. functional programming

[Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) (also written as λ-calculus) is a formal system in mathematical logic for expressing computation based on function [abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science)) and [application](https://en.wikipedia.org/wiki/Function_application) using variable binding and substitution. It is very simple, but very powerful system. Its typed version has found a way to be an inspiration for many [functional programming languages](https://en.wikipedia.org/wiki/Functional_programming). In this section we bring untyped version of lambda calculus.

Syntax of lambda calculus is surprisingly simple considering its computational power. A lambda term is one or a combination of the following:

- *variable in a form of:* `x`
- *abstraction in a form of:* `λx.M` (where `x` is a variable; `M` is a lambda term)
- *application in a form of:* `(M N)` (where `M` and `N` are lambda terms)

Semantics of lambda calculus, written in a relaxed language, include

- *α-conversion:* `(λx.M) -> (λy.M[x:=y])`
- *β-reduction:* `((λx.M) N) -> (M[x:=N])`

*α-conversion* is renaming of variables used to avoid [name collisions](https://en.wikipedia.org/wiki/Name_collision). *β-reduction* is actual operation carying process of replacing bound variables with the argument expression in the body of the abstraction. Entire computation of a lambda expression is performed using only *α-conversion* and *β-reduction*: rules. This process relates to applying function parameters to functions, yieldig results which may again be consisted of parameters-to-function application, until we reach atomic expressions that we choose to interpret not by lambda calculus itself, but by a previously determined target environment.

This is a very scanty insight into the lambda calculus, while a broader insight may be obtained in exploring examples of various lambda expressions exclusively based on the above formalism. To acquire details, interested readers are invited to search the web for necessary information.

The following example inputs a lambda expression and ouputs its evaluated form. The essence of the process is in two composite rules that operate under certain assumptions. Compare alpha conversion rule and beta reduction rule to the above definition of these processes.

    /*
        untyped lambda calculus example
        
        input: lambda expression
        output: evaluated lambda expression
    */

    (
        RULE
        (
            BACK
            
            // syntax of lambda calculus
            (RULE (BACK        ) (FORE <lterm>                 ))
            (RULE (BACK <lterm>) (FORE <abst>                  ))
            (RULE (BACK  <abst>) (FORE <(λ<var>.<abst>)> <appl>))
            (RULE (BACK  <appl>) (FORE <(<appl> <var>)>        ))
            (RULE (BACK   <var>) (FORE <<symbol><var>> <symbol>))

            (RULE (BACK <symbol>) (FORE <a> <b> ... <z>        ))
        )
        (
            CHAIN
            
            // alpha conversion
            (
                MATCH
                (ID <X> <var>) (ID <Y> <var>) (ID <M> <lterm>)
                (
                    RULE
                    (
                        FORE
                        <(λ<X>.<M>)>
                    )
                    (
                        CHAIN
                        (RULE (FORE <(λ<X>.<M>)>) (BACK <(<aconv <Y> <M>)>))
                        (RULE (FORE          <X>) (BACK <Y>               ))
                    )
                    (
                        BACK
                        <(<aconv <Y> <M>)>
                    )
                )
            )
            
            // beta reduction
            (
                MATCH
                (ID <X> <var>) (ID <M> <lterm>) (ID <N> <lterm>)
                (
                    RULE
                    (
                        FORE
                        <((<aconv <X> <M>>) <N>)>
                    )
                    (
                        CHAIN
                        (RULE (FORE <((<aconv <X> <M>>) <N>)>) (BACK <M>))
                        (RULE (FORE                       <X>) (BACK <N>))
                    )
                    (
                        BACK
                        <M>
                    )
                )
            )
        )
        (
            FORE
            <lterm>
        )
    )

This example evaluates lambda expressions, and as such, accepts inputs like `((λx.(x x)) ((λx.(x x)) a))`, in which case it yields the output like `((a a) (a a))`.

### 3.3. automata programming

[Automata theory](https://en.wikipedia.org/wiki/Automata_theory) is the study of abstract machines and automata, as well as the computational problems that can be solved using them. It is a theory in theoretical computer science. The word automata (the plural of automaton) comes from the Greek word αὐτόματος, which means "self-acting, self-willed, self-moving". An automaton (Automata in plural) is an abstract self-propelled computing device which follows a predetermined sequence of operations automatically.

A [Turing machine](https://en.wikipedia.org/wiki/Turing_machine) is an automata and mathematical model of computation that defines an abstract machine, which manipulates symbols on a strip of tape according to a table of rules. Despite the model's simplicity, given any computer algorithm, a Turing machine capable of simulating that algorithm's logic can be constructed.

The machine operates on an infinite memory tape divided into discrete *cells*. The machine has its *head* that positions over a single cell and can read or write a symbol to the cell. The machine keeps a track of its current *state* from a finite set of states. Finally, the machine has a finite set of *instructions* which direct reading symbols, writing symbols, changing the current machine state and moving the tape to the left or to the right. Each instruction consists of the following:

1. reading the current state and reading a symbol at the position of head
2. depending on (1.), writing a symbol at the position of head
3. either move the tape one cell left or right and changing the current state

The machine repeats these steps until it encounters the halting instruction.

Turing machine defined in *Canon* terms takes this form:

    /*
        general Turing machine example
        
         input: a set of instructions and a starting tape states
        output: final tape states
    */
    
    (
        RULE
        (
            BACK
            
            // input expression
            (RULE (BACK) (FORE <(<instrseq>): (<tape>)>))
            
            // instructions syntax
            (RULE (BACK  <instrSeq>) (FORE <<instr>, <instrSeq>> <instr>      ))
            (RULE (BACK     <instr>) (FORE <<head> to <bit><direction><state>>))
            (RULE (BACK      <head>) (FORE <<state><bit>>                     ))
            (RULE (BACK <direction>) (FORE <L> <R>                            ))
            (RULE (BACK     <state>) (FORE <a#> <b#> ... <z#>                 ))
            (RULE (BACK       <bit>) (FORE <0> <1> <()>                       ))
            
            // tape syntax
            (RULE (BACK <tape>) (FORE <<cell><tape>> <cell>))
            (RULE (BACK <cell>) (FORE <bit> <head>         ))
        )
        (
            CHAIN
            
            // extract each instructions
            (
                MATCH
                (ID <i> <instr>   )
                (ID <s> <instrSeq>)
                (ID <t> <tape>    )
                (
                    RULE
                    (
                        FORE
                        <(<s>): (<t>)>
                    )
                    (
                        CHAIN
                        (RULE (FORE      <(<i>): (<t>)>) (BACK <instruction <i>>))
                        (RULE (FORE <(<i>, <s>): (<t>)>) (BACK <instruction <i>>))
                        (RULE (FORE <(<i>, <s>): (<t>)>) (BACK <(<s>): (<t>)>   ))
                    )
                    (
                        BACK
                        <instruction <i>>
                    )
                )
            )
            
            // apply instructions to tape segments
            (
                MATCH
                (ID <preb> <bit>  )
                (ID <pres> <state>)
                (ID <sufb> <bit>  )
                (ID <sufs> <state>)
                (ID <newb> <bit>  )
                (ID <news> <state>)
                (ID    <t> <tape> )
                (
                    RULE
                    (
                        FORE
                        <tape>
                    )
                    (
                        CHAIN
                        
                        // changing bit and state, moving head to the right
                        (
                            RULE
                            (FORE <instruction <<pres><preb> to <newb>R<news>>> <<<pres><preb>><<sufb><t>>>)
                            (BACK <<newb><<<news><sufb>><t>>>                                              )
                        )
                        
                        // changing bit and state, moving head to the left
                        (
                            RULE
                            (FORE <instruction <<sufs><sufb> to <newb>L<news>>> <<preb><<<sufs><sufb>><t>>>)
                            (BACK <<<news><preb>><<newb><t>>>                                              )
                        )
                    )
                    (
                        BACK
                        <tape>
                    )
                )
            )
            
            // stop operations after halting instruction and accepting output
            (
                MATCH
                (ID <c> <cell>) (ID <t> <tape>)
                (RULE (FORE <<<h#><c>><t>>) (BACK <<c><t>>))
            )
        )
        (
            FORE
            
            // tape syntax
            (RULE (FORE          <()> <0> <1>) (BACK <cell>))
            (RULE (FORE <cell> <<cell><tape>>) (BACK <tape>))

            (RULE (FORE <tape>) (BACK))
        )
    )

An input to the above example could be an an instruction set for adding 1 to a specified binary number:

    (s#0 to 0Rs#, s#1 to 1Rs#, s#() to ()La#, a#1 to 0La#, a#0 to 1Rf#, f#0 to 0Rf#, f#1 to 1Rf#, f#() to ()Rh#): (()s#1001())

Here we have a set of instructions (state abbreviations are: `s#` for start, `a#` for add one, `f#` for finish, and  `h#` for halt), and a binary number `1001` prepended and postpended by `()` to indicate tape bounds. After processing, the example should expectedly output:

    ()1010()

The above example processes input in a single cycle. It is also possible to construct multi-cycle automata that allows to successively input more data as the process goes on. That kind of automata would exhange its states between cycles by feeding output back to input, along additional data, on each cycle.

It is common knowledge that Turing machine is taken as the most general kind of automata able to process any kind of input, and able to produce any kind of output. Thus, by implementing Turing machine in terms of *Canon*, we are showing that any other kind of automata ([finite state machines](https://en.wikipedia.org/wiki/Finite-state_machine), [pushdown automata](https://en.wikipedia.org/wiki/Pushdown_automaton), ...) can also be implemented within *Canon*.

## 4. related work

*Canon* is a metaprogramming formalization in the guise of rule-based programming system. There exist a lot of systems in both metaprogramming and rule-based programming field. Rather than thoroughly elaborating similarities and differences between *Canon* and each such system known to us, we bring hyperlinks to brief descriptions of selected languages from both fields, arranged in alphabetical order:

- [Metaprogramming languages](https://en.wikipedia.org/wiki/List_of_programming_languages_by_type#Metaprogramming_languages)
    - [META II](https://en.wikipedia.org/wiki/META_II)
    - [OMeta](https://en.wikipedia.org/wiki/OMeta)
    - [TREE META](https://en.wikipedia.org/wiki/TREE-META)
    
- [Rule-based languages](https://en.wikipedia.org/wiki/List_of_programming_languages_by_type#Rule-based_languages)
    - [Constraint Handling Rules](https://en.wikipedia.org/wiki/Constraint_Handling_Rules)
    - [Drools](https://en.wikipedia.org/wiki/Drools)
    - [GOAL agent programming language](https://en.wikipedia.org/wiki/GOAL_agent_programming_language)
    - [Jess](https://en.wikipedia.org/wiki/Jess_(programming_language))
    - [Prolog](https://en.wikipedia.org/wiki/Prolog)
    - [XSLT](https://en.wikipedia.org/wiki/XSLT)

## 5. conclusion

The most generally speaking, *Canon* may be used to express a wide variety of languages. Different languages may be used to express a wide variety of systems. Different systems, in turn may be used to express a wide variety of processes we experience around us. Being natural or artificial, many of these processes may deserve our attention while understanding and mastering them may be of certain importance to us. What will *Canon* represent, and where it will be used depends only on our imagination because with a kind of system like *Canon*, we are entering a nonexhaustive area of general knowledge computing where only our imagination could be a limit.

    // under construction //
