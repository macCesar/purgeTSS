/**
 * Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
*/

exports.getIcon = function getIcon(selector) {
	if (selector === undefined) throw new Error('Selector missing!');
	return (icons[ selector ] !== undefined) ? icons[ selector ] : fontawesome[ selector ];
};

exports.setTitle = function setTitle(selector, object) {
	if (selector === undefined || object === undefined) throw new Error('Selector or target Object missing!');
	object.title = (icons[ selector ] !== undefined) ? icons[ selector ] : fontawesome[ selector ];
};

exports.setText = function setText(selector, object) {
	if (selector === undefined || object === undefined) throw new Error('Selector or target Object missing!');
	object.text = (icons[ selector ] !== undefined) ? icons[ selector ] : fontawesome[ selector ];
};

exports.getRandomKey = function getRandomKey() {
	return Object.keys(icons)[ Math.floor(Math.random() * Object.keys(icons).length) ];
};

exports.getRandomValue = function getRandomValue() {
	return icons[ Object.keys(icons)[ Math.floor(Math.random() * Object.keys(icons).length) ] ];
};

const icons = {
	'500px': '\uf26e',
	'accessibleIcon': '\uf368',
	'accusoft': '\uf369',
	'acquisitionsIncorporated': '\uf6af',
	'ad': '\uf641',
	'addressBook': '\uf2b9',
	'addressCard': '\uf2bb',
	'adjust': '\uf042',
	'adn': '\uf170',
	'adversal': '\uf36a',
	'affiliatetheme': '\uf36b',
	'airFreshener': '\uf5d0',
	'airbnb': '\uf834',
	'algolia': '\uf36c',
	'alignCenter': '\uf037',
	'alignJustify': '\uf039',
	'alignLeft': '\uf036',
	'alignRight': '\uf038',
	'alipay': '\uf642',
	'allergies': '\uf461',
	'amazon': '\uf270',
	'amazonPay': '\uf42c',
	'ambulance': '\uf0f9',
	'americanSignLanguageInterpreting': '\uf2a3',
	'amilia': '\uf36d',
	'anchor': '\uf13d',
	'android': '\uf17b',
	'angellist': '\uf209',
	'angleDoubleDown': '\uf103',
	'angleDoubleLeft': '\uf100',
	'angleDoubleRight': '\uf101',
	'angleDoubleUp': '\uf102',
	'angleDown': '\uf107',
	'angleLeft': '\uf104',
	'angleRight': '\uf105',
	'angleUp': '\uf106',
	'angry': '\uf556',
	'angrycreative': '\uf36e',
	'angular': '\uf420',
	'ankh': '\uf644',
	'appStore': '\uf36f',
	'appStoreIos': '\uf370',
	'apper': '\uf371',
	'apple': '\uf179',
	'appleAlt': '\uf5d1',
	'applePay': '\uf415',
	'archive': '\uf187',
	'archway': '\uf557',
	'arrowAltCircleDown': '\uf358',
	'arrowAltCircleLeft': '\uf359',
	'arrowAltCircleRight': '\uf35a',
	'arrowAltCircleUp': '\uf35b',
	'arrowCircleDown': '\uf0ab',
	'arrowCircleLeft': '\uf0a8',
	'arrowCircleRight': '\uf0a9',
	'arrowCircleUp': '\uf0aa',
	'arrowDown': '\uf063',
	'arrowLeft': '\uf060',
	'arrowRight': '\uf061',
	'arrowUp': '\uf062',
	'arrowsAlt': '\uf0b2',
	'arrowsAltH': '\uf337',
	'arrowsAltV': '\uf338',
	'artstation': '\uf77a',
	'assistiveListeningSystems': '\uf2a2',
	'asterisk': '\uf069',
	'asymmetrik': '\uf372',
	'at': '\uf1fa',
	'atlas': '\uf558',
	'atlassian': '\uf77b',
	'atom': '\uf5d2',
	'audible': '\uf373',
	'audioDescription': '\uf29e',
	'autoprefixer': '\uf41c',
	'avianex': '\uf374',
	'aviato': '\uf421',
	'award': '\uf559',
	'aws': '\uf375',
	'baby': '\uf77c',
	'babyCarriage': '\uf77d',
	'backspace': '\uf55a',
	'backward': '\uf04a',
	'bacon': '\uf7e5',
	'bacteria': '\ue059',
	'bacterium': '\ue05a',
	'bahai': '\uf666',
	'balanceScale': '\uf24e',
	'balanceScaleLeft': '\uf515',
	'balanceScaleRight': '\uf516',
	'ban': '\uf05e',
	'bandAid': '\uf462',
	'bandcamp': '\uf2d5',
	'barcode': '\uf02a',
	'bars': '\uf0c9',
	'baseballBall': '\uf433',
	'basketballBall': '\uf434',
	'bath': '\uf2cd',
	'batteryEmpty': '\uf244',
	'batteryFull': '\uf240',
	'batteryHalf': '\uf242',
	'batteryQuarter': '\uf243',
	'batteryThreeQuarters': '\uf241',
	'battleNet': '\uf835',
	'bed': '\uf236',
	'beer': '\uf0fc',
	'behance': '\uf1b4',
	'behanceSquare': '\uf1b5',
	'bell': '\uf0f3',
	'bellSlash': '\uf1f6',
	'bezierCurve': '\uf55b',
	'bible': '\uf647',
	'bicycle': '\uf206',
	'biking': '\uf84a',
	'bimobject': '\uf378',
	'binoculars': '\uf1e5',
	'biohazard': '\uf780',
	'birthdayCake': '\uf1fd',
	'bitbucket': '\uf171',
	'bitcoin': '\uf379',
	'bity': '\uf37a',
	'blackTie': '\uf27e',
	'blackberry': '\uf37b',
	'blender': '\uf517',
	'blenderPhone': '\uf6b6',
	'blind': '\uf29d',
	'blog': '\uf781',
	'blogger': '\uf37c',
	'bloggerB': '\uf37d',
	'bluetooth': '\uf293',
	'bluetoothB': '\uf294',
	'bold': '\uf032',
	'bolt': '\uf0e7',
	'bomb': '\uf1e2',
	'bone': '\uf5d7',
	'bong': '\uf55c',
	'book': '\uf02d',
	'bookDead': '\uf6b7',
	'bookMedical': '\uf7e6',
	'bookOpen': '\uf518',
	'bookReader': '\uf5da',
	'bookmark': '\uf02e',
	'bootstrap': '\uf836',
	'borderAll': '\uf84c',
	'borderNone': '\uf850',
	'borderStyle': '\uf853',
	'bowlingBall': '\uf436',
	'box': '\uf466',
	'boxOpen': '\uf49e',
	'boxTissue': '\ue05b',
	'boxes': '\uf468',
	'braille': '\uf2a1',
	'brain': '\uf5dc',
	'breadSlice': '\uf7ec',
	'briefcase': '\uf0b1',
	'briefcaseMedical': '\uf469',
	'broadcastTower': '\uf519',
	'broom': '\uf51a',
	'brush': '\uf55d',
	'btc': '\uf15a',
	'buffer': '\uf837',
	'bug': '\uf188',
	'building': '\uf1ad',
	'bullhorn': '\uf0a1',
	'bullseye': '\uf140',
	'burn': '\uf46a',
	'buromobelexperte': '\uf37f',
	'bus': '\uf207',
	'busAlt': '\uf55e',
	'businessTime': '\uf64a',
	'buyNLarge': '\uf8a6',
	'buysellads': '\uf20d',
	'calculator': '\uf1ec',
	'calendar': '\uf133',
	'calendarAlt': '\uf073',
	'calendarCheck': '\uf274',
	'calendarDay': '\uf783',
	'calendarMinus': '\uf272',
	'calendarPlus': '\uf271',
	'calendarTimes': '\uf273',
	'calendarWeek': '\uf784',
	'camera': '\uf030',
	'cameraRetro': '\uf083',
	'campground': '\uf6bb',
	'canadianMapleLeaf': '\uf785',
	'candyCane': '\uf786',
	'cannabis': '\uf55f',
	'capsules': '\uf46b',
	'car': '\uf1b9',
	'carAlt': '\uf5de',
	'carBattery': '\uf5df',
	'carCrash': '\uf5e1',
	'carSide': '\uf5e4',
	'caravan': '\uf8ff',
	'caretDown': '\uf0d7',
	'caretLeft': '\uf0d9',
	'caretRight': '\uf0da',
	'caretSquareDown': '\uf150',
	'caretSquareLeft': '\uf191',
	'caretSquareRight': '\uf152',
	'caretSquareUp': '\uf151',
	'caretUp': '\uf0d8',
	'carrot': '\uf787',
	'cartArrowDown': '\uf218',
	'cartPlus': '\uf217',
	'cashRegister': '\uf788',
	'cat': '\uf6be',
	'ccAmazonPay': '\uf42d',
	'ccAmex': '\uf1f3',
	'ccApplePay': '\uf416',
	'ccDinersClub': '\uf24c',
	'ccDiscover': '\uf1f2',
	'ccJcb': '\uf24b',
	'ccMastercard': '\uf1f1',
	'ccPaypal': '\uf1f4',
	'ccStripe': '\uf1f5',
	'ccVisa': '\uf1f0',
	'centercode': '\uf380',
	'centos': '\uf789',
	'certificate': '\uf0a3',
	'chair': '\uf6c0',
	'chalkboard': '\uf51b',
	'chalkboardTeacher': '\uf51c',
	'chargingStation': '\uf5e7',
	'chartArea': '\uf1fe',
	'chartBar': '\uf080',
	'chartLine': '\uf201',
	'chartPie': '\uf200',
	'check': '\uf00c',
	'checkCircle': '\uf058',
	'checkDouble': '\uf560',
	'checkSquare': '\uf14a',
	'cheese': '\uf7ef',
	'chess': '\uf439',
	'chessBishop': '\uf43a',
	'chessBoard': '\uf43c',
	'chessKing': '\uf43f',
	'chessKnight': '\uf441',
	'chessPawn': '\uf443',
	'chessQueen': '\uf445',
	'chessRook': '\uf447',
	'chevronCircleDown': '\uf13a',
	'chevronCircleLeft': '\uf137',
	'chevronCircleRight': '\uf138',
	'chevronCircleUp': '\uf139',
	'chevronDown': '\uf078',
	'chevronLeft': '\uf053',
	'chevronRight': '\uf054',
	'chevronUp': '\uf077',
	'child': '\uf1ae',
	'chrome': '\uf268',
	'chromecast': '\uf838',
	'church': '\uf51d',
	'circle': '\uf111',
	'circleNotch': '\uf1ce',
	'city': '\uf64f',
	'clinicMedical': '\uf7f2',
	'clipboard': '\uf328',
	'clipboardCheck': '\uf46c',
	'clipboardList': '\uf46d',
	'clock': '\uf017',
	'clone': '\uf24d',
	'closedCaptioning': '\uf20a',
	'cloud': '\uf0c2',
	'cloudDownloadAlt': '\uf381',
	'cloudMeatball': '\uf73b',
	'cloudMoon': '\uf6c3',
	'cloudMoonRain': '\uf73c',
	'cloudRain': '\uf73d',
	'cloudShowersHeavy': '\uf740',
	'cloudSun': '\uf6c4',
	'cloudSunRain': '\uf743',
	'cloudUploadAlt': '\uf382',
	'cloudflare': '\ue07d',
	'cloudscale': '\uf383',
	'cloudsmith': '\uf384',
	'cloudversify': '\uf385',
	'cocktail': '\uf561',
	'code': '\uf121',
	'codeBranch': '\uf126',
	'codepen': '\uf1cb',
	'codiepie': '\uf284',
	'coffee': '\uf0f4',
	'cog': '\uf013',
	'cogs': '\uf085',
	'coins': '\uf51e',
	'columns': '\uf0db',
	'comment': '\uf075',
	'commentAlt': '\uf27a',
	'commentDollar': '\uf651',
	'commentDots': '\uf4ad',
	'commentMedical': '\uf7f5',
	'commentSlash': '\uf4b3',
	'comments': '\uf086',
	'commentsDollar': '\uf653',
	'compactDisc': '\uf51f',
	'compass': '\uf14e',
	'compress': '\uf066',
	'compressAlt': '\uf422',
	'compressArrowsAlt': '\uf78c',
	'conciergeBell': '\uf562',
	'confluence': '\uf78d',
	'connectdevelop': '\uf20e',
	'contao': '\uf26d',
	'cookie': '\uf563',
	'cookieBite': '\uf564',
	'copy': '\uf0c5',
	'copyright': '\uf1f9',
	'cottonBureau': '\uf89e',
	'couch': '\uf4b8',
	'cpanel': '\uf388',
	'creativeCommons': '\uf25e',
	'creativeCommonsBy': '\uf4e7',
	'creativeCommonsNc': '\uf4e8',
	'creativeCommonsNcEu': '\uf4e9',
	'creativeCommonsNcJp': '\uf4ea',
	'creativeCommonsNd': '\uf4eb',
	'creativeCommonsPd': '\uf4ec',
	'creativeCommonsPdAlt': '\uf4ed',
	'creativeCommonsRemix': '\uf4ee',
	'creativeCommonsSa': '\uf4ef',
	'creativeCommonsSampling': '\uf4f0',
	'creativeCommonsSamplingPlus': '\uf4f1',
	'creativeCommonsShare': '\uf4f2',
	'creativeCommonsZero': '\uf4f3',
	'creditCard': '\uf09d',
	'criticalRole': '\uf6c9',
	'crop': '\uf125',
	'cropAlt': '\uf565',
	'cross': '\uf654',
	'crosshairs': '\uf05b',
	'crow': '\uf520',
	'crown': '\uf521',
	'crutch': '\uf7f7',
	'css3': '\uf13c',
	'css3Alt': '\uf38b',
	'cube': '\uf1b2',
	'cubes': '\uf1b3',
	'cut': '\uf0c4',
	'cuttlefish': '\uf38c',
	'dAndD': '\uf38d',
	'dAndDBeyond': '\uf6ca',
	'dailymotion': '\ue052',
	'dashcube': '\uf210',
	'database': '\uf1c0',
	'deaf': '\uf2a4',
	'deezer': '\ue077',
	'delicious': '\uf1a5',
	'democrat': '\uf747',
	'deploydog': '\uf38e',
	'deskpro': '\uf38f',
	'desktop': '\uf108',
	'dev': '\uf6cc',
	'deviantart': '\uf1bd',
	'dharmachakra': '\uf655',
	'dhl': '\uf790',
	'diagnoses': '\uf470',
	'diaspora': '\uf791',
	'dice': '\uf522',
	'diceD20': '\uf6cf',
	'diceD6': '\uf6d1',
	'diceFive': '\uf523',
	'diceFour': '\uf524',
	'diceOne': '\uf525',
	'diceSix': '\uf526',
	'diceThree': '\uf527',
	'diceTwo': '\uf528',
	'digg': '\uf1a6',
	'digitalOcean': '\uf391',
	'digitalTachograph': '\uf566',
	'directions': '\uf5eb',
	'discord': '\uf392',
	'discourse': '\uf393',
	'disease': '\uf7fa',
	'divide': '\uf529',
	'dizzy': '\uf567',
	'dna': '\uf471',
	'dochub': '\uf394',
	'docker': '\uf395',
	'dog': '\uf6d3',
	'dollarSign': '\uf155',
	'dolly': '\uf472',
	'dollyFlatbed': '\uf474',
	'donate': '\uf4b9',
	'doorClosed': '\uf52a',
	'doorOpen': '\uf52b',
	'dotCircle': '\uf192',
	'dove': '\uf4ba',
	'download': '\uf019',
	'draft2digital': '\uf396',
	'draftingCompass': '\uf568',
	'dragon': '\uf6d5',
	'drawPolygon': '\uf5ee',
	'dribbble': '\uf17d',
	'dribbbleSquare': '\uf397',
	'dropbox': '\uf16b',
	'drum': '\uf569',
	'drumSteelpan': '\uf56a',
	'drumstickBite': '\uf6d7',
	'drupal': '\uf1a9',
	'dumbbell': '\uf44b',
	'dumpster': '\uf793',
	'dumpsterFire': '\uf794',
	'dungeon': '\uf6d9',
	'dyalog': '\uf399',
	'earlybirds': '\uf39a',
	'ebay': '\uf4f4',
	'edge': '\uf282',
	'edgeLegacy': '\ue078',
	'edit': '\uf044',
	'egg': '\uf7fb',
	'eject': '\uf052',
	'elementor': '\uf430',
	'ellipsisH': '\uf141',
	'ellipsisV': '\uf142',
	'ello': '\uf5f1',
	'ember': '\uf423',
	'empire': '\uf1d1',
	'envelope': '\uf0e0',
	'envelopeOpen': '\uf2b6',
	'envelopeOpenText': '\uf658',
	'envelopeSquare': '\uf199',
	'envira': '\uf299',
	'equals': '\uf52c',
	'eraser': '\uf12d',
	'erlang': '\uf39d',
	'ethereum': '\uf42e',
	'ethernet': '\uf796',
	'etsy': '\uf2d7',
	'euroSign': '\uf153',
	'evernote': '\uf839',
	'exchangeAlt': '\uf362',
	'exclamation': '\uf12a',
	'exclamationCircle': '\uf06a',
	'exclamationTriangle': '\uf071',
	'expand': '\uf065',
	'expandAlt': '\uf424',
	'expandArrowsAlt': '\uf31e',
	'expeditedssl': '\uf23e',
	'externalLinkAlt': '\uf35d',
	'externalLinkSquareAlt': '\uf360',
	'eye': '\uf06e',
	'eyeDropper': '\uf1fb',
	'eyeSlash': '\uf070',
	'facebook': '\uf09a',
	'facebookF': '\uf39e',
	'facebookMessenger': '\uf39f',
	'facebookSquare': '\uf082',
	'fan': '\uf863',
	'fantasyFlightGames': '\uf6dc',
	'fastBackward': '\uf049',
	'fastForward': '\uf050',
	'faucet': '\ue005',
	'fax': '\uf1ac',
	'feather': '\uf52d',
	'featherAlt': '\uf56b',
	'fedex': '\uf797',
	'fedora': '\uf798',
	'female': '\uf182',
	'fighterJet': '\uf0fb',
	'figma': '\uf799',
	'file': '\uf15b',
	'fileAlt': '\uf15c',
	'fileArchive': '\uf1c6',
	'fileAudio': '\uf1c7',
	'fileCode': '\uf1c9',
	'fileContract': '\uf56c',
	'fileCsv': '\uf6dd',
	'fileDownload': '\uf56d',
	'fileExcel': '\uf1c3',
	'fileExport': '\uf56e',
	'fileImage': '\uf1c5',
	'fileImport': '\uf56f',
	'fileInvoice': '\uf570',
	'fileInvoiceDollar': '\uf571',
	'fileMedical': '\uf477',
	'fileMedicalAlt': '\uf478',
	'filePdf': '\uf1c1',
	'filePowerpoint': '\uf1c4',
	'filePrescription': '\uf572',
	'fileSignature': '\uf573',
	'fileUpload': '\uf574',
	'fileVideo': '\uf1c8',
	'fileWord': '\uf1c2',
	'fill': '\uf575',
	'fillDrip': '\uf576',
	'film': '\uf008',
	'filter': '\uf0b0',
	'fingerprint': '\uf577',
	'fire': '\uf06d',
	'fireAlt': '\uf7e4',
	'fireExtinguisher': '\uf134',
	'firefox': '\uf269',
	'firefoxBrowser': '\ue007',
	'firstAid': '\uf479',
	'firstOrder': '\uf2b0',
	'firstOrderAlt': '\uf50a',
	'firstdraft': '\uf3a1',
	'fish': '\uf578',
	'fistRaised': '\uf6de',
	'flag': '\uf024',
	'flagCheckered': '\uf11e',
	'flagUsa': '\uf74d',
	'flask': '\uf0c3',
	'flickr': '\uf16e',
	'flipboard': '\uf44d',
	'flushed': '\uf579',
	'fly': '\uf417',
	'folder': '\uf07b',
	'folderMinus': '\uf65d',
	'folderOpen': '\uf07c',
	'folderPlus': '\uf65e',
	'font': '\uf031',
	'fontAwesome': '\uf2b4',
	'fontAwesomeAlt': '\uf35c',
	'fontAwesomeFlag': '\uf425',
	'fontAwesomeLogoFull': '\uf4e6',
	'fonticons': '\uf280',
	'fonticonsFi': '\uf3a2',
	'footballBall': '\uf44e',
	'fortAwesome': '\uf286',
	'fortAwesomeAlt': '\uf3a3',
	'forumbee': '\uf211',
	'forward': '\uf04e',
	'foursquare': '\uf180',
	'freeCodeCamp': '\uf2c5',
	'freebsd': '\uf3a4',
	'frog': '\uf52e',
	'frown': '\uf119',
	'frownOpen': '\uf57a',
	'fulcrum': '\uf50b',
	'funnelDollar': '\uf662',
	'futbol': '\uf1e3',
	'galacticRepublic': '\uf50c',
	'galacticSenate': '\uf50d',
	'gamepad': '\uf11b',
	'gasPump': '\uf52f',
	'gavel': '\uf0e3',
	'gem': '\uf3a5',
	'genderless': '\uf22d',
	'getPocket': '\uf265',
	'gg': '\uf260',
	'ggCircle': '\uf261',
	'ghost': '\uf6e2',
	'gift': '\uf06b',
	'gifts': '\uf79c',
	'git': '\uf1d3',
	'gitAlt': '\uf841',
	'gitSquare': '\uf1d2',
	'github': '\uf09b',
	'githubAlt': '\uf113',
	'githubSquare': '\uf092',
	'gitkraken': '\uf3a6',
	'gitlab': '\uf296',
	'gitter': '\uf426',
	'glassCheers': '\uf79f',
	'glassMartini': '\uf000',
	'glassMartiniAlt': '\uf57b',
	'glassWhiskey': '\uf7a0',
	'glasses': '\uf530',
	'glide': '\uf2a5',
	'glideG': '\uf2a6',
	'globe': '\uf0ac',
	'globeAfrica': '\uf57c',
	'globeAmericas': '\uf57d',
	'globeAsia': '\uf57e',
	'globeEurope': '\uf7a2',
	'gofore': '\uf3a7',
	'golfBall': '\uf450',
	'goodreads': '\uf3a8',
	'goodreadsG': '\uf3a9',
	'google': '\uf1a0',
	'googleDrive': '\uf3aa',
	'googlePay': '\ue079',
	'googlePlay': '\uf3ab',
	'googlePlus': '\uf2b3',
	'googlePlusG': '\uf0d5',
	'googlePlusSquare': '\uf0d4',
	'googleWallet': '\uf1ee',
	'gopuram': '\uf664',
	'graduationCap': '\uf19d',
	'gratipay': '\uf184',
	'grav': '\uf2d6',
	'greaterThan': '\uf531',
	'greaterThanEqual': '\uf532',
	'grimace': '\uf57f',
	'grin': '\uf580',
	'grinAlt': '\uf581',
	'grinBeam': '\uf582',
	'grinBeamSweat': '\uf583',
	'grinHearts': '\uf584',
	'grinSquint': '\uf585',
	'grinSquintTears': '\uf586',
	'grinStars': '\uf587',
	'grinTears': '\uf588',
	'grinTongue': '\uf589',
	'grinTongueSquint': '\uf58a',
	'grinTongueWink': '\uf58b',
	'grinWink': '\uf58c',
	'gripHorizontal': '\uf58d',
	'gripLines': '\uf7a4',
	'gripLinesVertical': '\uf7a5',
	'gripVertical': '\uf58e',
	'gripfire': '\uf3ac',
	'grunt': '\uf3ad',
	'guilded': '\ue07e',
	'guitar': '\uf7a6',
	'gulp': '\uf3ae',
	'hSquare': '\uf0fd',
	'hackerNews': '\uf1d4',
	'hackerNewsSquare': '\uf3af',
	'hackerrank': '\uf5f7',
	'hamburger': '\uf805',
	'hammer': '\uf6e3',
	'hamsa': '\uf665',
	'handHolding': '\uf4bd',
	'handHoldingHeart': '\uf4be',
	'handHoldingMedical': '\ue05c',
	'handHoldingUsd': '\uf4c0',
	'handHoldingWater': '\uf4c1',
	'handLizard': '\uf258',
	'handMiddleFinger': '\uf806',
	'handPaper': '\uf256',
	'handPeace': '\uf25b',
	'handPointDown': '\uf0a7',
	'handPointLeft': '\uf0a5',
	'handPointRight': '\uf0a4',
	'handPointUp': '\uf0a6',
	'handPointer': '\uf25a',
	'handRock': '\uf255',
	'handScissors': '\uf257',
	'handSparkles': '\ue05d',
	'handSpock': '\uf259',
	'hands': '\uf4c2',
	'handsHelping': '\uf4c4',
	'handsWash': '\ue05e',
	'handshake': '\uf2b5',
	'handshakeAltSlash': '\ue05f',
	'handshakeSlash': '\ue060',
	'hanukiah': '\uf6e6',
	'hardHat': '\uf807',
	'hashtag': '\uf292',
	'hatCowboy': '\uf8c0',
	'hatCowboySide': '\uf8c1',
	'hatWizard': '\uf6e8',
	'hdd': '\uf0a0',
	'headSideCough': '\ue061',
	'headSideCoughSlash': '\ue062',
	'headSideMask': '\ue063',
	'headSideVirus': '\ue064',
	'heading': '\uf1dc',
	'headphones': '\uf025',
	'headphonesAlt': '\uf58f',
	'headset': '\uf590',
	'heart': '\uf004',
	'heartBroken': '\uf7a9',
	'heartbeat': '\uf21e',
	'helicopter': '\uf533',
	'highlighter': '\uf591',
	'hiking': '\uf6ec',
	'hippo': '\uf6ed',
	'hips': '\uf452',
	'hireAHelper': '\uf3b0',
	'history': '\uf1da',
	'hive': '\ue07f',
	'hockeyPuck': '\uf453',
	'hollyBerry': '\uf7aa',
	'home': '\uf015',
	'hooli': '\uf427',
	'hornbill': '\uf592',
	'horse': '\uf6f0',
	'horseHead': '\uf7ab',
	'hospital': '\uf0f8',
	'hospitalAlt': '\uf47d',
	'hospitalSymbol': '\uf47e',
	'hospitalUser': '\uf80d',
	'hotTub': '\uf593',
	'hotdog': '\uf80f',
	'hotel': '\uf594',
	'hotjar': '\uf3b1',
	'hourglass': '\uf254',
	'hourglassEnd': '\uf253',
	'hourglassHalf': '\uf252',
	'hourglassStart': '\uf251',
	'houseDamage': '\uf6f1',
	'houseUser': '\ue065',
	'houzz': '\uf27c',
	'hryvnia': '\uf6f2',
	'html5': '\uf13b',
	'hubspot': '\uf3b2',
	'iCursor': '\uf246',
	'iceCream': '\uf810',
	'icicles': '\uf7ad',
	'icons': '\uf86d',
	'idBadge': '\uf2c1',
	'idCard': '\uf2c2',
	'idCardAlt': '\uf47f',
	'ideal': '\ue013',
	'igloo': '\uf7ae',
	'image': '\uf03e',
	'images': '\uf302',
	'imdb': '\uf2d8',
	'inbox': '\uf01c',
	'indent': '\uf03c',
	'industry': '\uf275',
	'infinity': '\uf534',
	'info': '\uf129',
	'infoCircle': '\uf05a',
	'innosoft': '\ue080',
	'instagram': '\uf16d',
	'instagramSquare': '\ue055',
	'instalod': '\ue081',
	'intercom': '\uf7af',
	'internetExplorer': '\uf26b',
	'invision': '\uf7b0',
	'ioxhost': '\uf208',
	'italic': '\uf033',
	'itchIo': '\uf83a',
	'itunes': '\uf3b4',
	'itunesNote': '\uf3b5',
	'java': '\uf4e4',
	'jedi': '\uf669',
	'jediOrder': '\uf50e',
	'jenkins': '\uf3b6',
	'jira': '\uf7b1',
	'joget': '\uf3b7',
	'joint': '\uf595',
	'joomla': '\uf1aa',
	'journalWhills': '\uf66a',
	'js': '\uf3b8',
	'jsSquare': '\uf3b9',
	'jsfiddle': '\uf1cc',
	'kaaba': '\uf66b',
	'kaggle': '\uf5fa',
	'key': '\uf084',
	'keybase': '\uf4f5',
	'keyboard': '\uf11c',
	'keycdn': '\uf3ba',
	'khanda': '\uf66d',
	'kickstarter': '\uf3bb',
	'kickstarterK': '\uf3bc',
	'kiss': '\uf596',
	'kissBeam': '\uf597',
	'kissWinkHeart': '\uf598',
	'kiwiBird': '\uf535',
	'korvue': '\uf42f',
	'landmark': '\uf66f',
	'language': '\uf1ab',
	'laptop': '\uf109',
	'laptopCode': '\uf5fc',
	'laptopHouse': '\ue066',
	'laptopMedical': '\uf812',
	'laravel': '\uf3bd',
	'lastfm': '\uf202',
	'lastfmSquare': '\uf203',
	'laugh': '\uf599',
	'laughBeam': '\uf59a',
	'laughSquint': '\uf59b',
	'laughWink': '\uf59c',
	'layerGroup': '\uf5fd',
	'leaf': '\uf06c',
	'leanpub': '\uf212',
	'lemon': '\uf094',
	'less': '\uf41d',
	'lessThan': '\uf536',
	'lessThanEqual': '\uf537',
	'levelDownAlt': '\uf3be',
	'levelUpAlt': '\uf3bf',
	'lifeRing': '\uf1cd',
	'lightbulb': '\uf0eb',
	'line': '\uf3c0',
	'link': '\uf0c1',
	'linkedin': '\uf08c',
	'linkedinIn': '\uf0e1',
	'linode': '\uf2b8',
	'linux': '\uf17c',
	'liraSign': '\uf195',
	'list': '\uf03a',
	'listAlt': '\uf022',
	'listOl': '\uf0cb',
	'listUl': '\uf0ca',
	'locationArrow': '\uf124',
	'lock': '\uf023',
	'lockOpen': '\uf3c1',
	'longArrowAltDown': '\uf309',
	'longArrowAltLeft': '\uf30a',
	'longArrowAltRight': '\uf30b',
	'longArrowAltUp': '\uf30c',
	'lowVision': '\uf2a8',
	'luggageCart': '\uf59d',
	'lungs': '\uf604',
	'lungsVirus': '\ue067',
	'lyft': '\uf3c3',
	'magento': '\uf3c4',
	'magic': '\uf0d0',
	'magnet': '\uf076',
	'mailBulk': '\uf674',
	'mailchimp': '\uf59e',
	'male': '\uf183',
	'mandalorian': '\uf50f',
	'map': '\uf279',
	'mapMarked': '\uf59f',
	'mapMarkedAlt': '\uf5a0',
	'mapMarker': '\uf041',
	'mapMarkerAlt': '\uf3c5',
	'mapPin': '\uf276',
	'mapSigns': '\uf277',
	'markdown': '\uf60f',
	'marker': '\uf5a1',
	'mars': '\uf222',
	'marsDouble': '\uf227',
	'marsStroke': '\uf229',
	'marsStrokeH': '\uf22b',
	'marsStrokeV': '\uf22a',
	'mask': '\uf6fa',
	'mastodon': '\uf4f6',
	'maxcdn': '\uf136',
	'mdb': '\uf8ca',
	'medal': '\uf5a2',
	'medapps': '\uf3c6',
	'medium': '\uf23a',
	'mediumM': '\uf3c7',
	'medkit': '\uf0fa',
	'medrt': '\uf3c8',
	'meetup': '\uf2e0',
	'megaport': '\uf5a3',
	'meh': '\uf11a',
	'mehBlank': '\uf5a4',
	'mehRollingEyes': '\uf5a5',
	'memory': '\uf538',
	'mendeley': '\uf7b3',
	'menorah': '\uf676',
	'mercury': '\uf223',
	'meteor': '\uf753',
	'microblog': '\ue01a',
	'microchip': '\uf2db',
	'microphone': '\uf130',
	'microphoneAlt': '\uf3c9',
	'microphoneAltSlash': '\uf539',
	'microphoneSlash': '\uf131',
	'microscope': '\uf610',
	'microsoft': '\uf3ca',
	'minus': '\uf068',
	'minusCircle': '\uf056',
	'minusSquare': '\uf146',
	'mitten': '\uf7b5',
	'mix': '\uf3cb',
	'mixcloud': '\uf289',
	'mixer': '\ue056',
	'mizuni': '\uf3cc',
	'mobile': '\uf10b',
	'mobileAlt': '\uf3cd',
	'modx': '\uf285',
	'monero': '\uf3d0',
	'moneyBill': '\uf0d6',
	'moneyBillAlt': '\uf3d1',
	'moneyBillWave': '\uf53a',
	'moneyBillWaveAlt': '\uf53b',
	'moneyCheck': '\uf53c',
	'moneyCheckAlt': '\uf53d',
	'monument': '\uf5a6',
	'moon': '\uf186',
	'mortarPestle': '\uf5a7',
	'mosque': '\uf678',
	'motorcycle': '\uf21c',
	'mountain': '\uf6fc',
	'mouse': '\uf8cc',
	'mousePointer': '\uf245',
	'mugHot': '\uf7b6',
	'music': '\uf001',
	'napster': '\uf3d2',
	'neos': '\uf612',
	'networkWired': '\uf6ff',
	'neuter': '\uf22c',
	'newspaper': '\uf1ea',
	'nimblr': '\uf5a8',
	'node': '\uf419',
	'nodeJs': '\uf3d3',
	'notEqual': '\uf53e',
	'notesMedical': '\uf481',
	'npm': '\uf3d4',
	'ns8': '\uf3d5',
	'nutritionix': '\uf3d6',
	'objectGroup': '\uf247',
	'objectUngroup': '\uf248',
	'octopusDeploy': '\ue082',
	'odnoklassniki': '\uf263',
	'odnoklassnikiSquare': '\uf264',
	'oilCan': '\uf613',
	'oldRepublic': '\uf510',
	'om': '\uf679',
	'opencart': '\uf23d',
	'openid': '\uf19b',
	'opera': '\uf26a',
	'optinMonster': '\uf23c',
	'orcid': '\uf8d2',
	'osi': '\uf41a',
	'otter': '\uf700',
	'outdent': '\uf03b',
	'page4': '\uf3d7',
	'pagelines': '\uf18c',
	'pager': '\uf815',
	'paintBrush': '\uf1fc',
	'paintRoller': '\uf5aa',
	'palette': '\uf53f',
	'palfed': '\uf3d8',
	'pallet': '\uf482',
	'paperPlane': '\uf1d8',
	'paperclip': '\uf0c6',
	'parachuteBox': '\uf4cd',
	'paragraph': '\uf1dd',
	'parking': '\uf540',
	'passport': '\uf5ab',
	'pastafarianism': '\uf67b',
	'paste': '\uf0ea',
	'patreon': '\uf3d9',
	'pause': '\uf04c',
	'pauseCircle': '\uf28b',
	'paw': '\uf1b0',
	'paypal': '\uf1ed',
	'peace': '\uf67c',
	'pen': '\uf304',
	'penAlt': '\uf305',
	'penFancy': '\uf5ac',
	'penNib': '\uf5ad',
	'penSquare': '\uf14b',
	'pencilAlt': '\uf303',
	'pencilRuler': '\uf5ae',
	'pennyArcade': '\uf704',
	'peopleArrows': '\ue068',
	'peopleCarry': '\uf4ce',
	'pepperHot': '\uf816',
	'perbyte': '\ue083',
	'percent': '\uf295',
	'percentage': '\uf541',
	'periscope': '\uf3da',
	'personBooth': '\uf756',
	'phabricator': '\uf3db',
	'phoenixFramework': '\uf3dc',
	'phoenixSquadron': '\uf511',
	'phone': '\uf095',
	'phoneAlt': '\uf879',
	'phoneSlash': '\uf3dd',
	'phoneSquare': '\uf098',
	'phoneSquareAlt': '\uf87b',
	'phoneVolume': '\uf2a0',
	'photoVideo': '\uf87c',
	'php': '\uf457',
	'piedPiper': '\uf2ae',
	'piedPiperAlt': '\uf1a8',
	'piedPiperHat': '\uf4e5',
	'piedPiperPp': '\uf1a7',
	'piedPiperSquare': '\ue01e',
	'piggyBank': '\uf4d3',
	'pills': '\uf484',
	'pinterest': '\uf0d2',
	'pinterestP': '\uf231',
	'pinterestSquare': '\uf0d3',
	'pizzaSlice': '\uf818',
	'placeOfWorship': '\uf67f',
	'plane': '\uf072',
	'planeArrival': '\uf5af',
	'planeDeparture': '\uf5b0',
	'planeSlash': '\ue069',
	'play': '\uf04b',
	'playCircle': '\uf144',
	'playstation': '\uf3df',
	'plug': '\uf1e6',
	'plus': '\uf067',
	'plusCircle': '\uf055',
	'plusSquare': '\uf0fe',
	'podcast': '\uf2ce',
	'poll': '\uf681',
	'pollH': '\uf682',
	'poo': '\uf2fe',
	'pooStorm': '\uf75a',
	'poop': '\uf619',
	'portrait': '\uf3e0',
	'poundSign': '\uf154',
	'powerOff': '\uf011',
	'pray': '\uf683',
	'prayingHands': '\uf684',
	'prescription': '\uf5b1',
	'prescriptionBottle': '\uf485',
	'prescriptionBottleAlt': '\uf486',
	'print': '\uf02f',
	'procedures': '\uf487',
	'productHunt': '\uf288',
	'projectDiagram': '\uf542',
	'pumpMedical': '\ue06a',
	'pumpSoap': '\ue06b',
	'pushed': '\uf3e1',
	'puzzlePiece': '\uf12e',
	'python': '\uf3e2',
	'qq': '\uf1d6',
	'qrcode': '\uf029',
	'question': '\uf128',
	'questionCircle': '\uf059',
	'quidditch': '\uf458',
	'quinscape': '\uf459',
	'quora': '\uf2c4',
	'quoteLeft': '\uf10d',
	'quoteRight': '\uf10e',
	'quran': '\uf687',
	'rProject': '\uf4f7',
	'radiation': '\uf7b9',
	'radiationAlt': '\uf7ba',
	'rainbow': '\uf75b',
	'random': '\uf074',
	'raspberryPi': '\uf7bb',
	'ravelry': '\uf2d9',
	'react': '\uf41b',
	'reacteurope': '\uf75d',
	'readme': '\uf4d5',
	'rebel': '\uf1d0',
	'receipt': '\uf543',
	'recordVinyl': '\uf8d9',
	'recycle': '\uf1b8',
	'redRiver': '\uf3e3',
	'reddit': '\uf1a1',
	'redditAlien': '\uf281',
	'redditSquare': '\uf1a2',
	'redhat': '\uf7bc',
	'redo': '\uf01e',
	'redoAlt': '\uf2f9',
	'registered': '\uf25d',
	'removeFormat': '\uf87d',
	'renren': '\uf18b',
	'reply': '\uf3e5',
	'replyAll': '\uf122',
	'replyd': '\uf3e6',
	'republican': '\uf75e',
	'researchgate': '\uf4f8',
	'resolving': '\uf3e7',
	'restroom': '\uf7bd',
	'retweet': '\uf079',
	'rev': '\uf5b2',
	'ribbon': '\uf4d6',
	'ring': '\uf70b',
	'road': '\uf018',
	'robot': '\uf544',
	'rocket': '\uf135',
	'rocketchat': '\uf3e8',
	'rockrms': '\uf3e9',
	'route': '\uf4d7',
	'rss': '\uf09e',
	'rssSquare': '\uf143',
	'rubleSign': '\uf158',
	'ruler': '\uf545',
	'rulerCombined': '\uf546',
	'rulerHorizontal': '\uf547',
	'rulerVertical': '\uf548',
	'running': '\uf70c',
	'rupeeSign': '\uf156',
	'rust': '\ue07a',
	'sadCry': '\uf5b3',
	'sadTear': '\uf5b4',
	'safari': '\uf267',
	'salesforce': '\uf83b',
	'sass': '\uf41e',
	'satellite': '\uf7bf',
	'satelliteDish': '\uf7c0',
	'save': '\uf0c7',
	'schlix': '\uf3ea',
	'school': '\uf549',
	'screwdriver': '\uf54a',
	'scribd': '\uf28a',
	'scroll': '\uf70e',
	'sdCard': '\uf7c2',
	'search': '\uf002',
	'searchDollar': '\uf688',
	'searchLocation': '\uf689',
	'searchMinus': '\uf010',
	'searchPlus': '\uf00e',
	'searchengin': '\uf3eb',
	'seedling': '\uf4d8',
	'sellcast': '\uf2da',
	'sellsy': '\uf213',
	'server': '\uf233',
	'servicestack': '\uf3ec',
	'shapes': '\uf61f',
	'share': '\uf064',
	'shareAlt': '\uf1e0',
	'shareAltSquare': '\uf1e1',
	'shareSquare': '\uf14d',
	'shekelSign': '\uf20b',
	'shieldAlt': '\uf3ed',
	'shieldVirus': '\ue06c',
	'ship': '\uf21a',
	'shippingFast': '\uf48b',
	'shirtsinbulk': '\uf214',
	'shoePrints': '\uf54b',
	'shopify': '\ue057',
	'shoppingBag': '\uf290',
	'shoppingBasket': '\uf291',
	'shoppingCart': '\uf07a',
	'shopware': '\uf5b5',
	'shower': '\uf2cc',
	'shuttleVan': '\uf5b6',
	'sign': '\uf4d9',
	'signInAlt': '\uf2f6',
	'signLanguage': '\uf2a7',
	'signOutAlt': '\uf2f5',
	'signal': '\uf012',
	'signature': '\uf5b7',
	'simCard': '\uf7c4',
	'simplybuilt': '\uf215',
	'sink': '\ue06d',
	'sistrix': '\uf3ee',
	'sitemap': '\uf0e8',
	'sith': '\uf512',
	'skating': '\uf7c5',
	'sketch': '\uf7c6',
	'skiing': '\uf7c9',
	'skiingNordic': '\uf7ca',
	'skull': '\uf54c',
	'skullCrossbones': '\uf714',
	'skyatlas': '\uf216',
	'skype': '\uf17e',
	'slack': '\uf198',
	'slackHash': '\uf3ef',
	'slash': '\uf715',
	'sleigh': '\uf7cc',
	'slidersH': '\uf1de',
	'slideshare': '\uf1e7',
	'smile': '\uf118',
	'smileBeam': '\uf5b8',
	'smileWink': '\uf4da',
	'smog': '\uf75f',
	'smoking': '\uf48d',
	'smokingBan': '\uf54d',
	'sms': '\uf7cd',
	'snapchat': '\uf2ab',
	'snapchatGhost': '\uf2ac',
	'snapchatSquare': '\uf2ad',
	'snowboarding': '\uf7ce',
	'snowflake': '\uf2dc',
	'snowman': '\uf7d0',
	'snowplow': '\uf7d2',
	'soap': '\ue06e',
	'socks': '\uf696',
	'solarPanel': '\uf5ba',
	'sort': '\uf0dc',
	'sortAlphaDown': '\uf15d',
	'sortAlphaDownAlt': '\uf881',
	'sortAlphaUp': '\uf15e',
	'sortAlphaUpAlt': '\uf882',
	'sortAmountDown': '\uf160',
	'sortAmountDownAlt': '\uf884',
	'sortAmountUp': '\uf161',
	'sortAmountUpAlt': '\uf885',
	'sortDown': '\uf0dd',
	'sortNumericDown': '\uf162',
	'sortNumericDownAlt': '\uf886',
	'sortNumericUp': '\uf163',
	'sortNumericUpAlt': '\uf887',
	'sortUp': '\uf0de',
	'soundcloud': '\uf1be',
	'sourcetree': '\uf7d3',
	'spa': '\uf5bb',
	'spaceShuttle': '\uf197',
	'speakap': '\uf3f3',
	'speakerDeck': '\uf83c',
	'spellCheck': '\uf891',
	'spider': '\uf717',
	'spinner': '\uf110',
	'splotch': '\uf5bc',
	'spotify': '\uf1bc',
	'sprayCan': '\uf5bd',
	'square': '\uf0c8',
	'squareFull': '\uf45c',
	'squareRootAlt': '\uf698',
	'squarespace': '\uf5be',
	'stackExchange': '\uf18d',
	'stackOverflow': '\uf16c',
	'stackpath': '\uf842',
	'stamp': '\uf5bf',
	'star': '\uf005',
	'starAndCrescent': '\uf699',
	'starHalf': '\uf089',
	'starHalfAlt': '\uf5c0',
	'starOfDavid': '\uf69a',
	'starOfLife': '\uf621',
	'staylinked': '\uf3f5',
	'steam': '\uf1b6',
	'steamSquare': '\uf1b7',
	'steamSymbol': '\uf3f6',
	'stepBackward': '\uf048',
	'stepForward': '\uf051',
	'stethoscope': '\uf0f1',
	'stickerMule': '\uf3f7',
	'stickyNote': '\uf249',
	'stop': '\uf04d',
	'stopCircle': '\uf28d',
	'stopwatch': '\uf2f2',
	'stopwatch20': '\ue06f',
	'store': '\uf54e',
	'storeAlt': '\uf54f',
	'storeAltSlash': '\ue070',
	'storeSlash': '\ue071',
	'strava': '\uf428',
	'stream': '\uf550',
	'streetView': '\uf21d',
	'strikethrough': '\uf0cc',
	'stripe': '\uf429',
	'stripeS': '\uf42a',
	'stroopwafel': '\uf551',
	'studiovinari': '\uf3f8',
	'stumbleupon': '\uf1a4',
	'stumbleuponCircle': '\uf1a3',
	'subscript': '\uf12c',
	'subway': '\uf239',
	'suitcase': '\uf0f2',
	'suitcaseRolling': '\uf5c1',
	'sun': '\uf185',
	'superpowers': '\uf2dd',
	'superscript': '\uf12b',
	'supple': '\uf3f9',
	'surprise': '\uf5c2',
	'suse': '\uf7d6',
	'swatchbook': '\uf5c3',
	'swift': '\uf8e1',
	'swimmer': '\uf5c4',
	'swimmingPool': '\uf5c5',
	'symfony': '\uf83d',
	'synagogue': '\uf69b',
	'sync': '\uf021',
	'syncAlt': '\uf2f1',
	'syringe': '\uf48e',
	'table': '\uf0ce',
	'tableTennis': '\uf45d',
	'tablet': '\uf10a',
	'tabletAlt': '\uf3fa',
	'tablets': '\uf490',
	'tachometerAlt': '\uf3fd',
	'tag': '\uf02b',
	'tags': '\uf02c',
	'tape': '\uf4db',
	'tasks': '\uf0ae',
	'taxi': '\uf1ba',
	'teamspeak': '\uf4f9',
	'teeth': '\uf62e',
	'teethOpen': '\uf62f',
	'telegram': '\uf2c6',
	'telegramPlane': '\uf3fe',
	'temperatureHigh': '\uf769',
	'temperatureLow': '\uf76b',
	'tencentWeibo': '\uf1d5',
	'tenge': '\uf7d7',
	'terminal': '\uf120',
	'textHeight': '\uf034',
	'textWidth': '\uf035',
	'th': '\uf00a',
	'thLarge': '\uf009',
	'thList': '\uf00b',
	'theRedYeti': '\uf69d',
	'theaterMasks': '\uf630',
	'themeco': '\uf5c6',
	'themeisle': '\uf2b2',
	'thermometer': '\uf491',
	'thermometerEmpty': '\uf2cb',
	'thermometerFull': '\uf2c7',
	'thermometerHalf': '\uf2c9',
	'thermometerQuarter': '\uf2ca',
	'thermometerThreeQuarters': '\uf2c8',
	'thinkPeaks': '\uf731',
	'thumbsDown': '\uf165',
	'thumbsUp': '\uf164',
	'thumbtack': '\uf08d',
	'ticketAlt': '\uf3ff',
	'tiktok': '\ue07b',
	'times': '\uf00d',
	'timesCircle': '\uf057',
	'tint': '\uf043',
	'tintSlash': '\uf5c7',
	'tired': '\uf5c8',
	'toggleOff': '\uf204',
	'toggleOn': '\uf205',
	'toilet': '\uf7d8',
	'toiletPaper': '\uf71e',
	'toiletPaperSlash': '\ue072',
	'toolbox': '\uf552',
	'tools': '\uf7d9',
	'tooth': '\uf5c9',
	'torah': '\uf6a0',
	'toriiGate': '\uf6a1',
	'tractor': '\uf722',
	'tradeFederation': '\uf513',
	'trademark': '\uf25c',
	'trafficLight': '\uf637',
	'trailer': '\ue041',
	'train': '\uf238',
	'tram': '\uf7da',
	'transgender': '\uf224',
	'transgenderAlt': '\uf225',
	'trash': '\uf1f8',
	'trashAlt': '\uf2ed',
	'trashRestore': '\uf829',
	'trashRestoreAlt': '\uf82a',
	'tree': '\uf1bb',
	'trello': '\uf181',
	'tripadvisor': '\uf262',
	'trophy': '\uf091',
	'truck': '\uf0d1',
	'truckLoading': '\uf4de',
	'truckMonster': '\uf63b',
	'truckMoving': '\uf4df',
	'truckPickup': '\uf63c',
	'tshirt': '\uf553',
	'tty': '\uf1e4',
	'tumblr': '\uf173',
	'tumblrSquare': '\uf174',
	'tv': '\uf26c',
	'twitch': '\uf1e8',
	'twitter': '\uf099',
	'twitterSquare': '\uf081',
	'typo3': '\uf42b',
	'uber': '\uf402',
	'ubuntu': '\uf7df',
	'uikit': '\uf403',
	'umbraco': '\uf8e8',
	'umbrella': '\uf0e9',
	'umbrellaBeach': '\uf5ca',
	'uncharted': '\ue084',
	'underline': '\uf0cd',
	'undo': '\uf0e2',
	'undoAlt': '\uf2ea',
	'uniregistry': '\uf404',
	'unity': '\ue049',
	'universalAccess': '\uf29a',
	'university': '\uf19c',
	'unlink': '\uf127',
	'unlock': '\uf09c',
	'unlockAlt': '\uf13e',
	'unsplash': '\ue07c',
	'untappd': '\uf405',
	'upload': '\uf093',
	'ups': '\uf7e0',
	'usb': '\uf287',
	'user': '\uf007',
	'userAlt': '\uf406',
	'userAltSlash': '\uf4fa',
	'userAstronaut': '\uf4fb',
	'userCheck': '\uf4fc',
	'userCircle': '\uf2bd',
	'userClock': '\uf4fd',
	'userCog': '\uf4fe',
	'userEdit': '\uf4ff',
	'userFriends': '\uf500',
	'userGraduate': '\uf501',
	'userInjured': '\uf728',
	'userLock': '\uf502',
	'userMd': '\uf0f0',
	'userMinus': '\uf503',
	'userNinja': '\uf504',
	'userNurse': '\uf82f',
	'userPlus': '\uf234',
	'userSecret': '\uf21b',
	'userShield': '\uf505',
	'userSlash': '\uf506',
	'userTag': '\uf507',
	'userTie': '\uf508',
	'userTimes': '\uf235',
	'users': '\uf0c0',
	'usersCog': '\uf509',
	'usersSlash': '\ue073',
	'usps': '\uf7e1',
	'ussunnah': '\uf407',
	'utensilSpoon': '\uf2e5',
	'utensils': '\uf2e7',
	'vaadin': '\uf408',
	'vectorSquare': '\uf5cb',
	'venus': '\uf221',
	'venusDouble': '\uf226',
	'venusMars': '\uf228',
	'vest': '\ue085',
	'vestPatches': '\ue086',
	'viacoin': '\uf237',
	'viadeo': '\uf2a9',
	'viadeoSquare': '\uf2aa',
	'vial': '\uf492',
	'vials': '\uf493',
	'viber': '\uf409',
	'video': '\uf03d',
	'videoSlash': '\uf4e2',
	'vihara': '\uf6a7',
	'vimeo': '\uf40a',
	'vimeoSquare': '\uf194',
	'vimeoV': '\uf27d',
	'vine': '\uf1ca',
	'virus': '\ue074',
	'virusSlash': '\ue075',
	'viruses': '\ue076',
	'vk': '\uf189',
	'vnv': '\uf40b',
	'voicemail': '\uf897',
	'volleyballBall': '\uf45f',
	'volumeDown': '\uf027',
	'volumeMute': '\uf6a9',
	'volumeOff': '\uf026',
	'volumeUp': '\uf028',
	'voteYea': '\uf772',
	'vrCardboard': '\uf729',
	'vuejs': '\uf41f',
	'walking': '\uf554',
	'wallet': '\uf555',
	'warehouse': '\uf494',
	'watchmanMonitoring': '\ue087',
	'water': '\uf773',
	'waveSquare': '\uf83e',
	'waze': '\uf83f',
	'weebly': '\uf5cc',
	'weibo': '\uf18a',
	'weight': '\uf496',
	'weightHanging': '\uf5cd',
	'weixin': '\uf1d7',
	'whatsapp': '\uf232',
	'whatsappSquare': '\uf40c',
	'wheelchair': '\uf193',
	'whmcs': '\uf40d',
	'wifi': '\uf1eb',
	'wikipediaW': '\uf266',
	'wind': '\uf72e',
	'windowClose': '\uf410',
	'windowMaximize': '\uf2d0',
	'windowMinimize': '\uf2d1',
	'windowRestore': '\uf2d2',
	'windows': '\uf17a',
	'wineBottle': '\uf72f',
	'wineGlass': '\uf4e3',
	'wineGlassAlt': '\uf5ce',
	'wix': '\uf5cf',
	'wizardsOfTheCoast': '\uf730',
	'wodu': '\ue088',
	'wolfPackBattalion': '\uf514',
	'wonSign': '\uf159',
	'wordpress': '\uf19a',
	'wordpressSimple': '\uf411',
	'wpbeginner': '\uf297',
	'wpexplorer': '\uf2de',
	'wpforms': '\uf298',
	'wpressr': '\uf3e4',
	'wrench': '\uf0ad',
	'xRay': '\uf497',
	'xbox': '\uf412',
	'xing': '\uf168',
	'xingSquare': '\uf169',
	'yCombinator': '\uf23b',
	'yahoo': '\uf19e',
	'yammer': '\uf840',
	'yandex': '\uf413',
	'yandexInternational': '\uf414',
	'yarn': '\uf7e3',
	'yelp': '\uf1e9',
	'yenSign': '\uf157',
	'yinYang': '\uf6ad',
	'yoast': '\uf2b1',
	'youtube': '\uf167',
	'youtubeSquare': '\uf431',
	'zhihu': '\uf63f',
};
exports.icons = icons;
