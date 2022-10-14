```scss
// Property: preferredProvider
// Description: Determines the preferred location provider. Removed in 8.0.0. Android legacy mode operation is deprecated. For new development, use either simple mode or manual mode. See &quot;Configurating Location Updates on Android&quot; in the main description of this class for more information.
// Component(s): Ti.Geolocation
'.preferred-provider-gps[platform=android]': { preferredProvider: Ti.Geolocation.Android.PROVIDER_GPS }
'.preferred-provider-network[platform=android]': { preferredProvider: Ti.Geolocation.Android.PROVIDER_NETWORK }
'.preferred-provider-passive[platform=android]': { preferredProvider: Ti.Geolocation.Android.PROVIDER_PASSIVE }
```