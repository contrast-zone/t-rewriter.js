# introduction to expression flow programming

    // under construction //

> __*[Intended audience]*__  
> *Beginners in language parsing, term rewriting, and logic deduction*

> __*[Short description]*__  
> As an embodiment of general problem solving strategy related to [term rewriting](https://en.wikipedia.org/wiki/Rewriting), *Expression flow* aims to be a host for a variety of kinds of [formal languages](https://en.wikipedia.org/wiki/Formal_language), exhibiting [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system). For each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/domain-specific_language) in a [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm. Having clearly defined communication input and output forms, *Expression flow* performs transition from input to output by additionally defining possibly [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness) set of chaining [production rules](https://en.wikipedia.org/wiki/Production_(computer_science)). Input-chain-output sort of arrangement also sheds light on *Expression flow* from an angle of [systems](https://en.wikipedia.org/wiki/System) theory, thus broadening a possible range of use cases.

> __*[References]*__  
> *[Wikipedia web site](https://en.wikipedia.org)*

## table of contents

- [x] [1. introduction](#1-introduction)
- [x] [2. theoretical background](#2-theoretical-background)
    - [x] [2.1. syntax](#21-syntax)
    - [x] [2.2. semantics](#22-semantics)
        - [x] [2.2.1. elementary rules](#221-elementary-rules)
        - [x] [2.2.2. composite rules](#222-composite-rules)
        - [x] [2.2.3. terms](#223-terms)
        - [x] [2.2.4. pattern matching](#224-pattern-matching)
- [x] [3. practical examples](#3-practical-examples)
    - [x] [3.1. turing machines](#31-turing-machines)
    - [x] [3.2. lambda calculus](#32-lambda-calculus)
    - [x] [3.3. entscheidungsproblem](#33-entscheidungsproblem)
- [x] [4. related work](#4-related-work)
- [x] [5. conclusion](#5-conclusion)

## 1. introduction

Formal languages are usually considered as formations dedicated to accomplishing diverse tasks. *Expression flow* is also a language, and it is an implementation of a [rule-based programming system](https://en.wikipedia.org/wiki/Rule-based_system) that aims to be a host for a variety of kinds of other formal languages. By its design, *Expression flow* represents an embodiment of a general problem solving strategy related to [term rewriting](https://en.wikipedia.org/wiki/Rewriting), being able to support a diversity of hosted languages intentions and purposes.

Seeing *Expression flow* as a programming language that operates on other formal languages, it provides a particular form of data computation: for each area of interest, one is able to define a custom [domain specific language](https://en.wikipedia.org/wiki/domain-specific_language) operating on specific forms of data (input), yielding specific forms of computation results (output). To that extent, *Expression flow* also represents a language implementing [language oriented programming](https://en.wikipedia.org/wiki/Language-oriented_programming) paradigm.

[Production rules](https://en.wikipedia.org/wiki/Production_(computer_science)), as *Expression flow* constituents, mediate between source and target expressions. Appearance of source and target expressions is defined by custom input and output syntax production rules. These rules are then complemented by custom semantic production rules, rendering the [production system](https://en.wikipedia.org/wiki/Production_system_(computer_science)) capable of translating between input and output expressions. Translating mechanism in a case of *Expression flow* has important property of being [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), which means we can construct *any* output from *any* input, potentially supporting *any* kind of meaningful computation process known to us.

Shedding light from another angle, a [system](https://en.wikipedia.org/wiki/System) is a group of interacting or interrelated elements that act according to a set of rules to form a unified whole. When googling examples of a system, we may find that an example of a system is the way someone organizes their closet. Also, an example of a system is all the organs that work together for digestion. A set or arrangement of things so related or connected as to form a unity or organic whole. Other examples may include a solar system, school system, system of highways. An important conceptual asset of each system is existence of input and output between system and its surroundings. Systems, having clearly defined interdependent input and output, may also be described by sets of *Expression flow* production rules. Considering its computational completeness, *Expression flow* does not pose any restrictions on any kinds of systems it may describe. Thus, possible application of *Expression flow* rulesets reaches even to simulating a wide range of systems we may see around us. This should not be such a surprise since many formal languages intentions are exactly describing behaviors of different system wholes, while siutability choice and universality of such systems may be bound only by our imagination.

## 2. theoretical background

In a good hope of reaching its charted goals, *Expression flow* tries to follow simple and minimalistic design as long as it doesn't affect its expressiveness in both ease of use, and coverage of possible use cases. Without losing certain structuring capabilities while still keeping very broad expressivity range, we decide to include only: two types of rules - *elementary and composite rules*, two types of terms - *elementary and composite terms*, and two built-in term constants - *top and bottom constants*.

But this minimal setup doesn't mean we are strictly bound to the proposed fewness of *Expression flow* expressions. Just like we can stack a higher level language layer on top of machine code, we may extend or intentionally restrict *Expression flow* language as long as our rules produce valid *Expression flow* expressions. This encourages us to keep *Expression flow* definition minimalistic, but general enough not to fear that we left out something important.

In this section we are explaining *Expression flow* rule system syntax and defining how it should behave in practice. Although they may seem simple, basic constructs we will learn about in this section are enough to accomplish a whole variety of computation kinds.

### 2.1. syntax

In computer science, the [syntax](https://en.wikipedia.org/wiki/Syntax_(programming_languages)) of a computer language is the set of rules that defines the combinations of symbols that are considered to be correctly structured statements or expressions in that language.

[Formal grammar](https://en.wikipedia.org/wiki/Formal_grammar) of *Expression flow* may be represented by the following, relaxed kind of [BNF](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) notation:

        <start> := <rule>
        
    <elem-rule> := (ELEMENTARY (INPUT <input>) (OUTPUT <output>))
    
        <input> := TOP
                 | <comp-term>
                 
       <output> := <comp-term>
                 | BOT
    
    <comp-rule> := (COMPOSITE (INPUT <rules>) (CHAIN <rules>) (OUTPUT <rules>))
    
        <rules> := <rule> <rules>
                 | <rule>
    
         <rule> := <comp-rule>
                 | <elem-rule>
                 | <mtch-rule>
    
    <mtch-rule> := (MATCH (IDENTIFY <ids>) <rule>)
    
          <ids> := <id> <ids>
                 | <id>
    
           <id> := (ID (NAME <elem-term>) (TYPE <comp-term>))

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to humans, and may be placed wherever a whitespace is expected. Single line comments are introduced by `//`, and reach until the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

We introduced three kinds of rules: composite, elementary, and MATCH rules. Composite rules operate on sets of rules. In elementary rules, `<input>` and `<output>` may be augmented by `TOP` and `BOT` constants representing entry and exit points of rule inference, respectively. MATCH rules span equally appearing elementary terms (analogous to commonly typed variables in other languages, corroborated by determined types) in subsumed rules.

Note that the above grammar merely indicates existence of `<elem-term>` (elementary terms) and `<comp-term>` (composite terms), which we will have a chance to examine thorougly in the semantics section. Also note that these two differ from `<elem-rule>` (elementary rules) and `<comp-rule>` (composite rules) that may operate on those terms.

### 2.2. semantics

[Semantics](https://en.wikipedia.org/wiki/Semantics) is the study of meaning, reference, or truth. In our understanding, semantics is tightly bound to an interpretation of syntactically correct expression. To know what an expression means, it is enough to know how to translate the expression to a form that is already understood by a target environment. Semantics of *Expression flow* deals with such translations at metalevel.

The current section covers *Expression flow* specific implementation of rule structuring and appearance of terms over which the rules operate. We will overview *Expression flow* inference process in detail on a few simple but representative examples that may be extrapolated to describe a variety of different systems.

#### 2.2.1. elementary rules

There are two kinds of rules in *Expression flow*: elementary and composite rules. Elementary rules are consisted only of incoming and outgoing terms, and are written as follows:

    (ELEMENTARY (INPUT <...incoming term...>) (OUTPUT <...outgoing term...>))

Typical "hello world" example in *Expression flow* would look like this:
    
    (ELEMENTARY (INPUT <>) (OUTPUT <hello world>))

The example inputs an empty string, and outputs the string `hello world`.

Elementary rules may be combined in composite rules to form more complex structures. In that case, output of one elementary rule is chained to input of another elementary rule in a process called forward chaining. Incoming and outgoing term placeholders are then intended to hold either specializing or generalizing terms in a combination depending on the position of the rule in outer structure. Being placed inside input, chaining, or output section of the parent rule, although they all take the similar form, elementary rules are written with intention to either generate, pass through, or recognize flowing data.

#### 2.2.2. composite rules

Composite rules are consisted of other rules in a strictly defined structure as follows:

    (
        COMPOSITE
        (
            INPUT
            ...incoming rules...
        )
        (
            CHAIN
            ...pass through rules...
        )
        (
            OUTPUT
            ...outgoing rules...
        )
    )

This structure clearly distincts between input rules, output rules, and rules chaining input to output. Composite rules do not expose their structure to the outer world. At places where they are inserted, they are treated as black boxes accepting some input and producing some output. As such, they may be used for structuring rule sets into wholes that don't see each others internals, and may use the same names for their internals without worrying about name collisions.

##### semantics of composite rules

Semantics of composite rules are defined by a rhombus containing `input rules`, `chaining rules`, and `output rules`. The rhombus is diverging branches from `TOP` downwards, in a direction of deduction, forming an initial deduction tree. The rhombus is also diverging branches from `BOT` upwards, in a direction of abduction, forming an opposed abduction tree. The deduction and abduction tree branches are required to meet at the middle area of `chaining rules`, thus forming a complete inference system.

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

Because *Expression flow* systems operate on sequences of characters, we can interpret input and output rules in a sense of incoming and outgoing syntax rules while interpreting chaining rules in a sense of semantic connections between input and output language. This makes *Expression flow* suitable for representing a variety of languages based on production rules definitions.

To illustrate this arrangement, let's overview the "hello world" example similar to the one from the elementary rules section, but this time written as composite rule:

    /*
        "hello world" composite rule example
    */
    
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY (INPUT TOP) (OUTPUT <>))
        )
        (
            CHAIN
            (ELEMENTARY (INPUT <>) (OUTPUT <hello world>))
        )
        (
            OUTPUT
            (ELEMENTARY (INPUT <hello world>) (OUTPUT BOT))
        )
    )

In input section, we specify that an empty string is taken by linking it from `TOP` constant. In chaining section, we link the empty string to an output expression. In output section, we specify what the output is by linking it to `BOT` constant. Thus, the whole example finally inputs an empty string and outputs `hello world`.

##### internal rule visibility

In the `COMPOSITE` section, between input, chaining, and output sections, there exists a peculiar model of rule interaction. Rules from input section may interact with reversed rules from output section, and vice versa. Similarly, rules from chaining section may interact with reversed rules from input and output section. At last, rules from input and output sections do not have an access to rules from chaining section. We choose this rule interaction model because it has some positive properties regarding to forward and backward chaining. Although it may seem a bit unusual, nevertheless, because there may exist a frequent need for reaching noted kinds of rules within noted sections, this interaction model deliberates us from unnecessary duplicating exact or reversed definitions of the rules.

##### rule symmetry treatment

Relating to input and output sections of composite rules, **rules inside input and output sections are treated symmetrically**. In an example of using [context free grammars](https://en.wikipedia.org/wiki/Context-free_grammar) (CFG) to define input and output syntaxes, we differentiate two cases:

- in input sections, CFG **rule heads are placed at incoming term placeholders** while CFG **rule bodies are placed at outgoing term placeholders**
- in output sections, CFG **rule bodies are placed at incoming term placeholders** while CFG **rule heads are placed at outgoing term placeholders**

In *Expression flow* inference strategy, because extracting specific output from specific input utilizes the combination of internal forward and backward chaining, the correct rule symmetry is very important and ensures the entire inference process consistency.

Relating to chaining sections, **rules placed in chaining sections** are written in a direction where the **incoming placeholders hold connections backwards, to the input generator** utilizing input rules. Further, we can chain more rules together, so that **one rule outgoing placeholder is being linked to other rule incoming placeholder**. Finally, with the logically last rule in such chain, **outgoing placeholders hold connections forwards, to the output recognizer** utilizing output rules.

For use within rules, *Expression flow* includes two constants: `TOP` and `BOT` (top and bottom). **`TOP` constant may be placed only as incoming term in input section** while **`BOT` constant may be placed only as outgoing term in output section**. Further, **input section is required to contain at least one rule with `TOP` constant** while **output section is required to contain at least one rule with `BOT` constant**. This treatment ensures a required basis for inference engine entry and exit points.

#### 2.2.3. terms

Terms are records enclosed between `<` and `>` symbols. They are asserted in rules incoming and outgoing placeholders. we destinct between elementary and composite terms, regarding to their internal structure. To get familiar with terms, we will examine four simplistic examples, starting with elementary terms.

##### elementary terms

The simplest form of terms is elementary term form. Elementary term is a record encosed in a pair of `<` and `>` symbols, not containing other terms within.

The following example uses only elementary terms:

    /*
        conversation example
    */
    
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY (INPUT TOP) (OUTPUT <hi computer>              ))
            (ELEMENTARY (INPUT TOP) (OUTPUT <isn't the world beautiful>))
            (ELEMENTARY (INPUT TOP) (OUTPUT <bye computer>             ))
        )
        (
            CHAIN
            (ELEMENTARY (INPUT               <hi computer>) (OUTPUT <hello entity>  ))
            (ELEMENTARY (INPUT <isn't the world beautiful>) (OUTPUT <yes, it is>    ))
            (ELEMENTARY (INPUT              <bye computer>) (OUTPUT <goodbye entity>))
        )
        (
            OUTPUT
            (ELEMENTARY (INPUT   <hello entity>) (OUTPUT BOT))
            (ELEMENTARY (INPUT     <yes, it is>) (OUTPUT BOT))
            (ELEMENTARY (INPUT <goodbye entity>) (OUTPUT BOT))
        )
    )

This example describes a simple process of pairing input to output expressions. Observing the system it describes, passing the input: `hi computer`, the output: `hello entity` is produced; passing the input: `isn't the world beautiful`, the output: `yes, it is` is produced; passing the input: `bye computer`, the output `goodbye entity` is produced; passing any other input generates a syntax error.

To observe the *Expression flow* symmetry treatment, notice the natural data flow in the example. Unless there is an explicit interaction between input, chaining, and output sections, the data flows from left to right, from top to bottom. However, if we plan to use the specific interaction, to simplify definitions and avoid duplicating rules, the note about rule reversing from section [2.2.2. composite rules](#internal-rule-visibility) applies.

Moving further with our exposure, although *Expression flow* system seems like a bit of an overkill for the above simplistic example, let's examine composite terms to see what happens.

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
            (ELEMENTARY (INPUT     TOP) (OUTPUT <a <child> is good>))
            (ELEMENTARY (INPUT <child>) (OUTPUT <girl>             ))
            (ELEMENTARY (INPUT <child>) (OUTPUT <boy>              ))
        )
        (
            CHAIN        
            (ELEMENTARY (INPUT <a girl is good>) (OUTPUT <Nick makes a toy doll>))
            (ELEMENTARY (INPUT  <a boy is good>) (OUTPUT <Nick makes a toy car> ))
        )
        (
            OUTPUT
            (ELEMENTARY (INPUT           <toy doll>) (OUTPUT <toy>))
            (ELEMENTARY (INPUT            <toy car>) (OUTPUT <toy>))
            (ELEMENTARY (INPUT <Nick makes a <toy>>) (OUTPUT BOT  ))
        )
    )

In the input section, we can see how we paired `<child>` with `<girl>` and `<boy>` terms. This means that `<a <child> is good>` term can be substituted for `<a girl is good>` or `<a boy is good>`. This is called term rewriting. To get more informed about term rewriting, or specifically in this case about context free grammars, interested readers are invited to study [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy) of formal languages.

Continuing with examining the example, what is happening in the output section? It indirectly recognizes `<Nick makes a toy doll>` or `<Nick makes a toy car>` using the symmetric mechanism to the one we encountered in input section. But to be sure that Nick doesn't make a toy car for a girl, or a toy doll for a boy, we use the correct pairing in the chaining section.

The whole *Expression flow* system may still seem like a bit of an overkill for this example, but let's hope the next section will justify all the trouble we've been through.

#### 2.2.4. pattern matching

We finally come to a necessary delicacy of *Expression flow*: pattern matching. With pattern matching we are able to define patterns against which terms are matched. The essence of patterns is in variable form terms which we use as placeholders to pass data from rule input to rule output sides.

##### pattern matching in elementary rules

To get a feeling what this is all about, let's examine the following example:

    /*
        job title decision
    */
    
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY (INPUT      TOP) (OUTPUT <<person> <job>>))
            (ELEMENTARY (INPUT <person>) (OUTPUT <Jane>          ))
            (ELEMENTARY (INPUT <person>) (OUTPUT <John>          ))
            (ELEMENTARY (INPUT    <job>) (OUTPUT <drives rocket> ))
            (ELEMENTARY (INPUT    <job>) (OUTPUT <heals people>  ))
        )
        (
            CHAIN
            (
                MATCH
                (IDENTIFY (ID (NAME <P>) (TYPE <person>)))
                (ELEMENTARY (INPUT <<P> drives rocket>) (OUTPUT <astronaut <P>>))
            )
            (
                MATCH
                (IDENTIFY (ID (NAME <P>) (TYPE <person>)))
                (ELEMENTARY (INPUT <<P> heals people>) (OUTPUT <doctor <P>>))
            )
        )
        (
            OUTPUT
            (ELEMENTARY (INPUT        <astronaut>) (OUTPUT <title> ))
            (ELEMENTARY (INPUT           <doctor>) (OUTPUT <title> ))
            (ELEMENTARY (INPUT             <Jane>) (OUTPUT <person>))
            (ELEMENTARY (INPUT             <John>) (OUTPUT <person>))
            (ELEMENTARY (INPUT <<title> <person>>) (OUTPUT BOT     ))
        )
    )

The input expectedly takes a person's name (`Jane` or `John`) and a person's job (`drives rocket` or `heals people`). The output is a titled person (`astronaut` or `doctor`).

The chaining section is where all the fun is happening. We are assigning the correct title to the unknown person `<P>`, depending only on her/his job. If the person drives a rocket, she/he is an astronaut, and if the person heals people, she/he is a doctor. Rules of the form:

    (
        MATCH
        (IDENTIFY (ID (NAME <...identifier...>) (TYPE <...type...>)))
        (ELEMENTARY (INPUT <...incoming term...>) (OUTPUT <...outgoing term...>))
    )
    
serve to assign a type range to an identifier, and more importantly, to mark the identifier equal within incoming and outgoing terms. In the previous example we have two such rules, one for each job. Naturally, there may be examples with more than one identifier, accordingly adding a new `(ID ...)` expression for each identifier under the `(IDENTIFY ...)` expression. The same identifier may also be used multiple times at the same side of a rule when they are required to match exactly the same expressions.

##### pattern matching in composite rules

We already noted that composite rules can be placed wherever elementary ones can. Thus, we can also embed a composite rule within any `MATCH` section. This construction may be used to specify additional assumptions under which the rule operates. This is shown in the following example:

    /*
        fruit substitution
    */
    
    (
        COMPOSITE
        (
            INPUT
            (ELEMENTARY (INPUT      TOP) (OUTPUT <<fruits> [<fruit> := <fruit>]>)
            (ELEMENTARY (INPUT <fruits>) (OUTPUT <<fruit>, <fruits>>            )
            (ELEMENTARY (INPUT <fruits>) (OUTPUT <fruit>                        )
            (ELEMENTARY (INPUT  <fruit>) (OUTPUT <ananas>                       )
            (ELEMENTARY (INPUT  <fruit>) (OUTPUT <banana>                       )
            (ELEMENTARY (INPUT  <fruit>) (OUTPUT <kiwi>                         )
            (ELEMENTARY (INPUT  <fruit>) (OUTPUT <mango>                        )
        )
        (
            CHAIN
            (
                MATCH
                (
                    IDENTIFY 
                    (ID (NAME <F>) (TYPE <fruits>))
                    (ID (NAME <X>) (TYPE <fruit> ))
                    (ID (NAME <Y>) (TYPE <fruit> ))
                )
                (
                    COMPOSITE
                    (
                        INPUT
                        (ELEMENTARY (INPUT TOP) (OUTPUT <<F> [<X> := <Y>]>))
                    )
                    (
                        CHAIN
                        (ELEMENTARY (INPUT <<F> [<X> := <Y>]>) (OUTPUT <F>))
                        (ELEMENTARY (INPUT                <X>) (OUTPUT <Y>))
                    )
                    (
                        OUTPUT
                        (ELEMENTARY (INPUT <F>) (OUTPUT BOT))
                    )
                )
            )
        )
        (
            OUTPUT
            (ELEMENTARY (INPUT            <ananas>) (OUTPUT <fruit> ))
            (ELEMENTARY (INPUT            <banana>) (OUTPUT <fruit> ))
            (ELEMENTARY (INPUT              <kiwi>) (OUTPUT <fruit> ))
            (ELEMENTARY (INPUT             <mango>) (OUTPUT <fruit> ))
            (ELEMENTARY (INPUT             <fruit>) (OUTPUT <fruits>))
            (ELEMENTARY (INPUT <<fruit>, <fruits>>) (OUTPUT <fruits>))
            (ELEMENTARY (INPUT            <fruits>) (OUTPUT BOT     ))
        )

The example inputs a list of fruits and a substitution expression. The output is the same list with substituted specified fruit in the list. Thus, inputting `ananas, banana, kiwi [banana := mango]`, output `ananas, mango, kiwi` is yielded.

Notice the similarity between embedded composite rules and ordinary elementary rules. `TOP` expression in the composite rule corresponds to an elementary rule left side. `BOT` expression in the composite rule corresponds to an elementary rule right side. Lastly, in `CHAIN` section of the composite rule, we put `TOP` to `BOT` expression connection along with all the assumptions under which the whole rule operates. The rule `(ELEMENTARY (INPUT <<F> [<X> := <Y>]>) (OUTPUT <F>))` connects input to output, while the rule `(ELEMENTARY (INPUT <X>) (OUTPUT <Y>))` does the actual substitution.

Resuming all learned by now, all of the above examples may seem like a very simple insight into *Expression flow* essence, but these kinds of formations are really all we need to express all the computational range promised in the introduction section of this exposure. With what we learned by now about *Expression flow*, we are able to transcribe *any* input form to *any* output form, however they may be interlinked. This is sometimes referred to as Turing completeness.

With this section, we are concluding theoretical *Expression flow* exposure. A few more or less advanced examples showing *Expression flow* in all its shine are covered in the following [3. practical examples](#3-practical-examples) section.

## 3. practical examples

In this section we bring three illustrative examples using only constructs learned in section [2. theoretical background](#2-theoretical-background). We will see how to express (1) Turing machine automata programming, (2) untyped lambda calculus functional programming, and (3) hyposequent logic programming. The choice of examples is represenative for showing how *Expression flow* handles different formal systems. The choice of examples is also representative for showing the universality of problem range on which *Expression flow* can provide solutions.

### 3.1. turing machines

[Automata theory](https://en.wikipedia.org/wiki/Automata_theory) is the study of abstract machines and automata, as well as the computational problems that can be solved using them. It is a theory in theoretical computer science. The word automata (the plural of automaton) comes from the Greek word αὐτόματος, which means "self-acting, self-willed, self-moving". An automaton (Automata in plural) is an abstract self-propelled computing device which follows a predetermined sequence of operations automatically.

A [Turing machine](https://en.wikipedia.org/wiki/Turing_machine) is an automata and mathematical model of computation that defines an abstract machine, which manipulates symbols on a strip of tape according to a table of rules. Despite the model's simplicity, given any computer algorithm, a Turing machine capable of simulating that algorithm's logic can be constructed.

The machine operates on an infinite memory tape divided into discrete *cells*. The machine has its *head* that positions over a single cell and can read or write a symbol to the cell. The machine keeps a track of its current *state* from a finite set of states. Finally, the machine has a finite set of *instructions* which direct reading symbols, writing symbols, changing the current machine state and moving the tape to the left or to the right. Each instruction consists of the following:

1. reading the current state and reading a symbol at the position of head
2. depending on (1.), writing a symbol at the position of head
3. either move the tape one cell left or right and changing the current state

The machine repeats these steps until it encounters the halting instruction.

Turing machine defined in *Expression flow* terms takes this form:

    /*
        general Turing machine example
        
         input: a set of rules and a starting tape states
        output: final tape states
    */
    
    (
        COMPOSITE
        (
            INPUT
            
            (ELEMENTARY (INPUT TOP) (OUTPUT <(<instrseq>): (<tape>)>))
            
            // instructions syntax
            (ELEMENTARY (INPUT  <instrSeq>) (OUTPUT <<instr>, <instrSeq>>              ))
            (ELEMENTARY (INPUT  <instrSeq>) (OUTPUT <instr>                            ))
            (ELEMENTARY (INPUT     <instr>) (OUTPUT <<head> to <bit><direction><state>>))
            (ELEMENTARY (INPUT      <head>) (OUTPUT <<state><bit>>                     ))
            (ELEMENTARY (INPUT <direction>) (OUTPUT <L>                                ))
            (ELEMENTARY (INPUT <direction>) (OUTPUT <R>                                ))
            (ELEMENTARY (INPUT     <state>) (OUTPUT <a#>                               ))
            (ELEMENTARY (INPUT     <state>) (OUTPUT <b#>                               ))
            ...
            (ELEMENTARY (INPUT     <state>) (OUTPUT <z#>                               ))
            (ELEMENTARY (INPUT       <bit>) (OUTPUT <0>                                ))
            (ELEMENTARY (INPUT       <bit>) (OUTPUT <1>                                ))
            (ELEMENTARY (INPUT       <bit>) (OUTPUT <()>                               ))
            
            // tape syntax
            (ELEMENTARY (INPUT <tape>) (OUTPUT <<cell><tape>>))
            (ELEMENTARY (INPUT <tape>) (OUTPUT <cell>        ))
            (ELEMENTARY (INPUT <cell>) (OUTPUT <bit>         ))
            (ELEMENTARY (INPUT <cell>) (OUTPUT <head>        ))
        )
        (
            CHAIN
            
            // extract each instructions
            (
                MATCH
                (
                    IDENTIFY
                    (ID (NAME<i>) (TYPE <instr>))
                    (ID (NAME <s>) (TYPE <instrSeq>))
                    (ID (NAME <t>) (TYPE <tape>))
                )
                (
                    (
                        COMPOSITE
                        (
                            INPUT
                            (ELEMENTARY (INPUT TOP) (OUTPUT <(<s>): (<t>)>))
                        )
                        (
                            CHAIN
                            (ELEMENTARY (INPUT    <(<i>): (<t>)>) (OUTPUT <instruction <i>: tape <t>>))
                            (ELEMENTARY (INPUT <(<i, s>): (<t>)>) (OUTPUT <instruction <i>: tape <t>>))
                            (ELEMENTARY (INPUT <(<i, s>): (<t>)>) (OUTPUT <(<s>): (<t>)>             ))
                        )
                        (
                            OUTPUT
                            (ELEMENTARY (INPUT <instruction <i>, tape <t>>) (OUTPUT BOT))
                        )
                    )
                )
            )
            
            // cannonically connect instructions to each tape segment
            (
                MATCH
                (
                    IDENTIFY
                    (ID (NAME <i>) (TYPE <instr>))
                    (ID (NAME <c>) (TYPE <cell> ))
                    (ID (NAME <t>) (TYPE <tape> ))
                )
                (ELEMENTARY (INPUT <instruction <i>: tape <<c><t>>>) (OUTPUT <instruction <i>: tape <t>>))
            )
            
            // apply instructions to tape segments
            (
                MATCH
                (
                    IDENTIFY
                    (ID (NAME <preb>) (TYPE <bit>  ))
                    (ID (NAME <pres>) (TYPE <state>))
                    (ID (NAME <sufb>) (TYPE <bit>  ))
                    (ID (NAME <sufs>) (TYPE <state>))
                    (ID (NAME <newb>) (TYPE <bit>  ))
                    (ID (NAME <news>) (TYPE <state>))
                    (ID (NAME    <t>) (TYPE <tape> ))
                )
                (
                    COMPOSITE
                    (
                        INPUT
                        (ELEMENTARY (INPUT TOP) (OUTPUT <instruction <instr>, tape <tape>>))
                    )
                    (
                        CHAIN
                        
                        // changing bit and state, moving head to the right
                        (
                            ELEMENTARY
                            (INPUT <instruction <<pres><preb> to <newb>R<news>>: tape <<<pres><preb>><<sufb><t>>>>)
                            (OUTPUT <<newb><<<news><sufb>><t>>>)
                        )
                        
                        // changing bit and state, moving head to the left
                        (
                            ELEMENTARY
                            (INPUT <instruction <<sufs><sufb> to <newb>L<news>>: tape <<preb><<<sufs><sufb>><t>>>>)
                            (OUTPUT <<<news><preb>><<newb><t>>>)
                        )
                    )
                    (
                        OUTPUT
                        (ELEMENTARY (INPUT <tape>) (OUTPUT BOT))
                    )
                )
            )
            
            // stop operations after halting instruction and accepting output
            (
                MATCH
                (IDENTIFY (ID (NAME <t>) (TYPE <tape>)))
                (ELEMENTARY (INPUT <<<#h><cell>><tape>>) (OUTPUT <<cell><tape>>))
            )
        )
        (
            OUTPUT
            
            // tape syntax
            (ELEMENTARY (INPUT          <()>) (OUTPUT <cell>))
            (ELEMENTARY (INPUT           <0>) (OUTPUT <cell>))
            (ELEMENTARY (INPUT           <1>) (OUTPUT <cell>))
            (ELEMENTARY (INPUT        <cell>) (OUTPUT <tape>))
            (ELEMENTARY (INPUT<<cell><tape>>) (OUTPUT <tape>))

            (ELEMENTARY (INPUT <tape>) (OUTPUT BOT))
        )
    )

An input to the above example could be an an instruction set for adding 1 to a specified binary number:

    (s#0 to 0Rs#, s#1 to 1Rs#, s#() to ()La#, a#1 to 0La#, a#0 to 1Rf#, f#0 to 0Rf#, f#1 to 1Rf#, f#() to ()Rh#): (()s#1001())

Here we have a set of instructions (state abbreviations are: `s#` for start, `a#` for add one, `f#` for finish, and  `h#` for halt), and a binary number `1001` prepended and postpended by `()` to indicate tape bounds. After processing, the example should expectedly output:

    ()1101()

The above example processes input in a single cycle. It is also possible to construct multi-cycle automata that allows to successively input more data as the process goes on. That kind of automata would exhange its states between cycles by feeding output back to input, along additional data, on each cycle.

It is common knowledge that Turing machine is taken as the most general kind of automata able to process any kind of input. Thus, by implementing Turing machine in terms of *Expression flow*, we are showing that any other kind of automata ([finite state machines](https://en.wikipedia.org/wiki/Finite-state_machine), [pushdown automata](https://en.wikipedia.org/wiki/Pushdown_automaton), ...) can also be implemented within. However, in practice, Turing machines are not commonly used in regular mainstream programming, yet they are only used in scientific researches to express some notions of mathematical computations. More common models of computation actively used in practical programming are covered in the following sections (functional and logic programming).

### 3.2. lambda calculus

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
            (ELEMENTARY (INPUT     TOP) (OUTPUT <lterm>          ))
            (ELEMENTARY (INPUT <lterm>) (OUTPUT <abst>           ))
            (ELEMENTARY (INPUT  <abst>) (OUTPUT <(λ<var>.<abst>)>))
            (ELEMENTARY (INPUT  <abst>) (OUTPUT <appl>           ))
            (ELEMENTARY (INPUT  <appl>) (OUTPUT <(<appl> <var>)> ))
            (ELEMENTARY (INPUT   <var>) (OUTPUT <<symbol><var>>  ))
            (ELEMENTARY (INPUT   <var>) (OUTPUT <symbol>         ))
            
            (ELEMENTARY (INPUT<symbol>) (OUTPUT <a>              ))
            (ELEMENTARY (INPUT<symbol>) (OUTPUT <b>              ))
            ...
            (ELEMENTARY (INPUT<symbol>) (OUTPUT <z>              ))
        )
        (
            CHAIN
            
            // alpha conversion
            (
                MATCH
                (
                    IDENTIFY
                    (ID (NAME <X>) (TYPE <var>  ))
                    (ID (NAME <Y>) (TYPE <var>  ))
                    (ID (NAME <M>) (TYPE <lterm>))
                )
                (
                    COMPOSITE
                    (
                        INPUT
                        (ELEMENTARY (INPUT TOP) (OUTPUT <(λ<X>.<M>)>))
                    )
                    (
                        CHAIN
                        (ELEMENTARY (INPUT <(λ<X>.<M>)>) (OUTPUT <(<aconv <Y> <M>)>))
                        (ELEMENTARY (INPUT          <X>) (OUTPUT <Y>               ))
                    )
                    (
                        OUTPUT
                        (ELEMENTARY (INPUT <(<aconv <Y> <M>)>) (OUTPUT BOT))
                    )
                )
            )
            
            // beta reduction
            (
                MATCH
                (
                    IDENTIFY
                    (ID (NAME <X>) (TYPE <var>  ))
                    (ID (NAME <M>) (TYPE <lterm>))
                    (ID (NAME <N>) (TYPE <lterm>))
                )
                (
                    COMPOSITE
                    (
                        INPUT
                        (ELEMENTARY (INPUT TOP) (OUTPUT <((<aconv <X> <M>>) <N>)>))
                    )
                    (
                        CHAIN
                        (ELEMENTARY (INPUT <((<aconv <X> <M>>) <N>)>) (OUTPUT <M>))
                        (ELEMENTARY (INPUT                       <X>) (OUTPUT <N>))
                    )
                    (
                        OUTPUT
                        (ELEMENTARY (INPUT <M>) (OUTPUT BOT))
                    )
                )
            )
        )
        (
            OUTPUT
            
            // syntax of lambda calculus
            (ELEMENTARY (INPUT               <a>) (OUTPUT <symbol>))
            (ELEMENTARY (INPUT               <b>) (OUTPUT <symbol>))
            ...
            (ELEMENTARY (INPUT               <z>) (OUTPUT <symbol>))
            
            (ELEMENTARY (INPUT          <symbol>) (OUTPUT <var>   ))
            (ELEMENTARY (INPUT   <<symbol><var>>) (OUTPUT <var>   ))
            (ELEMENTARY (INPUT             <var>) (OUTPUT <appl>  ))
            (ELEMENTARY (INPUT <(<appl> <prim>)>) (OUTPUT <appl>  ))
            (ELEMENTARY (INPUT            <appl>) (OUTPUT <abst>  ))
            (ELEMENTARY (INPUT <(λ<var>.<abst>)>) (OUTPUT <abst>  ))
            (ELEMENTARY (INPUT            <abst>) (OUTPUT <lterm> ))
            (ELEMENTARY (INPUT           <lterm>) (OUTPUT BOT     ))
        )
    )

This example evaluates lambda expressions, and as such, accepts inputs like `((λx.(x x)) ((λx.(x x)) a))`, in which case it yields the output like `((a a) (a a))`.

### 3.3. entscheidungsproblem

In mathematics and computer science, the [Entscheidungsproblem](https://en.wikipedia.org/wiki/Entscheidungsproblem) is a challenge posed by David Hilbert and Wilhelm Ackermann in 1928. The problem asks for an algorithm that considers, as input, a statement and answers "Yes" or "No" according to whether the statement is universally valid, i.e., valid in every structure satisfying the axioms.

Although entscheidungsproblem is generally undecidable, there exist a subset of logic on which entschedungsproblem can be solved: propositional logic. [Propositional logic](https://en.wikipedia.org/wiki/Propositional_calculus) is a branch of logic that deals with propositions (which can be true or false) and relations between propositions, including the construction of arguments based on them. Compound propositions are formed by connecting propositions by logical connectives. Unlike first-order logic, propositional logic does not deal with non-logical objects, predicates about them, or quantifiers. However, all the machinery of propositional logic is included in first-order logic and higher-order logics. In this sense, propositional logic is the foundation of first-order logic and higher-order logic.

In this section we bring a solution to enscheidungsproblem for [implicational propositional logic](https://en.wikipedia.org/wiki/Implicational_propositional_calculus). Since propositional logic can be reduced to implicational propositional logic, we consider that the solution holds for propositional logic, as well.

    <
        COMPOSITE
        <
            INPUT
            /*
                axioms
            */
            
            (
                MATCH
                (
                    IDENTIFY
                    (ID (NAME <a>) (TYPE <formula>))
                    (ID (NAME <b>) (TYPE <formula>))
                )
                (
                    ELEMENTARY
                    (INPUT  TOP)
                    (OUTPUT <(<a> → (<b> → <a>))>)
                )
            )
            (
                MATCH
                (
                    IDENTIFY
                    (ID (NAME <a>) (TYPE <formula>))
                    (ID (NAME <b>) (TYPE <formula>))
                    (ID (NAME <c>) (TYPE <formula>))
                )
                (
                    ELEMENTARY
                    (INPUT  TOP)
                    (OUTPUT (<((<a> → (<b> → <c>)) → ((<a> → <b>) → (<a> → <c>)))>)
                )
            )
            (
                MATCH
                (
                    IDENTIFY
                    (ID (NAME <a>) (TYPE <formula>))
                    (ID (NAME <b>) (TYPE <formula>))
                )
                (
                    ELEMENTARY
                    (INPUT TOP)
                    (OUTPUT <((<a> → <b>) → <a>) → <a>>)
                )
            )
            
            /*
                formulas
            */
            
            (ELEMENTARY (INPUT <formula>) (OUTPUT <(<formula> → <formula>)>))
            (ELEMENTARY (INPUT <formula>) (OUTPUT <atom>))

            (ELEMENTARY (INPUT <atom>) (OUTPUT <⊥>))
            (ELEMENTARY (INPUT <atom>) (OUTPUT <a>))
            ...
            (ELEMENTARY (INPUT <atom>) (OUTPUT <z>))
        >
        <
            CHAIN
        >
        <
            OUTPUT
            (ELEMENTARY (INPUT <formula>) (OUTPUT BOT))
        >

We put the three implicational logic axioms as the input top expressions, from which we may branch out to every other tautology that holds in propositional logic. Thus, the example accepts only implicational logic tautologies, reporting an error otherwise, which is analogous to what entscheidungsproblem asks to be solved. In the case of correct input, the output is exact copy of input.

## 4. related work

*Expression flow* is a metaprogramming system in the guise of rule-based programming system. There exist a lot of systems in both metaprogramming and rule-based programming field. Rather than thoroughly elaborating similarities and differences between *Expression flow* and each such system known to us, we bring hyperlinks to brief descriptions of selected languages from both fields, arranged in alphabetical order:

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

The most generally speaking, *Expression flow* may be used to express a wide variety of languages. Different languages may be used to express a wide variety of systems. Different systems, in turn may be used to express a wide variety of processes we experience around us. Being natural or artificial, many of these processes may deserve our attention while understanding and mastering them may be of certain importance to us. What will *Expression flow* represent, and where it will be used depends only on our imagination because with a kind of system like *Expression flow*, we are entering a nonexhaustive area of general knowledge computing where only our imagination could be a limit.
