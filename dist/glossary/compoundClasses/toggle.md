```scss
// Property(ies): toggle - For the Animation module
// Component(s): Animation
'.opacity-to-0': { opacity: 1, animation: { open: { opacity: 0 }, close: { opacity: 1 } } }
'.opacity-to-100': { opacity: 0, animation: { open: { opacity: 1 }, close: { opacity: 0 } } }
'.toggle-visible': { animation: { open: { visible: true }, close: { visible: false } } }
```