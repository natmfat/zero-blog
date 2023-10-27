---
title: Introduction to Creative Coding with Javascript
emoji: 🧪
date: 5/28/2022
tags: tutorial, javascript, generative art
---

Creative coding is the art of creating art. That sounds like a useless and ambiguous definition doesn't it? However, creative coding is really about leveraging programming languages to make something beautiful and expressive. The boundaries are truly limitless. Creative works, or "sketches" as I like to call them (after p5.js), can be inspired by design, physics, and even biology. Personally, ideas for my sketches appear as I'm trying to sleep. If you're struggling to find a good concept, try replicating someone else's work just to engage your mind, or just try experimenting with randomness. Random stuff looks surprisingly good.

In this post, I hope to teach you some p5.js to create your first sketch. Using randomness, every sketch will be completely unique - and completely yours to post all over Twitter or mint as an NFT 😂. Bit of a disclaimer: I consider myself to be a very very very unqualified person to speak about creative coding. I'm a noob, but I figured if I teach you everything I know then you can be a pro noob too 👍.

Here's what we're making:
![](https://pbs.twimg.com/media/FOn7U0ZVIAMCxAG?format=jpg&name=large)

## Step 1: Make a new HTML File

As we are using JavaScript, we'll need a base HTML file to work with. You can copy the template below - all we're doing is fetching p5.js through a CDN. I recommend installing the Live Server extension to view your sketches in real time with live reloading.

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Sketch 01: More Lines</title>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"></script>
        <script src="/app.js"></script>
    </head>
    <body></body>
</html>
```

Alternatively, you open up the p5.js web editor or a new CodePen.

## Step 2: Generating Random Palettes

Now you could be a smart person and pick a color palette yourself or randomly generate one using actual math. Or you could just hard code 100 random color palettes and pick one. We're going with just hard code 100 random color palettes and pick one.

[cdn.jsdelivr.net/npm/nice color palettes@3.0.0/100.json](https://cdn.jsdelivr.net/npm/nice-color-palettes@3.0.0/100.json)

`nice-color-palettes` has loads of pretty palettes. Unfortunately, they're stored in json format and can't be linked as a JS file, so you can either import them with a `fetch` request or copy and paste all of the stuff in the link above into a new file.

`index.js`

```javascript
const colors = [...]
```

## Step 3: Setup

If you're not already aware, p5.js automatically runs two functions: - `setup`: initialize any objects and the HTML5 canvas itself - `draw`: called to render every frame (for animations)

We don't actually need the `draw` function because we're making a static piece.

`index.js`

```javascript
// config variables
// - weight controls line widths
// - lineLength controls how many Line objects we create
const weight = 10;
const linesLength = 100;

let palette = [];
let lines = [];

function setup() {
    createCanvas(700, 700);
    // the size of our art, use innerWidth and innerHeight for full screen
}
```

In setup, we want to select our color palette and create an array of `Line` objects (which we haven't actually defined yet). Why we don't just set `palette` directly? Good question! p5.js provides a bunch of global variables and functions like `random` that we want to use. The only way to ensure these functions are properly loaded is to wait until setup is called.

```javascript
function setup() {
    createCanvas(700, 700);

    // select a random palette and then "shuffle" it into a random order
    palette = shuffle(random(colors));

    // shortcut to create an array of specified length filled with lines
    lines = new Array(linesLength).fill(0).map((_) => new Line());

    // render all of the lines
    lines.forEach((line) => line.draw());
}
```

## Step 4: The Line

Obviously, lines are defined by two points. For our sketch, we want lines generated on the left with a random y and on the right with a random y to ensure all lines span over the entire canvas.

Note: you definitely don't have to use `createVector` to create a new point. In fact, this might seem a bit confusing to you because a point does not really have a magnitude or direction, it's just a location in space. Generally I like referring to points as vectors in p5.js because they come with a lot of functions that can be useful in other creative sketches (like adding velocity to a position "vector" in flow fields).

```javascript
class Line {
    constructor() {
        this.coord1 = createVector(0, random(height));
        this.coord2 = createVector(width, random(height));

        // alternatively
        // this.coord1 = { x: 0, y: random(height) }
    }

    draw() {}
}
```

`Line.draw` is also fairly intuitive. Just draw a line.

```javascript
draw() {
	stroke(random(palette)); // select a random color
	strokeWeight(weight); // set the line "width"

	// actually draw the line
	line(
		this.coord1.x,
		this.coord1.y,
		this.coord2.x,
		this.coord2.y
    );
}
```

You should have something that looks like this:
![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/df1vhmvtx3uod6sqk83m.png)

## Step 5: Finishing Touches

Now this already looks kind of cool, but we want to add some depth. By adding a translucent color to the background, we can create some "shadows" or "fog" that makes the sketch look 3D. You could also enhance this effect by increasing the `strokeWeight` for "closer" lines, as things appear larger if they are right in front of you.

```javascript
function setup() {
    createCanvas(700, 700);

    palette = shuffle(random(colors));

    lines = new Array(linesLength).fill(0).map((_) => new Line());

    // render all of the lines
    lines.forEach((line) => {
        line.draw();
        background("rgba(0, 0, 0, 0.1)");
    });
}
```

You can add multiple lines (sort of like licorice) by using a loop to slightly offset the original coordinates.

```javascript
class Line {
    draw() {
        for (let i = -4; i < 4; i++) {
            stroke(random(palette));
            strokeWeight(weight);
            line(
                this.coord1.x,
                this.coord1.y + i * weight,
                this.coord2.x,
                this.coord2.y + i * weight
            );
        }
    }
}
```

## Closing

Creative coding at noob level is still pretty simple. Delving into math like visualizing fractals is out of the scope of this tutorial (partly because I haven't learned it yet 😅).

Anyways, thanks for sticking with me!
