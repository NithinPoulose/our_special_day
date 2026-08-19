export type Lang = 'en' | 'ml';

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Translations {
  landing: {
    eyebrow: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    weds: string;
    subheading: string;
    scroll: string;
  };
  countdown: {
    title: string;
    units: { days: string; hours: string; minutes: string; seconds: string };
    todayEyebrow: string;
    congrats: string;
  };
  story: {
    eyebrow: string;
    title: string;
    thenAndNow: string;
    cardMeta: string;
    milestones: Milestone[];
  };
  events: {
    groomFamily: string;
    brideFamily: string;
    eyebrow: string;
    title: string;
    cardType: string;
    viewMaps: string;
    downloadInvitation: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: FaqItem[];
  };
  footer: {
    tagline: string;
    craftedBy: string;
  };
  cal: {
    button: string;
    menuLabel: string;
    googleHint: string;
    appleHint: string;
    outlookHint: string;
    yahooHint: string;
    icsName: string;
    icsHint: string;
  };
  a11y: {
    openInvitation: string;
    landingSection: string;
    heroSection: string;
    countdownSection: string;
    storySection: string;
    childhoodMemories: string;
    groomChildhoodMemory: string;
    brideChildhoodMemory: string;
    groomChildhoodPhoto: string;
    brideChildhoodPhoto: string;
    scrollToDetails: string;
    eventsSection: string;
    addToCalendar: string;
    downloadInvitationPdf: string;
    openVenueInMaps: string;
    venueLocationTitle: string;
    audioPlay: string;
    audioPause: string;
    languageSwitcher: string;
    switchToEnglish: string;
    switchToMalayalam: string;
    faqSection: string;
  };
  weddingDateDisplay: string;
  eventTime: string;
  groomName: string;
  brideName: string;
  groomParents: string;
  groomSibling: string;
  groomFamily: string;
  brideParents: string;
  brideSibling: string;
  brideFamily: string;
  venue: string;
  venueAddress: string;
}

const en: Translations = {
  landing: {
    eyebrow: 'Wedding Invitation',
    cta: 'Click to Open',
  },
  hero: {
    eyebrow: 'Wedding Reception',
    weds: 'Weds',
    subheading: 'Together with our families, we warmly invite you to celebrate our wedding reception.',
    scroll: 'Scroll',
  },
  countdown: {
    title: 'The Celebration Begins In',
    units: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
    todayEyebrow: 'Today Is The Day',
    congrats: 'Congratulations,',
  },
  story: {
    eyebrow: 'How It All Began',
    title: 'Our Story',
    thenAndNow: 'Then & Now',
    cardMeta: 'Class 5A • St. Joseph\'s High School, Kizhakkambalam',
    milestones: [
      {
        year: '2008',
        title: 'Classmates',
        description: 'Class 5A at St. Joseph\'s High School, Kizhakkambalam — two kids sharing the same classroom, completely unaware of what the future held.',
      },
      {
        year: '2013',
        title: 'Farewell',
        description: 'With SSLC behind us, our school days came to an end. We went our separate ways for higher education, and in time our paths took shape: she towards law, and I towards engineering.',
      },
      {
        year: '2017',
        title: 'A Chance Reunion',
        description: 'A random meeting on the road after years apart. Numbers exchanged, casual conversations — just old classmates catching up.',
      },
      {
        year: '2020',
          title: 'Love Blossoms',
        description: 'Somewhere amid the meetings, chats, and endless calls, friendship quietly turned into something neither of us could ignore.',
      },
      {
        year: '2021',
        title: 'First Date',
        description:
          'Finally, we met on our own, face to face — the day we both knew this had become more than just friendship.',
      },
      {
        year: '2023',
        title: 'Introducing Her to His Family',
        description:
          'Our love had grown into something we were ready to share with the people closest to us. In 2023, he introduced her to his family — the first step towards bringing our two worlds a little closer together. It was not an easy step; he had to patiently bridge the gaps, earn trust, and overcome the resistance along the way. But with time, understanding, and love, those walls slowly began to fade.',
      },
      {
        year: '2025',
        title: 'The One Who Stayed',
        description:
          'When life became difficult, she became his greatest strength. Through the hardest days, she stood beside him with a love that asked for nothing in return — caring, comforting, and giving him the courage to keep going. She came to the hospital to see him and his mother, and that was the first time they met in person. What his mother saw that day was more than love; she saw someone who truly cared for her son. From then on, she could hardly imagine his life without her.',
      },
      {
        year: '2026',
        title: 'Introducing Him to Her Family',
        description:
          'Years later, the moment came to introduce him to her family too. Another little step, another family becoming part of the story we were building together.',
      },
      {
        year: '2026',
        title: 'Families Came Together',
        description:
          'What began with two classmates had grown into two lives and two families coming together. With everyone by our side, our journey towards marriage became more real than ever.',
      },
      {
        year: '2026',
        title: 'Getting Ready for Forever',
        description:
          'With the families united and the big day drawing closer, the wedding preparations began. From plans and little details to countless conversations, every moment brought us one step closer to becoming husband and wife.',
      },
      {
        year: '2026',
        title: 'Official Registration',
        description: 'August 24th — before the celebration, the moment we will become officially, legally, forever each other\'s.',
      },
      {
        year: '2026',
        title: 'Wedding Celebration',
        description: 'From classmates to soulmates — on August 27th, surrounded by family and love, we are going to celebrate it with the world.',
      },
    ],
  },
  events: {
    groomFamily: 'Groom\'s Family',
    brideFamily: 'Bride\'s Family',
    eyebrow: 'Join Us',
    title: 'The Celebration',
    cardType: 'Wedding Reception',
    viewMaps: 'View on Maps ↗',
    downloadInvitation: 'Download Invitation',
  },
  faq: {
    eyebrow: 'Good to Know',
    title: 'Questions & Answers',
    items: [
      {
        question: 'When should guests arrive?',
        answer: 'The reception begins at 6:00 PM. We warmly recommend arriving by 5:45 PM so you can be seated and settled before the celebrations begin.',
      },
      {
        question: 'Where exactly is the venue?',
        answer: 'St. Pius Xth Auditorium, Choondy, Aluva, Ernakulam. You can find us easily on Google Maps — a link is available in the Join Us section above.',
      },
      {
        question: 'Is parking available?',
        answer: 'Yes, ample parking space is available at and near the auditorium. We suggest arriving a few minutes early if you are driving.',
      },
    ],
  },
  footer: {
    tagline: 'Made with love, for our special day',
    craftedBy: 'Website crafted by',
  },
  cal: {
    button: 'Add to Calendar',
    menuLabel: 'Choose calendar app',
    googleHint: 'Android',
    appleHint: 'iOS & macOS',
    outlookHint: 'Windows & Web',
    yahooHint: 'Web',
    icsName: 'Download .ics',
    icsHint: 'All calendar apps',
  },
  a11y: {
    openInvitation: 'Open wedding invitation',
    landingSection: 'Wedding invitation cover',
    heroSection: 'Wedding invitation',
    countdownSection: 'Time remaining until the wedding',
    storySection: 'Our love story',
    childhoodMemories: 'Childhood memories',
    groomChildhoodMemory: 'Nithin childhood memory',
    brideChildhoodMemory: 'Neeraja childhood memory',
    groomChildhoodPhoto: 'Nithin childhood photo',
    brideChildhoodPhoto: 'Neeraja childhood photo',
    scrollToDetails: 'Scroll to see event details',
    eventsSection: 'Wedding event details',
    addToCalendar: 'Add wedding to your calendar',
    downloadInvitationPdf: 'Download wedding invitation as PDF',
    openVenueInMaps: 'Open venue location in Google Maps',
    venueLocationTitle: 'Wedding venue location',
    audioPlay: 'Play background music',
    audioPause: 'Pause background music',
    languageSwitcher: 'Choose language',
    switchToEnglish: 'Switch to English',
    switchToMalayalam: 'Switch to Malayalam',
    faqSection: 'Frequently asked questions',
  },
  weddingDateDisplay: 'Thursday, 27 August 2026',
  eventTime: '6:00 PM to 9:30 PM',
  groomName: 'Nithin',
  brideName: 'Neeraja',
  groomParents: 'Mr. K A Poulose & Mrs. Julie Poulose',
  groomSibling: 'Sister - Dhanya',
  groomFamily: 'Koorely House, Banglavumparamb Road, Nazreth Road, Aluva, Ernakulam',
  brideParents: 'Mr. Venugopalan Nair & Mrs. A N Ushakumari',
  brideSibling: 'Sister - Neethu',
  brideFamily: 'Usha Bhavan (Ambalakkadu), Maliyekkapadi, Pukkattupadi, Ernakulam',
  venue: 'St. Pius Xth Auditorium',
  venueAddress: 'Choondy, Aluva, Ernakulam',
};

const ml: Translations = {
  landing: {
    eyebrow: 'വിവാഹ ക്ഷണക്കത്ത്',
    cta: 'തുറക്കുക',
  },
  hero: {
    eyebrow: 'വിവാഹ സ്വീകരണം',
    weds: '&',
    subheading: 'ഞങ്ങളുടെ വിവാഹ സ്വീകരണത്തിൽ സ്നേഹത്തോടെ എത്തി ഞങ്ങളെ അനുഗ്രഹിക്കണമെന്ന് ഹൃദയം നിറഞ്ഞ് അഭ്യർത്ഥിക്കുന്നു.',
    scroll: 'താഴേക്ക്',
  },
  countdown: {
    title: 'ആഘോഷ നിമിഷങ്ങൾക്ക് ഇനി',
    units: { days: 'ദിവസം', hours: 'മണിക്കൂർ', minutes: 'മിനിറ്റ്', seconds: 'സെക്കൻഡ്' },
    todayEyebrow: 'ഇന്നാണ് ആ ദിവസം',
    congrats: 'ഹൃദയം നിറഞ്ഞ ആശംസകൾ,',
  },
  story: {
    eyebrow: 'എല്ലാം തുടങ്ങിയത് ഇങ്ങനെ',
    title: 'ഞങ്ങളുടെ കഥ',
    thenAndNow: 'അന്നും - ഇന്നും',
    cardMeta: '5A ക്ലാസ് • സെന്റ് ജോസഫ്സ് ഹൈസ്കൂൾ, കിഴക്കമ്പലം',
    milestones: [
      {
        year: '2008',
        title: 'സഹപാഠികൾ',
        description: 'കിഴക്കമ്പലത്തെ സെന്റ് ജോസഫ്സ് ഹൈസ്കൂളിലെ 5A ക്ലാസിൽ ഒരേ ക്ലാസ്‌റൂം പങ്കിട്ടിരുന്ന രണ്ട് കുട്ടികൾ. മുന്നിൽ എന്ത് കഥ കാത്തിരിക്കുകയാണെന്ന് അന്ന് ആരും അറിഞ്ഞിരുന്നില്ല.',
      },
      {
        year: '2013',
        title: 'വഴിത്തിരിവ്',
        description: 'SSLC കഴിഞ്ഞതോടെ സ്കൂൾ ജീവിതം അവസാനിച്ചു. ഉയർന്ന പഠനത്തിനായി ഞങ്ങൾ വേറേവഴികളിലേക്ക് നീങ്ങി; പിന്നീടവൾ നിയമത്തിന്റെ വഴിയിലേക്കും ഞാൻ എഞ്ചിനീയറിംഗിന്റെ വഴിയിലേക്കും തിരിഞ്ഞു.',
      },
      {
        year: '2017',
        title: 'വീണ്ടും കണ്ടുമുട്ടൽ',
        description: 'വർഷങ്ങൾക്കു ശേഷം വഴിയിൽ ഉണ്ടായ ഒരു അപ്രതീക്ഷിത കൂടിക്കാഴ്ച. നമ്പറുകൾ കൈമാറി, കുറച്ച് മെസേജുകളും ഫോൺകോളുകളും തുടങ്ങി; പഴയ സൗഹൃദം വീണ്ടും സംസാരിക്കാൻ തുടങ്ങി.',
      },
      {
        year: '2020',
        title: 'സ്നേഹം വിരിഞ്ഞപ്പോൾ',
        description: 'കണ്ടുമുട്ടലുകളും ചാറ്റുകളും ഒടുക്കമില്ലാത്ത ഫോൺകോളുകളും ഇടയിൽ, അറിയാതെ തന്നെ സൗഹൃദം സ്നേഹമായി മാറി.',
      },
      {
        year: '2021',
        title: 'ആദ്യമായി ഒരുമിച്ച്',
        description: 'മുഖാമുഖം ഇരുന്ന ആ ദിവസം തന്നെ ഇത് വെറും സൗഹൃദമല്ലെന്ന് ഞങ്ങൾ രണ്ടുപേരും മനസ്സിലാക്കി.',
      },
      {
        year: '2026',
        title: 'വിവാഹ റജിസ്ട്രേഷൻ',
        description: 'ഓഗസ്റ്റ് 24-ന് നിയമത്തിന്റെ മുമ്പിലും ഞങ്ങൾ ഒരുമയായി. ആഘോഷത്തിന് മുമ്പേ "നമ്മൾ" എന്ന വാക്കിന് പുതിയ അർത്ഥം ലഭിച്ച ദിവസം.',
      },
      {
        year: '2026',
        title: 'വിവാഹ ദിനം',
        description: 'ഓഗസ്റ്റ് 27-ന് പ്രിയപ്പെട്ടവരുടെ സാന്നിധ്യത്തിൽ, സഹപാഠികളായി തുടങ്ങിയ ഈ കഥ ജീവിത പങ്കാളികളായി മുന്നോട്ട് കൊണ്ടുപോകാൻ ഞങ്ങൾ ഒരുമിക്കുന്നു.',
      },
    ],
  },
  events: {
    groomFamily: 'വരവീട്ടുകാർ',
    brideFamily: 'വധുവീട്ടുകാർ',
    eyebrow: 'സ്നേഹത്തോടെ ക്ഷണിക്കുന്നു',
    title: 'ആഘോഷ വേദി',
    cardType: 'വിവാഹ സ്വീകരണം',
    viewMaps: 'മാപ്പിൽ കാണുക ↗',
    downloadInvitation: 'ക്ഷണക്കത്ത് ഡൗൺലോഡ് ചെയ്യുക',
  },
  faq: {
    eyebrow: 'അറിയാൻ',
    title: 'അറിയേണ്ട ചില കാര്യങ്ങൾ',
    items: [
      {
        question: 'എപ്പോൾ എത്തണം?',
        answer: 'സ്വീകരണം വൈകിട്ട് 6:00-ന് തുടങ്ങും. എല്ലാം സുഖമായി തുടങ്ങാൻ 5:45-നകം എത്തിച്ചേരുമെങ്കിൽ ഏറെ സന്തോഷം.',
      },
      {
        question: 'വേദി കൃത്യമായി എവിടെയാണ്?',
        answer: 'സെന്റ് പയസ് Xth ഓഡിറ്റോറിയം, ചൂണ്ടി, ആലുവ, എറണാകുളം. മുകളിലെ മാപ്പ് ലിങ്ക് തുറക്കുമ്പോൾ നേരെ വേദിയിലേക്ക് എത്താം.',
      },
      {
        question: 'പാർക്കിംഗ് ഉണ്ടോ?',
        answer: 'അതെ, ഓഡിറ്റോറിയത്തിന്റെയും സമീപത്തെയും പാർക്കിംഗ് സൗകര്യം ലഭ്യമാണ്. വാഹനത്തിൽ വരുകയാണെങ്കിൽ കുറച്ച് നേരത്തെ എത്തുന്നത് കൂടുതൽ സൗകര്യമാകും.',
      },
    ],
  },
  footer: {
    // tagline: 'സ്നേഹത്തോടെ ഒരുക്കിയത്, നമ്മുടെ പ്രത്യേക ദിവസത്തിനായി',
    tagline: 'പ്രത്യേക ദിവസത്തിനായി സ്നേഹത്തോടെ ഒരുക്കിയത്',
    craftedBy: 'വെബ്സൈറ്റ് ഒരുക്കിയത്',
  },
  cal: {
    button: 'കലണ്ടറിൽ ചേർക്കുക',
    menuLabel: 'കലണ്ടർ തിരഞ്ഞെടുക്കുക',
    googleHint: 'ആൻഡ്രോയ്ഡ്',
    appleHint: 'iOS & macOS',
    outlookHint: 'Windows & Web',
    yahooHint: 'വെബ്',
    icsName: 'ഐ.സി.എസ്. ഡൗൺലോഡ്',
    icsHint: 'എല്ലാ കലണ്ടർ ആപ്പുകൾക്കും',
  },
  a11y: {
    openInvitation: 'വിവാഹ ക്ഷണം തുറക്കുക',
    landingSection: 'വിവാഹ ക്ഷണക്കത്തിന്റെ മുഖപ്പുറം',
    heroSection: 'വിവാഹ ക്ഷണം',
    countdownSection: 'വിവാഹത്തിന് ശേഷിക്കുന്ന സമയം',
    storySection: 'ഞങ്ങളുടെ കഥ',
    childhoodMemories: 'കുട്ടിക്കാല ഓർമ്മകൾ',
    groomChildhoodMemory: 'നിതിന്റെ കുട്ടിക്കാല ഓർമ്മ',
    brideChildhoodMemory: 'നീരജയുടെ കുട്ടിക്കാല ഓർമ്മ',
    groomChildhoodPhoto: 'നിതിന്റെ കുട്ടിക്കാല ചിത്രം',
    brideChildhoodPhoto: 'നീരജയുടെ കുട്ടിക്കാല ചിത്രം',
    scrollToDetails: 'ചടങ്ങിന്റെ വിവരങ്ങൾ കാണാൻ താഴേക്ക് സ്ക്രോൾ ചെയ്യുക',
    eventsSection: 'വിവാഹ ചടങ്ങിന്റെ വിവരങ്ങൾ',
    addToCalendar: 'വിവാഹം കലണ്ടറിൽ ചേർക്കുക',
    downloadInvitationPdf: 'വിവാഹ ക്ഷണക്കത്ത് പി.ഡി.എഫ് ആയി ഡൗൺലോഡ് ചെയ്യുക',
    openVenueInMaps: 'വേദിയുടെ സ്ഥലം ഗൂഗിൾ മാപ്പിൽ തുറക്കുക',
    venueLocationTitle: 'വിവാഹ വേദിയുടെ സ്ഥലം',
    audioPlay: 'പശ്ചാത്തല സംഗീതം പ്ലേ ചെയ്യുക',
    audioPause: 'പശ്ചാത്തല സംഗീതം നിർത്തുക',
    languageSwitcher: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    switchToEnglish: 'ഇംഗ്ലീഷിലേക്ക് മാറുക',
    switchToMalayalam: 'മലയാളത്തിലേക്ക് മാറുക',
    faqSection: 'പതിവുചോദ്യങ്ങൾ',
  },
  weddingDateDisplay: '2026 ഓഗസ്റ്റ് 27, വ്യാഴാഴ്ച',
  eventTime: 'വൈകിട്ട് 6:00 മുതൽ രാത്രി 9:30 വരെ',
  groomName: 'നിതിൻ',
  brideName: 'നീരജ',
  groomParents: 'ശ്രീ. കെ. എ. പൗലോസ് & ശ്രീമതി ജൂലി പൗലോസ്',
  groomSibling: 'സഹോദരി - ധന്യ',
  groomFamily: 'കൂരേലി ഹൗസ്, ബംഗ്ലാവുപറമ്പ് റോഡ്, നസ്രത്ത് റോഡ്, ആലുവ, എറണാകുളം',
  brideParents: 'ശ്രീ. വേണുഗോപാലൻ നായർ & ശ്രീമതി എ. എൻ. ഉഷാകുമാരി',
  brideSibling: 'സഹോദരി - നീതു',
  brideFamily: 'ഉഷാഭവൻ (അമ്പലക്കാട്), മാളിയേക്കപ്പടി, പുക്കാട്ടുപടി, എറണാകുളം',
  venue: 'സെന്റ് പയസ് Xth ഓഡിറ്റോറിയം',
  venueAddress: 'ചൂണ്ടി, ആലുവ, എറണാകുളം',
};

export const translations: Record<Lang, Translations> = { en, ml };
