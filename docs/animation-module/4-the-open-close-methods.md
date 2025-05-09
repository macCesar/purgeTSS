The `open` and `close` methods provide a clear and straightforward way to manage the opening and closing animations of your views, utilizing the predefined classes with the `open` and `close` modifiers.

By using these methods, you can ensure consistent and manageable animation behavior across your application, as opposed to using the `play` or `toggle` methods, which alternate between the `open` and `close` states based on the current state of the view.

This explicit control helps in scenarios where the exact state of the view is crucial for the desired user experience or application logic.

## `open` Method

The `open` method triggers the opening animation for the specified views. It uses the properties defined under the classes with the `open` modifier.

### Usage

```javascript
$.myAnimation.open(views, callback);
```

- `views`: The view or array of views to apply the opening animation to.
- `callback`: An optional callback function that gets called when the animation completes.

### Example

`index.xml`
```xml
<Alloy>
  <Window>
    <Animation module="purgetss.ui" id="myAnimation" class="close:opacity-0 open:opacity-100" />
    <View id="myView" />
  </Window>
</Alloy>
```

`index.js`
```javascript
$.myAnimation.open($.myView, () => {
  console.log('Open animation complete');
});
```

In this example, the `myView` element will apply the animation properties defined in the classes with the `open` modifier when the `open` method is called, making the view fully opaque.

## `close` Method

The `close` method triggers the closing animation for the specified views. It uses the properties defined under the classes with the `close` modifier.

### Usage

```javascript
$.myAnimation.close(views, callback);
```

- `views`: The view or array of views to apply the closing animation to.
- `callback`: An optional callback function that gets called when the animation completes.

### Example

`index.xml`
```xml
<Alloy>
  <Window>
    <Animation module="purgetss.ui" id="myAnimation" class="close:opacity-0 open:opacity-100" />
    <View id="myView" />
  </Window>
</Alloy>
```

`index.js`
```javascript
$.myAnimation.close($.myView, () => {
  console.log('Close animation complete');
});
```

In this example, the `myView` element will apply the animation properties defined in the classes with the `close` modifier when the `close` method is called, making the view fully transparent.
