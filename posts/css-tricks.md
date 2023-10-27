---
title: 5 CSS Tricks to Make Your Site Less Crap
emoji: 🥳
date: 6/4/2022
tags: tech, css
---

CSS is sometimes a pain. But don't worry! If you master a few rules and build your own "style" sense, design actually gets pretty easy. Assuming you aren't uhhh ... planning to be a real designer 😂

## Trick 1: The Box Sizing Reset

Padding and margin actually influence the size of elements unless you explicitly set `box-sizing` to `border-box`. Using a simple reset before your projects can save you some headache and time. Before I was using `border-box` I was actually using `calc` to subtract the amount of margin, padding, and border from each element, which was inconvenient to say the least.

I think MDN has a [fantastic demonstration](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) if you have difficulty understanding this concept.

```css
:root {
    --c-bg: #fff;
}

html,
body {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    background-color: var(--c-bg);
}

*,
::before,
::after {
    box-sizing: inherit;
}

/* or if you prefer to set it explicitly */
*,
::before,
::after {
    box-sizing: border-box;
}
```

## Trick 2: Picking a Color

When you're making your own projects and experiments, you might find yourself struggling to pick a decent color palette. This may hinder your development process and design thinking (at least from a layout perspective).

I recommend picking a color palette you'll always default to. It will allow you to quickly create decent prototypes with more focused and consistent designs. I've been using `dodgerblue` and `blue` as my primary color for buttons, links, etc. Some legit pros like in [Refactoring Design](https://www.refactoringui.com/book) recommend using variants of black & gray to get a feel for the proper visual hierarchy.

## Trick 3: Add a lot of Space

Add space everywhere. It's good stuff.

My favorite is restricting the size of the main content and centering it into the middle, rather than letting elements hug the side of the screen.

Here's a few of my websites the implement this technique:
![creative coding with margin](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/d5vb9zf00jg0pr1bcimb.png)
^ this uses my "default" color `blue` for links!

![deloro.farm heading](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0nt9pneiedm4071v7pig.png)
![deloro.farm section](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tzb98gq8lm0j4nrmltoi.png)
^ dark themed so you can clearly see the spacing

```css
/* replace "body" with whatever, like "main" */
body {
    max-width: 50rem;
    padding: 0 2rem; /* on mobile screens add some padding */
    margin: 0 auto; /* my god centering an element */
}
```

We use `max-width` rather than setting `width` directly because we want the content to have some influence on the size of the parent, but we also want the parent container to shrink when the window is too small. If we set the width to `50rem`, mobile users would have an x overflow, which looks nasty.

Along with the "more space" theme, consider adding additional margin and padding where you usually wouldn't. This allows you to sort of "free" your design from claustrophobia. You could also try increasing the `font-size` to like `1.125rem` (`18px`) and increasing the `line-height`, which has the bonus benefit of being more legible.

## Trick 4: Pick a Sans Serif Font

While serif fonts include the extra "embellishing", using sans serif fonts can help your sites feel more modern. Although the obvious go-to is "Roboto", the font is so overused that it could make your site look generic. Try alternatives, like "Inter".

## Trick 5: Border Radius the Crap Out of Everything

Curves are amazing. They're less harsh than sharp corners, and are frequently featured in buttons. Even the Dev.to design agrees:

![look curves](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/louz6jgfou66nt369ji2.png)

I usually set `border-radius` to a lower value, like `0.25rem`. Larger elements, like cards or icon buttons, should include much greater border radiuses.

I recommend making all icons completely circular. For example, for my light/dark theme toggle in [deloro.farm](https://deloro.farm) (also shown in the screenshots above) used code pretty similar to this:

```html
<div class="icon">
    <svg stroke="currentColor">
        <this-is-totally-a-real-element-lol />
    </svg>
</div>
```

```css
/* example icon */
.icon {
    /* center icon */
    display: grid;
    place-items: center;
    border-radius: 100rem;
    height: 48px;
    width: 48px;

    /* simplified the colors since I used Tailwind's styles */
    background: dodgerblue;
    color: white;
}
```

![a theme toggle button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0r01md85hlvadce5hcdf.png)

This isn't to say that modern designs can't feature sharp edges! Pick something that you feel best with.

## Bonus Trick: Find Good Images

Images actually make up quite a bit of space in designs. While you can find fantastic images for free on Unsplash, I highly recommend this [3D illustration pack](https://www.figma.com/community/file/890095002328610853) available on Figma. It really adds a lot of personality to designs. Unfortunately, like most other things, it's slowly getting overused 😭

## Closing

Design is obviously a lot harder than memorizing some cool tricks. In fact, some of these tips might seem like cardinal sins to a designer considering I'm basically ignoring the actual process of figuring out typography and color palettes. However, the aim of this post is not to teach design, but rather, give you a set of rules that can improve crap looking websites.

I hope this list proves helpful to you! Thanks for reading and be sure to share your creations in the comments below.
