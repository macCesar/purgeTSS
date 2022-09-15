```scss
// Ti.Media
// Property(ies): audioSessionCategory - iOS Only
// Component(s): Ti.Media
'.audio-session-category-record[platform=ios]': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_RECORD }
'.audio-session-category-ambient[platform=ios]': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_AMBIENT }
'.audio-session-category-playback[platform=ios]': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK }
'.audio-session-category-solo-ambient[platform=ios]': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_SOLO_AMBIENT }
'.audio-session-category-play-record[platform=ios]': { audioSessionCategory: Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD }

// Property(ies): audioType - Android Only
// Component(s): Ti.Media.AudioPlayer, Ti.Media.Sound
'.audio-type-ring[platform=android]': { audioType: Ti.Media.Sound.AUDIO_TYPE_RING }
'.audio-type-alarm[platform=android]': { audioType: Ti.Media.Sound.AUDIO_TYPE_ALARM }
'.audio-type-media[platform=android]': { audioType: Ti.Media.Sound.AUDIO_TYPE_MEDIA }
'.audio-type-voice[platform=android]': { audioType: Ti.Media.Sound.AUDIO_TYPE_VOICE }
'.audio-type-signalling[platform=android]': { audioType: Ti.Media.Sound.AUDIO_TYPE_SIGNALLING }
'.audio-type-notification[platform=android]': { audioType: Ti.Media.Sound.AUDIO_TYPE_NOTIFICATION }

// Property(ies): repeatMode - iOS Only
// Component(s): Ti.Media.MusicPlayer
'.music-repeat-mode-all[platform=ios]': { repeatMode: Ti.Media.MUSIC_PLAYER_REPEAT_ALL }
'.music-repeat-mode[platform=ios]': { repeatMode: Ti.Media.MUSIC_PLAYER_REPEAT_DEFAULT }
'.music-repeat-mode-none[platform=ios]': { repeatMode: Ti.Media.MUSIC_PLAYER_REPEAT_NONE }
'.music-repeat-mode-one[platform=ios]': { repeatMode: Ti.Media.MUSIC_PLAYER_REPEAT_ONE }

// Property(ies): shuffleMode - iOS Only
// Component(s): Ti.Media.MusicPlayer
'.music-shuffle-albums[platform=ios]': { shuffleMode: Ti.Media.MUSIC_PLAYER_SHUFFLE_ALBUMS }
'.music-shuffle[platform=ios]': { shuffleMode: Ti.Media.MUSIC_PLAYER_SHUFFLE_DEFAULT }
'.music-shuffle-none[platform=ios]': { shuffleMode: Ti.Media.MUSIC_PLAYER_SHUFFLE_NONE }
'.music-shuffle-songs[platform=ios]': { shuffleMode: Ti.Media.MUSIC_PLAYER_SHUFFLE_SONGS }

// Property(ies): scalingMode
// Component(s): Ti.UI.ImageView
// Description: Background Size for compatibility with Tailwind classes
// Component(s): Ti.UI.ImageView
'.bg-auto': { scalingMode: Ti.Media.IMAGE_SCALING_NONE }
'.bg-cover': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FILL }
'.bg-contain': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FIT }

// Property(ies): scalingMode
// Component(s): Ti.UI.ImageView
// Description: Object Fit for compatibility with Tailwind classes
// Component(s): Ti.UI.ImageView
'.object-auto': { scalingMode: Ti.Media.IMAGE_SCALING_AUTO }
'.object-fill': { scalingMode: Ti.Media.IMAGE_SCALING_FILL }
'.object-none': { scalingMode: Ti.Media.IMAGE_SCALING_NONE }
'.object-cover': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FILL }
'.object-contain': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FIT }

// Property(ies): scalingMode
// Component(s): Ti.UI.ImageView
// Description: Image Scaling Mode
// Component(s): Ti.UI.ImageView
'.image-scaling-auto': { scalingMode: Ti.Media.IMAGE_SCALING_AUTO }
'.image-scaling-none': { scalingMode: Ti.Media.IMAGE_SCALING_NONE }
'.image-scaling-fill': { scalingMode: Ti.Media.IMAGE_SCALING_FILL }
'.image-scaling-cover': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FILL }
'.image-scaling-contain': { scalingMode: Ti.Media.IMAGE_SCALING_ASPECT_FIT }

// Property(ies): scalingMode
// Component(s): Ti.Media.VideoPlayer
// Description: Video Scaling Mode
// Component(s): Ti.Media.VideoPlayer
'.video-scaling-resize': { scalingMode: Ti.Media.VIDEO_SCALING_RESIZE }
'.video-scaling-contain': { scalingMode: Ti.Media.VIDEO_SCALING_RESIZE_ASPECT }
'.video-scaling-cover': { scalingMode: Ti.Media.VIDEO_SCALING_RESIZE_ASPECT_FILL }

// Property(ies): repeatMode
// Component(s): Ti.Media.VideoPlayer
// Description: Determines how the movie player repeats when reaching the end of playback.
// Component(s): Ti.Media.VideoPlayer
'.video-repeat-mode-one': { repeatMode: Ti.Media.VIDEO_REPEAT_MODE_ONE }
'.video-repeat-mode-none': { repeatMode: Ti.Media.VIDEO_REPEAT_MODE_NONE }
```