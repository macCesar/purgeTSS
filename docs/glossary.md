# Properties and class names
The following is a list of all the properties and their repective class name.

- [Properties and class names](#properties-and-class-names)
  - [autocapitalization Property](#autocapitalization-property)
  - [autofillType Property](#autofilltype-property)
  - [autoreverse Property](#autoreverse-property)
  - [backgroundColor Property](#backgroundcolor-property)
  - [backgroundSelectedColor Property](#backgroundselectedcolor-property)
  - [barColor Property](#barcolor-property)
  - [borderColor Property](#bordercolor-property)
  - [borderRadius - ( With Extra Styles ) Property](#borderradius----with-extra-styles--property)
  - [borderStyle Property](#borderstyle-property)
  - [borderWidth Property](#borderwidth-property)
  - [disableBounce Property](#disablebounce-property)
  - [displayCaps Property](#displaycaps-property)
  - [clipMode Property](#clipmode-property)
  - [currentPageIndicatorColor Property](#currentpageindicatorcolor-property)
  - [preventDefaultImage Property](#preventdefaultimage-property)
  - [Display](#display)
  - [Constraint Property](#constraint-property)
  - [draggingType Property](#draggingtype-property)
  - [editable Property](#editable-property)
  - [ellipsize Property](#ellipsize-property)
  - [ellipsize Property ( for Labels )](#ellipsize-property--for-labels-)
  - [enableCopy Property](#enablecopy-property)
  - [enableReturnKey Property](#enablereturnkey-property)
  - [exitOnClose Property](#exitonclose-property)
  - [extendBackground Property](#extendbackground-property)
  - [Flip Property](#flip-property)
  - [Font Properties](#font-properties)
    - [fontSize Property](#fontsize-property)
    - [fontStyle Property](#fontstyle-property)
    - [fontWeight Property](#fontweight-property)
  - [Gradient Color Stops](#gradient-color-stops)
    - [From Color](#from-color)
    - [To Color](#to-color)
    - [Linear backgroundGradient Property](#linear-backgroundgradient-property)
    - [Radial backgroundGradient Property [iOS]](#radial-backgroundgradient-property-ios)
  - [Grid System](#grid-system)
    - [Grid Column Start / End Property](#grid-column-start--end-property)
    - [Grid Row Start / End Property](#grid-row-start--end-property)
    - [grid and gridFlow Property](#grid-and-gridflow-property)
    - [Grid Template Columns Property](#grid-template-columns-property)
    - [Grid Template Rows Property](#grid-template-rows-property)
    - [Gap Between elements](#gap-between-elements)
  - [height Property](#height-property)
  - [touchEnabled Property](#touchenabled-property)
  - [items Property](#items-property)
  - [keepScreenOn Property](#keepscreenon-property)
  - [keyboardAppearance Property](#keyboardappearance-property)
  - [keyboardType Property](#keyboardtype-property)
  - [layout Property](#layout-property)
  - [Margin Property](#margin-property)
  - [Negative Margins Property](#negative-margins-property)
  - [opacity Property](#opacity-property)
  - [anchorPoint Properties](#anchorpoint-properties)
  - [overlayEnabled Property](#overlayenabled-property)
  - [padding Property](#padding-property)
  - [ScrollableView Properties](#scrollableview-properties)
    - [pageIndicatorColor Property](#pageindicatorcolor-property)
    - [showPagingControl Property](#showpagingcontrol-property)
    - [pagingControlAlpha Property](#pagingcontrolalpha-property)
    - [pagingControlColor Property](#pagingcontrolcolor-property)
    - [pagingControlHeight Property](#pagingcontrolheight-property)
    - [pagingControlOnTop Property](#pagingcontrolontop-property)
    - [pagingControlTimeout Property](#pagingcontroltimeout-property)
  - [hintTextColor Property](#hinttextcolor-property)
  - [Top / Right / Bottom / Left](#top--right--bottom--left)
  - [repeat Property](#repeat-property)
  - [returnKeyType Property](#returnkeytype-property)
  - [rotate Property](#rotate-property)
  - [scale Property](#scale-property)
  - [Scroll Indicators ( for ScrollViews )](#scroll-indicators--for-scrollviews-)
  - [scrollType Property](#scrolltype-property)
  - [contentWidth & contentHeight ( for ScrollViews )](#contentwidth--contentheight--for-scrollviews-)
  - [scrollingEnabled Property](#scrollingenabled-property)
  - [Box Shadow](#box-shadow)
  - [Box Shadow Color](#box-shadow-color)
  - [showCancel Property](#showcancel-property)
  - [TabGroup/Tab Properties](#tabgrouptab-properties)
    - [activeTintColor Property](#activetintcolor-property)
    - [activeTitleColor Property](#activetitlecolor-property)
    - [tabsBackgroundColor Property](#tabsbackgroundcolor-property)
    - [titleColor Property](#titlecolor-property)
  - [textAlign Property](#textalign-property)
  - [color Property](#color-property)
  - [Ti.Media](#timedia)
  - [audioSessionCategory Property](#audiosessioncategory-property)
  - [audioType Property](#audiotype-property)
  - [Background Size ( for compatibility with Tailwind’s classes ) Property](#background-size--for-compatibility-with-tailwinds-classes--property)
  - [Image Scaling Mode Property](#image-scaling-mode-property)
  - [Video Scaling Mode Property](#video-scaling-mode-property)
  - [tintColor Property](#tintcolor-property)
  - [touchFeedbackColor Property](#touchfeedbackcolor-property)
  - [curve Property](#curve-property)
  - [Debug Mode Property](#debug-mode-property)
  - [delay Property](#delay-property)
  - [duration Property](#duration-property)
  - [verticalAlign Property](#verticalalign-property)
  - [width Property](#width-property)
  - [zIndex Property](#zindex-property)

## autocapitalization Property
```css
'.uppercase': { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_ALL }
'.normal-case': { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE }
'.capitalize': { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS }
'.sentences': { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES }
```

## autofillType Property
```css
'.autofill-type-url': { autofillType: Ti.UI.AUTOFILL_TYPE_URL }
'.autofill-type-name': { autofillType: Ti.UI.AUTOFILL_TYPE_NAME }
'.autofill-type-phone': { autofillType: Ti.UI.AUTOFILL_TYPE_PHONE }
'.autofill-type-email': { autofillType: Ti.UI.AUTOFILL_TYPE_EMAIL }
'.autofill-type-address': { autofillType: Ti.UI.AUTOFILL_TYPE_ADDRESS }
'.autofill-type-username': { autofillType: Ti.UI.AUTOFILL_TYPE_USERNAME }
'.autofill-type-password': { autofillType: Ti.UI.AUTOFILL_TYPE_PASSWORD }
'.autofill-type-nickname': { autofillType: Ti.UI.AUTOFILL_TYPE_NICKNAME }
'.autofill-type-location': { autofillType: Ti.UI.AUTOFILL_TYPE_LOCATION }
'.autofill-type-job-title': { autofillType: Ti.UI.AUTOFILL_TYPE_JOB_TITLE }
'.autofill-type-given-name': { autofillType: Ti.UI.AUTOFILL_TYPE_GIVEN_NAME }
'.autofill-type-name-prefix': { autofillType: Ti.UI.AUTOFILL_TYPE_NAME_PREFIX }
'.autofill-type-middle-name': { autofillType: Ti.UI.AUTOFILL_TYPE_MIDDLE_NAME }
'.autofill-type-family-name': { autofillType: Ti.UI.AUTOFILL_TYPE_FAMILY_NAME }
'.autofill-type-name-suffix': { autofillType: Ti.UI.AUTOFILL_TYPE_NAME_SUFFIX }
'.autofill-type-sublocality': { autofillType: Ti.UI.AUTOFILL_TYPE_SUBLOCALITY }
'.autofill-type-postal-code': { autofillType: Ti.UI.AUTOFILL_TYPE_POSTAL_CODE }
'.autofill-type-card-number': { autofillType: Ti.UI.AUTOFILL_TYPE_CARD_NUMBER }
'.autofill-type-address-city': { autofillType: Ti.UI.AUTOFILL_TYPE_ADDRESS_CITY }
'.autofill-type-country-name': { autofillType: Ti.UI.AUTOFILL_TYPE_COUNTRY_NAME }
'.autofill-type-new-password': { autofillType: Ti.UI.AUTOFILL_TYPE_NEW_PASSWORD }
'.autofill-type-address-line1': { autofillType: Ti.UI.AUTOFILL_TYPE_ADDRESS_LINE1 }
'.autofill-type-address-line2': { autofillType: Ti.UI.AUTOFILL_TYPE_ADDRESS_LINE2 }
'.autofill-type-address-state': { autofillType: Ti.UI.AUTOFILL_TYPE_ADDRESS_STATE }
'.autofill-type-one-time-code': { autofillType: Ti.UI.AUTOFILL_TYPE_ONE_TIME_CODE }
'.autofill-type-organization-name': { autofillType: Ti.UI.AUTOFILL_TYPE_ORGANIZATION_NAME }
'.autofill-type-address-city-state': { autofillType: Ti.UI.AUTOFILL_TYPE_ADDRESS_CITY_STATE }
'.autofill-type-card-security-code': { autofillType: Ti.UI.AUTOFILL_TYPE_CARD_SECURITY_CODE }
'.autofill-type-card-expiration-day': { autofillType: Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_DAY }
'.autofill-type-card-expiration-date': { autofillType: Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_DATE }
'.autofill-type-card-expiration-year': { autofillType: Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_YEAR }
'.autofill-type-card-expiration-month': { autofillType: Ti.UI.AUTOFILL_TYPE_CARD_EXPIRATION_MONTH }
```

## autoreverse Property
```css
'.autoreverse': { autoreverse: true }
'.no-autoreverse': { autoreverse: false }
```

## backgroundColor Property
```css
'.bg-transparent': { backgroundColor: 'transparent' }
'.bg-black': { backgroundColor: '#000000' }
'.bg-white': { backgroundColor: '#ffffff' }
'.bg-rose-50': { backgroundColor: '#fff1f2' }
'.bg-rose-100': { backgroundColor: '#ffe4e6' }
'.bg-rose-200': { backgroundColor: '#fecdd3' }
'.bg-rose-300': { backgroundColor: '#fda4af' }
'.bg-rose-400': { backgroundColor: '#fb7185' }
'.bg-rose-500': { backgroundColor: '#f43f5e' }
'.bg-rose-600': { backgroundColor: '#e11d48' }
'.bg-rose-700': { backgroundColor: '#be123c' }
'.bg-rose-800': { backgroundColor: '#9f1239' }
'.bg-rose-900': { backgroundColor: '#881337' }
'.bg-pink-50': { backgroundColor: '#fdf2f8' }
'.bg-pink-100': { backgroundColor: '#fce7f3' }
'.bg-pink-200': { backgroundColor: '#fbcfe8' }
'.bg-pink-300': { backgroundColor: '#f9a8d4' }
'.bg-pink-400': { backgroundColor: '#f472b6' }
'.bg-pink-500': { backgroundColor: '#ec4899' }
'.bg-pink-600': { backgroundColor: '#db2777' }
'.bg-pink-700': { backgroundColor: '#be185d' }
'.bg-pink-800': { backgroundColor: '#9d174d' }
'.bg-pink-900': { backgroundColor: '#831843' }
'.bg-fuchsia-50': { backgroundColor: '#fdf4ff' }
'.bg-fuchsia-100': { backgroundColor: '#fae8ff' }
'.bg-fuchsia-200': { backgroundColor: '#f5d0fe' }
'.bg-fuchsia-300': { backgroundColor: '#f0abfc' }
'.bg-fuchsia-400': { backgroundColor: '#e879f9' }
'.bg-fuchsia-500': { backgroundColor: '#d946ef' }
'.bg-fuchsia-600': { backgroundColor: '#c026d3' }
'.bg-fuchsia-700': { backgroundColor: '#a21caf' }
'.bg-fuchsia-800': { backgroundColor: '#86198f' }
'.bg-fuchsia-900': { backgroundColor: '#701a75' }
'.bg-purple-50': { backgroundColor: '#faf5ff' }
'.bg-purple-100': { backgroundColor: '#f3e8ff' }
'.bg-purple-200': { backgroundColor: '#e9d5ff' }
'.bg-purple-300': { backgroundColor: '#d8b4fe' }
'.bg-purple-400': { backgroundColor: '#c084fc' }
'.bg-purple-500': { backgroundColor: '#a855f7' }
'.bg-purple-600': { backgroundColor: '#9333ea' }
'.bg-purple-700': { backgroundColor: '#7e22ce' }
'.bg-purple-800': { backgroundColor: '#6b21a8' }
'.bg-purple-900': { backgroundColor: '#581c87' }
'.bg-violet-50': { backgroundColor: '#f5f3ff' }
'.bg-violet-100': { backgroundColor: '#ede9fe' }
'.bg-violet-200': { backgroundColor: '#ddd6fe' }
'.bg-violet-300': { backgroundColor: '#c4b5fd' }
'.bg-violet-400': { backgroundColor: '#a78bfa' }
'.bg-violet-500': { backgroundColor: '#8b5cf6' }
'.bg-violet-600': { backgroundColor: '#7c3aed' }
'.bg-violet-700': { backgroundColor: '#6d28d9' }
'.bg-violet-800': { backgroundColor: '#5b21b6' }
'.bg-violet-900': { backgroundColor: '#4c1d95' }
'.bg-indigo-50': { backgroundColor: '#eef2ff' }
'.bg-indigo-100': { backgroundColor: '#e0e7ff' }
'.bg-indigo-200': { backgroundColor: '#c7d2fe' }
'.bg-indigo-300': { backgroundColor: '#a5b4fc' }
'.bg-indigo-400': { backgroundColor: '#818cf8' }
'.bg-indigo-500': { backgroundColor: '#6366f1' }
'.bg-indigo-600': { backgroundColor: '#4f46e5' }
'.bg-indigo-700': { backgroundColor: '#4338ca' }
'.bg-indigo-800': { backgroundColor: '#3730a3' }
'.bg-indigo-900': { backgroundColor: '#312e81' }
'.bg-blue-50': { backgroundColor: '#eff6ff' }
'.bg-blue-100': { backgroundColor: '#dbeafe' }
'.bg-blue-200': { backgroundColor: '#bfdbfe' }
'.bg-blue-300': { backgroundColor: '#93c5fd' }
'.bg-blue-400': { backgroundColor: '#60a5fa' }
'.bg-blue-500': { backgroundColor: '#3b82f6' }
'.bg-blue-600': { backgroundColor: '#2563eb' }
'.bg-blue-700': { backgroundColor: '#1d4ed8' }
'.bg-blue-800': { backgroundColor: '#1e40af' }
'.bg-blue-900': { backgroundColor: '#1e3a8a' }
'.bg-sky-50': { backgroundColor: '#f0f9ff' }
'.bg-sky-100': { backgroundColor: '#e0f2fe' }
'.bg-sky-200': { backgroundColor: '#bae6fd' }
'.bg-sky-300': { backgroundColor: '#7dd3fc' }
'.bg-sky-400': { backgroundColor: '#38bdf8' }
'.bg-sky-500': { backgroundColor: '#0ea5e9' }
'.bg-sky-600': { backgroundColor: '#0284c7' }
'.bg-sky-700': { backgroundColor: '#0369a1' }
'.bg-sky-800': { backgroundColor: '#075985' }
'.bg-sky-900': { backgroundColor: '#0c4a6e' }
'.bg-cyan-50': { backgroundColor: '#ecfeff' }
'.bg-cyan-100': { backgroundColor: '#cffafe' }
'.bg-cyan-200': { backgroundColor: '#a5f3fc' }
'.bg-cyan-300': { backgroundColor: '#67e8f9' }
'.bg-cyan-400': { backgroundColor: '#22d3ee' }
'.bg-cyan-500': { backgroundColor: '#06b6d4' }
'.bg-cyan-600': { backgroundColor: '#0891b2' }
'.bg-cyan-700': { backgroundColor: '#0e7490' }
'.bg-cyan-800': { backgroundColor: '#155e75' }
'.bg-cyan-900': { backgroundColor: '#164e63' }
'.bg-teal-50': { backgroundColor: '#f0fdfa' }
'.bg-teal-100': { backgroundColor: '#ccfbf1' }
'.bg-teal-200': { backgroundColor: '#99f6e4' }
'.bg-teal-300': { backgroundColor: '#5eead4' }
'.bg-teal-400': { backgroundColor: '#2dd4bf' }
'.bg-teal-500': { backgroundColor: '#14b8a6' }
'.bg-teal-600': { backgroundColor: '#0d9488' }
'.bg-teal-700': { backgroundColor: '#0f766e' }
'.bg-teal-800': { backgroundColor: '#115e59' }
'.bg-teal-900': { backgroundColor: '#134e4a' }
'.bg-emerald-50': { backgroundColor: '#ecfdf5' }
'.bg-emerald-100': { backgroundColor: '#d1fae5' }
'.bg-emerald-200': { backgroundColor: '#a7f3d0' }
'.bg-emerald-300': { backgroundColor: '#6ee7b7' }
'.bg-emerald-400': { backgroundColor: '#34d399' }
'.bg-emerald-500': { backgroundColor: '#10b981' }
'.bg-emerald-600': { backgroundColor: '#059669' }
'.bg-emerald-700': { backgroundColor: '#047857' }
'.bg-emerald-800': { backgroundColor: '#065f46' }
'.bg-emerald-900': { backgroundColor: '#064e3b' }
'.bg-green-50': { backgroundColor: '#f0fdf4' }
'.bg-green-100': { backgroundColor: '#dcfce7' }
'.bg-green-200': { backgroundColor: '#bbf7d0' }
'.bg-green-300': { backgroundColor: '#86efac' }
'.bg-green-400': { backgroundColor: '#4ade80' }
'.bg-green-500': { backgroundColor: '#22c55e' }
'.bg-green-600': { backgroundColor: '#16a34a' }
'.bg-green-700': { backgroundColor: '#15803d' }
'.bg-green-800': { backgroundColor: '#166534' }
'.bg-green-900': { backgroundColor: '#14532d' }
'.bg-lime-50': { backgroundColor: '#f7fee7' }
'.bg-lime-100': { backgroundColor: '#ecfccb' }
'.bg-lime-200': { backgroundColor: '#d9f99d' }
'.bg-lime-300': { backgroundColor: '#bef264' }
'.bg-lime-400': { backgroundColor: '#a3e635' }
'.bg-lime-500': { backgroundColor: '#84cc16' }
'.bg-lime-600': { backgroundColor: '#65a30d' }
'.bg-lime-700': { backgroundColor: '#4d7c0f' }
'.bg-lime-800': { backgroundColor: '#3f6212' }
'.bg-lime-900': { backgroundColor: '#365314' }
'.bg-yellow-50': { backgroundColor: '#fefce8' }
'.bg-yellow-100': { backgroundColor: '#fef9c3' }
'.bg-yellow-200': { backgroundColor: '#fef08a' }
'.bg-yellow-300': { backgroundColor: '#fde047' }
'.bg-yellow-400': { backgroundColor: '#facc15' }
'.bg-yellow-500': { backgroundColor: '#eab308' }
'.bg-yellow-600': { backgroundColor: '#ca8a04' }
'.bg-yellow-700': { backgroundColor: '#a16207' }
'.bg-yellow-800': { backgroundColor: '#854d0e' }
'.bg-yellow-900': { backgroundColor: '#713f12' }
'.bg-amber-50': { backgroundColor: '#fffbeb' }
'.bg-amber-100': { backgroundColor: '#fef3c7' }
'.bg-amber-200': { backgroundColor: '#fde68a' }
'.bg-amber-300': { backgroundColor: '#fcd34d' }
'.bg-amber-400': { backgroundColor: '#fbbf24' }
'.bg-amber-500': { backgroundColor: '#f59e0b' }
'.bg-amber-600': { backgroundColor: '#d97706' }
'.bg-amber-700': { backgroundColor: '#b45309' }
'.bg-amber-800': { backgroundColor: '#92400e' }
'.bg-amber-900': { backgroundColor: '#78350f' }
'.bg-orange-50': { backgroundColor: '#fff7ed' }
'.bg-orange-100': { backgroundColor: '#ffedd5' }
'.bg-orange-200': { backgroundColor: '#fed7aa' }
'.bg-orange-300': { backgroundColor: '#fdba74' }
'.bg-orange-400': { backgroundColor: '#fb923c' }
'.bg-orange-500': { backgroundColor: '#f97316' }
'.bg-orange-600': { backgroundColor: '#ea580c' }
'.bg-orange-700': { backgroundColor: '#c2410c' }
'.bg-orange-800': { backgroundColor: '#9a3412' }
'.bg-orange-900': { backgroundColor: '#7c2d12' }
'.bg-red-50': { backgroundColor: '#fef2f2' }
'.bg-red-100': { backgroundColor: '#fee2e2' }
'.bg-red-200': { backgroundColor: '#fecaca' }
'.bg-red-300': { backgroundColor: '#fca5a5' }
'.bg-red-400': { backgroundColor: '#f87171' }
'.bg-red-500': { backgroundColor: '#ef4444' }
'.bg-red-600': { backgroundColor: '#dc2626' }
'.bg-red-700': { backgroundColor: '#b91c1c' }
'.bg-red-800': { backgroundColor: '#991b1b' }
'.bg-red-900': { backgroundColor: '#7f1d1d' }
'.bg-warmGray-50': { backgroundColor: '#fafaf9' }
'.bg-warmGray-100': { backgroundColor: '#f5f5f4' }
'.bg-warmGray-200': { backgroundColor: '#e7e5e4' }
'.bg-warmGray-300': { backgroundColor: '#d6d3d1' }
'.bg-warmGray-400': { backgroundColor: '#a8a29e' }
'.bg-warmGray-500': { backgroundColor: '#78716c' }
'.bg-warmGray-600': { backgroundColor: '#57534e' }
'.bg-warmGray-700': { backgroundColor: '#44403c' }
'.bg-warmGray-800': { backgroundColor: '#292524' }
'.bg-warmGray-900': { backgroundColor: '#1c1917' }
'.bg-trueGray-50': { backgroundColor: '#fafafa' }
'.bg-trueGray-100': { backgroundColor: '#f5f5f5' }
'.bg-trueGray-200': { backgroundColor: '#e5e5e5' }
'.bg-trueGray-300': { backgroundColor: '#d4d4d4' }
'.bg-trueGray-400': { backgroundColor: '#a3a3a3' }
'.bg-trueGray-500': { backgroundColor: '#737373' }
'.bg-trueGray-600': { backgroundColor: '#525252' }
'.bg-trueGray-700': { backgroundColor: '#404040' }
'.bg-trueGray-800': { backgroundColor: '#262626' }
'.bg-trueGray-900': { backgroundColor: '#171717' }
'.bg-gray-50': { backgroundColor: '#fafafa' }
'.bg-gray-100': { backgroundColor: '#f4f4f5' }
'.bg-gray-200': { backgroundColor: '#e4e4e7' }
'.bg-gray-300': { backgroundColor: '#d4d4d8' }
'.bg-gray-400': { backgroundColor: '#a1a1aa' }
'.bg-gray-500': { backgroundColor: '#71717a' }
'.bg-gray-600': { backgroundColor: '#52525b' }
'.bg-gray-700': { backgroundColor: '#3f3f46' }
'.bg-gray-800': { backgroundColor: '#27272a' }
'.bg-gray-900': { backgroundColor: '#18181b' }
'.bg-coolGray-50': { backgroundColor: '#f9fafb' }
'.bg-coolGray-100': { backgroundColor: '#f3f4f6' }
'.bg-coolGray-200': { backgroundColor: '#e5e7eb' }
'.bg-coolGray-300': { backgroundColor: '#d1d5db' }
'.bg-coolGray-400': { backgroundColor: '#9ca3af' }
'.bg-coolGray-500': { backgroundColor: '#6b7280' }
'.bg-coolGray-600': { backgroundColor: '#4b5563' }
'.bg-coolGray-700': { backgroundColor: '#374151' }
'.bg-coolGray-800': { backgroundColor: '#1f2937' }
'.bg-coolGray-900': { backgroundColor: '#111827' }
'.bg-blueGray-50': { backgroundColor: '#f8fafc' }
'.bg-blueGray-100': { backgroundColor: '#f1f5f9' }
'.bg-blueGray-200': { backgroundColor: '#e2e8f0' }
'.bg-blueGray-300': { backgroundColor: '#cbd5e1' }
'.bg-blueGray-400': { backgroundColor: '#94a3b8' }
'.bg-blueGray-500': { backgroundColor: '#64748b' }
'.bg-blueGray-600': { backgroundColor: '#475569' }
'.bg-blueGray-700': { backgroundColor: '#334155' }
'.bg-blueGray-800': { backgroundColor: '#1e293b' }
'.bg-blueGray-900': { backgroundColor: '#0f172a' }
```

## backgroundSelectedColor Property
```css
'.bg-selected-transparent': { backgroundSelectedColor: 'transparent' }
'.bg-selected-black': { backgroundSelectedColor: '#000000' }
'.bg-selected-white': { backgroundSelectedColor: '#ffffff' }
'.bg-selected-rose-50': { backgroundSelectedColor: '#fff1f2' }
'.bg-selected-rose-100': { backgroundSelectedColor: '#ffe4e6' }
'.bg-selected-rose-200': { backgroundSelectedColor: '#fecdd3' }
'.bg-selected-rose-300': { backgroundSelectedColor: '#fda4af' }
'.bg-selected-rose-400': { backgroundSelectedColor: '#fb7185' }
'.bg-selected-rose-500': { backgroundSelectedColor: '#f43f5e' }
'.bg-selected-rose-600': { backgroundSelectedColor: '#e11d48' }
'.bg-selected-rose-700': { backgroundSelectedColor: '#be123c' }
'.bg-selected-rose-800': { backgroundSelectedColor: '#9f1239' }
'.bg-selected-rose-900': { backgroundSelectedColor: '#881337' }
'.bg-selected-pink-50': { backgroundSelectedColor: '#fdf2f8' }
'.bg-selected-pink-100': { backgroundSelectedColor: '#fce7f3' }
'.bg-selected-pink-200': { backgroundSelectedColor: '#fbcfe8' }
'.bg-selected-pink-300': { backgroundSelectedColor: '#f9a8d4' }
'.bg-selected-pink-400': { backgroundSelectedColor: '#f472b6' }
'.bg-selected-pink-500': { backgroundSelectedColor: '#ec4899' }
'.bg-selected-pink-600': { backgroundSelectedColor: '#db2777' }
'.bg-selected-pink-700': { backgroundSelectedColor: '#be185d' }
'.bg-selected-pink-800': { backgroundSelectedColor: '#9d174d' }
'.bg-selected-pink-900': { backgroundSelectedColor: '#831843' }
'.bg-selected-fuchsia-50': { backgroundSelectedColor: '#fdf4ff' }
'.bg-selected-fuchsia-100': { backgroundSelectedColor: '#fae8ff' }
'.bg-selected-fuchsia-200': { backgroundSelectedColor: '#f5d0fe' }
'.bg-selected-fuchsia-300': { backgroundSelectedColor: '#f0abfc' }
'.bg-selected-fuchsia-400': { backgroundSelectedColor: '#e879f9' }
'.bg-selected-fuchsia-500': { backgroundSelectedColor: '#d946ef' }
'.bg-selected-fuchsia-600': { backgroundSelectedColor: '#c026d3' }
'.bg-selected-fuchsia-700': { backgroundSelectedColor: '#a21caf' }
'.bg-selected-fuchsia-800': { backgroundSelectedColor: '#86198f' }
'.bg-selected-fuchsia-900': { backgroundSelectedColor: '#701a75' }
'.bg-selected-purple-50': { backgroundSelectedColor: '#faf5ff' }
'.bg-selected-purple-100': { backgroundSelectedColor: '#f3e8ff' }
'.bg-selected-purple-200': { backgroundSelectedColor: '#e9d5ff' }
'.bg-selected-purple-300': { backgroundSelectedColor: '#d8b4fe' }
'.bg-selected-purple-400': { backgroundSelectedColor: '#c084fc' }
'.bg-selected-purple-500': { backgroundSelectedColor: '#a855f7' }
'.bg-selected-purple-600': { backgroundSelectedColor: '#9333ea' }
'.bg-selected-purple-700': { backgroundSelectedColor: '#7e22ce' }
'.bg-selected-purple-800': { backgroundSelectedColor: '#6b21a8' }
'.bg-selected-purple-900': { backgroundSelectedColor: '#581c87' }
'.bg-selected-violet-50': { backgroundSelectedColor: '#f5f3ff' }
'.bg-selected-violet-100': { backgroundSelectedColor: '#ede9fe' }
'.bg-selected-violet-200': { backgroundSelectedColor: '#ddd6fe' }
'.bg-selected-violet-300': { backgroundSelectedColor: '#c4b5fd' }
'.bg-selected-violet-400': { backgroundSelectedColor: '#a78bfa' }
'.bg-selected-violet-500': { backgroundSelectedColor: '#8b5cf6' }
'.bg-selected-violet-600': { backgroundSelectedColor: '#7c3aed' }
'.bg-selected-violet-700': { backgroundSelectedColor: '#6d28d9' }
'.bg-selected-violet-800': { backgroundSelectedColor: '#5b21b6' }
'.bg-selected-violet-900': { backgroundSelectedColor: '#4c1d95' }
'.bg-selected-indigo-50': { backgroundSelectedColor: '#eef2ff' }
'.bg-selected-indigo-100': { backgroundSelectedColor: '#e0e7ff' }
'.bg-selected-indigo-200': { backgroundSelectedColor: '#c7d2fe' }
'.bg-selected-indigo-300': { backgroundSelectedColor: '#a5b4fc' }
'.bg-selected-indigo-400': { backgroundSelectedColor: '#818cf8' }
'.bg-selected-indigo-500': { backgroundSelectedColor: '#6366f1' }
'.bg-selected-indigo-600': { backgroundSelectedColor: '#4f46e5' }
'.bg-selected-indigo-700': { backgroundSelectedColor: '#4338ca' }
'.bg-selected-indigo-800': { backgroundSelectedColor: '#3730a3' }
'.bg-selected-indigo-900': { backgroundSelectedColor: '#312e81' }
'.bg-selected-blue-50': { backgroundSelectedColor: '#eff6ff' }
'.bg-selected-blue-100': { backgroundSelectedColor: '#dbeafe' }
'.bg-selected-blue-200': { backgroundSelectedColor: '#bfdbfe' }
'.bg-selected-blue-300': { backgroundSelectedColor: '#93c5fd' }
'.bg-selected-blue-400': { backgroundSelectedColor: '#60a5fa' }
'.bg-selected-blue-500': { backgroundSelectedColor: '#3b82f6' }
'.bg-selected-blue-600': { backgroundSelectedColor: '#2563eb' }
'.bg-selected-blue-700': { backgroundSelectedColor: '#1d4ed8' }
'.bg-selected-blue-800': { backgroundSelectedColor: '#1e40af' }
'.bg-selected-blue-900': { backgroundSelectedColor: '#1e3a8a' }
'.bg-selected-sky-50': { backgroundSelectedColor: '#f0f9ff' }
'.bg-selected-sky-100': { backgroundSelectedColor: '#e0f2fe' }
'.bg-selected-sky-200': { backgroundSelectedColor: '#bae6fd' }
'.bg-selected-sky-300': { backgroundSelectedColor: '#7dd3fc' }
'.bg-selected-sky-400': { backgroundSelectedColor: '#38bdf8' }
'.bg-selected-sky-500': { backgroundSelectedColor: '#0ea5e9' }
'.bg-selected-sky-600': { backgroundSelectedColor: '#0284c7' }
'.bg-selected-sky-700': { backgroundSelectedColor: '#0369a1' }
'.bg-selected-sky-800': { backgroundSelectedColor: '#075985' }
'.bg-selected-sky-900': { backgroundSelectedColor: '#0c4a6e' }
'.bg-selected-cyan-50': { backgroundSelectedColor: '#ecfeff' }
'.bg-selected-cyan-100': { backgroundSelectedColor: '#cffafe' }
'.bg-selected-cyan-200': { backgroundSelectedColor: '#a5f3fc' }
'.bg-selected-cyan-300': { backgroundSelectedColor: '#67e8f9' }
'.bg-selected-cyan-400': { backgroundSelectedColor: '#22d3ee' }
'.bg-selected-cyan-500': { backgroundSelectedColor: '#06b6d4' }
'.bg-selected-cyan-600': { backgroundSelectedColor: '#0891b2' }
'.bg-selected-cyan-700': { backgroundSelectedColor: '#0e7490' }
'.bg-selected-cyan-800': { backgroundSelectedColor: '#155e75' }
'.bg-selected-cyan-900': { backgroundSelectedColor: '#164e63' }
'.bg-selected-teal-50': { backgroundSelectedColor: '#f0fdfa' }
'.bg-selected-teal-100': { backgroundSelectedColor: '#ccfbf1' }
'.bg-selected-teal-200': { backgroundSelectedColor: '#99f6e4' }
'.bg-selected-teal-300': { backgroundSelectedColor: '#5eead4' }
'.bg-selected-teal-400': { backgroundSelectedColor: '#2dd4bf' }
'.bg-selected-teal-500': { backgroundSelectedColor: '#14b8a6' }
'.bg-selected-teal-600': { backgroundSelectedColor: '#0d9488' }
'.bg-selected-teal-700': { backgroundSelectedColor: '#0f766e' }
'.bg-selected-teal-800': { backgroundSelectedColor: '#115e59' }
'.bg-selected-teal-900': { backgroundSelectedColor: '#134e4a' }
'.bg-selected-emerald-50': { backgroundSelectedColor: '#ecfdf5' }
'.bg-selected-emerald-100': { backgroundSelectedColor: '#d1fae5' }
'.bg-selected-emerald-200': { backgroundSelectedColor: '#a7f3d0' }
'.bg-selected-emerald-300': { backgroundSelectedColor: '#6ee7b7' }
'.bg-selected-emerald-400': { backgroundSelectedColor: '#34d399' }
'.bg-selected-emerald-500': { backgroundSelectedColor: '#10b981' }
'.bg-selected-emerald-600': { backgroundSelectedColor: '#059669' }
'.bg-selected-emerald-700': { backgroundSelectedColor: '#047857' }
'.bg-selected-emerald-800': { backgroundSelectedColor: '#065f46' }
'.bg-selected-emerald-900': { backgroundSelectedColor: '#064e3b' }
'.bg-selected-green-50': { backgroundSelectedColor: '#f0fdf4' }
'.bg-selected-green-100': { backgroundSelectedColor: '#dcfce7' }
'.bg-selected-green-200': { backgroundSelectedColor: '#bbf7d0' }
'.bg-selected-green-300': { backgroundSelectedColor: '#86efac' }
'.bg-selected-green-400': { backgroundSelectedColor: '#4ade80' }
'.bg-selected-green-500': { backgroundSelectedColor: '#22c55e' }
'.bg-selected-green-600': { backgroundSelectedColor: '#16a34a' }
'.bg-selected-green-700': { backgroundSelectedColor: '#15803d' }
'.bg-selected-green-800': { backgroundSelectedColor: '#166534' }
'.bg-selected-green-900': { backgroundSelectedColor: '#14532d' }
'.bg-selected-lime-50': { backgroundSelectedColor: '#f7fee7' }
'.bg-selected-lime-100': { backgroundSelectedColor: '#ecfccb' }
'.bg-selected-lime-200': { backgroundSelectedColor: '#d9f99d' }
'.bg-selected-lime-300': { backgroundSelectedColor: '#bef264' }
'.bg-selected-lime-400': { backgroundSelectedColor: '#a3e635' }
'.bg-selected-lime-500': { backgroundSelectedColor: '#84cc16' }
'.bg-selected-lime-600': { backgroundSelectedColor: '#65a30d' }
'.bg-selected-lime-700': { backgroundSelectedColor: '#4d7c0f' }
'.bg-selected-lime-800': { backgroundSelectedColor: '#3f6212' }
'.bg-selected-lime-900': { backgroundSelectedColor: '#365314' }
'.bg-selected-yellow-50': { backgroundSelectedColor: '#fefce8' }
'.bg-selected-yellow-100': { backgroundSelectedColor: '#fef9c3' }
'.bg-selected-yellow-200': { backgroundSelectedColor: '#fef08a' }
'.bg-selected-yellow-300': { backgroundSelectedColor: '#fde047' }
'.bg-selected-yellow-400': { backgroundSelectedColor: '#facc15' }
'.bg-selected-yellow-500': { backgroundSelectedColor: '#eab308' }
'.bg-selected-yellow-600': { backgroundSelectedColor: '#ca8a04' }
'.bg-selected-yellow-700': { backgroundSelectedColor: '#a16207' }
'.bg-selected-yellow-800': { backgroundSelectedColor: '#854d0e' }
'.bg-selected-yellow-900': { backgroundSelectedColor: '#713f12' }
'.bg-selected-amber-50': { backgroundSelectedColor: '#fffbeb' }
'.bg-selected-amber-100': { backgroundSelectedColor: '#fef3c7' }
'.bg-selected-amber-200': { backgroundSelectedColor: '#fde68a' }
'.bg-selected-amber-300': { backgroundSelectedColor: '#fcd34d' }
'.bg-selected-amber-400': { backgroundSelectedColor: '#fbbf24' }
'.bg-selected-amber-500': { backgroundSelectedColor: '#f59e0b' }
'.bg-selected-amber-600': { backgroundSelectedColor: '#d97706' }
'.bg-selected-amber-700': { backgroundSelectedColor: '#b45309' }
'.bg-selected-amber-800': { backgroundSelectedColor: '#92400e' }
'.bg-selected-amber-900': { backgroundSelectedColor: '#78350f' }
'.bg-selected-orange-50': { backgroundSelectedColor: '#fff7ed' }
'.bg-selected-orange-100': { backgroundSelectedColor: '#ffedd5' }
'.bg-selected-orange-200': { backgroundSelectedColor: '#fed7aa' }
'.bg-selected-orange-300': { backgroundSelectedColor: '#fdba74' }
'.bg-selected-orange-400': { backgroundSelectedColor: '#fb923c' }
'.bg-selected-orange-500': { backgroundSelectedColor: '#f97316' }
'.bg-selected-orange-600': { backgroundSelectedColor: '#ea580c' }
'.bg-selected-orange-700': { backgroundSelectedColor: '#c2410c' }
'.bg-selected-orange-800': { backgroundSelectedColor: '#9a3412' }
'.bg-selected-orange-900': { backgroundSelectedColor: '#7c2d12' }
'.bg-selected-red-50': { backgroundSelectedColor: '#fef2f2' }
'.bg-selected-red-100': { backgroundSelectedColor: '#fee2e2' }
'.bg-selected-red-200': { backgroundSelectedColor: '#fecaca' }
'.bg-selected-red-300': { backgroundSelectedColor: '#fca5a5' }
'.bg-selected-red-400': { backgroundSelectedColor: '#f87171' }
'.bg-selected-red-500': { backgroundSelectedColor: '#ef4444' }
'.bg-selected-red-600': { backgroundSelectedColor: '#dc2626' }
'.bg-selected-red-700': { backgroundSelectedColor: '#b91c1c' }
'.bg-selected-red-800': { backgroundSelectedColor: '#991b1b' }
'.bg-selected-red-900': { backgroundSelectedColor: '#7f1d1d' }
'.bg-selected-warmGray-50': { backgroundSelectedColor: '#fafaf9' }
'.bg-selected-warmGray-100': { backgroundSelectedColor: '#f5f5f4' }
'.bg-selected-warmGray-200': { backgroundSelectedColor: '#e7e5e4' }
'.bg-selected-warmGray-300': { backgroundSelectedColor: '#d6d3d1' }
'.bg-selected-warmGray-400': { backgroundSelectedColor: '#a8a29e' }
'.bg-selected-warmGray-500': { backgroundSelectedColor: '#78716c' }
'.bg-selected-warmGray-600': { backgroundSelectedColor: '#57534e' }
'.bg-selected-warmGray-700': { backgroundSelectedColor: '#44403c' }
'.bg-selected-warmGray-800': { backgroundSelectedColor: '#292524' }
'.bg-selected-warmGray-900': { backgroundSelectedColor: '#1c1917' }
'.bg-selected-trueGray-50': { backgroundSelectedColor: '#fafafa' }
'.bg-selected-trueGray-100': { backgroundSelectedColor: '#f5f5f5' }
'.bg-selected-trueGray-200': { backgroundSelectedColor: '#e5e5e5' }
'.bg-selected-trueGray-300': { backgroundSelectedColor: '#d4d4d4' }
'.bg-selected-trueGray-400': { backgroundSelectedColor: '#a3a3a3' }
'.bg-selected-trueGray-500': { backgroundSelectedColor: '#737373' }
'.bg-selected-trueGray-600': { backgroundSelectedColor: '#525252' }
'.bg-selected-trueGray-700': { backgroundSelectedColor: '#404040' }
'.bg-selected-trueGray-800': { backgroundSelectedColor: '#262626' }
'.bg-selected-trueGray-900': { backgroundSelectedColor: '#171717' }
'.bg-selected-gray-50': { backgroundSelectedColor: '#fafafa' }
'.bg-selected-gray-100': { backgroundSelectedColor: '#f4f4f5' }
'.bg-selected-gray-200': { backgroundSelectedColor: '#e4e4e7' }
'.bg-selected-gray-300': { backgroundSelectedColor: '#d4d4d8' }
'.bg-selected-gray-400': { backgroundSelectedColor: '#a1a1aa' }
'.bg-selected-gray-500': { backgroundSelectedColor: '#71717a' }
'.bg-selected-gray-600': { backgroundSelectedColor: '#52525b' }
'.bg-selected-gray-700': { backgroundSelectedColor: '#3f3f46' }
'.bg-selected-gray-800': { backgroundSelectedColor: '#27272a' }
'.bg-selected-gray-900': { backgroundSelectedColor: '#18181b' }
'.bg-selected-coolGray-50': { backgroundSelectedColor: '#f9fafb' }
'.bg-selected-coolGray-100': { backgroundSelectedColor: '#f3f4f6' }
'.bg-selected-coolGray-200': { backgroundSelectedColor: '#e5e7eb' }
'.bg-selected-coolGray-300': { backgroundSelectedColor: '#d1d5db' }
'.bg-selected-coolGray-400': { backgroundSelectedColor: '#9ca3af' }
'.bg-selected-coolGray-500': { backgroundSelectedColor: '#6b7280' }
'.bg-selected-coolGray-600': { backgroundSelectedColor: '#4b5563' }
'.bg-selected-coolGray-700': { backgroundSelectedColor: '#374151' }
'.bg-selected-coolGray-800': { backgroundSelectedColor: '#1f2937' }
'.bg-selected-coolGray-900': { backgroundSelectedColor: '#111827' }
'.bg-selected-blueGray-50': { backgroundSelectedColor: '#f8fafc' }
'.bg-selected-blueGray-100': { backgroundSelectedColor: '#f1f5f9' }
'.bg-selected-blueGray-200': { backgroundSelectedColor: '#e2e8f0' }
'.bg-selected-blueGray-300': { backgroundSelectedColor: '#cbd5e1' }
'.bg-selected-blueGray-400': { backgroundSelectedColor: '#94a3b8' }
'.bg-selected-blueGray-500': { backgroundSelectedColor: '#64748b' }
'.bg-selected-blueGray-600': { backgroundSelectedColor: '#475569' }
'.bg-selected-blueGray-700': { backgroundSelectedColor: '#334155' }
'.bg-selected-blueGray-800': { backgroundSelectedColor: '#1e293b' }
'.bg-selected-blueGray-900': { backgroundSelectedColor: '#0f172a' }
```

## barColor Property
```css
'.bar-transparent': { barColor: 'transparent' }
'.bar-black': { barColor: '#000000' }
'.bar-white': { barColor: '#ffffff' }
'.bar-rose-50': { barColor: '#fff1f2' }
'.bar-rose-100': { barColor: '#ffe4e6' }
'.bar-rose-200': { barColor: '#fecdd3' }
'.bar-rose-300': { barColor: '#fda4af' }
'.bar-rose-400': { barColor: '#fb7185' }
'.bar-rose-500': { barColor: '#f43f5e' }
'.bar-rose-600': { barColor: '#e11d48' }
'.bar-rose-700': { barColor: '#be123c' }
'.bar-rose-800': { barColor: '#9f1239' }
'.bar-rose-900': { barColor: '#881337' }
'.bar-pink-50': { barColor: '#fdf2f8' }
'.bar-pink-100': { barColor: '#fce7f3' }
'.bar-pink-200': { barColor: '#fbcfe8' }
'.bar-pink-300': { barColor: '#f9a8d4' }
'.bar-pink-400': { barColor: '#f472b6' }
'.bar-pink-500': { barColor: '#ec4899' }
'.bar-pink-600': { barColor: '#db2777' }
'.bar-pink-700': { barColor: '#be185d' }
'.bar-pink-800': { barColor: '#9d174d' }
'.bar-pink-900': { barColor: '#831843' }
'.bar-fuchsia-50': { barColor: '#fdf4ff' }
'.bar-fuchsia-100': { barColor: '#fae8ff' }
'.bar-fuchsia-200': { barColor: '#f5d0fe' }
'.bar-fuchsia-300': { barColor: '#f0abfc' }
'.bar-fuchsia-400': { barColor: '#e879f9' }
'.bar-fuchsia-500': { barColor: '#d946ef' }
'.bar-fuchsia-600': { barColor: '#c026d3' }
'.bar-fuchsia-700': { barColor: '#a21caf' }
'.bar-fuchsia-800': { barColor: '#86198f' }
'.bar-fuchsia-900': { barColor: '#701a75' }
'.bar-purple-50': { barColor: '#faf5ff' }
'.bar-purple-100': { barColor: '#f3e8ff' }
'.bar-purple-200': { barColor: '#e9d5ff' }
'.bar-purple-300': { barColor: '#d8b4fe' }
'.bar-purple-400': { barColor: '#c084fc' }
'.bar-purple-500': { barColor: '#a855f7' }
'.bar-purple-600': { barColor: '#9333ea' }
'.bar-purple-700': { barColor: '#7e22ce' }
'.bar-purple-800': { barColor: '#6b21a8' }
'.bar-purple-900': { barColor: '#581c87' }
'.bar-violet-50': { barColor: '#f5f3ff' }
'.bar-violet-100': { barColor: '#ede9fe' }
'.bar-violet-200': { barColor: '#ddd6fe' }
'.bar-violet-300': { barColor: '#c4b5fd' }
'.bar-violet-400': { barColor: '#a78bfa' }
'.bar-violet-500': { barColor: '#8b5cf6' }
'.bar-violet-600': { barColor: '#7c3aed' }
'.bar-violet-700': { barColor: '#6d28d9' }
'.bar-violet-800': { barColor: '#5b21b6' }
'.bar-violet-900': { barColor: '#4c1d95' }
'.bar-indigo-50': { barColor: '#eef2ff' }
'.bar-indigo-100': { barColor: '#e0e7ff' }
'.bar-indigo-200': { barColor: '#c7d2fe' }
'.bar-indigo-300': { barColor: '#a5b4fc' }
'.bar-indigo-400': { barColor: '#818cf8' }
'.bar-indigo-500': { barColor: '#6366f1' }
'.bar-indigo-600': { barColor: '#4f46e5' }
'.bar-indigo-700': { barColor: '#4338ca' }
'.bar-indigo-800': { barColor: '#3730a3' }
'.bar-indigo-900': { barColor: '#312e81' }
'.bar-blue-50': { barColor: '#eff6ff' }
'.bar-blue-100': { barColor: '#dbeafe' }
'.bar-blue-200': { barColor: '#bfdbfe' }
'.bar-blue-300': { barColor: '#93c5fd' }
'.bar-blue-400': { barColor: '#60a5fa' }
'.bar-blue-500': { barColor: '#3b82f6' }
'.bar-blue-600': { barColor: '#2563eb' }
'.bar-blue-700': { barColor: '#1d4ed8' }
'.bar-blue-800': { barColor: '#1e40af' }
'.bar-blue-900': { barColor: '#1e3a8a' }
'.bar-sky-50': { barColor: '#f0f9ff' }
'.bar-sky-100': { barColor: '#e0f2fe' }
'.bar-sky-200': { barColor: '#bae6fd' }
'.bar-sky-300': { barColor: '#7dd3fc' }
'.bar-sky-400': { barColor: '#38bdf8' }
'.bar-sky-500': { barColor: '#0ea5e9' }
'.bar-sky-600': { barColor: '#0284c7' }
'.bar-sky-700': { barColor: '#0369a1' }
'.bar-sky-800': { barColor: '#075985' }
'.bar-sky-900': { barColor: '#0c4a6e' }
'.bar-cyan-50': { barColor: '#ecfeff' }
'.bar-cyan-100': { barColor: '#cffafe' }
'.bar-cyan-200': { barColor: '#a5f3fc' }
'.bar-cyan-300': { barColor: '#67e8f9' }
'.bar-cyan-400': { barColor: '#22d3ee' }
'.bar-cyan-500': { barColor: '#06b6d4' }
'.bar-cyan-600': { barColor: '#0891b2' }
'.bar-cyan-700': { barColor: '#0e7490' }
'.bar-cyan-800': { barColor: '#155e75' }
'.bar-cyan-900': { barColor: '#164e63' }
'.bar-teal-50': { barColor: '#f0fdfa' }
'.bar-teal-100': { barColor: '#ccfbf1' }
'.bar-teal-200': { barColor: '#99f6e4' }
'.bar-teal-300': { barColor: '#5eead4' }
'.bar-teal-400': { barColor: '#2dd4bf' }
'.bar-teal-500': { barColor: '#14b8a6' }
'.bar-teal-600': { barColor: '#0d9488' }
'.bar-teal-700': { barColor: '#0f766e' }
'.bar-teal-800': { barColor: '#115e59' }
'.bar-teal-900': { barColor: '#134e4a' }
'.bar-emerald-50': { barColor: '#ecfdf5' }
'.bar-emerald-100': { barColor: '#d1fae5' }
'.bar-emerald-200': { barColor: '#a7f3d0' }
'.bar-emerald-300': { barColor: '#6ee7b7' }
'.bar-emerald-400': { barColor: '#34d399' }
'.bar-emerald-500': { barColor: '#10b981' }
'.bar-emerald-600': { barColor: '#059669' }
'.bar-emerald-700': { barColor: '#047857' }
'.bar-emerald-800': { barColor: '#065f46' }
'.bar-emerald-900': { barColor: '#064e3b' }
'.bar-green-50': { barColor: '#f0fdf4' }
'.bar-green-100': { barColor: '#dcfce7' }
'.bar-green-200': { barColor: '#bbf7d0' }
'.bar-green-300': { barColor: '#86efac' }
'.bar-green-400': { barColor: '#4ade80' }
'.bar-green-500': { barColor: '#22c55e' }
'.bar-green-600': { barColor: '#16a34a' }
'.bar-green-700': { barColor: '#15803d' }
'.bar-green-800': { barColor: '#166534' }
'.bar-green-900': { barColor: '#14532d' }
'.bar-lime-50': { barColor: '#f7fee7' }
'.bar-lime-100': { barColor: '#ecfccb' }
'.bar-lime-200': { barColor: '#d9f99d' }
'.bar-lime-300': { barColor: '#bef264' }
'.bar-lime-400': { barColor: '#a3e635' }
'.bar-lime-500': { barColor: '#84cc16' }
'.bar-lime-600': { barColor: '#65a30d' }
'.bar-lime-700': { barColor: '#4d7c0f' }
'.bar-lime-800': { barColor: '#3f6212' }
'.bar-lime-900': { barColor: '#365314' }
'.bar-yellow-50': { barColor: '#fefce8' }
'.bar-yellow-100': { barColor: '#fef9c3' }
'.bar-yellow-200': { barColor: '#fef08a' }
'.bar-yellow-300': { barColor: '#fde047' }
'.bar-yellow-400': { barColor: '#facc15' }
'.bar-yellow-500': { barColor: '#eab308' }
'.bar-yellow-600': { barColor: '#ca8a04' }
'.bar-yellow-700': { barColor: '#a16207' }
'.bar-yellow-800': { barColor: '#854d0e' }
'.bar-yellow-900': { barColor: '#713f12' }
'.bar-amber-50': { barColor: '#fffbeb' }
'.bar-amber-100': { barColor: '#fef3c7' }
'.bar-amber-200': { barColor: '#fde68a' }
'.bar-amber-300': { barColor: '#fcd34d' }
'.bar-amber-400': { barColor: '#fbbf24' }
'.bar-amber-500': { barColor: '#f59e0b' }
'.bar-amber-600': { barColor: '#d97706' }
'.bar-amber-700': { barColor: '#b45309' }
'.bar-amber-800': { barColor: '#92400e' }
'.bar-amber-900': { barColor: '#78350f' }
'.bar-orange-50': { barColor: '#fff7ed' }
'.bar-orange-100': { barColor: '#ffedd5' }
'.bar-orange-200': { barColor: '#fed7aa' }
'.bar-orange-300': { barColor: '#fdba74' }
'.bar-orange-400': { barColor: '#fb923c' }
'.bar-orange-500': { barColor: '#f97316' }
'.bar-orange-600': { barColor: '#ea580c' }
'.bar-orange-700': { barColor: '#c2410c' }
'.bar-orange-800': { barColor: '#9a3412' }
'.bar-orange-900': { barColor: '#7c2d12' }
'.bar-red-50': { barColor: '#fef2f2' }
'.bar-red-100': { barColor: '#fee2e2' }
'.bar-red-200': { barColor: '#fecaca' }
'.bar-red-300': { barColor: '#fca5a5' }
'.bar-red-400': { barColor: '#f87171' }
'.bar-red-500': { barColor: '#ef4444' }
'.bar-red-600': { barColor: '#dc2626' }
'.bar-red-700': { barColor: '#b91c1c' }
'.bar-red-800': { barColor: '#991b1b' }
'.bar-red-900': { barColor: '#7f1d1d' }
'.bar-warmGray-50': { barColor: '#fafaf9' }
'.bar-warmGray-100': { barColor: '#f5f5f4' }
'.bar-warmGray-200': { barColor: '#e7e5e4' }
'.bar-warmGray-300': { barColor: '#d6d3d1' }
'.bar-warmGray-400': { barColor: '#a8a29e' }
'.bar-warmGray-500': { barColor: '#78716c' }
'.bar-warmGray-600': { barColor: '#57534e' }
'.bar-warmGray-700': { barColor: '#44403c' }
'.bar-warmGray-800': { barColor: '#292524' }
'.bar-warmGray-900': { barColor: '#1c1917' }
'.bar-trueGray-50': { barColor: '#fafafa' }
'.bar-trueGray-100': { barColor: '#f5f5f5' }
'.bar-trueGray-200': { barColor: '#e5e5e5' }
'.bar-trueGray-300': { barColor: '#d4d4d4' }
'.bar-trueGray-400': { barColor: '#a3a3a3' }
'.bar-trueGray-500': { barColor: '#737373' }
'.bar-trueGray-600': { barColor: '#525252' }
'.bar-trueGray-700': { barColor: '#404040' }
'.bar-trueGray-800': { barColor: '#262626' }
'.bar-trueGray-900': { barColor: '#171717' }
'.bar-gray-50': { barColor: '#fafafa' }
'.bar-gray-100': { barColor: '#f4f4f5' }
'.bar-gray-200': { barColor: '#e4e4e7' }
'.bar-gray-300': { barColor: '#d4d4d8' }
'.bar-gray-400': { barColor: '#a1a1aa' }
'.bar-gray-500': { barColor: '#71717a' }
'.bar-gray-600': { barColor: '#52525b' }
'.bar-gray-700': { barColor: '#3f3f46' }
'.bar-gray-800': { barColor: '#27272a' }
'.bar-gray-900': { barColor: '#18181b' }
'.bar-coolGray-50': { barColor: '#f9fafb' }
'.bar-coolGray-100': { barColor: '#f3f4f6' }
'.bar-coolGray-200': { barColor: '#e5e7eb' }
'.bar-coolGray-300': { barColor: '#d1d5db' }
'.bar-coolGray-400': { barColor: '#9ca3af' }
'.bar-coolGray-500': { barColor: '#6b7280' }
'.bar-coolGray-600': { barColor: '#4b5563' }
'.bar-coolGray-700': { barColor: '#374151' }
'.bar-coolGray-800': { barColor: '#1f2937' }
'.bar-coolGray-900': { barColor: '#111827' }
'.bar-blueGray-50': { barColor: '#f8fafc' }
'.bar-blueGray-100': { barColor: '#f1f5f9' }
'.bar-blueGray-200': { barColor: '#e2e8f0' }
'.bar-blueGray-300': { barColor: '#cbd5e1' }
'.bar-blueGray-400': { barColor: '#94a3b8' }
'.bar-blueGray-500': { barColor: '#64748b' }
'.bar-blueGray-600': { barColor: '#475569' }
'.bar-blueGray-700': { barColor: '#334155' }
'.bar-blueGray-800': { barColor: '#1e293b' }
'.bar-blueGray-900': { barColor: '#0f172a' }
```

## borderColor Property
```css
'.border-transparent': { borderColor: 'transparent' }
'.border-black': { borderColor: '#000000' }
'.border-white': { borderColor: '#ffffff' }
'.border-rose-50': { borderColor: '#fff1f2' }
'.border-rose-100': { borderColor: '#ffe4e6' }
'.border-rose-200': { borderColor: '#fecdd3' }
'.border-rose-300': { borderColor: '#fda4af' }
'.border-rose-400': { borderColor: '#fb7185' }
'.border-rose-500': { borderColor: '#f43f5e' }
'.border-rose-600': { borderColor: '#e11d48' }
'.border-rose-700': { borderColor: '#be123c' }
'.border-rose-800': { borderColor: '#9f1239' }
'.border-rose-900': { borderColor: '#881337' }
'.border-pink-50': { borderColor: '#fdf2f8' }
'.border-pink-100': { borderColor: '#fce7f3' }
'.border-pink-200': { borderColor: '#fbcfe8' }
'.border-pink-300': { borderColor: '#f9a8d4' }
'.border-pink-400': { borderColor: '#f472b6' }
'.border-pink-500': { borderColor: '#ec4899' }
'.border-pink-600': { borderColor: '#db2777' }
'.border-pink-700': { borderColor: '#be185d' }
'.border-pink-800': { borderColor: '#9d174d' }
'.border-pink-900': { borderColor: '#831843' }
'.border-fuchsia-50': { borderColor: '#fdf4ff' }
'.border-fuchsia-100': { borderColor: '#fae8ff' }
'.border-fuchsia-200': { borderColor: '#f5d0fe' }
'.border-fuchsia-300': { borderColor: '#f0abfc' }
'.border-fuchsia-400': { borderColor: '#e879f9' }
'.border-fuchsia-500': { borderColor: '#d946ef' }
'.border-fuchsia-600': { borderColor: '#c026d3' }
'.border-fuchsia-700': { borderColor: '#a21caf' }
'.border-fuchsia-800': { borderColor: '#86198f' }
'.border-fuchsia-900': { borderColor: '#701a75' }
'.border-purple-50': { borderColor: '#faf5ff' }
'.border-purple-100': { borderColor: '#f3e8ff' }
'.border-purple-200': { borderColor: '#e9d5ff' }
'.border-purple-300': { borderColor: '#d8b4fe' }
'.border-purple-400': { borderColor: '#c084fc' }
'.border-purple-500': { borderColor: '#a855f7' }
'.border-purple-600': { borderColor: '#9333ea' }
'.border-purple-700': { borderColor: '#7e22ce' }
'.border-purple-800': { borderColor: '#6b21a8' }
'.border-purple-900': { borderColor: '#581c87' }
'.border-violet-50': { borderColor: '#f5f3ff' }
'.border-violet-100': { borderColor: '#ede9fe' }
'.border-violet-200': { borderColor: '#ddd6fe' }
'.border-violet-300': { borderColor: '#c4b5fd' }
'.border-violet-400': { borderColor: '#a78bfa' }
'.border-violet-500': { borderColor: '#8b5cf6' }
'.border-violet-600': { borderColor: '#7c3aed' }
'.border-violet-700': { borderColor: '#6d28d9' }
'.border-violet-800': { borderColor: '#5b21b6' }
'.border-violet-900': { borderColor: '#4c1d95' }
'.border-indigo-50': { borderColor: '#eef2ff' }
'.border-indigo-100': { borderColor: '#e0e7ff' }
'.border-indigo-200': { borderColor: '#c7d2fe' }
'.border-indigo-300': { borderColor: '#a5b4fc' }
'.border-indigo-400': { borderColor: '#818cf8' }
'.border-indigo-500': { borderColor: '#6366f1' }
'.border-indigo-600': { borderColor: '#4f46e5' }
'.border-indigo-700': { borderColor: '#4338ca' }
'.border-indigo-800': { borderColor: '#3730a3' }
'.border-indigo-900': { borderColor: '#312e81' }
'.border-blue-50': { borderColor: '#eff6ff' }
'.border-blue-100': { borderColor: '#dbeafe' }
'.border-blue-200': { borderColor: '#bfdbfe' }
'.border-blue-300': { borderColor: '#93c5fd' }
'.border-blue-400': { borderColor: '#60a5fa' }
'.border-blue-500': { borderColor: '#3b82f6' }
'.border-blue-600': { borderColor: '#2563eb' }
'.border-blue-700': { borderColor: '#1d4ed8' }
'.border-blue-800': { borderColor: '#1e40af' }
'.border-blue-900': { borderColor: '#1e3a8a' }
'.border-sky-50': { borderColor: '#f0f9ff' }
'.border-sky-100': { borderColor: '#e0f2fe' }
'.border-sky-200': { borderColor: '#bae6fd' }
'.border-sky-300': { borderColor: '#7dd3fc' }
'.border-sky-400': { borderColor: '#38bdf8' }
'.border-sky-500': { borderColor: '#0ea5e9' }
'.border-sky-600': { borderColor: '#0284c7' }
'.border-sky-700': { borderColor: '#0369a1' }
'.border-sky-800': { borderColor: '#075985' }
'.border-sky-900': { borderColor: '#0c4a6e' }
'.border-cyan-50': { borderColor: '#ecfeff' }
'.border-cyan-100': { borderColor: '#cffafe' }
'.border-cyan-200': { borderColor: '#a5f3fc' }
'.border-cyan-300': { borderColor: '#67e8f9' }
'.border-cyan-400': { borderColor: '#22d3ee' }
'.border-cyan-500': { borderColor: '#06b6d4' }
'.border-cyan-600': { borderColor: '#0891b2' }
'.border-cyan-700': { borderColor: '#0e7490' }
'.border-cyan-800': { borderColor: '#155e75' }
'.border-cyan-900': { borderColor: '#164e63' }
'.border-teal-50': { borderColor: '#f0fdfa' }
'.border-teal-100': { borderColor: '#ccfbf1' }
'.border-teal-200': { borderColor: '#99f6e4' }
'.border-teal-300': { borderColor: '#5eead4' }
'.border-teal-400': { borderColor: '#2dd4bf' }
'.border-teal-500': { borderColor: '#14b8a6' }
'.border-teal-600': { borderColor: '#0d9488' }
'.border-teal-700': { borderColor: '#0f766e' }
'.border-teal-800': { borderColor: '#115e59' }
'.border-teal-900': { borderColor: '#134e4a' }
'.border-emerald-50': { borderColor: '#ecfdf5' }
'.border-emerald-100': { borderColor: '#d1fae5' }
'.border-emerald-200': { borderColor: '#a7f3d0' }
'.border-emerald-300': { borderColor: '#6ee7b7' }
'.border-emerald-400': { borderColor: '#34d399' }
'.border-emerald-500': { borderColor: '#10b981' }
'.border-emerald-600': { borderColor: '#059669' }
'.border-emerald-700': { borderColor: '#047857' }
'.border-emerald-800': { borderColor: '#065f46' }
'.border-emerald-900': { borderColor: '#064e3b' }
'.border-green-50': { borderColor: '#f0fdf4' }
'.border-green-100': { borderColor: '#dcfce7' }
'.border-green-200': { borderColor: '#bbf7d0' }
'.border-green-300': { borderColor: '#86efac' }
'.border-green-400': { borderColor: '#4ade80' }
'.border-green-500': { borderColor: '#22c55e' }
'.border-green-600': { borderColor: '#16a34a' }
'.border-green-700': { borderColor: '#15803d' }
'.border-green-800': { borderColor: '#166534' }
'.border-green-900': { borderColor: '#14532d' }
'.border-lime-50': { borderColor: '#f7fee7' }
'.border-lime-100': { borderColor: '#ecfccb' }
'.border-lime-200': { borderColor: '#d9f99d' }
'.border-lime-300': { borderColor: '#bef264' }
'.border-lime-400': { borderColor: '#a3e635' }
'.border-lime-500': { borderColor: '#84cc16' }
'.border-lime-600': { borderColor: '#65a30d' }
'.border-lime-700': { borderColor: '#4d7c0f' }
'.border-lime-800': { borderColor: '#3f6212' }
'.border-lime-900': { borderColor: '#365314' }
'.border-yellow-50': { borderColor: '#fefce8' }
'.border-yellow-100': { borderColor: '#fef9c3' }
'.border-yellow-200': { borderColor: '#fef08a' }
'.border-yellow-300': { borderColor: '#fde047' }
'.border-yellow-400': { borderColor: '#facc15' }
'.border-yellow-500': { borderColor: '#eab308' }
'.border-yellow-600': { borderColor: '#ca8a04' }
'.border-yellow-700': { borderColor: '#a16207' }
'.border-yellow-800': { borderColor: '#854d0e' }
'.border-yellow-900': { borderColor: '#713f12' }
'.border-amber-50': { borderColor: '#fffbeb' }
'.border-amber-100': { borderColor: '#fef3c7' }
'.border-amber-200': { borderColor: '#fde68a' }
'.border-amber-300': { borderColor: '#fcd34d' }
'.border-amber-400': { borderColor: '#fbbf24' }
'.border-amber-500': { borderColor: '#f59e0b' }
'.border-amber-600': { borderColor: '#d97706' }
'.border-amber-700': { borderColor: '#b45309' }
'.border-amber-800': { borderColor: '#92400e' }
'.border-amber-900': { borderColor: '#78350f' }
'.border-orange-50': { borderColor: '#fff7ed' }
'.border-orange-100': { borderColor: '#ffedd5' }
'.border-orange-200': { borderColor: '#fed7aa' }
'.border-orange-300': { borderColor: '#fdba74' }
'.border-orange-400': { borderColor: '#fb923c' }
'.border-orange-500': { borderColor: '#f97316' }
'.border-orange-600': { borderColor: '#ea580c' }
'.border-orange-700': { borderColor: '#c2410c' }
'.border-orange-800': { borderColor: '#9a3412' }
'.border-orange-900': { borderColor: '#7c2d12' }
'.border-red-50': { borderColor: '#fef2f2' }
'.border-red-100': { borderColor: '#fee2e2' }
'.border-red-200': { borderColor: '#fecaca' }
'.border-red-300': { borderColor: '#fca5a5' }
'.border-red-400': { borderColor: '#f87171' }
'.border-red-500': { borderColor: '#ef4444' }
'.border-red-600': { borderColor: '#dc2626' }
'.border-red-700': { borderColor: '#b91c1c' }
'.border-red-800': { borderColor: '#991b1b' }
'.border-red-900': { borderColor: '#7f1d1d' }
'.border-warmGray-50': { borderColor: '#fafaf9' }
'.border-warmGray-100': { borderColor: '#f5f5f4' }
'.border-warmGray-200': { borderColor: '#e7e5e4' }
'.border-warmGray-300': { borderColor: '#d6d3d1' }
'.border-warmGray-400': { borderColor: '#a8a29e' }
'.border-warmGray-500': { borderColor: '#78716c' }
'.border-warmGray-600': { borderColor: '#57534e' }
'.border-warmGray-700': { borderColor: '#44403c' }
'.border-warmGray-800': { borderColor: '#292524' }
'.border-warmGray-900': { borderColor: '#1c1917' }
'.border-trueGray-50': { borderColor: '#fafafa' }
'.border-trueGray-100': { borderColor: '#f5f5f5' }
'.border-trueGray-200': { borderColor: '#e5e5e5' }
'.border-trueGray-300': { borderColor: '#d4d4d4' }
'.border-trueGray-400': { borderColor: '#a3a3a3' }
'.border-trueGray-500': { borderColor: '#737373' }
'.border-trueGray-600': { borderColor: '#525252' }
'.border-trueGray-700': { borderColor: '#404040' }
'.border-trueGray-800': { borderColor: '#262626' }
'.border-trueGray-900': { borderColor: '#171717' }
'.border-gray-50': { borderColor: '#fafafa' }
'.border-gray-100': { borderColor: '#f4f4f5' }
'.border-gray-200': { borderColor: '#e4e4e7' }
'.border-gray-300': { borderColor: '#d4d4d8' }
'.border-gray-400': { borderColor: '#a1a1aa' }
'.border-gray-500': { borderColor: '#71717a' }
'.border-gray-600': { borderColor: '#52525b' }
'.border-gray-700': { borderColor: '#3f3f46' }
'.border-gray-800': { borderColor: '#27272a' }
'.border-gray-900': { borderColor: '#18181b' }
'.border-coolGray-50': { borderColor: '#f9fafb' }
'.border-coolGray-100': { borderColor: '#f3f4f6' }
'.border-coolGray-200': { borderColor: '#e5e7eb' }
'.border-coolGray-300': { borderColor: '#d1d5db' }
'.border-coolGray-400': { borderColor: '#9ca3af' }
'.border-coolGray-500': { borderColor: '#6b7280' }
'.border-coolGray-600': { borderColor: '#4b5563' }
'.border-coolGray-700': { borderColor: '#374151' }
'.border-coolGray-800': { borderColor: '#1f2937' }
'.border-coolGray-900': { borderColor: '#111827' }
'.border-blueGray-50': { borderColor: '#f8fafc' }
'.border-blueGray-100': { borderColor: '#f1f5f9' }
'.border-blueGray-200': { borderColor: '#e2e8f0' }
'.border-blueGray-300': { borderColor: '#cbd5e1' }
'.border-blueGray-400': { borderColor: '#94a3b8' }
'.border-blueGray-500': { borderColor: '#64748b' }
'.border-blueGray-600': { borderColor: '#475569' }
'.border-blueGray-700': { borderColor: '#334155' }
'.border-blueGray-800': { borderColor: '#1e293b' }
'.border-blueGray-900': { borderColor: '#0f172a' }
```

## borderRadius - ( With Extra Styles ) Property
```css
'.rounded-0': { borderRadius: 0 }
'.rounded-1': { borderRadius: 2 }
'.rounded-2': { borderRadius: 4 }
'.rounded-3': { borderRadius: 6 }
'.rounded-4': { borderRadius: 8 }
'.rounded-5': { borderRadius: 10 }
'.rounded-6': { borderRadius: 12 }
'.rounded-7': { borderRadius: 14 }
'.rounded-8': { borderRadius: 16 }
'.rounded-9': { borderRadius: 18 }
'.rounded-10': { borderRadius: 20 }
'.rounded-11': { borderRadius: 22 }
'.rounded-12': { borderRadius: 24 }
'.rounded-13': { borderRadius: 26 }
'.rounded-14': { borderRadius: 28 }
'.rounded-15': { borderRadius: 30 }
'.rounded-16': { borderRadius: 32 }
'.rounded-20': { borderRadius: 40 }
'.rounded-24': { borderRadius: 48 }
'.rounded-28': { borderRadius: 56 }
'.rounded-32': { borderRadius: 64 }
'.rounded-36': { borderRadius: 72 }
'.rounded-40': { borderRadius: 80 }
'.rounded-44': { borderRadius: 88 }
'.rounded-48': { borderRadius: 96 }
'.rounded-52': { borderRadius: 104 }
'.rounded-56': { borderRadius: 112 }
'.rounded-60': { borderRadius: 120 }
'.rounded-64': { borderRadius: 128 }
'.rounded-72': { borderRadius: 144 }
'.rounded-80': { borderRadius: 160 }
'.rounded-96': { borderRadius: 192 }
'.rounded-none': { borderRadius: 0 }
'.rounded-sm': { borderRadius: 2 }
'.rounded': { borderRadius: 4 }
'.rounded-md': { borderRadius: 6 }
'.rounded-lg': { borderRadius: 8 }
'.rounded-xl': { borderRadius: 12 }
'.rounded-2xl': { borderRadius: 16 }
'.rounded-3xl': { borderRadius: 24 }
'.rounded-px': { borderRadius: '1px' }
'.rounded-0.5': { borderRadius: 1 }
'.rounded-1.5': { borderRadius: 3 }
'.rounded-2.5': { borderRadius: 5 }
'.rounded-3.5': { borderRadius: 7 }
```

## borderStyle Property
```css
'.input-borderstyle-line': { borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE }
'.input-borderstyle-none': { borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE }
'.input-borderstyle-bezel': { borderStyle: Ti.UI.INPUT_BORDERSTYLE_BEZEL }
'.input-borderstyle-filled': { borderStyle: Ti.UI.INPUT_BORDERSTYLE_FILLED }
'.input-borderstyle-rounded': { borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED }
'.input-borderstyle-underlined': { borderStyle: Ti.UI.INPUT_BORDERSTYLE_UNDERLINED }
```

## borderWidth Property
```css
'.border-0': { borderWidth: 0 }
'.border-2': { borderWidth: 2 }
'.border-4': { borderWidth: 4 }
'.border-8': { borderWidth: 8 }
'.border': { borderWidth: 1 }
```

## disableBounce Property
```css
'.enable-bounce': { disableBounce: false }
'.disable-bounce': { disableBounce: true }
```

## displayCaps Property
```css
'.platform-w': { width: Ti.Platform.displayCaps.platformWidth }
'.platform-h': { height: Ti.Platform.displayCaps.platformHeight }
'.inverted-platform-w': { width: Ti.Platform.displayCaps.platformHeight }
'.inverted-platform-h': { height: Ti.Platform.displayCaps.platformWidth }
'.inverted-platform-w[platform=android]': { width: Ti.Platform.displayCaps.platformWidth }
'.inverted-platform-h[platform=android]': { height: Ti.Platform.displayCaps.platformHeight }
```

## clipMode Property
```css
'.clip-enabled[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_ENABLED }
'.clip-disabled[platform=ios]': { clipMode: Ti.UI.iOS.CLIP_MODE_DISABLED }
```

## currentPageIndicatorColor Property
```css
'.current-page-transparent': { currentPageIndicatorColor: 'transparent' }
'.current-page-black': { currentPageIndicatorColor: '#000000' }
'.current-page-white': { currentPageIndicatorColor: '#ffffff' }
'.current-page-rose-50': { currentPageIndicatorColor: '#fff1f2' }
'.current-page-rose-100': { currentPageIndicatorColor: '#ffe4e6' }
'.current-page-rose-200': { currentPageIndicatorColor: '#fecdd3' }
'.current-page-rose-300': { currentPageIndicatorColor: '#fda4af' }
'.current-page-rose-400': { currentPageIndicatorColor: '#fb7185' }
'.current-page-rose-500': { currentPageIndicatorColor: '#f43f5e' }
'.current-page-rose-600': { currentPageIndicatorColor: '#e11d48' }
'.current-page-rose-700': { currentPageIndicatorColor: '#be123c' }
'.current-page-rose-800': { currentPageIndicatorColor: '#9f1239' }
'.current-page-rose-900': { currentPageIndicatorColor: '#881337' }
'.current-page-pink-50': { currentPageIndicatorColor: '#fdf2f8' }
'.current-page-pink-100': { currentPageIndicatorColor: '#fce7f3' }
'.current-page-pink-200': { currentPageIndicatorColor: '#fbcfe8' }
'.current-page-pink-300': { currentPageIndicatorColor: '#f9a8d4' }
'.current-page-pink-400': { currentPageIndicatorColor: '#f472b6' }
'.current-page-pink-500': { currentPageIndicatorColor: '#ec4899' }
'.current-page-pink-600': { currentPageIndicatorColor: '#db2777' }
'.current-page-pink-700': { currentPageIndicatorColor: '#be185d' }
'.current-page-pink-800': { currentPageIndicatorColor: '#9d174d' }
'.current-page-pink-900': { currentPageIndicatorColor: '#831843' }
'.current-page-fuchsia-50': { currentPageIndicatorColor: '#fdf4ff' }
'.current-page-fuchsia-100': { currentPageIndicatorColor: '#fae8ff' }
'.current-page-fuchsia-200': { currentPageIndicatorColor: '#f5d0fe' }
'.current-page-fuchsia-300': { currentPageIndicatorColor: '#f0abfc' }
'.current-page-fuchsia-400': { currentPageIndicatorColor: '#e879f9' }
'.current-page-fuchsia-500': { currentPageIndicatorColor: '#d946ef' }
'.current-page-fuchsia-600': { currentPageIndicatorColor: '#c026d3' }
'.current-page-fuchsia-700': { currentPageIndicatorColor: '#a21caf' }
'.current-page-fuchsia-800': { currentPageIndicatorColor: '#86198f' }
'.current-page-fuchsia-900': { currentPageIndicatorColor: '#701a75' }
'.current-page-purple-50': { currentPageIndicatorColor: '#faf5ff' }
'.current-page-purple-100': { currentPageIndicatorColor: '#f3e8ff' }
'.current-page-purple-200': { currentPageIndicatorColor: '#e9d5ff' }
'.current-page-purple-300': { currentPageIndicatorColor: '#d8b4fe' }
'.current-page-purple-400': { currentPageIndicatorColor: '#c084fc' }
'.current-page-purple-500': { currentPageIndicatorColor: '#a855f7' }
'.current-page-purple-600': { currentPageIndicatorColor: '#9333ea' }
'.current-page-purple-700': { currentPageIndicatorColor: '#7e22ce' }
'.current-page-purple-800': { currentPageIndicatorColor: '#6b21a8' }
'.current-page-purple-900': { currentPageIndicatorColor: '#581c87' }
'.current-page-violet-50': { currentPageIndicatorColor: '#f5f3ff' }
'.current-page-violet-100': { currentPageIndicatorColor: '#ede9fe' }
'.current-page-violet-200': { currentPageIndicatorColor: '#ddd6fe' }
'.current-page-violet-300': { currentPageIndicatorColor: '#c4b5fd' }
'.current-page-violet-400': { currentPageIndicatorColor: '#a78bfa' }
'.current-page-violet-500': { currentPageIndicatorColor: '#8b5cf6' }
'.current-page-violet-600': { currentPageIndicatorColor: '#7c3aed' }
'.current-page-violet-700': { currentPageIndicatorColor: '#6d28d9' }
'.current-page-violet-800': { currentPageIndicatorColor: '#5b21b6' }
'.current-page-violet-900': { currentPageIndicatorColor: '#4c1d95' }
'.current-page-indigo-50': { currentPageIndicatorColor: '#eef2ff' }
'.current-page-indigo-100': { currentPageIndicatorColor: '#e0e7ff' }
'.current-page-indigo-200': { currentPageIndicatorColor: '#c7d2fe' }
'.current-page-indigo-300': { currentPageIndicatorColor: '#a5b4fc' }
'.current-page-indigo-400': { currentPageIndicatorColor: '#818cf8' }
'.current-page-indigo-500': { currentPageIndicatorColor: '#6366f1' }
'.current-page-indigo-600': { currentPageIndicatorColor: '#4f46e5' }
'.current-page-indigo-700': { currentPageIndicatorColor: '#4338ca' }
'.current-page-indigo-800': { currentPageIndicatorColor: '#3730a3' }
'.current-page-indigo-900': { currentPageIndicatorColor: '#312e81' }
'.current-page-blue-50': { currentPageIndicatorColor: '#eff6ff' }
'.current-page-blue-100': { currentPageIndicatorColor: '#dbeafe' }
'.current-page-blue-200': { currentPageIndicatorColor: '#bfdbfe' }
'.current-page-blue-300': { currentPageIndicatorColor: '#93c5fd' }
'.current-page-blue-400': { currentPageIndicatorColor: '#60a5fa' }
'.current-page-blue-500': { currentPageIndicatorColor: '#3b82f6' }
'.current-page-blue-600': { currentPageIndicatorColor: '#2563eb' }
'.current-page-blue-700': { currentPageIndicatorColor: '#1d4ed8' }
'.current-page-blue-800': { currentPageIndicatorColor: '#1e40af' }
'.current-page-blue-900': { currentPageIndicatorColor: '#1e3a8a' }
'.current-page-sky-50': { currentPageIndicatorColor: '#f0f9ff' }
'.current-page-sky-100': { currentPageIndicatorColor: '#e0f2fe' }
'.current-page-sky-200': { currentPageIndicatorColor: '#bae6fd' }
'.current-page-sky-300': { currentPageIndicatorColor: '#7dd3fc' }
'.current-page-sky-400': { currentPageIndicatorColor: '#38bdf8' }
'.current-page-sky-500': { currentPageIndicatorColor: '#0ea5e9' }
'.current-page-sky-600': { currentPageIndicatorColor: '#0284c7' }
'.current-page-sky-700': { currentPageIndicatorColor: '#0369a1' }
'.current-page-sky-800': { currentPageIndicatorColor: '#075985' }
'.current-page-sky-900': { currentPageIndicatorColor: '#0c4a6e' }
'.current-page-cyan-50': { currentPageIndicatorColor: '#ecfeff' }
'.current-page-cyan-100': { currentPageIndicatorColor: '#cffafe' }
'.current-page-cyan-200': { currentPageIndicatorColor: '#a5f3fc' }
'.current-page-cyan-300': { currentPageIndicatorColor: '#67e8f9' }
'.current-page-cyan-400': { currentPageIndicatorColor: '#22d3ee' }
'.current-page-cyan-500': { currentPageIndicatorColor: '#06b6d4' }
'.current-page-cyan-600': { currentPageIndicatorColor: '#0891b2' }
'.current-page-cyan-700': { currentPageIndicatorColor: '#0e7490' }
'.current-page-cyan-800': { currentPageIndicatorColor: '#155e75' }
'.current-page-cyan-900': { currentPageIndicatorColor: '#164e63' }
'.current-page-teal-50': { currentPageIndicatorColor: '#f0fdfa' }
'.current-page-teal-100': { currentPageIndicatorColor: '#ccfbf1' }
'.current-page-teal-200': { currentPageIndicatorColor: '#99f6e4' }
'.current-page-teal-300': { currentPageIndicatorColor: '#5eead4' }
'.current-page-teal-400': { currentPageIndicatorColor: '#2dd4bf' }
'.current-page-teal-500': { currentPageIndicatorColor: '#14b8a6' }
'.current-page-teal-600': { currentPageIndicatorColor: '#0d9488' }
'.current-page-teal-700': { currentPageIndicatorColor: '#0f766e' }
'.current-page-teal-800': { currentPageIndicatorColor: '#115e59' }
'.current-page-teal-900': { currentPageIndicatorColor: '#134e4a' }
'.current-page-emerald-50': { currentPageIndicatorColor: '#ecfdf5' }
'.current-page-emerald-100': { currentPageIndicatorColor: '#d1fae5' }
'.current-page-emerald-200': { currentPageIndicatorColor: '#a7f3d0' }
'.current-page-emerald-300': { currentPageIndicatorColor: '#6ee7b7' }
'.current-page-emerald-400': { currentPageIndicatorColor: '#34d399' }
'.current-page-emerald-500': { currentPageIndicatorColor: '#10b981' }
'.current-page-emerald-600': { currentPageIndicatorColor: '#059669' }
'.current-page-emerald-700': { currentPageIndicatorColor: '#047857' }
'.current-page-emerald-800': { currentPageIndicatorColor: '#065f46' }
'.current-page-emerald-900': { currentPageIndicatorColor: '#064e3b' }
'.current-page-green-50': { currentPageIndicatorColor: '#f0fdf4' }
'.current-page-green-100': { currentPageIndicatorColor: '#dcfce7' }
'.current-page-green-200': { currentPageIndicatorColor: '#bbf7d0' }
'.current-page-green-300': { currentPageIndicatorColor: '#86efac' }
'.current-page-green-400': { currentPageIndicatorColor: '#4ade80' }
'.current-page-green-500': { currentPageIndicatorColor: '#22c55e' }
'.current-page-green-600': { currentPageIndicatorColor: '#16a34a' }
'.current-page-green-700': { currentPageIndicatorColor: '#15803d' }
'.current-page-green-800': { currentPageIndicatorColor: '#166534' }
'.current-page-green-900': { currentPageIndicatorColor: '#14532d' }
'.current-page-lime-50': { currentPageIndicatorColor: '#f7fee7' }
'.current-page-lime-100': { currentPageIndicatorColor: '#ecfccb' }
'.current-page-lime-200': { currentPageIndicatorColor: '#d9f99d' }
'.current-page-lime-300': { currentPageIndicatorColor: '#bef264' }
'.current-page-lime-400': { currentPageIndicatorColor: '#a3e635' }
'.current-page-lime-500': { currentPageIndicatorColor: '#84cc16' }
'.current-page-lime-600': { currentPageIndicatorColor: '#65a30d' }
'.current-page-lime-700': { currentPageIndicatorColor: '#4d7c0f' }
'.current-page-lime-800': { currentPageIndicatorColor: '#3f6212' }
'.current-page-lime-900': { currentPageIndicatorColor: '#365314' }
'.current-page-yellow-50': { currentPageIndicatorColor: '#fefce8' }
'.current-page-yellow-100': { currentPageIndicatorColor: '#fef9c3' }
'.current-page-yellow-200': { currentPageIndicatorColor: '#fef08a' }
'.current-page-yellow-300': { currentPageIndicatorColor: '#fde047' }
'.current-page-yellow-400': { currentPageIndicatorColor: '#facc15' }
'.current-page-yellow-500': { currentPageIndicatorColor: '#eab308' }
'.current-page-yellow-600': { currentPageIndicatorColor: '#ca8a04' }
'.current-page-yellow-700': { currentPageIndicatorColor: '#a16207' }
'.current-page-yellow-800': { currentPageIndicatorColor: '#854d0e' }
'.current-page-yellow-900': { currentPageIndicatorColor: '#713f12' }
'.current-page-amber-50': { currentPageIndicatorColor: '#fffbeb' }
'.current-page-amber-100': { currentPageIndicatorColor: '#fef3c7' }
'.current-page-amber-200': { currentPageIndicatorColor: '#fde68a' }
'.current-page-amber-300': { currentPageIndicatorColor: '#fcd34d' }
'.current-page-amber-400': { currentPageIndicatorColor: '#fbbf24' }
'.current-page-amber-500': { currentPageIndicatorColor: '#f59e0b' }
'.current-page-amber-600': { currentPageIndicatorColor: '#d97706' }
'.current-page-amber-700': { currentPageIndicatorColor: '#b45309' }
'.current-page-amber-800': { currentPageIndicatorColor: '#92400e' }
'.current-page-amber-900': { currentPageIndicatorColor: '#78350f' }
'.current-page-orange-50': { currentPageIndicatorColor: '#fff7ed' }
'.current-page-orange-100': { currentPageIndicatorColor: '#ffedd5' }
'.current-page-orange-200': { currentPageIndicatorColor: '#fed7aa' }
'.current-page-orange-300': { currentPageIndicatorColor: '#fdba74' }
'.current-page-orange-400': { currentPageIndicatorColor: '#fb923c' }
'.current-page-orange-500': { currentPageIndicatorColor: '#f97316' }
'.current-page-orange-600': { currentPageIndicatorColor: '#ea580c' }
'.current-page-orange-700': { currentPageIndicatorColor: '#c2410c' }
'.current-page-orange-800': { currentPageIndicatorColor: '#9a3412' }
'.current-page-orange-900': { currentPageIndicatorColor: '#7c2d12' }
'.current-page-red-50': { currentPageIndicatorColor: '#fef2f2' }
'.current-page-red-100': { currentPageIndicatorColor: '#fee2e2' }
'.current-page-red-200': { currentPageIndicatorColor: '#fecaca' }
'.current-page-red-300': { currentPageIndicatorColor: '#fca5a5' }
'.current-page-red-400': { currentPageIndicatorColor: '#f87171' }
'.current-page-red-500': { currentPageIndicatorColor: '#ef4444' }
'.current-page-red-600': { currentPageIndicatorColor: '#dc2626' }
'.current-page-red-700': { currentPageIndicatorColor: '#b91c1c' }
'.current-page-red-800': { currentPageIndicatorColor: '#991b1b' }
'.current-page-red-900': { currentPageIndicatorColor: '#7f1d1d' }
'.current-page-warmGray-50': { currentPageIndicatorColor: '#fafaf9' }
'.current-page-warmGray-100': { currentPageIndicatorColor: '#f5f5f4' }
'.current-page-warmGray-200': { currentPageIndicatorColor: '#e7e5e4' }
'.current-page-warmGray-300': { currentPageIndicatorColor: '#d6d3d1' }
'.current-page-warmGray-400': { currentPageIndicatorColor: '#a8a29e' }
'.current-page-warmGray-500': { currentPageIndicatorColor: '#78716c' }
'.current-page-warmGray-600': { currentPageIndicatorColor: '#57534e' }
'.current-page-warmGray-700': { currentPageIndicatorColor: '#44403c' }
'.current-page-warmGray-800': { currentPageIndicatorColor: '#292524' }
'.current-page-warmGray-900': { currentPageIndicatorColor: '#1c1917' }
'.current-page-trueGray-50': { currentPageIndicatorColor: '#fafafa' }
'.current-page-trueGray-100': { currentPageIndicatorColor: '#f5f5f5' }
'.current-page-trueGray-200': { currentPageIndicatorColor: '#e5e5e5' }
'.current-page-trueGray-300': { currentPageIndicatorColor: '#d4d4d4' }
'.current-page-trueGray-400': { currentPageIndicatorColor: '#a3a3a3' }
'.current-page-trueGray-500': { currentPageIndicatorColor: '#737373' }
'.current-page-trueGray-600': { currentPageIndicatorColor: '#525252' }
'.current-page-trueGray-700': { currentPageIndicatorColor: '#404040' }
'.current-page-trueGray-800': { currentPageIndicatorColor: '#262626' }
'.current-page-trueGray-900': { currentPageIndicatorColor: '#171717' }
'.current-page-gray-50': { currentPageIndicatorColor: '#fafafa' }
'.current-page-gray-100': { currentPageIndicatorColor: '#f4f4f5' }
'.current-page-gray-200': { currentPageIndicatorColor: '#e4e4e7' }
'.current-page-gray-300': { currentPageIndicatorColor: '#d4d4d8' }
'.current-page-gray-400': { currentPageIndicatorColor: '#a1a1aa' }
'.current-page-gray-500': { currentPageIndicatorColor: '#71717a' }
'.current-page-gray-600': { currentPageIndicatorColor: '#52525b' }
'.current-page-gray-700': { currentPageIndicatorColor: '#3f3f46' }
'.current-page-gray-800': { currentPageIndicatorColor: '#27272a' }
'.current-page-gray-900': { currentPageIndicatorColor: '#18181b' }
'.current-page-coolGray-50': { currentPageIndicatorColor: '#f9fafb' }
'.current-page-coolGray-100': { currentPageIndicatorColor: '#f3f4f6' }
'.current-page-coolGray-200': { currentPageIndicatorColor: '#e5e7eb' }
'.current-page-coolGray-300': { currentPageIndicatorColor: '#d1d5db' }
'.current-page-coolGray-400': { currentPageIndicatorColor: '#9ca3af' }
'.current-page-coolGray-500': { currentPageIndicatorColor: '#6b7280' }
'.current-page-coolGray-600': { currentPageIndicatorColor: '#4b5563' }
'.current-page-coolGray-700': { currentPageIndicatorColor: '#374151' }
'.current-page-coolGray-800': { currentPageIndicatorColor: '#1f2937' }
'.current-page-coolGray-900': { currentPageIndicatorColor: '#111827' }
'.current-page-blueGray-50': { currentPageIndicatorColor: '#f8fafc' }
'.current-page-blueGray-100': { currentPageIndicatorColor: '#f1f5f9' }
'.current-page-blueGray-200': { currentPageIndicatorColor: '#e2e8f0' }
'.current-page-blueGray-300': { currentPageIndicatorColor: '#cbd5e1' }
'.current-page-blueGray-400': { currentPageIndicatorColor: '#94a3b8' }
'.current-page-blueGray-500': { currentPageIndicatorColor: '#64748b' }
'.current-page-blueGray-600': { currentPageIndicatorColor: '#475569' }
'.current-page-blueGray-700': { currentPageIndicatorColor: '#334155' }
'.current-page-blueGray-800': { currentPageIndicatorColor: '#1e293b' }
'.current-page-blueGray-900': { currentPageIndicatorColor: '#0f172a' }
```

## preventDefaultImage Property
```css
'.prevent-default-image[platform=ios]': { preventDefaultImage: true }
'.display-default-image[platform=ios]': { preventDefaultImage: false }
```

## Display
```css
'.block': { visible: true }
'.hidden': { visible: false }
```

## Constraint Property
```css
'.vertical-constraint': { constraint: 'vertical' }
'.horizontal-constraint': { constraint: 'horizontal' }
```

## draggingType Property
```css
'.drag-apply': { draggingType: 'apply' }
'.drag-animate': { draggingType: 'animate' }
```

## editable Property
```css
'.editable': { editable: true }
'.none-editable': { editable: false }
```

## ellipsize Property
```css
'.ellipsize': { ellipsize: true }
'.no-ellipsize': { ellipsize: false }
```

## ellipsize Property ( for Labels )
```css
'.ellipsize-end': { ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_END }
'.ellipsize-clip': { ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_CLIP }
'.ellipsize-none': { ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_NONE }
'.ellipsize-start': { ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_START }
'.ellipsize-middle': { ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MIDDLE }
'.ellipsize-marquee': { ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_MARQUEE }
'.ellipsize-char-wrap': { ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_CHAR_WRAP }
'.ellipsize-word-wrap': { ellipsize: Ti.UI.TEXT_ELLIPSIZE_TRUNCATE_WORD_WRAP }
```

## enableCopy Property
```css
'.enable-copy': { enableCopy: true }
'.disable-copy': { enableCopy: false }
```

## enableReturnKey Property
```css
'.enable-return-key': { enableReturnKey: true }
'.disable-return-key': { enableReturnKey: false }
```

## exitOnClose Property
```css
'.exit-on-close[platform=android]': { exitOnClose: true }
'.dont-exit-on-close[platform=android]': { exitOnClose: false }
```

## extendBackground Property
```css
'.extend-background': { extendBackground: true }
'.no-extend-background': { extendBackground: false }
```

## Flip Property
```css
'.flip-vertical': { flip: 'vertical'}
'.flip-horizontal': { flip: 'horizontal'}
```

## Font Properties
### fontSize Property
```css
'.text-xs': { font: { fontSize: 12 } }
'.text-sm': { font: { fontSize: 14 } }
'.text-base': { font: { fontSize: 16 } }
'.text-lg': { font: { fontSize: 18 } }
'.text-xl': { font: { fontSize: 20 } }
'.text-2xl': { font: { fontSize: 24 } }
'.text-3xl': { font: { fontSize: 30 } }
'.text-4xl': { font: { fontSize: 36 } }
'.text-5xl': { font: { fontSize: 48 } }
'.text-6xl': { font: { fontSize: 60 } }
'.text-7xl': { font: { fontSize: 72 } }
'.text-8xl': { font: { fontSize: 96 } }
'.text-9xl': { font: { fontSize: 128 } }
```

### fontStyle Property
```css
'.italic': { font: { fontStyle: 'italic' } }
'.not-italic': { font: { fontStyle: 'normal' } }
```

### fontWeight Property
```css
'.font-thin': { font: { fontWeight: 'thin' } }
'.font-extralight': { font: { fontWeight: 'extralight' } }
'.font-light': { font: { fontWeight: 'light' } }
'.font-normal': { font: { fontWeight: 'normal' } }
'.font-medium': { font: { fontWeight: 'normal' } }
'.font-semibold': { font: { fontWeight: 'semibold' } }
'.font-bold': { font: { fontWeight: 'bold' } }
'.font-extrabold': { font: { fontWeight: 'bold' } }
'.font-black': { font: { fontWeight: 'bold' } }
```

## Gradient Color Stops
### From Color
```css
'.from-transparent': { backgroundGradient: { colors: [ 'transparent', 'transparent' ] } }
'.from-black': { backgroundGradient: { colors: [ '#00000000', '#000000' ] } }
'.from-white': { backgroundGradient: { colors: [ '#00ffffff', '#ffffff' ] } }
'.from-rose-50': { backgroundGradient: { colors: [ '#00fff1f2', '#fff1f2' ] } }
'.from-rose-100': { backgroundGradient: { colors: [ '#00ffe4e6', '#ffe4e6' ] } }
'.from-rose-200': { backgroundGradient: { colors: [ '#00fecdd3', '#fecdd3' ] } }
'.from-rose-300': { backgroundGradient: { colors: [ '#00fda4af', '#fda4af' ] } }
'.from-rose-400': { backgroundGradient: { colors: [ '#00fb7185', '#fb7185' ] } }
'.from-rose-500': { backgroundGradient: { colors: [ '#00f43f5e', '#f43f5e' ] } }
'.from-rose-600': { backgroundGradient: { colors: [ '#00e11d48', '#e11d48' ] } }
'.from-rose-700': { backgroundGradient: { colors: [ '#00be123c', '#be123c' ] } }
'.from-rose-800': { backgroundGradient: { colors: [ '#009f1239', '#9f1239' ] } }
'.from-rose-900': { backgroundGradient: { colors: [ '#00881337', '#881337' ] } }
'.from-pink-50': { backgroundGradient: { colors: [ '#00fdf2f8', '#fdf2f8' ] } }
'.from-pink-100': { backgroundGradient: { colors: [ '#00fce7f3', '#fce7f3' ] } }
'.from-pink-200': { backgroundGradient: { colors: [ '#00fbcfe8', '#fbcfe8' ] } }
'.from-pink-300': { backgroundGradient: { colors: [ '#00f9a8d4', '#f9a8d4' ] } }
'.from-pink-400': { backgroundGradient: { colors: [ '#00f472b6', '#f472b6' ] } }
'.from-pink-500': { backgroundGradient: { colors: [ '#00ec4899', '#ec4899' ] } }
'.from-pink-600': { backgroundGradient: { colors: [ '#00db2777', '#db2777' ] } }
'.from-pink-700': { backgroundGradient: { colors: [ '#00be185d', '#be185d' ] } }
'.from-pink-800': { backgroundGradient: { colors: [ '#009d174d', '#9d174d' ] } }
'.from-pink-900': { backgroundGradient: { colors: [ '#00831843', '#831843' ] } }
'.from-fuchsia-50': { backgroundGradient: { colors: [ '#00fdf4ff', '#fdf4ff' ] } }
'.from-fuchsia-100': { backgroundGradient: { colors: [ '#00fae8ff', '#fae8ff' ] } }
'.from-fuchsia-200': { backgroundGradient: { colors: [ '#00f5d0fe', '#f5d0fe' ] } }
'.from-fuchsia-300': { backgroundGradient: { colors: [ '#00f0abfc', '#f0abfc' ] } }
'.from-fuchsia-400': { backgroundGradient: { colors: [ '#00e879f9', '#e879f9' ] } }
'.from-fuchsia-500': { backgroundGradient: { colors: [ '#00d946ef', '#d946ef' ] } }
'.from-fuchsia-600': { backgroundGradient: { colors: [ '#00c026d3', '#c026d3' ] } }
'.from-fuchsia-700': { backgroundGradient: { colors: [ '#00a21caf', '#a21caf' ] } }
'.from-fuchsia-800': { backgroundGradient: { colors: [ '#0086198f', '#86198f' ] } }
'.from-fuchsia-900': { backgroundGradient: { colors: [ '#00701a75', '#701a75' ] } }
'.from-purple-50': { backgroundGradient: { colors: [ '#00faf5ff', '#faf5ff' ] } }
'.from-purple-100': { backgroundGradient: { colors: [ '#00f3e8ff', '#f3e8ff' ] } }
'.from-purple-200': { backgroundGradient: { colors: [ '#00e9d5ff', '#e9d5ff' ] } }
'.from-purple-300': { backgroundGradient: { colors: [ '#00d8b4fe', '#d8b4fe' ] } }
'.from-purple-400': { backgroundGradient: { colors: [ '#00c084fc', '#c084fc' ] } }
'.from-purple-500': { backgroundGradient: { colors: [ '#00a855f7', '#a855f7' ] } }
'.from-purple-600': { backgroundGradient: { colors: [ '#009333ea', '#9333ea' ] } }
'.from-purple-700': { backgroundGradient: { colors: [ '#007e22ce', '#7e22ce' ] } }
'.from-purple-800': { backgroundGradient: { colors: [ '#006b21a8', '#6b21a8' ] } }
'.from-purple-900': { backgroundGradient: { colors: [ '#00581c87', '#581c87' ] } }
'.from-violet-50': { backgroundGradient: { colors: [ '#00f5f3ff', '#f5f3ff' ] } }
'.from-violet-100': { backgroundGradient: { colors: [ '#00ede9fe', '#ede9fe' ] } }
'.from-violet-200': { backgroundGradient: { colors: [ '#00ddd6fe', '#ddd6fe' ] } }
'.from-violet-300': { backgroundGradient: { colors: [ '#00c4b5fd', '#c4b5fd' ] } }
'.from-violet-400': { backgroundGradient: { colors: [ '#00a78bfa', '#a78bfa' ] } }
'.from-violet-500': { backgroundGradient: { colors: [ '#008b5cf6', '#8b5cf6' ] } }
'.from-violet-600': { backgroundGradient: { colors: [ '#007c3aed', '#7c3aed' ] } }
'.from-violet-700': { backgroundGradient: { colors: [ '#006d28d9', '#6d28d9' ] } }
'.from-violet-800': { backgroundGradient: { colors: [ '#005b21b6', '#5b21b6' ] } }
'.from-violet-900': { backgroundGradient: { colors: [ '#004c1d95', '#4c1d95' ] } }
'.from-indigo-50': { backgroundGradient: { colors: [ '#00eef2ff', '#eef2ff' ] } }
'.from-indigo-100': { backgroundGradient: { colors: [ '#00e0e7ff', '#e0e7ff' ] } }
'.from-indigo-200': { backgroundGradient: { colors: [ '#00c7d2fe', '#c7d2fe' ] } }
'.from-indigo-300': { backgroundGradient: { colors: [ '#00a5b4fc', '#a5b4fc' ] } }
'.from-indigo-400': { backgroundGradient: { colors: [ '#00818cf8', '#818cf8' ] } }
'.from-indigo-500': { backgroundGradient: { colors: [ '#006366f1', '#6366f1' ] } }
'.from-indigo-600': { backgroundGradient: { colors: [ '#004f46e5', '#4f46e5' ] } }
'.from-indigo-700': { backgroundGradient: { colors: [ '#004338ca', '#4338ca' ] } }
'.from-indigo-800': { backgroundGradient: { colors: [ '#003730a3', '#3730a3' ] } }
'.from-indigo-900': { backgroundGradient: { colors: [ '#00312e81', '#312e81' ] } }
'.from-blue-50': { backgroundGradient: { colors: [ '#00eff6ff', '#eff6ff' ] } }
'.from-blue-100': { backgroundGradient: { colors: [ '#00dbeafe', '#dbeafe' ] } }
'.from-blue-200': { backgroundGradient: { colors: [ '#00bfdbfe', '#bfdbfe' ] } }
'.from-blue-300': { backgroundGradient: { colors: [ '#0093c5fd', '#93c5fd' ] } }
'.from-blue-400': { backgroundGradient: { colors: [ '#0060a5fa', '#60a5fa' ] } }
'.from-blue-500': { backgroundGradient: { colors: [ '#003b82f6', '#3b82f6' ] } }
'.from-blue-600': { backgroundGradient: { colors: [ '#002563eb', '#2563eb' ] } }
'.from-blue-700': { backgroundGradient: { colors: [ '#001d4ed8', '#1d4ed8' ] } }
'.from-blue-800': { backgroundGradient: { colors: [ '#001e40af', '#1e40af' ] } }
'.from-blue-900': { backgroundGradient: { colors: [ '#001e3a8a', '#1e3a8a' ] } }
'.from-sky-50': { backgroundGradient: { colors: [ '#00f0f9ff', '#f0f9ff' ] } }
'.from-sky-100': { backgroundGradient: { colors: [ '#00e0f2fe', '#e0f2fe' ] } }
'.from-sky-200': { backgroundGradient: { colors: [ '#00bae6fd', '#bae6fd' ] } }
'.from-sky-300': { backgroundGradient: { colors: [ '#007dd3fc', '#7dd3fc' ] } }
'.from-sky-400': { backgroundGradient: { colors: [ '#0038bdf8', '#38bdf8' ] } }
'.from-sky-500': { backgroundGradient: { colors: [ '#000ea5e9', '#0ea5e9' ] } }
'.from-sky-600': { backgroundGradient: { colors: [ '#000284c7', '#0284c7' ] } }
'.from-sky-700': { backgroundGradient: { colors: [ '#000369a1', '#0369a1' ] } }
'.from-sky-800': { backgroundGradient: { colors: [ '#00075985', '#075985' ] } }
'.from-sky-900': { backgroundGradient: { colors: [ '#000c4a6e', '#0c4a6e' ] } }
'.from-cyan-50': { backgroundGradient: { colors: [ '#00ecfeff', '#ecfeff' ] } }
'.from-cyan-100': { backgroundGradient: { colors: [ '#00cffafe', '#cffafe' ] } }
'.from-cyan-200': { backgroundGradient: { colors: [ '#00a5f3fc', '#a5f3fc' ] } }
'.from-cyan-300': { backgroundGradient: { colors: [ '#0067e8f9', '#67e8f9' ] } }
'.from-cyan-400': { backgroundGradient: { colors: [ '#0022d3ee', '#22d3ee' ] } }
'.from-cyan-500': { backgroundGradient: { colors: [ '#0006b6d4', '#06b6d4' ] } }
'.from-cyan-600': { backgroundGradient: { colors: [ '#000891b2', '#0891b2' ] } }
'.from-cyan-700': { backgroundGradient: { colors: [ '#000e7490', '#0e7490' ] } }
'.from-cyan-800': { backgroundGradient: { colors: [ '#00155e75', '#155e75' ] } }
'.from-cyan-900': { backgroundGradient: { colors: [ '#00164e63', '#164e63' ] } }
'.from-teal-50': { backgroundGradient: { colors: [ '#00f0fdfa', '#f0fdfa' ] } }
'.from-teal-100': { backgroundGradient: { colors: [ '#00ccfbf1', '#ccfbf1' ] } }
'.from-teal-200': { backgroundGradient: { colors: [ '#0099f6e4', '#99f6e4' ] } }
'.from-teal-300': { backgroundGradient: { colors: [ '#005eead4', '#5eead4' ] } }
'.from-teal-400': { backgroundGradient: { colors: [ '#002dd4bf', '#2dd4bf' ] } }
'.from-teal-500': { backgroundGradient: { colors: [ '#0014b8a6', '#14b8a6' ] } }
'.from-teal-600': { backgroundGradient: { colors: [ '#000d9488', '#0d9488' ] } }
'.from-teal-700': { backgroundGradient: { colors: [ '#000f766e', '#0f766e' ] } }
'.from-teal-800': { backgroundGradient: { colors: [ '#00115e59', '#115e59' ] } }
'.from-teal-900': { backgroundGradient: { colors: [ '#00134e4a', '#134e4a' ] } }
'.from-emerald-50': { backgroundGradient: { colors: [ '#00ecfdf5', '#ecfdf5' ] } }
'.from-emerald-100': { backgroundGradient: { colors: [ '#00d1fae5', '#d1fae5' ] } }
'.from-emerald-200': { backgroundGradient: { colors: [ '#00a7f3d0', '#a7f3d0' ] } }
'.from-emerald-300': { backgroundGradient: { colors: [ '#006ee7b7', '#6ee7b7' ] } }
'.from-emerald-400': { backgroundGradient: { colors: [ '#0034d399', '#34d399' ] } }
'.from-emerald-500': { backgroundGradient: { colors: [ '#0010b981', '#10b981' ] } }
'.from-emerald-600': { backgroundGradient: { colors: [ '#00059669', '#059669' ] } }
'.from-emerald-700': { backgroundGradient: { colors: [ '#00047857', '#047857' ] } }
'.from-emerald-800': { backgroundGradient: { colors: [ '#00065f46', '#065f46' ] } }
'.from-emerald-900': { backgroundGradient: { colors: [ '#00064e3b', '#064e3b' ] } }
'.from-green-50': { backgroundGradient: { colors: [ '#00f0fdf4', '#f0fdf4' ] } }
'.from-green-100': { backgroundGradient: { colors: [ '#00dcfce7', '#dcfce7' ] } }
'.from-green-200': { backgroundGradient: { colors: [ '#00bbf7d0', '#bbf7d0' ] } }
'.from-green-300': { backgroundGradient: { colors: [ '#0086efac', '#86efac' ] } }
'.from-green-400': { backgroundGradient: { colors: [ '#004ade80', '#4ade80' ] } }
'.from-green-500': { backgroundGradient: { colors: [ '#0022c55e', '#22c55e' ] } }
'.from-green-600': { backgroundGradient: { colors: [ '#0016a34a', '#16a34a' ] } }
'.from-green-700': { backgroundGradient: { colors: [ '#0015803d', '#15803d' ] } }
'.from-green-800': { backgroundGradient: { colors: [ '#00166534', '#166534' ] } }
'.from-green-900': { backgroundGradient: { colors: [ '#0014532d', '#14532d' ] } }
'.from-lime-50': { backgroundGradient: { colors: [ '#00f7fee7', '#f7fee7' ] } }
'.from-lime-100': { backgroundGradient: { colors: [ '#00ecfccb', '#ecfccb' ] } }
'.from-lime-200': { backgroundGradient: { colors: [ '#00d9f99d', '#d9f99d' ] } }
'.from-lime-300': { backgroundGradient: { colors: [ '#00bef264', '#bef264' ] } }
'.from-lime-400': { backgroundGradient: { colors: [ '#00a3e635', '#a3e635' ] } }
'.from-lime-500': { backgroundGradient: { colors: [ '#0084cc16', '#84cc16' ] } }
'.from-lime-600': { backgroundGradient: { colors: [ '#0065a30d', '#65a30d' ] } }
'.from-lime-700': { backgroundGradient: { colors: [ '#004d7c0f', '#4d7c0f' ] } }
'.from-lime-800': { backgroundGradient: { colors: [ '#003f6212', '#3f6212' ] } }
'.from-lime-900': { backgroundGradient: { colors: [ '#00365314', '#365314' ] } }
'.from-yellow-50': { backgroundGradient: { colors: [ '#00fefce8', '#fefce8' ] } }
'.from-yellow-100': { backgroundGradient: { colors: [ '#00fef9c3', '#fef9c3' ] } }
'.from-yellow-200': { backgroundGradient: { colors: [ '#00fef08a', '#fef08a' ] } }
'.from-yellow-300': { backgroundGradient: { colors: [ '#00fde047', '#fde047' ] } }
'.from-yellow-400': { backgroundGradient: { colors: [ '#00facc15', '#facc15' ] } }
'.from-yellow-500': { backgroundGradient: { colors: [ '#00eab308', '#eab308' ] } }
'.from-yellow-600': { backgroundGradient: { colors: [ '#00ca8a04', '#ca8a04' ] } }
'.from-yellow-700': { backgroundGradient: { colors: [ '#00a16207', '#a16207' ] } }
'.from-yellow-800': { backgroundGradient: { colors: [ '#00854d0e', '#854d0e' ] } }
'.from-yellow-900': { backgroundGradient: { colors: [ '#00713f12', '#713f12' ] } }
'.from-amber-50': { backgroundGradient: { colors: [ '#00fffbeb', '#fffbeb' ] } }
'.from-amber-100': { backgroundGradient: { colors: [ '#00fef3c7', '#fef3c7' ] } }
'.from-amber-200': { backgroundGradient: { colors: [ '#00fde68a', '#fde68a' ] } }
'.from-amber-300': { backgroundGradient: { colors: [ '#00fcd34d', '#fcd34d' ] } }
'.from-amber-400': { backgroundGradient: { colors: [ '#00fbbf24', '#fbbf24' ] } }
'.from-amber-500': { backgroundGradient: { colors: [ '#00f59e0b', '#f59e0b' ] } }
'.from-amber-600': { backgroundGradient: { colors: [ '#00d97706', '#d97706' ] } }
'.from-amber-700': { backgroundGradient: { colors: [ '#00b45309', '#b45309' ] } }
'.from-amber-800': { backgroundGradient: { colors: [ '#0092400e', '#92400e' ] } }
'.from-amber-900': { backgroundGradient: { colors: [ '#0078350f', '#78350f' ] } }
'.from-orange-50': { backgroundGradient: { colors: [ '#00fff7ed', '#fff7ed' ] } }
'.from-orange-100': { backgroundGradient: { colors: [ '#00ffedd5', '#ffedd5' ] } }
'.from-orange-200': { backgroundGradient: { colors: [ '#00fed7aa', '#fed7aa' ] } }
'.from-orange-300': { backgroundGradient: { colors: [ '#00fdba74', '#fdba74' ] } }
'.from-orange-400': { backgroundGradient: { colors: [ '#00fb923c', '#fb923c' ] } }
'.from-orange-500': { backgroundGradient: { colors: [ '#00f97316', '#f97316' ] } }
'.from-orange-600': { backgroundGradient: { colors: [ '#00ea580c', '#ea580c' ] } }
'.from-orange-700': { backgroundGradient: { colors: [ '#00c2410c', '#c2410c' ] } }
'.from-orange-800': { backgroundGradient: { colors: [ '#009a3412', '#9a3412' ] } }
'.from-orange-900': { backgroundGradient: { colors: [ '#007c2d12', '#7c2d12' ] } }
'.from-red-50': { backgroundGradient: { colors: [ '#00fef2f2', '#fef2f2' ] } }
'.from-red-100': { backgroundGradient: { colors: [ '#00fee2e2', '#fee2e2' ] } }
'.from-red-200': { backgroundGradient: { colors: [ '#00fecaca', '#fecaca' ] } }
'.from-red-300': { backgroundGradient: { colors: [ '#00fca5a5', '#fca5a5' ] } }
'.from-red-400': { backgroundGradient: { colors: [ '#00f87171', '#f87171' ] } }
'.from-red-500': { backgroundGradient: { colors: [ '#00ef4444', '#ef4444' ] } }
'.from-red-600': { backgroundGradient: { colors: [ '#00dc2626', '#dc2626' ] } }
'.from-red-700': { backgroundGradient: { colors: [ '#00b91c1c', '#b91c1c' ] } }
'.from-red-800': { backgroundGradient: { colors: [ '#00991b1b', '#991b1b' ] } }
'.from-red-900': { backgroundGradient: { colors: [ '#007f1d1d', '#7f1d1d' ] } }
'.from-warmGray-50': { backgroundGradient: { colors: [ '#00fafaf9', '#fafaf9' ] } }
'.from-warmGray-100': { backgroundGradient: { colors: [ '#00f5f5f4', '#f5f5f4' ] } }
'.from-warmGray-200': { backgroundGradient: { colors: [ '#00e7e5e4', '#e7e5e4' ] } }
'.from-warmGray-300': { backgroundGradient: { colors: [ '#00d6d3d1', '#d6d3d1' ] } }
'.from-warmGray-400': { backgroundGradient: { colors: [ '#00a8a29e', '#a8a29e' ] } }
'.from-warmGray-500': { backgroundGradient: { colors: [ '#0078716c', '#78716c' ] } }
'.from-warmGray-600': { backgroundGradient: { colors: [ '#0057534e', '#57534e' ] } }
'.from-warmGray-700': { backgroundGradient: { colors: [ '#0044403c', '#44403c' ] } }
'.from-warmGray-800': { backgroundGradient: { colors: [ '#00292524', '#292524' ] } }
'.from-warmGray-900': { backgroundGradient: { colors: [ '#001c1917', '#1c1917' ] } }
'.from-trueGray-50': { backgroundGradient: { colors: [ '#00fafafa', '#fafafa' ] } }
'.from-trueGray-100': { backgroundGradient: { colors: [ '#00f5f5f5', '#f5f5f5' ] } }
'.from-trueGray-200': { backgroundGradient: { colors: [ '#00e5e5e5', '#e5e5e5' ] } }
'.from-trueGray-300': { backgroundGradient: { colors: [ '#00d4d4d4', '#d4d4d4' ] } }
'.from-trueGray-400': { backgroundGradient: { colors: [ '#00a3a3a3', '#a3a3a3' ] } }
'.from-trueGray-500': { backgroundGradient: { colors: [ '#00737373', '#737373' ] } }
'.from-trueGray-600': { backgroundGradient: { colors: [ '#00525252', '#525252' ] } }
'.from-trueGray-700': { backgroundGradient: { colors: [ '#00404040', '#404040' ] } }
'.from-trueGray-800': { backgroundGradient: { colors: [ '#00262626', '#262626' ] } }
'.from-trueGray-900': { backgroundGradient: { colors: [ '#00171717', '#171717' ] } }
'.from-gray-50': { backgroundGradient: { colors: [ '#00fafafa', '#fafafa' ] } }
'.from-gray-100': { backgroundGradient: { colors: [ '#00f4f4f5', '#f4f4f5' ] } }
'.from-gray-200': { backgroundGradient: { colors: [ '#00e4e4e7', '#e4e4e7' ] } }
'.from-gray-300': { backgroundGradient: { colors: [ '#00d4d4d8', '#d4d4d8' ] } }
'.from-gray-400': { backgroundGradient: { colors: [ '#00a1a1aa', '#a1a1aa' ] } }
'.from-gray-500': { backgroundGradient: { colors: [ '#0071717a', '#71717a' ] } }
'.from-gray-600': { backgroundGradient: { colors: [ '#0052525b', '#52525b' ] } }
'.from-gray-700': { backgroundGradient: { colors: [ '#003f3f46', '#3f3f46' ] } }
'.from-gray-800': { backgroundGradient: { colors: [ '#0027272a', '#27272a' ] } }
'.from-gray-900': { backgroundGradient: { colors: [ '#0018181b', '#18181b' ] } }
'.from-coolGray-50': { backgroundGradient: { colors: [ '#00f9fafb', '#f9fafb' ] } }
'.from-coolGray-100': { backgroundGradient: { colors: [ '#00f3f4f6', '#f3f4f6' ] } }
'.from-coolGray-200': { backgroundGradient: { colors: [ '#00e5e7eb', '#e5e7eb' ] } }
'.from-coolGray-300': { backgroundGradient: { colors: [ '#00d1d5db', '#d1d5db' ] } }
'.from-coolGray-400': { backgroundGradient: { colors: [ '#009ca3af', '#9ca3af' ] } }
'.from-coolGray-500': { backgroundGradient: { colors: [ '#006b7280', '#6b7280' ] } }
'.from-coolGray-600': { backgroundGradient: { colors: [ '#004b5563', '#4b5563' ] } }
'.from-coolGray-700': { backgroundGradient: { colors: [ '#00374151', '#374151' ] } }
'.from-coolGray-800': { backgroundGradient: { colors: [ '#001f2937', '#1f2937' ] } }
'.from-coolGray-900': { backgroundGradient: { colors: [ '#00111827', '#111827' ] } }
'.from-blueGray-50': { backgroundGradient: { colors: [ '#00f8fafc', '#f8fafc' ] } }
'.from-blueGray-100': { backgroundGradient: { colors: [ '#00f1f5f9', '#f1f5f9' ] } }
'.from-blueGray-200': { backgroundGradient: { colors: [ '#00e2e8f0', '#e2e8f0' ] } }
'.from-blueGray-300': { backgroundGradient: { colors: [ '#00cbd5e1', '#cbd5e1' ] } }
'.from-blueGray-400': { backgroundGradient: { colors: [ '#0094a3b8', '#94a3b8' ] } }
'.from-blueGray-500': { backgroundGradient: { colors: [ '#0064748b', '#64748b' ] } }
'.from-blueGray-600': { backgroundGradient: { colors: [ '#00475569', '#475569' ] } }
'.from-blueGray-700': { backgroundGradient: { colors: [ '#00334155', '#334155' ] } }
'.from-blueGray-800': { backgroundGradient: { colors: [ '#001e293b', '#1e293b' ] } }
'.from-blueGray-900': { backgroundGradient: { colors: [ '#000f172a', '#0f172a' ] } }
```

### To Color
```css
'.to-transparent': { backgroundGradient: { colors: [ 'transparent' ] } }
'.to-black': { backgroundGradient: { colors: [ '#000000' ] } }
'.to-white': { backgroundGradient: { colors: [ '#ffffff' ] } }
'.to-rose-50': { backgroundGradient: { colors: [ '#fff1f2' ] } }
'.to-rose-100': { backgroundGradient: { colors: [ '#ffe4e6' ] } }
'.to-rose-200': { backgroundGradient: { colors: [ '#fecdd3' ] } }
'.to-rose-300': { backgroundGradient: { colors: [ '#fda4af' ] } }
'.to-rose-400': { backgroundGradient: { colors: [ '#fb7185' ] } }
'.to-rose-500': { backgroundGradient: { colors: [ '#f43f5e' ] } }
'.to-rose-600': { backgroundGradient: { colors: [ '#e11d48' ] } }
'.to-rose-700': { backgroundGradient: { colors: [ '#be123c' ] } }
'.to-rose-800': { backgroundGradient: { colors: [ '#9f1239' ] } }
'.to-rose-900': { backgroundGradient: { colors: [ '#881337' ] } }
'.to-pink-50': { backgroundGradient: { colors: [ '#fdf2f8' ] } }
'.to-pink-100': { backgroundGradient: { colors: [ '#fce7f3' ] } }
'.to-pink-200': { backgroundGradient: { colors: [ '#fbcfe8' ] } }
'.to-pink-300': { backgroundGradient: { colors: [ '#f9a8d4' ] } }
'.to-pink-400': { backgroundGradient: { colors: [ '#f472b6' ] } }
'.to-pink-500': { backgroundGradient: { colors: [ '#ec4899' ] } }
'.to-pink-600': { backgroundGradient: { colors: [ '#db2777' ] } }
'.to-pink-700': { backgroundGradient: { colors: [ '#be185d' ] } }
'.to-pink-800': { backgroundGradient: { colors: [ '#9d174d' ] } }
'.to-pink-900': { backgroundGradient: { colors: [ '#831843' ] } }
'.to-fuchsia-50': { backgroundGradient: { colors: [ '#fdf4ff' ] } }
'.to-fuchsia-100': { backgroundGradient: { colors: [ '#fae8ff' ] } }
'.to-fuchsia-200': { backgroundGradient: { colors: [ '#f5d0fe' ] } }
'.to-fuchsia-300': { backgroundGradient: { colors: [ '#f0abfc' ] } }
'.to-fuchsia-400': { backgroundGradient: { colors: [ '#e879f9' ] } }
'.to-fuchsia-500': { backgroundGradient: { colors: [ '#d946ef' ] } }
'.to-fuchsia-600': { backgroundGradient: { colors: [ '#c026d3' ] } }
'.to-fuchsia-700': { backgroundGradient: { colors: [ '#a21caf' ] } }
'.to-fuchsia-800': { backgroundGradient: { colors: [ '#86198f' ] } }
'.to-fuchsia-900': { backgroundGradient: { colors: [ '#701a75' ] } }
'.to-purple-50': { backgroundGradient: { colors: [ '#faf5ff' ] } }
'.to-purple-100': { backgroundGradient: { colors: [ '#f3e8ff' ] } }
'.to-purple-200': { backgroundGradient: { colors: [ '#e9d5ff' ] } }
'.to-purple-300': { backgroundGradient: { colors: [ '#d8b4fe' ] } }
'.to-purple-400': { backgroundGradient: { colors: [ '#c084fc' ] } }
'.to-purple-500': { backgroundGradient: { colors: [ '#a855f7' ] } }
'.to-purple-600': { backgroundGradient: { colors: [ '#9333ea' ] } }
'.to-purple-700': { backgroundGradient: { colors: [ '#7e22ce' ] } }
'.to-purple-800': { backgroundGradient: { colors: [ '#6b21a8' ] } }
'.to-purple-900': { backgroundGradient: { colors: [ '#581c87' ] } }
'.to-violet-50': { backgroundGradient: { colors: [ '#f5f3ff' ] } }
'.to-violet-100': { backgroundGradient: { colors: [ '#ede9fe' ] } }
'.to-violet-200': { backgroundGradient: { colors: [ '#ddd6fe' ] } }
'.to-violet-300': { backgroundGradient: { colors: [ '#c4b5fd' ] } }
'.to-violet-400': { backgroundGradient: { colors: [ '#a78bfa' ] } }
'.to-violet-500': { backgroundGradient: { colors: [ '#8b5cf6' ] } }
'.to-violet-600': { backgroundGradient: { colors: [ '#7c3aed' ] } }
'.to-violet-700': { backgroundGradient: { colors: [ '#6d28d9' ] } }
'.to-violet-800': { backgroundGradient: { colors: [ '#5b21b6' ] } }
'.to-violet-900': { backgroundGradient: { colors: [ '#4c1d95' ] } }
'.to-indigo-50': { backgroundGradient: { colors: [ '#eef2ff' ] } }
'.to-indigo-100': { backgroundGradient: { colors: [ '#e0e7ff' ] } }
'.to-indigo-200': { backgroundGradient: { colors: [ '#c7d2fe' ] } }
'.to-indigo-300': { backgroundGradient: { colors: [ '#a5b4fc' ] } }
'.to-indigo-400': { backgroundGradient: { colors: [ '#818cf8' ] } }
'.to-indigo-500': { backgroundGradient: { colors: [ '#6366f1' ] } }
'.to-indigo-600': { backgroundGradient: { colors: [ '#4f46e5' ] } }
'.to-indigo-700': { backgroundGradient: { colors: [ '#4338ca' ] } }
'.to-indigo-800': { backgroundGradient: { colors: [ '#3730a3' ] } }
'.to-indigo-900': { backgroundGradient: { colors: [ '#312e81' ] } }
'.to-blue-50': { backgroundGradient: { colors: [ '#eff6ff' ] } }
'.to-blue-100': { backgroundGradient: { colors: [ '#dbeafe' ] } }
'.to-blue-200': { backgroundGradient: { colors: [ '#bfdbfe' ] } }
'.to-blue-300': { backgroundGradient: { colors: [ '#93c5fd' ] } }
'.to-blue-400': { backgroundGradient: { colors: [ '#60a5fa' ] } }
'.to-blue-500': { backgroundGradient: { colors: [ '#3b82f6' ] } }
'.to-blue-600': { backgroundGradient: { colors: [ '#2563eb' ] } }
'.to-blue-700': { backgroundGradient: { colors: [ '#1d4ed8' ] } }
'.to-blue-800': { backgroundGradient: { colors: [ '#1e40af' ] } }
'.to-blue-900': { backgroundGradient: { colors: [ '#1e3a8a' ] } }
'.to-sky-50': { backgroundGradient: { colors: [ '#f0f9ff' ] } }
'.to-sky-100': { backgroundGradient: { colors: [ '#e0f2fe' ] } }
'.to-sky-200': { backgroundGradient: { colors: [ '#bae6fd' ] } }
'.to-sky-300': { backgroundGradient: { colors: [ '#7dd3fc' ] } }
'.to-sky-400': { backgroundGradient: { colors: [ '#38bdf8' ] } }
'.to-sky-500': { backgroundGradient: { colors: [ '#0ea5e9' ] } }
'.to-sky-600': { backgroundGradient: { colors: [ '#0284c7' ] } }
'.to-sky-700': { backgroundGradient: { colors: [ '#0369a1' ] } }
'.to-sky-800': { backgroundGradient: { colors: [ '#075985' ] } }
'.to-sky-900': { backgroundGradient: { colors: [ '#0c4a6e' ] } }
'.to-cyan-50': { backgroundGradient: { colors: [ '#ecfeff' ] } }
'.to-cyan-100': { backgroundGradient: { colors: [ '#cffafe' ] } }
'.to-cyan-200': { backgroundGradient: { colors: [ '#a5f3fc' ] } }
'.to-cyan-300': { backgroundGradient: { colors: [ '#67e8f9' ] } }
'.to-cyan-400': { backgroundGradient: { colors: [ '#22d3ee' ] } }
'.to-cyan-500': { backgroundGradient: { colors: [ '#06b6d4' ] } }
'.to-cyan-600': { backgroundGradient: { colors: [ '#0891b2' ] } }
'.to-cyan-700': { backgroundGradient: { colors: [ '#0e7490' ] } }
'.to-cyan-800': { backgroundGradient: { colors: [ '#155e75' ] } }
'.to-cyan-900': { backgroundGradient: { colors: [ '#164e63' ] } }
'.to-teal-50': { backgroundGradient: { colors: [ '#f0fdfa' ] } }
'.to-teal-100': { backgroundGradient: { colors: [ '#ccfbf1' ] } }
'.to-teal-200': { backgroundGradient: { colors: [ '#99f6e4' ] } }
'.to-teal-300': { backgroundGradient: { colors: [ '#5eead4' ] } }
'.to-teal-400': { backgroundGradient: { colors: [ '#2dd4bf' ] } }
'.to-teal-500': { backgroundGradient: { colors: [ '#14b8a6' ] } }
'.to-teal-600': { backgroundGradient: { colors: [ '#0d9488' ] } }
'.to-teal-700': { backgroundGradient: { colors: [ '#0f766e' ] } }
'.to-teal-800': { backgroundGradient: { colors: [ '#115e59' ] } }
'.to-teal-900': { backgroundGradient: { colors: [ '#134e4a' ] } }
'.to-emerald-50': { backgroundGradient: { colors: [ '#ecfdf5' ] } }
'.to-emerald-100': { backgroundGradient: { colors: [ '#d1fae5' ] } }
'.to-emerald-200': { backgroundGradient: { colors: [ '#a7f3d0' ] } }
'.to-emerald-300': { backgroundGradient: { colors: [ '#6ee7b7' ] } }
'.to-emerald-400': { backgroundGradient: { colors: [ '#34d399' ] } }
'.to-emerald-500': { backgroundGradient: { colors: [ '#10b981' ] } }
'.to-emerald-600': { backgroundGradient: { colors: [ '#059669' ] } }
'.to-emerald-700': { backgroundGradient: { colors: [ '#047857' ] } }
'.to-emerald-800': { backgroundGradient: { colors: [ '#065f46' ] } }
'.to-emerald-900': { backgroundGradient: { colors: [ '#064e3b' ] } }
'.to-green-50': { backgroundGradient: { colors: [ '#f0fdf4' ] } }
'.to-green-100': { backgroundGradient: { colors: [ '#dcfce7' ] } }
'.to-green-200': { backgroundGradient: { colors: [ '#bbf7d0' ] } }
'.to-green-300': { backgroundGradient: { colors: [ '#86efac' ] } }
'.to-green-400': { backgroundGradient: { colors: [ '#4ade80' ] } }
'.to-green-500': { backgroundGradient: { colors: [ '#22c55e' ] } }
'.to-green-600': { backgroundGradient: { colors: [ '#16a34a' ] } }
'.to-green-700': { backgroundGradient: { colors: [ '#15803d' ] } }
'.to-green-800': { backgroundGradient: { colors: [ '#166534' ] } }
'.to-green-900': { backgroundGradient: { colors: [ '#14532d' ] } }
'.to-lime-50': { backgroundGradient: { colors: [ '#f7fee7' ] } }
'.to-lime-100': { backgroundGradient: { colors: [ '#ecfccb' ] } }
'.to-lime-200': { backgroundGradient: { colors: [ '#d9f99d' ] } }
'.to-lime-300': { backgroundGradient: { colors: [ '#bef264' ] } }
'.to-lime-400': { backgroundGradient: { colors: [ '#a3e635' ] } }
'.to-lime-500': { backgroundGradient: { colors: [ '#84cc16' ] } }
'.to-lime-600': { backgroundGradient: { colors: [ '#65a30d' ] } }
'.to-lime-700': { backgroundGradient: { colors: [ '#4d7c0f' ] } }
'.to-lime-800': { backgroundGradient: { colors: [ '#3f6212' ] } }
'.to-lime-900': { backgroundGradient: { colors: [ '#365314' ] } }
'.to-yellow-50': { backgroundGradient: { colors: [ '#fefce8' ] } }
'.to-yellow-100': { backgroundGradient: { colors: [ '#fef9c3' ] } }
'.to-yellow-200': { backgroundGradient: { colors: [ '#fef08a' ] } }
'.to-yellow-300': { backgroundGradient: { colors: [ '#fde047' ] } }
'.to-yellow-400': { backgroundGradient: { colors: [ '#facc15' ] } }
'.to-yellow-500': { backgroundGradient: { colors: [ '#eab308' ] } }
'.to-yellow-600': { backgroundGradient: { colors: [ '#ca8a04' ] } }
'.to-yellow-700': { backgroundGradient: { colors: [ '#a16207' ] } }
'.to-yellow-800': { backgroundGradient: { colors: [ '#854d0e' ] } }
'.to-yellow-900': { backgroundGradient: { colors: [ '#713f12' ] } }
'.to-amber-50': { backgroundGradient: { colors: [ '#fffbeb' ] } }
'.to-amber-100': { backgroundGradient: { colors: [ '#fef3c7' ] } }
'.to-amber-200': { backgroundGradient: { colors: [ '#fde68a' ] } }
'.to-amber-300': { backgroundGradient: { colors: [ '#fcd34d' ] } }
'.to-amber-400': { backgroundGradient: { colors: [ '#fbbf24' ] } }
'.to-amber-500': { backgroundGradient: { colors: [ '#f59e0b' ] } }
'.to-amber-600': { backgroundGradient: { colors: [ '#d97706' ] } }
'.to-amber-700': { backgroundGradient: { colors: [ '#b45309' ] } }
'.to-amber-800': { backgroundGradient: { colors: [ '#92400e' ] } }
'.to-amber-900': { backgroundGradient: { colors: [ '#78350f' ] } }
'.to-orange-50': { backgroundGradient: { colors: [ '#fff7ed' ] } }
'.to-orange-100': { backgroundGradient: { colors: [ '#ffedd5' ] } }
'.to-orange-200': { backgroundGradient: { colors: [ '#fed7aa' ] } }
'.to-orange-300': { backgroundGradient: { colors: [ '#fdba74' ] } }
'.to-orange-400': { backgroundGradient: { colors: [ '#fb923c' ] } }
'.to-orange-500': { backgroundGradient: { colors: [ '#f97316' ] } }
'.to-orange-600': { backgroundGradient: { colors: [ '#ea580c' ] } }
'.to-orange-700': { backgroundGradient: { colors: [ '#c2410c' ] } }
'.to-orange-800': { backgroundGradient: { colors: [ '#9a3412' ] } }
'.to-orange-900': { backgroundGradient: { colors: [ '#7c2d12' ] } }
'.to-red-50': { backgroundGradient: { colors: [ '#fef2f2' ] } }
'.to-red-100': { backgroundGradient: { colors: [ '#fee2e2' ] } }
'.to-red-200': { backgroundGradient: { colors: [ '#fecaca' ] } }
'.to-red-300': { backgroundGradient: { colors: [ '#fca5a5' ] } }
'.to-red-400': { backgroundGradient: { colors: [ '#f87171' ] } }
'.to-red-500': { backgroundGradient: { colors: [ '#ef4444' ] } }
'.to-red-600': { backgroundGradient: { colors: [ '#dc2626' ] } }
'.to-red-700': { backgroundGradient: { colors: [ '#b91c1c' ] } }
'.to-red-800': { backgroundGradient: { colors: [ '#991b1b' ] } }
'.to-red-900': { backgroundGradient: { colors: [ '#7f1d1d' ] } }
'.to-warmGray-50': { backgroundGradient: { colors: [ '#fafaf9' ] } }
'.to-warmGray-100': { backgroundGradient: { colors: [ '#f5f5f4' ] } }
'.to-warmGray-200': { backgroundGradient: { colors: [ '#e7e5e4' ] } }
'.to-warmGray-300': { backgroundGradient: { colors: [ '#d6d3d1' ] } }
'.to-warmGray-400': { backgroundGradient: { colors: [ '#a8a29e' ] } }
'.to-warmGray-500': { backgroundGradient: { colors: [ '#78716c' ] } }
'.to-warmGray-600': { backgroundGradient: { colors: [ '#57534e' ] } }
'.to-warmGray-700': { backgroundGradient: { colors: [ '#44403c' ] } }
'.to-warmGray-800': { backgroundGradient: { colors: [ '#292524' ] } }
'.to-warmGray-900': { backgroundGradient: { colors: [ '#1c1917' ] } }
'.to-trueGray-50': { backgroundGradient: { colors: [ '#fafafa' ] } }
'.to-trueGray-100': { backgroundGradient: { colors: [ '#f5f5f5' ] } }
'.to-trueGray-200': { backgroundGradient: { colors: [ '#e5e5e5' ] } }
'.to-trueGray-300': { backgroundGradient: { colors: [ '#d4d4d4' ] } }
'.to-trueGray-400': { backgroundGradient: { colors: [ '#a3a3a3' ] } }
'.to-trueGray-500': { backgroundGradient: { colors: [ '#737373' ] } }
'.to-trueGray-600': { backgroundGradient: { colors: [ '#525252' ] } }
'.to-trueGray-700': { backgroundGradient: { colors: [ '#404040' ] } }
'.to-trueGray-800': { backgroundGradient: { colors: [ '#262626' ] } }
'.to-trueGray-900': { backgroundGradient: { colors: [ '#171717' ] } }
'.to-gray-50': { backgroundGradient: { colors: [ '#fafafa' ] } }
'.to-gray-100': { backgroundGradient: { colors: [ '#f4f4f5' ] } }
'.to-gray-200': { backgroundGradient: { colors: [ '#e4e4e7' ] } }
'.to-gray-300': { backgroundGradient: { colors: [ '#d4d4d8' ] } }
'.to-gray-400': { backgroundGradient: { colors: [ '#a1a1aa' ] } }
'.to-gray-500': { backgroundGradient: { colors: [ '#71717a' ] } }
'.to-gray-600': { backgroundGradient: { colors: [ '#52525b' ] } }
'.to-gray-700': { backgroundGradient: { colors: [ '#3f3f46' ] } }
'.to-gray-800': { backgroundGradient: { colors: [ '#27272a' ] } }
'.to-gray-900': { backgroundGradient: { colors: [ '#18181b' ] } }
'.to-coolGray-50': { backgroundGradient: { colors: [ '#f9fafb' ] } }
'.to-coolGray-100': { backgroundGradient: { colors: [ '#f3f4f6' ] } }
'.to-coolGray-200': { backgroundGradient: { colors: [ '#e5e7eb' ] } }
'.to-coolGray-300': { backgroundGradient: { colors: [ '#d1d5db' ] } }
'.to-coolGray-400': { backgroundGradient: { colors: [ '#9ca3af' ] } }
'.to-coolGray-500': { backgroundGradient: { colors: [ '#6b7280' ] } }
'.to-coolGray-600': { backgroundGradient: { colors: [ '#4b5563' ] } }
'.to-coolGray-700': { backgroundGradient: { colors: [ '#374151' ] } }
'.to-coolGray-800': { backgroundGradient: { colors: [ '#1f2937' ] } }
'.to-coolGray-900': { backgroundGradient: { colors: [ '#111827' ] } }
'.to-blueGray-50': { backgroundGradient: { colors: [ '#f8fafc' ] } }
'.to-blueGray-100': { backgroundGradient: { colors: [ '#f1f5f9' ] } }
'.to-blueGray-200': { backgroundGradient: { colors: [ '#e2e8f0' ] } }
'.to-blueGray-300': { backgroundGradient: { colors: [ '#cbd5e1' ] } }
'.to-blueGray-400': { backgroundGradient: { colors: [ '#94a3b8' ] } }
'.to-blueGray-500': { backgroundGradient: { colors: [ '#64748b' ] } }
'.to-blueGray-600': { backgroundGradient: { colors: [ '#475569' ] } }
'.to-blueGray-700': { backgroundGradient: { colors: [ '#334155' ] } }
'.to-blueGray-800': { backgroundGradient: { colors: [ '#1e293b' ] } }
'.to-blueGray-900': { backgroundGradient: { colors: [ '#0f172a' ] } }
```

### Linear backgroundGradient Property
```css
'.bg-linear': { backgroundGradient: { type: 'linear', startPoint: { x: '50%', y: '100%' }, endPoint: { x: '50%', y: '0%' }, backfillStart: true } }
'.bg-linear-to-t': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backfillStart: true } }
'.bg-linear-to-tr': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '100%' }, backfillStart: true } }
'.bg-linear-to-r': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, backfillStart: true } }
'.bg-linear-to-br': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '0%', y: '0%' }, backfillStart: true } }
'.bg-linear-to-b': { backgroundGradient: { type: 'linear', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }
'.bg-linear-to-bl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }
'.bg-linear-to-l': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '0%' }, backfillStart: true } }
'.bg-linear-to-tl': { backgroundGradient: { type: 'linear', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '100%', y: '100%' }, backfillStart: true } }
```

### Radial backgroundGradient Property [iOS]
```css
'.bg-radial[platform=ios]': { backgroundGradient: { type: 'radial', startRadius: '125%', endRadius: '0%', backfillStart: true, backfillEnd: true } }
'.bg-radial-to-b[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '50%', y: '0%' }, endPoint: { x: '50%', y: '0%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }
'.bg-radial-to-bl[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '100%', y: '0%' }, endPoint: { x: '100%', y: '0%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }
'.bg-radial-to-l[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '100%', y: '50%' }, endPoint: { x: '100%', y: '50%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }
'.bg-radial-to-tl[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '100%', y: '100%' }, endPoint: { x: '100%', y: '100%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }
'.bg-radial-to-t[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '50%', y: '100%' }, endPoint: { x: '50%', y: '100%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }
'.bg-radial-to-tr[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '0%', y: '100%' }, endPoint: { x: '0%', y: '100%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }
'.bg-radial-to-r[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '0%', y: '50%' }, endPoint: { x: '0%', y: '50%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }
'.bg-radial-to-br[platform=ios]': { backgroundGradient: { type: 'radial', startPoint: { x: '0%', y: '0%' }, endPoint: { x: '0%', y: '0%' }, startRadius: '150%', endRadius: '0%', backfillStart: true, backfillEnd: true } }
```

## Grid System
### Grid Column Start / End Property
```css
'.col-span-1': { width: '8.333334%' }
'.col-span-2': { width: '16.666667%' }
'.col-span-3': { width: '25%' }
'.col-span-4': { width: '33.333334%' }
'.col-span-5': { width: '41.666667%' }
'.col-span-6': { width: '50%' }
'.col-span-7': { width: '58.333334%' }
'.col-span-8': { width: '66.666667%' }
'.col-span-9': { width: '75%' }
'.col-span-10': { width: '83.333334%' }
'.col-span-11': { width: '91.666667%' }
'.col-span-12': { width: '100%' }
```

### Grid Row Start / End Property
```css
'.row-span-1': { height: '8.333334%' }
'.row-span-2': { height: '16.666667%' }
'.row-span-3': { height: '25%' }
'.row-span-4': { height: '33.333334%' }
'.row-span-5': { height: '41.666667%' }
'.row-span-6': { height: '50%' }
'.row-span-7': { height: '58.333334%' }
'.row-span-8': { height: '66.666667%' }
'.row-span-9': { height: '75%' }
'.row-span-10': { height: '83.333334%' }
'.row-span-11': { height: '91.666667%' }
'.row-span-12': { height: '100%' }
```

### grid and gridFlow Property
```css
'.grid': { layout: 'horizontal' }
'.grid-flow-col': { layout: 'horizontal' }
'.grid-flow-row': { layout: 'vertical' }
```

### Grid Template Columns Property
```css
'.grid-cols-1': { width: '100%' }
'.grid-cols-2': { width: '50%' }
'.grid-cols-3': { width: '33.333334%' }
'.grid-cols-4': { width: '25%' }
'.grid-cols-5': { width: '20%' }
'.grid-cols-6': { width: '16.666667%' }
'.grid-cols-7': { width: '14.285714%' }
'.grid-cols-8': { width: '12.5%' }
'.grid-cols-9': { width: '11.111111%' }
'.grid-cols-10': { width: '10%' }
'.grid-cols-11': { width: '9.090909%' }
'.grid-cols-12': { width: '8.333334%' }
```

### Grid Template Rows Property
```css
'.grid-rows-1': { height: '100%' }
'.grid-rows-2': { height: '50%' }
'.grid-rows-3': { height: '33.333334%' }
'.grid-rows-4': { height: '25%' }
'.grid-rows-5': { height: '20%' }
'.grid-rows-6': { height: '16.666667%' }
'.grid-rows-7': { height: '14.285714%' }
'.grid-rows-8': { height: '12.5%' }
'.grid-rows-9': { height: '11.111111%' }
'.grid-rows-10': { height: '10%' }
'.grid-rows-11': { height: '9.090909%' }
'.grid-rows-12': { height: '8.333334%' }
```

### Gap Between elements
```css
'.gap-0': { top: 0, right: 0, bottom: 0, left: 0 }
'.gap-1': { top: 4, right: 4, bottom: 4, left: 4 }
'.gap-2': { top: 8, right: 8, bottom: 8, left: 8 }
'.gap-3': { top: 12, right: 12, bottom: 12, left: 12 }
'.gap-4': { top: 16, right: 16, bottom: 16, left: 16 }
'.gap-5': { top: 20, right: 20, bottom: 20, left: 20 }
'.gap-6': { top: 24, right: 24, bottom: 24, left: 24 }
'.gap-7': { top: 28, right: 28, bottom: 28, left: 28 }
'.gap-8': { top: 32, right: 32, bottom: 32, left: 32 }
'.gap-9': { top: 36, right: 36, bottom: 36, left: 36 }
'.gap-10': { top: 40, right: 40, bottom: 40, left: 40 }
'.gap-11': { top: 44, right: 44, bottom: 44, left: 44 }
'.gap-12': { top: 48, right: 48, bottom: 48, left: 48 }
'.gap-13': { top: 52, right: 52, bottom: 52, left: 52 }
'.gap-14': { top: 56, right: 56, bottom: 56, left: 56 }
'.gap-15': { top: 60, right: 60, bottom: 60, left: 60 }
'.gap-16': { top: 64, right: 64, bottom: 64, left: 64 }
'.gap-20': { top: 80, right: 80, bottom: 80, left: 80 }
'.gap-24': { top: 96, right: 96, bottom: 96, left: 96 }
'.gap-28': { top: 112, right: 112, bottom: 112, left: 112 }
'.gap-32': { top: 128, right: 128, bottom: 128, left: 128 }
'.gap-36': { top: 144, right: 144, bottom: 144, left: 144 }
'.gap-40': { top: 160, right: 160, bottom: 160, left: 160 }
'.gap-44': { top: 176, right: 176, bottom: 176, left: 176 }
'.gap-48': { top: 192, right: 192, bottom: 192, left: 192 }
'.gap-52': { top: 208, right: 208, bottom: 208, left: 208 }
'.gap-56': { top: 224, right: 224, bottom: 224, left: 224 }
'.gap-60': { top: 240, right: 240, bottom: 240, left: 240 }
'.gap-64': { top: 256, right: 256, bottom: 256, left: 256 }
'.gap-72': { top: 288, right: 288, bottom: 288, left: 288 }
'.gap-80': { top: 320, right: 320, bottom: 320, left: 320 }
'.gap-96': { top: 384, right: 384, bottom: 384, left: 384 }
'.gap-px': { top: '1px', right: '1px', bottom: '1px', left: '1px' }
'.gap-0.5': { top: 2, right: 2, bottom: 2, left: 2 }
'.gap-1.5': { top: 6, right: 6, bottom: 6, left: 6 }
'.gap-2.5': { top: 10, right: 10, bottom: 10, left: 10 }
'.gap-3.5': { top: 14, right: 14, bottom: 14, left: 14 }
'.gap-full': { top: '100%', right: '100%', bottom: '100%', left: '100%' }
'.gap-auto': { top: Ti.UI.SIZE, right: Ti.UI.SIZE, bottom: Ti.UI.SIZE, left: Ti.UI.SIZE }
'.gap-b-0': { bottom: 0 }
'.gap-b-1': { bottom: 4 }
'.gap-b-2': { bottom: 8 }
'.gap-b-3': { bottom: 12 }
'.gap-b-4': { bottom: 16 }
'.gap-b-5': { bottom: 20 }
'.gap-b-6': { bottom: 24 }
'.gap-b-7': { bottom: 28 }
'.gap-b-8': { bottom: 32 }
'.gap-b-9': { bottom: 36 }
'.gap-b-10': { bottom: 40 }
'.gap-b-11': { bottom: 44 }
'.gap-b-12': { bottom: 48 }
'.gap-b-13': { bottom: 52 }
'.gap-b-14': { bottom: 56 }
'.gap-b-15': { bottom: 60 }
'.gap-b-16': { bottom: 64 }
'.gap-b-20': { bottom: 80 }
'.gap-b-24': { bottom: 96 }
'.gap-b-28': { bottom: 112 }
'.gap-b-32': { bottom: 128 }
'.gap-b-36': { bottom: 144 }
'.gap-b-40': { bottom: 160 }
'.gap-b-44': { bottom: 176 }
'.gap-b-48': { bottom: 192 }
'.gap-b-52': { bottom: 208 }
'.gap-b-56': { bottom: 224 }
'.gap-b-60': { bottom: 240 }
'.gap-b-64': { bottom: 256 }
'.gap-b-72': { bottom: 288 }
'.gap-b-80': { bottom: 320 }
'.gap-b-96': { bottom: 384 }
'.gap-b-px': { bottom: '1px' }
'.gap-b-0.5': { bottom: 2 }
'.gap-b-1.5': { bottom: 6 }
'.gap-b-2.5': { bottom: 10 }
'.gap-b-3.5': { bottom: 14 }
'.gap-b-full': { bottom: '100%' }
'.gap-b-auto': { bottom: Ti.UI.SIZE }
'.gap-l-0': { left: 0 }
'.gap-l-1': { left: 4 }
'.gap-l-2': { left: 8 }
'.gap-l-3': { left: 12 }
'.gap-l-4': { left: 16 }
'.gap-l-5': { left: 20 }
'.gap-l-6': { left: 24 }
'.gap-l-7': { left: 28 }
'.gap-l-8': { left: 32 }
'.gap-l-9': { left: 36 }
'.gap-l-10': { left: 40 }
'.gap-l-11': { left: 44 }
'.gap-l-12': { left: 48 }
'.gap-l-13': { left: 52 }
'.gap-l-14': { left: 56 }
'.gap-l-15': { left: 60 }
'.gap-l-16': { left: 64 }
'.gap-l-20': { left: 80 }
'.gap-l-24': { left: 96 }
'.gap-l-28': { left: 112 }
'.gap-l-32': { left: 128 }
'.gap-l-36': { left: 144 }
'.gap-l-40': { left: 160 }
'.gap-l-44': { left: 176 }
'.gap-l-48': { left: 192 }
'.gap-l-52': { left: 208 }
'.gap-l-56': { left: 224 }
'.gap-l-60': { left: 240 }
'.gap-l-64': { left: 256 }
'.gap-l-72': { left: 288 }
'.gap-l-80': { left: 320 }
'.gap-l-96': { left: 384 }
'.gap-l-px': { left: '1px' }
'.gap-l-0.5': { left: 2 }
'.gap-l-1.5': { left: 6 }
'.gap-l-2.5': { left: 10 }
'.gap-l-3.5': { left: 14 }
'.gap-l-full': { left: '100%' }
'.gap-l-auto': { left: Ti.UI.SIZE }
'.gap-r-0': { right: 0 }
'.gap-r-1': { right: 4 }
'.gap-r-2': { right: 8 }
'.gap-r-3': { right: 12 }
'.gap-r-4': { right: 16 }
'.gap-r-5': { right: 20 }
'.gap-r-6': { right: 24 }
'.gap-r-7': { right: 28 }
'.gap-r-8': { right: 32 }
'.gap-r-9': { right: 36 }
'.gap-r-10': { right: 40 }
'.gap-r-11': { right: 44 }
'.gap-r-12': { right: 48 }
'.gap-r-13': { right: 52 }
'.gap-r-14': { right: 56 }
'.gap-r-15': { right: 60 }
'.gap-r-16': { right: 64 }
'.gap-r-20': { right: 80 }
'.gap-r-24': { right: 96 }
'.gap-r-28': { right: 112 }
'.gap-r-32': { right: 128 }
'.gap-r-36': { right: 144 }
'.gap-r-40': { right: 160 }
'.gap-r-44': { right: 176 }
'.gap-r-48': { right: 192 }
'.gap-r-52': { right: 208 }
'.gap-r-56': { right: 224 }
'.gap-r-60': { right: 240 }
'.gap-r-64': { right: 256 }
'.gap-r-72': { right: 288 }
'.gap-r-80': { right: 320 }
'.gap-r-96': { right: 384 }
'.gap-r-px': { right: '1px' }
'.gap-r-0.5': { right: 2 }
'.gap-r-1.5': { right: 6 }
'.gap-r-2.5': { right: 10 }
'.gap-r-3.5': { right: 14 }
'.gap-r-full': { right: '100%' }
'.gap-r-auto': { right: Ti.UI.SIZE }
'.gap-t-0': { top: 0 }
'.gap-t-1': { top: 4 }
'.gap-t-2': { top: 8 }
'.gap-t-3': { top: 12 }
'.gap-t-4': { top: 16 }
'.gap-t-5': { top: 20 }
'.gap-t-6': { top: 24 }
'.gap-t-7': { top: 28 }
'.gap-t-8': { top: 32 }
'.gap-t-9': { top: 36 }
'.gap-t-10': { top: 40 }
'.gap-t-11': { top: 44 }
'.gap-t-12': { top: 48 }
'.gap-t-13': { top: 52 }
'.gap-t-14': { top: 56 }
'.gap-t-15': { top: 60 }
'.gap-t-16': { top: 64 }
'.gap-t-20': { top: 80 }
'.gap-t-24': { top: 96 }
'.gap-t-28': { top: 112 }
'.gap-t-32': { top: 128 }
'.gap-t-36': { top: 144 }
'.gap-t-40': { top: 160 }
'.gap-t-44': { top: 176 }
'.gap-t-48': { top: 192 }
'.gap-t-52': { top: 208 }
'.gap-t-56': { top: 224 }
'.gap-t-60': { top: 240 }
'.gap-t-64': { top: 256 }
'.gap-t-72': { top: 288 }
'.gap-t-80': { top: 320 }
'.gap-t-96': { top: 384 }
'.gap-t-px': { top: '1px' }
'.gap-t-0.5': { top: 2 }
'.gap-t-1.5': { top: 6 }
'.gap-t-2.5': { top: 10 }
'.gap-t-3.5': { top: 14 }
'.gap-t-full': { top: '100%' }
'.gap-t-auto': { top: Ti.UI.SIZE }
'.gap-x-0': { right: 0, left: 0 }
'.gap-x-1': { right: 4, left: 4 }
'.gap-x-2': { right: 8, left: 8 }
'.gap-x-3': { right: 12, left: 12 }
'.gap-x-4': { right: 16, left: 16 }
'.gap-x-5': { right: 20, left: 20 }
'.gap-x-6': { right: 24, left: 24 }
'.gap-x-7': { right: 28, left: 28 }
'.gap-x-8': { right: 32, left: 32 }
'.gap-x-9': { right: 36, left: 36 }
'.gap-x-10': { right: 40, left: 40 }
'.gap-x-11': { right: 44, left: 44 }
'.gap-x-12': { right: 48, left: 48 }
'.gap-x-13': { right: 52, left: 52 }
'.gap-x-14': { right: 56, left: 56 }
'.gap-x-15': { right: 60, left: 60 }
'.gap-x-16': { right: 64, left: 64 }
'.gap-x-20': { right: 80, left: 80 }
'.gap-x-24': { right: 96, left: 96 }
'.gap-x-28': { right: 112, left: 112 }
'.gap-x-32': { right: 128, left: 128 }
'.gap-x-36': { right: 144, left: 144 }
'.gap-x-40': { right: 160, left: 160 }
'.gap-x-44': { right: 176, left: 176 }
'.gap-x-48': { right: 192, left: 192 }
'.gap-x-52': { right: 208, left: 208 }
'.gap-x-56': { right: 224, left: 224 }
'.gap-x-60': { right: 240, left: 240 }
'.gap-x-64': { right: 256, left: 256 }
'.gap-x-72': { right: 288, left: 288 }
'.gap-x-80': { right: 320, left: 320 }
'.gap-x-96': { right: 384, left: 384 }
'.gap-x-px': { right: '1px', left: '1px' }
'.gap-x-0.5': { right: 2, left: 2 }
'.gap-x-1.5': { right: 6, left: 6 }
'.gap-x-2.5': { right: 10, left: 10 }
'.gap-x-3.5': { right: 14, left: 14 }
'.gap-x-full': { right: '100%', left: '100%' }
'.gap-x-auto': { right: Ti.UI.SIZE, left: Ti.UI.SIZE }
'.gap-y-0': { top: 0, bottom: 0 }
'.gap-y-1': { top: 4, bottom: 4 }
'.gap-y-2': { top: 8, bottom: 8 }
'.gap-y-3': { top: 12, bottom: 12 }
'.gap-y-4': { top: 16, bottom: 16 }
'.gap-y-5': { top: 20, bottom: 20 }
'.gap-y-6': { top: 24, bottom: 24 }
'.gap-y-7': { top: 28, bottom: 28 }
'.gap-y-8': { top: 32, bottom: 32 }
'.gap-y-9': { top: 36, bottom: 36 }
'.gap-y-10': { top: 40, bottom: 40 }
'.gap-y-11': { top: 44, bottom: 44 }
'.gap-y-12': { top: 48, bottom: 48 }
'.gap-y-13': { top: 52, bottom: 52 }
'.gap-y-14': { top: 56, bottom: 56 }
'.gap-y-15': { top: 60, bottom: 60 }
'.gap-y-16': { top: 64, bottom: 64 }
'.gap-y-20': { top: 80, bottom: 80 }
'.gap-y-24': { top: 96, bottom: 96 }
'.gap-y-28': { top: 112, bottom: 112 }
'.gap-y-32': { top: 128, bottom: 128 }
'.gap-y-36': { top: 144, bottom: 144 }
'.gap-y-40': { top: 160, bottom: 160 }
'.gap-y-44': { top: 176, bottom: 176 }
'.gap-y-48': { top: 192, bottom: 192 }
'.gap-y-52': { top: 208, bottom: 208 }
'.gap-y-56': { top: 224, bottom: 224 }
'.gap-y-60': { top: 240, bottom: 240 }
'.gap-y-64': { top: 256, bottom: 256 }
'.gap-y-72': { top: 288, bottom: 288 }
'.gap-y-80': { top: 320, bottom: 320 }
'.gap-y-96': { top: 384, bottom: 384 }
'.gap-y-px': { top: '1px', bottom: '1px' }
'.gap-y-0.5': { top: 2, bottom: 2 }
'.gap-y-1.5': { top: 6, bottom: 6 }
'.gap-y-2.5': { top: 10, bottom: 10 }
'.gap-y-3.5': { top: 14, bottom: 14 }
'.gap-y-full': { top: '100%', bottom: '100%' }
'.gap-y-auto': { top: Ti.UI.SIZE, bottom: Ti.UI.SIZE }
```

## height Property
```css
'.h-0': { height: 0 }
'.h-1': { height: 4 }
'.h-2': { height: 8 }
'.h-3': { height: 12 }
'.h-4': { height: 16 }
'.h-5': { height: 20 }
'.h-6': { height: 24 }
'.h-7': { height: 28 }
'.h-8': { height: 32 }
'.h-9': { height: 36 }
'.h-10': { height: 40 }
'.h-11': { height: 44 }
'.h-12': { height: 48 }
'.h-13': { height: 52 }
'.h-14': { height: 56 }
'.h-15': { height: 60 }
'.h-16': { height: 64 }
'.h-20': { height: 80 }
'.h-24': { height: 96 }
'.h-28': { height: 112 }
'.h-32': { height: 128 }
'.h-36': { height: 144 }
'.h-40': { height: 160 }
'.h-44': { height: 176 }
'.h-48': { height: 192 }
'.h-52': { height: 208 }
'.h-56': { height: 224 }
'.h-60': { height: 240 }
'.h-64': { height: 256 }
'.h-72': { height: 288 }
'.h-80': { height: 320 }
'.h-96': { height: 384 }
'.h-px': { height: '1px' }
'.h-0.5': { height: 2 }
'.h-1.5': { height: 6 }
'.h-2.5': { height: 10 }
'.h-3.5': { height: 14 }
'.h-1/2': { height: '50%' }
'.h-1/3': { height: '33.333334%' }
'.h-2/3': { height: '66.666667%' }
'.h-1/4': { height: '25%' }
'.h-2/4': { height: '50%' }
'.h-3/4': { height: '75%' }
'.h-1/5': { height: '20%' }
'.h-2/5': { height: '40%' }
'.h-3/5': { height: '60%' }
'.h-4/5': { height: '80%' }
'.h-1/6': { height: '16.666667%' }
'.h-2/6': { height: '33.333334%' }
'.h-3/6': { height: '50%' }
'.h-4/6': { height: '66.666667%' }
'.h-5/6': { height: '83.333334%' }
'.h-1/12': { height: '8.333334%' }
'.h-2/12': { height: '16.666667%' }
'.h-3/12': { height: '25%' }
'.h-4/12': { height: '33.333334%' }
'.h-5/12': { height: '41.666667%' }
'.h-6/12': { height: '50%' }
'.h-7/12': { height: '58.333334%' }
'.h-8/12': { height: '66.666667%' }
'.h-9/12': { height: '75%' }
'.h-10/12': { height: '83.333334%' }
'.h-11/12': { height: '91.666667%' }
'.h-full': { height: '100%' }
'.h-auto': { height: Ti.UI.SIZE }
'.h-screen': { height: Ti.UI.FILL }
```

## touchEnabled Property
```css
'.touch-enabled': { touchEnabled: true }
'.touch-disabled': { touchEnabled: false }
'.pointer-events-auto': { touchEnabled: true }
'.pointer-events-none': { touchEnabled: false }
```

## items Property
```css
'.items-start': { top: 0 }
'.items-end': { bottom: 0 }
'.items-center': { width: Ti.UI.FILL, height: Ti.UI.FILL }
```

## keepScreenOn Property
```css
'.keep-screen-on[platform=android]': { keepScreenOn: true }
'.keep-screen-off[platform=android]': { keepScreenOn: false }
```

## keyboardAppearance Property
```css
'.keyboard-appearance-dark[platform=ios]': { keyboardAppearance: Ti.UI.KEYBOARD_APPEARANCE_DARK }
'.keyboard-appearance-light[platform=ios]': { keyboardAppearance: Ti.UI.KEYBOARD_APPEARANCE_LIGHT }
'.keyboard-appearance-default[platform=ios]': { keyboardAppearance: Ti.UI.KEYBOARD_APPEARANCE_DEFAULT }
```

## keyboardType Property
```css
'.keyboard-type-url': { keyboardType: Ti.UI.KEYBOARD_TYPE_URL }
'.keyboard-type-ascii': { keyboardType: Ti.UI.KEYBOARD_TYPE_ASCII }
'.keyboard-type-email': { keyboardType: Ti.UI.KEYBOARD_TYPE_EMAIL }
'.keyboard-type-twitter': { keyboardType: Ti.UI.KEYBOARD_TYPE_TWITTER }
'.keyboard-type-default': { keyboardType: Ti.UI.KEYBOARD_TYPE_DEFAULT }
'.keyboard-type-phone-pad': { keyboardType: Ti.UI.KEYBOARD_TYPE_PHONE_PAD }
'.keyboard-type-websearch': { keyboardType: Ti.UI.KEYBOARD_TYPE_WEBSEARCH }
'.keyboard-type-number-pad': { keyboardType: Ti.UI.KEYBOARD_TYPE_NUMBER_PAD }
'.keyboard-type-decimal-pad': { keyboardType: Ti.UI.KEYBOARD_TYPE_DECIMAL_PAD }
'.keyboard-type-namephone-pad': { keyboardType: Ti.UI.KEYBOARD_TYPE_NAMEPHONE_PAD }
'.keyboard-type-numbers-punctuation': { keyboardType: Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION }
```

## layout Property
```css
'.vertical': { layout: 'vertical' }
'.horizontal': { layout: 'horizontal' }
```

## Margin Property
```css
'.m-0': { top: 0, right: 0, bottom: 0, left: 0 }
'.m-1': { top: 4, right: 4, bottom: 4, left: 4 }
'.m-2': { top: 8, right: 8, bottom: 8, left: 8 }
'.m-3': { top: 12, right: 12, bottom: 12, left: 12 }
'.m-4': { top: 16, right: 16, bottom: 16, left: 16 }
'.m-5': { top: 20, right: 20, bottom: 20, left: 20 }
'.m-6': { top: 24, right: 24, bottom: 24, left: 24 }
'.m-7': { top: 28, right: 28, bottom: 28, left: 28 }
'.m-8': { top: 32, right: 32, bottom: 32, left: 32 }
'.m-9': { top: 36, right: 36, bottom: 36, left: 36 }
'.m-10': { top: 40, right: 40, bottom: 40, left: 40 }
'.m-11': { top: 44, right: 44, bottom: 44, left: 44 }
'.m-12': { top: 48, right: 48, bottom: 48, left: 48 }
'.m-13': { top: 52, right: 52, bottom: 52, left: 52 }
'.m-14': { top: 56, right: 56, bottom: 56, left: 56 }
'.m-15': { top: 60, right: 60, bottom: 60, left: 60 }
'.m-16': { top: 64, right: 64, bottom: 64, left: 64 }
'.m-20': { top: 80, right: 80, bottom: 80, left: 80 }
'.m-24': { top: 96, right: 96, bottom: 96, left: 96 }
'.m-28': { top: 112, right: 112, bottom: 112, left: 112 }
'.m-32': { top: 128, right: 128, bottom: 128, left: 128 }
'.m-36': { top: 144, right: 144, bottom: 144, left: 144 }
'.m-40': { top: 160, right: 160, bottom: 160, left: 160 }
'.m-44': { top: 176, right: 176, bottom: 176, left: 176 }
'.m-48': { top: 192, right: 192, bottom: 192, left: 192 }
'.m-52': { top: 208, right: 208, bottom: 208, left: 208 }
'.m-56': { top: 224, right: 224, bottom: 224, left: 224 }
'.m-60': { top: 240, right: 240, bottom: 240, left: 240 }
'.m-64': { top: 256, right: 256, bottom: 256, left: 256 }
'.m-72': { top: 288, right: 288, bottom: 288, left: 288 }
'.m-80': { top: 320, right: 320, bottom: 320, left: 320 }
'.m-96': { top: 384, right: 384, bottom: 384, left: 384 }
'.m-px': { top: '1px', right: '1px', bottom: '1px', left: '1px' }
'.m-0.5': { top: 2, right: 2, bottom: 2, left: 2 }
'.m-1.5': { top: 6, right: 6, bottom: 6, left: 6 }
'.m-2.5': { top: 10, right: 10, bottom: 10, left: 10 }
'.m-3.5': { top: 14, right: 14, bottom: 14, left: 14 }
'.m-1/2': { top: '50%', right: '50%', bottom: '50%', left: '50%' }
'.m-1/3': { top: '33.333334%', right: '33.333334%', bottom: '33.333334%', left: '33.333334%' }
'.m-2/3': { top: '66.666667%', right: '66.666667%', bottom: '66.666667%', left: '66.666667%' }
'.m-1/4': { top: '25%', right: '25%', bottom: '25%', left: '25%' }
'.m-2/4': { top: '50%', right: '50%', bottom: '50%', left: '50%' }
'.m-3/4': { top: '75%', right: '75%', bottom: '75%', left: '75%' }
'.m-1/5': { top: '20%', right: '20%', bottom: '20%', left: '20%' }
'.m-2/5': { top: '40%', right: '40%', bottom: '40%', left: '40%' }
'.m-3/5': { top: '60%', right: '60%', bottom: '60%', left: '60%' }
'.m-4/5': { top: '80%', right: '80%', bottom: '80%', left: '80%' }
'.m-1/6': { top: '16.666667%', right: '16.666667%', bottom: '16.666667%', left: '16.666667%' }
'.m-2/6': { top: '33.333334%', right: '33.333334%', bottom: '33.333334%', left: '33.333334%' }
'.m-3/6': { top: '50%', right: '50%', bottom: '50%', left: '50%' }
'.m-4/6': { top: '66.666667%', right: '66.666667%', bottom: '66.666667%', left: '66.666667%' }
'.m-5/6': { top: '83.333334%', right: '83.333334%', bottom: '83.333334%', left: '83.333334%' }
'.m-1/12': { top: '8.333334%', right: '8.333334%', bottom: '8.333334%', left: '8.333334%' }
'.m-2/12': { top: '16.666667%', right: '16.666667%', bottom: '16.666667%', left: '16.666667%' }
'.m-3/12': { top: '25%', right: '25%', bottom: '25%', left: '25%' }
'.m-4/12': { top: '33.333334%', right: '33.333334%', bottom: '33.333334%', left: '33.333334%' }
'.m-5/12': { top: '41.666667%', right: '41.666667%', bottom: '41.666667%', left: '41.666667%' }
'.m-6/12': { top: '50%', right: '50%', bottom: '50%', left: '50%' }
'.m-7/12': { top: '58.333334%', right: '58.333334%', bottom: '58.333334%', left: '58.333334%' }
'.m-8/12': { top: '66.666667%', right: '66.666667%', bottom: '66.666667%', left: '66.666667%' }
'.m-9/12': { top: '75%', right: '75%', bottom: '75%', left: '75%' }
'.m-10/12': { top: '83.333334%', right: '83.333334%', bottom: '83.333334%', left: '83.333334%' }
'.m-11/12': { top: '91.666667%', right: '91.666667%', bottom: '91.666667%', left: '91.666667%' }
'.m-full': { top: '100%', right: '100%', bottom: '100%', left: '100%' }
'.m-auto': { top: null, right: null, bottom: null, left: null }
'.my-0': { top: 0, bottom: 0 }
'.my-1': { top: 4, bottom: 4 }
'.my-2': { top: 8, bottom: 8 }
'.my-3': { top: 12, bottom: 12 }
'.my-4': { top: 16, bottom: 16 }
'.my-5': { top: 20, bottom: 20 }
'.my-6': { top: 24, bottom: 24 }
'.my-7': { top: 28, bottom: 28 }
'.my-8': { top: 32, bottom: 32 }
'.my-9': { top: 36, bottom: 36 }
'.my-10': { top: 40, bottom: 40 }
'.my-11': { top: 44, bottom: 44 }
'.my-12': { top: 48, bottom: 48 }
'.my-13': { top: 52, bottom: 52 }
'.my-14': { top: 56, bottom: 56 }
'.my-15': { top: 60, bottom: 60 }
'.my-16': { top: 64, bottom: 64 }
'.my-20': { top: 80, bottom: 80 }
'.my-24': { top: 96, bottom: 96 }
'.my-28': { top: 112, bottom: 112 }
'.my-32': { top: 128, bottom: 128 }
'.my-36': { top: 144, bottom: 144 }
'.my-40': { top: 160, bottom: 160 }
'.my-44': { top: 176, bottom: 176 }
'.my-48': { top: 192, bottom: 192 }
'.my-52': { top: 208, bottom: 208 }
'.my-56': { top: 224, bottom: 224 }
'.my-60': { top: 240, bottom: 240 }
'.my-64': { top: 256, bottom: 256 }
'.my-72': { top: 288, bottom: 288 }
'.my-80': { top: 320, bottom: 320 }
'.my-96': { top: 384, bottom: 384 }
'.my-px': { top: '1px', bottom: '1px' }
'.my-0.5': { top: 2, bottom: 2 }
'.my-1.5': { top: 6, bottom: 6 }
'.my-2.5': { top: 10, bottom: 10 }
'.my-3.5': { top: 14, bottom: 14 }
'.my-1/2': { top: '50%', bottom: '50%' }
'.my-1/3': { top: '33.333334%', bottom: '33.333334%' }
'.my-2/3': { top: '66.666667%', bottom: '66.666667%' }
'.my-1/4': { top: '25%', bottom: '25%' }
'.my-2/4': { top: '50%', bottom: '50%' }
'.my-3/4': { top: '75%', bottom: '75%' }
'.my-1/5': { top: '20%', bottom: '20%' }
'.my-2/5': { top: '40%', bottom: '40%' }
'.my-3/5': { top: '60%', bottom: '60%' }
'.my-4/5': { top: '80%', bottom: '80%' }
'.my-1/6': { top: '16.666667%', bottom: '16.666667%' }
'.my-2/6': { top: '33.333334%', bottom: '33.333334%' }
'.my-3/6': { top: '50%', bottom: '50%' }
'.my-4/6': { top: '66.666667%', bottom: '66.666667%' }
'.my-5/6': { top: '83.333334%', bottom: '83.333334%' }
'.my-1/12': { top: '8.333334%', bottom: '8.333334%' }
'.my-2/12': { top: '16.666667%', bottom: '16.666667%' }
'.my-3/12': { top: '25%', bottom: '25%' }
'.my-4/12': { top: '33.333334%', bottom: '33.333334%' }
'.my-5/12': { top: '41.666667%', bottom: '41.666667%' }
'.my-6/12': { top: '50%', bottom: '50%' }
'.my-7/12': { top: '58.333334%', bottom: '58.333334%' }
'.my-8/12': { top: '66.666667%', bottom: '66.666667%' }
'.my-9/12': { top: '75%', bottom: '75%' }
'.my-10/12': { top: '83.333334%', bottom: '83.333334%' }
'.my-11/12': { top: '91.666667%', bottom: '91.666667%' }
'.my-full': { top: '100%', bottom: '100%' }
'.my-auto': { top: null, bottom: null }
'.mx-0': { right: 0, left: 0 }
'.mx-1': { right: 4, left: 4 }
'.mx-2': { right: 8, left: 8 }
'.mx-3': { right: 12, left: 12 }
'.mx-4': { right: 16, left: 16 }
'.mx-5': { right: 20, left: 20 }
'.mx-6': { right: 24, left: 24 }
'.mx-7': { right: 28, left: 28 }
'.mx-8': { right: 32, left: 32 }
'.mx-9': { right: 36, left: 36 }
'.mx-10': { right: 40, left: 40 }
'.mx-11': { right: 44, left: 44 }
'.mx-12': { right: 48, left: 48 }
'.mx-13': { right: 52, left: 52 }
'.mx-14': { right: 56, left: 56 }
'.mx-15': { right: 60, left: 60 }
'.mx-16': { right: 64, left: 64 }
'.mx-20': { right: 80, left: 80 }
'.mx-24': { right: 96, left: 96 }
'.mx-28': { right: 112, left: 112 }
'.mx-32': { right: 128, left: 128 }
'.mx-36': { right: 144, left: 144 }
'.mx-40': { right: 160, left: 160 }
'.mx-44': { right: 176, left: 176 }
'.mx-48': { right: 192, left: 192 }
'.mx-52': { right: 208, left: 208 }
'.mx-56': { right: 224, left: 224 }
'.mx-60': { right: 240, left: 240 }
'.mx-64': { right: 256, left: 256 }
'.mx-72': { right: 288, left: 288 }
'.mx-80': { right: 320, left: 320 }
'.mx-96': { right: 384, left: 384 }
'.mx-px': { right: '1px', left: '1px' }
'.mx-0.5': { right: 2, left: 2 }
'.mx-1.5': { right: 6, left: 6 }
'.mx-2.5': { right: 10, left: 10 }
'.mx-3.5': { right: 14, left: 14 }
'.mx-1/2': { right: '50%', left: '50%' }
'.mx-1/3': { right: '33.333334%', left: '33.333334%' }
'.mx-2/3': { right: '66.666667%', left: '66.666667%' }
'.mx-1/4': { right: '25%', left: '25%' }
'.mx-2/4': { right: '50%', left: '50%' }
'.mx-3/4': { right: '75%', left: '75%' }
'.mx-1/5': { right: '20%', left: '20%' }
'.mx-2/5': { right: '40%', left: '40%' }
'.mx-3/5': { right: '60%', left: '60%' }
'.mx-4/5': { right: '80%', left: '80%' }
'.mx-1/6': { right: '16.666667%', left: '16.666667%' }
'.mx-2/6': { right: '33.333334%', left: '33.333334%' }
'.mx-3/6': { right: '50%', left: '50%' }
'.mx-4/6': { right: '66.666667%', left: '66.666667%' }
'.mx-5/6': { right: '83.333334%', left: '83.333334%' }
'.mx-1/12': { right: '8.333334%', left: '8.333334%' }
'.mx-2/12': { right: '16.666667%', left: '16.666667%' }
'.mx-3/12': { right: '25%', left: '25%' }
'.mx-4/12': { right: '33.333334%', left: '33.333334%' }
'.mx-5/12': { right: '41.666667%', left: '41.666667%' }
'.mx-6/12': { right: '50%', left: '50%' }
'.mx-7/12': { right: '58.333334%', left: '58.333334%' }
'.mx-8/12': { right: '66.666667%', left: '66.666667%' }
'.mx-9/12': { right: '75%', left: '75%' }
'.mx-10/12': { right: '83.333334%', left: '83.333334%' }
'.mx-11/12': { right: '91.666667%', left: '91.666667%' }
'.mx-full': { right: '100%', left: '100%' }
'.mx-auto': { right: null, left: null }
'.mt-0': { top: 0 }
'.mt-1': { top: 4 }
'.mt-2': { top: 8 }
'.mt-3': { top: 12 }
'.mt-4': { top: 16 }
'.mt-5': { top: 20 }
'.mt-6': { top: 24 }
'.mt-7': { top: 28 }
'.mt-8': { top: 32 }
'.mt-9': { top: 36 }
'.mt-10': { top: 40 }
'.mt-11': { top: 44 }
'.mt-12': { top: 48 }
'.mt-13': { top: 52 }
'.mt-14': { top: 56 }
'.mt-15': { top: 60 }
'.mt-16': { top: 64 }
'.mt-20': { top: 80 }
'.mt-24': { top: 96 }
'.mt-28': { top: 112 }
'.mt-32': { top: 128 }
'.mt-36': { top: 144 }
'.mt-40': { top: 160 }
'.mt-44': { top: 176 }
'.mt-48': { top: 192 }
'.mt-52': { top: 208 }
'.mt-56': { top: 224 }
'.mt-60': { top: 240 }
'.mt-64': { top: 256 }
'.mt-72': { top: 288 }
'.mt-80': { top: 320 }
'.mt-96': { top: 384 }
'.mt-px': { top: '1px' }
'.mt-0.5': { top: 2 }
'.mt-1.5': { top: 6 }
'.mt-2.5': { top: 10 }
'.mt-3.5': { top: 14 }
'.mt-1/2': { top: '50%' }
'.mt-1/3': { top: '33.333334%' }
'.mt-2/3': { top: '66.666667%' }
'.mt-1/4': { top: '25%' }
'.mt-2/4': { top: '50%' }
'.mt-3/4': { top: '75%' }
'.mt-1/5': { top: '20%' }
'.mt-2/5': { top: '40%' }
'.mt-3/5': { top: '60%' }
'.mt-4/5': { top: '80%' }
'.mt-1/6': { top: '16.666667%' }
'.mt-2/6': { top: '33.333334%' }
'.mt-3/6': { top: '50%' }
'.mt-4/6': { top: '66.666667%' }
'.mt-5/6': { top: '83.333334%' }
'.mt-1/12': { top: '8.333334%' }
'.mt-2/12': { top: '16.666667%' }
'.mt-3/12': { top: '25%' }
'.mt-4/12': { top: '33.333334%' }
'.mt-5/12': { top: '41.666667%' }
'.mt-6/12': { top: '50%' }
'.mt-7/12': { top: '58.333334%' }
'.mt-8/12': { top: '66.666667%' }
'.mt-9/12': { top: '75%' }
'.mt-10/12': { top: '83.333334%' }
'.mt-11/12': { top: '91.666667%' }
'.mt-full': { top: '100%' }
'.mt-auto': { top: null }
'.mr-0': { right: 0 }
'.mr-1': { right: 4 }
'.mr-2': { right: 8 }
'.mr-3': { right: 12 }
'.mr-4': { right: 16 }
'.mr-5': { right: 20 }
'.mr-6': { right: 24 }
'.mr-7': { right: 28 }
'.mr-8': { right: 32 }
'.mr-9': { right: 36 }
'.mr-10': { right: 40 }
'.mr-11': { right: 44 }
'.mr-12': { right: 48 }
'.mr-13': { right: 52 }
'.mr-14': { right: 56 }
'.mr-15': { right: 60 }
'.mr-16': { right: 64 }
'.mr-20': { right: 80 }
'.mr-24': { right: 96 }
'.mr-28': { right: 112 }
'.mr-32': { right: 128 }
'.mr-36': { right: 144 }
'.mr-40': { right: 160 }
'.mr-44': { right: 176 }
'.mr-48': { right: 192 }
'.mr-52': { right: 208 }
'.mr-56': { right: 224 }
'.mr-60': { right: 240 }
'.mr-64': { right: 256 }
'.mr-72': { right: 288 }
'.mr-80': { right: 320 }
'.mr-96': { right: 384 }
'.mr-px': { right: '1px' }
'.mr-0.5': { right: 2 }
'.mr-1.5': { right: 6 }
'.mr-2.5': { right: 10 }
'.mr-3.5': { right: 14 }
'.mr-1/2': { right: '50%' }
'.mr-1/3': { right: '33.333334%' }
'.mr-2/3': { right: '66.666667%' }
'.mr-1/4': { right: '25%' }
'.mr-2/4': { right: '50%' }
'.mr-3/4': { right: '75%' }
'.mr-1/5': { right: '20%' }
'.mr-2/5': { right: '40%' }
'.mr-3/5': { right: '60%' }
'.mr-4/5': { right: '80%' }
'.mr-1/6': { right: '16.666667%' }
'.mr-2/6': { right: '33.333334%' }
'.mr-3/6': { right: '50%' }
'.mr-4/6': { right: '66.666667%' }
'.mr-5/6': { right: '83.333334%' }
'.mr-1/12': { right: '8.333334%' }
'.mr-2/12': { right: '16.666667%' }
'.mr-3/12': { right: '25%' }
'.mr-4/12': { right: '33.333334%' }
'.mr-5/12': { right: '41.666667%' }
'.mr-6/12': { right: '50%' }
'.mr-7/12': { right: '58.333334%' }
'.mr-8/12': { right: '66.666667%' }
'.mr-9/12': { right: '75%' }
'.mr-10/12': { right: '83.333334%' }
'.mr-11/12': { right: '91.666667%' }
'.mr-full': { right: '100%' }
'.mr-auto': { right: null }
'.mb-0': { bottom: 0 }
'.mb-1': { bottom: 4 }
'.mb-2': { bottom: 8 }
'.mb-3': { bottom: 12 }
'.mb-4': { bottom: 16 }
'.mb-5': { bottom: 20 }
'.mb-6': { bottom: 24 }
'.mb-7': { bottom: 28 }
'.mb-8': { bottom: 32 }
'.mb-9': { bottom: 36 }
'.mb-10': { bottom: 40 }
'.mb-11': { bottom: 44 }
'.mb-12': { bottom: 48 }
'.mb-13': { bottom: 52 }
'.mb-14': { bottom: 56 }
'.mb-15': { bottom: 60 }
'.mb-16': { bottom: 64 }
'.mb-20': { bottom: 80 }
'.mb-24': { bottom: 96 }
'.mb-28': { bottom: 112 }
'.mb-32': { bottom: 128 }
'.mb-36': { bottom: 144 }
'.mb-40': { bottom: 160 }
'.mb-44': { bottom: 176 }
'.mb-48': { bottom: 192 }
'.mb-52': { bottom: 208 }
'.mb-56': { bottom: 224 }
'.mb-60': { bottom: 240 }
'.mb-64': { bottom: 256 }
'.mb-72': { bottom: 288 }
'.mb-80': { bottom: 320 }
'.mb-96': { bottom: 384 }
'.mb-px': { bottom: '1px' }
'.mb-0.5': { bottom: 2 }
'.mb-1.5': { bottom: 6 }
'.mb-2.5': { bottom: 10 }
'.mb-3.5': { bottom: 14 }
'.mb-1/2': { bottom: '50%' }
'.mb-1/3': { bottom: '33.333334%' }
'.mb-2/3': { bottom: '66.666667%' }
'.mb-1/4': { bottom: '25%' }
'.mb-2/4': { bottom: '50%' }
'.mb-3/4': { bottom: '75%' }
'.mb-1/5': { bottom: '20%' }
'.mb-2/5': { bottom: '40%' }
'.mb-3/5': { bottom: '60%' }
'.mb-4/5': { bottom: '80%' }
'.mb-1/6': { bottom: '16.666667%' }
'.mb-2/6': { bottom: '33.333334%' }
'.mb-3/6': { bottom: '50%' }
'.mb-4/6': { bottom: '66.666667%' }
'.mb-5/6': { bottom: '83.333334%' }
'.mb-1/12': { bottom: '8.333334%' }
'.mb-2/12': { bottom: '16.666667%' }
'.mb-3/12': { bottom: '25%' }
'.mb-4/12': { bottom: '33.333334%' }
'.mb-5/12': { bottom: '41.666667%' }
'.mb-6/12': { bottom: '50%' }
'.mb-7/12': { bottom: '58.333334%' }
'.mb-8/12': { bottom: '66.666667%' }
'.mb-9/12': { bottom: '75%' }
'.mb-10/12': { bottom: '83.333334%' }
'.mb-11/12': { bottom: '91.666667%' }
'.mb-full': { bottom: '100%' }
'.mb-auto': { bottom: null }
'.ml-0': { left: 0 }
'.ml-1': { left: 4 }
'.ml-2': { left: 8 }
'.ml-3': { left: 12 }
'.ml-4': { left: 16 }
'.ml-5': { left: 20 }
'.ml-6': { left: 24 }
'.ml-7': { left: 28 }
'.ml-8': { left: 32 }
'.ml-9': { left: 36 }
'.ml-10': { left: 40 }
'.ml-11': { left: 44 }
'.ml-12': { left: 48 }
'.ml-13': { left: 52 }
'.ml-14': { left: 56 }
'.ml-15': { left: 60 }
'.ml-16': { left: 64 }
'.ml-20': { left: 80 }
'.ml-24': { left: 96 }
'.ml-28': { left: 112 }
'.ml-32': { left: 128 }
'.ml-36': { left: 144 }
'.ml-40': { left: 160 }
'.ml-44': { left: 176 }
'.ml-48': { left: 192 }
'.ml-52': { left: 208 }
'.ml-56': { left: 224 }
'.ml-60': { left: 240 }
'.ml-64': { left: 256 }
'.ml-72': { left: 288 }
'.ml-80': { left: 320 }
'.ml-96': { left: 384 }
'.ml-px': { left: '1px' }
'.ml-0.5': { left: 2 }
'.ml-1.5': { left: 6 }
'.ml-2.5': { left: 10 }
'.ml-3.5': { left: 14 }
'.ml-1/2': { left: '50%' }
'.ml-1/3': { left: '33.333334%' }
'.ml-2/3': { left: '66.666667%' }
'.ml-1/4': { left: '25%' }
'.ml-2/4': { left: '50%' }
'.ml-3/4': { left: '75%' }
'.ml-1/5': { left: '20%' }
'.ml-2/5': { left: '40%' }
'.ml-3/5': { left: '60%' }
'.ml-4/5': { left: '80%' }
'.ml-1/6': { left: '16.666667%' }
'.ml-2/6': { left: '33.333334%' }
'.ml-3/6': { left: '50%' }
'.ml-4/6': { left: '66.666667%' }
'.ml-5/6': { left: '83.333334%' }
'.ml-1/12': { left: '8.333334%' }
'.ml-2/12': { left: '16.666667%' }
'.ml-3/12': { left: '25%' }
'.ml-4/12': { left: '33.333334%' }
'.ml-5/12': { left: '41.666667%' }
'.ml-6/12': { left: '50%' }
'.ml-7/12': { left: '58.333334%' }
'.ml-8/12': { left: '66.666667%' }
'.ml-9/12': { left: '75%' }
'.ml-10/12': { left: '83.333334%' }
'.ml-11/12': { left: '91.666667%' }
'.ml-full': { left: '100%' }
'.ml-auto': { left: null }
```

## Negative Margins Property
```css
'.-m-1': { top: -4, right: -4, bottom: -4, left: -4 }
'.-m-2': { top: -8, right: -8, bottom: -8, left: -8 }
'.-m-3': { top: -12, right: -12, bottom: -12, left: -12 }
'.-m-4': { top: -16, right: -16, bottom: -16, left: -16 }
'.-m-5': { top: -20, right: -20, bottom: -20, left: -20 }
'.-m-6': { top: -24, right: -24, bottom: -24, left: -24 }
'.-m-7': { top: -28, right: -28, bottom: -28, left: -28 }
'.-m-8': { top: -32, right: -32, bottom: -32, left: -32 }
'.-m-9': { top: -36, right: -36, bottom: -36, left: -36 }
'.-m-10': { top: -40, right: -40, bottom: -40, left: -40 }
'.-m-11': { top: -44, right: -44, bottom: -44, left: -44 }
'.-m-12': { top: -48, right: -48, bottom: -48, left: -48 }
'.-m-13': { top: -52, right: -52, bottom: -52, left: -52 }
'.-m-14': { top: -56, right: -56, bottom: -56, left: -56 }
'.-m-15': { top: -60, right: -60, bottom: -60, left: -60 }
'.-m-16': { top: -64, right: -64, bottom: -64, left: -64 }
'.-m-20': { top: -80, right: -80, bottom: -80, left: -80 }
'.-m-24': { top: -96, right: -96, bottom: -96, left: -96 }
'.-m-28': { top: -112, right: -112, bottom: -112, left: -112 }
'.-m-32': { top: -128, right: -128, bottom: -128, left: -128 }
'.-m-36': { top: -144, right: -144, bottom: -144, left: -144 }
'.-m-40': { top: -160, right: -160, bottom: -160, left: -160 }
'.-m-44': { top: -176, right: -176, bottom: -176, left: -176 }
'.-m-48': { top: -192, right: -192, bottom: -192, left: -192 }
'.-m-52': { top: -208, right: -208, bottom: -208, left: -208 }
'.-m-56': { top: -224, right: -224, bottom: -224, left: -224 }
'.-m-60': { top: -240, right: -240, bottom: -240, left: -240 }
'.-m-64': { top: -256, right: -256, bottom: -256, left: -256 }
'.-m-72': { top: -288, right: -288, bottom: -288, left: -288 }
'.-m-80': { top: -320, right: -320, bottom: -320, left: -320 }
'.-m-96': { top: -384, right: -384, bottom: -384, left: -384 }
'.-m-px': { top: '-1px', right: '-1px', bottom: '-1px', left: '-1px' }
'.-m-0.5': { top: -2, right: -2, bottom: -2, left: -2 }
'.-m-1.5': { top: -6, right: -6, bottom: -6, left: -6 }
'.-m-2.5': { top: -10, right: -10, bottom: -10, left: -10 }
'.-m-3.5': { top: -14, right: -14, bottom: -14, left: -14 }
'.-m-1/2': { top: '-50%', right: '-50%', bottom: '-50%', left: '-50%' }
'.-m-1/3': { top: '-33.333334%', right: '-33.333334%', bottom: '-33.333334%', left: '-33.333334%' }
'.-m-2/3': { top: '-66.666667%', right: '-66.666667%', bottom: '-66.666667%', left: '-66.666667%' }
'.-m-1/4': { top: '-25%', right: '-25%', bottom: '-25%', left: '-25%' }
'.-m-2/4': { top: '-50%', right: '-50%', bottom: '-50%', left: '-50%' }
'.-m-3/4': { top: '-75%', right: '-75%', bottom: '-75%', left: '-75%' }
'.-m-1/5': { top: '-20%', right: '-20%', bottom: '-20%', left: '-20%' }
'.-m-2/5': { top: '-40%', right: '-40%', bottom: '-40%', left: '-40%' }
'.-m-3/5': { top: '-60%', right: '-60%', bottom: '-60%', left: '-60%' }
'.-m-4/5': { top: '-80%', right: '-80%', bottom: '-80%', left: '-80%' }
'.-m-1/6': { top: '-16.666667%', right: '-16.666667%', bottom: '-16.666667%', left: '-16.666667%' }
'.-m-2/6': { top: '-33.333334%', right: '-33.333334%', bottom: '-33.333334%', left: '-33.333334%' }
'.-m-3/6': { top: '-50%', right: '-50%', bottom: '-50%', left: '-50%' }
'.-m-4/6': { top: '-66.666667%', right: '-66.666667%', bottom: '-66.666667%', left: '-66.666667%' }
'.-m-5/6': { top: '-83.333334%', right: '-83.333334%', bottom: '-83.333334%', left: '-83.333334%' }
'.-m-1/12': { top: '-8.333334%', right: '-8.333334%', bottom: '-8.333334%', left: '-8.333334%' }
'.-m-2/12': { top: '-16.666667%', right: '-16.666667%', bottom: '-16.666667%', left: '-16.666667%' }
'.-m-3/12': { top: '-25%', right: '-25%', bottom: '-25%', left: '-25%' }
'.-m-4/12': { top: '-33.333334%', right: '-33.333334%', bottom: '-33.333334%', left: '-33.333334%' }
'.-m-5/12': { top: '-41.666667%', right: '-41.666667%', bottom: '-41.666667%', left: '-41.666667%' }
'.-m-6/12': { top: '-50%', right: '-50%', bottom: '-50%', left: '-50%' }
'.-m-7/12': { top: '-58.333334%', right: '-58.333334%', bottom: '-58.333334%', left: '-58.333334%' }
'.-m-8/12': { top: '-66.666667%', right: '-66.666667%', bottom: '-66.666667%', left: '-66.666667%' }
'.-m-9/12': { top: '-75%', right: '-75%', bottom: '-75%', left: '-75%' }
'.-m-10/12': { top: '-83.333334%', right: '-83.333334%', bottom: '-83.333334%', left: '-83.333334%' }
'.-m-11/12': { top: '-91.666667%', right: '-91.666667%', bottom: '-91.666667%', left: '-91.666667%' }
'.-m-full': { top: '-100%', right: '-100%', bottom: '-100%', left: '-100%' }
'.-my-1': { top: -4, bottom: -4 }
'.-my-2': { top: -8, bottom: -8 }
'.-my-3': { top: -12, bottom: -12 }
'.-my-4': { top: -16, bottom: -16 }
'.-my-5': { top: -20, bottom: -20 }
'.-my-6': { top: -24, bottom: -24 }
'.-my-7': { top: -28, bottom: -28 }
'.-my-8': { top: -32, bottom: -32 }
'.-my-9': { top: -36, bottom: -36 }
'.-my-10': { top: -40, bottom: -40 }
'.-my-11': { top: -44, bottom: -44 }
'.-my-12': { top: -48, bottom: -48 }
'.-my-13': { top: -52, bottom: -52 }
'.-my-14': { top: -56, bottom: -56 }
'.-my-15': { top: -60, bottom: -60 }
'.-my-16': { top: -64, bottom: -64 }
'.-my-20': { top: -80, bottom: -80 }
'.-my-24': { top: -96, bottom: -96 }
'.-my-28': { top: -112, bottom: -112 }
'.-my-32': { top: -128, bottom: -128 }
'.-my-36': { top: -144, bottom: -144 }
'.-my-40': { top: -160, bottom: -160 }
'.-my-44': { top: -176, bottom: -176 }
'.-my-48': { top: -192, bottom: -192 }
'.-my-52': { top: -208, bottom: -208 }
'.-my-56': { top: -224, bottom: -224 }
'.-my-60': { top: -240, bottom: -240 }
'.-my-64': { top: -256, bottom: -256 }
'.-my-72': { top: -288, bottom: -288 }
'.-my-80': { top: -320, bottom: -320 }
'.-my-96': { top: -384, bottom: -384 }
'.-my-px': { top: '-1px', bottom: '-1px' }
'.-my-0.5': { top: -2, bottom: -2 }
'.-my-1.5': { top: -6, bottom: -6 }
'.-my-2.5': { top: -10, bottom: -10 }
'.-my-3.5': { top: -14, bottom: -14 }
'.-my-1/2': { top: '-50%', bottom: '-50%' }
'.-my-1/3': { top: '-33.333334%', bottom: '-33.333334%' }
'.-my-2/3': { top: '-66.666667%', bottom: '-66.666667%' }
'.-my-1/4': { top: '-25%', bottom: '-25%' }
'.-my-2/4': { top: '-50%', bottom: '-50%' }
'.-my-3/4': { top: '-75%', bottom: '-75%' }
'.-my-1/5': { top: '-20%', bottom: '-20%' }
'.-my-2/5': { top: '-40%', bottom: '-40%' }
'.-my-3/5': { top: '-60%', bottom: '-60%' }
'.-my-4/5': { top: '-80%', bottom: '-80%' }
'.-my-1/6': { top: '-16.666667%', bottom: '-16.666667%' }
'.-my-2/6': { top: '-33.333334%', bottom: '-33.333334%' }
'.-my-3/6': { top: '-50%', bottom: '-50%' }
'.-my-4/6': { top: '-66.666667%', bottom: '-66.666667%' }
'.-my-5/6': { top: '-83.333334%', bottom: '-83.333334%' }
'.-my-1/12': { top: '-8.333334%', bottom: '-8.333334%' }
'.-my-2/12': { top: '-16.666667%', bottom: '-16.666667%' }
'.-my-3/12': { top: '-25%', bottom: '-25%' }
'.-my-4/12': { top: '-33.333334%', bottom: '-33.333334%' }
'.-my-5/12': { top: '-41.666667%', bottom: '-41.666667%' }
'.-my-6/12': { top: '-50%', bottom: '-50%' }
'.-my-7/12': { top: '-58.333334%', bottom: '-58.333334%' }
'.-my-8/12': { top: '-66.666667%', bottom: '-66.666667%' }
'.-my-9/12': { top: '-75%', bottom: '-75%' }
'.-my-10/12': { top: '-83.333334%', bottom: '-83.333334%' }
'.-my-11/12': { top: '-91.666667%', bottom: '-91.666667%' }
'.-my-full': { top: '-100%', bottom: '-100%' }
'.-mx-1': { left: -4, right: -4 }
'.-mx-2': { left: -8, right: -8 }
'.-mx-3': { left: -12, right: -12 }
'.-mx-4': { left: -16, right: -16 }
'.-mx-5': { left: -20, right: -20 }
'.-mx-6': { left: -24, right: -24 }
'.-mx-7': { left: -28, right: -28 }
'.-mx-8': { left: -32, right: -32 }
'.-mx-9': { left: -36, right: -36 }
'.-mx-10': { left: -40, right: -40 }
'.-mx-11': { left: -44, right: -44 }
'.-mx-12': { left: -48, right: -48 }
'.-mx-13': { left: -52, right: -52 }
'.-mx-14': { left: -56, right: -56 }
'.-mx-15': { left: -60, right: -60 }
'.-mx-16': { left: -64, right: -64 }
'.-mx-20': { left: -80, right: -80 }
'.-mx-24': { left: -96, right: -96 }
'.-mx-28': { left: -112, right: -112 }
'.-mx-32': { left: -128, right: -128 }
'.-mx-36': { left: -144, right: -144 }
'.-mx-40': { left: -160, right: -160 }
'.-mx-44': { left: -176, right: -176 }
'.-mx-48': { left: -192, right: -192 }
'.-mx-52': { left: -208, right: -208 }
'.-mx-56': { left: -224, right: -224 }
'.-mx-60': { left: -240, right: -240 }
'.-mx-64': { left: -256, right: -256 }
'.-mx-72': { left: -288, right: -288 }
'.-mx-80': { left: -320, right: -320 }
'.-mx-96': { left: -384, right: -384 }
'.-mx-px': { left: '-1px', right: '-1px' }
'.-mx-0.5': { left: -2, right: -2 }
'.-mx-1.5': { left: -6, right: -6 }
'.-mx-2.5': { left: -10, right: -10 }
'.-mx-3.5': { left: -14, right: -14 }
'.-mx-1/2': { left: '-50%', right: '-50%' }
'.-mx-1/3': { left: '-33.333334%', right: '-33.333334%' }
'.-mx-2/3': { left: '-66.666667%', right: '-66.666667%' }
'.-mx-1/4': { left: '-25%', right: '-25%' }
'.-mx-2/4': { left: '-50%', right: '-50%' }
'.-mx-3/4': { left: '-75%', right: '-75%' }
'.-mx-1/5': { left: '-20%', right: '-20%' }
'.-mx-2/5': { left: '-40%', right: '-40%' }
'.-mx-3/5': { left: '-60%', right: '-60%' }
'.-mx-4/5': { left: '-80%', right: '-80%' }
'.-mx-1/6': { left: '-16.666667%', right: '-16.666667%' }
'.-mx-2/6': { left: '-33.333334%', right: '-33.333334%' }
'.-mx-3/6': { left: '-50%', right: '-50%' }
'.-mx-4/6': { left: '-66.666667%', right: '-66.666667%' }
'.-mx-5/6': { left: '-83.333334%', right: '-83.333334%' }
'.-mx-1/12': { left: '-8.333334%', right: '-8.333334%' }
'.-mx-2/12': { left: '-16.666667%', right: '-16.666667%' }
'.-mx-3/12': { left: '-25%', right: '-25%' }
'.-mx-4/12': { left: '-33.333334%', right: '-33.333334%' }
'.-mx-5/12': { left: '-41.666667%', right: '-41.666667%' }
'.-mx-6/12': { left: '-50%', right: '-50%' }
'.-mx-7/12': { left: '-58.333334%', right: '-58.333334%' }
'.-mx-8/12': { left: '-66.666667%', right: '-66.666667%' }
'.-mx-9/12': { left: '-75%', right: '-75%' }
'.-mx-10/12': { left: '-83.333334%', right: '-83.333334%' }
'.-mx-11/12': { left: '-91.666667%', right: '-91.666667%' }
'.-mx-full': { left: '-100%', right: '-100%' }
'.-mt-1': { top: -4 }
'.-mt-2': { top: -8 }
'.-mt-3': { top: -12 }
'.-mt-4': { top: -16 }
'.-mt-5': { top: -20 }
'.-mt-6': { top: -24 }
'.-mt-7': { top: -28 }
'.-mt-8': { top: -32 }
'.-mt-9': { top: -36 }
'.-mt-10': { top: -40 }
'.-mt-11': { top: -44 }
'.-mt-12': { top: -48 }
'.-mt-13': { top: -52 }
'.-mt-14': { top: -56 }
'.-mt-15': { top: -60 }
'.-mt-16': { top: -64 }
'.-mt-20': { top: -80 }
'.-mt-24': { top: -96 }
'.-mt-28': { top: -112 }
'.-mt-32': { top: -128 }
'.-mt-36': { top: -144 }
'.-mt-40': { top: -160 }
'.-mt-44': { top: -176 }
'.-mt-48': { top: -192 }
'.-mt-52': { top: -208 }
'.-mt-56': { top: -224 }
'.-mt-60': { top: -240 }
'.-mt-64': { top: -256 }
'.-mt-72': { top: -288 }
'.-mt-80': { top: -320 }
'.-mt-96': { top: -384 }
'.-mt-px': { top: '-1px' }
'.-mt-0.5': { top: -2 }
'.-mt-1.5': { top: -6 }
'.-mt-2.5': { top: -10 }
'.-mt-3.5': { top: -14 }
'.-mt-1/2': { top: '-50%' }
'.-mt-1/3': { top: '-33.333334%' }
'.-mt-2/3': { top: '-66.666667%' }
'.-mt-1/4': { top: '-25%' }
'.-mt-2/4': { top: '-50%' }
'.-mt-3/4': { top: '-75%' }
'.-mt-1/5': { top: '-20%' }
'.-mt-2/5': { top: '-40%' }
'.-mt-3/5': { top: '-60%' }
'.-mt-4/5': { top: '-80%' }
'.-mt-1/6': { top: '-16.666667%' }
'.-mt-2/6': { top: '-33.333334%' }
'.-mt-3/6': { top: '-50%' }
'.-mt-4/6': { top: '-66.666667%' }
'.-mt-5/6': { top: '-83.333334%' }
'.-mt-1/12': { top: '-8.333334%' }
'.-mt-2/12': { top: '-16.666667%' }
'.-mt-3/12': { top: '-25%' }
'.-mt-4/12': { top: '-33.333334%' }
'.-mt-5/12': { top: '-41.666667%' }
'.-mt-6/12': { top: '-50%' }
'.-mt-7/12': { top: '-58.333334%' }
'.-mt-8/12': { top: '-66.666667%' }
'.-mt-9/12': { top: '-75%' }
'.-mt-10/12': { top: '-83.333334%' }
'.-mt-11/12': { top: '-91.666667%' }
'.-mt-full': { top: '-100%' }
'.-mr-1': { right: -4 }
'.-mr-2': { right: -8 }
'.-mr-3': { right: -12 }
'.-mr-4': { right: -16 }
'.-mr-5': { right: -20 }
'.-mr-6': { right: -24 }
'.-mr-7': { right: -28 }
'.-mr-8': { right: -32 }
'.-mr-9': { right: -36 }
'.-mr-10': { right: -40 }
'.-mr-11': { right: -44 }
'.-mr-12': { right: -48 }
'.-mr-13': { right: -52 }
'.-mr-14': { right: -56 }
'.-mr-15': { right: -60 }
'.-mr-16': { right: -64 }
'.-mr-20': { right: -80 }
'.-mr-24': { right: -96 }
'.-mr-28': { right: -112 }
'.-mr-32': { right: -128 }
'.-mr-36': { right: -144 }
'.-mr-40': { right: -160 }
'.-mr-44': { right: -176 }
'.-mr-48': { right: -192 }
'.-mr-52': { right: -208 }
'.-mr-56': { right: -224 }
'.-mr-60': { right: -240 }
'.-mr-64': { right: -256 }
'.-mr-72': { right: -288 }
'.-mr-80': { right: -320 }
'.-mr-96': { right: -384 }
'.-mr-px': { right: '-1px' }
'.-mr-0.5': { right: -2 }
'.-mr-1.5': { right: -6 }
'.-mr-2.5': { right: -10 }
'.-mr-3.5': { right: -14 }
'.-mr-1/2': { right: '-50%' }
'.-mr-1/3': { right: '-33.333334%' }
'.-mr-2/3': { right: '-66.666667%' }
'.-mr-1/4': { right: '-25%' }
'.-mr-2/4': { right: '-50%' }
'.-mr-3/4': { right: '-75%' }
'.-mr-1/5': { right: '-20%' }
'.-mr-2/5': { right: '-40%' }
'.-mr-3/5': { right: '-60%' }
'.-mr-4/5': { right: '-80%' }
'.-mr-1/6': { right: '-16.666667%' }
'.-mr-2/6': { right: '-33.333334%' }
'.-mr-3/6': { right: '-50%' }
'.-mr-4/6': { right: '-66.666667%' }
'.-mr-5/6': { right: '-83.333334%' }
'.-mr-1/12': { right: '-8.333334%' }
'.-mr-2/12': { right: '-16.666667%' }
'.-mr-3/12': { right: '-25%' }
'.-mr-4/12': { right: '-33.333334%' }
'.-mr-5/12': { right: '-41.666667%' }
'.-mr-6/12': { right: '-50%' }
'.-mr-7/12': { right: '-58.333334%' }
'.-mr-8/12': { right: '-66.666667%' }
'.-mr-9/12': { right: '-75%' }
'.-mr-10/12': { right: '-83.333334%' }
'.-mr-11/12': { right: '-91.666667%' }
'.-mr-full': { right: '-100%' }
'.-mb-1': { bottom: -4 }
'.-mb-2': { bottom: -8 }
'.-mb-3': { bottom: -12 }
'.-mb-4': { bottom: -16 }
'.-mb-5': { bottom: -20 }
'.-mb-6': { bottom: -24 }
'.-mb-7': { bottom: -28 }
'.-mb-8': { bottom: -32 }
'.-mb-9': { bottom: -36 }
'.-mb-10': { bottom: -40 }
'.-mb-11': { bottom: -44 }
'.-mb-12': { bottom: -48 }
'.-mb-13': { bottom: -52 }
'.-mb-14': { bottom: -56 }
'.-mb-15': { bottom: -60 }
'.-mb-16': { bottom: -64 }
'.-mb-20': { bottom: -80 }
'.-mb-24': { bottom: -96 }
'.-mb-28': { bottom: -112 }
'.-mb-32': { bottom: -128 }
'.-mb-36': { bottom: -144 }
'.-mb-40': { bottom: -160 }
'.-mb-44': { bottom: -176 }
'.-mb-48': { bottom: -192 }
'.-mb-52': { bottom: -208 }
'.-mb-56': { bottom: -224 }
'.-mb-60': { bottom: -240 }
'.-mb-64': { bottom: -256 }
'.-mb-72': { bottom: -288 }
'.-mb-80': { bottom: -320 }
'.-mb-96': { bottom: -384 }
'.-mb-px': { bottom: '-1px' }
'.-mb-0.5': { bottom: -2 }
'.-mb-1.5': { bottom: -6 }
'.-mb-2.5': { bottom: -10 }
'.-mb-3.5': { bottom: -14 }
'.-mb-1/2': { bottom: '-50%' }
'.-mb-1/3': { bottom: '-33.333334%' }
'.-mb-2/3': { bottom: '-66.666667%' }
'.-mb-1/4': { bottom: '-25%' }
'.-mb-2/4': { bottom: '-50%' }
'.-mb-3/4': { bottom: '-75%' }
'.-mb-1/5': { bottom: '-20%' }
'.-mb-2/5': { bottom: '-40%' }
'.-mb-3/5': { bottom: '-60%' }
'.-mb-4/5': { bottom: '-80%' }
'.-mb-1/6': { bottom: '-16.666667%' }
'.-mb-2/6': { bottom: '-33.333334%' }
'.-mb-3/6': { bottom: '-50%' }
'.-mb-4/6': { bottom: '-66.666667%' }
'.-mb-5/6': { bottom: '-83.333334%' }
'.-mb-1/12': { bottom: '-8.333334%' }
'.-mb-2/12': { bottom: '-16.666667%' }
'.-mb-3/12': { bottom: '-25%' }
'.-mb-4/12': { bottom: '-33.333334%' }
'.-mb-5/12': { bottom: '-41.666667%' }
'.-mb-6/12': { bottom: '-50%' }
'.-mb-7/12': { bottom: '-58.333334%' }
'.-mb-8/12': { bottom: '-66.666667%' }
'.-mb-9/12': { bottom: '-75%' }
'.-mb-10/12': { bottom: '-83.333334%' }
'.-mb-11/12': { bottom: '-91.666667%' }
'.-mb-full': { bottom: '-100%' }
'.-ml-1': { left: -4 }
'.-ml-2': { left: -8 }
'.-ml-3': { left: -12 }
'.-ml-4': { left: -16 }
'.-ml-5': { left: -20 }
'.-ml-6': { left: -24 }
'.-ml-7': { left: -28 }
'.-ml-8': { left: -32 }
'.-ml-9': { left: -36 }
'.-ml-10': { left: -40 }
'.-ml-11': { left: -44 }
'.-ml-12': { left: -48 }
'.-ml-13': { left: -52 }
'.-ml-14': { left: -56 }
'.-ml-15': { left: -60 }
'.-ml-16': { left: -64 }
'.-ml-20': { left: -80 }
'.-ml-24': { left: -96 }
'.-ml-28': { left: -112 }
'.-ml-32': { left: -128 }
'.-ml-36': { left: -144 }
'.-ml-40': { left: -160 }
'.-ml-44': { left: -176 }
'.-ml-48': { left: -192 }
'.-ml-52': { left: -208 }
'.-ml-56': { left: -224 }
'.-ml-60': { left: -240 }
'.-ml-64': { left: -256 }
'.-ml-72': { left: -288 }
'.-ml-80': { left: -320 }
'.-ml-96': { left: -384 }
'.-ml-px': { left: '-1px' }
'.-ml-0.5': { left: -2 }
'.-ml-1.5': { left: -6 }
'.-ml-2.5': { left: -10 }
'.-ml-3.5': { left: -14 }
'.-ml-1/2': { left: '-50%' }
'.-ml-1/3': { left: '-33.333334%' }
'.-ml-2/3': { left: '-66.666667%' }
'.-ml-1/4': { left: '-25%' }
'.-ml-2/4': { left: '-50%' }
'.-ml-3/4': { left: '-75%' }
'.-ml-1/5': { left: '-20%' }
'.-ml-2/5': { left: '-40%' }
'.-ml-3/5': { left: '-60%' }
'.-ml-4/5': { left: '-80%' }
'.-ml-1/6': { left: '-16.666667%' }
'.-ml-2/6': { left: '-33.333334%' }
'.-ml-3/6': { left: '-50%' }
'.-ml-4/6': { left: '-66.666667%' }
'.-ml-5/6': { left: '-83.333334%' }
'.-ml-1/12': { left: '-8.333334%' }
'.-ml-2/12': { left: '-16.666667%' }
'.-ml-3/12': { left: '-25%' }
'.-ml-4/12': { left: '-33.333334%' }
'.-ml-5/12': { left: '-41.666667%' }
'.-ml-6/12': { left: '-50%' }
'.-ml-7/12': { left: '-58.333334%' }
'.-ml-8/12': { left: '-66.666667%' }
'.-ml-9/12': { left: '-75%' }
'.-ml-10/12': { left: '-83.333334%' }
'.-ml-11/12': { left: '-91.666667%' }
'.-ml-full': { left: '-100%' }
```

##
```css
'.nav-tint-transparent': { navTintColor: 'transparent' }
'.nav-tint-black': { navTintColor: '#000000' }
'.nav-tint-white': { navTintColor: '#ffffff' }
'.nav-tint-rose-50': { navTintColor: '#fff1f2' }
'.nav-tint-rose-100': { navTintColor: '#ffe4e6' }
'.nav-tint-rose-200': { navTintColor: '#fecdd3' }
'.nav-tint-rose-300': { navTintColor: '#fda4af' }
'.nav-tint-rose-400': { navTintColor: '#fb7185' }
'.nav-tint-rose-500': { navTintColor: '#f43f5e' }
'.nav-tint-rose-600': { navTintColor: '#e11d48' }
'.nav-tint-rose-700': { navTintColor: '#be123c' }
'.nav-tint-rose-800': { navTintColor: '#9f1239' }
'.nav-tint-rose-900': { navTintColor: '#881337' }
'.nav-tint-pink-50': { navTintColor: '#fdf2f8' }
'.nav-tint-pink-100': { navTintColor: '#fce7f3' }
'.nav-tint-pink-200': { navTintColor: '#fbcfe8' }
'.nav-tint-pink-300': { navTintColor: '#f9a8d4' }
'.nav-tint-pink-400': { navTintColor: '#f472b6' }
'.nav-tint-pink-500': { navTintColor: '#ec4899' }
'.nav-tint-pink-600': { navTintColor: '#db2777' }
'.nav-tint-pink-700': { navTintColor: '#be185d' }
'.nav-tint-pink-800': { navTintColor: '#9d174d' }
'.nav-tint-pink-900': { navTintColor: '#831843' }
'.nav-tint-fuchsia-50': { navTintColor: '#fdf4ff' }
'.nav-tint-fuchsia-100': { navTintColor: '#fae8ff' }
'.nav-tint-fuchsia-200': { navTintColor: '#f5d0fe' }
'.nav-tint-fuchsia-300': { navTintColor: '#f0abfc' }
'.nav-tint-fuchsia-400': { navTintColor: '#e879f9' }
'.nav-tint-fuchsia-500': { navTintColor: '#d946ef' }
'.nav-tint-fuchsia-600': { navTintColor: '#c026d3' }
'.nav-tint-fuchsia-700': { navTintColor: '#a21caf' }
'.nav-tint-fuchsia-800': { navTintColor: '#86198f' }
'.nav-tint-fuchsia-900': { navTintColor: '#701a75' }
'.nav-tint-purple-50': { navTintColor: '#faf5ff' }
'.nav-tint-purple-100': { navTintColor: '#f3e8ff' }
'.nav-tint-purple-200': { navTintColor: '#e9d5ff' }
'.nav-tint-purple-300': { navTintColor: '#d8b4fe' }
'.nav-tint-purple-400': { navTintColor: '#c084fc' }
'.nav-tint-purple-500': { navTintColor: '#a855f7' }
'.nav-tint-purple-600': { navTintColor: '#9333ea' }
'.nav-tint-purple-700': { navTintColor: '#7e22ce' }
'.nav-tint-purple-800': { navTintColor: '#6b21a8' }
'.nav-tint-purple-900': { navTintColor: '#581c87' }
'.nav-tint-violet-50': { navTintColor: '#f5f3ff' }
'.nav-tint-violet-100': { navTintColor: '#ede9fe' }
'.nav-tint-violet-200': { navTintColor: '#ddd6fe' }
'.nav-tint-violet-300': { navTintColor: '#c4b5fd' }
'.nav-tint-violet-400': { navTintColor: '#a78bfa' }
'.nav-tint-violet-500': { navTintColor: '#8b5cf6' }
'.nav-tint-violet-600': { navTintColor: '#7c3aed' }
'.nav-tint-violet-700': { navTintColor: '#6d28d9' }
'.nav-tint-violet-800': { navTintColor: '#5b21b6' }
'.nav-tint-violet-900': { navTintColor: '#4c1d95' }
'.nav-tint-indigo-50': { navTintColor: '#eef2ff' }
'.nav-tint-indigo-100': { navTintColor: '#e0e7ff' }
'.nav-tint-indigo-200': { navTintColor: '#c7d2fe' }
'.nav-tint-indigo-300': { navTintColor: '#a5b4fc' }
'.nav-tint-indigo-400': { navTintColor: '#818cf8' }
'.nav-tint-indigo-500': { navTintColor: '#6366f1' }
'.nav-tint-indigo-600': { navTintColor: '#4f46e5' }
'.nav-tint-indigo-700': { navTintColor: '#4338ca' }
'.nav-tint-indigo-800': { navTintColor: '#3730a3' }
'.nav-tint-indigo-900': { navTintColor: '#312e81' }
'.nav-tint-blue-50': { navTintColor: '#eff6ff' }
'.nav-tint-blue-100': { navTintColor: '#dbeafe' }
'.nav-tint-blue-200': { navTintColor: '#bfdbfe' }
'.nav-tint-blue-300': { navTintColor: '#93c5fd' }
'.nav-tint-blue-400': { navTintColor: '#60a5fa' }
'.nav-tint-blue-500': { navTintColor: '#3b82f6' }
'.nav-tint-blue-600': { navTintColor: '#2563eb' }
'.nav-tint-blue-700': { navTintColor: '#1d4ed8' }
'.nav-tint-blue-800': { navTintColor: '#1e40af' }
'.nav-tint-blue-900': { navTintColor: '#1e3a8a' }
'.nav-tint-sky-50': { navTintColor: '#f0f9ff' }
'.nav-tint-sky-100': { navTintColor: '#e0f2fe' }
'.nav-tint-sky-200': { navTintColor: '#bae6fd' }
'.nav-tint-sky-300': { navTintColor: '#7dd3fc' }
'.nav-tint-sky-400': { navTintColor: '#38bdf8' }
'.nav-tint-sky-500': { navTintColor: '#0ea5e9' }
'.nav-tint-sky-600': { navTintColor: '#0284c7' }
'.nav-tint-sky-700': { navTintColor: '#0369a1' }
'.nav-tint-sky-800': { navTintColor: '#075985' }
'.nav-tint-sky-900': { navTintColor: '#0c4a6e' }
'.nav-tint-cyan-50': { navTintColor: '#ecfeff' }
'.nav-tint-cyan-100': { navTintColor: '#cffafe' }
'.nav-tint-cyan-200': { navTintColor: '#a5f3fc' }
'.nav-tint-cyan-300': { navTintColor: '#67e8f9' }
'.nav-tint-cyan-400': { navTintColor: '#22d3ee' }
'.nav-tint-cyan-500': { navTintColor: '#06b6d4' }
'.nav-tint-cyan-600': { navTintColor: '#0891b2' }
'.nav-tint-cyan-700': { navTintColor: '#0e7490' }
'.nav-tint-cyan-800': { navTintColor: '#155e75' }
'.nav-tint-cyan-900': { navTintColor: '#164e63' }
'.nav-tint-teal-50': { navTintColor: '#f0fdfa' }
'.nav-tint-teal-100': { navTintColor: '#ccfbf1' }
'.nav-tint-teal-200': { navTintColor: '#99f6e4' }
'.nav-tint-teal-300': { navTintColor: '#5eead4' }
'.nav-tint-teal-400': { navTintColor: '#2dd4bf' }
'.nav-tint-teal-500': { navTintColor: '#14b8a6' }
'.nav-tint-teal-600': { navTintColor: '#0d9488' }
'.nav-tint-teal-700': { navTintColor: '#0f766e' }
'.nav-tint-teal-800': { navTintColor: '#115e59' }
'.nav-tint-teal-900': { navTintColor: '#134e4a' }
'.nav-tint-emerald-50': { navTintColor: '#ecfdf5' }
'.nav-tint-emerald-100': { navTintColor: '#d1fae5' }
'.nav-tint-emerald-200': { navTintColor: '#a7f3d0' }
'.nav-tint-emerald-300': { navTintColor: '#6ee7b7' }
'.nav-tint-emerald-400': { navTintColor: '#34d399' }
'.nav-tint-emerald-500': { navTintColor: '#10b981' }
'.nav-tint-emerald-600': { navTintColor: '#059669' }
'.nav-tint-emerald-700': { navTintColor: '#047857' }
'.nav-tint-emerald-800': { navTintColor: '#065f46' }
'.nav-tint-emerald-900': { navTintColor: '#064e3b' }
'.nav-tint-green-50': { navTintColor: '#f0fdf4' }
'.nav-tint-green-100': { navTintColor: '#dcfce7' }
'.nav-tint-green-200': { navTintColor: '#bbf7d0' }
'.nav-tint-green-300': { navTintColor: '#86efac' }
'.nav-tint-green-400': { navTintColor: '#4ade80' }
'.nav-tint-green-500': { navTintColor: '#22c55e' }
'.nav-tint-green-600': { navTintColor: '#16a34a' }
'.nav-tint-green-700': { navTintColor: '#15803d' }
'.nav-tint-green-800': { navTintColor: '#166534' }
'.nav-tint-green-900': { navTintColor: '#14532d' }
'.nav-tint-lime-50': { navTintColor: '#f7fee7' }
'.nav-tint-lime-100': { navTintColor: '#ecfccb' }
'.nav-tint-lime-200': { navTintColor: '#d9f99d' }
'.nav-tint-lime-300': { navTintColor: '#bef264' }
'.nav-tint-lime-400': { navTintColor: '#a3e635' }
'.nav-tint-lime-500': { navTintColor: '#84cc16' }
'.nav-tint-lime-600': { navTintColor: '#65a30d' }
'.nav-tint-lime-700': { navTintColor: '#4d7c0f' }
'.nav-tint-lime-800': { navTintColor: '#3f6212' }
'.nav-tint-lime-900': { navTintColor: '#365314' }
'.nav-tint-yellow-50': { navTintColor: '#fefce8' }
'.nav-tint-yellow-100': { navTintColor: '#fef9c3' }
'.nav-tint-yellow-200': { navTintColor: '#fef08a' }
'.nav-tint-yellow-300': { navTintColor: '#fde047' }
'.nav-tint-yellow-400': { navTintColor: '#facc15' }
'.nav-tint-yellow-500': { navTintColor: '#eab308' }
'.nav-tint-yellow-600': { navTintColor: '#ca8a04' }
'.nav-tint-yellow-700': { navTintColor: '#a16207' }
'.nav-tint-yellow-800': { navTintColor: '#854d0e' }
'.nav-tint-yellow-900': { navTintColor: '#713f12' }
'.nav-tint-amber-50': { navTintColor: '#fffbeb' }
'.nav-tint-amber-100': { navTintColor: '#fef3c7' }
'.nav-tint-amber-200': { navTintColor: '#fde68a' }
'.nav-tint-amber-300': { navTintColor: '#fcd34d' }
'.nav-tint-amber-400': { navTintColor: '#fbbf24' }
'.nav-tint-amber-500': { navTintColor: '#f59e0b' }
'.nav-tint-amber-600': { navTintColor: '#d97706' }
'.nav-tint-amber-700': { navTintColor: '#b45309' }
'.nav-tint-amber-800': { navTintColor: '#92400e' }
'.nav-tint-amber-900': { navTintColor: '#78350f' }
'.nav-tint-orange-50': { navTintColor: '#fff7ed' }
'.nav-tint-orange-100': { navTintColor: '#ffedd5' }
'.nav-tint-orange-200': { navTintColor: '#fed7aa' }
'.nav-tint-orange-300': { navTintColor: '#fdba74' }
'.nav-tint-orange-400': { navTintColor: '#fb923c' }
'.nav-tint-orange-500': { navTintColor: '#f97316' }
'.nav-tint-orange-600': { navTintColor: '#ea580c' }
'.nav-tint-orange-700': { navTintColor: '#c2410c' }
'.nav-tint-orange-800': { navTintColor: '#9a3412' }
'.nav-tint-orange-900': { navTintColor: '#7c2d12' }
'.nav-tint-red-50': { navTintColor: '#fef2f2' }
'.nav-tint-red-100': { navTintColor: '#fee2e2' }
'.nav-tint-red-200': { navTintColor: '#fecaca' }
'.nav-tint-red-300': { navTintColor: '#fca5a5' }
'.nav-tint-red-400': { navTintColor: '#f87171' }
'.nav-tint-red-500': { navTintColor: '#ef4444' }
'.nav-tint-red-600': { navTintColor: '#dc2626' }
'.nav-tint-red-700': { navTintColor: '#b91c1c' }
'.nav-tint-red-800': { navTintColor: '#991b1b' }
'.nav-tint-red-900': { navTintColor: '#7f1d1d' }
'.nav-tint-warmGray-50': { navTintColor: '#fafaf9' }
'.nav-tint-warmGray-100': { navTintColor: '#f5f5f4' }
'.nav-tint-warmGray-200': { navTintColor: '#e7e5e4' }
'.nav-tint-warmGray-300': { navTintColor: '#d6d3d1' }
'.nav-tint-warmGray-400': { navTintColor: '#a8a29e' }
'.nav-tint-warmGray-500': { navTintColor: '#78716c' }
'.nav-tint-warmGray-600': { navTintColor: '#57534e' }
'.nav-tint-warmGray-700': { navTintColor: '#44403c' }
'.nav-tint-warmGray-800': { navTintColor: '#292524' }
'.nav-tint-warmGray-900': { navTintColor: '#1c1917' }
'.nav-tint-trueGray-50': { navTintColor: '#fafafa' }
'.nav-tint-trueGray-100': { navTintColor: '#f5f5f5' }
'.nav-tint-trueGray-200': { navTintColor: '#e5e5e5' }
'.nav-tint-trueGray-300': { navTintColor: '#d4d4d4' }
'.nav-tint-trueGray-400': { navTintColor: '#a3a3a3' }
'.nav-tint-trueGray-500': { navTintColor: '#737373' }
'.nav-tint-trueGray-600': { navTintColor: '#525252' }
'.nav-tint-trueGray-700': { navTintColor: '#404040' }
'.nav-tint-trueGray-800': { navTintColor: '#262626' }
'.nav-tint-trueGray-900': { navTintColor: '#171717' }
'.nav-tint-gray-50': { navTintColor: '#fafafa' }
'.nav-tint-gray-100': { navTintColor: '#f4f4f5' }
'.nav-tint-gray-200': { navTintColor: '#e4e4e7' }
'.nav-tint-gray-300': { navTintColor: '#d4d4d8' }
'.nav-tint-gray-400': { navTintColor: '#a1a1aa' }
'.nav-tint-gray-500': { navTintColor: '#71717a' }
'.nav-tint-gray-600': { navTintColor: '#52525b' }
'.nav-tint-gray-700': { navTintColor: '#3f3f46' }
'.nav-tint-gray-800': { navTintColor: '#27272a' }
'.nav-tint-gray-900': { navTintColor: '#18181b' }
'.nav-tint-coolGray-50': { navTintColor: '#f9fafb' }
'.nav-tint-coolGray-100': { navTintColor: '#f3f4f6' }
'.nav-tint-coolGray-200': { navTintColor: '#e5e7eb' }
'.nav-tint-coolGray-300': { navTintColor: '#d1d5db' }
'.nav-tint-coolGray-400': { navTintColor: '#9ca3af' }
'.nav-tint-coolGray-500': { navTintColor: '#6b7280' }
'.nav-tint-coolGray-600': { navTintColor: '#4b5563' }
'.nav-tint-coolGray-700': { navTintColor: '#374151' }
'.nav-tint-coolGray-800': { navTintColor: '#1f2937' }
'.nav-tint-coolGray-900': { navTintColor: '#111827' }
'.nav-tint-blueGray-50': { navTintColor: '#f8fafc' }
'.nav-tint-blueGray-100': { navTintColor: '#f1f5f9' }
'.nav-tint-blueGray-200': { navTintColor: '#e2e8f0' }
'.nav-tint-blueGray-300': { navTintColor: '#cbd5e1' }
'.nav-tint-blueGray-400': { navTintColor: '#94a3b8' }
'.nav-tint-blueGray-500': { navTintColor: '#64748b' }
'.nav-tint-blueGray-600': { navTintColor: '#475569' }
'.nav-tint-blueGray-700': { navTintColor: '#334155' }
'.nav-tint-blueGray-800': { navTintColor: '#1e293b' }
'.nav-tint-blueGray-900': { navTintColor: '#0f172a' }
```

## opacity Property
```css
'.opacity-0': { opacity: 0 }
'.opacity-5': { opacity: 0.05 }
'.opacity-10': { opacity: 0.1 }
'.opacity-20': { opacity: 0.2 }
'.opacity-25': { opacity: 0.25 }
'.opacity-30': { opacity: 0.3 }
'.opacity-40': { opacity: 0.4 }
'.opacity-50': { opacity: 0.5 }
'.opacity-60': { opacity: 0.6 }
'.opacity-70': { opacity: 0.7 }
'.opacity-75': { opacity: 0.75 }
'.opacity-80': { opacity: 0.8 }
'.opacity-90': { opacity: 0.9 }
'.opacity-95': { opacity: 0.95 }
'.opacity-100': { opacity: 1 }
```

## anchorPoint Properties
```css
'.origin-center': { anchorPoint: { x: 0.5, y: 0.5 } }
'.origin-top': { anchorPoint: { x: 0.5, y: 0 } }
'.origin-top-right': { anchorPoint: { x: 1, y: 0 } }
'.origin-right': { anchorPoint: { x: 0.5, y: 1 } }
'.origin-bottom-right': { anchorPoint: { x: 1, y: 1 } }
'.origin-bottom': { anchorPoint: { x: 0.5, y: 1 } }
'.origin-bottom-left': { anchorPoint: { x: 0, y: 1 } }
'.origin-left': { anchorPoint: { x: 0, y: 0.5 } }
'.origin-top-left': { anchorPoint: { x: 0, y: 0 } }
```

## overlayEnabled Property
```css
'.overlay-enabled[platform=ios]': { overlayEnabled: true }
'.overlay-disabled[platform=ios]': { overlayEnabled: false }
```

## padding Property
```css
'.p-0': { padding: { top: 0, right: 0, bottom: 0, left: 0 } }
'.p-1': { padding: { top: 4, right: 4, bottom: 4, left: 4 } }
'.p-2': { padding: { top: 8, right: 8, bottom: 8, left: 8 } }
'.p-3': { padding: { top: 12, right: 12, bottom: 12, left: 12 } }
'.p-4': { padding: { top: 16, right: 16, bottom: 16, left: 16 } }
'.p-5': { padding: { top: 20, right: 20, bottom: 20, left: 20 } }
'.p-6': { padding: { top: 24, right: 24, bottom: 24, left: 24 } }
'.p-7': { padding: { top: 28, right: 28, bottom: 28, left: 28 } }
'.p-8': { padding: { top: 32, right: 32, bottom: 32, left: 32 } }
'.p-9': { padding: { top: 36, right: 36, bottom: 36, left: 36 } }
'.p-10': { padding: { top: 40, right: 40, bottom: 40, left: 40 } }
'.p-11': { padding: { top: 44, right: 44, bottom: 44, left: 44 } }
'.p-12': { padding: { top: 48, right: 48, bottom: 48, left: 48 } }
'.p-13': { padding: { top: 52, right: 52, bottom: 52, left: 52 } }
'.p-14': { padding: { top: 56, right: 56, bottom: 56, left: 56 } }
'.p-15': { padding: { top: 60, right: 60, bottom: 60, left: 60 } }
'.p-16': { padding: { top: 64, right: 64, bottom: 64, left: 64 } }
'.p-20': { padding: { top: 80, right: 80, bottom: 80, left: 80 } }
'.p-24': { padding: { top: 96, right: 96, bottom: 96, left: 96 } }
'.p-28': { padding: { top: 112, right: 112, bottom: 112, left: 112 } }
'.p-32': { padding: { top: 128, right: 128, bottom: 128, left: 128 } }
'.p-36': { padding: { top: 144, right: 144, bottom: 144, left: 144 } }
'.p-40': { padding: { top: 160, right: 160, bottom: 160, left: 160 } }
'.p-44': { padding: { top: 176, right: 176, bottom: 176, left: 176 } }
'.p-48': { padding: { top: 192, right: 192, bottom: 192, left: 192 } }
'.p-52': { padding: { top: 208, right: 208, bottom: 208, left: 208 } }
'.p-56': { padding: { top: 224, right: 224, bottom: 224, left: 224 } }
'.p-60': { padding: { top: 240, right: 240, bottom: 240, left: 240 } }
'.p-64': { padding: { top: 256, right: 256, bottom: 256, left: 256 } }
'.p-72': { padding: { top: 288, right: 288, bottom: 288, left: 288 } }
'.p-80': { padding: { top: 320, right: 320, bottom: 320, left: 320 } }
'.p-96': { padding: { top: 384, right: 384, bottom: 384, left: 384 } }
'.p-px': { padding: { top: '1px', right: '1px', bottom: '1px', left: '1px' } }
'.p-0.5': { padding: { top: 2, right: 2, bottom: 2, left: 2 } }
'.p-1.5': { padding: { top: 6, right: 6, bottom: 6, left: 6 } }
'.p-2.5': { padding: { top: 10, right: 10, bottom: 10, left: 10 } }
'.p-3.5': { padding: { top: 14, right: 14, bottom: 14, left: 14 } }
'.p-1/2': { padding: { top: '50%', right: '50%', bottom: '50%', left: '50%' } }
'.p-1/3': { padding: { top: '33.333334%', right: '33.333334%', bottom: '33.333334%', left: '33.333334%' } }
'.p-2/3': { padding: { top: '66.666667%', right: '66.666667%', bottom: '66.666667%', left: '66.666667%' } }
'.p-1/4': { padding: { top: '25%', right: '25%', bottom: '25%', left: '25%' } }
'.p-2/4': { padding: { top: '50%', right: '50%', bottom: '50%', left: '50%' } }
'.p-3/4': { padding: { top: '75%', right: '75%', bottom: '75%', left: '75%' } }
'.p-1/5': { padding: { top: '20%', right: '20%', bottom: '20%', left: '20%' } }
'.p-2/5': { padding: { top: '40%', right: '40%', bottom: '40%', left: '40%' } }
'.p-3/5': { padding: { top: '60%', right: '60%', bottom: '60%', left: '60%' } }
'.p-4/5': { padding: { top: '80%', right: '80%', bottom: '80%', left: '80%' } }
'.p-1/6': { padding: { top: '16.666667%', right: '16.666667%', bottom: '16.666667%', left: '16.666667%' } }
'.p-2/6': { padding: { top: '33.333334%', right: '33.333334%', bottom: '33.333334%', left: '33.333334%' } }
'.p-3/6': { padding: { top: '50%', right: '50%', bottom: '50%', left: '50%' } }
'.p-4/6': { padding: { top: '66.666667%', right: '66.666667%', bottom: '66.666667%', left: '66.666667%' } }
'.p-5/6': { padding: { top: '83.333334%', right: '83.333334%', bottom: '83.333334%', left: '83.333334%' } }
'.p-1/12': { padding: { top: '8.333334%', right: '8.333334%', bottom: '8.333334%', left: '8.333334%' } }
'.p-2/12': { padding: { top: '16.666667%', right: '16.666667%', bottom: '16.666667%', left: '16.666667%' } }
'.p-3/12': { padding: { top: '25%', right: '25%', bottom: '25%', left: '25%' } }
'.p-4/12': { padding: { top: '33.333334%', right: '33.333334%', bottom: '33.333334%', left: '33.333334%' } }
'.p-5/12': { padding: { top: '41.666667%', right: '41.666667%', bottom: '41.666667%', left: '41.666667%' } }
'.p-6/12': { padding: { top: '50%', right: '50%', bottom: '50%', left: '50%' } }
'.p-7/12': { padding: { top: '58.333334%', right: '58.333334%', bottom: '58.333334%', left: '58.333334%' } }
'.p-8/12': { padding: { top: '66.666667%', right: '66.666667%', bottom: '66.666667%', left: '66.666667%' } }
'.p-9/12': { padding: { top: '75%', right: '75%', bottom: '75%', left: '75%' } }
'.p-10/12': { padding: { top: '83.333334%', right: '83.333334%', bottom: '83.333334%', left: '83.333334%' } }
'.p-11/12': { padding: { top: '91.666667%', right: '91.666667%', bottom: '91.666667%', left: '91.666667%' } }
'.p-full': { padding: { top: '100%', right: '100%', bottom: '100%', left: '100%' } }
'.py-0': { padding: { top: 0, bottom: 0 } }
'.py-1': { padding: { top: 4, bottom: 4 } }
'.py-2': { padding: { top: 8, bottom: 8 } }
'.py-3': { padding: { top: 12, bottom: 12 } }
'.py-4': { padding: { top: 16, bottom: 16 } }
'.py-5': { padding: { top: 20, bottom: 20 } }
'.py-6': { padding: { top: 24, bottom: 24 } }
'.py-7': { padding: { top: 28, bottom: 28 } }
'.py-8': { padding: { top: 32, bottom: 32 } }
'.py-9': { padding: { top: 36, bottom: 36 } }
'.py-10': { padding: { top: 40, bottom: 40 } }
'.py-11': { padding: { top: 44, bottom: 44 } }
'.py-12': { padding: { top: 48, bottom: 48 } }
'.py-13': { padding: { top: 52, bottom: 52 } }
'.py-14': { padding: { top: 56, bottom: 56 } }
'.py-15': { padding: { top: 60, bottom: 60 } }
'.py-16': { padding: { top: 64, bottom: 64 } }
'.py-20': { padding: { top: 80, bottom: 80 } }
'.py-24': { padding: { top: 96, bottom: 96 } }
'.py-28': { padding: { top: 112, bottom: 112 } }
'.py-32': { padding: { top: 128, bottom: 128 } }
'.py-36': { padding: { top: 144, bottom: 144 } }
'.py-40': { padding: { top: 160, bottom: 160 } }
'.py-44': { padding: { top: 176, bottom: 176 } }
'.py-48': { padding: { top: 192, bottom: 192 } }
'.py-52': { padding: { top: 208, bottom: 208 } }
'.py-56': { padding: { top: 224, bottom: 224 } }
'.py-60': { padding: { top: 240, bottom: 240 } }
'.py-64': { padding: { top: 256, bottom: 256 } }
'.py-72': { padding: { top: 288, bottom: 288 } }
'.py-80': { padding: { top: 320, bottom: 320 } }
'.py-96': { padding: { top: 384, bottom: 384 } }
'.py-px': { padding: { top: '1px', bottom: '1px' } }
'.py-0.5': { padding: { top: 2, bottom: 2 } }
'.py-1.5': { padding: { top: 6, bottom: 6 } }
'.py-2.5': { padding: { top: 10, bottom: 10 } }
'.py-3.5': { padding: { top: 14, bottom: 14 } }
'.py-1/2': { padding: { top: '50%', bottom: '50%' } }
'.py-1/3': { padding: { top: '33.333334%', bottom: '33.333334%' } }
'.py-2/3': { padding: { top: '66.666667%', bottom: '66.666667%' } }
'.py-1/4': { padding: { top: '25%', bottom: '25%' } }
'.py-2/4': { padding: { top: '50%', bottom: '50%' } }
'.py-3/4': { padding: { top: '75%', bottom: '75%' } }
'.py-1/5': { padding: { top: '20%', bottom: '20%' } }
'.py-2/5': { padding: { top: '40%', bottom: '40%' } }
'.py-3/5': { padding: { top: '60%', bottom: '60%' } }
'.py-4/5': { padding: { top: '80%', bottom: '80%' } }
'.py-1/6': { padding: { top: '16.666667%', bottom: '16.666667%' } }
'.py-2/6': { padding: { top: '33.333334%', bottom: '33.333334%' } }
'.py-3/6': { padding: { top: '50%', bottom: '50%' } }
'.py-4/6': { padding: { top: '66.666667%', bottom: '66.666667%' } }
'.py-5/6': { padding: { top: '83.333334%', bottom: '83.333334%' } }
'.py-1/12': { padding: { top: '8.333334%', bottom: '8.333334%' } }
'.py-2/12': { padding: { top: '16.666667%', bottom: '16.666667%' } }
'.py-3/12': { padding: { top: '25%', bottom: '25%' } }
'.py-4/12': { padding: { top: '33.333334%', bottom: '33.333334%' } }
'.py-5/12': { padding: { top: '41.666667%', bottom: '41.666667%' } }
'.py-6/12': { padding: { top: '50%', bottom: '50%' } }
'.py-7/12': { padding: { top: '58.333334%', bottom: '58.333334%' } }
'.py-8/12': { padding: { top: '66.666667%', bottom: '66.666667%' } }
'.py-9/12': { padding: { top: '75%', bottom: '75%' } }
'.py-10/12': { padding: { top: '83.333334%', bottom: '83.333334%' } }
'.py-11/12': { padding: { top: '91.666667%', bottom: '91.666667%' } }
'.py-full': { padding: { top: '100%', bottom: '100%' } }
'.px-0': { padding: { right: 0, left: 0 } }
'.px-1': { padding: { right: 4, left: 4 } }
'.px-2': { padding: { right: 8, left: 8 } }
'.px-3': { padding: { right: 12, left: 12 } }
'.px-4': { padding: { right: 16, left: 16 } }
'.px-5': { padding: { right: 20, left: 20 } }
'.px-6': { padding: { right: 24, left: 24 } }
'.px-7': { padding: { right: 28, left: 28 } }
'.px-8': { padding: { right: 32, left: 32 } }
'.px-9': { padding: { right: 36, left: 36 } }
'.px-10': { padding: { right: 40, left: 40 } }
'.px-11': { padding: { right: 44, left: 44 } }
'.px-12': { padding: { right: 48, left: 48 } }
'.px-13': { padding: { right: 52, left: 52 } }
'.px-14': { padding: { right: 56, left: 56 } }
'.px-15': { padding: { right: 60, left: 60 } }
'.px-16': { padding: { right: 64, left: 64 } }
'.px-20': { padding: { right: 80, left: 80 } }
'.px-24': { padding: { right: 96, left: 96 } }
'.px-28': { padding: { right: 112, left: 112 } }
'.px-32': { padding: { right: 128, left: 128 } }
'.px-36': { padding: { right: 144, left: 144 } }
'.px-40': { padding: { right: 160, left: 160 } }
'.px-44': { padding: { right: 176, left: 176 } }
'.px-48': { padding: { right: 192, left: 192 } }
'.px-52': { padding: { right: 208, left: 208 } }
'.px-56': { padding: { right: 224, left: 224 } }
'.px-60': { padding: { right: 240, left: 240 } }
'.px-64': { padding: { right: 256, left: 256 } }
'.px-72': { padding: { right: 288, left: 288 } }
'.px-80': { padding: { right: 320, left: 320 } }
'.px-96': { padding: { right: 384, left: 384 } }
'.px-px': { padding: { right: '1px', left: '1px' } }
'.px-0.5': { padding: { right: 2, left: 2 } }
'.px-1.5': { padding: { right: 6, left: 6 } }
'.px-2.5': { padding: { right: 10, left: 10 } }
'.px-3.5': { padding: { right: 14, left: 14 } }
'.px-1/2': { padding: { right: '50%', left: '50%' } }
'.px-1/3': { padding: { right: '33.333334%', left: '33.333334%' } }
'.px-2/3': { padding: { right: '66.666667%', left: '66.666667%' } }
'.px-1/4': { padding: { right: '25%', left: '25%' } }
'.px-2/4': { padding: { right: '50%', left: '50%' } }
'.px-3/4': { padding: { right: '75%', left: '75%' } }
'.px-1/5': { padding: { right: '20%', left: '20%' } }
'.px-2/5': { padding: { right: '40%', left: '40%' } }
'.px-3/5': { padding: { right: '60%', left: '60%' } }
'.px-4/5': { padding: { right: '80%', left: '80%' } }
'.px-1/6': { padding: { right: '16.666667%', left: '16.666667%' } }
'.px-2/6': { padding: { right: '33.333334%', left: '33.333334%' } }
'.px-3/6': { padding: { right: '50%', left: '50%' } }
'.px-4/6': { padding: { right: '66.666667%', left: '66.666667%' } }
'.px-5/6': { padding: { right: '83.333334%', left: '83.333334%' } }
'.px-1/12': { padding: { right: '8.333334%', left: '8.333334%' } }
'.px-2/12': { padding: { right: '16.666667%', left: '16.666667%' } }
'.px-3/12': { padding: { right: '25%', left: '25%' } }
'.px-4/12': { padding: { right: '33.333334%', left: '33.333334%' } }
'.px-5/12': { padding: { right: '41.666667%', left: '41.666667%' } }
'.px-6/12': { padding: { right: '50%', left: '50%' } }
'.px-7/12': { padding: { right: '58.333334%', left: '58.333334%' } }
'.px-8/12': { padding: { right: '66.666667%', left: '66.666667%' } }
'.px-9/12': { padding: { right: '75%', left: '75%' } }
'.px-10/12': { padding: { right: '83.333334%', left: '83.333334%' } }
'.px-11/12': { padding: { right: '91.666667%', left: '91.666667%' } }
'.px-full': { padding: { right: '100%', left: '100%' } }
'.pt-0': { padding: { top: 0 } }
'.pt-1': { padding: { top: 4 } }
'.pt-2': { padding: { top: 8 } }
'.pt-3': { padding: { top: 12 } }
'.pt-4': { padding: { top: 16 } }
'.pt-5': { padding: { top: 20 } }
'.pt-6': { padding: { top: 24 } }
'.pt-7': { padding: { top: 28 } }
'.pt-8': { padding: { top: 32 } }
'.pt-9': { padding: { top: 36 } }
'.pt-10': { padding: { top: 40 } }
'.pt-11': { padding: { top: 44 } }
'.pt-12': { padding: { top: 48 } }
'.pt-13': { padding: { top: 52 } }
'.pt-14': { padding: { top: 56 } }
'.pt-15': { padding: { top: 60 } }
'.pt-16': { padding: { top: 64 } }
'.pt-20': { padding: { top: 80 } }
'.pt-24': { padding: { top: 96 } }
'.pt-28': { padding: { top: 112 } }
'.pt-32': { padding: { top: 128 } }
'.pt-36': { padding: { top: 144 } }
'.pt-40': { padding: { top: 160 } }
'.pt-44': { padding: { top: 176 } }
'.pt-48': { padding: { top: 192 } }
'.pt-52': { padding: { top: 208 } }
'.pt-56': { padding: { top: 224 } }
'.pt-60': { padding: { top: 240 } }
'.pt-64': { padding: { top: 256 } }
'.pt-72': { padding: { top: 288 } }
'.pt-80': { padding: { top: 320 } }
'.pt-96': { padding: { top: 384 } }
'.pt-px': { padding: { top: '1px' } }
'.pt-0.5': { padding: { top: 2 } }
'.pt-1.5': { padding: { top: 6 } }
'.pt-2.5': { padding: { top: 10 } }
'.pt-3.5': { padding: { top: 14 } }
'.pt-1/2': { padding: { top: '50%' } }
'.pt-1/3': { padding: { top: '33.333334%' } }
'.pt-2/3': { padding: { top: '66.666667%' } }
'.pt-1/4': { padding: { top: '25%' } }
'.pt-2/4': { padding: { top: '50%' } }
'.pt-3/4': { padding: { top: '75%' } }
'.pt-1/5': { padding: { top: '20%' } }
'.pt-2/5': { padding: { top: '40%' } }
'.pt-3/5': { padding: { top: '60%' } }
'.pt-4/5': { padding: { top: '80%' } }
'.pt-1/6': { padding: { top: '16.666667%' } }
'.pt-2/6': { padding: { top: '33.333334%' } }
'.pt-3/6': { padding: { top: '50%' } }
'.pt-4/6': { padding: { top: '66.666667%' } }
'.pt-5/6': { padding: { top: '83.333334%' } }
'.pt-1/12': { padding: { top: '8.333334%' } }
'.pt-2/12': { padding: { top: '16.666667%' } }
'.pt-3/12': { padding: { top: '25%' } }
'.pt-4/12': { padding: { top: '33.333334%' } }
'.pt-5/12': { padding: { top: '41.666667%' } }
'.pt-6/12': { padding: { top: '50%' } }
'.pt-7/12': { padding: { top: '58.333334%' } }
'.pt-8/12': { padding: { top: '66.666667%' } }
'.pt-9/12': { padding: { top: '75%' } }
'.pt-10/12': { padding: { top: '83.333334%' } }
'.pt-11/12': { padding: { top: '91.666667%' } }
'.pt-full': { padding: { top: '100%' } }
'.pr-0': { padding: { right: 0 } }
'.pr-1': { padding: { right: 4 } }
'.pr-2': { padding: { right: 8 } }
'.pr-3': { padding: { right: 12 } }
'.pr-4': { padding: { right: 16 } }
'.pr-5': { padding: { right: 20 } }
'.pr-6': { padding: { right: 24 } }
'.pr-7': { padding: { right: 28 } }
'.pr-8': { padding: { right: 32 } }
'.pr-9': { padding: { right: 36 } }
'.pr-10': { padding: { right: 40 } }
'.pr-11': { padding: { right: 44 } }
'.pr-12': { padding: { right: 48 } }
'.pr-13': { padding: { right: 52 } }
'.pr-14': { padding: { right: 56 } }
'.pr-15': { padding: { right: 60 } }
'.pr-16': { padding: { right: 64 } }
'.pr-20': { padding: { right: 80 } }
'.pr-24': { padding: { right: 96 } }
'.pr-28': { padding: { right: 112 } }
'.pr-32': { padding: { right: 128 } }
'.pr-36': { padding: { right: 144 } }
'.pr-40': { padding: { right: 160 } }
'.pr-44': { padding: { right: 176 } }
'.pr-48': { padding: { right: 192 } }
'.pr-52': { padding: { right: 208 } }
'.pr-56': { padding: { right: 224 } }
'.pr-60': { padding: { right: 240 } }
'.pr-64': { padding: { right: 256 } }
'.pr-72': { padding: { right: 288 } }
'.pr-80': { padding: { right: 320 } }
'.pr-96': { padding: { right: 384 } }
'.pr-px': { padding: { right: '1px' } }
'.pr-0.5': { padding: { right: 2 } }
'.pr-1.5': { padding: { right: 6 } }
'.pr-2.5': { padding: { right: 10 } }
'.pr-3.5': { padding: { right: 14 } }
'.pr-1/2': { padding: { right: '50%' } }
'.pr-1/3': { padding: { right: '33.333334%' } }
'.pr-2/3': { padding: { right: '66.666667%' } }
'.pr-1/4': { padding: { right: '25%' } }
'.pr-2/4': { padding: { right: '50%' } }
'.pr-3/4': { padding: { right: '75%' } }
'.pr-1/5': { padding: { right: '20%' } }
'.pr-2/5': { padding: { right: '40%' } }
'.pr-3/5': { padding: { right: '60%' } }
'.pr-4/5': { padding: { right: '80%' } }
'.pr-1/6': { padding: { right: '16.666667%' } }
'.pr-2/6': { padding: { right: '33.333334%' } }
'.pr-3/6': { padding: { right: '50%' } }
'.pr-4/6': { padding: { right: '66.666667%' } }
'.pr-5/6': { padding: { right: '83.333334%' } }
'.pr-1/12': { padding: { right: '8.333334%' } }
'.pr-2/12': { padding: { right: '16.666667%' } }
'.pr-3/12': { padding: { right: '25%' } }
'.pr-4/12': { padding: { right: '33.333334%' } }
'.pr-5/12': { padding: { right: '41.666667%' } }
'.pr-6/12': { padding: { right: '50%' } }
'.pr-7/12': { padding: { right: '58.333334%' } }
'.pr-8/12': { padding: { right: '66.666667%' } }
'.pr-9/12': { padding: { right: '75%' } }
'.pr-10/12': { padding: { right: '83.333334%' } }
'.pr-11/12': { padding: { right: '91.666667%' } }
'.pr-full': { padding: { right: '100%' } }
'.pb-0': { padding: { bottom: 0 } }
'.pb-1': { padding: { bottom: 4 } }
'.pb-2': { padding: { bottom: 8 } }
'.pb-3': { padding: { bottom: 12 } }
'.pb-4': { padding: { bottom: 16 } }
'.pb-5': { padding: { bottom: 20 } }
'.pb-6': { padding: { bottom: 24 } }
'.pb-7': { padding: { bottom: 28 } }
'.pb-8': { padding: { bottom: 32 } }
'.pb-9': { padding: { bottom: 36 } }
'.pb-10': { padding: { bottom: 40 } }
'.pb-11': { padding: { bottom: 44 } }
'.pb-12': { padding: { bottom: 48 } }
'.pb-13': { padding: { bottom: 52 } }
'.pb-14': { padding: { bottom: 56 } }
'.pb-15': { padding: { bottom: 60 } }
'.pb-16': { padding: { bottom: 64 } }
'.pb-20': { padding: { bottom: 80 } }
'.pb-24': { padding: { bottom: 96 } }
'.pb-28': { padding: { bottom: 112 } }
'.pb-32': { padding: { bottom: 128 } }
'.pb-36': { padding: { bottom: 144 } }
'.pb-40': { padding: { bottom: 160 } }
'.pb-44': { padding: { bottom: 176 } }
'.pb-48': { padding: { bottom: 192 } }
'.pb-52': { padding: { bottom: 208 } }
'.pb-56': { padding: { bottom: 224 } }
'.pb-60': { padding: { bottom: 240 } }
'.pb-64': { padding: { bottom: 256 } }
'.pb-72': { padding: { bottom: 288 } }
'.pb-80': { padding: { bottom: 320 } }
'.pb-96': { padding: { bottom: 384 } }
'.pb-px': { padding: { bottom: '1px' } }
'.pb-0.5': { padding: { bottom: 2 } }
'.pb-1.5': { padding: { bottom: 6 } }
'.pb-2.5': { padding: { bottom: 10 } }
'.pb-3.5': { padding: { bottom: 14 } }
'.pb-1/2': { padding: { bottom: '50%' } }
'.pb-1/3': { padding: { bottom: '33.333334%' } }
'.pb-2/3': { padding: { bottom: '66.666667%' } }
'.pb-1/4': { padding: { bottom: '25%' } }
'.pb-2/4': { padding: { bottom: '50%' } }
'.pb-3/4': { padding: { bottom: '75%' } }
'.pb-1/5': { padding: { bottom: '20%' } }
'.pb-2/5': { padding: { bottom: '40%' } }
'.pb-3/5': { padding: { bottom: '60%' } }
'.pb-4/5': { padding: { bottom: '80%' } }
'.pb-1/6': { padding: { bottom: '16.666667%' } }
'.pb-2/6': { padding: { bottom: '33.333334%' } }
'.pb-3/6': { padding: { bottom: '50%' } }
'.pb-4/6': { padding: { bottom: '66.666667%' } }
'.pb-5/6': { padding: { bottom: '83.333334%' } }
'.pb-1/12': { padding: { bottom: '8.333334%' } }
'.pb-2/12': { padding: { bottom: '16.666667%' } }
'.pb-3/12': { padding: { bottom: '25%' } }
'.pb-4/12': { padding: { bottom: '33.333334%' } }
'.pb-5/12': { padding: { bottom: '41.666667%' } }
'.pb-6/12': { padding: { bottom: '50%' } }
'.pb-7/12': { padding: { bottom: '58.333334%' } }
'.pb-8/12': { padding: { bottom: '66.666667%' } }
'.pb-9/12': { padding: { bottom: '75%' } }
'.pb-10/12': { padding: { bottom: '83.333334%' } }
'.pb-11/12': { padding: { bottom: '91.666667%' } }
'.pb-full': { padding: { bottom: '100%' } }
'.pl-0': { padding: { left: 0 } }
'.pl-1': { padding: { left: 4 } }
'.pl-2': { padding: { left: 8 } }
'.pl-3': { padding: { left: 12 } }
'.pl-4': { padding: { left: 16 } }
'.pl-5': { padding: { left: 20 } }
'.pl-6': { padding: { left: 24 } }
'.pl-7': { padding: { left: 28 } }
'.pl-8': { padding: { left: 32 } }
'.pl-9': { padding: { left: 36 } }
'.pl-10': { padding: { left: 40 } }
'.pl-11': { padding: { left: 44 } }
'.pl-12': { padding: { left: 48 } }
'.pl-13': { padding: { left: 52 } }
'.pl-14': { padding: { left: 56 } }
'.pl-15': { padding: { left: 60 } }
'.pl-16': { padding: { left: 64 } }
'.pl-20': { padding: { left: 80 } }
'.pl-24': { padding: { left: 96 } }
'.pl-28': { padding: { left: 112 } }
'.pl-32': { padding: { left: 128 } }
'.pl-36': { padding: { left: 144 } }
'.pl-40': { padding: { left: 160 } }
'.pl-44': { padding: { left: 176 } }
'.pl-48': { padding: { left: 192 } }
'.pl-52': { padding: { left: 208 } }
'.pl-56': { padding: { left: 224 } }
'.pl-60': { padding: { left: 240 } }
'.pl-64': { padding: { left: 256 } }
'.pl-72': { padding: { left: 288 } }
'.pl-80': { padding: { left: 320 } }
'.pl-96': { padding: { left: 384 } }
'.pl-px': { padding: { left: '1px' } }
'.pl-0.5': { padding: { left: 2 } }
'.pl-1.5': { padding: { left: 6 } }
'.pl-2.5': { padding: { left: 10 } }
'.pl-3.5': { padding: { left: 14 } }
'.pl-1/2': { padding: { left: '50%' } }
'.pl-1/3': { padding: { left: '33.333334%' } }
'.pl-2/3': { padding: { left: '66.666667%' } }
'.pl-1/4': { padding: { left: '25%' } }
'.pl-2/4': { padding: { left: '50%' } }
'.pl-3/4': { padding: { left: '75%' } }
'.pl-1/5': { padding: { left: '20%' } }
'.pl-2/5': { padding: { left: '40%' } }
'.pl-3/5': { padding: { left: '60%' } }
'.pl-4/5': { padding: { left: '80%' } }
'.pl-1/6': { padding: { left: '16.666667%' } }
'.pl-2/6': { padding: { left: '33.333334%' } }
'.pl-3/6': { padding: { left: '50%' } }
'.pl-4/6': { padding: { left: '66.666667%' } }
'.pl-5/6': { padding: { left: '83.333334%' } }
'.pl-1/12': { padding: { left: '8.333334%' } }
'.pl-2/12': { padding: { left: '16.666667%' } }
'.pl-3/12': { padding: { left: '25%' } }
'.pl-4/12': { padding: { left: '33.333334%' } }
'.pl-5/12': { padding: { left: '41.666667%' } }
'.pl-6/12': { padding: { left: '50%' } }
'.pl-7/12': { padding: { left: '58.333334%' } }
'.pl-8/12': { padding: { left: '66.666667%' } }
'.pl-9/12': { padding: { left: '75%' } }
'.pl-10/12': { padding: { left: '83.333334%' } }
'.pl-11/12': { padding: { left: '91.666667%' } }
'.pl-full': { padding: { left: '100%' } }
```

## ScrollableView Properties
### pageIndicatorColor Property
```css
'.page-transparent': { pageIndicatorColor: 'transparent' }
'.page-black': { pageIndicatorColor: '#000000' }
'.page-white': { pageIndicatorColor: '#ffffff' }
'.page-rose-50': { pageIndicatorColor: '#fff1f2' }
'.page-rose-100': { pageIndicatorColor: '#ffe4e6' }
'.page-rose-200': { pageIndicatorColor: '#fecdd3' }
'.page-rose-300': { pageIndicatorColor: '#fda4af' }
'.page-rose-400': { pageIndicatorColor: '#fb7185' }
'.page-rose-500': { pageIndicatorColor: '#f43f5e' }
'.page-rose-600': { pageIndicatorColor: '#e11d48' }
'.page-rose-700': { pageIndicatorColor: '#be123c' }
'.page-rose-800': { pageIndicatorColor: '#9f1239' }
'.page-rose-900': { pageIndicatorColor: '#881337' }
'.page-pink-50': { pageIndicatorColor: '#fdf2f8' }
'.page-pink-100': { pageIndicatorColor: '#fce7f3' }
'.page-pink-200': { pageIndicatorColor: '#fbcfe8' }
'.page-pink-300': { pageIndicatorColor: '#f9a8d4' }
'.page-pink-400': { pageIndicatorColor: '#f472b6' }
'.page-pink-500': { pageIndicatorColor: '#ec4899' }
'.page-pink-600': { pageIndicatorColor: '#db2777' }
'.page-pink-700': { pageIndicatorColor: '#be185d' }
'.page-pink-800': { pageIndicatorColor: '#9d174d' }
'.page-pink-900': { pageIndicatorColor: '#831843' }
'.page-fuchsia-50': { pageIndicatorColor: '#fdf4ff' }
'.page-fuchsia-100': { pageIndicatorColor: '#fae8ff' }
'.page-fuchsia-200': { pageIndicatorColor: '#f5d0fe' }
'.page-fuchsia-300': { pageIndicatorColor: '#f0abfc' }
'.page-fuchsia-400': { pageIndicatorColor: '#e879f9' }
'.page-fuchsia-500': { pageIndicatorColor: '#d946ef' }
'.page-fuchsia-600': { pageIndicatorColor: '#c026d3' }
'.page-fuchsia-700': { pageIndicatorColor: '#a21caf' }
'.page-fuchsia-800': { pageIndicatorColor: '#86198f' }
'.page-fuchsia-900': { pageIndicatorColor: '#701a75' }
'.page-purple-50': { pageIndicatorColor: '#faf5ff' }
'.page-purple-100': { pageIndicatorColor: '#f3e8ff' }
'.page-purple-200': { pageIndicatorColor: '#e9d5ff' }
'.page-purple-300': { pageIndicatorColor: '#d8b4fe' }
'.page-purple-400': { pageIndicatorColor: '#c084fc' }
'.page-purple-500': { pageIndicatorColor: '#a855f7' }
'.page-purple-600': { pageIndicatorColor: '#9333ea' }
'.page-purple-700': { pageIndicatorColor: '#7e22ce' }
'.page-purple-800': { pageIndicatorColor: '#6b21a8' }
'.page-purple-900': { pageIndicatorColor: '#581c87' }
'.page-violet-50': { pageIndicatorColor: '#f5f3ff' }
'.page-violet-100': { pageIndicatorColor: '#ede9fe' }
'.page-violet-200': { pageIndicatorColor: '#ddd6fe' }
'.page-violet-300': { pageIndicatorColor: '#c4b5fd' }
'.page-violet-400': { pageIndicatorColor: '#a78bfa' }
'.page-violet-500': { pageIndicatorColor: '#8b5cf6' }
'.page-violet-600': { pageIndicatorColor: '#7c3aed' }
'.page-violet-700': { pageIndicatorColor: '#6d28d9' }
'.page-violet-800': { pageIndicatorColor: '#5b21b6' }
'.page-violet-900': { pageIndicatorColor: '#4c1d95' }
'.page-indigo-50': { pageIndicatorColor: '#eef2ff' }
'.page-indigo-100': { pageIndicatorColor: '#e0e7ff' }
'.page-indigo-200': { pageIndicatorColor: '#c7d2fe' }
'.page-indigo-300': { pageIndicatorColor: '#a5b4fc' }
'.page-indigo-400': { pageIndicatorColor: '#818cf8' }
'.page-indigo-500': { pageIndicatorColor: '#6366f1' }
'.page-indigo-600': { pageIndicatorColor: '#4f46e5' }
'.page-indigo-700': { pageIndicatorColor: '#4338ca' }
'.page-indigo-800': { pageIndicatorColor: '#3730a3' }
'.page-indigo-900': { pageIndicatorColor: '#312e81' }
'.page-blue-50': { pageIndicatorColor: '#eff6ff' }
'.page-blue-100': { pageIndicatorColor: '#dbeafe' }
'.page-blue-200': { pageIndicatorColor: '#bfdbfe' }
'.page-blue-300': { pageIndicatorColor: '#93c5fd' }
'.page-blue-400': { pageIndicatorColor: '#60a5fa' }
'.page-blue-500': { pageIndicatorColor: '#3b82f6' }
'.page-blue-600': { pageIndicatorColor: '#2563eb' }
'.page-blue-700': { pageIndicatorColor: '#1d4ed8' }
'.page-blue-800': { pageIndicatorColor: '#1e40af' }
'.page-blue-900': { pageIndicatorColor: '#1e3a8a' }
'.page-sky-50': { pageIndicatorColor: '#f0f9ff' }
'.page-sky-100': { pageIndicatorColor: '#e0f2fe' }
'.page-sky-200': { pageIndicatorColor: '#bae6fd' }
'.page-sky-300': { pageIndicatorColor: '#7dd3fc' }
'.page-sky-400': { pageIndicatorColor: '#38bdf8' }
'.page-sky-500': { pageIndicatorColor: '#0ea5e9' }
'.page-sky-600': { pageIndicatorColor: '#0284c7' }
'.page-sky-700': { pageIndicatorColor: '#0369a1' }
'.page-sky-800': { pageIndicatorColor: '#075985' }
'.page-sky-900': { pageIndicatorColor: '#0c4a6e' }
'.page-cyan-50': { pageIndicatorColor: '#ecfeff' }
'.page-cyan-100': { pageIndicatorColor: '#cffafe' }
'.page-cyan-200': { pageIndicatorColor: '#a5f3fc' }
'.page-cyan-300': { pageIndicatorColor: '#67e8f9' }
'.page-cyan-400': { pageIndicatorColor: '#22d3ee' }
'.page-cyan-500': { pageIndicatorColor: '#06b6d4' }
'.page-cyan-600': { pageIndicatorColor: '#0891b2' }
'.page-cyan-700': { pageIndicatorColor: '#0e7490' }
'.page-cyan-800': { pageIndicatorColor: '#155e75' }
'.page-cyan-900': { pageIndicatorColor: '#164e63' }
'.page-teal-50': { pageIndicatorColor: '#f0fdfa' }
'.page-teal-100': { pageIndicatorColor: '#ccfbf1' }
'.page-teal-200': { pageIndicatorColor: '#99f6e4' }
'.page-teal-300': { pageIndicatorColor: '#5eead4' }
'.page-teal-400': { pageIndicatorColor: '#2dd4bf' }
'.page-teal-500': { pageIndicatorColor: '#14b8a6' }
'.page-teal-600': { pageIndicatorColor: '#0d9488' }
'.page-teal-700': { pageIndicatorColor: '#0f766e' }
'.page-teal-800': { pageIndicatorColor: '#115e59' }
'.page-teal-900': { pageIndicatorColor: '#134e4a' }
'.page-emerald-50': { pageIndicatorColor: '#ecfdf5' }
'.page-emerald-100': { pageIndicatorColor: '#d1fae5' }
'.page-emerald-200': { pageIndicatorColor: '#a7f3d0' }
'.page-emerald-300': { pageIndicatorColor: '#6ee7b7' }
'.page-emerald-400': { pageIndicatorColor: '#34d399' }
'.page-emerald-500': { pageIndicatorColor: '#10b981' }
'.page-emerald-600': { pageIndicatorColor: '#059669' }
'.page-emerald-700': { pageIndicatorColor: '#047857' }
'.page-emerald-800': { pageIndicatorColor: '#065f46' }
'.page-emerald-900': { pageIndicatorColor: '#064e3b' }
'.page-green-50': { pageIndicatorColor: '#f0fdf4' }
'.page-green-100': { pageIndicatorColor: '#dcfce7' }
'.page-green-200': { pageIndicatorColor: '#bbf7d0' }
'.page-green-300': { pageIndicatorColor: '#86efac' }
'.page-green-400': { pageIndicatorColor: '#4ade80' }
'.page-green-500': { pageIndicatorColor: '#22c55e' }
'.page-green-600': { pageIndicatorColor: '#16a34a' }
'.page-green-700': { pageIndicatorColor: '#15803d' }
'.page-green-800': { pageIndicatorColor: '#166534' }
'.page-green-900': { pageIndicatorColor: '#14532d' }
'.page-lime-50': { pageIndicatorColor: '#f7fee7' }
'.page-lime-100': { pageIndicatorColor: '#ecfccb' }
'.page-lime-200': { pageIndicatorColor: '#d9f99d' }
'.page-lime-300': { pageIndicatorColor: '#bef264' }
'.page-lime-400': { pageIndicatorColor: '#a3e635' }
'.page-lime-500': { pageIndicatorColor: '#84cc16' }
'.page-lime-600': { pageIndicatorColor: '#65a30d' }
'.page-lime-700': { pageIndicatorColor: '#4d7c0f' }
'.page-lime-800': { pageIndicatorColor: '#3f6212' }
'.page-lime-900': { pageIndicatorColor: '#365314' }
'.page-yellow-50': { pageIndicatorColor: '#fefce8' }
'.page-yellow-100': { pageIndicatorColor: '#fef9c3' }
'.page-yellow-200': { pageIndicatorColor: '#fef08a' }
'.page-yellow-300': { pageIndicatorColor: '#fde047' }
'.page-yellow-400': { pageIndicatorColor: '#facc15' }
'.page-yellow-500': { pageIndicatorColor: '#eab308' }
'.page-yellow-600': { pageIndicatorColor: '#ca8a04' }
'.page-yellow-700': { pageIndicatorColor: '#a16207' }
'.page-yellow-800': { pageIndicatorColor: '#854d0e' }
'.page-yellow-900': { pageIndicatorColor: '#713f12' }
'.page-amber-50': { pageIndicatorColor: '#fffbeb' }
'.page-amber-100': { pageIndicatorColor: '#fef3c7' }
'.page-amber-200': { pageIndicatorColor: '#fde68a' }
'.page-amber-300': { pageIndicatorColor: '#fcd34d' }
'.page-amber-400': { pageIndicatorColor: '#fbbf24' }
'.page-amber-500': { pageIndicatorColor: '#f59e0b' }
'.page-amber-600': { pageIndicatorColor: '#d97706' }
'.page-amber-700': { pageIndicatorColor: '#b45309' }
'.page-amber-800': { pageIndicatorColor: '#92400e' }
'.page-amber-900': { pageIndicatorColor: '#78350f' }
'.page-orange-50': { pageIndicatorColor: '#fff7ed' }
'.page-orange-100': { pageIndicatorColor: '#ffedd5' }
'.page-orange-200': { pageIndicatorColor: '#fed7aa' }
'.page-orange-300': { pageIndicatorColor: '#fdba74' }
'.page-orange-400': { pageIndicatorColor: '#fb923c' }
'.page-orange-500': { pageIndicatorColor: '#f97316' }
'.page-orange-600': { pageIndicatorColor: '#ea580c' }
'.page-orange-700': { pageIndicatorColor: '#c2410c' }
'.page-orange-800': { pageIndicatorColor: '#9a3412' }
'.page-orange-900': { pageIndicatorColor: '#7c2d12' }
'.page-red-50': { pageIndicatorColor: '#fef2f2' }
'.page-red-100': { pageIndicatorColor: '#fee2e2' }
'.page-red-200': { pageIndicatorColor: '#fecaca' }
'.page-red-300': { pageIndicatorColor: '#fca5a5' }
'.page-red-400': { pageIndicatorColor: '#f87171' }
'.page-red-500': { pageIndicatorColor: '#ef4444' }
'.page-red-600': { pageIndicatorColor: '#dc2626' }
'.page-red-700': { pageIndicatorColor: '#b91c1c' }
'.page-red-800': { pageIndicatorColor: '#991b1b' }
'.page-red-900': { pageIndicatorColor: '#7f1d1d' }
'.page-warmGray-50': { pageIndicatorColor: '#fafaf9' }
'.page-warmGray-100': { pageIndicatorColor: '#f5f5f4' }
'.page-warmGray-200': { pageIndicatorColor: '#e7e5e4' }
'.page-warmGray-300': { pageIndicatorColor: '#d6d3d1' }
'.page-warmGray-400': { pageIndicatorColor: '#a8a29e' }
'.page-warmGray-500': { pageIndicatorColor: '#78716c' }
'.page-warmGray-600': { pageIndicatorColor: '#57534e' }
'.page-warmGray-700': { pageIndicatorColor: '#44403c' }
'.page-warmGray-800': { pageIndicatorColor: '#292524' }
'.page-warmGray-900': { pageIndicatorColor: '#1c1917' }
'.page-trueGray-50': { pageIndicatorColor: '#fafafa' }
'.page-trueGray-100': { pageIndicatorColor: '#f5f5f5' }
'.page-trueGray-200': { pageIndicatorColor: '#e5e5e5' }
'.page-trueGray-300': { pageIndicatorColor: '#d4d4d4' }
'.page-trueGray-400': { pageIndicatorColor: '#a3a3a3' }
'.page-trueGray-500': { pageIndicatorColor: '#737373' }
'.page-trueGray-600': { pageIndicatorColor: '#525252' }
'.page-trueGray-700': { pageIndicatorColor: '#404040' }
'.page-trueGray-800': { pageIndicatorColor: '#262626' }
'.page-trueGray-900': { pageIndicatorColor: '#171717' }
'.page-gray-50': { pageIndicatorColor: '#fafafa' }
'.page-gray-100': { pageIndicatorColor: '#f4f4f5' }
'.page-gray-200': { pageIndicatorColor: '#e4e4e7' }
'.page-gray-300': { pageIndicatorColor: '#d4d4d8' }
'.page-gray-400': { pageIndicatorColor: '#a1a1aa' }
'.page-gray-500': { pageIndicatorColor: '#71717a' }
'.page-gray-600': { pageIndicatorColor: '#52525b' }
'.page-gray-700': { pageIndicatorColor: '#3f3f46' }
'.page-gray-800': { pageIndicatorColor: '#27272a' }
'.page-gray-900': { pageIndicatorColor: '#18181b' }
'.page-coolGray-50': { pageIndicatorColor: '#f9fafb' }
'.page-coolGray-100': { pageIndicatorColor: '#f3f4f6' }
'.page-coolGray-200': { pageIndicatorColor: '#e5e7eb' }
'.page-coolGray-300': { pageIndicatorColor: '#d1d5db' }
'.page-coolGray-400': { pageIndicatorColor: '#9ca3af' }
'.page-coolGray-500': { pageIndicatorColor: '#6b7280' }
'.page-coolGray-600': { pageIndicatorColor: '#4b5563' }
'.page-coolGray-700': { pageIndicatorColor: '#374151' }
'.page-coolGray-800': { pageIndicatorColor: '#1f2937' }
'.page-coolGray-900': { pageIndicatorColor: '#111827' }
'.page-blueGray-50': { pageIndicatorColor: '#f8fafc' }
'.page-blueGray-100': { pageIndicatorColor: '#f1f5f9' }
'.page-blueGray-200': { pageIndicatorColor: '#e2e8f0' }
'.page-blueGray-300': { pageIndicatorColor: '#cbd5e1' }
'.page-blueGray-400': { pageIndicatorColor: '#94a3b8' }
'.page-blueGray-500': { pageIndicatorColor: '#64748b' }
'.page-blueGray-600': { pageIndicatorColor: '#475569' }
'.page-blueGray-700': { pageIndicatorColor: '#334155' }
'.page-blueGray-800': { pageIndicatorColor: '#1e293b' }
'.page-blueGray-900': { pageIndicatorColor: '#0f172a' }
```

### showPagingControl Property
```css
'.show-paging': { showPagingControl: true }
'.hide-paging': { showPagingControl: false }
```

### pagingControlAlpha Property
```css
'.paging-alpha-0': { pagingControlAlpha: 0 }
'.paging-alpha-5': { pagingControlAlpha: 0.05 }
'.paging-alpha-10': { pagingControlAlpha: 0.1 }
'.paging-alpha-20': { pagingControlAlpha: 0.2 }
'.paging-alpha-25': { pagingControlAlpha: 0.25 }
'.paging-alpha-30': { pagingControlAlpha: 0.3 }
'.paging-alpha-40': { pagingControlAlpha: 0.4 }
'.paging-alpha-50': { pagingControlAlpha: 0.5 }
'.paging-alpha-60': { pagingControlAlpha: 0.6 }
'.paging-alpha-70': { pagingControlAlpha: 0.7 }
'.paging-alpha-75': { pagingControlAlpha: 0.75 }
'.paging-alpha-80': { pagingControlAlpha: 0.8 }
'.paging-alpha-90': { pagingControlAlpha: 0.9 }
'.paging-alpha-95': { pagingControlAlpha: 0.95 }
'.paging-alpha-100': { pagingControlAlpha: 1 }
```

### pagingControlColor Property
```css
'.paging-transparent': { pagingControlColor: 'transparent' }
'.paging-black': { pagingControlColor: '#000000' }
'.paging-white': { pagingControlColor: '#ffffff' }
'.paging-rose-50': { pagingControlColor: '#fff1f2' }
'.paging-rose-100': { pagingControlColor: '#ffe4e6' }
'.paging-rose-200': { pagingControlColor: '#fecdd3' }
'.paging-rose-300': { pagingControlColor: '#fda4af' }
'.paging-rose-400': { pagingControlColor: '#fb7185' }
'.paging-rose-500': { pagingControlColor: '#f43f5e' }
'.paging-rose-600': { pagingControlColor: '#e11d48' }
'.paging-rose-700': { pagingControlColor: '#be123c' }
'.paging-rose-800': { pagingControlColor: '#9f1239' }
'.paging-rose-900': { pagingControlColor: '#881337' }
'.paging-pink-50': { pagingControlColor: '#fdf2f8' }
'.paging-pink-100': { pagingControlColor: '#fce7f3' }
'.paging-pink-200': { pagingControlColor: '#fbcfe8' }
'.paging-pink-300': { pagingControlColor: '#f9a8d4' }
'.paging-pink-400': { pagingControlColor: '#f472b6' }
'.paging-pink-500': { pagingControlColor: '#ec4899' }
'.paging-pink-600': { pagingControlColor: '#db2777' }
'.paging-pink-700': { pagingControlColor: '#be185d' }
'.paging-pink-800': { pagingControlColor: '#9d174d' }
'.paging-pink-900': { pagingControlColor: '#831843' }
'.paging-fuchsia-50': { pagingControlColor: '#fdf4ff' }
'.paging-fuchsia-100': { pagingControlColor: '#fae8ff' }
'.paging-fuchsia-200': { pagingControlColor: '#f5d0fe' }
'.paging-fuchsia-300': { pagingControlColor: '#f0abfc' }
'.paging-fuchsia-400': { pagingControlColor: '#e879f9' }
'.paging-fuchsia-500': { pagingControlColor: '#d946ef' }
'.paging-fuchsia-600': { pagingControlColor: '#c026d3' }
'.paging-fuchsia-700': { pagingControlColor: '#a21caf' }
'.paging-fuchsia-800': { pagingControlColor: '#86198f' }
'.paging-fuchsia-900': { pagingControlColor: '#701a75' }
'.paging-purple-50': { pagingControlColor: '#faf5ff' }
'.paging-purple-100': { pagingControlColor: '#f3e8ff' }
'.paging-purple-200': { pagingControlColor: '#e9d5ff' }
'.paging-purple-300': { pagingControlColor: '#d8b4fe' }
'.paging-purple-400': { pagingControlColor: '#c084fc' }
'.paging-purple-500': { pagingControlColor: '#a855f7' }
'.paging-purple-600': { pagingControlColor: '#9333ea' }
'.paging-purple-700': { pagingControlColor: '#7e22ce' }
'.paging-purple-800': { pagingControlColor: '#6b21a8' }
'.paging-purple-900': { pagingControlColor: '#581c87' }
'.paging-violet-50': { pagingControlColor: '#f5f3ff' }
'.paging-violet-100': { pagingControlColor: '#ede9fe' }
'.paging-violet-200': { pagingControlColor: '#ddd6fe' }
'.paging-violet-300': { pagingControlColor: '#c4b5fd' }
'.paging-violet-400': { pagingControlColor: '#a78bfa' }
'.paging-violet-500': { pagingControlColor: '#8b5cf6' }
'.paging-violet-600': { pagingControlColor: '#7c3aed' }
'.paging-violet-700': { pagingControlColor: '#6d28d9' }
'.paging-violet-800': { pagingControlColor: '#5b21b6' }
'.paging-violet-900': { pagingControlColor: '#4c1d95' }
'.paging-indigo-50': { pagingControlColor: '#eef2ff' }
'.paging-indigo-100': { pagingControlColor: '#e0e7ff' }
'.paging-indigo-200': { pagingControlColor: '#c7d2fe' }
'.paging-indigo-300': { pagingControlColor: '#a5b4fc' }
'.paging-indigo-400': { pagingControlColor: '#818cf8' }
'.paging-indigo-500': { pagingControlColor: '#6366f1' }
'.paging-indigo-600': { pagingControlColor: '#4f46e5' }
'.paging-indigo-700': { pagingControlColor: '#4338ca' }
'.paging-indigo-800': { pagingControlColor: '#3730a3' }
'.paging-indigo-900': { pagingControlColor: '#312e81' }
'.paging-blue-50': { pagingControlColor: '#eff6ff' }
'.paging-blue-100': { pagingControlColor: '#dbeafe' }
'.paging-blue-200': { pagingControlColor: '#bfdbfe' }
'.paging-blue-300': { pagingControlColor: '#93c5fd' }
'.paging-blue-400': { pagingControlColor: '#60a5fa' }
'.paging-blue-500': { pagingControlColor: '#3b82f6' }
'.paging-blue-600': { pagingControlColor: '#2563eb' }
'.paging-blue-700': { pagingControlColor: '#1d4ed8' }
'.paging-blue-800': { pagingControlColor: '#1e40af' }
'.paging-blue-900': { pagingControlColor: '#1e3a8a' }
'.paging-sky-50': { pagingControlColor: '#f0f9ff' }
'.paging-sky-100': { pagingControlColor: '#e0f2fe' }
'.paging-sky-200': { pagingControlColor: '#bae6fd' }
'.paging-sky-300': { pagingControlColor: '#7dd3fc' }
'.paging-sky-400': { pagingControlColor: '#38bdf8' }
'.paging-sky-500': { pagingControlColor: '#0ea5e9' }
'.paging-sky-600': { pagingControlColor: '#0284c7' }
'.paging-sky-700': { pagingControlColor: '#0369a1' }
'.paging-sky-800': { pagingControlColor: '#075985' }
'.paging-sky-900': { pagingControlColor: '#0c4a6e' }
'.paging-cyan-50': { pagingControlColor: '#ecfeff' }
'.paging-cyan-100': { pagingControlColor: '#cffafe' }
'.paging-cyan-200': { pagingControlColor: '#a5f3fc' }
'.paging-cyan-300': { pagingControlColor: '#67e8f9' }
'.paging-cyan-400': { pagingControlColor: '#22d3ee' }
'.paging-cyan-500': { pagingControlColor: '#06b6d4' }
'.paging-cyan-600': { pagingControlColor: '#0891b2' }
'.paging-cyan-700': { pagingControlColor: '#0e7490' }
'.paging-cyan-800': { pagingControlColor: '#155e75' }
'.paging-cyan-900': { pagingControlColor: '#164e63' }
'.paging-teal-50': { pagingControlColor: '#f0fdfa' }
'.paging-teal-100': { pagingControlColor: '#ccfbf1' }
'.paging-teal-200': { pagingControlColor: '#99f6e4' }
'.paging-teal-300': { pagingControlColor: '#5eead4' }
'.paging-teal-400': { pagingControlColor: '#2dd4bf' }
'.paging-teal-500': { pagingControlColor: '#14b8a6' }
'.paging-teal-600': { pagingControlColor: '#0d9488' }
'.paging-teal-700': { pagingControlColor: '#0f766e' }
'.paging-teal-800': { pagingControlColor: '#115e59' }
'.paging-teal-900': { pagingControlColor: '#134e4a' }
'.paging-emerald-50': { pagingControlColor: '#ecfdf5' }
'.paging-emerald-100': { pagingControlColor: '#d1fae5' }
'.paging-emerald-200': { pagingControlColor: '#a7f3d0' }
'.paging-emerald-300': { pagingControlColor: '#6ee7b7' }
'.paging-emerald-400': { pagingControlColor: '#34d399' }
'.paging-emerald-500': { pagingControlColor: '#10b981' }
'.paging-emerald-600': { pagingControlColor: '#059669' }
'.paging-emerald-700': { pagingControlColor: '#047857' }
'.paging-emerald-800': { pagingControlColor: '#065f46' }
'.paging-emerald-900': { pagingControlColor: '#064e3b' }
'.paging-green-50': { pagingControlColor: '#f0fdf4' }
'.paging-green-100': { pagingControlColor: '#dcfce7' }
'.paging-green-200': { pagingControlColor: '#bbf7d0' }
'.paging-green-300': { pagingControlColor: '#86efac' }
'.paging-green-400': { pagingControlColor: '#4ade80' }
'.paging-green-500': { pagingControlColor: '#22c55e' }
'.paging-green-600': { pagingControlColor: '#16a34a' }
'.paging-green-700': { pagingControlColor: '#15803d' }
'.paging-green-800': { pagingControlColor: '#166534' }
'.paging-green-900': { pagingControlColor: '#14532d' }
'.paging-lime-50': { pagingControlColor: '#f7fee7' }
'.paging-lime-100': { pagingControlColor: '#ecfccb' }
'.paging-lime-200': { pagingControlColor: '#d9f99d' }
'.paging-lime-300': { pagingControlColor: '#bef264' }
'.paging-lime-400': { pagingControlColor: '#a3e635' }
'.paging-lime-500': { pagingControlColor: '#84cc16' }
'.paging-lime-600': { pagingControlColor: '#65a30d' }
'.paging-lime-700': { pagingControlColor: '#4d7c0f' }
'.paging-lime-800': { pagingControlColor: '#3f6212' }
'.paging-lime-900': { pagingControlColor: '#365314' }
'.paging-yellow-50': { pagingControlColor: '#fefce8' }
'.paging-yellow-100': { pagingControlColor: '#fef9c3' }
'.paging-yellow-200': { pagingControlColor: '#fef08a' }
'.paging-yellow-300': { pagingControlColor: '#fde047' }
'.paging-yellow-400': { pagingControlColor: '#facc15' }
'.paging-yellow-500': { pagingControlColor: '#eab308' }
'.paging-yellow-600': { pagingControlColor: '#ca8a04' }
'.paging-yellow-700': { pagingControlColor: '#a16207' }
'.paging-yellow-800': { pagingControlColor: '#854d0e' }
'.paging-yellow-900': { pagingControlColor: '#713f12' }
'.paging-amber-50': { pagingControlColor: '#fffbeb' }
'.paging-amber-100': { pagingControlColor: '#fef3c7' }
'.paging-amber-200': { pagingControlColor: '#fde68a' }
'.paging-amber-300': { pagingControlColor: '#fcd34d' }
'.paging-amber-400': { pagingControlColor: '#fbbf24' }
'.paging-amber-500': { pagingControlColor: '#f59e0b' }
'.paging-amber-600': { pagingControlColor: '#d97706' }
'.paging-amber-700': { pagingControlColor: '#b45309' }
'.paging-amber-800': { pagingControlColor: '#92400e' }
'.paging-amber-900': { pagingControlColor: '#78350f' }
'.paging-orange-50': { pagingControlColor: '#fff7ed' }
'.paging-orange-100': { pagingControlColor: '#ffedd5' }
'.paging-orange-200': { pagingControlColor: '#fed7aa' }
'.paging-orange-300': { pagingControlColor: '#fdba74' }
'.paging-orange-400': { pagingControlColor: '#fb923c' }
'.paging-orange-500': { pagingControlColor: '#f97316' }
'.paging-orange-600': { pagingControlColor: '#ea580c' }
'.paging-orange-700': { pagingControlColor: '#c2410c' }
'.paging-orange-800': { pagingControlColor: '#9a3412' }
'.paging-orange-900': { pagingControlColor: '#7c2d12' }
'.paging-red-50': { pagingControlColor: '#fef2f2' }
'.paging-red-100': { pagingControlColor: '#fee2e2' }
'.paging-red-200': { pagingControlColor: '#fecaca' }
'.paging-red-300': { pagingControlColor: '#fca5a5' }
'.paging-red-400': { pagingControlColor: '#f87171' }
'.paging-red-500': { pagingControlColor: '#ef4444' }
'.paging-red-600': { pagingControlColor: '#dc2626' }
'.paging-red-700': { pagingControlColor: '#b91c1c' }
'.paging-red-800': { pagingControlColor: '#991b1b' }
'.paging-red-900': { pagingControlColor: '#7f1d1d' }
'.paging-warmGray-50': { pagingControlColor: '#fafaf9' }
'.paging-warmGray-100': { pagingControlColor: '#f5f5f4' }
'.paging-warmGray-200': { pagingControlColor: '#e7e5e4' }
'.paging-warmGray-300': { pagingControlColor: '#d6d3d1' }
'.paging-warmGray-400': { pagingControlColor: '#a8a29e' }
'.paging-warmGray-500': { pagingControlColor: '#78716c' }
'.paging-warmGray-600': { pagingControlColor: '#57534e' }
'.paging-warmGray-700': { pagingControlColor: '#44403c' }
'.paging-warmGray-800': { pagingControlColor: '#292524' }
'.paging-warmGray-900': { pagingControlColor: '#1c1917' }
'.paging-trueGray-50': { pagingControlColor: '#fafafa' }
'.paging-trueGray-100': { pagingControlColor: '#f5f5f5' }
'.paging-trueGray-200': { pagingControlColor: '#e5e5e5' }
'.paging-trueGray-300': { pagingControlColor: '#d4d4d4' }
'.paging-trueGray-400': { pagingControlColor: '#a3a3a3' }
'.paging-trueGray-500': { pagingControlColor: '#737373' }
'.paging-trueGray-600': { pagingControlColor: '#525252' }
'.paging-trueGray-700': { pagingControlColor: '#404040' }
'.paging-trueGray-800': { pagingControlColor: '#262626' }
'.paging-trueGray-900': { pagingControlColor: '#171717' }
'.paging-gray-50': { pagingControlColor: '#fafafa' }
'.paging-gray-100': { pagingControlColor: '#f4f4f5' }
'.paging-gray-200': { pagingControlColor: '#e4e4e7' }
'.paging-gray-300': { pagingControlColor: '#d4d4d8' }
'.paging-gray-400': { pagingControlColor: '#a1a1aa' }
'.paging-gray-500': { pagingControlColor: '#71717a' }
'.paging-gray-600': { pagingControlColor: '#52525b' }
'.paging-gray-700': { pagingControlColor: '#3f3f46' }
'.paging-gray-800': { pagingControlColor: '#27272a' }
'.paging-gray-900': { pagingControlColor: '#18181b' }
'.paging-coolGray-50': { pagingControlColor: '#f9fafb' }
'.paging-coolGray-100': { pagingControlColor: '#f3f4f6' }
'.paging-coolGray-200': { pagingControlColor: '#e5e7eb' }
'.paging-coolGray-300': { pagingControlColor: '#d1d5db' }
'.paging-coolGray-400': { pagingControlColor: '#9ca3af' }
'.paging-coolGray-500': { pagingControlColor: '#6b7280' }
'.paging-coolGray-600': { pagingControlColor: '#4b5563' }
'.paging-coolGray-700': { pagingControlColor: '#374151' }
'.paging-coolGray-800': { pagingControlColor: '#1f2937' }
'.paging-coolGray-900': { pagingControlColor: '#111827' }
'.paging-blueGray-50': { pagingControlColor: '#f8fafc' }
'.paging-blueGray-100': { pagingControlColor: '#f1f5f9' }
'.paging-blueGray-200': { pagingControlColor: '#e2e8f0' }
'.paging-blueGray-300': { pagingControlColor: '#cbd5e1' }
'.paging-blueGray-400': { pagingControlColor: '#94a3b8' }
'.paging-blueGray-500': { pagingControlColor: '#64748b' }
'.paging-blueGray-600': { pagingControlColor: '#475569' }
'.paging-blueGray-700': { pagingControlColor: '#334155' }
'.paging-blueGray-800': { pagingControlColor: '#1e293b' }
'.paging-blueGray-900': { pagingControlColor: '#0f172a' }
```

### pagingControlHeight Property
```css
'.paging-h-0': { pagingControlHeight: 0 }
'.paging-h-1': { pagingControlHeight: 4 }
'.paging-h-2': { pagingControlHeight: 8 }
'.paging-h-3': { pagingControlHeight: 12 }
'.paging-h-4': { pagingControlHeight: 16 }
'.paging-h-5': { pagingControlHeight: 20 }
'.paging-h-6': { pagingControlHeight: 24 }
'.paging-h-7': { pagingControlHeight: 28 }
'.paging-h-8': { pagingControlHeight: 32 }
'.paging-h-9': { pagingControlHeight: 36 }
'.paging-h-10': { pagingControlHeight: 40 }
'.paging-h-11': { pagingControlHeight: 44 }
'.paging-h-12': { pagingControlHeight: 48 }
'.paging-h-13': { pagingControlHeight: 52 }
'.paging-h-14': { pagingControlHeight: 56 }
'.paging-h-15': { pagingControlHeight: 60 }
'.paging-h-16': { pagingControlHeight: 64 }
'.paging-h-20': { pagingControlHeight: 80 }
'.paging-h-24': { pagingControlHeight: 96 }
'.paging-h-28': { pagingControlHeight: 112 }
'.paging-h-32': { pagingControlHeight: 128 }
'.paging-h-36': { pagingControlHeight: 144 }
'.paging-h-40': { pagingControlHeight: 160 }
'.paging-h-44': { pagingControlHeight: 176 }
'.paging-h-48': { pagingControlHeight: 192 }
'.paging-h-52': { pagingControlHeight: 208 }
'.paging-h-56': { pagingControlHeight: 224 }
'.paging-h-60': { pagingControlHeight: 240 }
'.paging-h-64': { pagingControlHeight: 256 }
'.paging-h-72': { pagingControlHeight: 288 }
'.paging-h-80': { pagingControlHeight: 320 }
'.paging-h-96': { pagingControlHeight: 384 }
'.paging-h-px': { pagingControlHeight: '1px' }
'.paging-h-0.5': { pagingControlHeight: 2 }
'.paging-h-1.5': { pagingControlHeight: 6 }
'.paging-h-2.5': { pagingControlHeight: 10 }
'.paging-h-3.5': { pagingControlHeight: 14 }
```

### pagingControlOnTop Property
```css
'.paging-control-on-top': { pagingControlOnTop: true }
'.paging-control-on-bottom': { pagingControlOnTop: false }
```

### pagingControlTimeout Property
```css
'.paging-timeout-0': { pagingControlTimeout: 0 }
'.paging-timeout-25': { pagingControlTimeout: 25 }
'.paging-timeout-50': { pagingControlTimeout: 50 }
'.paging-timeout-75': { pagingControlTimeout: 75 }
'.paging-timeout-100': { pagingControlTimeout: 100 }
'.paging-timeout-150': { pagingControlTimeout: 150 }
'.paging-timeout-200': { pagingControlTimeout: 200 }
'.paging-timeout-300': { pagingControlTimeout: 300 }
'.paging-timeout-500': { pagingControlTimeout: 500 }
'.paging-timeout-700': { pagingControlTimeout: 700 }
'.paging-timeout-1000': { pagingControlTimeout: 1000 }
'.paging-timeout-2000': { pagingControlTimeout: 2000 }
'.paging-timeout-3000': { pagingControlTimeout: 3000 }
'.paging-timeout-4000': { pagingControlTimeout: 4000 }
'.paging-timeout-5000': { pagingControlTimeout: 5000 }
```

## hintTextColor Property
```css
'.placeholder-transparent': { hintTextColor: 'transparent' }
'.placeholder-black': { hintTextColor: '#000000' }
'.placeholder-white': { hintTextColor: '#ffffff' }
'.placeholder-rose-50': { hintTextColor: '#fff1f2' }
'.placeholder-rose-100': { hintTextColor: '#ffe4e6' }
'.placeholder-rose-200': { hintTextColor: '#fecdd3' }
'.placeholder-rose-300': { hintTextColor: '#fda4af' }
'.placeholder-rose-400': { hintTextColor: '#fb7185' }
'.placeholder-rose-500': { hintTextColor: '#f43f5e' }
'.placeholder-rose-600': { hintTextColor: '#e11d48' }
'.placeholder-rose-700': { hintTextColor: '#be123c' }
'.placeholder-rose-800': { hintTextColor: '#9f1239' }
'.placeholder-rose-900': { hintTextColor: '#881337' }
'.placeholder-pink-50': { hintTextColor: '#fdf2f8' }
'.placeholder-pink-100': { hintTextColor: '#fce7f3' }
'.placeholder-pink-200': { hintTextColor: '#fbcfe8' }
'.placeholder-pink-300': { hintTextColor: '#f9a8d4' }
'.placeholder-pink-400': { hintTextColor: '#f472b6' }
'.placeholder-pink-500': { hintTextColor: '#ec4899' }
'.placeholder-pink-600': { hintTextColor: '#db2777' }
'.placeholder-pink-700': { hintTextColor: '#be185d' }
'.placeholder-pink-800': { hintTextColor: '#9d174d' }
'.placeholder-pink-900': { hintTextColor: '#831843' }
'.placeholder-fuchsia-50': { hintTextColor: '#fdf4ff' }
'.placeholder-fuchsia-100': { hintTextColor: '#fae8ff' }
'.placeholder-fuchsia-200': { hintTextColor: '#f5d0fe' }
'.placeholder-fuchsia-300': { hintTextColor: '#f0abfc' }
'.placeholder-fuchsia-400': { hintTextColor: '#e879f9' }
'.placeholder-fuchsia-500': { hintTextColor: '#d946ef' }
'.placeholder-fuchsia-600': { hintTextColor: '#c026d3' }
'.placeholder-fuchsia-700': { hintTextColor: '#a21caf' }
'.placeholder-fuchsia-800': { hintTextColor: '#86198f' }
'.placeholder-fuchsia-900': { hintTextColor: '#701a75' }
'.placeholder-purple-50': { hintTextColor: '#faf5ff' }
'.placeholder-purple-100': { hintTextColor: '#f3e8ff' }
'.placeholder-purple-200': { hintTextColor: '#e9d5ff' }
'.placeholder-purple-300': { hintTextColor: '#d8b4fe' }
'.placeholder-purple-400': { hintTextColor: '#c084fc' }
'.placeholder-purple-500': { hintTextColor: '#a855f7' }
'.placeholder-purple-600': { hintTextColor: '#9333ea' }
'.placeholder-purple-700': { hintTextColor: '#7e22ce' }
'.placeholder-purple-800': { hintTextColor: '#6b21a8' }
'.placeholder-purple-900': { hintTextColor: '#581c87' }
'.placeholder-violet-50': { hintTextColor: '#f5f3ff' }
'.placeholder-violet-100': { hintTextColor: '#ede9fe' }
'.placeholder-violet-200': { hintTextColor: '#ddd6fe' }
'.placeholder-violet-300': { hintTextColor: '#c4b5fd' }
'.placeholder-violet-400': { hintTextColor: '#a78bfa' }
'.placeholder-violet-500': { hintTextColor: '#8b5cf6' }
'.placeholder-violet-600': { hintTextColor: '#7c3aed' }
'.placeholder-violet-700': { hintTextColor: '#6d28d9' }
'.placeholder-violet-800': { hintTextColor: '#5b21b6' }
'.placeholder-violet-900': { hintTextColor: '#4c1d95' }
'.placeholder-indigo-50': { hintTextColor: '#eef2ff' }
'.placeholder-indigo-100': { hintTextColor: '#e0e7ff' }
'.placeholder-indigo-200': { hintTextColor: '#c7d2fe' }
'.placeholder-indigo-300': { hintTextColor: '#a5b4fc' }
'.placeholder-indigo-400': { hintTextColor: '#818cf8' }
'.placeholder-indigo-500': { hintTextColor: '#6366f1' }
'.placeholder-indigo-600': { hintTextColor: '#4f46e5' }
'.placeholder-indigo-700': { hintTextColor: '#4338ca' }
'.placeholder-indigo-800': { hintTextColor: '#3730a3' }
'.placeholder-indigo-900': { hintTextColor: '#312e81' }
'.placeholder-blue-50': { hintTextColor: '#eff6ff' }
'.placeholder-blue-100': { hintTextColor: '#dbeafe' }
'.placeholder-blue-200': { hintTextColor: '#bfdbfe' }
'.placeholder-blue-300': { hintTextColor: '#93c5fd' }
'.placeholder-blue-400': { hintTextColor: '#60a5fa' }
'.placeholder-blue-500': { hintTextColor: '#3b82f6' }
'.placeholder-blue-600': { hintTextColor: '#2563eb' }
'.placeholder-blue-700': { hintTextColor: '#1d4ed8' }
'.placeholder-blue-800': { hintTextColor: '#1e40af' }
'.placeholder-blue-900': { hintTextColor: '#1e3a8a' }
'.placeholder-sky-50': { hintTextColor: '#f0f9ff' }
'.placeholder-sky-100': { hintTextColor: '#e0f2fe' }
'.placeholder-sky-200': { hintTextColor: '#bae6fd' }
'.placeholder-sky-300': { hintTextColor: '#7dd3fc' }
'.placeholder-sky-400': { hintTextColor: '#38bdf8' }
'.placeholder-sky-500': { hintTextColor: '#0ea5e9' }
'.placeholder-sky-600': { hintTextColor: '#0284c7' }
'.placeholder-sky-700': { hintTextColor: '#0369a1' }
'.placeholder-sky-800': { hintTextColor: '#075985' }
'.placeholder-sky-900': { hintTextColor: '#0c4a6e' }
'.placeholder-cyan-50': { hintTextColor: '#ecfeff' }
'.placeholder-cyan-100': { hintTextColor: '#cffafe' }
'.placeholder-cyan-200': { hintTextColor: '#a5f3fc' }
'.placeholder-cyan-300': { hintTextColor: '#67e8f9' }
'.placeholder-cyan-400': { hintTextColor: '#22d3ee' }
'.placeholder-cyan-500': { hintTextColor: '#06b6d4' }
'.placeholder-cyan-600': { hintTextColor: '#0891b2' }
'.placeholder-cyan-700': { hintTextColor: '#0e7490' }
'.placeholder-cyan-800': { hintTextColor: '#155e75' }
'.placeholder-cyan-900': { hintTextColor: '#164e63' }
'.placeholder-teal-50': { hintTextColor: '#f0fdfa' }
'.placeholder-teal-100': { hintTextColor: '#ccfbf1' }
'.placeholder-teal-200': { hintTextColor: '#99f6e4' }
'.placeholder-teal-300': { hintTextColor: '#5eead4' }
'.placeholder-teal-400': { hintTextColor: '#2dd4bf' }
'.placeholder-teal-500': { hintTextColor: '#14b8a6' }
'.placeholder-teal-600': { hintTextColor: '#0d9488' }
'.placeholder-teal-700': { hintTextColor: '#0f766e' }
'.placeholder-teal-800': { hintTextColor: '#115e59' }
'.placeholder-teal-900': { hintTextColor: '#134e4a' }
'.placeholder-emerald-50': { hintTextColor: '#ecfdf5' }
'.placeholder-emerald-100': { hintTextColor: '#d1fae5' }
'.placeholder-emerald-200': { hintTextColor: '#a7f3d0' }
'.placeholder-emerald-300': { hintTextColor: '#6ee7b7' }
'.placeholder-emerald-400': { hintTextColor: '#34d399' }
'.placeholder-emerald-500': { hintTextColor: '#10b981' }
'.placeholder-emerald-600': { hintTextColor: '#059669' }
'.placeholder-emerald-700': { hintTextColor: '#047857' }
'.placeholder-emerald-800': { hintTextColor: '#065f46' }
'.placeholder-emerald-900': { hintTextColor: '#064e3b' }
'.placeholder-green-50': { hintTextColor: '#f0fdf4' }
'.placeholder-green-100': { hintTextColor: '#dcfce7' }
'.placeholder-green-200': { hintTextColor: '#bbf7d0' }
'.placeholder-green-300': { hintTextColor: '#86efac' }
'.placeholder-green-400': { hintTextColor: '#4ade80' }
'.placeholder-green-500': { hintTextColor: '#22c55e' }
'.placeholder-green-600': { hintTextColor: '#16a34a' }
'.placeholder-green-700': { hintTextColor: '#15803d' }
'.placeholder-green-800': { hintTextColor: '#166534' }
'.placeholder-green-900': { hintTextColor: '#14532d' }
'.placeholder-lime-50': { hintTextColor: '#f7fee7' }
'.placeholder-lime-100': { hintTextColor: '#ecfccb' }
'.placeholder-lime-200': { hintTextColor: '#d9f99d' }
'.placeholder-lime-300': { hintTextColor: '#bef264' }
'.placeholder-lime-400': { hintTextColor: '#a3e635' }
'.placeholder-lime-500': { hintTextColor: '#84cc16' }
'.placeholder-lime-600': { hintTextColor: '#65a30d' }
'.placeholder-lime-700': { hintTextColor: '#4d7c0f' }
'.placeholder-lime-800': { hintTextColor: '#3f6212' }
'.placeholder-lime-900': { hintTextColor: '#365314' }
'.placeholder-yellow-50': { hintTextColor: '#fefce8' }
'.placeholder-yellow-100': { hintTextColor: '#fef9c3' }
'.placeholder-yellow-200': { hintTextColor: '#fef08a' }
'.placeholder-yellow-300': { hintTextColor: '#fde047' }
'.placeholder-yellow-400': { hintTextColor: '#facc15' }
'.placeholder-yellow-500': { hintTextColor: '#eab308' }
'.placeholder-yellow-600': { hintTextColor: '#ca8a04' }
'.placeholder-yellow-700': { hintTextColor: '#a16207' }
'.placeholder-yellow-800': { hintTextColor: '#854d0e' }
'.placeholder-yellow-900': { hintTextColor: '#713f12' }
'.placeholder-amber-50': { hintTextColor: '#fffbeb' }
'.placeholder-amber-100': { hintTextColor: '#fef3c7' }
'.placeholder-amber-200': { hintTextColor: '#fde68a' }
'.placeholder-amber-300': { hintTextColor: '#fcd34d' }
'.placeholder-amber-400': { hintTextColor: '#fbbf24' }
'.placeholder-amber-500': { hintTextColor: '#f59e0b' }
'.placeholder-amber-600': { hintTextColor: '#d97706' }
'.placeholder-amber-700': { hintTextColor: '#b45309' }
'.placeholder-amber-800': { hintTextColor: '#92400e' }
'.placeholder-amber-900': { hintTextColor: '#78350f' }
'.placeholder-orange-50': { hintTextColor: '#fff7ed' }
'.placeholder-orange-100': { hintTextColor: '#ffedd5' }
'.placeholder-orange-200': { hintTextColor: '#fed7aa' }
'.placeholder-orange-300': { hintTextColor: '#fdba74' }
'.placeholder-orange-400': { hintTextColor: '#fb923c' }
'.placeholder-orange-500': { hintTextColor: '#f97316' }
'.placeholder-orange-600': { hintTextColor: '#ea580c' }
'.placeholder-orange-700': { hintTextColor: '#c2410c' }
'.placeholder-orange-800': { hintTextColor: '#9a3412' }
'.placeholder-orange-900': { hintTextColor: '#7c2d12' }
'.placeholder-red-50': { hintTextColor: '#fef2f2' }
'.placeholder-red-100': { hintTextColor: '#fee2e2' }
'.placeholder-red-200': { hintTextColor: '#fecaca' }
'.placeholder-red-300': { hintTextColor: '#fca5a5' }
'.placeholder-red-400': { hintTextColor: '#f87171' }
'.placeholder-red-500': { hintTextColor: '#ef4444' }
'.placeholder-red-600': { hintTextColor: '#dc2626' }
'.placeholder-red-700': { hintTextColor: '#b91c1c' }
'.placeholder-red-800': { hintTextColor: '#991b1b' }
'.placeholder-red-900': { hintTextColor: '#7f1d1d' }
'.placeholder-warmGray-50': { hintTextColor: '#fafaf9' }
'.placeholder-warmGray-100': { hintTextColor: '#f5f5f4' }
'.placeholder-warmGray-200': { hintTextColor: '#e7e5e4' }
'.placeholder-warmGray-300': { hintTextColor: '#d6d3d1' }
'.placeholder-warmGray-400': { hintTextColor: '#a8a29e' }
'.placeholder-warmGray-500': { hintTextColor: '#78716c' }
'.placeholder-warmGray-600': { hintTextColor: '#57534e' }
'.placeholder-warmGray-700': { hintTextColor: '#44403c' }
'.placeholder-warmGray-800': { hintTextColor: '#292524' }
'.placeholder-warmGray-900': { hintTextColor: '#1c1917' }
'.placeholder-trueGray-50': { hintTextColor: '#fafafa' }
'.placeholder-trueGray-100': { hintTextColor: '#f5f5f5' }
'.placeholder-trueGray-200': { hintTextColor: '#e5e5e5' }
'.placeholder-trueGray-300': { hintTextColor: '#d4d4d4' }
'.placeholder-trueGray-400': { hintTextColor: '#a3a3a3' }
'.placeholder-trueGray-500': { hintTextColor: '#737373' }
'.placeholder-trueGray-600': { hintTextColor: '#525252' }
'.placeholder-trueGray-700': { hintTextColor: '#404040' }
'.placeholder-trueGray-800': { hintTextColor: '#262626' }
'.placeholder-trueGray-900': { hintTextColor: '#171717' }
'.placeholder-gray-50': { hintTextColor: '#fafafa' }
'.placeholder-gray-100': { hintTextColor: '#f4f4f5' }
'.placeholder-gray-200': { hintTextColor: '#e4e4e7' }
'.placeholder-gray-300': { hintTextColor: '#d4d4d8' }
'.placeholder-gray-400': { hintTextColor: '#a1a1aa' }
'.placeholder-gray-500': { hintTextColor: '#71717a' }
'.placeholder-gray-600': { hintTextColor: '#52525b' }
'.placeholder-gray-700': { hintTextColor: '#3f3f46' }
'.placeholder-gray-800': { hintTextColor: '#27272a' }
'.placeholder-gray-900': { hintTextColor: '#18181b' }
'.placeholder-coolGray-50': { hintTextColor: '#f9fafb' }
'.placeholder-coolGray-100': { hintTextColor: '#f3f4f6' }
'.placeholder-coolGray-200': { hintTextColor: '#e5e7eb' }
'.placeholder-coolGray-300': { hintTextColor: '#d1d5db' }
'.placeholder-coolGray-400': { hintTextColor: '#9ca3af' }
'.placeholder-coolGray-500': { hintTextColor: '#6b7280' }
'.placeholder-coolGray-600': { hintTextColor: '#4b5563' }
'.placeholder-coolGray-700': { hintTextColor: '#374151' }
'.placeholder-coolGray-800': { hintTextColor: '#1f2937' }
'.placeholder-coolGray-900': { hintTextColor: '#111827' }
'.placeholder-blueGray-50': { hintTextColor: '#f8fafc' }
'.placeholder-blueGray-100': { hintTextColor: '#f1f5f9' }
'.placeholder-blueGray-200': { hintTextColor: '#e2e8f0' }
'.placeholder-blueGray-300': { hintTextColor: '#cbd5e1' }
'.placeholder-blueGray-400': { hintTextColor: '#94a3b8' }
'.placeholder-blueGray-500': { hintTextColor: '#64748b' }
'.placeholder-blueGray-600': { hintTextColor: '#475569' }
'.placeholder-blueGray-700': { hintTextColor: '#334155' }
'.placeholder-blueGray-800': { hintTextColor: '#1e293b' }
'.placeholder-blueGray-900': { hintTextColor: '#0f172a' }
```

## Top / Right / Bottom / Left
```css
'.top-0': { top: 0 }
'.left-0': { left: 0 }
'.right-0': { right: 0 }
'.bottom-0': { bottom: 0 }
'.top-auto': { top: Ti.UI.SIZE }
'.left-auto': { left: Ti.UI.SIZE }
'.right-auto': { right: Ti.UI.SIZE }
'.bottom-auto': { bottom: Ti.UI.SIZE }
'.inset-x-0': { right: 0, left: 0 }
'.inset-y-0': { top: 0, bottom: 0 }
'.inset-0': { top: 0, right: 0, bottom: 0, left: 0 }
'.inset-x-auto': { right: Ti.UI.SIZE, left: Ti.UI.SIZE }
'.inset-y-auto': { top: Ti.UI.SIZE, bottom: Ti.UI.SIZE }
'.inset-auto': { top: Ti.UI.SIZE, right: Ti.UI.SIZE, bottom: Ti.UI.SIZE, left: Ti.UI.SIZE }
```

## repeat Property
```css
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
```

## returnKeyType Property
```css
'.returnkey-continue': { returnKeyType: Ti.UI.RETURNKEY_CONTINUE }
'.returnkey-default': { returnKeyType: Ti.UI.RETURNKEY_DEFAULT }
'.returnkey-done': { returnKeyType: Ti.UI.RETURNKEY_DONE }
'.returnkey-emergency-call': { returnKeyType: Ti.UI.RETURNKEY_EMERGENCY_CALL }
'.returnkey-go': { returnKeyType: Ti.UI.RETURNKEY_GO }
'.returnkey-google': { returnKeyType: Ti.UI.RETURNKEY_GOOGLE }
'.returnkey-join': { returnKeyType: Ti.UI.RETURNKEY_JOIN }
'.returnkey-next': { returnKeyType: Ti.UI.RETURNKEY_NEXT }
'.returnkey-route': { returnKeyType: Ti.UI.RETURNKEY_ROUTE }
'.returnkey-search': { returnKeyType: Ti.UI.RETURNKEY_SEARCH }
'.returnkey-send': { returnKeyType: Ti.UI.RETURNKEY_SEND }
'.returnkey-yahoo': { returnKeyType: Ti.UI.RETURNKEY_YAHOO }
```

## rotate Property
```css
'.rotate-0': { rotate: 0 }
'.rotate-1': { rotate: 1 }
'.rotate-2': { rotate: 2 }
'.rotate-3': { rotate: 3 }
'.rotate-6': { rotate: 6 }
'.rotate-12': { rotate: 12 }
'.rotate-45': { rotate: 45 }
'.rotate-90': { rotate: 90 }
'.rotate-180': { rotate: 180 }
'.-rotate-180': { rotate: -180 }
'.-rotate-90': { rotate: -90 }
'.-rotate-45': { rotate: -45 }
'.-rotate-12': { rotate: -12 }
'.-rotate-6': { rotate: -6 }
'.-rotate-3': { rotate: -3 }
'.-rotate-2': { rotate: -2 }
'.-rotate-1': { rotate: -1 }
```

## scale Property
```css
'.scale-0': { scale: '0' }
'.scale-5': { scale: '0.05' }
'.scale-10': { scale: '0.1' }
'.scale-25': { scale: '0.25' }
'.scale-50': { scale: '.5' }
'.scale-75': { scale: '.75' }
'.scale-90': { scale: '.9' }
'.scale-95': { scale: '.95' }
'.scale-100': { scale: '1' }
'.scale-105': { scale: '1.05' }
'.scale-110': { scale: '1.1' }
'.scale-125': { scale: '1.25' }
'.scale-150': { scale: '1.5' }
```

## Scroll Indicators ( for ScrollViews )
```css
'.overflow-x-scroll': { showHorizontalScrollIndicator: true }
'.overflow-y-scroll': { showVerticalScrollIndicator: true }
'.overflow-x-hidden': { showHorizontalScrollIndicator: false }
'.overflow-y-hidden': { showVerticalScrollIndicator: false }
'.overflow-scroll': { showHorizontalScrollIndicator: true, showVerticalScrollIndicator: true }
'.overflow-hidden': { showHorizontalScrollIndicator: false, showVerticalScrollIndicator: false }
```

## scrollType Property
```css
'.scroll-horizontal[platform=android]': { scrollType: 'horizontal' }
'.scroll-vertical[platform=android]': { scrollType: 'vertical' }
```

## contentWidth & contentHeight ( for ScrollViews )
```css
'.content-w-auto': { contentWidth: Ti.UI.SIZE }
'.content-w-screen': { contentWidth: Ti.UI.FILL }
'.content-h-auto': { contentHeight: Ti.UI.SIZE }
'.content-h-screen': { contentHeight: Ti.UI.FILL }
'.content-auto': { contentWidth: Ti.UI.SIZE, contentHeight: Ti.UI.SIZE }
'.content-screen': { contentWidth: Ti.UI.FILL, contentHeight: Ti.UI.FILL }
```

## scrollingEnabled Property
```css
'.scrolling-enabled': { scrollingEnabled: true }
'.scrolling-disabled': { scrollingEnabled: false }
```

## Box Shadow
```css
'.shadow-xs': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 1, viewShadowColor: '#80000000' }
'.shadow-sm': { viewShadowOffset: { x: 0, y: 1 }, viewShadowRadius: 1, viewShadowColor: '#80000000' }
'.shadow': { viewShadowOffset: { x: 0, y: 2 }, viewShadowRadius: 2, viewShadowColor: '#80000000' }
'.shadow-md': { viewShadowOffset: { x: 0, y: 4 }, viewShadowRadius: 4, viewShadowColor: '#80000000' }
'.shadow-lg': { viewShadowOffset: { x: 0, y: 8 }, viewShadowRadius: 8, viewShadowColor: '#80000000' }
'.shadow-xl': { viewShadowOffset: { x: 0, y: 12 }, viewShadowRadius: 12, viewShadowColor: '#80000000' }
'.shadow-2xl': { viewShadowOffset: { x: 0, y: 16 }, viewShadowRadius: 16, viewShadowColor: '#80000000' }
'.shadow-inner': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }
'.shadow-outline': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: 2, viewShadowColor: '#80000000' }
'.shadow-none': { viewShadowOffset: { x: 0, y: 0 }, viewShadowRadius: null, viewShadowColor: null }
```

## Box Shadow Color
```css
// shadow Colors Property
'.shadow-transparent': { viewShadowColor: 'transparent' }
'.shadow-black': { viewShadowColor: '#000000' }
'.shadow-white': { viewShadowColor: '#ffffff' }
'.shadow-slate-50': { viewShadowColor: '#f8fafc' }
'.shadow-slate-100': { viewShadowColor: '#f1f5f9' }
'.shadow-slate-200': { viewShadowColor: '#e2e8f0' }
'.shadow-slate-300': { viewShadowColor: '#cbd5e1' }
'.shadow-slate-400': { viewShadowColor: '#94a3b8' }
'.shadow-slate-500': { viewShadowColor: '#64748b' }
'.shadow-slate-600': { viewShadowColor: '#475569' }
'.shadow-slate-700': { viewShadowColor: '#334155' }
'.shadow-slate-800': { viewShadowColor: '#1e293b' }
'.shadow-slate-900': { viewShadowColor: '#0f172a' }
'.shadow-gray-50': { viewShadowColor: '#f9fafb' }
'.shadow-gray-100': { viewShadowColor: '#f3f4f6' }
'.shadow-gray-200': { viewShadowColor: '#e5e7eb' }
'.shadow-gray-300': { viewShadowColor: '#d1d5db' }
'.shadow-gray-400': { viewShadowColor: '#9ca3af' }
'.shadow-gray-500': { viewShadowColor: '#6b7280' }
'.shadow-gray-600': { viewShadowColor: '#4b5563' }
'.shadow-gray-700': { viewShadowColor: '#374151' }
'.shadow-gray-800': { viewShadowColor: '#1f2937' }
'.shadow-gray-900': { viewShadowColor: '#111827' }
'.shadow-zinc-50': { viewShadowColor: '#fafafa' }
'.shadow-zinc-100': { viewShadowColor: '#f4f4f5' }
'.shadow-zinc-200': { viewShadowColor: '#e4e4e7' }
'.shadow-zinc-300': { viewShadowColor: '#d4d4d8' }
'.shadow-zinc-400': { viewShadowColor: '#a1a1aa' }
'.shadow-zinc-500': { viewShadowColor: '#71717a' }
'.shadow-zinc-600': { viewShadowColor: '#52525b' }
'.shadow-zinc-700': { viewShadowColor: '#3f3f46' }
'.shadow-zinc-800': { viewShadowColor: '#27272a' }
'.shadow-zinc-900': { viewShadowColor: '#18181b' }
'.shadow-neutral-50': { viewShadowColor: '#fafafa' }
'.shadow-neutral-100': { viewShadowColor: '#f5f5f5' }
'.shadow-neutral-200': { viewShadowColor: '#e5e5e5' }
'.shadow-neutral-300': { viewShadowColor: '#d4d4d4' }
'.shadow-neutral-400': { viewShadowColor: '#a3a3a3' }
'.shadow-neutral-500': { viewShadowColor: '#737373' }
'.shadow-neutral-600': { viewShadowColor: '#525252' }
'.shadow-neutral-700': { viewShadowColor: '#404040' }
'.shadow-neutral-800': { viewShadowColor: '#262626' }
'.shadow-neutral-900': { viewShadowColor: '#171717' }
'.shadow-stone-50': { viewShadowColor: '#fafaf9' }
'.shadow-stone-100': { viewShadowColor: '#f5f5f4' }
'.shadow-stone-200': { viewShadowColor: '#e7e5e4' }
'.shadow-stone-300': { viewShadowColor: '#d6d3d1' }
'.shadow-stone-400': { viewShadowColor: '#a8a29e' }
'.shadow-stone-500': { viewShadowColor: '#78716c' }
'.shadow-stone-600': { viewShadowColor: '#57534e' }
'.shadow-stone-700': { viewShadowColor: '#44403c' }
'.shadow-stone-800': { viewShadowColor: '#292524' }
'.shadow-stone-900': { viewShadowColor: '#1c1917' }
'.shadow-red-50': { viewShadowColor: '#fef2f2' }
'.shadow-red-100': { viewShadowColor: '#fee2e2' }
'.shadow-red-200': { viewShadowColor: '#fecaca' }
'.shadow-red-300': { viewShadowColor: '#fca5a5' }
'.shadow-red-400': { viewShadowColor: '#f87171' }
'.shadow-red-500': { viewShadowColor: '#ef4444' }
'.shadow-red-600': { viewShadowColor: '#dc2626' }
'.shadow-red-700': { viewShadowColor: '#b91c1c' }
'.shadow-red-800': { viewShadowColor: '#991b1b' }
'.shadow-red-900': { viewShadowColor: '#7f1d1d' }
'.shadow-orange-50': { viewShadowColor: '#fff7ed' }
'.shadow-orange-100': { viewShadowColor: '#ffedd5' }
'.shadow-orange-200': { viewShadowColor: '#fed7aa' }
'.shadow-orange-300': { viewShadowColor: '#fdba74' }
'.shadow-orange-400': { viewShadowColor: '#fb923c' }
'.shadow-orange-500': { viewShadowColor: '#f97316' }
'.shadow-orange-600': { viewShadowColor: '#ea580c' }
'.shadow-orange-700': { viewShadowColor: '#c2410c' }
'.shadow-orange-800': { viewShadowColor: '#9a3412' }
'.shadow-orange-900': { viewShadowColor: '#7c2d12' }
'.shadow-amber-50': { viewShadowColor: '#fffbeb' }
'.shadow-amber-100': { viewShadowColor: '#fef3c7' }
'.shadow-amber-200': { viewShadowColor: '#fde68a' }
'.shadow-amber-300': { viewShadowColor: '#fcd34d' }
'.shadow-amber-400': { viewShadowColor: '#fbbf24' }
'.shadow-amber-500': { viewShadowColor: '#f59e0b' }
'.shadow-amber-600': { viewShadowColor: '#d97706' }
'.shadow-amber-700': { viewShadowColor: '#b45309' }
'.shadow-amber-800': { viewShadowColor: '#92400e' }
'.shadow-amber-900': { viewShadowColor: '#78350f' }
'.shadow-yellow-50': { viewShadowColor: '#fefce8' }
'.shadow-yellow-100': { viewShadowColor: '#fef9c3' }
'.shadow-yellow-200': { viewShadowColor: '#fef08a' }
'.shadow-yellow-300': { viewShadowColor: '#fde047' }
'.shadow-yellow-400': { viewShadowColor: '#facc15' }
'.shadow-yellow-500': { viewShadowColor: '#eab308' }
'.shadow-yellow-600': { viewShadowColor: '#ca8a04' }
'.shadow-yellow-700': { viewShadowColor: '#a16207' }
'.shadow-yellow-800': { viewShadowColor: '#854d0e' }
'.shadow-yellow-900': { viewShadowColor: '#713f12' }
'.shadow-lime-50': { viewShadowColor: '#f7fee7' }
'.shadow-lime-100': { viewShadowColor: '#ecfccb' }
'.shadow-lime-200': { viewShadowColor: '#d9f99d' }
'.shadow-lime-300': { viewShadowColor: '#bef264' }
'.shadow-lime-400': { viewShadowColor: '#a3e635' }
'.shadow-lime-500': { viewShadowColor: '#84cc16' }
'.shadow-lime-600': { viewShadowColor: '#65a30d' }
'.shadow-lime-700': { viewShadowColor: '#4d7c0f' }
'.shadow-lime-800': { viewShadowColor: '#3f6212' }
'.shadow-lime-900': { viewShadowColor: '#365314' }
'.shadow-green-50': { viewShadowColor: '#f0fdf4' }
'.shadow-green-100': { viewShadowColor: '#dcfce7' }
'.shadow-green-200': { viewShadowColor: '#bbf7d0' }
'.shadow-green-300': { viewShadowColor: '#86efac' }
'.shadow-green-400': { viewShadowColor: '#4ade80' }
'.shadow-green-500': { viewShadowColor: '#22c55e' }
'.shadow-green-600': { viewShadowColor: '#16a34a' }
'.shadow-green-700': { viewShadowColor: '#15803d' }
'.shadow-green-800': { viewShadowColor: '#166534' }
'.shadow-green-900': { viewShadowColor: '#14532d' }
'.shadow-emerald-50': { viewShadowColor: '#ecfdf5' }
'.shadow-emerald-100': { viewShadowColor: '#d1fae5' }
'.shadow-emerald-200': { viewShadowColor: '#a7f3d0' }
'.shadow-emerald-300': { viewShadowColor: '#6ee7b7' }
'.shadow-emerald-400': { viewShadowColor: '#34d399' }
'.shadow-emerald-500': { viewShadowColor: '#10b981' }
'.shadow-emerald-600': { viewShadowColor: '#059669' }
'.shadow-emerald-700': { viewShadowColor: '#047857' }
'.shadow-emerald-800': { viewShadowColor: '#065f46' }
'.shadow-emerald-900': { viewShadowColor: '#064e3b' }
'.shadow-teal-50': { viewShadowColor: '#f0fdfa' }
'.shadow-teal-100': { viewShadowColor: '#ccfbf1' }
'.shadow-teal-200': { viewShadowColor: '#99f6e4' }
'.shadow-teal-300': { viewShadowColor: '#5eead4' }
'.shadow-teal-400': { viewShadowColor: '#2dd4bf' }
'.shadow-teal-500': { viewShadowColor: '#14b8a6' }
'.shadow-teal-600': { viewShadowColor: '#0d9488' }
'.shadow-teal-700': { viewShadowColor: '#0f766e' }
'.shadow-teal-800': { viewShadowColor: '#115e59' }
'.shadow-teal-900': { viewShadowColor: '#134e4a' }
'.shadow-cyan-50': { viewShadowColor: '#ecfeff' }
'.shadow-cyan-100': { viewShadowColor: '#cffafe' }
'.shadow-cyan-200': { viewShadowColor: '#a5f3fc' }
'.shadow-cyan-300': { viewShadowColor: '#67e8f9' }
'.shadow-cyan-400': { viewShadowColor: '#22d3ee' }
'.shadow-cyan-500': { viewShadowColor: '#06b6d4' }
'.shadow-cyan-600': { viewShadowColor: '#0891b2' }
'.shadow-cyan-700': { viewShadowColor: '#0e7490' }
'.shadow-cyan-800': { viewShadowColor: '#155e75' }
'.shadow-cyan-900': { viewShadowColor: '#164e63' }
'.shadow-sky-50': { viewShadowColor: '#f0f9ff' }
'.shadow-sky-100': { viewShadowColor: '#e0f2fe' }
'.shadow-sky-200': { viewShadowColor: '#bae6fd' }
'.shadow-sky-300': { viewShadowColor: '#7dd3fc' }
'.shadow-sky-400': { viewShadowColor: '#38bdf8' }
'.shadow-sky-500': { viewShadowColor: '#0ea5e9' }
'.shadow-sky-600': { viewShadowColor: '#0284c7' }
'.shadow-sky-700': { viewShadowColor: '#0369a1' }
'.shadow-sky-800': { viewShadowColor: '#075985' }
'.shadow-sky-900': { viewShadowColor: '#0c4a6e' }
'.shadow-blue-50': { viewShadowColor: '#eff6ff' }
'.shadow-blue-100': { viewShadowColor: '#dbeafe' }
'.shadow-blue-200': { viewShadowColor: '#bfdbfe' }
'.shadow-blue-300': { viewShadowColor: '#93c5fd' }
'.shadow-blue-400': { viewShadowColor: '#60a5fa' }
'.shadow-blue-500': { viewShadowColor: '#3b82f6' }
'.shadow-blue-600': { viewShadowColor: '#2563eb' }
'.shadow-blue-700': { viewShadowColor: '#1d4ed8' }
'.shadow-blue-800': { viewShadowColor: '#1e40af' }
'.shadow-blue-900': { viewShadowColor: '#1e3a8a' }
'.shadow-indigo-50': { viewShadowColor: '#eef2ff' }
'.shadow-indigo-100': { viewShadowColor: '#e0e7ff' }
'.shadow-indigo-200': { viewShadowColor: '#c7d2fe' }
'.shadow-indigo-300': { viewShadowColor: '#a5b4fc' }
'.shadow-indigo-400': { viewShadowColor: '#818cf8' }
'.shadow-indigo-500': { viewShadowColor: '#6366f1' }
'.shadow-indigo-600': { viewShadowColor: '#4f46e5' }
'.shadow-indigo-700': { viewShadowColor: '#4338ca' }
'.shadow-indigo-800': { viewShadowColor: '#3730a3' }
'.shadow-indigo-900': { viewShadowColor: '#312e81' }
'.shadow-violet-50': { viewShadowColor: '#f5f3ff' }
'.shadow-violet-100': { viewShadowColor: '#ede9fe' }
'.shadow-violet-200': { viewShadowColor: '#ddd6fe' }
'.shadow-violet-300': { viewShadowColor: '#c4b5fd' }
'.shadow-violet-400': { viewShadowColor: '#a78bfa' }
'.shadow-violet-500': { viewShadowColor: '#8b5cf6' }
'.shadow-violet-600': { viewShadowColor: '#7c3aed' }
'.shadow-violet-700': { viewShadowColor: '#6d28d9' }
'.shadow-violet-800': { viewShadowColor: '#5b21b6' }
'.shadow-violet-900': { viewShadowColor: '#4c1d95' }
'.shadow-purple-50': { viewShadowColor: '#faf5ff' }
'.shadow-purple-100': { viewShadowColor: '#f3e8ff' }
'.shadow-purple-200': { viewShadowColor: '#e9d5ff' }
'.shadow-purple-300': { viewShadowColor: '#d8b4fe' }
'.shadow-purple-400': { viewShadowColor: '#c084fc' }
'.shadow-purple-500': { viewShadowColor: '#a855f7' }
'.shadow-purple-600': { viewShadowColor: '#9333ea' }
'.shadow-purple-700': { viewShadowColor: '#7e22ce' }
'.shadow-purple-800': { viewShadowColor: '#6b21a8' }
'.shadow-purple-900': { viewShadowColor: '#581c87' }
'.shadow-fuchsia-50': { viewShadowColor: '#fdf4ff' }
'.shadow-fuchsia-100': { viewShadowColor: '#fae8ff' }
'.shadow-fuchsia-200': { viewShadowColor: '#f5d0fe' }
'.shadow-fuchsia-300': { viewShadowColor: '#f0abfc' }
'.shadow-fuchsia-400': { viewShadowColor: '#e879f9' }
'.shadow-fuchsia-500': { viewShadowColor: '#d946ef' }
'.shadow-fuchsia-600': { viewShadowColor: '#c026d3' }
'.shadow-fuchsia-700': { viewShadowColor: '#a21caf' }
'.shadow-fuchsia-800': { viewShadowColor: '#86198f' }
'.shadow-fuchsia-900': { viewShadowColor: '#701a75' }
'.shadow-pink-50': { viewShadowColor: '#fdf2f8' }
'.shadow-pink-100': { viewShadowColor: '#fce7f3' }
'.shadow-pink-200': { viewShadowColor: '#fbcfe8' }
'.shadow-pink-300': { viewShadowColor: '#f9a8d4' }
'.shadow-pink-400': { viewShadowColor: '#f472b6' }
'.shadow-pink-500': { viewShadowColor: '#ec4899' }
'.shadow-pink-600': { viewShadowColor: '#db2777' }
'.shadow-pink-700': { viewShadowColor: '#be185d' }
'.shadow-pink-800': { viewShadowColor: '#9d174d' }
'.shadow-pink-900': { viewShadowColor: '#831843' }
'.shadow-rose-50': { viewShadowColor: '#fff1f2' }
'.shadow-rose-100': { viewShadowColor: '#ffe4e6' }
'.shadow-rose-200': { viewShadowColor: '#fecdd3' }
'.shadow-rose-300': { viewShadowColor: '#fda4af' }
'.shadow-rose-400': { viewShadowColor: '#fb7185' }
'.shadow-rose-500': { viewShadowColor: '#f43f5e' }
'.shadow-rose-600': { viewShadowColor: '#e11d48' }
'.shadow-rose-700': { viewShadowColor: '#be123c' }
'.shadow-rose-800': { viewShadowColor: '#9f1239' }
'.shadow-rose-900': { viewShadowColor: '#881337' }
```

## showCancel Property
```css
'.show-cancel': { showCancel: true }
'.hide-cancel': { showCancel: false }
```

## TabGroup/Tab Properties
### activeTintColor Property
```css
'.active-tint-transparent': { activeTintColor: 'transparent' }
'.active-tint-black': { activeTintColor: '#000000' }
'.active-tint-white': { activeTintColor: '#ffffff' }
'.active-tint-rose-50': { activeTintColor: '#fff1f2' }
'.active-tint-rose-100': { activeTintColor: '#ffe4e6' }
'.active-tint-rose-200': { activeTintColor: '#fecdd3' }
'.active-tint-rose-300': { activeTintColor: '#fda4af' }
'.active-tint-rose-400': { activeTintColor: '#fb7185' }
'.active-tint-rose-500': { activeTintColor: '#f43f5e' }
'.active-tint-rose-600': { activeTintColor: '#e11d48' }
'.active-tint-rose-700': { activeTintColor: '#be123c' }
'.active-tint-rose-800': { activeTintColor: '#9f1239' }
'.active-tint-rose-900': { activeTintColor: '#881337' }
'.active-tint-pink-50': { activeTintColor: '#fdf2f8' }
'.active-tint-pink-100': { activeTintColor: '#fce7f3' }
'.active-tint-pink-200': { activeTintColor: '#fbcfe8' }
'.active-tint-pink-300': { activeTintColor: '#f9a8d4' }
'.active-tint-pink-400': { activeTintColor: '#f472b6' }
'.active-tint-pink-500': { activeTintColor: '#ec4899' }
'.active-tint-pink-600': { activeTintColor: '#db2777' }
'.active-tint-pink-700': { activeTintColor: '#be185d' }
'.active-tint-pink-800': { activeTintColor: '#9d174d' }
'.active-tint-pink-900': { activeTintColor: '#831843' }
'.active-tint-fuchsia-50': { activeTintColor: '#fdf4ff' }
'.active-tint-fuchsia-100': { activeTintColor: '#fae8ff' }
'.active-tint-fuchsia-200': { activeTintColor: '#f5d0fe' }
'.active-tint-fuchsia-300': { activeTintColor: '#f0abfc' }
'.active-tint-fuchsia-400': { activeTintColor: '#e879f9' }
'.active-tint-fuchsia-500': { activeTintColor: '#d946ef' }
'.active-tint-fuchsia-600': { activeTintColor: '#c026d3' }
'.active-tint-fuchsia-700': { activeTintColor: '#a21caf' }
'.active-tint-fuchsia-800': { activeTintColor: '#86198f' }
'.active-tint-fuchsia-900': { activeTintColor: '#701a75' }
'.active-tint-purple-50': { activeTintColor: '#faf5ff' }
'.active-tint-purple-100': { activeTintColor: '#f3e8ff' }
'.active-tint-purple-200': { activeTintColor: '#e9d5ff' }
'.active-tint-purple-300': { activeTintColor: '#d8b4fe' }
'.active-tint-purple-400': { activeTintColor: '#c084fc' }
'.active-tint-purple-500': { activeTintColor: '#a855f7' }
'.active-tint-purple-600': { activeTintColor: '#9333ea' }
'.active-tint-purple-700': { activeTintColor: '#7e22ce' }
'.active-tint-purple-800': { activeTintColor: '#6b21a8' }
'.active-tint-purple-900': { activeTintColor: '#581c87' }
'.active-tint-violet-50': { activeTintColor: '#f5f3ff' }
'.active-tint-violet-100': { activeTintColor: '#ede9fe' }
'.active-tint-violet-200': { activeTintColor: '#ddd6fe' }
'.active-tint-violet-300': { activeTintColor: '#c4b5fd' }
'.active-tint-violet-400': { activeTintColor: '#a78bfa' }
'.active-tint-violet-500': { activeTintColor: '#8b5cf6' }
'.active-tint-violet-600': { activeTintColor: '#7c3aed' }
'.active-tint-violet-700': { activeTintColor: '#6d28d9' }
'.active-tint-violet-800': { activeTintColor: '#5b21b6' }
'.active-tint-violet-900': { activeTintColor: '#4c1d95' }
'.active-tint-indigo-50': { activeTintColor: '#eef2ff' }
'.active-tint-indigo-100': { activeTintColor: '#e0e7ff' }
'.active-tint-indigo-200': { activeTintColor: '#c7d2fe' }
'.active-tint-indigo-300': { activeTintColor: '#a5b4fc' }
'.active-tint-indigo-400': { activeTintColor: '#818cf8' }
'.active-tint-indigo-500': { activeTintColor: '#6366f1' }
'.active-tint-indigo-600': { activeTintColor: '#4f46e5' }
'.active-tint-indigo-700': { activeTintColor: '#4338ca' }
'.active-tint-indigo-800': { activeTintColor: '#3730a3' }
'.active-tint-indigo-900': { activeTintColor: '#312e81' }
'.active-tint-blue-50': { activeTintColor: '#eff6ff' }
'.active-tint-blue-100': { activeTintColor: '#dbeafe' }
'.active-tint-blue-200': { activeTintColor: '#bfdbfe' }
'.active-tint-blue-300': { activeTintColor: '#93c5fd' }
'.active-tint-blue-400': { activeTintColor: '#60a5fa' }
'.active-tint-blue-500': { activeTintColor: '#3b82f6' }
'.active-tint-blue-600': { activeTintColor: '#2563eb' }
'.active-tint-blue-700': { activeTintColor: '#1d4ed8' }
'.active-tint-blue-800': { activeTintColor: '#1e40af' }
'.active-tint-blue-900': { activeTintColor: '#1e3a8a' }
'.active-tint-sky-50': { activeTintColor: '#f0f9ff' }
'.active-tint-sky-100': { activeTintColor: '#e0f2fe' }
'.active-tint-sky-200': { activeTintColor: '#bae6fd' }
'.active-tint-sky-300': { activeTintColor: '#7dd3fc' }
'.active-tint-sky-400': { activeTintColor: '#38bdf8' }
'.active-tint-sky-500': { activeTintColor: '#0ea5e9' }
'.active-tint-sky-600': { activeTintColor: '#0284c7' }
'.active-tint-sky-700': { activeTintColor: '#0369a1' }
'.active-tint-sky-800': { activeTintColor: '#075985' }
'.active-tint-sky-900': { activeTintColor: '#0c4a6e' }
'.active-tint-cyan-50': { activeTintColor: '#ecfeff' }
'.active-tint-cyan-100': { activeTintColor: '#cffafe' }
'.active-tint-cyan-200': { activeTintColor: '#a5f3fc' }
'.active-tint-cyan-300': { activeTintColor: '#67e8f9' }
'.active-tint-cyan-400': { activeTintColor: '#22d3ee' }
'.active-tint-cyan-500': { activeTintColor: '#06b6d4' }
'.active-tint-cyan-600': { activeTintColor: '#0891b2' }
'.active-tint-cyan-700': { activeTintColor: '#0e7490' }
'.active-tint-cyan-800': { activeTintColor: '#155e75' }
'.active-tint-cyan-900': { activeTintColor: '#164e63' }
'.active-tint-teal-50': { activeTintColor: '#f0fdfa' }
'.active-tint-teal-100': { activeTintColor: '#ccfbf1' }
'.active-tint-teal-200': { activeTintColor: '#99f6e4' }
'.active-tint-teal-300': { activeTintColor: '#5eead4' }
'.active-tint-teal-400': { activeTintColor: '#2dd4bf' }
'.active-tint-teal-500': { activeTintColor: '#14b8a6' }
'.active-tint-teal-600': { activeTintColor: '#0d9488' }
'.active-tint-teal-700': { activeTintColor: '#0f766e' }
'.active-tint-teal-800': { activeTintColor: '#115e59' }
'.active-tint-teal-900': { activeTintColor: '#134e4a' }
'.active-tint-emerald-50': { activeTintColor: '#ecfdf5' }
'.active-tint-emerald-100': { activeTintColor: '#d1fae5' }
'.active-tint-emerald-200': { activeTintColor: '#a7f3d0' }
'.active-tint-emerald-300': { activeTintColor: '#6ee7b7' }
'.active-tint-emerald-400': { activeTintColor: '#34d399' }
'.active-tint-emerald-500': { activeTintColor: '#10b981' }
'.active-tint-emerald-600': { activeTintColor: '#059669' }
'.active-tint-emerald-700': { activeTintColor: '#047857' }
'.active-tint-emerald-800': { activeTintColor: '#065f46' }
'.active-tint-emerald-900': { activeTintColor: '#064e3b' }
'.active-tint-green-50': { activeTintColor: '#f0fdf4' }
'.active-tint-green-100': { activeTintColor: '#dcfce7' }
'.active-tint-green-200': { activeTintColor: '#bbf7d0' }
'.active-tint-green-300': { activeTintColor: '#86efac' }
'.active-tint-green-400': { activeTintColor: '#4ade80' }
'.active-tint-green-500': { activeTintColor: '#22c55e' }
'.active-tint-green-600': { activeTintColor: '#16a34a' }
'.active-tint-green-700': { activeTintColor: '#15803d' }
'.active-tint-green-800': { activeTintColor: '#166534' }
'.active-tint-green-900': { activeTintColor: '#14532d' }
'.active-tint-lime-50': { activeTintColor: '#f7fee7' }
'.active-tint-lime-100': { activeTintColor: '#ecfccb' }
'.active-tint-lime-200': { activeTintColor: '#d9f99d' }
'.active-tint-lime-300': { activeTintColor: '#bef264' }
'.active-tint-lime-400': { activeTintColor: '#a3e635' }
'.active-tint-lime-500': { activeTintColor: '#84cc16' }
'.active-tint-lime-600': { activeTintColor: '#65a30d' }
'.active-tint-lime-700': { activeTintColor: '#4d7c0f' }
'.active-tint-lime-800': { activeTintColor: '#3f6212' }
'.active-tint-lime-900': { activeTintColor: '#365314' }
'.active-tint-yellow-50': { activeTintColor: '#fefce8' }
'.active-tint-yellow-100': { activeTintColor: '#fef9c3' }
'.active-tint-yellow-200': { activeTintColor: '#fef08a' }
'.active-tint-yellow-300': { activeTintColor: '#fde047' }
'.active-tint-yellow-400': { activeTintColor: '#facc15' }
'.active-tint-yellow-500': { activeTintColor: '#eab308' }
'.active-tint-yellow-600': { activeTintColor: '#ca8a04' }
'.active-tint-yellow-700': { activeTintColor: '#a16207' }
'.active-tint-yellow-800': { activeTintColor: '#854d0e' }
'.active-tint-yellow-900': { activeTintColor: '#713f12' }
'.active-tint-amber-50': { activeTintColor: '#fffbeb' }
'.active-tint-amber-100': { activeTintColor: '#fef3c7' }
'.active-tint-amber-200': { activeTintColor: '#fde68a' }
'.active-tint-amber-300': { activeTintColor: '#fcd34d' }
'.active-tint-amber-400': { activeTintColor: '#fbbf24' }
'.active-tint-amber-500': { activeTintColor: '#f59e0b' }
'.active-tint-amber-600': { activeTintColor: '#d97706' }
'.active-tint-amber-700': { activeTintColor: '#b45309' }
'.active-tint-amber-800': { activeTintColor: '#92400e' }
'.active-tint-amber-900': { activeTintColor: '#78350f' }
'.active-tint-orange-50': { activeTintColor: '#fff7ed' }
'.active-tint-orange-100': { activeTintColor: '#ffedd5' }
'.active-tint-orange-200': { activeTintColor: '#fed7aa' }
'.active-tint-orange-300': { activeTintColor: '#fdba74' }
'.active-tint-orange-400': { activeTintColor: '#fb923c' }
'.active-tint-orange-500': { activeTintColor: '#f97316' }
'.active-tint-orange-600': { activeTintColor: '#ea580c' }
'.active-tint-orange-700': { activeTintColor: '#c2410c' }
'.active-tint-orange-800': { activeTintColor: '#9a3412' }
'.active-tint-orange-900': { activeTintColor: '#7c2d12' }
'.active-tint-red-50': { activeTintColor: '#fef2f2' }
'.active-tint-red-100': { activeTintColor: '#fee2e2' }
'.active-tint-red-200': { activeTintColor: '#fecaca' }
'.active-tint-red-300': { activeTintColor: '#fca5a5' }
'.active-tint-red-400': { activeTintColor: '#f87171' }
'.active-tint-red-500': { activeTintColor: '#ef4444' }
'.active-tint-red-600': { activeTintColor: '#dc2626' }
'.active-tint-red-700': { activeTintColor: '#b91c1c' }
'.active-tint-red-800': { activeTintColor: '#991b1b' }
'.active-tint-red-900': { activeTintColor: '#7f1d1d' }
'.active-tint-warmGray-50': { activeTintColor: '#fafaf9' }
'.active-tint-warmGray-100': { activeTintColor: '#f5f5f4' }
'.active-tint-warmGray-200': { activeTintColor: '#e7e5e4' }
'.active-tint-warmGray-300': { activeTintColor: '#d6d3d1' }
'.active-tint-warmGray-400': { activeTintColor: '#a8a29e' }
'.active-tint-warmGray-500': { activeTintColor: '#78716c' }
'.active-tint-warmGray-600': { activeTintColor: '#57534e' }
'.active-tint-warmGray-700': { activeTintColor: '#44403c' }
'.active-tint-warmGray-800': { activeTintColor: '#292524' }
'.active-tint-warmGray-900': { activeTintColor: '#1c1917' }
'.active-tint-trueGray-50': { activeTintColor: '#fafafa' }
'.active-tint-trueGray-100': { activeTintColor: '#f5f5f5' }
'.active-tint-trueGray-200': { activeTintColor: '#e5e5e5' }
'.active-tint-trueGray-300': { activeTintColor: '#d4d4d4' }
'.active-tint-trueGray-400': { activeTintColor: '#a3a3a3' }
'.active-tint-trueGray-500': { activeTintColor: '#737373' }
'.active-tint-trueGray-600': { activeTintColor: '#525252' }
'.active-tint-trueGray-700': { activeTintColor: '#404040' }
'.active-tint-trueGray-800': { activeTintColor: '#262626' }
'.active-tint-trueGray-900': { activeTintColor: '#171717' }
'.active-tint-gray-50': { activeTintColor: '#fafafa' }
'.active-tint-gray-100': { activeTintColor: '#f4f4f5' }
'.active-tint-gray-200': { activeTintColor: '#e4e4e7' }
'.active-tint-gray-300': { activeTintColor: '#d4d4d8' }
'.active-tint-gray-400': { activeTintColor: '#a1a1aa' }
'.active-tint-gray-500': { activeTintColor: '#71717a' }
'.active-tint-gray-600': { activeTintColor: '#52525b' }
'.active-tint-gray-700': { activeTintColor: '#3f3f46' }
'.active-tint-gray-800': { activeTintColor: '#27272a' }
'.active-tint-gray-900': { activeTintColor: '#18181b' }
'.active-tint-coolGray-50': { activeTintColor: '#f9fafb' }
'.active-tint-coolGray-100': { activeTintColor: '#f3f4f6' }
'.active-tint-coolGray-200': { activeTintColor: '#e5e7eb' }
'.active-tint-coolGray-300': { activeTintColor: '#d1d5db' }
'.active-tint-coolGray-400': { activeTintColor: '#9ca3af' }
'.active-tint-coolGray-500': { activeTintColor: '#6b7280' }
'.active-tint-coolGray-600': { activeTintColor: '#4b5563' }
'.active-tint-coolGray-700': { activeTintColor: '#374151' }
'.active-tint-coolGray-800': { activeTintColor: '#1f2937' }
'.active-tint-coolGray-900': { activeTintColor: '#111827' }
'.active-tint-blueGray-50': { activeTintColor: '#f8fafc' }
'.active-tint-blueGray-100': { activeTintColor: '#f1f5f9' }
'.active-tint-blueGray-200': { activeTintColor: '#e2e8f0' }
'.active-tint-blueGray-300': { activeTintColor: '#cbd5e1' }
'.active-tint-blueGray-400': { activeTintColor: '#94a3b8' }
'.active-tint-blueGray-500': { activeTintColor: '#64748b' }
'.active-tint-blueGray-600': { activeTintColor: '#475569' }
'.active-tint-blueGray-700': { activeTintColor: '#334155' }
'.active-tint-blueGray-800': { activeTintColor: '#1e293b' }
'.active-tint-blueGray-900': { activeTintColor: '#0f172a' }
```

### activeTitleColor Property
```css
'.active-title-transparent': { activeTitleColor: 'transparent' }
'.active-title-black': { activeTitleColor: '#000000' }
'.active-title-white': { activeTitleColor: '#ffffff' }
'.active-title-rose-50': { activeTitleColor: '#fff1f2' }
'.active-title-rose-100': { activeTitleColor: '#ffe4e6' }
'.active-title-rose-200': { activeTitleColor: '#fecdd3' }
'.active-title-rose-300': { activeTitleColor: '#fda4af' }
'.active-title-rose-400': { activeTitleColor: '#fb7185' }
'.active-title-rose-500': { activeTitleColor: '#f43f5e' }
'.active-title-rose-600': { activeTitleColor: '#e11d48' }
'.active-title-rose-700': { activeTitleColor: '#be123c' }
'.active-title-rose-800': { activeTitleColor: '#9f1239' }
'.active-title-rose-900': { activeTitleColor: '#881337' }
'.active-title-pink-50': { activeTitleColor: '#fdf2f8' }
'.active-title-pink-100': { activeTitleColor: '#fce7f3' }
'.active-title-pink-200': { activeTitleColor: '#fbcfe8' }
'.active-title-pink-300': { activeTitleColor: '#f9a8d4' }
'.active-title-pink-400': { activeTitleColor: '#f472b6' }
'.active-title-pink-500': { activeTitleColor: '#ec4899' }
'.active-title-pink-600': { activeTitleColor: '#db2777' }
'.active-title-pink-700': { activeTitleColor: '#be185d' }
'.active-title-pink-800': { activeTitleColor: '#9d174d' }
'.active-title-pink-900': { activeTitleColor: '#831843' }
'.active-title-fuchsia-50': { activeTitleColor: '#fdf4ff' }
'.active-title-fuchsia-100': { activeTitleColor: '#fae8ff' }
'.active-title-fuchsia-200': { activeTitleColor: '#f5d0fe' }
'.active-title-fuchsia-300': { activeTitleColor: '#f0abfc' }
'.active-title-fuchsia-400': { activeTitleColor: '#e879f9' }
'.active-title-fuchsia-500': { activeTitleColor: '#d946ef' }
'.active-title-fuchsia-600': { activeTitleColor: '#c026d3' }
'.active-title-fuchsia-700': { activeTitleColor: '#a21caf' }
'.active-title-fuchsia-800': { activeTitleColor: '#86198f' }
'.active-title-fuchsia-900': { activeTitleColor: '#701a75' }
'.active-title-purple-50': { activeTitleColor: '#faf5ff' }
'.active-title-purple-100': { activeTitleColor: '#f3e8ff' }
'.active-title-purple-200': { activeTitleColor: '#e9d5ff' }
'.active-title-purple-300': { activeTitleColor: '#d8b4fe' }
'.active-title-purple-400': { activeTitleColor: '#c084fc' }
'.active-title-purple-500': { activeTitleColor: '#a855f7' }
'.active-title-purple-600': { activeTitleColor: '#9333ea' }
'.active-title-purple-700': { activeTitleColor: '#7e22ce' }
'.active-title-purple-800': { activeTitleColor: '#6b21a8' }
'.active-title-purple-900': { activeTitleColor: '#581c87' }
'.active-title-violet-50': { activeTitleColor: '#f5f3ff' }
'.active-title-violet-100': { activeTitleColor: '#ede9fe' }
'.active-title-violet-200': { activeTitleColor: '#ddd6fe' }
'.active-title-violet-300': { activeTitleColor: '#c4b5fd' }
'.active-title-violet-400': { activeTitleColor: '#a78bfa' }
'.active-title-violet-500': { activeTitleColor: '#8b5cf6' }
'.active-title-violet-600': { activeTitleColor: '#7c3aed' }
'.active-title-violet-700': { activeTitleColor: '#6d28d9' }
'.active-title-violet-800': { activeTitleColor: '#5b21b6' }
'.active-title-violet-900': { activeTitleColor: '#4c1d95' }
'.active-title-indigo-50': { activeTitleColor: '#eef2ff' }
'.active-title-indigo-100': { activeTitleColor: '#e0e7ff' }
'.active-title-indigo-200': { activeTitleColor: '#c7d2fe' }
'.active-title-indigo-300': { activeTitleColor: '#a5b4fc' }
'.active-title-indigo-400': { activeTitleColor: '#818cf8' }
'.active-title-indigo-500': { activeTitleColor: '#6366f1' }
'.active-title-indigo-600': { activeTitleColor: '#4f46e5' }
'.active-title-indigo-700': { activeTitleColor: '#4338ca' }
'.active-title-indigo-800': { activeTitleColor: '#3730a3' }
'.active-title-indigo-900': { activeTitleColor: '#312e81' }
'.active-title-blue-50': { activeTitleColor: '#eff6ff' }
'.active-title-blue-100': { activeTitleColor: '#dbeafe' }
'.active-title-blue-200': { activeTitleColor: '#bfdbfe' }
'.active-title-blue-300': { activeTitleColor: '#93c5fd' }
'.active-title-blue-400': { activeTitleColor: '#60a5fa' }
'.active-title-blue-500': { activeTitleColor: '#3b82f6' }
'.active-title-blue-600': { activeTitleColor: '#2563eb' }
'.active-title-blue-700': { activeTitleColor: '#1d4ed8' }
'.active-title-blue-800': { activeTitleColor: '#1e40af' }
'.active-title-blue-900': { activeTitleColor: '#1e3a8a' }
'.active-title-sky-50': { activeTitleColor: '#f0f9ff' }
'.active-title-sky-100': { activeTitleColor: '#e0f2fe' }
'.active-title-sky-200': { activeTitleColor: '#bae6fd' }
'.active-title-sky-300': { activeTitleColor: '#7dd3fc' }
'.active-title-sky-400': { activeTitleColor: '#38bdf8' }
'.active-title-sky-500': { activeTitleColor: '#0ea5e9' }
'.active-title-sky-600': { activeTitleColor: '#0284c7' }
'.active-title-sky-700': { activeTitleColor: '#0369a1' }
'.active-title-sky-800': { activeTitleColor: '#075985' }
'.active-title-sky-900': { activeTitleColor: '#0c4a6e' }
'.active-title-cyan-50': { activeTitleColor: '#ecfeff' }
'.active-title-cyan-100': { activeTitleColor: '#cffafe' }
'.active-title-cyan-200': { activeTitleColor: '#a5f3fc' }
'.active-title-cyan-300': { activeTitleColor: '#67e8f9' }
'.active-title-cyan-400': { activeTitleColor: '#22d3ee' }
'.active-title-cyan-500': { activeTitleColor: '#06b6d4' }
'.active-title-cyan-600': { activeTitleColor: '#0891b2' }
'.active-title-cyan-700': { activeTitleColor: '#0e7490' }
'.active-title-cyan-800': { activeTitleColor: '#155e75' }
'.active-title-cyan-900': { activeTitleColor: '#164e63' }
'.active-title-teal-50': { activeTitleColor: '#f0fdfa' }
'.active-title-teal-100': { activeTitleColor: '#ccfbf1' }
'.active-title-teal-200': { activeTitleColor: '#99f6e4' }
'.active-title-teal-300': { activeTitleColor: '#5eead4' }
'.active-title-teal-400': { activeTitleColor: '#2dd4bf' }
'.active-title-teal-500': { activeTitleColor: '#14b8a6' }
'.active-title-teal-600': { activeTitleColor: '#0d9488' }
'.active-title-teal-700': { activeTitleColor: '#0f766e' }
'.active-title-teal-800': { activeTitleColor: '#115e59' }
'.active-title-teal-900': { activeTitleColor: '#134e4a' }
'.active-title-emerald-50': { activeTitleColor: '#ecfdf5' }
'.active-title-emerald-100': { activeTitleColor: '#d1fae5' }
'.active-title-emerald-200': { activeTitleColor: '#a7f3d0' }
'.active-title-emerald-300': { activeTitleColor: '#6ee7b7' }
'.active-title-emerald-400': { activeTitleColor: '#34d399' }
'.active-title-emerald-500': { activeTitleColor: '#10b981' }
'.active-title-emerald-600': { activeTitleColor: '#059669' }
'.active-title-emerald-700': { activeTitleColor: '#047857' }
'.active-title-emerald-800': { activeTitleColor: '#065f46' }
'.active-title-emerald-900': { activeTitleColor: '#064e3b' }
'.active-title-green-50': { activeTitleColor: '#f0fdf4' }
'.active-title-green-100': { activeTitleColor: '#dcfce7' }
'.active-title-green-200': { activeTitleColor: '#bbf7d0' }
'.active-title-green-300': { activeTitleColor: '#86efac' }
'.active-title-green-400': { activeTitleColor: '#4ade80' }
'.active-title-green-500': { activeTitleColor: '#22c55e' }
'.active-title-green-600': { activeTitleColor: '#16a34a' }
'.active-title-green-700': { activeTitleColor: '#15803d' }
'.active-title-green-800': { activeTitleColor: '#166534' }
'.active-title-green-900': { activeTitleColor: '#14532d' }
'.active-title-lime-50': { activeTitleColor: '#f7fee7' }
'.active-title-lime-100': { activeTitleColor: '#ecfccb' }
'.active-title-lime-200': { activeTitleColor: '#d9f99d' }
'.active-title-lime-300': { activeTitleColor: '#bef264' }
'.active-title-lime-400': { activeTitleColor: '#a3e635' }
'.active-title-lime-500': { activeTitleColor: '#84cc16' }
'.active-title-lime-600': { activeTitleColor: '#65a30d' }
'.active-title-lime-700': { activeTitleColor: '#4d7c0f' }
'.active-title-lime-800': { activeTitleColor: '#3f6212' }
'.active-title-lime-900': { activeTitleColor: '#365314' }
'.active-title-yellow-50': { activeTitleColor: '#fefce8' }
'.active-title-yellow-100': { activeTitleColor: '#fef9c3' }
'.active-title-yellow-200': { activeTitleColor: '#fef08a' }
'.active-title-yellow-300': { activeTitleColor: '#fde047' }
'.active-title-yellow-400': { activeTitleColor: '#facc15' }
'.active-title-yellow-500': { activeTitleColor: '#eab308' }
'.active-title-yellow-600': { activeTitleColor: '#ca8a04' }
'.active-title-yellow-700': { activeTitleColor: '#a16207' }
'.active-title-yellow-800': { activeTitleColor: '#854d0e' }
'.active-title-yellow-900': { activeTitleColor: '#713f12' }
'.active-title-amber-50': { activeTitleColor: '#fffbeb' }
'.active-title-amber-100': { activeTitleColor: '#fef3c7' }
'.active-title-amber-200': { activeTitleColor: '#fde68a' }
'.active-title-amber-300': { activeTitleColor: '#fcd34d' }
'.active-title-amber-400': { activeTitleColor: '#fbbf24' }
'.active-title-amber-500': { activeTitleColor: '#f59e0b' }
'.active-title-amber-600': { activeTitleColor: '#d97706' }
'.active-title-amber-700': { activeTitleColor: '#b45309' }
'.active-title-amber-800': { activeTitleColor: '#92400e' }
'.active-title-amber-900': { activeTitleColor: '#78350f' }
'.active-title-orange-50': { activeTitleColor: '#fff7ed' }
'.active-title-orange-100': { activeTitleColor: '#ffedd5' }
'.active-title-orange-200': { activeTitleColor: '#fed7aa' }
'.active-title-orange-300': { activeTitleColor: '#fdba74' }
'.active-title-orange-400': { activeTitleColor: '#fb923c' }
'.active-title-orange-500': { activeTitleColor: '#f97316' }
'.active-title-orange-600': { activeTitleColor: '#ea580c' }
'.active-title-orange-700': { activeTitleColor: '#c2410c' }
'.active-title-orange-800': { activeTitleColor: '#9a3412' }
'.active-title-orange-900': { activeTitleColor: '#7c2d12' }
'.active-title-red-50': { activeTitleColor: '#fef2f2' }
'.active-title-red-100': { activeTitleColor: '#fee2e2' }
'.active-title-red-200': { activeTitleColor: '#fecaca' }
'.active-title-red-300': { activeTitleColor: '#fca5a5' }
'.active-title-red-400': { activeTitleColor: '#f87171' }
'.active-title-red-500': { activeTitleColor: '#ef4444' }
'.active-title-red-600': { activeTitleColor: '#dc2626' }
'.active-title-red-700': { activeTitleColor: '#b91c1c' }
'.active-title-red-800': { activeTitleColor: '#991b1b' }
'.active-title-red-900': { activeTitleColor: '#7f1d1d' }
'.active-title-warmGray-50': { activeTitleColor: '#fafaf9' }
'.active-title-warmGray-100': { activeTitleColor: '#f5f5f4' }
'.active-title-warmGray-200': { activeTitleColor: '#e7e5e4' }
'.active-title-warmGray-300': { activeTitleColor: '#d6d3d1' }
'.active-title-warmGray-400': { activeTitleColor: '#a8a29e' }
'.active-title-warmGray-500': { activeTitleColor: '#78716c' }
'.active-title-warmGray-600': { activeTitleColor: '#57534e' }
'.active-title-warmGray-700': { activeTitleColor: '#44403c' }
'.active-title-warmGray-800': { activeTitleColor: '#292524' }
'.active-title-warmGray-900': { activeTitleColor: '#1c1917' }
'.active-title-trueGray-50': { activeTitleColor: '#fafafa' }
'.active-title-trueGray-100': { activeTitleColor: '#f5f5f5' }
'.active-title-trueGray-200': { activeTitleColor: '#e5e5e5' }
'.active-title-trueGray-300': { activeTitleColor: '#d4d4d4' }
'.active-title-trueGray-400': { activeTitleColor: '#a3a3a3' }
'.active-title-trueGray-500': { activeTitleColor: '#737373' }
'.active-title-trueGray-600': { activeTitleColor: '#525252' }
'.active-title-trueGray-700': { activeTitleColor: '#404040' }
'.active-title-trueGray-800': { activeTitleColor: '#262626' }
'.active-title-trueGray-900': { activeTitleColor: '#171717' }
'.active-title-gray-50': { activeTitleColor: '#fafafa' }
'.active-title-gray-100': { activeTitleColor: '#f4f4f5' }
'.active-title-gray-200': { activeTitleColor: '#e4e4e7' }
'.active-title-gray-300': { activeTitleColor: '#d4d4d8' }
'.active-title-gray-400': { activeTitleColor: '#a1a1aa' }
'.active-title-gray-500': { activeTitleColor: '#71717a' }
'.active-title-gray-600': { activeTitleColor: '#52525b' }
'.active-title-gray-700': { activeTitleColor: '#3f3f46' }
'.active-title-gray-800': { activeTitleColor: '#27272a' }
'.active-title-gray-900': { activeTitleColor: '#18181b' }
'.active-title-coolGray-50': { activeTitleColor: '#f9fafb' }
'.active-title-coolGray-100': { activeTitleColor: '#f3f4f6' }
'.active-title-coolGray-200': { activeTitleColor: '#e5e7eb' }
'.active-title-coolGray-300': { activeTitleColor: '#d1d5db' }
'.active-title-coolGray-400': { activeTitleColor: '#9ca3af' }
'.active-title-coolGray-500': { activeTitleColor: '#6b7280' }
'.active-title-coolGray-600': { activeTitleColor: '#4b5563' }
'.active-title-coolGray-700': { activeTitleColor: '#374151' }
'.active-title-coolGray-800': { activeTitleColor: '#1f2937' }
'.active-title-coolGray-900': { activeTitleColor: '#111827' }
'.active-title-blueGray-50': { activeTitleColor: '#f8fafc' }
'.active-title-blueGray-100': { activeTitleColor: '#f1f5f9' }
'.active-title-blueGray-200': { activeTitleColor: '#e2e8f0' }
'.active-title-blueGray-300': { activeTitleColor: '#cbd5e1' }
'.active-title-blueGray-400': { activeTitleColor: '#94a3b8' }
'.active-title-blueGray-500': { activeTitleColor: '#64748b' }
'.active-title-blueGray-600': { activeTitleColor: '#475569' }
'.active-title-blueGray-700': { activeTitleColor: '#334155' }
'.active-title-blueGray-800': { activeTitleColor: '#1e293b' }
'.active-title-blueGray-900': { activeTitleColor: '#0f172a' }
```

### tabsBackgroundColor Property
```css
'.tabs-bg-transparent': { tabsBackgroundColor: 'transparent' }
'.tabs-bg-black': { tabsBackgroundColor: '#000000' }
'.tabs-bg-white': { tabsBackgroundColor: '#ffffff' }
'.tabs-bg-rose-50': { tabsBackgroundColor: '#fff1f2' }
'.tabs-bg-rose-100': { tabsBackgroundColor: '#ffe4e6' }
'.tabs-bg-rose-200': { tabsBackgroundColor: '#fecdd3' }
'.tabs-bg-rose-300': { tabsBackgroundColor: '#fda4af' }
'.tabs-bg-rose-400': { tabsBackgroundColor: '#fb7185' }
'.tabs-bg-rose-500': { tabsBackgroundColor: '#f43f5e' }
'.tabs-bg-rose-600': { tabsBackgroundColor: '#e11d48' }
'.tabs-bg-rose-700': { tabsBackgroundColor: '#be123c' }
'.tabs-bg-rose-800': { tabsBackgroundColor: '#9f1239' }
'.tabs-bg-rose-900': { tabsBackgroundColor: '#881337' }
'.tabs-bg-pink-50': { tabsBackgroundColor: '#fdf2f8' }
'.tabs-bg-pink-100': { tabsBackgroundColor: '#fce7f3' }
'.tabs-bg-pink-200': { tabsBackgroundColor: '#fbcfe8' }
'.tabs-bg-pink-300': { tabsBackgroundColor: '#f9a8d4' }
'.tabs-bg-pink-400': { tabsBackgroundColor: '#f472b6' }
'.tabs-bg-pink-500': { tabsBackgroundColor: '#ec4899' }
'.tabs-bg-pink-600': { tabsBackgroundColor: '#db2777' }
'.tabs-bg-pink-700': { tabsBackgroundColor: '#be185d' }
'.tabs-bg-pink-800': { tabsBackgroundColor: '#9d174d' }
'.tabs-bg-pink-900': { tabsBackgroundColor: '#831843' }
'.tabs-bg-fuchsia-50': { tabsBackgroundColor: '#fdf4ff' }
'.tabs-bg-fuchsia-100': { tabsBackgroundColor: '#fae8ff' }
'.tabs-bg-fuchsia-200': { tabsBackgroundColor: '#f5d0fe' }
'.tabs-bg-fuchsia-300': { tabsBackgroundColor: '#f0abfc' }
'.tabs-bg-fuchsia-400': { tabsBackgroundColor: '#e879f9' }
'.tabs-bg-fuchsia-500': { tabsBackgroundColor: '#d946ef' }
'.tabs-bg-fuchsia-600': { tabsBackgroundColor: '#c026d3' }
'.tabs-bg-fuchsia-700': { tabsBackgroundColor: '#a21caf' }
'.tabs-bg-fuchsia-800': { tabsBackgroundColor: '#86198f' }
'.tabs-bg-fuchsia-900': { tabsBackgroundColor: '#701a75' }
'.tabs-bg-purple-50': { tabsBackgroundColor: '#faf5ff' }
'.tabs-bg-purple-100': { tabsBackgroundColor: '#f3e8ff' }
'.tabs-bg-purple-200': { tabsBackgroundColor: '#e9d5ff' }
'.tabs-bg-purple-300': { tabsBackgroundColor: '#d8b4fe' }
'.tabs-bg-purple-400': { tabsBackgroundColor: '#c084fc' }
'.tabs-bg-purple-500': { tabsBackgroundColor: '#a855f7' }
'.tabs-bg-purple-600': { tabsBackgroundColor: '#9333ea' }
'.tabs-bg-purple-700': { tabsBackgroundColor: '#7e22ce' }
'.tabs-bg-purple-800': { tabsBackgroundColor: '#6b21a8' }
'.tabs-bg-purple-900': { tabsBackgroundColor: '#581c87' }
'.tabs-bg-violet-50': { tabsBackgroundColor: '#f5f3ff' }
'.tabs-bg-violet-100': { tabsBackgroundColor: '#ede9fe' }
'.tabs-bg-violet-200': { tabsBackgroundColor: '#ddd6fe' }
'.tabs-bg-violet-300': { tabsBackgroundColor: '#c4b5fd' }
'.tabs-bg-violet-400': { tabsBackgroundColor: '#a78bfa' }
'.tabs-bg-violet-500': { tabsBackgroundColor: '#8b5cf6' }
'.tabs-bg-violet-600': { tabsBackgroundColor: '#7c3aed' }
'.tabs-bg-violet-700': { tabsBackgroundColor: '#6d28d9' }
'.tabs-bg-violet-800': { tabsBackgroundColor: '#5b21b6' }
'.tabs-bg-violet-900': { tabsBackgroundColor: '#4c1d95' }
'.tabs-bg-indigo-50': { tabsBackgroundColor: '#eef2ff' }
'.tabs-bg-indigo-100': { tabsBackgroundColor: '#e0e7ff' }
'.tabs-bg-indigo-200': { tabsBackgroundColor: '#c7d2fe' }
'.tabs-bg-indigo-300': { tabsBackgroundColor: '#a5b4fc' }
'.tabs-bg-indigo-400': { tabsBackgroundColor: '#818cf8' }
'.tabs-bg-indigo-500': { tabsBackgroundColor: '#6366f1' }
'.tabs-bg-indigo-600': { tabsBackgroundColor: '#4f46e5' }
'.tabs-bg-indigo-700': { tabsBackgroundColor: '#4338ca' }
'.tabs-bg-indigo-800': { tabsBackgroundColor: '#3730a3' }
'.tabs-bg-indigo-900': { tabsBackgroundColor: '#312e81' }
'.tabs-bg-blue-50': { tabsBackgroundColor: '#eff6ff' }
'.tabs-bg-blue-100': { tabsBackgroundColor: '#dbeafe' }
'.tabs-bg-blue-200': { tabsBackgroundColor: '#bfdbfe' }
'.tabs-bg-blue-300': { tabsBackgroundColor: '#93c5fd' }
'.tabs-bg-blue-400': { tabsBackgroundColor: '#60a5fa' }
'.tabs-bg-blue-500': { tabsBackgroundColor: '#3b82f6' }
'.tabs-bg-blue-600': { tabsBackgroundColor: '#2563eb' }
'.tabs-bg-blue-700': { tabsBackgroundColor: '#1d4ed8' }
'.tabs-bg-blue-800': { tabsBackgroundColor: '#1e40af' }
'.tabs-bg-blue-900': { tabsBackgroundColor: '#1e3a8a' }
'.tabs-bg-sky-50': { tabsBackgroundColor: '#f0f9ff' }
'.tabs-bg-sky-100': { tabsBackgroundColor: '#e0f2fe' }
'.tabs-bg-sky-200': { tabsBackgroundColor: '#bae6fd' }
'.tabs-bg-sky-300': { tabsBackgroundColor: '#7dd3fc' }
'.tabs-bg-sky-400': { tabsBackgroundColor: '#38bdf8' }
'.tabs-bg-sky-500': { tabsBackgroundColor: '#0ea5e9' }
'.tabs-bg-sky-600': { tabsBackgroundColor: '#0284c7' }
'.tabs-bg-sky-700': { tabsBackgroundColor: '#0369a1' }
'.tabs-bg-sky-800': { tabsBackgroundColor: '#075985' }
'.tabs-bg-sky-900': { tabsBackgroundColor: '#0c4a6e' }
'.tabs-bg-cyan-50': { tabsBackgroundColor: '#ecfeff' }
'.tabs-bg-cyan-100': { tabsBackgroundColor: '#cffafe' }
'.tabs-bg-cyan-200': { tabsBackgroundColor: '#a5f3fc' }
'.tabs-bg-cyan-300': { tabsBackgroundColor: '#67e8f9' }
'.tabs-bg-cyan-400': { tabsBackgroundColor: '#22d3ee' }
'.tabs-bg-cyan-500': { tabsBackgroundColor: '#06b6d4' }
'.tabs-bg-cyan-600': { tabsBackgroundColor: '#0891b2' }
'.tabs-bg-cyan-700': { tabsBackgroundColor: '#0e7490' }
'.tabs-bg-cyan-800': { tabsBackgroundColor: '#155e75' }
'.tabs-bg-cyan-900': { tabsBackgroundColor: '#164e63' }
'.tabs-bg-teal-50': { tabsBackgroundColor: '#f0fdfa' }
'.tabs-bg-teal-100': { tabsBackgroundColor: '#ccfbf1' }
'.tabs-bg-teal-200': { tabsBackgroundColor: '#99f6e4' }
'.tabs-bg-teal-300': { tabsBackgroundColor: '#5eead4' }
'.tabs-bg-teal-400': { tabsBackgroundColor: '#2dd4bf' }
'.tabs-bg-teal-500': { tabsBackgroundColor: '#14b8a6' }
'.tabs-bg-teal-600': { tabsBackgroundColor: '#0d9488' }
'.tabs-bg-teal-700': { tabsBackgroundColor: '#0f766e' }
'.tabs-bg-teal-800': { tabsBackgroundColor: '#115e59' }
'.tabs-bg-teal-900': { tabsBackgroundColor: '#134e4a' }
'.tabs-bg-emerald-50': { tabsBackgroundColor: '#ecfdf5' }
'.tabs-bg-emerald-100': { tabsBackgroundColor: '#d1fae5' }
'.tabs-bg-emerald-200': { tabsBackgroundColor: '#a7f3d0' }
'.tabs-bg-emerald-300': { tabsBackgroundColor: '#6ee7b7' }
'.tabs-bg-emerald-400': { tabsBackgroundColor: '#34d399' }
'.tabs-bg-emerald-500': { tabsBackgroundColor: '#10b981' }
'.tabs-bg-emerald-600': { tabsBackgroundColor: '#059669' }
'.tabs-bg-emerald-700': { tabsBackgroundColor: '#047857' }
'.tabs-bg-emerald-800': { tabsBackgroundColor: '#065f46' }
'.tabs-bg-emerald-900': { tabsBackgroundColor: '#064e3b' }
'.tabs-bg-green-50': { tabsBackgroundColor: '#f0fdf4' }
'.tabs-bg-green-100': { tabsBackgroundColor: '#dcfce7' }
'.tabs-bg-green-200': { tabsBackgroundColor: '#bbf7d0' }
'.tabs-bg-green-300': { tabsBackgroundColor: '#86efac' }
'.tabs-bg-green-400': { tabsBackgroundColor: '#4ade80' }
'.tabs-bg-green-500': { tabsBackgroundColor: '#22c55e' }
'.tabs-bg-green-600': { tabsBackgroundColor: '#16a34a' }
'.tabs-bg-green-700': { tabsBackgroundColor: '#15803d' }
'.tabs-bg-green-800': { tabsBackgroundColor: '#166534' }
'.tabs-bg-green-900': { tabsBackgroundColor: '#14532d' }
'.tabs-bg-lime-50': { tabsBackgroundColor: '#f7fee7' }
'.tabs-bg-lime-100': { tabsBackgroundColor: '#ecfccb' }
'.tabs-bg-lime-200': { tabsBackgroundColor: '#d9f99d' }
'.tabs-bg-lime-300': { tabsBackgroundColor: '#bef264' }
'.tabs-bg-lime-400': { tabsBackgroundColor: '#a3e635' }
'.tabs-bg-lime-500': { tabsBackgroundColor: '#84cc16' }
'.tabs-bg-lime-600': { tabsBackgroundColor: '#65a30d' }
'.tabs-bg-lime-700': { tabsBackgroundColor: '#4d7c0f' }
'.tabs-bg-lime-800': { tabsBackgroundColor: '#3f6212' }
'.tabs-bg-lime-900': { tabsBackgroundColor: '#365314' }
'.tabs-bg-yellow-50': { tabsBackgroundColor: '#fefce8' }
'.tabs-bg-yellow-100': { tabsBackgroundColor: '#fef9c3' }
'.tabs-bg-yellow-200': { tabsBackgroundColor: '#fef08a' }
'.tabs-bg-yellow-300': { tabsBackgroundColor: '#fde047' }
'.tabs-bg-yellow-400': { tabsBackgroundColor: '#facc15' }
'.tabs-bg-yellow-500': { tabsBackgroundColor: '#eab308' }
'.tabs-bg-yellow-600': { tabsBackgroundColor: '#ca8a04' }
'.tabs-bg-yellow-700': { tabsBackgroundColor: '#a16207' }
'.tabs-bg-yellow-800': { tabsBackgroundColor: '#854d0e' }
'.tabs-bg-yellow-900': { tabsBackgroundColor: '#713f12' }
'.tabs-bg-amber-50': { tabsBackgroundColor: '#fffbeb' }
'.tabs-bg-amber-100': { tabsBackgroundColor: '#fef3c7' }
'.tabs-bg-amber-200': { tabsBackgroundColor: '#fde68a' }
'.tabs-bg-amber-300': { tabsBackgroundColor: '#fcd34d' }
'.tabs-bg-amber-400': { tabsBackgroundColor: '#fbbf24' }
'.tabs-bg-amber-500': { tabsBackgroundColor: '#f59e0b' }
'.tabs-bg-amber-600': { tabsBackgroundColor: '#d97706' }
'.tabs-bg-amber-700': { tabsBackgroundColor: '#b45309' }
'.tabs-bg-amber-800': { tabsBackgroundColor: '#92400e' }
'.tabs-bg-amber-900': { tabsBackgroundColor: '#78350f' }
'.tabs-bg-orange-50': { tabsBackgroundColor: '#fff7ed' }
'.tabs-bg-orange-100': { tabsBackgroundColor: '#ffedd5' }
'.tabs-bg-orange-200': { tabsBackgroundColor: '#fed7aa' }
'.tabs-bg-orange-300': { tabsBackgroundColor: '#fdba74' }
'.tabs-bg-orange-400': { tabsBackgroundColor: '#fb923c' }
'.tabs-bg-orange-500': { tabsBackgroundColor: '#f97316' }
'.tabs-bg-orange-600': { tabsBackgroundColor: '#ea580c' }
'.tabs-bg-orange-700': { tabsBackgroundColor: '#c2410c' }
'.tabs-bg-orange-800': { tabsBackgroundColor: '#9a3412' }
'.tabs-bg-orange-900': { tabsBackgroundColor: '#7c2d12' }
'.tabs-bg-red-50': { tabsBackgroundColor: '#fef2f2' }
'.tabs-bg-red-100': { tabsBackgroundColor: '#fee2e2' }
'.tabs-bg-red-200': { tabsBackgroundColor: '#fecaca' }
'.tabs-bg-red-300': { tabsBackgroundColor: '#fca5a5' }
'.tabs-bg-red-400': { tabsBackgroundColor: '#f87171' }
'.tabs-bg-red-500': { tabsBackgroundColor: '#ef4444' }
'.tabs-bg-red-600': { tabsBackgroundColor: '#dc2626' }
'.tabs-bg-red-700': { tabsBackgroundColor: '#b91c1c' }
'.tabs-bg-red-800': { tabsBackgroundColor: '#991b1b' }
'.tabs-bg-red-900': { tabsBackgroundColor: '#7f1d1d' }
'.tabs-bg-warmGray-50': { tabsBackgroundColor: '#fafaf9' }
'.tabs-bg-warmGray-100': { tabsBackgroundColor: '#f5f5f4' }
'.tabs-bg-warmGray-200': { tabsBackgroundColor: '#e7e5e4' }
'.tabs-bg-warmGray-300': { tabsBackgroundColor: '#d6d3d1' }
'.tabs-bg-warmGray-400': { tabsBackgroundColor: '#a8a29e' }
'.tabs-bg-warmGray-500': { tabsBackgroundColor: '#78716c' }
'.tabs-bg-warmGray-600': { tabsBackgroundColor: '#57534e' }
'.tabs-bg-warmGray-700': { tabsBackgroundColor: '#44403c' }
'.tabs-bg-warmGray-800': { tabsBackgroundColor: '#292524' }
'.tabs-bg-warmGray-900': { tabsBackgroundColor: '#1c1917' }
'.tabs-bg-trueGray-50': { tabsBackgroundColor: '#fafafa' }
'.tabs-bg-trueGray-100': { tabsBackgroundColor: '#f5f5f5' }
'.tabs-bg-trueGray-200': { tabsBackgroundColor: '#e5e5e5' }
'.tabs-bg-trueGray-300': { tabsBackgroundColor: '#d4d4d4' }
'.tabs-bg-trueGray-400': { tabsBackgroundColor: '#a3a3a3' }
'.tabs-bg-trueGray-500': { tabsBackgroundColor: '#737373' }
'.tabs-bg-trueGray-600': { tabsBackgroundColor: '#525252' }
'.tabs-bg-trueGray-700': { tabsBackgroundColor: '#404040' }
'.tabs-bg-trueGray-800': { tabsBackgroundColor: '#262626' }
'.tabs-bg-trueGray-900': { tabsBackgroundColor: '#171717' }
'.tabs-bg-gray-50': { tabsBackgroundColor: '#fafafa' }
'.tabs-bg-gray-100': { tabsBackgroundColor: '#f4f4f5' }
'.tabs-bg-gray-200': { tabsBackgroundColor: '#e4e4e7' }
'.tabs-bg-gray-300': { tabsBackgroundColor: '#d4d4d8' }
'.tabs-bg-gray-400': { tabsBackgroundColor: '#a1a1aa' }
'.tabs-bg-gray-500': { tabsBackgroundColor: '#71717a' }
'.tabs-bg-gray-600': { tabsBackgroundColor: '#52525b' }
'.tabs-bg-gray-700': { tabsBackgroundColor: '#3f3f46' }
'.tabs-bg-gray-800': { tabsBackgroundColor: '#27272a' }
'.tabs-bg-gray-900': { tabsBackgroundColor: '#18181b' }
'.tabs-bg-coolGray-50': { tabsBackgroundColor: '#f9fafb' }
'.tabs-bg-coolGray-100': { tabsBackgroundColor: '#f3f4f6' }
'.tabs-bg-coolGray-200': { tabsBackgroundColor: '#e5e7eb' }
'.tabs-bg-coolGray-300': { tabsBackgroundColor: '#d1d5db' }
'.tabs-bg-coolGray-400': { tabsBackgroundColor: '#9ca3af' }
'.tabs-bg-coolGray-500': { tabsBackgroundColor: '#6b7280' }
'.tabs-bg-coolGray-600': { tabsBackgroundColor: '#4b5563' }
'.tabs-bg-coolGray-700': { tabsBackgroundColor: '#374151' }
'.tabs-bg-coolGray-800': { tabsBackgroundColor: '#1f2937' }
'.tabs-bg-coolGray-900': { tabsBackgroundColor: '#111827' }
'.tabs-bg-blueGray-50': { tabsBackgroundColor: '#f8fafc' }
'.tabs-bg-blueGray-100': { tabsBackgroundColor: '#f1f5f9' }
'.tabs-bg-blueGray-200': { tabsBackgroundColor: '#e2e8f0' }
'.tabs-bg-blueGray-300': { tabsBackgroundColor: '#cbd5e1' }
'.tabs-bg-blueGray-400': { tabsBackgroundColor: '#94a3b8' }
'.tabs-bg-blueGray-500': { tabsBackgroundColor: '#64748b' }
'.tabs-bg-blueGray-600': { tabsBackgroundColor: '#475569' }
'.tabs-bg-blueGray-700': { tabsBackgroundColor: '#334155' }
'.tabs-bg-blueGray-800': { tabsBackgroundColor: '#1e293b' }
'.tabs-bg-blueGray-900': { tabsBackgroundColor: '#0f172a' }
```

### titleColor Property
```css
'.title-transparent': { titleColor: 'transparent' }
'.title-black': { titleColor: '#000000' }
'.title-white': { titleColor: '#ffffff' }
'.title-rose-50': { titleColor: '#fff1f2' }
'.title-rose-100': { titleColor: '#ffe4e6' }
'.title-rose-200': { titleColor: '#fecdd3' }
'.title-rose-300': { titleColor: '#fda4af' }
'.title-rose-400': { titleColor: '#fb7185' }
'.title-rose-500': { titleColor: '#f43f5e' }
'.title-rose-600': { titleColor: '#e11d48' }
'.title-rose-700': { titleColor: '#be123c' }
'.title-rose-800': { titleColor: '#9f1239' }
'.title-rose-900': { titleColor: '#881337' }
'.title-pink-50': { titleColor: '#fdf2f8' }
'.title-pink-100': { titleColor: '#fce7f3' }
'.title-pink-200': { titleColor: '#fbcfe8' }
'.title-pink-300': { titleColor: '#f9a8d4' }
'.title-pink-400': { titleColor: '#f472b6' }
'.title-pink-500': { titleColor: '#ec4899' }
'.title-pink-600': { titleColor: '#db2777' }
'.title-pink-700': { titleColor: '#be185d' }
'.title-pink-800': { titleColor: '#9d174d' }
'.title-pink-900': { titleColor: '#831843' }
'.title-fuchsia-50': { titleColor: '#fdf4ff' }
'.title-fuchsia-100': { titleColor: '#fae8ff' }
'.title-fuchsia-200': { titleColor: '#f5d0fe' }
'.title-fuchsia-300': { titleColor: '#f0abfc' }
'.title-fuchsia-400': { titleColor: '#e879f9' }
'.title-fuchsia-500': { titleColor: '#d946ef' }
'.title-fuchsia-600': { titleColor: '#c026d3' }
'.title-fuchsia-700': { titleColor: '#a21caf' }
'.title-fuchsia-800': { titleColor: '#86198f' }
'.title-fuchsia-900': { titleColor: '#701a75' }
'.title-purple-50': { titleColor: '#faf5ff' }
'.title-purple-100': { titleColor: '#f3e8ff' }
'.title-purple-200': { titleColor: '#e9d5ff' }
'.title-purple-300': { titleColor: '#d8b4fe' }
'.title-purple-400': { titleColor: '#c084fc' }
'.title-purple-500': { titleColor: '#a855f7' }
'.title-purple-600': { titleColor: '#9333ea' }
'.title-purple-700': { titleColor: '#7e22ce' }
'.title-purple-800': { titleColor: '#6b21a8' }
'.title-purple-900': { titleColor: '#581c87' }
'.title-violet-50': { titleColor: '#f5f3ff' }
'.title-violet-100': { titleColor: '#ede9fe' }
'.title-violet-200': { titleColor: '#ddd6fe' }
'.title-violet-300': { titleColor: '#c4b5fd' }
'.title-violet-400': { titleColor: '#a78bfa' }
'.title-violet-500': { titleColor: '#8b5cf6' }
'.title-violet-600': { titleColor: '#7c3aed' }
'.title-violet-700': { titleColor: '#6d28d9' }
'.title-violet-800': { titleColor: '#5b21b6' }
'.title-violet-900': { titleColor: '#4c1d95' }
'.title-indigo-50': { titleColor: '#eef2ff' }
'.title-indigo-100': { titleColor: '#e0e7ff' }
'.title-indigo-200': { titleColor: '#c7d2fe' }
'.title-indigo-300': { titleColor: '#a5b4fc' }
'.title-indigo-400': { titleColor: '#818cf8' }
'.title-indigo-500': { titleColor: '#6366f1' }
'.title-indigo-600': { titleColor: '#4f46e5' }
'.title-indigo-700': { titleColor: '#4338ca' }
'.title-indigo-800': { titleColor: '#3730a3' }
'.title-indigo-900': { titleColor: '#312e81' }
'.title-blue-50': { titleColor: '#eff6ff' }
'.title-blue-100': { titleColor: '#dbeafe' }
'.title-blue-200': { titleColor: '#bfdbfe' }
'.title-blue-300': { titleColor: '#93c5fd' }
'.title-blue-400': { titleColor: '#60a5fa' }
'.title-blue-500': { titleColor: '#3b82f6' }
'.title-blue-600': { titleColor: '#2563eb' }
'.title-blue-700': { titleColor: '#1d4ed8' }
'.title-blue-800': { titleColor: '#1e40af' }
'.title-blue-900': { titleColor: '#1e3a8a' }
'.title-sky-50': { titleColor: '#f0f9ff' }
'.title-sky-100': { titleColor: '#e0f2fe' }
'.title-sky-200': { titleColor: '#bae6fd' }
'.title-sky-300': { titleColor: '#7dd3fc' }
'.title-sky-400': { titleColor: '#38bdf8' }
'.title-sky-500': { titleColor: '#0ea5e9' }
'.title-sky-600': { titleColor: '#0284c7' }
'.title-sky-700': { titleColor: '#0369a1' }
'.title-sky-800': { titleColor: '#075985' }
'.title-sky-900': { titleColor: '#0c4a6e' }
'.title-cyan-50': { titleColor: '#ecfeff' }
'.title-cyan-100': { titleColor: '#cffafe' }
'.title-cyan-200': { titleColor: '#a5f3fc' }
'.title-cyan-300': { titleColor: '#67e8f9' }
'.title-cyan-400': { titleColor: '#22d3ee' }
'.title-cyan-500': { titleColor: '#06b6d4' }
'.title-cyan-600': { titleColor: '#0891b2' }
'.title-cyan-700': { titleColor: '#0e7490' }
'.title-cyan-800': { titleColor: '#155e75' }
'.title-cyan-900': { titleColor: '#164e63' }
'.title-teal-50': { titleColor: '#f0fdfa' }
'.title-teal-100': { titleColor: '#ccfbf1' }
'.title-teal-200': { titleColor: '#99f6e4' }
'.title-teal-300': { titleColor: '#5eead4' }
'.title-teal-400': { titleColor: '#2dd4bf' }
'.title-teal-500': { titleColor: '#14b8a6' }
'.title-teal-600': { titleColor: '#0d9488' }
'.title-teal-700': { titleColor: '#0f766e' }
'.title-teal-800': { titleColor: '#115e59' }
'.title-teal-900': { titleColor: '#134e4a' }
'.title-emerald-50': { titleColor: '#ecfdf5' }
'.title-emerald-100': { titleColor: '#d1fae5' }
'.title-emerald-200': { titleColor: '#a7f3d0' }
'.title-emerald-300': { titleColor: '#6ee7b7' }
'.title-emerald-400': { titleColor: '#34d399' }
'.title-emerald-500': { titleColor: '#10b981' }
'.title-emerald-600': { titleColor: '#059669' }
'.title-emerald-700': { titleColor: '#047857' }
'.title-emerald-800': { titleColor: '#065f46' }
'.title-emerald-900': { titleColor: '#064e3b' }
'.title-green-50': { titleColor: '#f0fdf4' }
'.title-green-100': { titleColor: '#dcfce7' }
'.title-green-200': { titleColor: '#bbf7d0' }
'.title-green-300': { titleColor: '#86efac' }
'.title-green-400': { titleColor: '#4ade80' }
'.title-green-500': { titleColor: '#22c55e' }
'.title-green-600': { titleColor: '#16a34a' }
'.title-green-700': { titleColor: '#15803d' }
'.title-green-800': { titleColor: '#166534' }
'.title-green-900': { titleColor: '#14532d' }
'.title-lime-50': { titleColor: '#f7fee7' }
'.title-lime-100': { titleColor: '#ecfccb' }
'.title-lime-200': { titleColor: '#d9f99d' }
'.title-lime-300': { titleColor: '#bef264' }
'.title-lime-400': { titleColor: '#a3e635' }
'.title-lime-500': { titleColor: '#84cc16' }
'.title-lime-600': { titleColor: '#65a30d' }
'.title-lime-700': { titleColor: '#4d7c0f' }
'.title-lime-800': { titleColor: '#3f6212' }
'.title-lime-900': { titleColor: '#365314' }
'.title-yellow-50': { titleColor: '#fefce8' }
'.title-yellow-100': { titleColor: '#fef9c3' }
'.title-yellow-200': { titleColor: '#fef08a' }
'.title-yellow-300': { titleColor: '#fde047' }
'.title-yellow-400': { titleColor: '#facc15' }
'.title-yellow-500': { titleColor: '#eab308' }
'.title-yellow-600': { titleColor: '#ca8a04' }
'.title-yellow-700': { titleColor: '#a16207' }
'.title-yellow-800': { titleColor: '#854d0e' }
'.title-yellow-900': { titleColor: '#713f12' }
'.title-amber-50': { titleColor: '#fffbeb' }
'.title-amber-100': { titleColor: '#fef3c7' }
'.title-amber-200': { titleColor: '#fde68a' }
'.title-amber-300': { titleColor: '#fcd34d' }
'.title-amber-400': { titleColor: '#fbbf24' }
'.title-amber-500': { titleColor: '#f59e0b' }
'.title-amber-600': { titleColor: '#d97706' }
'.title-amber-700': { titleColor: '#b45309' }
'.title-amber-800': { titleColor: '#92400e' }
'.title-amber-900': { titleColor: '#78350f' }
'.title-orange-50': { titleColor: '#fff7ed' }
'.title-orange-100': { titleColor: '#ffedd5' }
'.title-orange-200': { titleColor: '#fed7aa' }
'.title-orange-300': { titleColor: '#fdba74' }
'.title-orange-400': { titleColor: '#fb923c' }
'.title-orange-500': { titleColor: '#f97316' }
'.title-orange-600': { titleColor: '#ea580c' }
'.title-orange-700': { titleColor: '#c2410c' }
'.title-orange-800': { titleColor: '#9a3412' }
'.title-orange-900': { titleColor: '#7c2d12' }
'.title-red-50': { titleColor: '#fef2f2' }
'.title-red-100': { titleColor: '#fee2e2' }
'.title-red-200': { titleColor: '#fecaca' }
'.title-red-300': { titleColor: '#fca5a5' }
'.title-red-400': { titleColor: '#f87171' }
'.title-red-500': { titleColor: '#ef4444' }
'.title-red-600': { titleColor: '#dc2626' }
'.title-red-700': { titleColor: '#b91c1c' }
'.title-red-800': { titleColor: '#991b1b' }
'.title-red-900': { titleColor: '#7f1d1d' }
'.title-warmGray-50': { titleColor: '#fafaf9' }
'.title-warmGray-100': { titleColor: '#f5f5f4' }
'.title-warmGray-200': { titleColor: '#e7e5e4' }
'.title-warmGray-300': { titleColor: '#d6d3d1' }
'.title-warmGray-400': { titleColor: '#a8a29e' }
'.title-warmGray-500': { titleColor: '#78716c' }
'.title-warmGray-600': { titleColor: '#57534e' }
'.title-warmGray-700': { titleColor: '#44403c' }
'.title-warmGray-800': { titleColor: '#292524' }
'.title-warmGray-900': { titleColor: '#1c1917' }
'.title-trueGray-50': { titleColor: '#fafafa' }
'.title-trueGray-100': { titleColor: '#f5f5f5' }
'.title-trueGray-200': { titleColor: '#e5e5e5' }
'.title-trueGray-300': { titleColor: '#d4d4d4' }
'.title-trueGray-400': { titleColor: '#a3a3a3' }
'.title-trueGray-500': { titleColor: '#737373' }
'.title-trueGray-600': { titleColor: '#525252' }
'.title-trueGray-700': { titleColor: '#404040' }
'.title-trueGray-800': { titleColor: '#262626' }
'.title-trueGray-900': { titleColor: '#171717' }
'.title-gray-50': { titleColor: '#fafafa' }
'.title-gray-100': { titleColor: '#f4f4f5' }
'.title-gray-200': { titleColor: '#e4e4e7' }
'.title-gray-300': { titleColor: '#d4d4d8' }
'.title-gray-400': { titleColor: '#a1a1aa' }
'.title-gray-500': { titleColor: '#71717a' }
'.title-gray-600': { titleColor: '#52525b' }
'.title-gray-700': { titleColor: '#3f3f46' }
'.title-gray-800': { titleColor: '#27272a' }
'.title-gray-900': { titleColor: '#18181b' }
'.title-coolGray-50': { titleColor: '#f9fafb' }
'.title-coolGray-100': { titleColor: '#f3f4f6' }
'.title-coolGray-200': { titleColor: '#e5e7eb' }
'.title-coolGray-300': { titleColor: '#d1d5db' }
'.title-coolGray-400': { titleColor: '#9ca3af' }
'.title-coolGray-500': { titleColor: '#6b7280' }
'.title-coolGray-600': { titleColor: '#4b5563' }
'.title-coolGray-700': { titleColor: '#374151' }
'.title-coolGray-800': { titleColor: '#1f2937' }
'.title-coolGray-900': { titleColor: '#111827' }
'.title-blueGray-50': { titleColor: '#f8fafc' }
'.title-blueGray-100': { titleColor: '#f1f5f9' }
'.title-blueGray-200': { titleColor: '#e2e8f0' }
'.title-blueGray-300': { titleColor: '#cbd5e1' }
'.title-blueGray-400': { titleColor: '#94a3b8' }
'.title-blueGray-500': { titleColor: '#64748b' }
'.title-blueGray-600': { titleColor: '#475569' }
'.title-blueGray-700': { titleColor: '#334155' }
'.title-blueGray-800': { titleColor: '#1e293b' }
'.title-blueGray-900': { titleColor: '#0f172a' }
```

## textAlign Property
```css
'.text-left': { textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT }
'.text-right': { textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT }
'.text-center': { textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER }
'.text-justify': { textAlign: Ti.UI.TEXT_ALIGNMENT_JUSTIFY }
```

## color Property
```css
'.text-transparent': { color: 'transparent' }
'.text-black': { color: '#000000' }
'.text-white': { color: '#ffffff' }
'.text-rose-50': { color: '#fff1f2' }
'.text-rose-100': { color: '#ffe4e6' }
'.text-rose-200': { color: '#fecdd3' }
'.text-rose-300': { color: '#fda4af' }
'.text-rose-400': { color: '#fb7185' }
'.text-rose-500': { color: '#f43f5e' }
'.text-rose-600': { color: '#e11d48' }
'.text-rose-700': { color: '#be123c' }
'.text-rose-800': { color: '#9f1239' }
'.text-rose-900': { color: '#881337' }
'.text-pink-50': { color: '#fdf2f8' }
'.text-pink-100': { color: '#fce7f3' }
'.text-pink-200': { color: '#fbcfe8' }
'.text-pink-300': { color: '#f9a8d4' }
'.text-pink-400': { color: '#f472b6' }
'.text-pink-500': { color: '#ec4899' }
'.text-pink-600': { color: '#db2777' }
'.text-pink-700': { color: '#be185d' }
'.text-pink-800': { color: '#9d174d' }
'.text-pink-900': { color: '#831843' }
'.text-fuchsia-50': { color: '#fdf4ff' }
'.text-fuchsia-100': { color: '#fae8ff' }
'.text-fuchsia-200': { color: '#f5d0fe' }
'.text-fuchsia-300': { color: '#f0abfc' }
'.text-fuchsia-400': { color: '#e879f9' }
'.text-fuchsia-500': { color: '#d946ef' }
'.text-fuchsia-600': { color: '#c026d3' }
'.text-fuchsia-700': { color: '#a21caf' }
'.text-fuchsia-800': { color: '#86198f' }
'.text-fuchsia-900': { color: '#701a75' }
'.text-purple-50': { color: '#faf5ff' }
'.text-purple-100': { color: '#f3e8ff' }
'.text-purple-200': { color: '#e9d5ff' }
'.text-purple-300': { color: '#d8b4fe' }
'.text-purple-400': { color: '#c084fc' }
'.text-purple-500': { color: '#a855f7' }
'.text-purple-600': { color: '#9333ea' }
'.text-purple-700': { color: '#7e22ce' }
'.text-purple-800': { color: '#6b21a8' }
'.text-purple-900': { color: '#581c87' }
'.text-violet-50': { color: '#f5f3ff' }
'.text-violet-100': { color: '#ede9fe' }
'.text-violet-200': { color: '#ddd6fe' }
'.text-violet-300': { color: '#c4b5fd' }
'.text-violet-400': { color: '#a78bfa' }
'.text-violet-500': { color: '#8b5cf6' }
'.text-violet-600': { color: '#7c3aed' }
'.text-violet-700': { color: '#6d28d9' }
'.text-violet-800': { color: '#5b21b6' }
'.text-violet-900': { color: '#4c1d95' }
'.text-indigo-50': { color: '#eef2ff' }
'.text-indigo-100': { color: '#e0e7ff' }
'.text-indigo-200': { color: '#c7d2fe' }
'.text-indigo-300': { color: '#a5b4fc' }
'.text-indigo-400': { color: '#818cf8' }
'.text-indigo-500': { color: '#6366f1' }
'.text-indigo-600': { color: '#4f46e5' }
'.text-indigo-700': { color: '#4338ca' }
'.text-indigo-800': { color: '#3730a3' }
'.text-indigo-900': { color: '#312e81' }
'.text-blue-50': { color: '#eff6ff' }
'.text-blue-100': { color: '#dbeafe' }
'.text-blue-200': { color: '#bfdbfe' }
'.text-blue-300': { color: '#93c5fd' }
'.text-blue-400': { color: '#60a5fa' }
'.text-blue-500': { color: '#3b82f6' }
'.text-blue-600': { color: '#2563eb' }
'.text-blue-700': { color: '#1d4ed8' }
'.text-blue-800': { color: '#1e40af' }
'.text-blue-900': { color: '#1e3a8a' }
'.text-sky-50': { color: '#f0f9ff' }
'.text-sky-100': { color: '#e0f2fe' }
'.text-sky-200': { color: '#bae6fd' }
'.text-sky-300': { color: '#7dd3fc' }
'.text-sky-400': { color: '#38bdf8' }
'.text-sky-500': { color: '#0ea5e9' }
'.text-sky-600': { color: '#0284c7' }
'.text-sky-700': { color: '#0369a1' }
'.text-sky-800': { color: '#075985' }
'.text-sky-900': { color: '#0c4a6e' }
'.text-cyan-50': { color: '#ecfeff' }
'.text-cyan-100': { color: '#cffafe' }
'.text-cyan-200': { color: '#a5f3fc' }
'.text-cyan-300': { color: '#67e8f9' }
'.text-cyan-400': { color: '#22d3ee' }
'.text-cyan-500': { color: '#06b6d4' }
'.text-cyan-600': { color: '#0891b2' }
'.text-cyan-700': { color: '#0e7490' }
'.text-cyan-800': { color: '#155e75' }
'.text-cyan-900': { color: '#164e63' }
'.text-teal-50': { color: '#f0fdfa' }
'.text-teal-100': { color: '#ccfbf1' }
'.text-teal-200': { color: '#99f6e4' }
'.text-teal-300': { color: '#5eead4' }
'.text-teal-400': { color: '#2dd4bf' }
'.text-teal-500': { color: '#14b8a6' }
'.text-teal-600': { color: '#0d9488' }
'.text-teal-700': { color: '#0f766e' }
'.text-teal-800': { color: '#115e59' }
'.text-teal-900': { color: '#134e4a' }
'.text-emerald-50': { color: '#ecfdf5' }
'.text-emerald-100': { color: '#d1fae5' }
'.text-emerald-200': { color: '#a7f3d0' }
'.text-emerald-300': { color: '#6ee7b7' }
'.text-emerald-400': { color: '#34d399' }
'.text-emerald-500': { color: '#10b981' }
'.text-emerald-600': { color: '#059669' }
'.text-emerald-700': { color: '#047857' }
'.text-emerald-800': { color: '#065f46' }
'.text-emerald-900': { color: '#064e3b' }
'.text-green-50': { color: '#f0fdf4' }
'.text-green-100': { color: '#dcfce7' }
'.text-green-200': { color: '#bbf7d0' }
'.text-green-300': { color: '#86efac' }
'.text-green-400': { color: '#4ade80' }
'.text-green-500': { color: '#22c55e' }
'.text-green-600': { color: '#16a34a' }
'.text-green-700': { color: '#15803d' }
'.text-green-800': { color: '#166534' }
'.text-green-900': { color: '#14532d' }
'.text-lime-50': { color: '#f7fee7' }
'.text-lime-100': { color: '#ecfccb' }
'.text-lime-200': { color: '#d9f99d' }
'.text-lime-300': { color: '#bef264' }
'.text-lime-400': { color: '#a3e635' }
'.text-lime-500': { color: '#84cc16' }
'.text-lime-600': { color: '#65a30d' }
'.text-lime-700': { color: '#4d7c0f' }
'.text-lime-800': { color: '#3f6212' }
'.text-lime-900': { color: '#365314' }
'.text-yellow-50': { color: '#fefce8' }
'.text-yellow-100': { color: '#fef9c3' }
'.text-yellow-200': { color: '#fef08a' }
'.text-yellow-300': { color: '#fde047' }
'.text-yellow-400': { color: '#facc15' }
'.text-yellow-500': { color: '#eab308' }
'.text-yellow-600': { color: '#ca8a04' }
'.text-yellow-700': { color: '#a16207' }
'.text-yellow-800': { color: '#854d0e' }
'.text-yellow-900': { color: '#713f12' }
'.text-amber-50': { color: '#fffbeb' }
'.text-amber-100': { color: '#fef3c7' }
'.text-amber-200': { color: '#fde68a' }
'.text-amber-300': { color: '#fcd34d' }
'.text-amber-400': { color: '#fbbf24' }
'.text-amber-500': { color: '#f59e0b' }
'.text-amber-600': { color: '#d97706' }
'.text-amber-700': { color: '#b45309' }
'.text-amber-800': { color: '#92400e' }
'.text-amber-900': { color: '#78350f' }
'.text-orange-50': { color: '#fff7ed' }
'.text-orange-100': { color: '#ffedd5' }
'.text-orange-200': { color: '#fed7aa' }
'.text-orange-300': { color: '#fdba74' }
'.text-orange-400': { color: '#fb923c' }
'.text-orange-500': { color: '#f97316' }
'.text-orange-600': { color: '#ea580c' }
'.text-orange-700': { color: '#c2410c' }
'.text-orange-800': { color: '#9a3412' }
'.text-orange-900': { color: '#7c2d12' }
'.text-red-50': { color: '#fef2f2' }
'.text-red-100': { color: '#fee2e2' }
'.text-red-200': { color: '#fecaca' }
'.text-red-300': { color: '#fca5a5' }
'.text-red-400': { color: '#f87171' }
'.text-red-500': { color: '#ef4444' }
'.text-red-600': { color: '#dc2626' }
'.text-red-700': { color: '#b91c1c' }
'.text-red-800': { color: '#991b1b' }
'.text-red-900': { color: '#7f1d1d' }
'.text-warmGray-50': { color: '#fafaf9' }
'.text-warmGray-100': { color: '#f5f5f4' }
'.text-warmGray-200': { color: '#e7e5e4' }
'.text-warmGray-300': { color: '#d6d3d1' }
'.text-warmGray-400': { color: '#a8a29e' }
'.text-warmGray-500': { color: '#78716c' }
'.text-warmGray-600': { color: '#57534e' }
'.text-warmGray-700': { color: '#44403c' }
'.text-warmGray-800': { color: '#292524' }
'.text-warmGray-900': { color: '#1c1917' }
'.text-trueGray-50': { color: '#fafafa' }
'.text-trueGray-100': { color: '#f5f5f5' }
'.text-trueGray-200': { color: '#e5e5e5' }
'.text-trueGray-300': { color: '#d4d4d4' }
'.text-trueGray-400': { color: '#a3a3a3' }
'.text-trueGray-500': { color: '#737373' }
'.text-trueGray-600': { color: '#525252' }
'.text-trueGray-700': { color: '#404040' }
'.text-trueGray-800': { color: '#262626' }
'.text-trueGray-900': { color: '#171717' }
'.text-gray-50': { color: '#fafafa' }
'.text-gray-100': { color: '#f4f4f5' }
'.text-gray-200': { color: '#e4e4e7' }
'.text-gray-300': { color: '#d4d4d8' }
'.text-gray-400': { color: '#a1a1aa' }
'.text-gray-500': { color: '#71717a' }
'.text-gray-600': { color: '#52525b' }
'.text-gray-700': { color: '#3f3f46' }
'.text-gray-800': { color: '#27272a' }
'.text-gray-900': { color: '#18181b' }
'.text-coolGray-50': { color: '#f9fafb' }
'.text-coolGray-100': { color: '#f3f4f6' }
'.text-coolGray-200': { color: '#e5e7eb' }
'.text-coolGray-300': { color: '#d1d5db' }
'.text-coolGray-400': { color: '#9ca3af' }
'.text-coolGray-500': { color: '#6b7280' }
'.text-coolGray-600': { color: '#4b5563' }
'.text-coolGray-700': { color: '#374151' }
'.text-coolGray-800': { color: '#1f2937' }
'.text-coolGray-900': { color: '#111827' }
'.text-blueGray-50': { color: '#f8fafc' }
'.text-blueGray-100': { color: '#f1f5f9' }
'.text-blueGray-200': { color: '#e2e8f0' }
'.text-blueGray-300': { color: '#cbd5e1' }
'.text-blueGray-400': { color: '#94a3b8' }
'.text-blueGray-500': { color: '#64748b' }
'.text-blueGray-600': { color: '#475569' }
'.text-blueGray-700': { color: '#334155' }
'.text-blueGray-800': { color: '#1e293b' }
'.text-blueGray-900': { color: '#0f172a' }
```

## Ti.Media
## audioSessionCategory Property
```css
'.audio-session-record': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_RECORD }
'.audio-session-ambient': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_AMBIENT }
'.audio-session-playback': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK }
'.audio-session-solo-ambient': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_SOLO_AMBIENT }
'.audio-session-play-record': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD }
```

## audioType Property
```css
'.audio-type-ring': { audioType: Ti.Media.Sound.AUDIO_TYPE_RING }
'.audio-type-alarm': { audioType: Ti.Media.Sound.AUDIO_TYPE_ALARM }
'.audio-type-media': { audioType: Ti.Media.Sound.AUDIO_TYPE_MEDIA }
'.audio-type-voice': { audioType: Ti.Media.Sound.AUDIO_TYPE_VOICE }
'.audio-type-signalling': { audioType: Ti.Media.Sound.AUDIO_TYPE_SIGNALLING }
'.audio-type-notification': { audioType: Ti.Media.Sound.AUDIO_TYPE_NOTIFICATION }
```

## Background Size ( for compatibility with Tailwind’s classes ) Property
```css
'.bg-auto': { scalingMode: Ti.Media.IMAGE_SCALING_NONE }
'.bg-cover': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FILL }
'.bg-contain': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FIT }
```

## Image Scaling Mode Property
```css
'.image-scaling-auto': { scalingMode: Ti.Media.IMAGE_SCALING_AUTO }
'.image-scaling-none': { scalingMode: Ti.Media.IMAGE_SCALING_NONE }
'.image-scaling-fill': { scalingMode: Ti.Media.IMAGE_SCALING_FILL }
'.image-scaling-cover': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FILL }
'.image-scaling-contain': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FIT }
```

## Video Scaling Mode Property
```css
'.video-scaling-resize': { scalingMode: Ti.Media.VIDEO_SCALING_RESIZE }
'.video-scaling-contain': { scalingMode: Ti.Media.VIDEO_SCALING_RESIZE_ASPECT }
'.video-scaling-cover': { scalingMode: Ti.Media.VIDEO_SCALING_RESIZE_ASPECT_FILL }
```

## tintColor Property
```css
'.tint-transparent': { tintColor: 'transparent' }
'.tint-black': { tintColor: '#000000' }
'.tint-white': { tintColor: '#ffffff' }
'.tint-rose-50': { tintColor: '#fff1f2' }
'.tint-rose-100': { tintColor: '#ffe4e6' }
'.tint-rose-200': { tintColor: '#fecdd3' }
'.tint-rose-300': { tintColor: '#fda4af' }
'.tint-rose-400': { tintColor: '#fb7185' }
'.tint-rose-500': { tintColor: '#f43f5e' }
'.tint-rose-600': { tintColor: '#e11d48' }
'.tint-rose-700': { tintColor: '#be123c' }
'.tint-rose-800': { tintColor: '#9f1239' }
'.tint-rose-900': { tintColor: '#881337' }
'.tint-pink-50': { tintColor: '#fdf2f8' }
'.tint-pink-100': { tintColor: '#fce7f3' }
'.tint-pink-200': { tintColor: '#fbcfe8' }
'.tint-pink-300': { tintColor: '#f9a8d4' }
'.tint-pink-400': { tintColor: '#f472b6' }
'.tint-pink-500': { tintColor: '#ec4899' }
'.tint-pink-600': { tintColor: '#db2777' }
'.tint-pink-700': { tintColor: '#be185d' }
'.tint-pink-800': { tintColor: '#9d174d' }
'.tint-pink-900': { tintColor: '#831843' }
'.tint-fuchsia-50': { tintColor: '#fdf4ff' }
'.tint-fuchsia-100': { tintColor: '#fae8ff' }
'.tint-fuchsia-200': { tintColor: '#f5d0fe' }
'.tint-fuchsia-300': { tintColor: '#f0abfc' }
'.tint-fuchsia-400': { tintColor: '#e879f9' }
'.tint-fuchsia-500': { tintColor: '#d946ef' }
'.tint-fuchsia-600': { tintColor: '#c026d3' }
'.tint-fuchsia-700': { tintColor: '#a21caf' }
'.tint-fuchsia-800': { tintColor: '#86198f' }
'.tint-fuchsia-900': { tintColor: '#701a75' }
'.tint-purple-50': { tintColor: '#faf5ff' }
'.tint-purple-100': { tintColor: '#f3e8ff' }
'.tint-purple-200': { tintColor: '#e9d5ff' }
'.tint-purple-300': { tintColor: '#d8b4fe' }
'.tint-purple-400': { tintColor: '#c084fc' }
'.tint-purple-500': { tintColor: '#a855f7' }
'.tint-purple-600': { tintColor: '#9333ea' }
'.tint-purple-700': { tintColor: '#7e22ce' }
'.tint-purple-800': { tintColor: '#6b21a8' }
'.tint-purple-900': { tintColor: '#581c87' }
'.tint-violet-50': { tintColor: '#f5f3ff' }
'.tint-violet-100': { tintColor: '#ede9fe' }
'.tint-violet-200': { tintColor: '#ddd6fe' }
'.tint-violet-300': { tintColor: '#c4b5fd' }
'.tint-violet-400': { tintColor: '#a78bfa' }
'.tint-violet-500': { tintColor: '#8b5cf6' }
'.tint-violet-600': { tintColor: '#7c3aed' }
'.tint-violet-700': { tintColor: '#6d28d9' }
'.tint-violet-800': { tintColor: '#5b21b6' }
'.tint-violet-900': { tintColor: '#4c1d95' }
'.tint-indigo-50': { tintColor: '#eef2ff' }
'.tint-indigo-100': { tintColor: '#e0e7ff' }
'.tint-indigo-200': { tintColor: '#c7d2fe' }
'.tint-indigo-300': { tintColor: '#a5b4fc' }
'.tint-indigo-400': { tintColor: '#818cf8' }
'.tint-indigo-500': { tintColor: '#6366f1' }
'.tint-indigo-600': { tintColor: '#4f46e5' }
'.tint-indigo-700': { tintColor: '#4338ca' }
'.tint-indigo-800': { tintColor: '#3730a3' }
'.tint-indigo-900': { tintColor: '#312e81' }
'.tint-blue-50': { tintColor: '#eff6ff' }
'.tint-blue-100': { tintColor: '#dbeafe' }
'.tint-blue-200': { tintColor: '#bfdbfe' }
'.tint-blue-300': { tintColor: '#93c5fd' }
'.tint-blue-400': { tintColor: '#60a5fa' }
'.tint-blue-500': { tintColor: '#3b82f6' }
'.tint-blue-600': { tintColor: '#2563eb' }
'.tint-blue-700': { tintColor: '#1d4ed8' }
'.tint-blue-800': { tintColor: '#1e40af' }
'.tint-blue-900': { tintColor: '#1e3a8a' }
'.tint-sky-50': { tintColor: '#f0f9ff' }
'.tint-sky-100': { tintColor: '#e0f2fe' }
'.tint-sky-200': { tintColor: '#bae6fd' }
'.tint-sky-300': { tintColor: '#7dd3fc' }
'.tint-sky-400': { tintColor: '#38bdf8' }
'.tint-sky-500': { tintColor: '#0ea5e9' }
'.tint-sky-600': { tintColor: '#0284c7' }
'.tint-sky-700': { tintColor: '#0369a1' }
'.tint-sky-800': { tintColor: '#075985' }
'.tint-sky-900': { tintColor: '#0c4a6e' }
'.tint-cyan-50': { tintColor: '#ecfeff' }
'.tint-cyan-100': { tintColor: '#cffafe' }
'.tint-cyan-200': { tintColor: '#a5f3fc' }
'.tint-cyan-300': { tintColor: '#67e8f9' }
'.tint-cyan-400': { tintColor: '#22d3ee' }
'.tint-cyan-500': { tintColor: '#06b6d4' }
'.tint-cyan-600': { tintColor: '#0891b2' }
'.tint-cyan-700': { tintColor: '#0e7490' }
'.tint-cyan-800': { tintColor: '#155e75' }
'.tint-cyan-900': { tintColor: '#164e63' }
'.tint-teal-50': { tintColor: '#f0fdfa' }
'.tint-teal-100': { tintColor: '#ccfbf1' }
'.tint-teal-200': { tintColor: '#99f6e4' }
'.tint-teal-300': { tintColor: '#5eead4' }
'.tint-teal-400': { tintColor: '#2dd4bf' }
'.tint-teal-500': { tintColor: '#14b8a6' }
'.tint-teal-600': { tintColor: '#0d9488' }
'.tint-teal-700': { tintColor: '#0f766e' }
'.tint-teal-800': { tintColor: '#115e59' }
'.tint-teal-900': { tintColor: '#134e4a' }
'.tint-emerald-50': { tintColor: '#ecfdf5' }
'.tint-emerald-100': { tintColor: '#d1fae5' }
'.tint-emerald-200': { tintColor: '#a7f3d0' }
'.tint-emerald-300': { tintColor: '#6ee7b7' }
'.tint-emerald-400': { tintColor: '#34d399' }
'.tint-emerald-500': { tintColor: '#10b981' }
'.tint-emerald-600': { tintColor: '#059669' }
'.tint-emerald-700': { tintColor: '#047857' }
'.tint-emerald-800': { tintColor: '#065f46' }
'.tint-emerald-900': { tintColor: '#064e3b' }
'.tint-green-50': { tintColor: '#f0fdf4' }
'.tint-green-100': { tintColor: '#dcfce7' }
'.tint-green-200': { tintColor: '#bbf7d0' }
'.tint-green-300': { tintColor: '#86efac' }
'.tint-green-400': { tintColor: '#4ade80' }
'.tint-green-500': { tintColor: '#22c55e' }
'.tint-green-600': { tintColor: '#16a34a' }
'.tint-green-700': { tintColor: '#15803d' }
'.tint-green-800': { tintColor: '#166534' }
'.tint-green-900': { tintColor: '#14532d' }
'.tint-lime-50': { tintColor: '#f7fee7' }
'.tint-lime-100': { tintColor: '#ecfccb' }
'.tint-lime-200': { tintColor: '#d9f99d' }
'.tint-lime-300': { tintColor: '#bef264' }
'.tint-lime-400': { tintColor: '#a3e635' }
'.tint-lime-500': { tintColor: '#84cc16' }
'.tint-lime-600': { tintColor: '#65a30d' }
'.tint-lime-700': { tintColor: '#4d7c0f' }
'.tint-lime-800': { tintColor: '#3f6212' }
'.tint-lime-900': { tintColor: '#365314' }
'.tint-yellow-50': { tintColor: '#fefce8' }
'.tint-yellow-100': { tintColor: '#fef9c3' }
'.tint-yellow-200': { tintColor: '#fef08a' }
'.tint-yellow-300': { tintColor: '#fde047' }
'.tint-yellow-400': { tintColor: '#facc15' }
'.tint-yellow-500': { tintColor: '#eab308' }
'.tint-yellow-600': { tintColor: '#ca8a04' }
'.tint-yellow-700': { tintColor: '#a16207' }
'.tint-yellow-800': { tintColor: '#854d0e' }
'.tint-yellow-900': { tintColor: '#713f12' }
'.tint-amber-50': { tintColor: '#fffbeb' }
'.tint-amber-100': { tintColor: '#fef3c7' }
'.tint-amber-200': { tintColor: '#fde68a' }
'.tint-amber-300': { tintColor: '#fcd34d' }
'.tint-amber-400': { tintColor: '#fbbf24' }
'.tint-amber-500': { tintColor: '#f59e0b' }
'.tint-amber-600': { tintColor: '#d97706' }
'.tint-amber-700': { tintColor: '#b45309' }
'.tint-amber-800': { tintColor: '#92400e' }
'.tint-amber-900': { tintColor: '#78350f' }
'.tint-orange-50': { tintColor: '#fff7ed' }
'.tint-orange-100': { tintColor: '#ffedd5' }
'.tint-orange-200': { tintColor: '#fed7aa' }
'.tint-orange-300': { tintColor: '#fdba74' }
'.tint-orange-400': { tintColor: '#fb923c' }
'.tint-orange-500': { tintColor: '#f97316' }
'.tint-orange-600': { tintColor: '#ea580c' }
'.tint-orange-700': { tintColor: '#c2410c' }
'.tint-orange-800': { tintColor: '#9a3412' }
'.tint-orange-900': { tintColor: '#7c2d12' }
'.tint-red-50': { tintColor: '#fef2f2' }
'.tint-red-100': { tintColor: '#fee2e2' }
'.tint-red-200': { tintColor: '#fecaca' }
'.tint-red-300': { tintColor: '#fca5a5' }
'.tint-red-400': { tintColor: '#f87171' }
'.tint-red-500': { tintColor: '#ef4444' }
'.tint-red-600': { tintColor: '#dc2626' }
'.tint-red-700': { tintColor: '#b91c1c' }
'.tint-red-800': { tintColor: '#991b1b' }
'.tint-red-900': { tintColor: '#7f1d1d' }
'.tint-warmGray-50': { tintColor: '#fafaf9' }
'.tint-warmGray-100': { tintColor: '#f5f5f4' }
'.tint-warmGray-200': { tintColor: '#e7e5e4' }
'.tint-warmGray-300': { tintColor: '#d6d3d1' }
'.tint-warmGray-400': { tintColor: '#a8a29e' }
'.tint-warmGray-500': { tintColor: '#78716c' }
'.tint-warmGray-600': { tintColor: '#57534e' }
'.tint-warmGray-700': { tintColor: '#44403c' }
'.tint-warmGray-800': { tintColor: '#292524' }
'.tint-warmGray-900': { tintColor: '#1c1917' }
'.tint-trueGray-50': { tintColor: '#fafafa' }
'.tint-trueGray-100': { tintColor: '#f5f5f5' }
'.tint-trueGray-200': { tintColor: '#e5e5e5' }
'.tint-trueGray-300': { tintColor: '#d4d4d4' }
'.tint-trueGray-400': { tintColor: '#a3a3a3' }
'.tint-trueGray-500': { tintColor: '#737373' }
'.tint-trueGray-600': { tintColor: '#525252' }
'.tint-trueGray-700': { tintColor: '#404040' }
'.tint-trueGray-800': { tintColor: '#262626' }
'.tint-trueGray-900': { tintColor: '#171717' }
'.tint-gray-50': { tintColor: '#fafafa' }
'.tint-gray-100': { tintColor: '#f4f4f5' }
'.tint-gray-200': { tintColor: '#e4e4e7' }
'.tint-gray-300': { tintColor: '#d4d4d8' }
'.tint-gray-400': { tintColor: '#a1a1aa' }
'.tint-gray-500': { tintColor: '#71717a' }
'.tint-gray-600': { tintColor: '#52525b' }
'.tint-gray-700': { tintColor: '#3f3f46' }
'.tint-gray-800': { tintColor: '#27272a' }
'.tint-gray-900': { tintColor: '#18181b' }
'.tint-coolGray-50': { tintColor: '#f9fafb' }
'.tint-coolGray-100': { tintColor: '#f3f4f6' }
'.tint-coolGray-200': { tintColor: '#e5e7eb' }
'.tint-coolGray-300': { tintColor: '#d1d5db' }
'.tint-coolGray-400': { tintColor: '#9ca3af' }
'.tint-coolGray-500': { tintColor: '#6b7280' }
'.tint-coolGray-600': { tintColor: '#4b5563' }
'.tint-coolGray-700': { tintColor: '#374151' }
'.tint-coolGray-800': { tintColor: '#1f2937' }
'.tint-coolGray-900': { tintColor: '#111827' }
'.tint-blueGray-50': { tintColor: '#f8fafc' }
'.tint-blueGray-100': { tintColor: '#f1f5f9' }
'.tint-blueGray-200': { tintColor: '#e2e8f0' }
'.tint-blueGray-300': { tintColor: '#cbd5e1' }
'.tint-blueGray-400': { tintColor: '#94a3b8' }
'.tint-blueGray-500': { tintColor: '#64748b' }
'.tint-blueGray-600': { tintColor: '#475569' }
'.tint-blueGray-700': { tintColor: '#334155' }
'.tint-blueGray-800': { tintColor: '#1e293b' }
'.tint-blueGray-900': { tintColor: '#0f172a' }
```

## touchFeedbackColor Property
```css
'.feedback-transparent': { touchFeedback: true, touchFeedbackColor: 'transparent' }
'.feedback-black': { touchFeedback: true, touchFeedbackColor: '#000000' }
'.feedback-white': { touchFeedback: true, touchFeedbackColor: '#ffffff' }
'.feedback-rose-50': { touchFeedback: true, touchFeedbackColor: '#fff1f2' }
'.feedback-rose-100': { touchFeedback: true, touchFeedbackColor: '#ffe4e6' }
'.feedback-rose-200': { touchFeedback: true, touchFeedbackColor: '#fecdd3' }
'.feedback-rose-300': { touchFeedback: true, touchFeedbackColor: '#fda4af' }
'.feedback-rose-400': { touchFeedback: true, touchFeedbackColor: '#fb7185' }
'.feedback-rose-500': { touchFeedback: true, touchFeedbackColor: '#f43f5e' }
'.feedback-rose-600': { touchFeedback: true, touchFeedbackColor: '#e11d48' }
'.feedback-rose-700': { touchFeedback: true, touchFeedbackColor: '#be123c' }
'.feedback-rose-800': { touchFeedback: true, touchFeedbackColor: '#9f1239' }
'.feedback-rose-900': { touchFeedback: true, touchFeedbackColor: '#881337' }
'.feedback-pink-50': { touchFeedback: true, touchFeedbackColor: '#fdf2f8' }
'.feedback-pink-100': { touchFeedback: true, touchFeedbackColor: '#fce7f3' }
'.feedback-pink-200': { touchFeedback: true, touchFeedbackColor: '#fbcfe8' }
'.feedback-pink-300': { touchFeedback: true, touchFeedbackColor: '#f9a8d4' }
'.feedback-pink-400': { touchFeedback: true, touchFeedbackColor: '#f472b6' }
'.feedback-pink-500': { touchFeedback: true, touchFeedbackColor: '#ec4899' }
'.feedback-pink-600': { touchFeedback: true, touchFeedbackColor: '#db2777' }
'.feedback-pink-700': { touchFeedback: true, touchFeedbackColor: '#be185d' }
'.feedback-pink-800': { touchFeedback: true, touchFeedbackColor: '#9d174d' }
'.feedback-pink-900': { touchFeedback: true, touchFeedbackColor: '#831843' }
'.feedback-fuchsia-50': { touchFeedback: true, touchFeedbackColor: '#fdf4ff' }
'.feedback-fuchsia-100': { touchFeedback: true, touchFeedbackColor: '#fae8ff' }
'.feedback-fuchsia-200': { touchFeedback: true, touchFeedbackColor: '#f5d0fe' }
'.feedback-fuchsia-300': { touchFeedback: true, touchFeedbackColor: '#f0abfc' }
'.feedback-fuchsia-400': { touchFeedback: true, touchFeedbackColor: '#e879f9' }
'.feedback-fuchsia-500': { touchFeedback: true, touchFeedbackColor: '#d946ef' }
'.feedback-fuchsia-600': { touchFeedback: true, touchFeedbackColor: '#c026d3' }
'.feedback-fuchsia-700': { touchFeedback: true, touchFeedbackColor: '#a21caf' }
'.feedback-fuchsia-800': { touchFeedback: true, touchFeedbackColor: '#86198f' }
'.feedback-fuchsia-900': { touchFeedback: true, touchFeedbackColor: '#701a75' }
'.feedback-purple-50': { touchFeedback: true, touchFeedbackColor: '#faf5ff' }
'.feedback-purple-100': { touchFeedback: true, touchFeedbackColor: '#f3e8ff' }
'.feedback-purple-200': { touchFeedback: true, touchFeedbackColor: '#e9d5ff' }
'.feedback-purple-300': { touchFeedback: true, touchFeedbackColor: '#d8b4fe' }
'.feedback-purple-400': { touchFeedback: true, touchFeedbackColor: '#c084fc' }
'.feedback-purple-500': { touchFeedback: true, touchFeedbackColor: '#a855f7' }
'.feedback-purple-600': { touchFeedback: true, touchFeedbackColor: '#9333ea' }
'.feedback-purple-700': { touchFeedback: true, touchFeedbackColor: '#7e22ce' }
'.feedback-purple-800': { touchFeedback: true, touchFeedbackColor: '#6b21a8' }
'.feedback-purple-900': { touchFeedback: true, touchFeedbackColor: '#581c87' }
'.feedback-violet-50': { touchFeedback: true, touchFeedbackColor: '#f5f3ff' }
'.feedback-violet-100': { touchFeedback: true, touchFeedbackColor: '#ede9fe' }
'.feedback-violet-200': { touchFeedback: true, touchFeedbackColor: '#ddd6fe' }
'.feedback-violet-300': { touchFeedback: true, touchFeedbackColor: '#c4b5fd' }
'.feedback-violet-400': { touchFeedback: true, touchFeedbackColor: '#a78bfa' }
'.feedback-violet-500': { touchFeedback: true, touchFeedbackColor: '#8b5cf6' }
'.feedback-violet-600': { touchFeedback: true, touchFeedbackColor: '#7c3aed' }
'.feedback-violet-700': { touchFeedback: true, touchFeedbackColor: '#6d28d9' }
'.feedback-violet-800': { touchFeedback: true, touchFeedbackColor: '#5b21b6' }
'.feedback-violet-900': { touchFeedback: true, touchFeedbackColor: '#4c1d95' }
'.feedback-indigo-50': { touchFeedback: true, touchFeedbackColor: '#eef2ff' }
'.feedback-indigo-100': { touchFeedback: true, touchFeedbackColor: '#e0e7ff' }
'.feedback-indigo-200': { touchFeedback: true, touchFeedbackColor: '#c7d2fe' }
'.feedback-indigo-300': { touchFeedback: true, touchFeedbackColor: '#a5b4fc' }
'.feedback-indigo-400': { touchFeedback: true, touchFeedbackColor: '#818cf8' }
'.feedback-indigo-500': { touchFeedback: true, touchFeedbackColor: '#6366f1' }
'.feedback-indigo-600': { touchFeedback: true, touchFeedbackColor: '#4f46e5' }
'.feedback-indigo-700': { touchFeedback: true, touchFeedbackColor: '#4338ca' }
'.feedback-indigo-800': { touchFeedback: true, touchFeedbackColor: '#3730a3' }
'.feedback-indigo-900': { touchFeedback: true, touchFeedbackColor: '#312e81' }
'.feedback-blue-50': { touchFeedback: true, touchFeedbackColor: '#eff6ff' }
'.feedback-blue-100': { touchFeedback: true, touchFeedbackColor: '#dbeafe' }
'.feedback-blue-200': { touchFeedback: true, touchFeedbackColor: '#bfdbfe' }
'.feedback-blue-300': { touchFeedback: true, touchFeedbackColor: '#93c5fd' }
'.feedback-blue-400': { touchFeedback: true, touchFeedbackColor: '#60a5fa' }
'.feedback-blue-500': { touchFeedback: true, touchFeedbackColor: '#3b82f6' }
'.feedback-blue-600': { touchFeedback: true, touchFeedbackColor: '#2563eb' }
'.feedback-blue-700': { touchFeedback: true, touchFeedbackColor: '#1d4ed8' }
'.feedback-blue-800': { touchFeedback: true, touchFeedbackColor: '#1e40af' }
'.feedback-blue-900': { touchFeedback: true, touchFeedbackColor: '#1e3a8a' }
'.feedback-sky-50': { touchFeedback: true, touchFeedbackColor: '#f0f9ff' }
'.feedback-sky-100': { touchFeedback: true, touchFeedbackColor: '#e0f2fe' }
'.feedback-sky-200': { touchFeedback: true, touchFeedbackColor: '#bae6fd' }
'.feedback-sky-300': { touchFeedback: true, touchFeedbackColor: '#7dd3fc' }
'.feedback-sky-400': { touchFeedback: true, touchFeedbackColor: '#38bdf8' }
'.feedback-sky-500': { touchFeedback: true, touchFeedbackColor: '#0ea5e9' }
'.feedback-sky-600': { touchFeedback: true, touchFeedbackColor: '#0284c7' }
'.feedback-sky-700': { touchFeedback: true, touchFeedbackColor: '#0369a1' }
'.feedback-sky-800': { touchFeedback: true, touchFeedbackColor: '#075985' }
'.feedback-sky-900': { touchFeedback: true, touchFeedbackColor: '#0c4a6e' }
'.feedback-cyan-50': { touchFeedback: true, touchFeedbackColor: '#ecfeff' }
'.feedback-cyan-100': { touchFeedback: true, touchFeedbackColor: '#cffafe' }
'.feedback-cyan-200': { touchFeedback: true, touchFeedbackColor: '#a5f3fc' }
'.feedback-cyan-300': { touchFeedback: true, touchFeedbackColor: '#67e8f9' }
'.feedback-cyan-400': { touchFeedback: true, touchFeedbackColor: '#22d3ee' }
'.feedback-cyan-500': { touchFeedback: true, touchFeedbackColor: '#06b6d4' }
'.feedback-cyan-600': { touchFeedback: true, touchFeedbackColor: '#0891b2' }
'.feedback-cyan-700': { touchFeedback: true, touchFeedbackColor: '#0e7490' }
'.feedback-cyan-800': { touchFeedback: true, touchFeedbackColor: '#155e75' }
'.feedback-cyan-900': { touchFeedback: true, touchFeedbackColor: '#164e63' }
'.feedback-teal-50': { touchFeedback: true, touchFeedbackColor: '#f0fdfa' }
'.feedback-teal-100': { touchFeedback: true, touchFeedbackColor: '#ccfbf1' }
'.feedback-teal-200': { touchFeedback: true, touchFeedbackColor: '#99f6e4' }
'.feedback-teal-300': { touchFeedback: true, touchFeedbackColor: '#5eead4' }
'.feedback-teal-400': { touchFeedback: true, touchFeedbackColor: '#2dd4bf' }
'.feedback-teal-500': { touchFeedback: true, touchFeedbackColor: '#14b8a6' }
'.feedback-teal-600': { touchFeedback: true, touchFeedbackColor: '#0d9488' }
'.feedback-teal-700': { touchFeedback: true, touchFeedbackColor: '#0f766e' }
'.feedback-teal-800': { touchFeedback: true, touchFeedbackColor: '#115e59' }
'.feedback-teal-900': { touchFeedback: true, touchFeedbackColor: '#134e4a' }
'.feedback-emerald-50': { touchFeedback: true, touchFeedbackColor: '#ecfdf5' }
'.feedback-emerald-100': { touchFeedback: true, touchFeedbackColor: '#d1fae5' }
'.feedback-emerald-200': { touchFeedback: true, touchFeedbackColor: '#a7f3d0' }
'.feedback-emerald-300': { touchFeedback: true, touchFeedbackColor: '#6ee7b7' }
'.feedback-emerald-400': { touchFeedback: true, touchFeedbackColor: '#34d399' }
'.feedback-emerald-500': { touchFeedback: true, touchFeedbackColor: '#10b981' }
'.feedback-emerald-600': { touchFeedback: true, touchFeedbackColor: '#059669' }
'.feedback-emerald-700': { touchFeedback: true, touchFeedbackColor: '#047857' }
'.feedback-emerald-800': { touchFeedback: true, touchFeedbackColor: '#065f46' }
'.feedback-emerald-900': { touchFeedback: true, touchFeedbackColor: '#064e3b' }
'.feedback-green-50': { touchFeedback: true, touchFeedbackColor: '#f0fdf4' }
'.feedback-green-100': { touchFeedback: true, touchFeedbackColor: '#dcfce7' }
'.feedback-green-200': { touchFeedback: true, touchFeedbackColor: '#bbf7d0' }
'.feedback-green-300': { touchFeedback: true, touchFeedbackColor: '#86efac' }
'.feedback-green-400': { touchFeedback: true, touchFeedbackColor: '#4ade80' }
'.feedback-green-500': { touchFeedback: true, touchFeedbackColor: '#22c55e' }
'.feedback-green-600': { touchFeedback: true, touchFeedbackColor: '#16a34a' }
'.feedback-green-700': { touchFeedback: true, touchFeedbackColor: '#15803d' }
'.feedback-green-800': { touchFeedback: true, touchFeedbackColor: '#166534' }
'.feedback-green-900': { touchFeedback: true, touchFeedbackColor: '#14532d' }
'.feedback-lime-50': { touchFeedback: true, touchFeedbackColor: '#f7fee7' }
'.feedback-lime-100': { touchFeedback: true, touchFeedbackColor: '#ecfccb' }
'.feedback-lime-200': { touchFeedback: true, touchFeedbackColor: '#d9f99d' }
'.feedback-lime-300': { touchFeedback: true, touchFeedbackColor: '#bef264' }
'.feedback-lime-400': { touchFeedback: true, touchFeedbackColor: '#a3e635' }
'.feedback-lime-500': { touchFeedback: true, touchFeedbackColor: '#84cc16' }
'.feedback-lime-600': { touchFeedback: true, touchFeedbackColor: '#65a30d' }
'.feedback-lime-700': { touchFeedback: true, touchFeedbackColor: '#4d7c0f' }
'.feedback-lime-800': { touchFeedback: true, touchFeedbackColor: '#3f6212' }
'.feedback-lime-900': { touchFeedback: true, touchFeedbackColor: '#365314' }
'.feedback-yellow-50': { touchFeedback: true, touchFeedbackColor: '#fefce8' }
'.feedback-yellow-100': { touchFeedback: true, touchFeedbackColor: '#fef9c3' }
'.feedback-yellow-200': { touchFeedback: true, touchFeedbackColor: '#fef08a' }
'.feedback-yellow-300': { touchFeedback: true, touchFeedbackColor: '#fde047' }
'.feedback-yellow-400': { touchFeedback: true, touchFeedbackColor: '#facc15' }
'.feedback-yellow-500': { touchFeedback: true, touchFeedbackColor: '#eab308' }
'.feedback-yellow-600': { touchFeedback: true, touchFeedbackColor: '#ca8a04' }
'.feedback-yellow-700': { touchFeedback: true, touchFeedbackColor: '#a16207' }
'.feedback-yellow-800': { touchFeedback: true, touchFeedbackColor: '#854d0e' }
'.feedback-yellow-900': { touchFeedback: true, touchFeedbackColor: '#713f12' }
'.feedback-amber-50': { touchFeedback: true, touchFeedbackColor: '#fffbeb' }
'.feedback-amber-100': { touchFeedback: true, touchFeedbackColor: '#fef3c7' }
'.feedback-amber-200': { touchFeedback: true, touchFeedbackColor: '#fde68a' }
'.feedback-amber-300': { touchFeedback: true, touchFeedbackColor: '#fcd34d' }
'.feedback-amber-400': { touchFeedback: true, touchFeedbackColor: '#fbbf24' }
'.feedback-amber-500': { touchFeedback: true, touchFeedbackColor: '#f59e0b' }
'.feedback-amber-600': { touchFeedback: true, touchFeedbackColor: '#d97706' }
'.feedback-amber-700': { touchFeedback: true, touchFeedbackColor: '#b45309' }
'.feedback-amber-800': { touchFeedback: true, touchFeedbackColor: '#92400e' }
'.feedback-amber-900': { touchFeedback: true, touchFeedbackColor: '#78350f' }
'.feedback-orange-50': { touchFeedback: true, touchFeedbackColor: '#fff7ed' }
'.feedback-orange-100': { touchFeedback: true, touchFeedbackColor: '#ffedd5' }
'.feedback-orange-200': { touchFeedback: true, touchFeedbackColor: '#fed7aa' }
'.feedback-orange-300': { touchFeedback: true, touchFeedbackColor: '#fdba74' }
'.feedback-orange-400': { touchFeedback: true, touchFeedbackColor: '#fb923c' }
'.feedback-orange-500': { touchFeedback: true, touchFeedbackColor: '#f97316' }
'.feedback-orange-600': { touchFeedback: true, touchFeedbackColor: '#ea580c' }
'.feedback-orange-700': { touchFeedback: true, touchFeedbackColor: '#c2410c' }
'.feedback-orange-800': { touchFeedback: true, touchFeedbackColor: '#9a3412' }
'.feedback-orange-900': { touchFeedback: true, touchFeedbackColor: '#7c2d12' }
'.feedback-red-50': { touchFeedback: true, touchFeedbackColor: '#fef2f2' }
'.feedback-red-100': { touchFeedback: true, touchFeedbackColor: '#fee2e2' }
'.feedback-red-200': { touchFeedback: true, touchFeedbackColor: '#fecaca' }
'.feedback-red-300': { touchFeedback: true, touchFeedbackColor: '#fca5a5' }
'.feedback-red-400': { touchFeedback: true, touchFeedbackColor: '#f87171' }
'.feedback-red-500': { touchFeedback: true, touchFeedbackColor: '#ef4444' }
'.feedback-red-600': { touchFeedback: true, touchFeedbackColor: '#dc2626' }
'.feedback-red-700': { touchFeedback: true, touchFeedbackColor: '#b91c1c' }
'.feedback-red-800': { touchFeedback: true, touchFeedbackColor: '#991b1b' }
'.feedback-red-900': { touchFeedback: true, touchFeedbackColor: '#7f1d1d' }
'.feedback-warmGray-50': { touchFeedback: true, touchFeedbackColor: '#fafaf9' }
'.feedback-warmGray-100': { touchFeedback: true, touchFeedbackColor: '#f5f5f4' }
'.feedback-warmGray-200': { touchFeedback: true, touchFeedbackColor: '#e7e5e4' }
'.feedback-warmGray-300': { touchFeedback: true, touchFeedbackColor: '#d6d3d1' }
'.feedback-warmGray-400': { touchFeedback: true, touchFeedbackColor: '#a8a29e' }
'.feedback-warmGray-500': { touchFeedback: true, touchFeedbackColor: '#78716c' }
'.feedback-warmGray-600': { touchFeedback: true, touchFeedbackColor: '#57534e' }
'.feedback-warmGray-700': { touchFeedback: true, touchFeedbackColor: '#44403c' }
'.feedback-warmGray-800': { touchFeedback: true, touchFeedbackColor: '#292524' }
'.feedback-warmGray-900': { touchFeedback: true, touchFeedbackColor: '#1c1917' }
'.feedback-trueGray-50': { touchFeedback: true, touchFeedbackColor: '#fafafa' }
'.feedback-trueGray-100': { touchFeedback: true, touchFeedbackColor: '#f5f5f5' }
'.feedback-trueGray-200': { touchFeedback: true, touchFeedbackColor: '#e5e5e5' }
'.feedback-trueGray-300': { touchFeedback: true, touchFeedbackColor: '#d4d4d4' }
'.feedback-trueGray-400': { touchFeedback: true, touchFeedbackColor: '#a3a3a3' }
'.feedback-trueGray-500': { touchFeedback: true, touchFeedbackColor: '#737373' }
'.feedback-trueGray-600': { touchFeedback: true, touchFeedbackColor: '#525252' }
'.feedback-trueGray-700': { touchFeedback: true, touchFeedbackColor: '#404040' }
'.feedback-trueGray-800': { touchFeedback: true, touchFeedbackColor: '#262626' }
'.feedback-trueGray-900': { touchFeedback: true, touchFeedbackColor: '#171717' }
'.feedback-gray-50': { touchFeedback: true, touchFeedbackColor: '#fafafa' }
'.feedback-gray-100': { touchFeedback: true, touchFeedbackColor: '#f4f4f5' }
'.feedback-gray-200': { touchFeedback: true, touchFeedbackColor: '#e4e4e7' }
'.feedback-gray-300': { touchFeedback: true, touchFeedbackColor: '#d4d4d8' }
'.feedback-gray-400': { touchFeedback: true, touchFeedbackColor: '#a1a1aa' }
'.feedback-gray-500': { touchFeedback: true, touchFeedbackColor: '#71717a' }
'.feedback-gray-600': { touchFeedback: true, touchFeedbackColor: '#52525b' }
'.feedback-gray-700': { touchFeedback: true, touchFeedbackColor: '#3f3f46' }
'.feedback-gray-800': { touchFeedback: true, touchFeedbackColor: '#27272a' }
'.feedback-gray-900': { touchFeedback: true, touchFeedbackColor: '#18181b' }
'.feedback-coolGray-50': { touchFeedback: true, touchFeedbackColor: '#f9fafb' }
'.feedback-coolGray-100': { touchFeedback: true, touchFeedbackColor: '#f3f4f6' }
'.feedback-coolGray-200': { touchFeedback: true, touchFeedbackColor: '#e5e7eb' }
'.feedback-coolGray-300': { touchFeedback: true, touchFeedbackColor: '#d1d5db' }
'.feedback-coolGray-400': { touchFeedback: true, touchFeedbackColor: '#9ca3af' }
'.feedback-coolGray-500': { touchFeedback: true, touchFeedbackColor: '#6b7280' }
'.feedback-coolGray-600': { touchFeedback: true, touchFeedbackColor: '#4b5563' }
'.feedback-coolGray-700': { touchFeedback: true, touchFeedbackColor: '#374151' }
'.feedback-coolGray-800': { touchFeedback: true, touchFeedbackColor: '#1f2937' }
'.feedback-coolGray-900': { touchFeedback: true, touchFeedbackColor: '#111827' }
'.feedback-blueGray-50': { touchFeedback: true, touchFeedbackColor: '#f8fafc' }
'.feedback-blueGray-100': { touchFeedback: true, touchFeedbackColor: '#f1f5f9' }
'.feedback-blueGray-200': { touchFeedback: true, touchFeedbackColor: '#e2e8f0' }
'.feedback-blueGray-300': { touchFeedback: true, touchFeedbackColor: '#cbd5e1' }
'.feedback-blueGray-400': { touchFeedback: true, touchFeedbackColor: '#94a3b8' }
'.feedback-blueGray-500': { touchFeedback: true, touchFeedbackColor: '#64748b' }
'.feedback-blueGray-600': { touchFeedback: true, touchFeedbackColor: '#475569' }
'.feedback-blueGray-700': { touchFeedback: true, touchFeedbackColor: '#334155' }
'.feedback-blueGray-800': { touchFeedback: true, touchFeedbackColor: '#1e293b' }
'.feedback-blueGray-900': { touchFeedback: true, touchFeedbackColor: '#0f172a' }
```

## curve Property
```css
'.ease-in': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN }
'.ease-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_OUT }
'.ease-linear': { curve: Ti.UI.ANIMATION_CURVE_LINEAR }
'.ease-in-out': { curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT }
```

## Debug Mode Property
```css
'.debug': { debug: true }
```

## delay Property
```css
'.delay-0': { delay: 0 }
'.delay-25': { delay: 25 }
'.delay-50': { delay: 50 }
'.delay-75': { delay: 75 }
'.delay-100': { delay: 100 }
'.delay-150': { delay: 150 }
'.delay-200': { delay: 200 }
'.delay-300': { delay: 300 }
'.delay-500': { delay: 500 }
'.delay-700': { delay: 700 }
'.delay-1000': { delay: 1000 }
'.delay-2000': { delay: 2000 }
'.delay-3000': { delay: 3000 }
'.delay-4000': { delay: 4000 }
'.delay-5000': { delay: 5000 }
```

## duration Property
```css
'.duration-0': { duration: 0 }
'.duration-25': { duration: 25 }
'.duration-50': { duration: 50 }
'.duration-75': { duration: 75 }
'.duration-100': { duration: 100 }
'.duration-150': { duration: 150 }
'.duration-200': { duration: 200 }
'.duration-300': { duration: 300 }
'.duration-500': { duration: 500 }
'.duration-700': { duration: 700 }
'.duration-1000': { duration: 1000 }
'.duration': { duration: 150 }
```

## verticalAlign Property
```css
'.align-top': { verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP }
'.align-middle': { verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER }
'.align-bottom': { verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM }
```

## width Property
```css
'.w-0': { width: 0 }
'.w-1': { width: 4 }
'.w-2': { width: 8 }
'.w-3': { width: 12 }
'.w-4': { width: 16 }
'.w-5': { width: 20 }
'.w-6': { width: 24 }
'.w-7': { width: 28 }
'.w-8': { width: 32 }
'.w-9': { width: 36 }
'.w-10': { width: 40 }
'.w-11': { width: 44 }
'.w-12': { width: 48 }
'.w-13': { width: 52 }
'.w-14': { width: 56 }
'.w-15': { width: 60 }
'.w-16': { width: 64 }
'.w-20': { width: 80 }
'.w-24': { width: 96 }
'.w-28': { width: 112 }
'.w-32': { width: 128 }
'.w-36': { width: 144 }
'.w-40': { width: 160 }
'.w-44': { width: 176 }
'.w-48': { width: 192 }
'.w-52': { width: 208 }
'.w-56': { width: 224 }
'.w-60': { width: 240 }
'.w-64': { width: 256 }
'.w-72': { width: 288 }
'.w-80': { width: 320 }
'.w-96': { width: 384 }
'.w-px': { width: '1px' }
'.w-0.5': { width: 2 }
'.w-1.5': { width: 6 }
'.w-2.5': { width: 10 }
'.w-3.5': { width: 14 }
'.w-1/2': { width: '50%' }
'.w-1/3': { width: '33.333334%' }
'.w-2/3': { width: '66.666667%' }
'.w-1/4': { width: '25%' }
'.w-2/4': { width: '50%' }
'.w-3/4': { width: '75%' }
'.w-1/5': { width: '20%' }
'.w-2/5': { width: '40%' }
'.w-3/5': { width: '60%' }
'.w-4/5': { width: '80%' }
'.w-1/6': { width: '16.666667%' }
'.w-2/6': { width: '33.333334%' }
'.w-3/6': { width: '50%' }
'.w-4/6': { width: '66.666667%' }
'.w-5/6': { width: '83.333334%' }
'.w-1/12': { width: '8.333334%' }
'.w-2/12': { width: '16.666667%' }
'.w-3/12': { width: '25%' }
'.w-4/12': { width: '33.333334%' }
'.w-5/12': { width: '41.666667%' }
'.w-6/12': { width: '50%' }
'.w-7/12': { width: '58.333334%' }
'.w-8/12': { width: '66.666667%' }
'.w-9/12': { width: '75%' }
'.w-10/12': { width: '83.333334%' }
'.w-11/12': { width: '91.666667%' }
'.w-full': { width: '100%' }
'.w-auto': { width: Ti.UI.SIZE }
'.w-screen': { width: Ti.UI.FILL }
```

## zIndex Property
```css
'.z-0': { zIndex: 0 }
'.z-10': { zIndex: 10 }
'.z-20': { zIndex: 20 }
'.z-30': { zIndex: 30 }
'.z-40': { zIndex: 40 }
'.z-50': { zIndex: 50 }
```
