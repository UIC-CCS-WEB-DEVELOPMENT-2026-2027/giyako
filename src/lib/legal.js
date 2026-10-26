// Content for the footer pages (About, Privacy, Terms, Contact).
// Change CONTACT_EMAIL before you share the demo, and have the Privacy Policy and Terms
// reviewed if Giyako ever goes beyond a demo.
export const CONTACT_EMAIL = "giyako.support@example.com";
export const LAST_UPDATED = "October 27, 2026";

export const PAGE_ORDER = ["about", "privacy", "terms", "contact"];

export const PAGES = {
  about: {
    label: "About",
    title: "About Giyako",
    intro: "Giyako is a campus social app for finding your people through what you love.",
    sections: [
      {
        h: "What it is",
        p: [
          "You log the movies, shows, anime, games, albums and books you can’t stop talking about. Giyako then shows you who on campus shares your taste, so you have something real to start a conversation with.",
        ],
      },
      {
        h: "How it works",
        list: [
          "Log what you love. Search the catalog and add the titles you keep coming back to.",
          "See who overlaps. Your home page ranks people on campus by how much of your taste they share.",
          "Say hi. Open a profile, spot what you have in common, and send a message.",
        ],
      },
      {
        h: "Campus Hub",
        p: [
          "Beyond taste matching, the Campus Hub is a community board for lost and found, study help, events, buying and selling, housing, rides and clubs.",
        ],
      },
      {
        h: "Why we built it",
        p: [
          "Shared interests are an easier opener than a cold hello. Giyako is built around that idea: where U and I, connect.",
        ],
      },
      {
        h: "A work in progress",
        p: [
          "Giyako is currently a demo. Some parts, like the sample profiles and upcoming events, use placeholder data while we build toward a full launch.",
        ],
      },
    ],
  },

  privacy: {
    label: "Privacy",
    title: "Privacy Policy",
    updated: true,
    intro:
      "This policy explains what Giyako collects, where it’s kept and what you can control. Giyako is currently a demo, and this policy describes how the demo actually works.",
    sections: [
      {
        h: "What you give us",
        list: [
          "Your email and password, to create and secure your account.",
          "Profile details: name, handle, program, year level, pronouns, bio, photo and social handles.",
          "Who you follow, and your choices for who can see your followers and following.",
          "Your logs, including which one is your featured pick.",
          "Your messages, notifications and settings.",
          "Your Campus Hub posts, votes and comments.",
        ],
      },
      {
        h: "Where it’s stored",
        p: [
          "In this demo, all of that is stored in your own browser (localStorage) on your device. It isn’t sent to a Giyako server or shown to other real users.",
          "Your password is hashed in your browser before it’s saved, but because everything stays on your device, the demo shouldn’t be treated as a secure system. Please don’t use a password you use anywhere else.",
        ],
      },
      {
        h: "What leaves your device",
        p: [
          "When you search the media catalog, your search text and category are sent to the Giyako server so it can return results.",
          "Cover art loads from third-party image hosts such as Open Library and Apple, and the site’s font loads from Google Fonts. Like any website, those services can see your IP address and browser details when they serve a file.",
        ],
      },
      {
        h: "Cookies and tracking",
        p: [
          "Giyako doesn’t use cookies, advertising or analytics trackers. It uses browser storage to remember your account, logs and settings. Our hosting provider may keep standard server logs.",
        ],
      },
      {
        h: "Who can see your followers",
        p: [
          "For followers and following you can choose Everyone, People I follow back or Only me in Settings. Profiles also show a small “Mutuals with you” badge when someone you follow also follows that person. It doesn’t name those people or count them. Giyako applies that choice to the people shown in the demo, but because there’s no shared server, no real user can see your profile yet. The people shown on Home, and who follows whom, are sample data.",
        ],
      },
      {
        h: "Your choices",
        list: [
          "Edit your profile, logs and settings any time.",
          "Turn off message notifications or animations in Settings.",
          "Delete your account in Settings to remove your account, logs, follows, messages, notifications and posts from this browser. Clearing your browser’s site data does the same.",
        ],
      },
      {
        h: "Children",
        p: ["Giyako is for university students and isn’t intended for children under 13."],
      },
      {
        h: "If Giyako becomes a live service",
        p: [
          "A full launch would store data on a server. If that happens, we’ll update this policy first, tell you what changes, and handle personal data in line with applicable privacy laws, including the Data Privacy Act of 2012 in the Philippines.",
        ],
      },
      {
        h: "Changes and questions",
        p: [
          `We may update this policy and will change the date above when we do. Questions? Reach us at ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },

  terms: {
    label: "Terms",
    title: "Terms and Conditions",
    updated: true,
    intro:
      "By creating an account or using Giyako you agree to these terms. If you don’t agree, please don’t use the service.",
    sections: [
      {
        h: "1. Who can use Giyako",
        p: [
          "Giyako is for university students and members of the campus community. You must be old enough to agree to these terms where you live, and you agree to give accurate information when you sign up.",
        ],
      },
      {
        h: "2. Your account",
        p: [
          "You’re responsible for your account and password. Let us know if you think someone else has used your account. You can delete your account at any time from Settings.",
        ],
      },
      {
        h: "3. Your content",
        p: [
          "You own what you post, including profile details, logs, messages and Campus Hub posts. By posting, you let Giyako display that content within the service so it works as intended. You’re responsible for what you share and for having the right to share it.",
        ],
      },
      {
        h: "4. Community rules",
        list: [
          "Be respectful. No harassment, hate, threats or bullying.",
          "Don’t pretend to be someone else or use a fake identity.",
          "Don’t post spam, scams or anything illegal.",
          "Don’t share other people’s private information without their permission.",
          "Keep Campus Hub posts honest, especially for buying and selling, housing and rides.",
          "Don’t try to break, overload or misuse the service.",
        ],
      },
      {
        h: "5. Meeting people safely",
        p: [
          "We can’t verify everyone on Giyako and we’re not responsible for what happens offline. Meet in public places, tell a friend where you’re going, and be careful about sharing personal details or making payments.",
        ],
      },
      {
        h: "6. Third-party content",
        p: [
          "Titles, posters and cover art belong to their respective owners and are shown only to describe what people have logged. Giyako doesn’t claim ownership of them.",
        ],
      },
      {
        h: "7. Demo notice",
        p: [
          "Giyako is currently a demo. Features may change, data may be reset, and the service may be unavailable without notice. Please don’t rely on it for anything important.",
        ],
      },
      {
        h: "8. Removing content or access",
        p: [
          "We may remove content or suspend access if it breaks these terms or puts others at risk.",
        ],
      },
      {
        h: "9. No warranty and limits on liability",
        p: [
          "Giyako is provided “as is” without warranties of any kind. To the extent the law allows, we aren’t liable for losses that come from using the service or from what other users do.",
        ],
      },
      {
        h: "10. Changes to these terms",
        p: [
          "We may update these terms. If the changes are significant, we’ll let you know in the app. Continuing to use Giyako means you accept the updated terms.",
        ],
      },
      {
        h: "11. Contact",
        p: [`Questions about these terms? Reach us at ${CONTACT_EMAIL}.`],
      },
    ],
  },

  contact: {
    label: "Contact",
    title: "Contact us",
    intro: "Questions, bug reports, feedback or something to report? We’d like to hear it.",
    email: CONTACT_EMAIL,
    sections: [
      {
        h: "What to include",
        list: [
          "For a bug: what you were doing, what you expected and what happened. A screenshot helps.",
          "For a report: the title of the post or the name of the profile, and what’s wrong.",
        ],
      },
      {
        h: "How long it takes",
        p: ["This is a small project, so replies can take a few days."],
      },
      {
        h: "If it’s urgent",
        p: [
          "If someone is in danger, contact campus security or local emergency services right away. Giyako isn’t monitored in real time.",
        ],
      },
    ],
  },
};
