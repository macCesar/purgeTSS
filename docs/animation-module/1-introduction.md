# Introduction

## The Animation Module
> ℹ️ **INFO**
>
> **Purge TSS** includes an Animation module to apply simple 2D Matrix animations and transformations to any element, an array of elements, or even to individual children of an element.


The Animation object describes the properties of an animation. It represents:
- A single-phase animation with an end state
- A multi-phase animation using the `open`, `close`, and `complete` modifiers
- Global states for children of a View using the `children` modifier

When the `play` method is called on a View, the View is animated from its current state to the state described by the `Animation` object. The properties that can be animated include the view's position, size, colors, transformation matrix, and opacity. You can control the pace of the animation and timing with classes like `duration-*` or `delay-*`.


## Available Methods
- `play`, `toggle`: To animate an element, an array of elements, or individual children of an element with the properties in the `Animation` object.
- `open`, `close`: Explicitly manage the opening and closing animations of your views.
- `apply`: Applies the properties instantly without an animation.
- `draggable`: Convert any View or an array of Views to draggable elements.


## Available Modifiers
- `open:`, `close:`, and `complete:` To set different properties for each state.
- `children:` To set global properties for all the children of a View.
- `child:` To set individual properties for each child of a View.
- `bounds:` To set boundaries within which the View can move inside its parent View.
- `drag:`, `drop:` To set different properties when dragging or dropping elements.


## Timing and Other Special Classes
- `delay-*`: To set a delay before the animation starts.
- `duration-*`: To set the duration of the animation.
- `rotate-*`: To set the rotation of the element.
- `scale-*`: To set the scaling of the element.
- `repeat-*`: To set the number of times the animation will be repeated.
- `zoom-in-*`, `zoom-out-*`: To set the zoom in or out of the element.
- `drag-apply`, `drag-animate`: To apply or animate the properties when dragging elements.
- `ease-in`, `ease-out`, `ease-linear`, `ease-in-out`: To set the animation curve of the element.
- `vertical-constraint`, `horizontal-constraint`: Adds a vertical or horizontal constraint when dragging an element.


## Installation
Use the **`purgetss module`** command to install the module in the `lib` folder.

```bash
> purgetss module

# alias:
> purgetss m
```


## Usage
This is the most basic `Animation` object, equipped with a set of **Purge TSS** classes to animate any element. You can create as many `Animation` objects as you want, each with different properties to animate.

```xml
<Animation id="myAnimation" module="purgetss.ui" class="a-set-of-purgetss-classes-and-modifiers" />
```

**You can set any position, size, colors, transformation, and opacity classes from `tailwind.tss`.**
