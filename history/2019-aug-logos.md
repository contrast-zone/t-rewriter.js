# [language of general operational semantics](https://ivanvodisek.github.io/Logos/)  

*[Abstract]*

*Languages can be seen as forms of streams of symbols used to carry on, process, and exchange informations. Logos is also a language, but it is a general kind of a language that is able to describe and host any other language. Logos is also able to perform any intermediate data processing that hosted languages are supposed to perform. Being a general kind of a language, Logos represents all of the following:*

- *Metatheory language formalization*  
- *Theorem prover*  
- *Term rewriting system*  
- *Data computing environment*  

*This short exposure explores basic principles and reveals initial thoughts behind Logos.*

## table of contents  

- **[1. introduction](#1-introduction)**  
- **[2. defining logos](#2-defining-logos)**  
    - [2.1. syntax](#21-syntax)  
    - [2.2. structured expressions](#22-structured-expressions)  
    - [2.3. abstract expressions](#23-abstract-expressions)  
    - [2.4. basic semantics](#24-basic-semantics)  
    - [2.5. integration](#25-integration)  
- **[3. turing completeness](#3-turing-completeness)**  
- **[4. conclusion](#4-conclusion)**  

---

### 1. introduction  

*Logos* metatheory language is designed to be a computationaly complete hosting environment for any other language. This means that *Logos* should be able to understand a considerable amount of different languages, once we provide their definitions. Understanding an expression is ability to translate from the observed expression to a form that is already understood by a target environment. This translation is sometimes being done gradually, by iterating the starting expression over forms that get closer and closer to the final shape. In this context, we can say that understanding is relative to a target environment. And as the target environment may be the same as the starting environment, *Logos* may represent a [rewriting system](https://en.wikipedia.org/wiki/Rewriting) that may interpret discrete steps of calculations within general class of languages such are mathematics, logic, or different computational systems, being [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness), or not.

Notion of [operational semantics](https://en.wikipedia.org/wiki/Operational_semantics) for some language describes a set of rules used to translate expressions of that language to a language of target enviroment. Thus, acronym *LOGOS* stands for (L)anguage (O)f (G)eneral (O)perational (S)emantics. *Logos* is meant to be used as a language for describing operational semantics for any kind of language, in general case. It happens that such use subsumes an ability to perform calculations of any kind, making *Logos* appropriate for [declarative](https://en.wikipedia.org/wiki/Declarative_programming) describing of any kind of algorithm in general.

Necessary implication of forming a general operational semantics system is that such a system could represent a general [metatheoretical framework](https://en.wikipedia.org/wiki/Metatheory). Being able to reason about a whole range of theories from a single origin knowledge point opens up a lot of possibilities like defining or finding corelations between the different theories. Computational automation provided by today's computer processing power paired with the Internet institution may serve as igniting force for unifying and formally relating scientific researches across the world. This was one of the motives behind the creation of *Logos*. Other motives include preparing for possible creation of [symbolic artificial intelligence](https://en.wikipedia.org/wiki/Symbolic_artificial_intelligence). Even though symbolic approach might seem like a drifting away from [artificial general intelligence](https://en.wikipedia.org/wiki/Artificial_general_intelligence) (see [artificial neural network](https://en.wikipedia.org/wiki/Artificial_neural_network) as an opposite approach), there is a fair chance that the symbolic artificial intelligence could assist in deriving implicitly contained knowledge from observed environmetal data. Also, symbolic approach may support structure forms on top of which artificial neural networks could operate, thus forming a synergy between the two seemingly opposite philosophies in designing artificial intelligence.

Properties and purpose of *Logos* originate from very bold plans and ambitious dreams. If your interests overlap with those general guidelines, please continue reading, maybe you could use some of exposed materia in your own research.

### 2. defining logos  

In the early part of 20th century, mathematician David Hilbert had an inspiring idea of grounding all existing mathematics theories to a finite, complete set of axioms, and provide a proof that these axioms were consistent (see [Hilbert's program](https://en.wikipedia.org/wiki/Hilbert%27s_program)). Unfortunately, it turned up that this is not possible, due to [Gödel's incompleteness theorems](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems). Because of Gödel's incompleteness theorems, it is possible that different areas of mathematics have different axiomatic setups, and sometimes these setups may contradict each other, or may even be inconsistent alone, just to achieve completeness or other required properties of theories they want to describe.

Although Hilbert's program is not possible to completely realize, the idea of having all the theories described by the same language still seems very valuable. Obvious advantage of such a language is having parts of different theories mutually interact to produce implicitly contained informations. Because of Gödel's incompleteness theorems, *Logos* is not able to be tied to any particular axiomatic setup, yet it has to provide a way to bundle different axiomatic schemata to different theories, while taking care of which axioms fit which purpose and area. Further, *Logos* is not restricted just to mathematics and logic, yet it tries to achieve computational completeness, leaving enough room for its use outside of mathematics and logic, maybe in chemistry, physics, or even in other fields, including social sciences and software industry. By avoiding the impossible restriction of having a single consistent set of axioms from Hilbert's program, we are left only with a problem of defining a language that could handle different sets of axiomatic shemata, depending on their scope of use. This language definition is exactly what *Logos* tries to represent.

To fulfill such a role, *Logos* relies on a matter of computability of informations. Nature of computations is closely related to proving properties of arbitrary systems, as clearly stated in [Curry-Howard correspondence](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence). Reading programs as proofs and proofs as programs enables us to handle both interpretations by the same framework. Such a framework then becomes both a declarative programming language and a theorem prover, covering a broad area of possible uses. Because automated value computing and automated theorem proving are both of equal significance in forming different theories, equal attention is dedicated to both of them in creation of *Logos*. From programming world, influence of [s-expressions](https://en.wikipedia.org/wiki/S-expression) dominates. From theorem proving world, influence of [Hilbert style inference system](https://en.wikipedia.org/wiki/Hilbert_system) (notice the difference from Hilbert's program) dominates. Following these two essential concepts, we bring *abstract expression* patterns with implicitly hosted kind of Hilbert style inference system to form a [metalanguage](https://en.wikipedia.org/wiki/Metalanguage) representing *Logos*.

In this chapter, we define *Logos* language. We will define its syntax, talk about structured expressions, their degrees of abstraction, overview semantics of *Logos*, and at last, provide an operational model of input to output connection of intended behavior of *Logos* system, as seen from the outer world.

#### 2.1. syntax

Knowing that *Logos* handles value computing and theorem proving by the same outline, how does this outline, finally, look like? To get the first impression of *Logos* appearance, we bring its syntax definition in somewhat relaxed [Backus-Naur form](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form) (BNF):

    a-expr ::= ()
             | identifier
             | a-expr a-expr
             | «a-expr»
             | ›a-expr‹
             | (a-expr)

To be more precise, the following grammar represents the exact syntax for *Logos* in more strict, standard BNF:

             <start> ::= <a-expr-ws>
         <a-expr-ws> ::= <opt-whitespace> <a-expr> <opt-whitespace>
            <a-expr> ::= <primary>
                       | <primary> <whitespace> <a-expr>
           <primary> ::= "(" <opt-whitespace> ")"
                       | <identifier>
                       | "«" <a-expr-ws> "»"
                       | "›" <a-expr-ws> "‹"
                       | "(" <a-expr-ws> ")"
    <opt-whitespace> ::= ""
                       | <whitespace>

The starting grammar object is composed of *abstract expression* (or a-expression) that defines a derivative of structured expressions (or s-expressions). This derivative includes identifier concatenation, double and single angle quotes (`«`, `»` or `&laquo;`,  `&raquo;` and `›`, `‹` or `&rsaquo;`, `&lsaquo;`), together with round braces used for optional grouping of underlaying s-expressions. If we want to use any of specials symbol from this grammar in an identifier, we prepend it with escape character `\`.

The following four sections describe meanings of different expression formations in *Logos*.

#### 2.2. structured expressions  

[Structured expressions](https://en.wikipedia.org/wiki/S-expression) (or s-expressions) are the most fundamental building blocks in *Logos*. Each s-expression is either an identifier or an expression of the form `(x y)`, with `x` and `y` being another s-expressions. Lists are built by concatenating s-expressions, while trees are built by nesting lists. We may also exclude round braces from s-expressions, in which case expressions associate to the right. Thus, to write `a b c` is the same as to write `(a (b c))`. S-expressions can be visually represented by graphical trees. For example, s-expression `((2 + 3 + 4) * (5 + 6))` would look like this:

        /\
       /  \
      /\   \
     /  \   \
    2   /\   \
       /  \   \
      +   /\   \
         /  \   \
        3   /\   \
           /  \   \
          +    4  /\
                 /  \
                *   /\
                   /  \
                  5   /\
                     /  \
                    +    6

It is also possible to form an empty s-expression, denoting it by `()`. Empty s-expression, among other uses, may find its use in detection of manual list termination.

#### 2.3. abstract expressions  

In spite of their simplicity, although s-expressions alone are very powerful formations, we will add a new dimension to them. It will be a dimension of data abstraction level. We will call this s-expressions derivative as *abstract expressions* (or a-expressions). In many cases, it is required to define general, abstract forms in contrast to specific, concrete forms of data. Thus, on a rough scale, we may divide data into variables and constants. Looking over this rough scale from a perspective of *a-expressions*, variables have higher abstraction degree, while constants have lower abstraction degree. Our new *a-expressions* constructs take a further step of interpolating over different layers of abstraction, where both variables and constants are called identifiers, representing the same notions that may be seen as variables or constants only in their correlation with mutually related layers of abstraction. An identifier is considered a variable in relation to lower layers, while it is considered a constant in relation to higher layers. These layers form an abstraction tree where lower branches host any number of guesting higher branches recursively. The lowest hosting branch has the least abstraction degree, while the highest guesting branches have the greatest abstraction degree.

Entering in or out of branches of abstraction is controlled by using `«...»` and `›...‹` angle quote pairs. `«...»` pair lifts to a higher degree variable scope, while `›...‹` pair drops to a lower degree variable scope. To get an impression of *a-expressions*, the following example illustrates controlling entering in and out of different abstraction degrees:

    ... abstraction degree 0 ... 
    «
        ... abstraction degree 1 ...
        «
            ... abstraction degree 2 ...
            ›
                ... abstraction degree 1 ...
            ‹
            ... abstraction degree 2 ...
            «
                ... abstraction degree 3 ...
            »
            ... abstraction degree 2 ...
        »
        ... abstraction degree 1 ...
        ›
            ... abstraction degree 0 ...
        ‹
        ... abstraction degree 1 ...
    »
    ... abstraction degree 0 ...

As a specific example, we may write the following math expression:

    «(a ›⋅‹ b) ›+‹ (a ›⋅‹ c)»

where identifiers `a`, `b` and `c` are at abstraction degree 1, while identifiers `⋅` and `+` are at degree 0. Identifiers `a`, `b` and `c` illustrate variables, in contrast to identifiers `⋅` and `+`, which illustrate constants.

Generally, identifiers are considered as pattern match placeholders. Similar identifiers are related over different degree scopes as an implication (lower degree pattern match placeholder implies higher one). Similar identifiers in the same scope are meant to match equal expressions. Similar identifiers in neighbor scopes are unrelated, unless they are similar to an identifier in one of the parent scopes.

Degre of a part of a-expression is equal to the highest relative degree of contained identifiers.
- Examples of zeroth degree a-expressions are expressions like `O₂` or `H₂O`. Of course, we may combine many space delimited identifiers, optionally using groupping braces, to form zeroth degree a-expressions which are essentially ordinary s-expressions.
- With first degree a-expressions we get a chance to implicationally relate zeroth and first degree identifiers. Thus, `oxygen «oxygen»` a-expression consists of two parts, where the left part implies the right part. Following this example, we may interpret `oxygen O₂` and `oxygen gas` expressions as implications. Then, if we write `oxygen` in the same context, it would be [reduced](https://en.wikipedia.org/wiki/Graph_reduction) to `O₂` and `gas`.
- With higher degree a-expressions we may form some more interesting constructs like `«a «a»»`. This construct takes two parts without concerning how the parts look like, and relates them by implication where the left part implies the right part. This way we may interpret `water H₂O`, `water liquid`, or even `carbon supports-life` as implications of left sides to right sides.

First and higher order a-expressions are usually anchored to the outer world by exposing identifiers in zeroth order constructs using `›...‹` pairs which serve as recognition points, when pattern matching other a-expressions. For example, we may write `«a ›->‹ «a»»` as a definition of implication operator, using `->` identifier as a constant for pattern matching. An example of matching such a definition would be: `lactose -> C₁₂H₂₂O₁₁`.

To conclude, here described *a-expressions* introduce hierarchically related abstraction degrees for identifiers. By using `«...»` and `›...‹` angle quote pairs, a-expressions provide all the needed information to deal with abstract patterns, including variable-constant and variable-variable correlations, while strictly controlling the scope of their interactions. All of this is done without a help of any specific keywords, thus not polluting a namespace available to our identifiers.

#### 2.4. basic semantics

Inference mechanism is one of the properties that *a-expressions* bring in their core setup. In this section we will derive basic logic operators used to perform general inference, utilizing only abstracted identifiers related in their similarity of appearance. We will extract basic logic operators as fragments which would finally be composed into a meaningful whole in the section following the current one.

Let's start with *"implication"*, the first essential notion wired into *a-expressions*. The definition is the same as we noted in the previous section, while introducing *a-expressions*:

- *implication*: `«a ›->‹ «a»»`

Here we have an identifier `›->‹` placed at zeroth degree abstraction, representing a constant to pattern match in the further use. Identifier `a` is written twice, having first abstraction degree at the left side, and second abstraction degree at the right side. This relation is what will connect any expression that pattern matches against this definition, making a clear implicational relation between the left and the right side of `›->‹`.

The second essential notion wired into *a-expressions* is a notion of falsehood. The definition of falsehood follows from the fact that *Logos* aims to represent a complete algorithmic solution. [Gödel's incompleteness theorems](https://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems) state that any complete system has to be contradictory. To express falsehood, imagine that we want to define a universe variable `«U»` that stands for any expression definable in *Logos*. When evaluated by logic, `«U»` may even stand for `a ∧ ¬ a`, which is one of the possible values in a complete system, and that brings us to a conslusion that `«U»` should be evaluated to a falsehood as a contradictory notion:

- *falsehood*: `«U»`

Note that instead of `U`, we may use any fresh new identifier, as long as it doesn't have a similarity match in its hosting scopes, thus representing a notion that is about to be interpreted as falsehood. We may also note that this definition will align with [principle of explosion](https://en.wikipedia.org/wiki/Principle_of_explosion), regarding to different logical systems.

Further, we choose to define a cozy set of essential logical operators (without axioms) that we find useful in [term rewriting](https://en.wikipedia.org/wiki/Rewriting) as a base for both performing computations and theorem proving. Having the implication and the falsehood already defined, we are ready to use them to define other logic operators, since these two represent a [functionally complete](https://en.wikipedia.org/wiki/Functional_completeness) combination. We are presenting definitions for *complement*, *and*, and *or* operators:

- *complement*: `«(›~‹ a) ›->‹ (a ›->‹ U)»`
- *and*: `«(a ›/\‹ b) ›->‹ ((a ›->‹ b ›->‹ U) ›->‹ U)»`
- *or*: `«(a ›\/‹ b) ›->‹ ((a ›->‹ U) ›->‹ (b ›->‹ U) ›->‹ U)»`

Explanation for *"complement"* operator is: if a parameter is `a` then it is false, therefore expression like `~ A` holds for anything except `A`. Definitions for *"and"* and *"or"* are derived from properties of relation between implication and falsehood.

Although there is a similarity between *"complement"* operation and logical *"not"* operator, the diference is in that *"not"* operator requires a negated expression to be explicitly stated to hold, while *"complement"* holds for any other expression except the complemented one. This is the crucial distinction between logical systems similar to classical or intuitionistic systems, and the essential logic system we are defining in this section. This distinction is introduced because of its positive properties according to pattern matching, while enabling a possibility to define further a set of strict logic operators within the terms of these essential ones.

Considering falsehood, it has one interesting property regarding to implication that is wired into a-expressions. It can be shown that `a -> b` also yields its dual, `~b -> ~a`. Therefore we choose our a-expressions to, beside each implication, manage also the duals of them. This effectively turns the definition for `\/` operator into an analogy to [resolution rule](https://en.wikipedia.org/wiki/Resolution_(logic)).

Finally, we will define a substitution mechanism that is widely used and shown to be useful in formal data computation. Substitution mechanism consists of three parts: (1) a formula we operate on, (2) a variable we are substituting, and (3) a value we are substituting the variable for:

- *substitution*: `«(f ›[‹ x ›:=‹ «x» ›]‹) ›->‹ f»`

Substitution definition states that inside a formula `f`, we relate all the expressions accepted before `:=` operator to imply whatever comes after `:=` operator in square brackets. Following this definition, if we write something like `(x + 2)[x := 5]`, it will result with `(5 + 2)`. It is possible to chain multiple substitutions in a way that `(x + y)[x := 5][y := 2]` results again with `(5 + 2)`.

We just defined semantics of basic logical operators in terms of *Logos*, and this is the point where we need to grapple with precedence of these operators. To complete the definition of our basic logic, what is missing is operator use syntax that would discard unwanted ambiguous interpretations. To properly cope with this problem, we will exploit an interesting asset that comes with a-expressions, and that is implicit expression grouping. Implicit expression grouping is carried by a parsing grammar expressed by essential logic operators themselves. In the following example, we show how to simulate a [context free grammar](https://en.wikipedia.org/wiki/Context-free_grammar) built specifically for our purposes of defining a syntax for logical operators:

    (
        (   (                  impl  ) -> start     ) /\
        (   (            or -> impl  ) -> impl      ) /\
        (   (                    or  ) -> impl      ) /\
        (   (             and \/ or  ) -> or        ) /\
        (   (                   and  ) -> or        ) /\
        (   (            not /\ and  ) -> and       ) /\
        (   (                   not  ) -> and       ) /\
        (   (             ~ primary  ) -> not       ) /\
        (   (               primary  ) -> not       ) /\
        (   (  primary [«a» := «b»]  ) -> primary   ) /\
        (   (            \( impl \)  ) -> primary   ) /\
        (
            (
                «var» /\
                ~ («a» -> «b»      ) /\
                ~ («a» \/ «b»      ) /\
                ~ («a» /\ «b»      ) /\
                ~ (~ «a»           ) /\
                ~ («f» [«a» := «b»])
            ) -> primary
        ) /\
        start
    )
    
This context free grammar is presented by [production rules](https://en.wikipedia.org/wiki/Context-free_grammar#Production_rule_notation) written in reversed manner with left and right sides being swapped. However, *a-expressions* do not stop at context free grammars in [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy), yet they fully extend to [unrestricted grammars](https://en.wikipedia.org/wiki/Unrestricted_grammar), thus exposing a wide range of expressivity. General grammar defining is a matter that deserves a whole book on its own, and we will not develop it this short exposure. Instead, interested readers are invited to explore this whole new world of expression grammars by searching the Internet.

[Hilbert style](https://en.wikipedia.org/wiki/Hilbert_system) inference system type that we announced to support, is based on the implication operator, and we extend it by the falsehood notion. Although this setup may share some similarities with [implicational logic](https://en.wikipedia.org/wiki/Implicational_propositional_calculus), the difference between *complement* and logical *not* operator, and the ability to operate on contradictory sets of formulas make this setup more similar to Hilbert style system type.

To summarize, in this section we defined basic semantics and syntax of logic operators, deriving semantics from implication and falsehood wired into *a-expressions*, while using a context free grammar to define the syntax. From this process, the *Logos* inference system is already beginning to shape in. But to completely reveal the inference system, we still need to explain a notion of contexts of applicable rules, and that is included in the next section.

#### 2.5. integration

This section will show how to connect syntax and semantic defititions to actual computations we would perform. In the previous section we learned how to form rules relative to implication. These rules have their context of operation, where contexts restrict a scope of reach in which rules are applicable. Contexts are relative to a place of rule appearance. We distinct two differnt kinds of contexts, namely *syntactic* and *semantic* contexts.

*Syntactic contexts* behave in a following way: each rule is applicable recursively at any expression that is a parent of the rule. To explain this in more detail, we will analyze the following example:

    ((«a ›->‹ «a»») -> (... arbitrary content ...))

We used the outermost round braces just to emphasize the entire expression structure, although they are not strictly required. Here, we introduced two implication symbols. The left one is in implication definition, and it is applied to the right one because the right one forms a parent expression of the left one, thus laying in the syntactic context of the left one.

*Semantic contexts* follow from natural properties of the implication. It can be shown that in logic, from expression `a -> b -> ... -> c` follows `a -> (a /\ b) -> ... -> (a /\ b /\ ... /\ c)`, which means that any rule in an implication sequence can interact with all the rules positioned to its left side. In short, the right side of an implication lays in semantic context of its left side, making the rules in the left side applicable to all the the expressions in the right side.

Now that we have defined syntax and semantic contexts, we will introduce an essential notion we will use to restrict (or enable) a set of rules to operate only in a scope of our interest:

    ««(p ››<-‹‹ ›p‹) ››->‹‹ p»»
    
Our new `... <- ...` rule takes two parameters, connects them by implication (remember analogous `«a «a»»` kind of abstraction?) and returns the one to the left. Finally, we may fuse the definitions from the previous section into a meaningful whole, representing essential logic: 

    ELog -> (
        (
            (
                (   (                  impl  ) -> start     ) /\
                (   (            or -> impl  ) -> impl      ) /\
                (   (                    or  ) -> impl      ) /\
                (   (             and \/ or  ) -> or        ) /\
                (   (                   and  ) -> or        ) /\
                (   (            not /\ and  ) -> and       ) /\
                (   (                   not  ) -> and       ) /\
                (   (             ~ primary  ) -> not       ) /\
                (   (               primary  ) -> not       ) /\
                (   (  primary [«a» := «b»]  ) -> primary   ) /\
                (   (            \( impl \)  ) -> primary   ) /\
                (
                    (
                        «var» /\
                        ~ («a» -> «b»      ) /\
                        ~ («a» \/ «b»      ) /\
                        ~ («a» /\ «b»      ) /\
                        ~ (~ «a»           ) /\
                        ~ («f» [«a» := «b»])
                    ) -> primary
                ) /\
                start
            )
        ) <- (
            («a ›->‹ «a»») /\
            «(›~‹ a) ›->‹ (a ›->‹ U)» /\
            «(a ›/\‹ b) ›->‹ ((a ›->‹ b ›->‹ U) ›->‹ U)» /\
            «(a ›\/‹ b) ›->‹ ((a ›->‹ U) ›->‹ (b ›->‹ U) ›->‹ U)» /\
            «(f ›[‹ x ›:=‹ «x» ›]‹) ›->‹ f»
        )
    )

We just defined a kind of a package we will use by the `... <- ...` construct in the most of the examples in the rest of this exposure. We will refer to this package from the rest of examples by noting `ELog` symbol. The package `ELog` is consisted of semantic logic rules (the right side of `<-` symbol) applied to syntax logic rules (the left side of `<-` symbol). `ELog` package may be considered as an embodiment of one of the possible Turing complete theories we would use to build up more complicated ones.

Having defined essential logic package, we are ready to explain the inference process. *Logos* is actually a [term rewriting system](https://en.wikipedia.org/wiki/Rewriting) with a property of recording all the rules applying iteratively to given expressions. Relative to an expression, *Logos* seeks for applicable implications according to their contexts, matches their left sides against the expression, and outputs their right sides to an [abstract semantic graph](https://en.wikipedia.org/wiki/Abstract_semantic_graph). To show this process in action, we may, for example define some basic operations on natural numbers. Natural number constants syntax may be defined on a following way:

- zero is defined as `zero`
- one is defined as `one zero`
- two is defined as `one one zero`
- ...

while semantic operations on them may be defined as:

- increment operation is defined as `«(›inc‹ x) ›->‹ (›one‹ x)»`
- decrement operation is defined as `«(›dec‹ (›one‹ x)) ›->‹ x»`

Regarding this setup, the following syntax and semantic definition holds:

    (
        NatRec -> (
            (
                (zero -> Nat) /\
                ((one Nat) -> Nat) /\
                ((inc Nat) -> Nat) /\
                ((dec Nat) -> Nat) /\
                Nat
            ) <- (
                «(›inc‹ x) ›->‹ (›one‹ x)» /\
                «(›dec‹ (›one‹ x)) ›->‹ x»
            )
        )
    ) <- ELog

We can now test how some calculations would take a place:

    (
        (
            x -> (inc zero)
        ) /\ (
            dec x
        )
    ) <- (
        ELog /\ NatRec    
    )

Evaluating this expression would produce something like the following abstract semantic graph:

    (
        (
            x -> Nat
                 ▲  ┏                 ┓
                 ┗━━┫ one Nat         ┃
                 ▲  ┃     ▲  ┏      ┓ ┃
                 ┃  ┃     ┗━━┫ zero ┃ ┃
                 ┃  ┗        ┗      ┛ ┛
                 ┃  ┏                 ┓
                 ┗━━┫ inc Nat         ┃
                    ┃     ▲  ┏      ┓ ┃
                    ┃     ┗━━┫ zero ┃ ┃
                    ┗        ┗      ┛ ┛
        ) /\ (
            Nat
            ▲  ┏      ┓
            ┗━━┫ zero ┃
            ▲  ┗      ┛
            ┃  ┏                            ┓
            ┗━━┫ dec Nat                    ┃
               ┃     ▲  ┏                 ┓ ┃
               ┃     ┗━━┫ one Nat         ┃ ┃
               ┃     ▲  ┃     ▲  ┏      ┓ ┃ ┃
               ┃     ┃  ┃     ┗━━┫ zero ┃ ┃ ┃
               ┃     ┃  ┗        ┗      ┛ ┛ ┃
               ┃     ┃  ┏                 ┓ ┃
               ┃     ┗━━┫ inc Nat         ┃ ┃
               ┃     ▲  ┃     ▲  ┏      ┓ ┃ ┃
               ┃     ┃  ┃     ┗━━┫ zero ┃ ┃ ┃
               ┃     ┃  ┗        ┗      ┛ ┛ ┃
               ┃     ┃  ┏   ┓               ┃
               ┃     ┗━━┫ x ┃               ┃
               ┗        ┗   ┛               ┛
        )
    )
    ▲  ┏     ┓
    ┗━━┫ ... ┃
       ┗     ┛
    
This abstract semantic graph actually represents all the computations performed by *Logos* against the starting expression. Tree branching depth is arranged in a way that the deepest branches contain fragments from the starting expression we evaluate, while the shallowest branches contain the end results of computations. Because of the nature of language grammars, it is sometimes necessary to lower a few steps down from the shallowest branches to extract meaningful data. In a case of previous example, what we needed to know was `one zero` expression from the first graph fragment and `zero` from the second graph fragment.

Relative to the previous example, one might ask for a reason: "What about derivations that contain essential logic syntax rules? Why aren't they shown in the example?" Indeed, those derivations would be a compound part of the output, but we choose to omit them because of readability of the output. This omitting greatly improves the output readability, and we might consider even omitting all the syntax rules relative to any construct, thus exposing only the semantic part derivations. This would be a matter of specific user interface that might hold omitting rules within its configuration resources.

If we allow ourself not to get intimidated by abstract semantic graphs, we should find out that these graphs, beside a computation history, in the same time contain proofs about how the deepest graph branches (formed from the starting expression) produce the shallowest graph branches (the final result). Clearly, this important property would allow us to use *Logos* as a thoerem prover. If we use *Logos* as a theorem prover then a theory behavior and axioms would be contained in the semantic sections of our languages, proper theory use would be placed in the syntax sections, while starting assumptions would be noted in expressions we want to evaluate to produce possible proofs.

Finally, it would be worth mentioning that implication rules may have, or may not have a property of [normalization](https://en.wikipedia.org/wiki/Normalization_property_(abstract_rewriting)). This means that it is possible for inference mechanism to keep running forever (or until memory resources are exhausted), as it could be a case in the following input example:

    «x ›->‹ (›one‹ x)»;

Evaluating the output of this input would never terminate, since the rule is eternally recursively feeding its right side to itself, thus producing an infinite sequence:

    «x ›->‹ (›one‹ (›one‹ (›one‹ (...))))»;

Under some conditions, some similar behaviors may be resolved using [lazy evaluation](https://en.wikipedia.org/wiki/Lazy_evaluation) techniques underneath the surface of implementation, but in general case, similar behaviors could represent a problem, due to undecidability of [Halting problem](https://en.wikipedia.org/wiki/Halting_problem). To properly cope with this problem, in some cases it is necessary to perform controlled recursion infernece, so we could reject further recursion steps where we find it appropriate. Classical conditional ruling could be used to trim off branches of recursion we don't find interesting. This is a closed issue in information science, and it is closed in such a way that it can not be automatically resolved on general level (see the Halting problem), as long as we want to retain algorithmic completeness of our system. Because of this, we are required to perform finding ad-hoc solutions for restricting infinite recursions when writing *Logos* expressions.

With this section, we conclude the defining of *Logos* language. In this chapter we exposed the syntax, overviewed basic s-expressions, explained how to form abstractions, attached some semantics to these abstractions, and we saw how to integrate expressions while performing the inference. The next chapter tests Turing completeness of *Logos*.

### 3. turing completeness

To test [Turing completeness](https://en.wikipedia.org/wiki/Turing_completeness) of *Logos*, it is enough to express any Turing complete language in *Logos* terms. One of such languages is [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus). Lambda calculus (also written as λ-calculus) is a formal system in mathematical logic for expressing computation based on function [abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science)) and [application](https://en.wikipedia.org/wiki/Function_application) using variable binding and substitution. It is very simple, but powerful system. Among other uses it has found a way to be an inspiration for a lot of [functional programming languages](https://en.wikipedia.org/wiki/Functional_programming). In this section, we will define its simplest, untyped form.

Syntax of lambda calculus is surprisingly simple. A lambda term is one or a combination of the following:

- *variable in a form of:* `x`
- *abstraction in a form of:* `λx.M` (where `x` is a variable; `M` is a lambda term)
- *application in a form of:* `(M N)` (where `M` and `N` are lambda terms)

Semantics of lambda calculus, written in a relaxed language, include

- *α-conversion:* `(λx.M) -> (λy.M[x:=y])`
- *β-reduction:* `((λx.M) N) -> (M[x:=N])`

α-conversion is renaming of variables used to avoid [name collisions](https://en.wikipedia.org/wiki/Name_collision). β-reduction is actual operation carying process of replacing bound variables with the argument expression in the body of the abstraction. Translated to *Logos*, lambda calculus has the following form: 

    ULambdaExp -> (
        (
            (
                ( (            λvar ) -> λexp ) /\
                ( (   λ λvar . λexp ) -> λexp ) /\
                ( ( \( λexp λexp \) ) -> λexp ) /\
                (
                    (
                        «var» /\
                        ~ ( λ «x» . «y» ) /\
                        ~ ( «x» «y»     )
                    ) -> λvar
                ) /\
                λexp
            ) <- (
                «(›λ‹ x ›.‹ M) ›->‹ (›α-λ‹ y ›.‹ (M ›[‹ x ›:=‹ y ›]‹))» /\
                «((›α-λ‹ x ›.‹ M) N) ›->‹ (M ›[‹ x ›:=‹ N ›]‹)»
            )
        ) <- ELog
    )

Here we have two semantic formations, the first one being responsible for α-conversion, and the second one being responsible for β-reduction of α-converted terms. As supposed, `ULambdaExp` applied to a lambda term in *Logos* should properly evaluate it, so the following example:

    (
        ((λ a . a) b)
    ) <- ULambdaExp

should evaluate to:

    λexp
    ▲  ┏                   ┓
    ┗━━┫ λvar              ┃
    ▲  ┃ ▲  ┏            ┓ ┃
    ┃  ┃ ┗━━┫ b          ┃ ┃
    ┃  ┃    ┃ ▲  ┏     ┓ ┃ ┃
    ┃  ┃    ┃ ┗━━┫ ... ┃ ┃ ┃
    ┃  ┗    ┗    ┗     ┛ ┛ ┛
    ┃  ┏     ┓
    ┗━━┫ ... ┃
       ┗     ┛

Beside untyped lambda calculus, as explained by [lambda cube](https://en.wikipedia.org/wiki/Lambda_cube) framework, there also exist various typed versions of lambda calculus in relation to dependency between types and terms. Nevertheless, for a sake of keeping this exposure short, we will not develop the typed versions here.

### 4. conclusion  

If properly performed, there may be numerous kinds of uses of the *Logos* inference mechanism. One use may be in editing input in sessions that produce some mathematical, logical, or other kinds of computations, while looping back to editing sessions until we are satisfied with the output. Some other, maybe industrial use may involve compiling a program source code to some target code like Webassembly. Such a source code then may be easily extended by custom syntax and semantic rules, which would make a case for ever evolving programming language with flexible appearance. In other situations, it is also included that we could form a personal, classical business, or even scientific knowledge base with relational algebra rules, so we can navigate, search, and extract wanted informations. Ultimately, data from knowledge base could mutually interact using on-demand learned inference rules, thus developing a full blown logical reasoning system, ready to draw complex decisions on general system behavior. And this partial sketch of possible uses is just a tip of the iceberg because with a kind of system like *Logos*, we are entering a nonexhaustive area of general knowledge computing where only our imagination could be a limit.

Knowledge, as valuable notion to the human kind, could be used in various ways to elevate a quality of life for any species known to us. Logos tries to tame the very knowledge mining in a hope that it would be used for altruistic reasons, at least to help us to avoid hurting anyone alive, if not anything more. Please, let's not abuse this intention.

