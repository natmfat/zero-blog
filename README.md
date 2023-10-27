# Zero Framework Blog

A zero dependency blog, created from scratch. Created for the [Replit Template Jam](https://blog.replit.com/template-jam).

NOTE: if you're here from a template, go to `configInternals.json` and set `demo` to false. Then run the Repl.

## Features

-   unique onboarding process

-   0 frameworks

    -   Zero Markdown Renderer
    -   Zero Templating Engine
    -   Zero Server
    -   Zero web component framework
        -   Syntax highlighter component
        -   Custom SPA router
        -   Bootlegged Repl Auth

-   writing posts (obviously)
    -   post metadata can control features (ie: emoji splashscreen)
    -   Replit users can comment on posts

## Usage

### Writing Posts

Anything added to the `posts` directory will be accessible to users at `/posts/{filename}`. You must include certain fields at the top of any post or the application may crash.

Here's what a post header should look like:

```
---
title: 5 CSS Tricks to Make Your Site Less Crap
emoji: 🥳
date: 6/4/2022
tags: tech, css
---

Post content can go here!
```

Although the markdown renderer supports a variety of elements (and you can just inline your own HTML tags), there are some known limitations. You cannot, for example, have nested lists.

### Configuration

Settings are applied in the onboarding process, which basically controls `configInternals.json`.
