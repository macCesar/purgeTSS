---
sidebar_position: 7
slug: available-utilities
title: Available Utilities
---

Along with the regular utilities like color, widths, and heights, you can set the following utilities on your animations:

## anchorPoint
Coordinate of the view about which to pivot an animation.

This is specified as a dictionary object with x and y properties, where `{x: 0.5, y: 0.5}` represents the center of whatever is being rotated.

**Default:** `(0.5, 0.5)`

```css
/* Property(ies): anchorPoint */
/* Component(s): Ti.UI.Animation, Ti.UI.View */
'.origin-center': { anchorPoint: { x: 0.5, y: 0.5 } }
'.origin-top': { anchorPoint: { x: 0.5, y: 0 } }
'.origin-top-right': { anchorPoint: { x: 1, y: 0 } }
'.origin-right': { anchorPoint: { x: 0.5, y: 1 } }
'.origin-bottom-right': { anchorPoint: { x: 1, y: 1 } }
'.origin-bottom': { anchorPoint: { x: 0.5, y: 1 } }
'.origin-bottom-left': { anchorPoint: { x: 0, y: 1 } }
'.origin-left': { anchorPoint: { x: 0, y: 0.5 } }
'.origin-top-left': { anchorPoint: { x: 0, y: 0 } }

/* anchor-point-{position} variant */
'.anchor-point-center': { anchorPoint: { x: 0.5, y: 0.5 } }
'.anchor-point-top': { anchorPoint: { x: 0.5, y: 0 } }
'.anchor-point-top-right': { anchorPoint: { x: 1, y: 0 } }
'.anchor-point-right': { anchorPoint: { x: 0.5, y: 1 } }
'.anchor-point-bottom-right': { anchorPoint: { x: 1, y: 1 } }
'.anchor-point-bottom': { anchorPoint: { x: 0.5, y: 1 } }
'.anchor-point-bottom-left': { anchorPoint: { x: 0, y: 1 } }
'.anchor-point-left': { anchorPoint: { x: 0, y: 0.5 } }
'.anchor-point-top-left': { anchorPoint: { x: 0, y: 0 } }
```

## autoreverse
Specifies if the animation should be replayed in reverse upon completion.

**Default:** `false`

```css
/* Property: autoreverse */
/* Description: Specifies if the animation should be replayed in reverse upon completion. */
/* Component(s): Ti.UI.Animation */
'.autoreverse': { autoreverse: true }
'.autoreverse-false': { autoreverse: false }
```

## curve
Animation curve or easing function to apply to the animation.

This API can be assigned the following constants:

```css
/* Property: curve */
/* Description: Animation curve or easing function to apply to the animation. */
/* Component(s): Ti.UI.Animation */
'.curve-animation-ease-in': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN }
'.curve-animation-ease-in-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT }
'.curve-animation-ease-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_OUT }
'.curve-animation-linear': { curve: Ti.UI.ANIMATION_CURVE_LINEAR }
```

## delay
Delay, in milliseconds before starting the animation

```css
/* Property: delay */
/* Description: Delay, in milliseconds before starting the animation. */
/* Component(s): Ti.UI.Animation */
'.delay-0': { delay: 0 }
'.delay-25': { delay: 25 }
'.delay-50': { delay: 50 }
'.delay-75': { delay: 75 }
'.delay-100': { delay: 100 }
'.delay-150': { delay: 150 }
'.delay-200': { delay: 200 }
'.delay-250': { delay: 250 }
'.delay-300': { delay: 300 }
'.delay-350': { delay: 350 }
'.delay-400': { delay: 400 }
'.delay-450': { delay: 450 }
'.delay-500': { delay: 500 }
'.delay-600': { delay: 600 }
'.delay-700': { delay: 700 }
'.delay-800': { delay: 800 }
'.delay-900': { delay: 900 }
'.delay-1000': { delay: 1000 }
'.delay-2000': { delay: 2000 }
'.delay-3000': { delay: 3000 }
'.delay-4000': { delay: 4000 }
'.delay-5000': { delay: 5000 }
```

## duration
Duration of the animation, in milliseconds.

```css
/* Property: duration */
/* Component(s): Ti.App.iOS.SearchableItemAttributeSet, Ti.Media.AudioPlayer, Ti.Media.Sound, Ti.Media.VideoPlayer, AnimatedWithDurationOptions, Ti.UI.Animation, Ti.UI.ImageView, Ti.UI.Notification, Ti.UI.iOS.TransitionAnimation */
'.duration-0': { duration: 0 }
'.duration-25': { duration: 25 }
'.duration-50': { duration: 50 }
'.duration-75': { duration: 75 }
'.duration-100': { duration: 100 }
'.duration-150': { duration: 150 }
'.duration-200': { duration: 200 }
'.duration-250': { duration: 250 }
'.duration-300': { duration: 300 }
'.duration-350': { duration: 350 }
'.duration-400': { duration: 400 }
'.duration-450': { duration: 450 }
'.duration-500': { duration: 500 }
'.duration-600': { duration: 600 }
'.duration-700': { duration: 700 }
'.duration-800': { duration: 800 }
'.duration-900': { duration: 900 }
'.duration-1000': { duration: 1000 }
'.duration-2000': { duration: 2000 }
'.duration-3000': { duration: 3000 }
'.duration-4000': { duration: 4000 }
'.duration-5000': { duration: 5000 }
```

## repeat
Number of times the animation should be performed.

If `autoreverse` is true, then one repeat of the animation consists of the animation being played once forward and once backward.

```css
/* Property: repeat */
/* Component(s): NotificationParams, Ti.UI.Animation */
'.repeat-0': { repeat: 0 }
'.repeat-1': { repeat: 1 }
'.repeat-2': { repeat: 2 }
'.repeat-3': { repeat: 3 }
'.repeat-4': { repeat: 4 }
'.repeat-5': { repeat: 5 }
'.repeat-6': { repeat: 6 }
'.repeat-7': { repeat: 7 }
'.repeat-8': { repeat: 8 }
'.repeat-9': { repeat: 9 }
'.repeat-10': { repeat: 10 }
'.repeat-11': { repeat: 11 }
'.repeat-12': { repeat: 12 }
```

## rotate
Utility to specify the amount of rotation.

This is specified as the rotation angle in degrees. See the rotate method for more information on rotating views.

**Default:** `No rotation.`

```css
/* Property: rotate */
/* Component(s): MatrixCreationDict, Matrix2DCreationDict */
'.rotate-0': { rotate: 0 }
'.rotate-1': { rotate: 1 }
'.rotate-2': { rotate: 2 }
'.rotate-3': { rotate: 3 }
'.rotate-6': { rotate: 6 }
'.rotate-12': { rotate: 12 }
'.rotate-45': { rotate: 45 }
'.rotate-90': { rotate: 90 }
'.rotate-180': { rotate: 180 }

/* Property(ies): rotate ( Negative values ) */
/* Component(s): For the Animation Component */
'.-rotate-0': { rotate: 0 }
'.-rotate-1': { rotate: -1 }
'.-rotate-2': { rotate: -2 }
'.-rotate-3': { rotate: -3 }
'.-rotate-6': { rotate: -6 }
'.-rotate-12': { rotate: -12 }
'.-rotate-45': { rotate: -45 }
'.-rotate-90': { rotate: -90 }
'.-rotate-180': { rotate: -180 }
```

## scale
Scales the matrix by the specified scaling factor. The same scaling factor is used for both horizontal and vertical scaling.

**Default:** `1`

```css
/* Property: scale */
/* Component(s): MatrixCreationDict, Matrix2DCreationDict, Matrix3DCreationDict */
'.scale-0': { scale: 0 }
'.scale-1': { scale: 0.01 }
'.scale-5': { scale: 0.05 }
'.scale-10': { scale: 0.10 }
'.scale-25': { scale: 0.25 }
'.scale-50': { scale: 0.5 }
'.scale-75': { scale: 0.75 }
'.scale-90': { scale: 0.9 }
'.scale-95': { scale: 0.95 }
'.scale-100': { scale: 1 }
'.scale-105': { scale: 1.05 }
'.scale-110': { scale: 1.1 }
'.scale-125': { scale: 1.25 }
'.scale-150': { scale: 1.5 }
```

## drag-apply, drag-animate
To control how `drag:` and `drop:` modifiers are applied, you can use either the `drag-animate` (*default*) or `drag-apply` class. The `drag-animate` class will animate the properties, while the `drag-apply` class will apply them immediately.

```css
/* Property(ies): draggingType */
/* Component(s): For the Animation Component */
'.drag-apply': { draggingType: 'apply' }
'.drag-animate': { draggingType: 'animate' }
```

## opacity-to-\*, toggle-visible
A special utility to automatically animate the opacity of a view and toggle its visibility.

```css
/* Property(ies): toggle - For the Animation module */
/* Component(s): Animation */
'.opacity-to-0': { opacity: 1, animationProperties: { open: { opacity: 0 }, close: { opacity: 1 } } }
'.opacity-to-100': { opacity: 0, animationProperties: { open: { opacity: 1 }, close: { opacity: 0 } } }
'.toggle-visible': { animationProperties: { open: { visible: true }, close: { visible: false } } }
```

## zoom-in-\*, zoom-out-\*
A special utility to automatically animate the zoom-in and zoom-out of a view.

It will initially set the view's scale to the specified value and then animate it to 1.

```css
/* Property(ies): animationProperties - scales the view (in or out) and resets it to 100% when the animation completes */
/* Component(s): Animation */
'.zoom-in-0': { animationProperties: { open: { scale: 0 }, complete: { scale: 1 } } }
'.zoom-in-1': { animationProperties: { open: { scale: 0.01 }, complete: { scale: 1 } } }
'.zoom-in-5': { animationProperties: { open: { scale: 0.05 }, complete: { scale: 1 } } }
'.zoom-in-10': { animationProperties: { open: { scale: 0.10 }, complete: { scale: 1 } } }
'.zoom-in-25': { animationProperties: { open: { scale: 0.25 }, complete: { scale: 1 } } }
'.zoom-in-50': { animationProperties: { open: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-in-75': { animationProperties: { open: { scale: 0.75 }, complete: { scale: 1 } } }
'.zoom-in-90': { animationProperties: { open: { scale: 0.9 }, complete: { scale: 1 } } }
'.zoom-in-95': { animationProperties: { open: { scale: 0.95 }, complete: { scale: 1 } } }
'.zoom-in-100': { animationProperties: { open: { scale: 1 }, complete: { scale: 1 } } }
'.zoom-in-105': { animationProperties: { open: { scale: 1.05 }, complete: { scale: 1 } } }
'.zoom-in-110': { animationProperties: { open: { scale: 1.1 }, complete: { scale: 1 } } }
'.zoom-in-125': { animationProperties: { open: { scale: 1.25 }, complete: { scale: 1 } } }
'.zoom-in-150': { animationProperties: { open: { scale: 1.5 }, complete: { scale: 1 } } }
'.zoom-out-0': { animationProperties: { close: { scale: 0 }, complete: { scale: 1 } } }
'.zoom-out-1': { animationProperties: { close: { scale: 0.01 }, complete: { scale: 1 } } }
'.zoom-out-5': { animationProperties: { close: { scale: 0.05 }, complete: { scale: 1 } } }
'.zoom-out-10': { animationProperties: { close: { scale: 0.10 }, complete: { scale: 1 } } }
'.zoom-out-25': { animationProperties: { close: { scale: 0.25 }, complete: { scale: 1 } } }
'.zoom-out-50': { animationProperties: { close: { scale: 0.5 }, complete: { scale: 1 } } }
'.zoom-out-75': { animationProperties: { close: { scale: 0.75 }, complete: { scale: 1 } } }
'.zoom-out-90': { animationProperties: { close: { scale: 0.9 }, complete: { scale: 1 } } }
'.zoom-out-95': { animationProperties: { close: { scale: 0.95 }, complete: { scale: 1 } } }
'.zoom-out-100': { animationProperties: { close: { scale: 1 }, complete: { scale: 1 } } }
'.zoom-out-105': { animationProperties: { close: { scale: 1.05 }, complete: { scale: 1 } } }
'.zoom-out-110': { animationProperties: { close: { scale: 1.1 }, complete: { scale: 1 } } }
'.zoom-out-125': { animationProperties: { close: { scale: 1.25 }, complete: { scale: 1 } } }
'.zoom-out-150': { animationProperties: { close: { scale: 1.5 }, complete: { scale: 1 } } }
```
