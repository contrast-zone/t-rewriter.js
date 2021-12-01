# introduction to Intermezzo programming language

> // under construction //

## table of contents

- [x] 1. introduction
- [x] 2. theoretical background
    - [x] 2.1. syntax
    - [x] 2.2. semantics
        - [x] 2.2.1. composite rules
        - [x] 2.2.2. elementary rules
- [ ] 3. practical examples
    - [ ] automata programming
        - [ ] combinational logic
        - [ ] finite-state machine
        - [ ] pushdown automation
        - [ ] Turing machine
    - [ ] functional programming
    - [ ] logic programming
- [x] 4. related work
- [x] 5. conclusion

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
                 
         <rule> := <elem-rule>
                 | <comp-rule>
                 
    <elem-rule> := (ELEMENTARY <input> <output>)
                 | <eqlz-rule>
      
        <input> := TOP
                 | <comp-term>
                 
       <output> := <comp-term>
                 | BOT
                 
    <eqlz-rule> := (EQUALIZE (IDENTIFY <domains>) <elem-rule>)
        
      <domains> := <domain> <domains>
                 | <domain>
         
       <domain> := (DOMAIN <elem-term> <comp-term>)

In addition to the above grammar, user comments have no meaning to the system, but may be descriptive to humans, and may be placed wherever a whitespace is expected. Single line comments are introduced by `//`, and reach until the end of line. Multiline comments begin with `/*`, and end with `*/`, so that everything in between is considered as a comment.

Note that the above grammar merely indicates existence of `<elem-term>` (elementary terms) and `<comp-term>` (composite terms), which we will have a chance to examine thorougly in the semantics section. Also note that these two differ from `<elem-rule>` (elementary rules) and `<comp-rule>` (composite rules) that operate on those terms. Additionally, terms are augmented by `TOP` and `BOT` constants representing entry and exiting points of rule inference, respectively.

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

Related to an arbitrary system it is describing, the rhombus is entirely consisted of directed production rules linking `TOP` and `BOT` constants. When interpreting the rhombus on a specific example, we provide an input as a string expression. The task is to extract the output string expression. As the first step, we verify if the input deduces from `TOP` in a process called forward chaining, using provided `input rules`. If the deduction is successful, to compute the output, next we try to abduce the same input from `BOT` in a process called backward chaining, using provided `output rules` and `chaining rules` together. If the abduction is successful, the output is then contained inside the composed abduction tree. Lastly, we have to extract the appropriate output from the abduction tree, conforming only `output rules`. There may be many valid parallel output candidates, but we choose the deepest one from the first available link to `BOT`.

Observing the inference process from the inside, the explained procedure is a combination of forward and backward chaining processes. Observing from the outside as a whole, the entire procedure is called forward chaining. It answers the question: "If the input is X, what is an output of the system?" Nevertheless, one may also be interested in compound backward chaining, answering questions like: "What should be an input if the output of the system is Y?" Utilizing production rules, the procedure for obtaining answers to the later questions should be similar to the procedure for obtaining answers to the former questions. The only difference would be that we have to switch over input and output sides in the same procedure of inferring the answer.

Because *Intermezzo* systems operate on sequences of characters, we can interpret input and output rules in a sense of incoming and outgoing syntax rules while interpreting chaining rules in a sense of semantic connections between input and output language. This makes *Intermezzo* siutable for representing a variety of languages based on production rules definitions.

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

To get familiar with this kind of rule organization, we will examine three simple examples while at the same time explaining kinds of terms and their interdependence.

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

Notice the natural data flow in the example. If we've been intimidated by all the descriptions about data flow and symmetry of expressions, now is the time to let go all the fears. The data flows from left to right, from top to bottom, and that's it.

Although *Intermezzo* system seems like a bit of an overkill for this example, let's move further to composite terms to see what happens.

##### composite terms

Composite terms are consisted of more than one elementary terms, each enclosed within its own `<` and `>` symbols pair. For example, `<It's a <adjective> day>` is a composite term embracing `<adjective>` elementary term. Another example of composite term may be `<<noun> is <adjective>>` containing `<noun>` and `<adjective>` elementary terms. We may nest elementary terms within composite terms in any count and depth we want, but in the most cases, one or two levels should be enough to harness the purpose of composite terms.

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
    
serve to assign a domain range to an identifier, and more importantly, to make the identifier equal within incoming and outgoing terms. In the previous example we have two such rules, one for each job. Of course, there may be examples with more than one identifier, accordingly repeating the `(DOMAIN ...)` expressions under the `(IDENTIFY ...)` expression.

This example may seem like a very simple insight into *Intermezzo* essence, but these kinds of formations are really all we need to express all the computational range promised in the introduction section of this exposure. With what we learned by now about *Intermezzo*, we are able to transcribe *any* input form to *any* output form, how ever they may be interlinked.

With this section, we are concluding theoretical *Intermezzo* exposure. A handful of more or less advanced examples showing *Intermezzo* in all its shine is covered in [3. practical examples](#3-practical-examples) section.

## 3. practical examples

In this section we bring three illustrative examples using only constructs learned in section [2. theoretical background](#2-theoretical-background). We will see how to express (1) a characteristic set of automata, (2) untyped lambda calculus, and (3) hyposequent logic. The choice of examples is represenative for showing how *Intermezzo* handles different formal systems. The choice of examples is also representative for showing the universality of problem range on which *Intermezzo* can provide solutions.

### automata programming

#### finite-state machine

#### pushdown automation

#### Turing machine

### functional programming

### logic programming

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

The most generally speaking, *Intermezzo* may be used to express a wide variety of languages. Different languages may be used to express a wide variety of systems. Different systems, in turn may be used to express a wide variety of processes we experience around us. Being natural or artificial, many of these processes may deserve our attention while understanding and mastering them may help us elevating a quality of life of all living beings. And at the end of the process, shouldn't that be the most important thing to us?
