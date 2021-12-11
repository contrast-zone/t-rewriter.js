# introduction to intermezzo programming

    // under construction //

> __*[Intended audience]*__  
> *Beginners in language parsing, term rewriting, and logic deduction*

> __*[Short description]*__  
> As an embodiment of general problem solving strategy related to [term rewriting](https://en.wikipedia.org/wiki/Rewriting), *Intermezzo* aims to be a host for a variety of kinds of [formal languages](https://en.wikipedia.org/wiki/Formal_language), exhibiting [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system). For each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) in a [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm. Having clearly defined communication input and output forms, *Intermezzo* performs transition from input to output by additionally defining possibly [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) set of chaining [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)). Input-chain-output sort of arrangement also sheds light on *Intermezzo* from an angle of [systems](https://en.wikipedia.org/wiki/System) theory, thus broadening a possible range of use cases.

> __*[References]*__  
> *[Wikipedia web site](https://en.wikipedia.org)*

## table of contents

- [x] [1. introduction](#1-introduction)
- [x] [2. theoretical background](#2-theoretical-background)
    - [x] [2.1. syntax](#21-syntax)
    - [x] [2.2. semantics](#22-semantics)
        - [x] [2.2.1. composite rules](#221-composite-rules)
        - [x] [2.2.2. elementary rules](#222-elementary-rules)
        - [x] [2.2.3. deep composite rules](#223-deep-composite-rules)
- [x] [3. practical examples](#3-practical-examples)
    - [x] [3.1. automata programming](#31-automata-programming)
    - [x] [3.2. functional programming](#32-functional-programming)
    - [x] [3.3. logic programming](#33-logic-programming)
- [x] [4. related work](#4-related-work)
- [x] [5. conclusion](#5-conclusion)

## 1. introduction

Formal languages are usually considered as formations dedicated to accomplishing diverse tasks. *Intermezzo* is also a language, and it is an implementation of a [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system) that aims to be a host for a variety of kinds of other formal languages. By its design, *Intermezzo* represents an embodiment of a general problem solving strategy related to [term rewriting](https://en.wikipedia.org/wiki/Rewriting), being able to support a diversity of hosted languages intentions and purposes.

Seeing *Intermezzo* as a programming language that operates on other formal languages, it provides a particular form of data computation: for each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) operating on specific forms of data (input), yielding specific forms of computation results (output). To that extent, *Intermezzo* also represents a language implementing [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm.

[Production rules](https://en.wikipedia.org/wiki/Production_(computer_science)), as *Intermezzo* constituents, mediate between source and target expressions. Appearance of source and target expressions is defined by custom input and output syntax production rules. These rules are then complemented by custom semantic production rules, rendering the [production system](https://en.wikipedia.org/wiki/Production_system_(computer_science)) capable of translating between input and output expressions. Translating mechanism in a case of *Intermezzo* has important property of being [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), which means we can construct *any* output from *any* input, potentially supporting *any* kind of meaningful computation process known to us.

Shedding light from another angle, a [system](https://en.wikipedia.org/wiki/System) is a group of interacting or interrelated elements that act according to a set of rules to form a unified whole. When googling examples of a system, we may find that an example of a system is the way someone organizes their closet. Also, an example of a system is all the organs that work together for digestion. A set or arrangement of things so related or connected as to form a unity or organic whole. Other examples may include a solar system, school system, system of highways. An important conceptual asset of each system is existence of input and output between system and its surroundings. Systems, having clearly defined interdependent input and output, may also be described by sets of *Intermezzo* production rules. Considering its computational completeness, *Intermezzo* does not pose any restrictions on any kinds of systems it may describe. Thus, possible application of *Intermezzo* rulesets reaches even to simulating a wide range of systems we may see around us. This should not be such a surprise since many formal languages intentions are exactly describing behaviors of different system wholes, while siutability choice and universality of such systems may be bound only by our imagination.

## 2. theoretical background

In a good hope of reaching its charted goals, *Intermezzo* tries to follow simple and minimalistic design as long as it doesn't affect its expressiveness in both ease of use, and coverage of possible use cases. Without losing certain structuring capabilities while still keeping very broad expressivity range, we decide to include only: two types of rules - *elementary and composite rules*, two types of terms - *elementary and composite terms*, and two built-in term constants - *top and bottom constants*.

But this minimal setup doesn't mean we are strictly bound to the proposed fewness of *Intermezzo* expressions. Just like we can stack a higher level language layer on top of machine code, we may extend or intentionally restrict *Intermezzo* language as long as our rules produce valid *Intermezzo* expressions. This encourages us to keep *Intermezzo* definition minimalistic, but general enough not to fear that we left out something important.

In this section we are explaining *Intermezzo* rule system syntax and defining how it should behave in practice. Although they may seem simple, basic constructs we will learn about in this section are enough to accomplish a whole variety of computation kinds.

### 2.1. syntax

In computer science, the [syntax](https://en.wikipedia.org/wiki/Syntax_(programming_languages)) of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language.

[Formal grammar](https://en.wikipedia.org/wiki/Formal_grammar) of *Intermezzo* may be represented by the following, relaxed kind of [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) notation:

        <start> := <comp-rule>
        
    <comp-rule> := (COMPOSITE (INPUT <rules>) (CHAIN <rules>) (OUTPUT <rules>))
        
        <rules> := <rule> <rules>
                 | <rule>
                 
         <rule> := <comp-rule>
                 | <elem-rule>
                 | <eqlz-rule>
                 
    <elem-rule> := (ELEMENTARY <input> <output>)
      
        <input> := TOP
                 | <comp-term>
                 
       <output> := <comp-term>
                 | BOT
                 
    <eqlz-rule> := (EQUALIZE (IDENTIFY <domains>) <rule>)
        
      <domains> := <domain> <domains>
                 | <domain>
         
       <domain> := (DOMAIN <elem-term> <comp-term>)

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to humans, and may be placed wherever a whitespace is expected. Single line comments are introduced by `//`, and reach until the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

We introduced three kinds of rules: composite, elementary, and equalize rules. Composite rules operate on sets of rules. In elementary rules, `<input>` and `<output>` may be augmented by `TOP` and `BOT` constants representing entry and exit points of rule inference, respectively. Equalize rules span equally appearing elementary terms (analogous to commonly typed variables in other languages, corroborated by determined domains) in subsumed rules.

Note that the above grammar merely indicates existence of `<elem-term>` (elementary terms) and `<comp-term>` (composite terms), which we will have a chance to examine thorougly in the semantics section. Also note that these two differ from `<elem-rule>` (elementary rules) and `<comp-rule>` (composite rules) that may operate on those terms.

### 2.2. semantics

[Semantics](https://en.wikipedia.org/wiki/Semantics) is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to an interpretation of syntactically correct expression. To know what an expression means, it is enough to know how to translate the expression to a form that is already understood by a target environment. Semantics of *Intermezzo* deals with such translations at metalevel.

Semantics of *Intermezzo* are defined by a rhombus containing `input rules`, `chaining rules`, and `output rules`. The rhombus is diverging branches from `TOP` downwards, in a direction of deduction, forming an initial deduction tree. The rhombus is also diverging branches from `BOT` upwards, in a direction of abduction, forming an opposed abduction tree. The deduction and abduction tree branches are required to meet at the middle area of `chaining rules`, thus forming a complete inference system.

                                     TOP 
                                       
        D ||                         / \                         /\
        E ||                       / \ / \                      //\\
        D ||                     / \ / \ / \                   //||\\
        U ||                   / \ / \ / \ / \                   ||
        C ||                 /                 \                 ||
        T ||                     INPUT RULES                     ||
        I ||             /                         \             ||
        O ||           / \ / \ / \ / \ / \ / \ / \ / \           ||
        N ||         / \ / \ / \ / \ / \ / \ / \ / \ / \         ||
          ||       / \ / \ / \ / \ / \ / \ / \ / \ / \ / \       ||
          ||     /                                         \     ||
          ||                    CHAINING RULES                   ||
          ||     \                                         /     ||
          ||       \ / \ / \ / \ / \ / \ / \ / \ / \ / \ /       ||
          ||         \ / \ / \ / \ / \ / \ / \ / \ / \ /         || A
          ||           \ / \ / \ / \ / \ / \ / \ / \ /           || B
          ||             \                         /             || D
          ||                     OUTPUT RULES                    || U
          ||                 \                 /                 || C
          ||                   \ / \ / \ / \ /                   || T
        \\||//                   \ / \ / \ /                     || I
         \\//                      \ / \ /                       || O
          \/                         \ /                         || N
                                       
                                     BOT

Related to an arbitrary system it is describing, the rhombus is entirely consisted of directed production rules linking `TOP` and `BOT` constants. When interpreting the rhombus on a specific example, we provide an input as a string expression. The task is to extract the output string expression. As the first step, we verify if the input deduces from `TOP` in a process called forward chaining, using provided `input rules`. If the deduction is successful, the input is further developed by `chaining rules` and intersected by abduction from `BOT` in a process called backward chaining, using provided `output rules`. If the intersection is successful, appropriate output is extracted from the abduction tree, conforming only `output rules`. There may be many valid parallel output candidates, but we choose the deepest one from the first available link to `BOT`.

Observing the inference process from the inside, the explained procedure is a combination of forward and backward chaining processes. Observing from the outside as a whole, the entire procedure is called forward chaining. It answers the question: "If the input is X, what is an output of the system?" Nevertheless, observing from the outside, one may also be interested in backward chaining, answering questions like: "What should be an input if the output of the system is Y?" Utilizing production rules, the procedure for obtaining answers to the later questions should be similar to the procedure for obtaining answers to the former questions. The only difference would be that we have to read all the rules backwards in the same procedure of inferring the answer.

Because *Intermezzo* systems operate on sequences of characters, we can interpret input and output rules in a sense of incoming and outgoing syntax rules while interpreting chaining rules in a sense of semantic connections between input and output language. This makes *Intermezzo* suitable for representing a variety of languages based on production rules definitions.

The current section covers *Intermezzo* specific implementation of rule structuring and appearance of terms over which the rules operate. We will overview *Intermezzo* inference process in detail on a few simple but representative examples that may be extrapolated to describe a variety of different systems.

#### 2.2.1. composite rules

There are two kinds of rules in *Intermezzo*: composite and elementary rules. composite rules are consisted of other rules in a strictly defined structure as follows:

    (
        COMPOSITE
        (
            INPUT
            ...input rules...
        )
        (
            CHAIN
            ...chaining rules...
        )
        (
            OUTPUT
            ...output rules...
        )
    )

This structure clearly distincts between input rules, output rules, and rules chaining input to output. Each program in *Intermezzo* is in fact a composite rule. Composite rules do not expose their structure to the outer world. At places where they are inserted, they are treated as black boxes accepting some input and producing some output. As such, they may be used for structuring rule sets into wholes that don't see each others internals, and may use the same names for their internals without worrying about name collisions.

Although we will use some constructs more thoroughly explained a bit later, let's review probably the simplest *Intermezzo* program, a "Hello World" example:

    /*
        "hello world" example
    */
    
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY TOP <>)
        )
        (
            CHAIN
            (ELEMENTARY <> <hello world>)
        )
        (
            OUTPUT
            (ELEMENTARY <hello world> BOT)
        )
    )

In input section, we specify that an empty string is taken by linking it from `TOP` constant. In chaining section, we link the empty string to an output expression. In output section, we specify what the output is by linking it to `BOT` constant. Thus, the whole example finally inputs an empty string and outputs `hello world`.

##### internal rule visibility

In the `COMPOSITE` section, between input, chaining, and output sections, there exists a peculiar model of rule interaction. Rules from input section may interact with reversed rules from output section, and vice versa. Similarly, rules from chaining section may interact with reversed rules from input and output section. At last, rules from input and output sections do not have an access to rules from chaining section. We choose this rule interaction model because it has some positive properties regarding to forward and backward chaining. Although it may seem a bit unusual, nevertheless, because there may exist a frequent need for reaching noted kinds of rules within noted sections, this interaction model deliberates us from unnecessary duplicating exact or reversed definitions of the rules.

An important property of the whole *Intermezzo* system is a symmetry between incoming and outgoing terms evaluated by elementary rules that constitute composite rules. Specifics about this symmetry are discussed in more detail in the following section.

#### 2.2.2. elementary rules

Elementary rules are consisted only of incoming and outgoing terms, and are written as follows:

    (ELEMENTARY <...incoming term...> <...outgoing term...>)

Incoming and outgoing term placeholders are intended to hold either specializing or generalizing terms in a combination depending on the position of the rule in outer structure. Being placed inside input, chaining, or output section of the parent rule, although they all take the similar form, elementary rules are written with intention to either generate, pass through, or recognize flowing data.

##### rule symmetry treatment

Relating to input and output sections, **rules inside input and output sections are treated symmetrically**. In an example of using [context free grammars](https://en.wikipedia.org/wiki/Context-free_grammar) (CFG) to define input and output syntaxes, we differentiate two cases:

- in input sections, CFG **rule heads are placed at incoming term placeholders** while CFG **rule bodies are placed at outgoing term placeholders**
- in output sections, CFG **rule bodies are placed at incoming term placeholders** while CFG **rule heads are placed at outgoing term placeholders**

In *Intermezzo* inference strategy, because extracting specific output from specific input utilizes the combination of internal forward and backward chaining, the correct rule symmetry is very important and ensures the entire inference process consistency.

Relating to chaining sections, **rules placed in chaining sections** are written in a direction where the **incoming placeholders hold connections backwards, to the input generator** utilizing input rules. Further, we can chain more rules together, so that **one rule outgoing placeholder is being linked to other rule incoming placeholder**. Finally, with the logically last rule in such chain, **outgoing placeholders hold connections forwards, to the output recognizer** utilizing output rules.

For use within rules, *Intermezzo* includes two constants: `TOP` and `BOT` (top and bottom). **`TOP` constant may be placed only as incoming term in input section** while **`BOT` constant may be placed only as outgoing term in output section**. Further, **input section is required to contain at least one rule with `TOP` constant** while **output section is required to contain at least one rule with `BOT` constant**. This treatment ensures a required basis for inference engine entry and exit points.

To get familiar with this kind of rule organization, we will examine three simple examples while at the same time explaining complexity kinds of terms and terms interdependence.

##### elementary terms

Terms are records enclosed between `<` and `>` symbols. They are asserted in rules incoming and outgoing placeholders, and they control how the data flows in a cascade between `TOP` and `BOT` constants. The simplest form of terms is elementary term form. Elementary term is a record containig only one pair of `<` and `>` symbols.

The following example uses only elementary terms:

    /*
        conversation example
    */
    
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY TOP <hi computer>              )
            (ELEMENTARY TOP <isn't the world beautiful>)
            (ELEMENTARY TOP <bye computer>             )
        )
        (
            CHAIN
            (ELEMENTARY               <hi computer> <hello entity>  )
            (ELEMENTARY <isn't the world beautiful> <yes, it is>    )
            (ELEMENTARY              <bye computer> <goodbye entity>)
        )
        (
            OUTPUT
            (ELEMENTARY   <hello entity> BOT)
            (ELEMENTARY     <yes, it is> BOT)
            (ELEMENTARY <goodbye entity> BOT)
        )
    )

This example describes a simple process of pairing input to output expressions. Observing the system it describes, passing the input: `hi computer`, the output: `hello entity` is produced; passing the input: `isn't the world beautiful`, the output: `yes, it is` is produced; passing the input: `bye computer`, the output `goodbye entity` is produced; passing any other input generates a syntax error.

To observe the *Intermezzo* symmetry treatment, notice the natural data flow in the example. If we've been intimidated by all the descriptions about data flow and symmetry of expressions, now is the time to let go all the fears. Unless there is an explicit interaction between input, chaining, and output sections, the data flows from left to right, from top to bottom, and that's it. However, if we plan to use the specific interaction, to simplify definitions and avoid duplicating rules, the note about rule reversing from section [2.2.1. composite rules](#internal-rule-visibility) applies.

Moving further with our exposure, although *Intermezzo* system seems like a bit of an overkill for the above simplistic example, let's examine composite terms to see what happens.

##### composite terms

Composite terms are consisted of more than one elementary terms, each enclosed within its own `<` and `>` symbols pair. For example, `<It's a <adjective> day>` is a composite term embracing `<adjective>` elementary term. Another example of composite term may be `<<noun> is <adjective>>` containing `<noun>` and `<adjective>` elementary terms. We may nest composite and elementary terms within composite terms in any count and depth we want, but in the most cases, one or two levels should be enough to harness the purpose of composite terms.

Lets examine the following example to understand the purpose of composite terms:

    /*
        toy making decision
    */
    
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY     TOP <a <child> is good>)
            (ELEMENTARY <child> <girl>             )
            (ELEMENTARY <child> <boy>              )
        )
        (
            CHAIN        
            (ELEMENTARY <a girl is good> <Nick makes a toy doll>)
            (ELEMENTARY  <a boy is good> <Nick makes a toy car> )
        )
        (
            OUTPUT
            (ELEMENTARY           <toy doll> <toy>)
            (ELEMENTARY            <toy car> <toy>)
            (ELEMENTARY <Nick makes a <toy>> BOT  )
        )
    )

In the input section, we can see how we paired `<child>` with `<girl>` and `<boy>` terms. This means that `<a <child> is good>` term can be substituted for `<a girl is good>` or `<a boy is good>`. This is called term rewriting. To get more informed about term rewriting, or specifically in this case about context free grammars, interested readers are invited to study [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy) of formal languages.

Continuing with examining the example, what is happening in the output section? It indirectly recognizes `<Nick makes a toy doll>` or `<Nick makes a toy car>` using the symmetric mechanism to the one we encountered in input section. But to be sure that Nick doesn't make a toy car for a girl, or a toy doll for a boy, we use the correct pairing in the chaining section.

*Intermezzo* system may still seem like a bit of an overkill for this example, but let's hope the next example of term equalization will justify all the trouble.

##### term equalization

We finally come to a necessary delicacy of *Intermezzo*: term equalization. Let's examine the following example:

    /*
        job title decision
    */
    
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY      TOP <<person> <job>>)
            (ELEMENTARY <person> <Jane>          )
            (ELEMENTARY <person> <John>          )
            (ELEMENTARY    <job> <drives rocket> )
            (ELEMENTARY    <job> <heals people>  )
        )
        (
            CHAIN
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <P> <person>))
                (ELEMENTARY <<P> drives rocket> <astronaut <P>>)
            )
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <P> <person>))
                (ELEMENTARY <<P> heals people> <doctor <P>>)
            )
        )
        (
            OUTPUT
            (ELEMENTARY        <astronaut> <title> )
            (ELEMENTARY           <doctor> <title> )
            (ELEMENTARY             <Jane> <person>)
            (ELEMENTARY             <John> <person>) 
            (ELEMENTARY <<title> <person>> BOT     )
        )
    )

The input expectedly takes a person's name (`Jane` or `John`) and a person's job (`drives rocket` or `heals people`). The output is a titled person (`astronaut` or `doctor`).

The chaining section is where all the fun is happening. We are assigning the correct title to the unknown person `<P>`, depending only on her/his job. If the person drives a rocket, she/he is an astronaut, and if the person heals people, she/he is a doctor. Rules of the form:

    (
        EQUALIZE
        (IDENTIFY (DOMAIN <...identifier...> <...domain...>))
        (ELEMENTARY <...incoming term...> <...outgoing term...>)
    )
    
serve to assign a domain range to an identifier, and more importantly, to mark the identifier equal within incoming and outgoing terms. In the previous example we have two such rules, one for each job. Of course, there may be examples with more than one identifier, accordingly adding a new `(DOMAIN ...)` expression for each identifier under the `(IDENTIFY ...)` expression.

#### 2.2.3. deep composite rules

We already noted that composite rules can be placed wherever elementary ones can. Thus, we can also embed a composite rule within `EQUALIZE` section. This construction may be formed to specify additional assumptions under which the rule operates. This is shown in the following example:

    /*
        fruit substitution
    */
    
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY      TOP <<fruits> [<fruit> := <fruit>]>)
            (ELEMENTARY <fruits> <<fruit>, <fruits>>            )
            (ELEMENTARY <fruits> <fruit>                        )
            (ELEMENTARY  <fruit> <ananas>                       )
            (ELEMENTARY  <fruit> <banana>                       )
            (ELEMENTARY  <fruit> <kiwi>                         )
            (ELEMENTARY  <fruit> <mango>                        )
        )
        (
            CHAIN
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <F> <fruits>) (DOMAIN <X> <fruit>) (DOMAIN <Y> <fruit>))
                (
                    COMPOSITE
                    (
                        INPUT
                        (ELEMENTARY TOP <<F> [<X> := <Y>]>)
                    )
                    (
                        CHAIN
                        (ELEMENTARY <<F> [<X> := <Y>]> <F>)
                        (ELEMENTARY                <X> <Y>)
                    )
                    (
                        OUTPUT
                        (ELEMENTARY <F> BOT)
                    )
                )
            )
        )
        (
            OUTPUT
            (ELEMENTARY            <ananas> <fruit> )
            (ELEMENTARY            <banana> <fruit> )
            (ELEMENTARY              <kiwi> <fruit> )
            (ELEMENTARY             <mango> <fruit> )
            (ELEMENTARY             <fruit> <fruits>)
            (ELEMENTARY <<fruit>, <fruits>> <fruits>)
            (ELEMENTARY            <fruits> BOT     )
        )

The example inputs a list of fruits and a substitution expression. The output is the same list with substituted specified fruit in the list. Thus, inputting `ananas, banana, kiwi [banana := mango]`, output `ananas, mango, kiwi` is yielded.

Notice the similarity between embedded composite rules and ordinary elementary rules. `TOP` expression in the composite rule corresponds to an elementary rule left side. `BOT` expression in the composite rule corresponds to an elementary rule right side. Lastly, in `CHAIN` section of the composite rule, we put `TOP` to `BOT` expression connection along with all the assumptions under which the whole rule operates. The rule `(ELEMENTARY <<F> [<X> := <Y>]> <F>)` connects input to output, while the rule `(ELEMENTARY <X> <Y>)` does the actual substitution. These rules behave as intended because `EQUALIZE` section identifiers reach deep into the `COMPOSITE` section.

Resuming all learned by now, all of the above examples may seem like a very simple insight into *Intermezzo* essence, but these kinds of formations are really all we need to express all the computational range promised in the introduction section of this exposure. With what we learned by now about *Intermezzo*, we are able to transcribe *any* input form to *any* output form, however they may be interlinked.

With this section, we are concluding theoretical *Intermezzo* exposure. A few more or less advanced examples showing *Intermezzo* in all its shine are covered in the following [3. practical examples](#3-practical-examples) section.

## 3. practical examples

In this section we bring three illustrative examples using only constructs learned in section [2. theoretical background](#2-theoretical-background). We will see how to express (1) Turing machine, (2) untyped lambda calculus, and (3) hyposequent logic. The choice of examples is represenative for showing how *Intermezzo* handles different formal systems. The choice of examples is also representative for showing the universality of problem range on which *Intermezzo* can provide solutions.

### 3.1. automata programming

[Automata theory](https://en.wikipedia.org/wiki/Automata_theory#Classes_of_automata) is the study of abstract machines and automata, as well as the computational problems that can be solved using them. It is a theory in theoretical computer science. The word automata (the plural of automaton) comes from the Greek word αὐτόματος, which means "self-acting, self-willed, self-moving". An automaton (Automata in plural) is an abstract self-propelled computing device which follows a predetermined sequence of operations automatically.

There exists a whole variety of more or less general classes of automata, whilst [Turing machine](https://en.wikipedia.org/wiki/Turing_machine) represents the most general one. A Turing machine is a mathematical model of computation that defines an abstract machine, which manipulates symbols on a strip of tape according to a table of rules. Despite the model's simplicity, given any computer algorithm, a Turing machine capable of simulating that algorithm's logic can be constructed.

The machine operates on an infinite memory tape divided into discrete *cells*. The machine has its *head* that positions over a single cell and can read or write a symbol to the cell. The machine keeps a track of its current *state* from a finite set of states. Finally, the machine has a finite set of *instructions* which direct reading symbols, writing symbols, changing the current machine state and moving the tape to the left or to the right. Each instruction consists of the following:

1. reading the current state and reading a symbol at the position of head
2. depending on step 1, writing a symbol at the position of head
3. either move the tape one cell left or right and changing the current state

The machine repeats these steps until it encounters the halting instruction.

In automata theory, the class of [unrestricted grammars](https://en.wikipedia.org/wiki/Unrestricted_grammar) (also called semi-Thue, type-0 or phrase structure grammars) is the most general class of grammars in the [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy). No restrictions are made on the productions of an unrestricted grammar, other than each of their left-hand sides being non-empty.  This grammar class can generate arbitrary recursively enumerable languages. This is the same as saying that for every unrestricted grammar *G* there exists some Turing machine capable of recognizing language *L(G)* and vice versa.

Given an unrestricted grammar, such a Turing machine is simple enough to construct, as a two-tape nondeterministic Turing machine.  The first tape contains the input word *w* to be tested, and the second tape is used by the machine to generate sentential forms from *G*. The Turing machine then does the following:

1. Start at the left of the second tape and repeatedly choose to move right or select the current position on the tape.
2. Nondeterministically choose a production *β → γ* from the productions in *G*.
3. If *β* appears at some position on the second tape, replace *β* by *γ* at that point, possibly shifting the symbols on the tape left or right depending on the relative lengths of *β* and *γ* (e.g. if *β* is longer than *γ*, shift the tape symbols left).
4. Compare the resulting sentential form on tape 2 to the word on tape 1. If they match, then the Turing machine accepts the word. If they don't, the Turing machine will go back to step 1.

It is easy to see that this Turing machine will generate all and only the sentential forms of *G* on its second tape after the last step is executed an arbitrary number of times, thus the language *L(G)* must be recursively enumerable. As the reverse construction is also possible, an arbitrary unrestricted grammar can always be equivalently converted to a Turing machine and back again.

In this section, as a most general form of Turing machine, we bring an example of arbitrary unrestricted grammar expression recognizer. For a sake of simplicity, rather than programming particular Turing machines relevant to given unrestricted grammars, we choose to program unrestricted grammar rules directly in *Intermezzo*. Thus, the example takes an unrestricted grammar as an input, and returns compiled *Intermezzo* rules as an output. The compiled rules are then ready to accept an expression defined by the starting grammar.

    /*
        unrestricted grammar compiler example
        
        input: unrestricted grammar
        output: compiled *Intermezzo* rules representing input grammar
    */

    (
        COMPOSITE
        (
            INPUT

            // syntax of UG
            (ELEMENTARY           TOP <rules>                               )
            (ELEMENTARY       <rules> <<rule>&newline;<rules>>              )
            (ELEMENTARY       <rules> <rule>                                )
            (ELEMENTARY        <rule> <<sequence> -&greaterthan; <sequence>>)
            (ELEMENTARY    <sequence> <<elem><sequence>>                    )
            (ELEMENTARY    <sequence> <>                                    )
            (ELEMENTARY        <elem> <nonterminal>                         )
            (ELEMENTARY        <elem> <terminal>                            )
            
            (ELEMENTARY <nonterminal> <A>                                   )
            (ELEMENTARY <nonterminal> <B>                                   )
            ...
            (ELEMENTARY <nonterminal> <Z>                                   )
            
            (ELEMENTARY    <terminal> <a>                                   )
            (ELEMENTARY    <terminal> <b>                                   )
            ...
            (ELEMENTARY    <terminal> <z>                                   )
        )
        (
            CHAIN
            
            /*
                helper rules
            */

            (ELEMENTARY <(> <&lessthan;>)
            (ELEMENTARY <)> <&greaterthan;>)
            
            (ELEMENTARY <enclose <>> <<(>$<)>>)
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <S> <sequence>) (DOMAIN <E> <elem>)
                (ELEMENTARY <enclose <<E><S>>> <<(><E><)><(><enclose <S>><)>>)
            )
            
            /*
                generate each transition rule
            */
            
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <S0> <sequence>) (DOMAIN <S1> <sequence>))
                (
                    ELEMENTARY
                    <<S0> -&greaterthan; <S1>>
                    <
                        (
                            EQUALIZE
                            (IDENTIFY (DOMAIN <(>$<)> <(>sequence<)>))
                            (ELEMENTARY <<(>enclose <S0><)>> <<(>enclose <S1><)>>)
                        )
                    >
                )
            )
            
            /*
                final *Inermezzo* output rules
            */
            
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <rules>))
                (
                    ELEMENTARY
                    <X>
                    <
                        (
                            COMPOSITE
                            (
                                INPUT
                                
                                // declarations
                                (ELEMENTARY    <(>sequence<)> <(><(>elem<)><(>sequence<)><)>)
                                (ELEMENTARY    <(>sequence<)> <(><)>                        )
                                (ELEMENTARY        <(>elem<)> <(>nonterminal<)>             )
                                (ELEMENTARY        <(>elem<)> <(>terminal<)>                )
                                
                                (ELEMENTARY <(>nonterminal<)> <(>A<)>                       )
                                (ELEMENTARY <(>nonterminal<)> <(>B<)>                       )
                                ...
                                (ELEMENTARY <(>nonterminal<)> <(>Z<)>                       )
                                
                                (ELEMENTARY    <(>terminal<)> <(>a<)>                       )
                                (ELEMENTARY    <(>terminal<)> <(>b<)>                       )
                                ...
                                (ELEMENTARY    <(>terminal<)> <(>z<)>                       )
                                
                                // top rule
                                (ELEMENTARY TOP <(>S<)>)
                                
                                // production rules
                                <X>
                                
                            (
                                CHAIN // empty, the whole recognizer is in input
                            )
                            (
                                OUTPUT
                                
                                // string of characters
                                (ELEMENTARY              <(>a<)> <(>char<)>          )
                                (ELEMENTARY              <(>b<)> <(>char<)>          )
                                ...
                                (ELEMENTARY              <(>z<)> <(>char<)>          )
                                (ELEMENTARY           <(>char<)> <(>string<)>        )
                                (ELEMENTARY <(><(>char<)><(>string<)><)> <(>string<)>)
                                (ELEMENTARY         <(>string<)> BOT                 )
                            )
                        )
                    >
                )
            )
        )
        (
            OUTPUT
            
            //syntax of Intermezzo
            (ELEMENTARY                             <(DOMAIN <elem-term> <comp-term>)> <domain>   )
            (ELEMENTARY                                                       <domain> <domains>  )
            (ELEMENTARY                                           <<domain> <domains>> <domains>  )
            (ELEMENTARY                  <(EQUALIZE (IDENTIFY <domains>) <elem-rule>)> <eqlz-rule>)
            (ELEMENTARY                                                          <BOT> <output>   )
            (ELEMENTARY                                                    <comp-term> <output>   )
            (ELEMENTARY                                                    <comp-term> <input>    )
            (ELEMENTARY                                                          <TOP> <input>    )
            (ELEMENTARY                                                    <eqlz-rule> <elem-rule>)
            (ELEMENTARY                                <(ELEMENTARY <input> <output>)> <elem-rule>)
            (ELEMENTARY                                                    <comp-rule> <rule>     )
            (ELEMENTARY                                                    <elem-rule> <rule>     )
            (ELEMENTARY                                                         <rule> <rules>    )
            (ELEMENTARY                                               <<rule> <rules>> <rules>    )
            (ELEMENTARY <(COMPOSITE (INPUT <rules>) (CHAIN <rules>) (OUTPUT <rules>))> <comp-rule>)
            (ELEMENTARY                                                    <comp-rule> BOT        )
        )
    )

Classical example of an expression accepted by an unrestricted grammar language *L* is a string of the same amout of three different characters: *L = a^nb^nc^n, n > 0*. Thus, if we pass a grammar:

    S -> aBSc 
    S -> aBc 
    Ba -> aB 
    Bc -> bc 
    Bb -> bb

as an input to the above example, we will get back *Intermezzo* rules that finally accept any of `abc`, `aabbcc`, `aaabbbccc`, ... strings as an input, while reporting a sytax error in other cases.

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
        COMPOSITE
        (
            INPUT
            
            // syntax of lambda calculus
            (ELEMENTARY      TOP <lterm>          )
            (ELEMENTARY  <lterm> <abst>           )
            (ELEMENTARY   <abst> <(λ<var>.<abst>)>)
            (ELEMENTARY   <abst> <appl>           )
            (ELEMENTARY   <appl> <(<appl> <var>)> )
            (ELEMENTARY    <var> <<symbol><var>>  )
            (ELEMENTARY    <var> <symbol>         )
            
            (ELEMENTARY <symbol> <a>              )
            (ELEMENTARY <symbol> <b>              )
            ...
            (ELEMENTARY <symbol> <z>              )
        )
        (
            CHAIN
            
            // alpha conversion
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <var>) (DOMAIN <Y> <var>) (DOMAIN <M> <lterm>))
                (
                    COMPOSITE
                    (INPUT  (ELEMENTARY TOP <(λ<X>.<M>)>))
                    (
                        CHAIN
                        (ELEMENTARY <(λ<X>.<M>)> <(<aconv <Y> <M>)>)
                        (ELEMENTARY          <X> <Y>               )
                    )
                    (OUTPUT (ELEMENTARY <(<aconv <Y> <M>)> BOT))
                )
            )
            
            // beta reduction
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <var>) (DOMAIN <M> <lterm>) (DOMAIN <N> <lterm>))
                (
                    COMPOSITE
                    (INPUT  (ELEMENTARY TOP <((<aconv <X> <M>>) <N>)>))
                    (
                        CHAIN
                        (ELEMENTARY <((<aconv <X> <M>>) <N>)> <M>)
                        (ELEMENTARY                       <X> <N>)
                    )
                    (OUTPUT (ELEMENTARY <M> BOT))
                )
            )
        )
        (
            OUTPUT
            
            // syntax of lambda calculus
            (ELEMENTARY             <a> <symbol>  )
            (ELEMENTARY             <b> <symbol>  )
            ...
            (ELEMENTARY             <z> <symbol>  )
            
            (ELEMENTARY          <symbol> <var>   )
            (ELEMENTARY   <<symbol><var>> <var>   )
            (ELEMENTARY             <var> <appl>  )
            (ELEMENTARY <(<appl> <prim>)> <appl>  )
            (ELEMENTARY            <appl> <abst>  )
            (ELEMENTARY <(λ<var>.<abst>)> <abst>  )
            (ELEMENTARY            <abst> <lterm> )
            (ELEMENTARY           <lterm> BOT     )
        )
    )

This example evaluates lambda expressions, and as such, accepts inputs like `((λx.(x x)) ((λx.(x x)) a))`, in which case it yields the output like `((a a) (a a))`.

### 3.3. logic programming

*Intermezzo* is a language of flat rules. But sometimes it may be useful to reason about those rules, particularly having an access to rules about rules. In a case of *Intermezzo*, this would be called metaprogramming. [Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming) opens a way to many forms of expressions, and this could be achieved by utilizing ordinary logic expressions. One can imagine each *Intermezzo* rule as a plain implication, for example: `A -> B`. One can also imagine a rule that holds only if some other assumption holds, for example: `U -> (V -> W)`, reading: "if assumption `U` holds, then rule `V -> W` also holds". Having new conditional rules asserted this way, it would be also reasonable to expect expressing a consequence that holds only if some rule holds, for example: `(P -> Q) -> R`, reading: "if rule `P -> Q` holds, then `R` also holds. These higher order rules may even be combined to form more complex higher order rules.

A question may arise: "How to introduce higher order rules into the flat *Intermezzo* rulescape?" Approaching an answer to this question, higher order rules, if augmented by a negation, happen to be [functionally complete](https://en.wikipedia.org/wiki/Functional_completeness) formations that may be used to introduce or eliminate other logical operators. This relates particularly to ingrained `/\` (forming conjunctions) and `\/` (forming disjunctions) operators that we also widely use in our everyday language. Having both introduction and elimination processes at disposition means that if we can express conjunctions and disjunctions by higher order implications, we can also express higher order implications by conjunctions and disjunctions. And this will be our way out of the flat rulescape into the dimension of metaprogramming: to support unrestricted metaprogramming, we will use normalized conjunctions and disjunctions in the left and right sides of rules.

To achieve this, let's first overview some properties of ordinary logic expressions comparing to properties of their normalized forms suitable for use by *Intermezzo* code. Understanding ordinary logic expressions is pretty straightforward in a sense that we can combine and group `<->`, `->`, `/\`, `\/`, and `~` operations in any way we want. This logic setup, although (under right circumstances) readable to humans, is pretty unpredictable when it comes to tracking inference process. This makes it very hard to implement in *Intermezzo* if we don't take some steps before the implementation. Steps we have to take are guiding us in a direction of converting complex logic expressions into their simpler equivalent normalized expressions which we can easily reason about and finally be able to implement by *Intermezzo* code. Nevertheless, this conversion does not mean we lose any expressivity range: whatever we can express with ordinary logic, we can also express with corresponding normalized simpler expressions.

There may be many forms of normalized logical expressions, but in this section we are indirectly interested in a form of sequents known from [sequent calculus](https://en.wikipedia.org/wiki/Sequent_calculus). Sequents appear as a set of expressions, each of the form: `(A1 /\ A2 /\ ...) -> (B1 \/ B2 \/ ...)`. To put it in words, a sequent resembles an implication with a [conjunction](https://en.wikipedia.org/wiki/Logical_conjunction) on its left, and [disjunction](https://en.wikipedia.org/wiki/Logical_disjunction) on its right side.

While sequents are much more uniform and predictable than ordinary logic expressions, they are bringing an amount of reduced readability into the system. To minimize negative properties of sequents while trying to retain some positive properties of ordinary logic expressions, we will make a certain compromise. We will introduce a novel normal form that puts expressions appearance somewhere between their original sequent form and ordinary logic form. We will name this normal form as **hyposequent** form. The compromise we are bringing in is consisting in forming flat implications having disjunctive normal form ([DNF](https://en.wikipedia.org/wiki/Disjunctive_normal_form)) expressions on implication left, and conjunctive normal form ([CNF](https://en.wikipedia.org/wiki/Conjunctive_normal_form)) expressions on implication right sides.

           more uniform and predictable
             less readable and complex
                        
                      +---+
                     /     \
                    +-------+
                     sequent 
                  +-----------+
                 /             \
                +---------------+
                   hyposequent  
              +-------------------+
             /                     \
            +-----------------------+
            ordinary logic expression         
          +---------------------------+
         /                             \
        +-------------------------------+
                        
            more readable and complex
           less uniform and predictable

Hyposequents, as a compacted versions of sequents, have some positive properties regarding to both human tractability of their behavior and simplicity of their *Intermezzo* implementation.  In particular, they reduce a need for and-introduction and or-elimination rules by applying these rules to ordinary sequents. Luckily for us, applying these rules is a pretty straightforward process.

We present a procedure of converting any ordinary logical formula first to sequents, then to hyposequents:

1. **Convert logic expressions to sequents:**
    
    Our first step is to convert all the logical formulas to *sequents*. We start with
    [converting our logic formula into CNF](https://en.wikipedia.org/wiki/Conjunctive_normal_form#Conversion_into_CNF).
    After conversion, what we are left with is a set of conjuncts of the form:
    
    `~A1 \/ ~A2 \/ ... \/ P1 \/ P2 \/ ...`
    
    which can conveniently be converted to sequents written in logic syntax in the following way:
    
    `(A1 /\ A2 /\ ...) -> (P1 \/ P2 \/ ...)`

2. **Convert sequents to hyposequents:**
    
    Once we acquire a sequent set, the next step is to convert sequents to hyposequents in two sub-phases:
    
    - **Group sequents with identical left sides:**
        
             A -> B       A -> C       
            ---------------------
                 A -> B /\ C  
        
    - **Group sequents with identical right sides:**
        
             A -> C       B -> C      
            ---------------------
                 A \/ B -> C 
        
    where `A`, `B`, and `C` are conjunctions or disjunctions respective to their positions in sequents. These
    rules represent and-introduction and or-elimination rules. Of course, when applying the rules and comparing
    sequents left and right sides, we have to take into consideration that conjunctions and disjunctions are
    commutative expressions. After applying the above rules, what we are left with is a set of hyposequents of
    the form:
    
    `((A1 /\ A2 /\ ...) \/ (B1 /\ B2 /\ ...) \/ ...) -> ((P1 \/ P2 \/ ...) /\ (Q1 \/ Q2 \/ ...) /\ ...)`
    
    which we finally write in *Intermezzo* as;
    
    `(ELEMENTARY <<A1 /\ A2 /\ ...> \/ <B1 /\ B2 /\ ...> \/ ...> <<P1 \/ P2 \/ ...> /\ <Q1 \/ Q2 \/ ...> /\ ...>)`

Having obtained hyposequents by these two steps from ordinary logic expressions, all we need to properly interpret them is the following composite rule:

    /*
        composite rule for chaining hyposequents
    */
    
    (
        COMPOSITE
        (
            INPUT
            
            // conjunctive normal form
            (ELEMENTARY     TOP <con-i>             )
            (ELEMENTARY <con-i> <<dis-i> /\ <con-i>>)
            (ELEMENTARY <con-i> <dis-i>             )
            (ELEMENTARY <dis-i> <<atm-i> \/ <dis-i>>)
            (ELEMENTARY <dis-i> <atm-i>             )
            (ELEMENTARY <atm-i> <comp-term>         )
        )
        (
            CHAIN
            
            /*
                set of input rules (CNF)
            */
            
            // or-commutativity rules
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <atm-i>) (DOMAIN <Y> <atm-i>) (DOMAIN <Z> <dis-i>))
                (ELEMENTARY <<X> \/ <Y> \/ <Z>> <<Y> \/ <X> \/ <Z>>)
            )
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <atm-i>) (DOMAIN <Y> <atm-i>))
                (ELEMENTARY <<X> \/ <Y>> <<Y> \/ <X>)
            )
            
            // and-commutativity rules
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <dis-i>) (DOMAIN <Y> <dis-i>) (DOMAIN <Z> <con-i>))
                (ELEMENTARY <<X> /\ <Y> /\ <Z>> <<Y> /\ <X> /\ <Z>>)
            )
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <dis-i>) (DOMAIN <Y> <dis-i>))
                (ELEMENTARY <<X> /\ <Y>> <<Y> /\ <X>)
            )
            
            // and-distributivity rule
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <atm-i>) (DOMAIN <Y> <dis-i>) (DOMAIN <Z> <con-i>))
                (ELEMENTARY <<<X> \/ <Y>> /\ <Z>> <<<X> /\ <Z>> \/ <<Y> /\ <Z>>>)
            )
            
            // and-elimination rule
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <dis-i>) (DOMAIN <Y> <con-i>))
                ELEMENTARY (<<X> /\ <Y>> <X>)
            )

            /*
                set of output rules (DNF)
            */
            
            // and-commutativity rules
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <atm-o>) (DOMAIN <Y> <atm-o>) (DOMAIN <Z> <dis-o>))
                (ELEMENTARY <<Y> /\ <X> /\ <Z>> <<X> /\ <Y> /\ <Z>>)
            )
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <atm-o>) (DOMAIN <Y> <atm-o>))
                (ELEMENTARY <<Y> /\ <X>> <<X> /\ <Y>>)
            )
            
            // or-commutativity rules
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <con-o>) (DOMAIN <Y> <con-o>) (DOMAIN <Z> <dis-o>))
                (ELEMENTARY <<Y> \/ <X> \/ <Z>> <<X> \/ <Y> \/ <Z>>)
            )
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <con-o>) (DOMAIN <Y> <con-o>))
                (ELEMENTARY <<Y> \/ <X>> <<X> \/ <Y>>)
            )
            
            // or-distributivity rule
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <atm-o>) (DOMAIN <Y> <con-o>) (DOMAIN <Z> <dis-o>))
                (ELEMENTARY <<<X> \/ <Z>> /\ <<Y> \/ <Z>>> <<<X> /\ <Y>> \/ <Z>>)
            )
            
            // or-introduction rule
            (
                EQUALIZE
                (IDENTIFY (DOMAIN <X> <atm-o>) (DOMAIN <Y> <dis-o>))
                ELEMENTARY (<X> <<X> \/ <Y>>)
            )
        )
        (
            OUTPUT
            
            // disjunctive normal form
            (ELEMENTARY          <comp-term> <atm-o>)
            (ELEMENTARY              <atm-o> <con-o>)
            (ELEMENTARY <<atm-o> /\ <dis-o>> <con-o>)
            (ELEMENTARY              <con-o> <dis-o>)
            (ELEMENTARY <<con-o> \/ <dis-o>> <dis-o>)
            (ELEMENTARY              <dis-o> BOT    )
        )
    )

To properly support hyposequents, we just need to include the above composite rule at the same place where the hyposequents are, and the rule takes a proper care of forward and backward chaining. Thus, in an example:

    (
        COMPOSITE
        (
            (
                INPUT
                
                (ELEMENTARY TOP <test start>)
            )
            (
                CHAIN
                
                (
                    COMPOSITE
                    ... chaining hyposequents composite rule ...
                )
                
                (ELEMENTARY                   <test start> <<<a> \/ <b>> /\ <c>>         )
                (ELEMENTARY <<<a> /\ <c>> \/ <<b> /\ <c>>> <<<p> \/ <r>> /\ <<q> \/ <r>>>)
                (ELEMENTARY          <<<p> /\ <q>> \/ <r>> <test success>                )
            )
            (
                OUTPUT
                
                (ELEMENTARY <test success> BOT)
            )
        )
    )

when passing `test start` as input, `test success` should be yielded as output.

## 4. related work

*Intermezzo* is a metaprogramming system in the guise of rule-based programming system. There exist a lot of systems in both metaprogramming and rule-based programming field. Rather than thoroughly elaborating similarities and differences between *Intermezzo* and each such system known to us, we bring hyperlinks to brief descriptions of selected languages from both fields, arranged in alphabetical order:

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

The most generally speaking, *Intermezzo* may be used to express a wide variety of languages. Different languages may be used to express a wide variety of systems. Different systems, in turn may be used to express a wide variety of processes we experience around us. Being natural or artificial, many of these processes may deserve our attention while understanding and mastering them may be of certain importance to us. What will *Intermezzo* represent, and where it will be used depends only on our imagination because with a kind of system like *Intermezzo*, we are entering a nonexhaustive area of general knowledge computing where only our imagination could be a limit.
