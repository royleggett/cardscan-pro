export const MANUAL_UPDATED = "25 November 2026";

export const recentUpdates = [
  { date: "25 Nov 2026", label: "Contacts search now covers phone numbers, plus new filters for exhibition, country and date added." },
  { date: "Nov 2026", label: "Light and dark theme switch added to the header." },
  { date: "Nov 2026", label: "Places can be saved while offline and sync when you reconnect." },
  { date: "Nov 2026", label: "Invite friends from the More menu." },
];

export const manualSections = [
  {
    id: "getting-started",
    icon: "🚀",
    title: "Getting started",
    intro: "Everything you need for your first five minutes with CardScan-Pro.",
    topics: [
      {
        id: "sign-in",
        title: "Signing in for the first time",
        steps: [
          "Open the CardScan-Pro link in your browser.",
          "Sign in with your email address and password, or with Google if you signed up that way.",
          "If you are new, create an account and then confirm your email address by clicking the link we send you.",
          "Once you are signed in you land on the Home screen.",
        ],
        tip: "If the confirmation email does not arrive, check your spam or junk folder before trying again.",
      },
      {
        id: "navigation",
        title: "Finding your way around",
        steps: [
          "The bar at the bottom of the screen has five tabs: Home, Exhibitions, Contacts, Discover and More.",
          "Home has the main shortcuts: My Digital Card, Add a Place, My Exhibitions, Create New Exhibition, View All Contacts, Import / Export, Join Team Exhibition and Settings.",
          "Contacts shows every contact you have ever scanned, across every exhibition.",
          "Discover is the community side of the app, for finding places recommended by other users.",
          "More holds Invite Friends, Rewards, Plans, Help, this User Manual and Terms.",
        ],
      },
      {
        id: "theme",
        title: "Switching between light and dark",
        steps: [
          "Look at the top right of the header for the moon or sun icon.",
          "Tap it to switch between light and dark. The app remembers your choice next time you open it.",
        ],
        tip: "The app uses its own theme, so your phone's system setting will not change how the app looks.",
      },
      {
        id: "install",
        title: "Installing CardScan-Pro on your phone",
        steps: [
          "On iPhone, open the app in Safari, tap the Share button, then Add to Home Screen and Add.",
          "On Android, open the app in Chrome, tap the three dots, then Install app or Add to Home screen.",
          "The banner at the top of the app links to a step-by-step installation guide if you would rather follow pictures.",
        ],
        tip: "Installed on your home screen, CardScan-Pro opens full screen like a normal app and works better with the camera.",
      },
    ],
  },
  {
    id: "exhibitions",
    icon: "🏛️",
    title: "Exhibitions",
    intro: "An exhibition is a folder for one event, so every contact you meet there stays together.",
    topics: [
      {
        id: "create-exhibition",
        title: "Creating an exhibition",
        steps: [
          "From Home, tap Create New Exhibition. You can also open Exhibitions and tap the plus button.",
          "Give it a name, for example the event name. Name, start date and end date are required.",
          "Add the location, hotel and any notes you want to remember.",
          "Tap Save. The new exhibition appears in your list.",
        ],
      },
      {
        id: "edit-exhibition",
        title: "Editing or deleting an exhibition",
        steps: [
          "Open the exhibition from My Exhibitions.",
          "Tap the pencil icon to change the name, dates, location, hotel or notes.",
          "To remove it completely, use Delete Exhibition inside the edit screen and confirm.",
        ],
        tip: "Deleting an exhibition also deletes every contact and place inside it. Export first if you might need them.",
      },
      {
        id: "team-exhibition",
        title: "Sharing an exhibition with your team",
        steps: [
          "When creating an exhibition, switch on Team Exhibition. A join code and join link are created for you.",
          "Share the code or link with your colleagues.",
          "Each colleague opens Join Team Exhibition on their Home screen, or taps your link, and enters the code.",
          "Everyone who joins can add contacts and places to the same exhibition and see each other's entries.",
        ],
        tip: "The team code is shown on the exhibition screen, so you can find it again later without recreating the event.",
      },
    ],
  },
  {
    id: "scanning",
    icon: "📇",
    title: "Scanning business cards",
    intro: "Six ways to capture a card, all reading the details for you so you only need to check and save.",
    topics: [
      {
        id: "scan-single",
        title: "Scan a single side",
        steps: [
          "Open the exhibition and tap Scan Card.",
          "Tap Scan Single Side, then allow camera access if asked.",
          "Line the card up inside the frame and take the photo.",
          "Wait a few seconds while the details are read, then check them on the preview screen.",
        ],
      },
      {
        id: "scan-both",
        title: "Scan both sides of a card",
        steps: [
          "Tap Scan Both Sides.",
          "Photograph the front, then photograph the back when the blue banner asks you to.",
          "The app combines the two sides, filling in anything that was missing from the first photo.",
        ],
      },
      {
        id: "scan-qr",
        title: "Scan a QR code",
        steps: [
          "Tap Scan QR Code and point the camera at the code on the card or badge.",
          "If the code is a contact card, the details fill in straight away.",
          "If the code is a website or LinkedIn profile, the app searches for public details and opens the profile in a new tab so you can copy anything missing.",
        ],
      },
      {
        id: "scan-upload",
        title: "Upload a photo instead",
        steps: [
          "Tap Upload Image and choose a photo you already took from your camera roll.",
          "The app reads it exactly as it would a live photo.",
        ],
        tip: "Uploading is handy when the light at the stand is poor, or when you photographed a pile of cards earlier.",
      },
      {
        id: "manual-entry",
        title: "Type the details yourself",
        steps: [
          "Tap Manual Entry.",
          "Fill in as much or as little as you like, then save.",
        ],
        tip: "Manual Entry is the reliable fallback when a card is glossy, damaged or hand-written and cannot be read.",
      },
      {
        id: "batch-scan",
        title: "Batch scan a pile of cards",
        steps: [
          "Tap Batch Scan, then select several card photos at once.",
          "The app works through them one by one and shows a progress counter.",
          "On the review screen, check each contact, set a lead temperature, choose who gets a thank-you email and remove any cards you do not need.",
          "Tap Save All when you are happy.",
        ],
        tip: "One photo per card gives the best results. Duplicates are flagged on the review screen so you can skip them.",
      },
      {
        id: "save-contact",
        title: "Checking and saving a contact",
        steps: [
          "After a scan, review every field on the preview screen and correct anything the app misread.",
          "Add tags if you use them, and choose Hot, Warm or Cool for the lead temperature.",
          "Tap Save. The contact is added to that exhibition.",
          "If the email address is filled in, you can tick the box to send a thank-you email at the same time.",
        ],
      },
      {
        id: "duplicates",
        title: "What happens if I scan someone twice",
        steps: [
          "The app checks the name and email against your existing contacts.",
          "If it looks like a duplicate, a warning shows who they are and which exhibition you first met them at.",
          "Choose to carry on and save a second copy, or cancel to keep just the original.",
        ],
      },
      {
        id: "scan-limit",
        title: "Card limits by plan",
        steps: [
          "Free and Places plans include 10 scanned cards.",
          "Premium includes unlimited scanning.",
          "When you reach 10, the scan screen shows an upgrade message instead of the scan options.",
        ],
        tip: "Your existing contacts are never hidden when you reach the limit, you simply cannot add more until you upgrade.",
      },
    ],
  },
  {
    id: "contacts",
    icon: "👥",
    title: "Managing contacts",
    intro: "Search, filter, tag and export every contact you have collected.",
    topics: [
      {
        id: "search-contacts",
        title: "Searching your contacts",
        steps: [
          "Open Contacts from the bottom bar.",
          "Type into the search box at the top. It searches names, company names, email addresses, all phone numbers, job titles, countries and exhibition names at the same time.",
          "The list narrows as you type, across every exhibition rather than just one.",
        ],
        tip: "Searching a partial number works, so the last four digits of a mobile is enough to find someone.",
      },
      {
        id: "filter-contacts",
        title: "Filtering your contacts",
        steps: [
          "On the Contacts screen, tap Filters.",
          "Choose an exhibition to see one event only, or a country to see one location.",
          "Set Added from and Added to dates to find contacts collected in a particular period.",
          "The Filters button shows how many filters are active. Tap Clear to remove them all.",
          "Use the Hot, Warm, Cool and Unset chips to filter by lead temperature at the same time.",
        ],
      },
      {
        id: "contact-details",
        title: "Opening and editing a contact",
        steps: [
          "Tap a contact card to expand it and see all saved details, including the photo of the card.",
          "Tap the edit option to correct a name, number or email, add tags or change the lead temperature.",
          "Mark as Contacted adds a green Contacted badge once you have followed up. Tap again to undo.",
        ],
      },
      {
        id: "contact-tags",
        title: "Tags",
        steps: [
          "Tags are short labels such as a sector, a product interest or a language.",
          "Add them when saving a contact, or later from the contact's edit screen.",
          "Tags you use often can be saved as Default Tags in Settings so they are one tap away.",
        ],
      },
      {
        id: "export-contacts",
        title: "Exporting contacts",
        steps: [
          "Open Contacts and tap Export CSV for a file that opens in Excel or Google Sheets.",
          "To export a single event, open the exhibition and use its Export button instead.",
          "The Import / Export screen can also save contacts as a vCard file that your phone's address book can import.",
        ],
        tip: "Exporting is available on Places and Premium plans. Free accounts see an upgrade prompt instead.",
      },
    ],
  },
  {
    id: "follow-ups",
    icon: "🔔",
    title: "Follow-up reminders",
    intro: "So a hot lead never goes cold because you forgot to reply.",
    topics: [
      {
        id: "how-reminders-work",
        title: "How reminders work",
        steps: [
          "When you save a contact as Hot, Warm or Cool, the app schedules a reminder for that lead.",
          "The reminder counts from the day the exhibition ends, not the day you scanned the card.",
          "On the due date you get an email listing the contacts that need following up.",
          "Each lead in the email has a Yes, I've contacted them and a Not yet link, which updates the contact for you.",
        ],
      },
      {
        id: "reminder-timing",
        title: "Changing when reminders arrive",
        steps: [
          "Open Settings from Home.",
          "In Follow-up Reminders, switch Hot or Warm reminders on or off.",
          "Set how many days after the exhibition ends each reminder should arrive.",
          "Tap Save All Settings.",
        ],
        tip: "By default Hot leads are reminded after 1 day and Warm leads after 3 days. Cool reminders are off unless you turn them on.",
      },
      {
        id: "home-alerts",
        title: "The alert on your Home screen",
        steps: [
          "When leads are due, Home shows an amber panel counting them.",
          "The panel names the first few contacts so you know who to chase.",
          "Tap View All Contacts to work through them.",
        ],
      },
    ],
  },
  {
    id: "digital-card",
    icon: "📱",
    title: "My Digital Card",
    intro: "Your own contact details as a scannable card, so you never hand out paper again.",
    topics: [
      {
        id: "digital-card-setup",
        title: "Setting up your digital card",
        steps: [
          "From Home, tap My Digital Card.",
          "Tap Edit Details and fill in your business email, company, position, phone, website and address.",
          "Tap Save. Your card and its QR code appear immediately.",
        ],
        tip: "Your name and login email cannot be changed here. The business email is the one that appears on your QR code.",
      },
      {
        id: "digital-card-share",
        title: "Sharing your card",
        steps: [
          "Show the QR code on screen for someone to scan with their phone camera.",
          "Or tap Share Contact to send your details through your phone's share sheet.",
          "If sharing is not available, the details are copied to the clipboard instead, ready to paste into a message.",
        ],
      },
    ],
  },
  {
    id: "discover",
    icon: "🧭",
    title: "Discover and places",
    intro: "Community recommendations for restaurants, hotels, cafes and more, wherever the event takes you.",
    topics: [
      {
        id: "discover-browse",
        title: "Browsing Discover",
        steps: [
          "Open Discover from the bottom bar.",
          "Type in the search box to look for a name, a category or a feature such as Vegan or Pool.",
          "Use the category filters to narrow the list to restaurants, hotels, bars and so on.",
          "Switch on Near Me to sort places by how close they are to you.",
        ],
        tip: "Near Me needs location permission. If results look far away, turn Near Me off and search by name or city instead.",
      },
      {
        id: "add-place",
        title: "Adding a place",
        steps: [
          "Tap Add a Place on Home, or open an exhibition and use its Places tab.",
          "Give the place a name and pick a category.",
          "Add the address, or tap the location button to fill it in from where you are standing.",
          "Add a website, your notes and a star rating.",
          "Tick any features that apply, such as Vegan options or Early check-in.",
          "Switch on Share with community if you want other users to see it in Discover.",
        ],
      },
      {
        id: "places-visibility",
        title: "Who can see a place",
        steps: [
          "Private places are for you and your team exhibition only.",
          "Public places appear in Discover for every CardScan-Pro user.",
          "Places added inside a team exhibition are visible to the whole team.",
        ],
      },
      {
        id: "place-votes",
        title: "Rating places and booking a taxi",
        steps: [
          "Use the thumbs up or thumbs down buttons on a place to rate it for the community.",
          "Places with poor ratings can be flagged, which keeps Discover useful for everyone.",
          "Tap Book Taxi on a place to see the options for getting there.",
        ],
      },
      {
        id: "offline-places",
        title: "Saving a place with no signal",
        steps: [
          "If you have no connection, your place is saved on your phone and queued.",
          "It is sent automatically the next time the app opens with a connection.",
          "You do not need to re-enter anything.",
        ],
        tip: "If a queued place has not appeared after reconnecting, close and reopen the app to trigger the sync.",
      },
    ],
  },
  {
    id: "import-export",
    icon: "💾",
    title: "Import and export",
    intro: "Move contacts and places in and out of CardScan-Pro with CSV files.",
    topics: [
      {
        id: "import",
        title: "Importing a CSV file",
        steps: [
          "Open Import / Export from Home.",
          "Choose whether you are importing contacts or places.",
          "Pick the exhibition the records belong to.",
          "Choose your CSV file and tap Import.",
          "A confirmation tells you how many records were added.",
        ],
        tip: "Column headings should match the field names used in the app, for example Full Name, Company, Email and Mobile.",
      },
      {
        id: "export",
        title: "Exporting CSV or vCard",
        steps: [
          "On Import / Export, choose contacts or places, then pick the exhibition.",
          "Tap Export as CSV to download a spreadsheet.",
          "For contacts, you can also export a vCard file to import everyone into your phone's address book.",
        ],
      },
    ],
  },
  {
    id: "team",
    icon: "🤝",
    title: "Team and invitations",
    intro: "Bring colleagues into an event, or invite someone to try the app.",
    topics: [
      {
        id: "invite-friends",
        title: "Inviting friends",
        steps: [
          "Open More from the bottom bar and tap Invite Friends.",
          "Enter their email address and send the invitation.",
          "They receive an email with a link to join CardScan-Pro.",
        ],
      },
      {
        id: "roles",
        title: "User and admin roles",
        steps: [
          "Everyone who joins starts as a standard user with their own private contacts.",
          "Admins can manage users and see all data in the app.",
          "If a colleague needs admin access, ask the app owner to change their role.",
        ],
      },
    ],
  },
  {
    id: "plans",
    icon: "🏆",
    title: "Plans, rewards and leaderboard",
    intro: "What each plan includes, and how contributions earn rewards.",
    topics: [
      {
        id: "plan-tiers",
        title: "What each plan includes",
        steps: [
          "Free: 10 scanned cards, contacts, exhibitions, Discover and places.",
          "Places at £20 per year: everything in Free, for people who mainly want place recommendations.",
          "Premium at £59 per year: unlimited scanning, CSV export, team features and advanced lead tracking.",
        ],
      },
      {
        id: "upgrade",
        title: "Upgrading your plan",
        steps: [
          "Open More and tap Plans, or tap any upgrade prompt inside the app.",
          "Choose the plan you want and complete checkout.",
          "Your new limits apply straight away.",
        ],
        tip: "Card limits apply to Free and Places plans. Premium and admins scan without a limit.",
      },
      {
        id: "rewards",
        title: "Rewards and the leaderboard",
        steps: [
          "Open More and tap Rewards to see your entries, your badges and any active reward.",
          "Entries build up as you add contacts and places.",
          "The leaderboard ranks users by contributions, so you can see how you compare.",
        ],
      },
    ],
  },
  {
    id: "settings-privacy",
    icon: "⚙️",
    title: "Settings and privacy",
    intro: "Personalise emails, manage tags, and control your data.",
    topics: [
      {
        id: "settings",
        title: "What you can change in Settings",
        steps: [
          "Follow-up Reminders: which lead types are chased, and after how many days.",
          "Default Tags: tags that appear with one tap on any contact.",
          "Your Name: used as the sender name in thank-you emails.",
          "Thank You Email Template: the subject and body sent to new contacts.",
        ],
        tip: "In the email template you can use {contact_name}, {exhibition_name} and {sender_name}, and they are replaced automatically.",
      },
      {
        id: "privacy",
        title: "Who can see your data",
        steps: [
          "Your contacts and exhibitions are private to you, unless you share an exhibition with your team.",
          "Only you and your team members can see the contacts and places inside a team exhibition.",
          "Public places are the only thing that other users can see in Discover.",
          "Read the full Privacy Policy and Terms from the More menu.",
        ],
      },
      {
        id: "delete-account",
        title: "Deleting your account",
        steps: [
          "Open Settings and scroll to Delete Account.",
          "Tap Delete My Account and type DELETE to confirm.",
          "This permanently removes your contacts, exhibitions and places, and signs you out.",
        ],
        tip: "There is no undo. Export anything you want to keep before confirming.",
      },
    ],
  },
];

export const troubleshootingGroups = [
  {
    id: "trouble-scanning",
    title: "Scanning",
    items: [
      {
        question: "The card was read but the details are wrong or blank.",
        answer: "Open the contact and correct the fields by hand, or rescan with Manual Entry. Glossy, curved or hand-written cards are harder to read, so a straight photo in good light gives the best result.",
      },
      {
        question: "The camera shows a black screen or will not open.",
        answer: "Check that your browser has camera permission for this site, then reload the page. On iPhone, use Safari rather than an in-app browser opened from a link, and try Upload Image instead if the camera still refuses.",
      },
      {
        question: "Scanning stops with a timeout or processing error.",
        answer: "This is usually a slow connection rather than a problem with the card. Wait a moment and try again, or use Manual Entry to save the contact now and add the card photo later.",
      },
      {
        question: "It says I have reached my card limit.",
        answer: "Free and Places plans include 10 scanned cards. Upgrade to Premium for unlimited scanning, or use Import to bring in contacts from a CSV file.",
      },
      {
        question: "I keep getting a duplicate warning.",
        answer: "The app matches on name and email. If it is genuinely a different person with the same name, carry on and save the second copy. If it is the same person, cancel and edit the original contact instead.",
      },
    ],
  },
  {
    id: "trouble-contacts",
    title: "Contacts, search and export",
    items: [
      {
        question: "I cannot find a contact I know I scanned.",
        answer: "Clear the search box and any active filters first, then search a single distinctive word or the last few digits of their number. Remember that filters combine, so an exhibition filter plus a date range can hide people you expect to see.",
      },
      {
        question: "The filters show no results.",
        answer: "Tap Clear next to Filters to reset exhibition, country and date range, then apply them one at a time. A date range set in the future will always return nothing.",
      },
      {
        question: "The Export button is locked.",
        answer: "CSV export is included with Places and Premium plans. Free accounts see an upgrade prompt. You can still view every contact you have scanned.",
      },
      {
        question: "Contacts I imported are missing.",
        answer: "Imported records go into the exhibition you selected during import, not into All Contacts only. Open that exhibition to check them, and confirm the CSV had a Full Name column so the records were accepted.",
      },
    ],
  },
  {
    id: "trouble-email",
    title: "Emails and reminders",
    items: [
      {
        question: "The thank-you email never arrived.",
        answer: "Ask the contact to check spam or promotions. The email only sends when the contact has an email address saved and the thank-you box was ticked, so check the contact record too.",
      },
      {
        question: "I am not receiving follow-up reminders.",
        answer: "Open Settings and check that the reminder for that lead type is switched on. Reminders count from the exhibition end date, so an exhibition that has not finished yet will not trigger any.",
      },
      {
        question: "The sender name on emails is wrong.",
        answer: "Set Your Name in Settings and save. That name fills the {sender_name} placeholder in the thank-you template.",
      },
      {
        question: "The links in a reminder email do not update the contact.",
        answer: "Open the link on the device where you are signed in. If it still does not update, mark the contact as Contacted from the contact card instead, which does the same job.",
      },
    ],
  },
  {
    id: "trouble-team",
    title: "Teams and invitations",
    items: [
      {
        question: "My colleague's join code is rejected.",
        answer: "Codes are case sensitive and only work for that specific exhibition. Ask them to copy and paste the code or send the join link directly, then try again from Join Team Exhibition on Home.",
      },
      {
        question: "A team member cannot see the contacts I scanned.",
        answer: "Check that you scanned into the team exhibition rather than a personal one, and that they joined using the code. Only entries inside a team exhibition are shared.",
      },
      {
        question: "The invitation email has not arrived.",
        answer: "Ask them to check spam and confirm the address was typed correctly. Invitations can only be sent to a valid email address, and they may need to create an account from the link before signing in.",
      },
    ],
  },
  {
    id: "trouble-places",
    title: "Discover and places",
    items: [
      {
        question: "My place is not showing in Discover.",
        answer: "Open the place and check that Share with community is switched on. Private places only appear to you and your team exhibition.",
      },
      {
        question: "Near Me shows places far away.",
        answer: "Near Me sorts by distance from your current position, and the distance limit can hide everything nearby. Widen the distance or turn Near Me off and search by name instead.",
      },
      {
        question: "I saved a place with no signal and it has not appeared.",
        answer: "Offline places queue on your phone and upload when the app next opens with a connection. Close and reopen the app to trigger the sync, and keep the app open for a few seconds.",
      },
      {
        question: "The address will not fill in automatically.",
        answer: "Location lookup needs permission and a connection. Allow location access, or type the address by hand and save.",
      },
    ],
  },
  {
    id: "trouble-app",
    title: "App and account",
    items: [
      {
        question: "Text is hard to read.",
        answer: "Use the sun or moon icon at the top right to switch between light and dark themes. The app follows its own setting rather than your phone's.",
      },
      {
        question: "The screen is blank or will not refresh.",
        answer: "Pull down on the list to refresh, or close and reopen the app. If it stays blank, sign out and back in.",
      },
      {
        question: "I cannot install the app on my phone.",
        answer: "Installation only works from Safari on iPhone and Chrome on Android. Open the app in that browser first, then follow the Add to Home Screen steps in the Getting Started section.",
      },
      {
        question: "I was signed out unexpectedly.",
        answer: "Sign in again with the same email. Sessions expire after a long period of inactivity, and clearing your browser data will also sign you out.",
      },
      {
        question: "I still need help.",
        answer: "Email support@cardscan-pro.com with a short description of what you were doing and what happened, and we will get back to you.",
      },
    ],
  },
];

export function topicMatches(topic, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return [topic.title, ...(topic.steps || []), topic.tip || ""]
    .join(" ")
    .toLowerCase()
    .includes(q);
}