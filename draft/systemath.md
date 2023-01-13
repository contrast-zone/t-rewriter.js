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
        - [ ] [2.2.1. basic input/output example](#221-basic-input-output-example)
        - [ ] [2.2.2. term alternations](#222-term-alternations)
        - [ ] [2.2.3. pattern matching](#223-pattern-matching)
        - [ ] [2.2.4. nondeterministic disjunction](#224-nondeterministic-disjunction)
        - [ ] [2.2.5. nondeterministic conjunction](#225-nondeterministic-conjunction)
    - [ ] [2.3. summary](#23-summary)
- [ ] [3. practical examples](#3-practical-examples)
    - [ ] [3.1. automated theorem proving](#31-automated-theorem-proving)
    - [ ] [3.2. program synthesis](#32-program-synthesis)
    - [ ] [3.3. metacompiling](#33-metacompiling)
- [ ] [4. related work](#4-related-work)
- [ ] [5. conclusion](#5-conclusion)

## 1. introduction

motivation

## 2. theoretical background
### 2.1. syntax

```
    <start> := <fwd-mtch>
             | <bck-mtch>

 <fwd-mtch> := (MATCH <id>+ <fwd-rule>+)
             | <fwd-rule>

 <bck-mtch> := (MATCH <var> <bck-rule>+)
             | <bck-rule>

      <var> := (VAR (ID <ID> <SEXPR>)+)

 <fwd-rule> := (RULE (READ <fwd-mtch>*) (CHAIN <bck-mtch>*)? (WRITE <bck-mtch>*))
             | <SEXPR>

 <bck-rule> := (RULE (WRITE <bck-mtch>*) (CHAIN <bck-mtch>*)? (READ <fwd-mtch>*))
             | <SEXPR>
```

### 2.2. semantics
#### 2.2.1. basic input/output example

```
/*
    simple input/output example
    
    input: `(hello machine)`
    output: `(hello world)`
*/

(RULE (READ (hello machine)) (WRITE (hello world)))
```

#### 2.2.2. term alternations

```
/*
    toy making decision
    
    input: `isGood (girl/boy)`
    output: `make (toy doll/car)`
*/

(
    RULE
    (
        READ
        (RULE (READ      ) (WRITE (isGood (child)))
        (RULE (READ child) (WRITE girl boy       ))
    )
    (
        CHAIN
        (RULE (READ (isGood (girl))) (WRITE (make (toy doll))))
        (RULE (READ  (isGood (boy))) (WRITE (make (toy car)) ))
    )
    (
        WRITE
        (RULE (WRITE (toy doll) (toy car)) (READ toy))
        (RULE (WRITE         (make (toy))) (READ    ))
    )
)
```

#### 2.2.3. pattern matching

```
/*
    job title decision
    
    input: `(isDoing (Jane/John) (driving rocket / healing people))`
    output: `(isA (Jane/John) (astronaut/doctor))`
*/

(
    RULE
    (
        READ
        (RULE (READ       ) (WRITE (isDoing (person) (job))         ))
        (RULE (READ person) (WRITE Jane John                        ))
        (RULE (READ    job) (WRITE (driving rocket) (healing people)))
    )
    (
        CHAIN
        (
            MATCH
            (VAR (ID <P> (person)))
            (RULE (WRITE (isDoing <P> (driving rocket))) (READ (isA <P> (astronaut))))
        )
        (
            MATCH
            (VAR (ID <P> (person)))
            (RULE (WRITE (isDoing <P> (healing people))) (READ (isA <P> (doctor))))
        )
    )
    (
        RULE
        (RULE (WRITE       astronaut doctor) (READ title ))
        (RULE (WRITE              Jane John) (READ person))
        (RULE (WRITE (isA (person) (title))) (READ       ))
    )
)
```

#### 2.2.4. nondeterministic disjunction

```
/*
    student decision
    
    input: `(isBeingEducated (Jane/John))`
    output `(isAStudent (Jane/John))`
*/

(
    RULE
    (
        READ
        (RULE (READ       ) (WRITE (isBeingEducated (person))))
        (RULE (READ person) (WRITE Jane John                 ))
    )
    (
        CHAIN
        (
            MATCH
            (VAR (ID <P> (person)))
            (RULE (WRITE (isBeingEducated <P>)) (READ (attendsSchool <P>)))
        )
        (
            MATCH
            (VAR (ID <P> (person)))
            (RULE (WRITE (isBeingEducated <P>)) (READ (attendsCollege <P>)))
        )
        (
            MATCH
            (VAR (ID <P> (person)))
            (RULE (WRITE (attendsSchool <P>) (attendsCollege <P>)) (READ (isAStudent <P>)))
        )
    )
    (
        WRITE
        (RULE (WRITE             jane john) (READ person))
        (RULE (WRITE (isAStudent (person))) (READ       ))
    )
)
```

#### 2.2.5. nondeterministic conjunction

```
/*
    computer expert decision
    
    input: `(isBuildingARobot (Jane/John))`
    output: `(isAComputerExpert (Jane/john))`
*/

(
    RULE
    (
        READ
        (RULE (READ       ) (WRITE (isBuildingARobot (preson))))
        (RULE (READ person) (WRITE Jane John                  ))
    )
    (
        CHAIN
        (
            MATCH
            (VAR (ID <P> (person)))
            (RULE (WRITE (isBuildingARobot <P>)) (READ (mastersSoftware <P>) (mastersHardware <P>)))
        )
        (
            MATCH
            (VAR (ID <P> (person)))
            (RULE (WRITE (mastersSoftware <P>)) (READ (isAComputerExpert <P>)))
        )
        (
            MATCH
            (VAR (ID <P> (person)))
            (RULE (WRITE (mastersHardware <P>)) (READ (isAComputerExpert <P>)))
        )
    )
    (
        WRITE
        (RULE (WRITE                    jane john) (READ person))
        (RULE (WRITE (isAComputerExpert (person))) (READ       ))
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
### 3.1. automated theorem proving

```
(A /\ B) <-> ~((~ A) \/ (~ B))

=>

success
```

### 3.2. program synthesis

```
f (1, 11) = 11;
f (111, 1) = 111;

=>

f(<x>, <y>) = (if (greaterThan <x> <y>) <x> <y>)
---
(greaterThan <x> <y>)
(if <x> <y> <z>)
```

### 3.3. metacompiling

```
print "str1" + "str2";
print 2 + 3;

=>

int i1, i2, x;
x = i1 + i2;
printf("%i", x);

char a[50], b[50];
strcpy(a, s1);
strcpy(b, s2);
strcat(a, b);
printf(a);
```

## 4. related work
## 5. conclusion

    // work in progress //
