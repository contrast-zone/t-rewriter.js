    // work in progress //

# Systemath

> __*[intended audience]*__  
> 

> __*[short description]*__  
> 

> __*[references]*__  
> 

## table of contents

- [ ] [1. introduction](#1-introduction)
- [ ] [2. theoretical background](#2-theoretical-background)
    - [ ] [2.1. syntax](#21-syntax)
    - [ ] [2.2. semantics](#22-semantics)
        - [ ] [2.2.1. rule basics](#221-rule-basics)
            - [ ] [basic input/output example](#basic-input-output-example)
            - [ ] [term alternations](#term-alternations)
            - [ ] [pattern matching](#pattern-matching)
        - [ ] [2.2.2. advanced logic of rules](#222-advanced-logic-of-rules)
            - [ ] [implicit constants](#implicit-constants)
            - [ ] [higher order rules](#higher-order-rules)
            - [ ] [nondeterministic disjunction](#nondeterministic-disjunction)
            - [ ] [nondeterministic conjunction](#nondeterministic-conjunction)
    - [ ] [2.3. summary](#23-summary)
- [ ] [3. practical examples](#3-practical-examples)
    - [ ] [3.1. metacompiling](#33-metacompiling)
    - [ ] [3.2. expression synthesis](#32-expression-synthesis)
    - [ ] [3.3. automated theorem proving](#31-automated-theorem-proving)
- [ ] [4. related work](#4-related-work)
- [ ] [5. conclusion](#5-conclusion)

## 1. introduction

motivation

## 2. theoretical background
### 2.1. syntax

```
   <start> := <fwd-mtch>
            | <bck-mtch>

<fwd-mtch> := (MATCH <var> <fwd-rule>+)
            | <fwd-rule>

<bck-mtch> := (MATCH <var> <bck-rule>+)
            | <bck-rule>

     <var> := (VAR (ID <ID> <TERM>)+)

<fwd-rule> := (RULE (READ <fwd-mtch>*) (CHAIN <bck-mtch>*)? (WRITE <bck-mtch>*))
            | <TERM>

<bck-rule> := (RULE (WRITE <bck-mtch>*) (CHAIN <bck-mtch>*)? (READ <fwd-mtch>*))
            | <TERM>
```

### 2.2. semantics
#### 2.2.1. rule basics
##### basic input/output example

```
/*
    simple input/output example
    
    input: `(hello machine)`
    output: `(hello world)`
*/

(RULE (READ (hello machine)) (WRITE (hello world)))
```

##### term alternations

```
/*
    toy making decision
    
    input: `(isGood girl/boy)`
    output: `(makeToy doll/car)`
*/

(
    RULE
    (
        READ
        (RULE (READ      ) (WRITE (isGood child))
        (RULE (READ child) (WRITE girl boy     ))
    )
    (
        CHAIN
        (RULE (WRITE (isGood girl)) (READ (makeToy doll)))
        (RULE (WRITE  (isGood boy)) (READ (makeToy car) ))
    )
    (
        WRITE
        (RULE (WRITE     doll car)) (READ toy))
        (RULE (WRITE (makeToy toy)) (READ    ))
    )
)
```

##### pattern matching

```
/*
    job title decision
    
    input: `(isDoing Jane/John (driving rocket)/(healing people))`
    output: `(isTitled Jane/John astronaut/doctor)`
*/

(
    RULE
    (
        READ
        (RULE (READ       ) (WRITE (isDoing person job)             ))
        (RULE (READ person) (WRITE Jane John                        ))
        (RULE (READ    job) (WRITE (driving rocket) (healing people)))
    )
    (
        CHAIN
        (
            MATCH
            (VAR (ID <P> person))
            (RULE (WRITE (isDoing <P> (driving rocket))) (READ (isTitled <P> astronaut)))
        )
        (
            MATCH
            (VAR (ID <P> person))
            (RULE (WRITE (isDoing <P> (healing people))) (READ (isTitled <P> doctor)))
        )
    )
    (
        RULE
        (RULE (WRITE        astronaut doctor) (READ title ))
        (RULE (WRITE               Jane John) (READ person))
        (RULE (WRITE (isTitled person title)) (READ       ))
    )
)
```

#### 2.2.2. advanced logic of rules

##### implicit constants

```
    (RULE (READ) (WRITE ⊤))
```

```
    (RULE (READ ⊥) (WRITE))
```

##### higher order rules

```
[right implication]
 Γ |- Δ, A -> B
----------------
  Γ, A |- Δ, B
```

```
(
    MATCH
    (VAR (ID <A> ...) (ID <B> ...))
    (RULE (READ Γ) (WRITE Δ (RULE (READ <A>) (WRITE (<B>))))
)
```

```
(
    MATCH
    (VAR (ID <A> ...) (ID <B> ...))
    (RULE (READ Γ <A>) (WRITE (Δ <B>)))
)
```

```
[left implication]
       Γ, A -> B |- Δ
---------------------------
 Γ |- Δ, A       Γ, B |- Δ
```

```
(
    MATCH
    (VAR (ID <A> ...) (ID <B> ...))
    (RULE (READ Γ (RULE (READ <A>) (WRITE (<B>)))) (WRITE Δ))
)
```

```
(
    MATCH
    (VAR (ID <A> ...) (ID <B> ...))
    (RULE (READ Γ) (WRITE Δ <A>))
    (RULE (READ Γ <B>) (WRITE Δ))
)
```

##### nondeterministic disjunction

```
01 ((RULE (READ) (WRITE A B)))
02
03 ((RULE (READ A) (WRITE x)))
04 ((RULE (READ B) (WRITE x)))
05
06 ((RULE (READ x) (WRITE success)))
```

```
/*
    student decision
    
    input: `(isBeingEducated Jane/John)`
    output `(isAStudent Jane/John)`
*/

(
    RULE
    (
        READ
        (RULE (READ       ) (WRITE (isBeingEducated person)))
        (RULE (READ person) (WRITE Jane John               ))
    )
    (
        CHAIN
        (
            MATCH
            (VAR (ID <P> person))
            (RULE (WRITE (isBeingEducated <P>)) (READ (attendsSchool <P>)))
        )
        (
            MATCH
            (VAR (ID <P> person))
            (RULE (WRITE (isBeingEducated <P>)) (READ (attendsCollege <P>)))
        )
        (
            MATCH
            (VAR (ID <P> person))
            (RULE (WRITE (attendsSchool <P>) (attendsCollege <P>)) (READ (isAStudent <P>)))
        )
    )
    (
        WRITE
        (RULE (WRITE           jane john) (READ person))
        (RULE (WRITE (isAStudent person)) (READ       ))
    )
)
```

##### nondeterministic conjunction

```
01 ((RULE (READ) (WRITE x)))
02
03 ((RULE (READ x) (WRITE A)))
04 ((RULE (READ x) (WRITE B)))
05 
06 ((RULE (READ A B) (WRITE success)))
```

```
/*
    computer expert decision
    
    input: `(isBuildingARobot Jane/John)`
    output: `(isAComputerExpert Jane/john)`
*/

(
    RULE
    (
        READ
        (RULE (READ       ) (WRITE (isBuildingARobot preson)))
        (RULE (READ person) (WRITE Jane John                ))
    )
    (
        CHAIN
        (
            MATCH
            (VAR (ID <P> person))
            (RULE (WRITE (isBuildingARobot <P>)) (READ (mastersSoftware <P>) (mastersHardware <P>)))
        )
        (
            MATCH
            (VAR (ID <P> person))
            (RULE (WRITE (mastersSoftware <P>)) (READ (isAComputerExpert <P>)))
        )
        (
            MATCH
            (VAR (ID <P> person))
            (RULE (WRITE (mastersHardware <P>)) (READ (isAComputerExpert <P>)))
        )
    )
    (
        WRITE
        (RULE (WRITE                  jane john) (READ person))
        (RULE (WRITE (isAComputerExpert person)) (READ       ))
    )
)
```

### 2.3. summary

```
- - - - - - - - - - - - - - - - - - - -   - - - - - - - - - - - - - - - - - - - -
|                                     |   |                                     |
|     ||                        [READ]|   |[WRITE]                       /\     |
|     ||                              |   |                             //\\    |
|     ||                             /|   |\                           //||\\   |
|     ||                           / \|   |/ \                           ||     |
|     ||                         / \ /|   |\ / \                         ||     |
|     ||                       / \ / \|   |/ \ / \                       ||     |
|     ||                     /        |   |        \                     ||     |
|     ||                   /  FORWARD |   | BACKWARD \                 B ||     |
|     || F               /      RULES |   | RULES      \               A ||     |
|   D || O             /              |   |              \             C || A   |
|   E || R           / \ / \ / \ / \ /|   |\ / \ / \ / \ / \           K || B   |
|   D || W         / \ / \ / \ / \ / \|   |/ \ / \ / \ / \ / \         W || D   |
|   U || A       /                    |   |                    \       A || U   |
|   C || R   [CHAIN]   BACKWARD RULES |   | BACKWARD RULES   [CHAIN]   R || C   |
|   T || D       \                    |   |                    /       D || T   |
|   I ||           \ / \ / \ / \ / \ /|   |\ / \ / \ / \ / \ /           || I   |
|   O || R           \ / \ / \ / \ / \|   |/ \ / \ / \ / \ /           R || O   |
|   N || U             \              |   |              /             U || N   |
|     || L               \   BACKWARD |   | FORWARD    /               L ||     |
|     || E                 \    RULES |   | RULES    /                 E ||     |
|     ||                     \        |   |        /                     ||     |
|     ||                       \ / \ /|   |\ / \ /                       ||     |
|     ||                         \ / \|   |/ \ /                         ||     |
|     ||                           \ /|   |\ /                           ||     |
|   \\||//                           \|   |/                             ||     |
|    \\//                             |   |                              ||     |
|     \/                       [WRITE]|   |[READ]                        ||     |
|                                     |   |                                     |
- - - - - - - - - - - - - - - - - - - -   - - - - - - - - - - - - - - - - - - - -
```

## 3. practical examples

### 3.1. metacompiling

```
(
    RULE
    (
        READ
        (RULE (READ      ) (WRITE exp              ))
        (RULE (READ exp  ) (WRITE int float        ))
        (RULE (READ int  ) (WRITE (add int int)    ))
        (RULE (READ int  ) (WRITE /[0-9]+/         ))
        (RULE (READ float) (WRITE (add float float)))
        (RULE (READ float) (WRITE /[0-9]+\.[0-9]+/ ))
        (RULE (READ float) (WRITE int              ))
    )
    (
        CHAIN
        (
            MATCH
            (VAR (ID <X> int))
            (RULE (WRITE <X>) (READ <X>))
        )
        (
            MATCH
            (VAR (ID <X> int) (ID <Y> int))
            (RULE (WRITE (add <X> <Y>)) (READ (i32.add <X> <Y>)))
        )

        (
            MATCH
            (VAR (ID <X> float))
            (RULE (WRITE <X>) (READ <X>))
        )
        (
            MATCH
            (VAR (ID <X> float) (ID <Y> float))
            (RULE (WRITE (add <X> <Y>)) (READ (f64.add <X> <Y>)))
        )
    )
    (
        WRITE
        (RULE (WRITE                   int) (READ float))
        (RULE (WRITE      /[0-9]+\.[0-9]+/) (READ float))
        (RULE (WRITE (f64.add float float)) (READ float))
        (RULE (WRITE              /[0-9]+/) (READ int  ))
        (RULE (WRITE     (i32.add int int)) (READ int  ))
        (RULE (WRITE             int float) (READ expr ))
        (RULE (WRITE                  expr) (READ      ))
    )
)
```

`(add 2 4)` => `(i32.add 2 4)`  
`(add 2 0.4)` => `(f64.add 2 0.4)`  
`(add 0.2 0.4)` => `(f64.add 0.2 0.4)`  
`(add 0.1 (add 2 3))` => `(f64.add 0.1 (i32.add 2 3))`  

### 3.2. expression synthesis

```
f (2) = 5;
f (4) = 9;
f (3) = 7;
```
=>
```
f(x) = 2 * x + 1
```

### 3.3. automated theorem proving

```
/*
    enscheidungsproblem solution for propositional logic
    
    input: a theorem
    output: the same input theorem if the input is successful
*/

(
    RULE
    (
        READ
        /*
            [true intro]
              A
            ------
             true
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ <A>) (WRITE true))
        )
        
        /*
            [true elim]
               true
            ----------
             A, (~ A)
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ true) (WRITE <A> (~ <A>)))
        )
        
        /*
            [false intro]
                 A
            ----------
             A, false
         */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ <A>) (WRITE <A> false))
        )
        
        /*
            [false elim]
             false   false
            ------- -------
               A     (~ A)
        */
        (
            MATCH
            (VAR (ID <A>))
            (RULE (READ false) (WRITE <A>    ))
            (RULE (READ false) (WRITE (~ <A>)))
        )

        /*        
            [id intro]
             A |- true
            -----------
                 A
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ (RULE (READ <A>) (WRITE true))) (WRITE <A>))
        )

        /*        
            [id elim]
             true |- A
            -----------
                 A
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ (RULE (READ true) (WRITE <A>))) (WRITE <A>))
        )

        /*
            [neg intro]
             A |- false
            ------------
                ~ A
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ (RULE (READ <A>) (WRITE false))) (WRITE (not <A>)))
        )

        /*
            [neg elim]
             (~ A) |- false
            ----------------
                   A
        */
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (READ (RULE (READ (not <A>)) (WRITE false))) (WRITE <A>))
        )
        
        /*
            [and intro]
               A, B
            ----------
              A /\ B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ <A> <B>) (WRITE (and <A> <B>)))
        )

        /*
            [and elim]
             A /\ B   A /\ B
            -------- --------
                A       B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (and <A> <B>)) (WRITE <A>))
            (RULE (READ (and <A> <B>)) (WRITE <B>))
        )

        /*
            [or intro]
                A       B
            -------- --------
             A \/ B   A \/ B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ <A>) (WRITE (or <A> <B>)))
            (RULE (READ <B>) (WRITE (or <A> <B>)))
        )

        /*
            [or elim]
              A \/ B
            ----------
               A, B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (or <A> <B>)) (WRITE <A> <B>))
        )
        
        /*
            [impl intro]
             ((A |- B), A) |- B
            --------------------
                   A -> B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (RULE (READ (RULE (READ <A>) (WRITE <B>)) <A>) (WRITE <B>))) (WRITE (impl <A> <B>)))
        )
        
        /*
            [impl elim]
             A -> B, A
            -----------
                 B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (impl <A> <B>) <A>) (WRITE <B>))
        )
        
        /*
            [eq intro]
             A |- B, B |- A
            ----------------
                A <-> B
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (RULE (READ <A>) (WRITE <B>)) (RULE (READ <B>) (WRITE <A>))) (WRITE (eq <A> <B>)))
        )

        /*
            [eq elim]
             A <-> B    A <-> B
            ---------  ---------
              A |- B    B |- A
        */
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (READ (eq <A> <B>)) (WRITE (RULE (READ <A>) (WRITE <B>))))
            (RULE (READ (eq <A> <B>)) (WRITE (RULE (READ <B>) (WRITE <A>))))
        )
        
        // seed
        (RULE (READ) (WRITE true))
    )
    (
        WRITE
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (WRITE (eq <A> <B>)) (READ logic))
        )
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (WRITE (impl <A> <B>)) (READ logic))
        )
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (WRITE (or <A> <B>)) (READ logic))
        )
        (
            MATCH
            (VAR (ID <A> logic) (ID <B> logic))
            (RULE (WRITE (and <A> <B>)) (READ logic))
        )
        (
            MATCH
            (VAR (ID <A> logic))
            (RULE (WRITE (not <A>)) (READ logic))
        )
        (RULE (WRITE false) (READ logic))
        (RULE (WRITE  true) (READ logic))
        (RULE (WRITE logic) (READ      ))
    )
)
```

`(A /\ B) <-> ~((~ A) \/ (~ B))` => success

## 4. related work
## 5. conclusion

    // work in progress //
