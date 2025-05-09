Platform and Device modifiers (also called variants or prefixes) allow you to specify different styles for an element depending on the platform (iOS or Android) and device (tablet or handheld) that the app is running on:

- Platform modifiers:
  - `ios:`
  - `android:`

- Device modifiers:
  - `tablet:`
  - `handheld:`

For example, if you want to have different background colors and font sizes depending on the platform and device your app is running on, you can target them separately, and even combine them with arbitrary values. For example: `ios:bg-(#53606b)`, `ios:text-(20px)`, `android:bg-(#8fb63e)`, and `android:text-(24px)`.

`index.xml`
```xml
<Alloy>
  <Window class="tablet:bg-green-500 handheld:bg-blue-500">
    <View class="h-32 tablet:bg-green-100 handheld:bg-blue-100">
      <Label class="w-screen h-auto text-center ios:text-blue-800 ios:text-xl android:text-green-800 android:text-2xl">This is a Test</Label>
    </View>
  </Window>
</Alloy>
```

`app.tss`
```css
/* Purge TSS v6.2.27 */
/* Created by César Estrada */
/* https://github.com/macCesar/purgeTSS */

/* Ti Elements */
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'Window': { backgroundColor: '#FFFFFF' }

/* Main Styles */
'.h-32': { height: 128 }
'.h-auto': { height: Ti.UI.SIZE }
'.text-center': { textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER }
'.w-screen': { width: Ti.UI.FILL }

/* Platform and Device Modifiers */
'.android:text-2xl[platform=android]': { font: { fontSize: 24 } }
'.android:text-green-800[platform=android]': { color: '#166534', textColor: '#166534' }
'.handheld:bg-blue-100[formFactor=handheld]': { backgroundColor: '#dbeafe' }
'.handheld:bg-blue-500[formFactor=handheld]': { backgroundColor: '#3b82f6' }
'.ios:text-blue-800[platform=ios]': { color: '#1e40af', textColor: '#1e40af' }
'.ios:text-xl[platform=ios]': { font: { fontSize: 20 } }
'.tablet:bg-green-100[formFactor=tablet]': { backgroundColor: '#dcfce7' }
'.tablet:bg-green-500[formFactor=tablet]': { backgroundColor: '#22c55e' }
```
