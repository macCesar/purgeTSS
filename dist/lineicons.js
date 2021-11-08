/**
 * LineIcons Free Basic v 3.0 - https://lineicons.com/icons/?type=free
 * License - https://lineicons.com/license/
*/

exports.getIcon = function getIcon(selector) {
	if (selector === undefined) throw new Error('Selector missing!');
	return (icons[selector] !== undefined) ? icons[selector] : fontawesome[selector];
};

exports.setTitle = function setTitle(selector, object) {
	if (selector === undefined || object === undefined) throw new Error('Selector or target Object missing!');
	object.title = (icons[selector] !== undefined) ? icons[selector] : fontawesome[selector];
};

exports.setText = function setText(selector, object) {
	if (selector === undefined || object === undefined) throw new Error('Selector or target Object missing!');
	object.text = (icons[selector] !== undefined) ? icons[selector] : fontawesome[selector];
};

exports.getRandomKey = function getRandomKey() {
	return Object.keys(icons)[Math.floor(Math.random() * Object.keys(icons).length)];
};

exports.getRandomValue = function getRandomValue() {
	return icons[Object.keys(icons)[Math.floor(Math.random() * Object.keys(icons).length)]];
};

const icons = {
	'500px': '\uea03',
	'addFiles': '\uea01',
	'adobe': '\uea06',
	'agenda': '\uea02',
	'airbnb': '\uea07',
	'alarmClock': '\uea08',
	'alarm': '\uea04',
	'amazonOriginal': '\uea05',
	'amazonPay': '\uea09',
	'amazon': '\uea0a',
	'ambulance': '\uea0b',
	'amex': '\uea0c',
	'anchor': '\uea0d',
	'androidOriginal': '\uea0e',
	'android': '\uea0f',
	'angellist': '\uea10',
	'angleDoubleDown': '\uea11',
	'angleDoubleLeft': '\uea12',
	'angleDoubleRight': '\uea13',
	'angleDoubleUp': '\uea14',
	'angular': '\uea15',
	'apartment': '\uea16',
	'appStore': '\uea17',
	'appleMusic': '\uea18',
	'applePay': '\uea19',
	'apple': '\uea1a',
	'archive': '\uea1f',
	'arrowDownCircle': '\uea1b',
	'arrowDown': '\uea1c',
	'arrowLeftCircle': '\uea1d',
	'arrowLeft': '\uea1e',
	'arrowRightCircle': '\uea20',
	'arrowRight': '\uea21',
	'arrowTopLeft': '\uea22',
	'arrowTopRight': '\uea23',
	'arrowUpCircle': '\uea24',
	'arrowUp': '\uea25',
	'arrowsHorizontal': '\uea26',
	'arrowsVertical': '\uea27',
	'atlassian': '\uea28',
	'aws': '\uea29',
	'azure': '\uea2a',
	'backward': '\uea2b',
	'baloon': '\uea2c',
	'ban': '\uea2d',
	'barChart': '\uea2e',
	'basketball': '\uea2f',
	'behanceOriginal': '\uea30',
	'behance': '\uea31',
	'biCycle': '\uea32',
	'bitbucket': '\uea33',
	'bitcoin': '\uea34',
	'blackboard': '\uea35',
	'blogger': '\uea36',
	'bluetoothOriginal': '\uea37',
	'bluetooth': '\uea38',
	'bold': '\uea39',
	'boltAlt': '\uea3a',
	'bolt': '\uea40',
	'book': '\uea3b',
	'bookmarkAlt': '\uea3c',
	'bookmark': '\uea3d',
	'bootstrap': '\uea3e',
	'bricks': '\uea3f',
	'bridge': '\uea41',
	'briefcase': '\uea42',
	'brushAlt': '\uea43',
	'brush': '\uea44',
	'btc': '\uea45',
	'bubble': '\uea46',
	'bug': '\uea47',
	'bulb': '\uea48',
	'bullhorn': '\uea49',
	'burger': '\uea4a',
	'bus': '\uea4b',
	'cake': '\uea4c',
	'calculator': '\uea4d',
	'calendar': '\uea4e',
	'camera': '\uea4f',
	'candyCane': '\uea50',
	'candy': '\uea51',
	'capsule': '\uea52',
	'carAlt': '\uea53',
	'car': '\uea54',
	'caravan': '\uea55',
	'cartFull': '\uea56',
	'cart': '\uea57',
	'certificate': '\uea58',
	'checkBox': '\uea59',
	'checkmarkCircle': '\uea5a',
	'checkmark': '\uea5b',
	'chefHat': '\uea5c',
	'chevronDownCircle': '\uea5d',
	'chevronDown': '\uea5e',
	'chevronLeftCircle': '\uea5f',
	'chevronLeft': '\uea60',
	'chevronRightCircle': '\uea61',
	'chevronRight': '\uea62',
	'chevronUpCircle': '\uea63',
	'chevronUp': '\uea64',
	'chrome': '\uea65',
	'chromecast': '\uea66',
	'circleMinus': '\uea67',
	'circlePlus': '\uea68',
	'clipboard': '\uea69',
	'close': '\uea6a',
	'cloudCheck': '\uea6b',
	'cloudDownload': '\uea6c',
	'cloudNetwork': '\uea6d',
	'cloudSync': '\uea6e',
	'cloudUpload': '\uea6f',
	'cloud': '\uea70',
	'cloudflare': '\uea71',
	'cloudySun': '\uea72',
	'codeAlt': '\uea73',
	'code': '\uea74',
	'codepen': '\uea75',
	'coffeeCup': '\uea76',
	'cog': '\uea77',
	'cogs': '\uea78',
	'coin': '\uea79',
	'commentsAlt': '\uea7a',
	'commentsReply': '\uea7b',
	'comments': '\uea7c',
	'compass': '\uea7d',
	'connectdevelop': '\uea7e',
	'constructionHammer': '\uea7f',
	'construction': '\uea80',
	'consulting': '\uea81',
	'controlPanel': '\uea82',
	'cool': '\uea83',
	'cpanel': '\uea84',
	'creativeCommons': '\uea85',
	'creditCards': '\uea86',
	'crop': '\uea87',
	'crossCircle': '\uea88',
	'crown': '\uea89',
	'css3': '\uea8a',
	'cup': '\uea8b',
	'customer': '\uea8c',
	'cut': '\uea8d',
	'dashboard': '\uea8e',
	'database': '\uea8f',
	'delivery': '\uea90',
	'dev': '\uea91',
	'diamondAlt': '\uea92',
	'diamond': '\uea93',
	'digitalocean': '\uea94',
	'dinersClub': '\uea95',
	'dinner': '\uea96',
	'directionAlt': '\uea97',
	'directionLtr': '\uea98',
	'directionRtl': '\uea99',
	'direction': '\uea9a',
	'discord': '\uea9b',
	'discover': '\uea9c',
	'displayAlt': '\uea9d',
	'display': '\uea9e',
	'docker': '\uea9f',
	'dollar': '\ueaa0',
	'domain': '\ueaa1',
	'download': '\ueaa2',
	'dribbble': '\ueaa3',
	'drop': '\ueaa4',
	'dropboxOriginal': '\ueaa5',
	'dropbox': '\ueaa6',
	'drupalOriginal': '\ueaa7',
	'drupal': '\ueaa8',
	'dumbbell': '\ueaa9',
	'edge': '\ueaaa',
	'emptyFile': '\ueaab',
	'enter': '\ueaac',
	'envato': '\ueaad',
	'envelope': '\ueaae',
	'eraser': '\ueaaf',
	'euro': '\ueab0',
	'exitDown': '\ueab1',
	'exitUp': '\ueab2',
	'exit': '\ueab3',
	'eye': '\ueab4',
	'facebookFilled': '\ueab5',
	'facebookMessenger': '\ueab6',
	'facebookOriginal': '\ueab7',
	'facebookOval': '\ueab8',
	'facebook': '\ueab9',
	'figma': '\ueaba',
	'files': '\ueabb',
	'firefoxOriginal': '\ueabc',
	'firefox': '\ueabd',
	'fireworks': '\ueabe',
	'firstAid': '\ueabf',
	'flagAlt': '\ueac0',
	'flag': '\ueac1',
	'flags': '\ueac2',
	'flickr': '\ueac3',
	'flower': '\ueac4',
	'folder': '\ueac5',
	'forward': '\ueac6',
	'frameExpand': '\ueac7',
	'freshJuice': '\ueac8',
	'friendly': '\ueac9',
	'fullScreen': '\ueaca',
	'funnel': '\ueacb',
	'gallery': '\ueacc',
	'game': '\ueacd',
	'gatsby': '\ueace',
	'gift': '\ueacf',
	'git': '\uead0',
	'githubOriginal': '\uead1',
	'github': '\uead2',
	'goodreads': '\uead3',
	'googleDrive': '\uead4',
	'googlePay': '\uead5',
	'googleWallet': '\uead6',
	'google': '\uead7',
	'graduation': '\uead8',
	'graph': '\uead9',
	'gridAlt': '\ueada',
	'grid': '\ueadb',
	'grow': '\ueadc',
	'hackerNews': '\ueadd',
	'hammer': '\ueade',
	'hand': '\ueadf',
	'handshake': '\ueae0',
	'happy': '\ueae1',
	'harddrive': '\ueae2',
	'headphoneAlt': '\ueae3',
	'headphone': '\ueae4',
	'heartFilled': '\ueae5',
	'heartMonitor': '\ueae6',
	'heart': '\ueae7',
	'helicopter': '\ueae8',
	'helmet': '\ueae9',
	'help': '\ueaea',
	'highlightAlt': '\ueaeb',
	'highlight': '\ueaec',
	'home': '\ueaed',
	'hospital': '\ueaee',
	'hourglass': '\ueaef',
	'html5': '\ueaf0',
	'image': '\ueaf1',
	'imdb': '\ueaf2',
	'inbox': '\ueaf3',
	'indentDecrease': '\ueaf4',
	'indentIncrease': '\ueaf5',
	'infinite': '\ueaf6',
	'information': '\ueaf7',
	'instagramFilled': '\ueaf8',
	'instagramOriginal': '\ueaf9',
	'instagram': '\ueafa',
	'invention': '\ueafb',
	'investMonitor': '\ueafc',
	'investment': '\ueafd',
	'island': '\ueafe',
	'italic': '\ueaff',
	'java': '\ueb00',
	'javascript': '\ueb01',
	'jcb': '\ueb02',
	'joomlaOriginal': '\ueb03',
	'joomla': '\ueb04',
	'jsfiddle': '\ueb05',
	'juice': '\ueb06',
	'key': '\ueb07',
	'keyboard': '\ueb08',
	'keywordResearch': '\ueb09',
	'laptopPhone': '\ueb0a',
	'laptop': '\ueb0b',
	'laravel': '\ueb0c',
	'layers': '\ueb0d',
	'layout': '\ueb0e',
	'leaf': '\ueb0f',
	'library': '\ueb10',
	'license': '\ueb11',
	'lifering': '\ueb12',
	'lineDashed': '\ueb13',
	'lineDotted': '\ueb14',
	'lineDouble': '\ueb15',
	'lineSpacing': '\ueb16',
	'line': '\ueb17',
	'lineiconsAlt': '\ueb18',
	'lineicons': '\ueb19',
	'link': '\ueb1a',
	'linkedinOriginal': '\ueb1b',
	'linkedin': '\ueb1c',
	'list': '\ueb1d',
	'lockAlt': '\ueb1e',
	'lock': '\ueb1f',
	'magento': '\ueb20',
	'magnet': '\ueb21',
	'magnifier': '\ueb22',
	'mailchimp': '\ueb23',
	'mapMarker': '\ueb24',
	'map': '\ueb25',
	'markdown': '\ueb26',
	'mashroom': '\ueb27',
	'mastercard': '\ueb28',
	'medium': '\ueb29',
	'menu': '\ueb2a',
	'mic': '\ueb2b',
	'microphone': '\ueb2c',
	'microscope': '\ueb2d',
	'microsoftEdge': '\ueb2e',
	'microsoft': '\ueb2f',
	'minus': '\ueb30',
	'mobile': '\ueb31',
	'moneyLocation': '\ueb32',
	'moneyProtection': '\ueb33',
	'moreAlt': '\ueb34',
	'more': '\ueb35',
	'mouse': '\ueb36',
	'move': '\ueb37',
	'music': '\ueb38',
	'netlify': '\ueb39',
	'network': '\ueb3a',
	'night': '\ueb3b',
	'nodejsAlt': '\ueb3c',
	'nodejs': '\ueb3d',
	'notepad': '\ueb3e',
	'npm': '\ueb3f',
	'offer': '\ueb40',
	'opera': '\ueb41',
	'package': '\ueb42',
	'pageBreak': '\ueb43',
	'pagination': '\ueb44',
	'paintBucket': '\ueb45',
	'paintRoller': '\ueb46',
	'pallet': '\ueb47',
	'paperclip': '\ueb48',
	'patreon': '\ueb49',
	'pause': '\ueb4a',
	'paypalOriginal': '\ueb4b',
	'paypal': '\ueb4c',
	'pencilAlt': '\ueb4d',
	'pencil': '\ueb4e',
	'phoneSet': '\ueb4f',
	'phone': '\ueb50',
	'php': '\ueb51',
	'pieChart': '\ueb52',
	'pilcrow': '\ueb53',
	'pin': '\ueb54',
	'pinterest': '\ueb55',
	'pizza': '\ueb56',
	'plane': '\ueb57',
	'playStore': '\ueb58',
	'play': '\ueb59',
	'playstation': '\ueb5a',
	'plug': '\ueb5b',
	'plus': '\ueb5c',
	'pointerDown': '\ueb5d',
	'pointerLeft': '\ueb5e',
	'pointerRight': '\ueb5f',
	'pointerTop': '\ueb60',
	'pointer': '\ueb61',
	'popup': '\ueb62',
	'postcard': '\ueb63',
	'pound': '\ueb64',
	'powerSwitch': '\ueb65',
	'printer': '\ueb66',
	'producthunt': '\ueb67',
	'protection': '\ueb68',
	'pulse': '\ueb69',
	'pyramids': '\ueb6a',
	'python': '\ueb6b',
	'questionCircle': '\ueb6c',
	'quora': '\ueb6d',
	'quotation': '\ueb6e',
	'radioButton': '\ueb6f',
	'rain': '\ueb70',
	'react': '\ueb73',
	'reddit': '\ueb71',
	'reload': '\ueb72',
	'removeFile': '\ueb74',
	'reply': '\ueb75',
	'restaurant': '\ueb76',
	'revenue': '\ueb77',
	'road': '\ueb78',
	'rocket': '\ueb79',
	'rssFeed': '\ueb7a',
	'rulerAlt': '\ueb7b',
	'rulerPencil': '\ueb7c',
	'ruler': '\ueb7d',
	'rupee': '\ueb7e',
	'sad': '\ueb7f',
	'save': '\ueb80',
	'schoolBenchAlt': '\ueb81',
	'schoolBench': '\ueb82',
	'scooter': '\ueb83',
	'scrollDown': '\ueb84',
	'searchAlt': '\ueb85',
	'search': '\ueb86',
	'select': '\ueb87',
	'seo': '\ueb88',
	'service': '\ueb89',
	'shareAlt1': '\ueb8a',
	'shareAlt': '\ueb8b',
	'share': '\ueb8c',
	'shield': '\ueb8d',
	'shiftLeft': '\ueb8e',
	'shiftRight': '\ueb8f',
	'ship': '\ueb90',
	'shopify': '\ueb91',
	'shoppingBasket': '\ueb92',
	'shortcode': '\ueb93',
	'shovel': '\ueb94',
	'shuffle': '\ueb95',
	'signal': '\ueb96',
	'sketch': '\ueb97',
	'skippingRope': '\ueb98',
	'skype': '\ueb99',
	'slackLine': '\ueb9a',
	'slack': '\ueb9b',
	'slice': '\ueb9c',
	'slideshare': '\ueb9d',
	'slim': '\ueb9e',
	'smile': '\ueb9f',
	'snapchat': '\ueba0',
	'sortAlphaAsc': '\ueba1',
	'sortAmountAsc': '\ueba2',
	'sortAmountDsc': '\ueba3',
	'soundcloudOriginal': '\ueba4',
	'soundcloud': '\ueba5',
	'speechless': '\ueba6',
	'spellcheck': '\ueba7',
	'spinnerArrow': '\ueba8',
	'spinnerSolid': '\ueba9',
	'spinner': '\uebaa',
	'spotifyOriginal': '\uebab',
	'spotify': '\uebac',
	'spray': '\uebad',
	'sprout': '\uebae',
	'squarespace': '\uebaf',
	'stackoverflow': '\uebb0',
	'stamp': '\uebb1',
	'starEmpty': '\uebb2',
	'starFilled': '\uebb3',
	'starHalf': '\uebb4',
	'star': '\uebb5',
	'statsDown': '\uebb6',
	'statsUp': '\uebb7',
	'steam': '\uebb8',
	'sthethoscope': '\uebb9',
	'stop': '\uebba',
	'strikethrough': '\uebbb',
	'stripe': '\uebbc',
	'stumbleupon': '\uebbd',
	'sun': '\uebbe',
	'support': '\uebbf',
	'surfBoard': '\uebc0',
	'suspect': '\uebc1',
	'swift': '\uebc2',
	'syringe': '\uebc3',
	'tab': '\uebc4',
	'tag': '\uebc5',
	'targetCustomer': '\uebc6',
	'targetRevenue': '\uebc7',
	'target': '\uebc8',
	'taxi': '\uebc9',
	'teabag': '\uebca',
	'telegramOriginal': '\uebcb',
	'telegram': '\uebcc',
	'textAlignCenter': '\uebcd',
	'textAlignJustify': '\uebce',
	'textAlignLeft': '\uebcf',
	'textAlignRight': '\uebd0',
	'textFormatRemove': '\uebd4',
	'textFormat': '\uebd1',
	'thought': '\uebd2',
	'thumbsDown': '\uebd3',
	'thumbsUp': '\uebd5',
	'thunderAlt': '\uebd6',
	'thunder': '\uebd7',
	'ticketAlt': '\uebd8',
	'ticket': '\uebd9',
	'tiktok': '\uebda',
	'timer': '\uebdb',
	'tounge': '\uebdc',
	'trainAlt': '\uebdd',
	'train': '\uebde',
	'trashCan': '\uebdf',
	'travel': '\uebe0',
	'tree': '\uebe1',
	'trees': '\uebe2',
	'trello': '\uebe3',
	'trowel': '\uebe4',
	'tshirt': '\uebe5',
	'tumblr': '\uebe6',
	'twitch': '\uebe7',
	'twitterFilled': '\uebe8',
	'twitterOriginal': '\uebe9',
	'twitter': '\uebea',
	'ubuntu': '\uebeb',
	'underline': '\uebec',
	'unlink': '\uebed',
	'unlock': '\uebee',
	'unsplash': '\uebef',
	'upload': '\uebf0',
	'user': '\uebf1',
	'users': '\uebf6',
	'ux': '\uebf2',
	'vector': '\uebf3',
	'video': '\uebf4',
	'vimeo': '\uebf5',
	'visa': '\uebf7',
	'vk': '\uebf8',
	'volumeHigh': '\uebf9',
	'volumeLow': '\uebfa',
	'volumeMedium': '\uebfb',
	'volumeMute': '\uebfc',
	'volume': '\uebfd',
	'wallet': '\uebfe',
	'warning': '\uebff',
	'websiteAlt': '\uec00',
	'website': '\uec01',
	'wechat': '\uec02',
	'weight': '\uec03',
	'whatsapp': '\uec04',
	'wheelbarrow': '\uec05',
	'wheelchair': '\uec06',
	'windows': '\uec07',
	'wordpressFilled': '\uec08',
	'wordpress': '\uec09',
	'worldAlt': '\uec0a',
	'world': '\uec0c',
	'write': '\uec0b',
	'xbox': '\uec0d',
	'yahoo': '\uec0e',
	'ycombinator': '\uec0f',
	'yen': '\uec10',
	'youtube': '\uec13',
	'zip': '\uec11',
	'zoomIn': '\uec12',
	'zoomOut': '\uec14',
};
exports.icons = icons;
