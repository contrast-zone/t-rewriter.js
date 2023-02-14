# co-rewrite

[s-expr middleware metaheaven]

## 1. about

- **description**: [s-expr](https://en.wikipedia.org/wiki/S-expression) transformation metalanguage featuring a novel [graph rewriting](https://en.wikipedia.org/wiki/Graph_rewriting) method
- **practical use**: [metacompiling](https://en.wikipedia.org/wiki/Compiler-compiler), [program synthesis](https://en.wikipedia.org/wiki/Program_synthesis), [automated logical reasoning](https://en.wikipedia.org/wiki/Automated_reasoning)
- **status**: work in progress - it's not completely engineering work; it's not completely academic work; it's something in between.

### 1.1. goals

- minimal design
- beginner friendly documentation
- conveniently generating completely functional executable
- multiplatform development environment, multiplatform runtime environment
- self hosting compiler

### 1.2. design

#### 1.2.1 metalanguage design decisions

- completely language agnostic
- no frontend - input is merely a file containing an AST in a form of s-expr
- no backend - output is merely a file containing an AST in a form of s-expr
- comprises only middleware AST transformation rules in a form of a novel metalanguage

#### 1.2.2 features by design

- modularisation for reusable nature of onion-layered architecture
- middleware AST-s may be organized as a stack of languages that transpile one to another
- translation of any language to any other language using an arbitrary pivot intermediate representation language

#### 1.2.3. design architecture

```
      assumption / input code            ⇒ user is generating input AST
                 ↓
. . . . . . . . . . . . . . . . . . .
.            input AST              .
.                ↓                  .
.  intermediate representation AST  .    ⇒ systelog package computes result
.                ↓                  .
.           output AST              .
. . . . . . . . . . . . . . . . . . .
                 ↓
      conclusion / output code           ⇒ user is processing output AST
```

---

Find more info at the [co-rewrite repository](https://github.com/contrast-zone/co-rewrite)

