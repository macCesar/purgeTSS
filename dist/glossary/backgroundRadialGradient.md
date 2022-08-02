```scss
// Component(s): Ti.UI.ListItem, Ti.UI.View
// Property(ies): backgroundGradient: type, startRadius, endRadius, backfillStart, backfillEnd - iOS Only
'.bg-radial[platform=ios]': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '125%', endRadius: '0%' } }
'.bg-radial-to-b[platform=ios]': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '50%', y: '0%' }, endPoint: { x: '50%', y: '0%' } } }
'.bg-radial-to-bl[platform=ios]': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '100%', y: '0%' } } }
'.bg-radial-to-l[platform=ios]': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '100%', y: '50%' }, endPoint: { x: '100%', y: '50%' } } }
'.bg-radial-to-tl[platform=ios]': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '100%' } } }
'.bg-radial-to-t[platform=ios]': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '50%', y: '100%' }, endPoint: { x: '50%', y: '100%' } } }
'.bg-radial-to-tr[platform=ios]': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '0%', y: '100%' } } }
'.bg-radial-to-r[platform=ios]': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '0%', y: '50%' }, endPoint: { x: '0%', y: '50%' } } }
'.bg-radial-to-br[platform=ios]': { backgroundGradient: { type: 'radial', backfillStart: true, backfillEnd: true, startRadius: '150%', endRadius: '0%', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '0%' } } }
```