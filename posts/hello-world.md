---
title: My First Zero Post
emoji: 🚀
date: 5/28/2022
tags: tech, markdown
---

# Hello World

This blog was created for the [Replit Template Jam](https://blog.replit.com/template-jam).

This is the first post in my new blog! Take a look around. Everything is created from scratch, no libraries or frameworks. If you do manage to take a look at the source code, all of the backend and frontend standalone tools I created are usually prefixed with `Zero` (see below for links to those individual projects).

Although I used vanilla JS, it is important to recognize the advantages and utility of more maintained repositories, which are generally more performant and tested by thousands of developers.

## Replit Features (and other mentions)

Okay, technically we did use _some_ libraries. We used some cool Replit features!

-   Replit Database: comments
-   Replit Auth: comments

I'd also like to thank

-   Zenn.dev: primary inspiration for design
-   Radix: SVG icons
-   my past self for creating so much random stuff that I could literally just reuse it in this random specific context

## Project Timeline

1. Day 1: new Replit project to serve static resources
2. Day 2 - 3: created a Markdown renderer from scratch
3. Day 4: created a Templating Enginebfrom scratch
4. Day 5 - 6: created primary styles for the home and post page
5. Day 7 - 8: created Zero Framework (built on stateful-components and implemented a more robust diffing algorithm)
6. Day 9 - 10: rewrote old frontend with Zero
7. Day 11: Bug fixes on Markdown Renderer & Zero Framework
8. Day 12: More styles on post pages (especially table of contents)
9. Day 13: Got sick but made syntax highlighting with regex and a search component with throttling (hopefull compensates for the poor performance)
10. Day 14: idk
11. Day 15: Added comments with Replit Auth and created onboarding page.
12. Day 16: Finished onboarding & Posted Repl

What about "x" feature!?! It's not working!!! <s>Honestly make that yourself.</s> No, seriously.

I know a lot of features are implemented with a custom framework, but I initially started out with pure Vanilla JS. In fact, you can find the old code base can be found under the `archive` directory. However, because I switched code styles midway, certain features like search, SPA, syntax highlighting (basically everything after Day 6) are not implemented. Oher modules like the Markdown Renderer are out of date. Never fear, everything - from the Markdown Renderer to the Templating Engine - is open source (and you may choose something more maintained because Vanilla JS for the sake of Vanilla JS is not a feature). Also, even if you don't fully use my custom framework `Zero`, you can still use certain parts of the current application because everything is a web component.

Note: Zero is really unstable so I probably shot myself in the foot by remaking the entire app with it, but at least it's a framework I made so it's still "Vanilla JS". All in all, ideally you would use a stable framework like React. Frameworks exist for a reason. Vanilla JS is just... hard to maintain to say the least.

Note 2: I am currently updating the documentation for Zero, hang tight if you want to build mini apps with it.

# Example Markdown Supported

Just testing out some styles for the `Markdown` renderer. Here's my Twitter banner:
![twitter banner](https://pbs.twimg.com/profile_banners/1318662212374786048/1647636453/1500x500)

Here's a blockquote:

> A wise man once said "eat goldfish"
> And I was very surprised

Here's a code block:

```js
let x = 10;
x += 10;
```

## Metadata IMPORTANT

You can add metadata to the top of your posts through dashes. Here's what this post's metadata looks like (along with what it does).

```
---
title: My First Zero Post
emoji: 🚀
date: 5/28/2022
tags: tech, markdown
---
```

-   `title`: obviously changes the title
-   `emoji`: image representing each post
-   `date`: when it was written
-   `tags`: comma separated list of random stuff your post is about
