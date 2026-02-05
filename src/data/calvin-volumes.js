/**
 * Complete mapping of CCEL Calvin Commentary volume identifiers (calcom01–calcom45)
 * to the Bible books they cover.
 *
 * Verified by fetching title pages from https://ccel.org/ccel/calvin/calcomNN/calcomNN.i.html
 * on 2026-02-05.
 *
 * Key corrections vs. the standard CTS numbering sometimes cited online:
 *  - Psalms has 5 CCEL volumes (08-12), not 6
 *  - Jeremiah & Lamentations has 5 CCEL volumes (17-21), not 4
 *  - Ezekiel is 22-23, Daniel is 24-25, Minor Prophets is 26-30
 *  - Acts is 36-37 (2 vols), Romans is 38 (single vol)
 *  - Vol 41 = Galatians & Ephesians only
 *  - Vol 42 = Philippians, Colossians & Thessalonians
 *  - Vol 43 = Timothy, Titus & Philemon
 *  - Vol 44 = Hebrews (single vol)
 *  - Vol 45 = Catholic Epistles (single vol: James, 1-2 Peter, 1 John, Jude)
 */

export const CALVIN_VOLUME_MAP = {
  // ── Old Testament ──────────────────────────────────────────────────
  calcom01: {
    title: "Commentary on Genesis, Vol. 1",
    books: ["Genesis"],
    volumeOf: "Genesis",
    volumeNum: 1,
    totalVolumes: 2,
  },
  calcom02: {
    title: "Commentary on Genesis, Vol. 2",
    books: ["Genesis"],
    volumeOf: "Genesis",
    volumeNum: 2,
    totalVolumes: 2,
  },

  calcom03: {
    title: "Harmony of the Four Last Books of Moses, Vol. 1",
    books: ["Exodus", "Leviticus", "Numbers", "Deuteronomy"],
    volumeOf: "Harmony of the Law",
    volumeNum: 1,
    totalVolumes: 4,
  },
  calcom04: {
    title: "Harmony of the Four Last Books of Moses, Vol. 2",
    books: ["Exodus", "Leviticus", "Numbers", "Deuteronomy"],
    volumeOf: "Harmony of the Law",
    volumeNum: 2,
    totalVolumes: 4,
  },
  calcom05: {
    title: "Harmony of the Four Last Books of Moses, Vol. 3",
    books: ["Exodus", "Leviticus", "Numbers", "Deuteronomy"],
    volumeOf: "Harmony of the Law",
    volumeNum: 3,
    totalVolumes: 4,
  },
  calcom06: {
    title: "Harmony of the Four Last Books of Moses, Vol. 4",
    books: ["Exodus", "Leviticus", "Numbers", "Deuteronomy"],
    volumeOf: "Harmony of the Law",
    volumeNum: 4,
    totalVolumes: 4,
  },

  calcom07: {
    title: "Commentary on Joshua",
    books: ["Joshua"],
    volumeOf: "Joshua",
    volumeNum: 1,
    totalVolumes: 1,
  },

  calcom08: {
    title: "Commentary on Psalms, Vol. 1",
    books: ["Psalms"],
    volumeOf: "Psalms",
    volumeNum: 1,
    totalVolumes: 5,
  },
  calcom09: {
    title: "Commentary on Psalms, Vol. 2",
    books: ["Psalms"],
    volumeOf: "Psalms",
    volumeNum: 2,
    totalVolumes: 5,
  },
  calcom10: {
    title: "Commentary on Psalms, Vol. 3",
    books: ["Psalms"],
    volumeOf: "Psalms",
    volumeNum: 3,
    totalVolumes: 5,
  },
  calcom11: {
    title: "Commentary on Psalms, Vol. 4",
    books: ["Psalms"],
    volumeOf: "Psalms",
    volumeNum: 4,
    totalVolumes: 5,
  },
  calcom12: {
    title: "Commentary on Psalms, Vol. 5",
    books: ["Psalms"],
    volumeOf: "Psalms",
    volumeNum: 5,
    totalVolumes: 5,
  },

  calcom13: {
    title: "Commentary on Isaiah, Vol. 1",
    books: ["Isaiah"],
    volumeOf: "Isaiah",
    volumeNum: 1,
    totalVolumes: 4,
  },
  calcom14: {
    title: "Commentary on Isaiah, Vol. 2",
    books: ["Isaiah"],
    volumeOf: "Isaiah",
    volumeNum: 2,
    totalVolumes: 4,
  },
  calcom15: {
    title: "Commentary on Isaiah, Vol. 3",
    books: ["Isaiah"],
    volumeOf: "Isaiah",
    volumeNum: 3,
    totalVolumes: 4,
  },
  calcom16: {
    title: "Commentary on Isaiah, Vol. 4",
    books: ["Isaiah"],
    volumeOf: "Isaiah",
    volumeNum: 4,
    totalVolumes: 4,
  },

  calcom17: {
    title: "Commentary on Jeremiah & Lamentations, Vol. 1",
    books: ["Jeremiah", "Lamentations"],
    volumeOf: "Jeremiah & Lamentations",
    volumeNum: 1,
    totalVolumes: 5,
  },
  calcom18: {
    title: "Commentary on Jeremiah & Lamentations, Vol. 2",
    books: ["Jeremiah", "Lamentations"],
    volumeOf: "Jeremiah & Lamentations",
    volumeNum: 2,
    totalVolumes: 5,
  },
  calcom19: {
    title: "Commentary on Jeremiah & Lamentations, Vol. 3",
    books: ["Jeremiah", "Lamentations"],
    volumeOf: "Jeremiah & Lamentations",
    volumeNum: 3,
    totalVolumes: 5,
  },
  calcom20: {
    title: "Commentary on Jeremiah & Lamentations, Vol. 4",
    books: ["Jeremiah", "Lamentations"],
    volumeOf: "Jeremiah & Lamentations",
    volumeNum: 4,
    totalVolumes: 5,
  },
  calcom21: {
    title: "Commentary on Jeremiah & Lamentations, Vol. 5",
    books: ["Jeremiah", "Lamentations"],
    volumeOf: "Jeremiah & Lamentations",
    volumeNum: 5,
    totalVolumes: 5,
  },

  calcom22: {
    title: "Commentary on Ezekiel (First 20 Chapters), Vol. 1",
    books: ["Ezekiel"],
    volumeOf: "Ezekiel",
    volumeNum: 1,
    totalVolumes: 2,
    note: "Covers only chapters 1–20",
  },
  calcom23: {
    title: "Commentary on Ezekiel (First 20 Chapters), Vol. 2",
    books: ["Ezekiel"],
    volumeOf: "Ezekiel",
    volumeNum: 2,
    totalVolumes: 2,
    note: "Covers only chapters 1–20",
  },

  calcom24: {
    title: "Commentary on Daniel, Vol. 1",
    books: ["Daniel"],
    volumeOf: "Daniel",
    volumeNum: 1,
    totalVolumes: 2,
  },
  calcom25: {
    title: "Commentary on Daniel, Vol. 2",
    books: ["Daniel"],
    volumeOf: "Daniel",
    volumeNum: 2,
    totalVolumes: 2,
  },

  calcom26: {
    title: "Commentary on the Minor Prophets, Vol. 1 — Hosea",
    books: ["Hosea"],
    volumeOf: "Minor Prophets",
    volumeNum: 1,
    totalVolumes: 5,
  },
  calcom27: {
    title: "Commentary on the Minor Prophets, Vol. 2 — Joel, Amos, Obadiah",
    books: ["Joel", "Amos", "Obadiah"],
    volumeOf: "Minor Prophets",
    volumeNum: 2,
    totalVolumes: 5,
  },
  calcom28: {
    title: "Commentary on the Minor Prophets, Vol. 3 — Jonah, Micah, Nahum",
    books: ["Jonah", "Micah", "Nahum"],
    volumeOf: "Minor Prophets",
    volumeNum: 3,
    totalVolumes: 5,
  },
  calcom29: {
    title: "Commentary on the Minor Prophets, Vol. 4 — Habakkuk, Zephaniah, Haggai",
    books: ["Habakkuk", "Zephaniah", "Haggai"],
    volumeOf: "Minor Prophets",
    volumeNum: 4,
    totalVolumes: 5,
  },
  calcom30: {
    title: "Commentary on the Minor Prophets, Vol. 5 — Zechariah, Malachi",
    books: ["Zechariah", "Malachi"],
    volumeOf: "Minor Prophets",
    volumeNum: 5,
    totalVolumes: 5,
  },

  // ── New Testament ──────────────────────────────────────────────────
  calcom31: {
    title: "Harmony of the Evangelists (Matthew, Mark, Luke), Vol. 1",
    books: ["Matthew", "Mark", "Luke"],
    volumeOf: "Harmony of the Evangelists",
    volumeNum: 1,
    totalVolumes: 3,
  },
  calcom32: {
    title: "Harmony of the Evangelists (Matthew, Mark, Luke), Vol. 2",
    books: ["Matthew", "Mark", "Luke"],
    volumeOf: "Harmony of the Evangelists",
    volumeNum: 2,
    totalVolumes: 3,
  },
  calcom33: {
    title: "Harmony of the Evangelists (Matthew, Mark, Luke), Vol. 3",
    books: ["Matthew", "Mark", "Luke"],
    volumeOf: "Harmony of the Evangelists",
    volumeNum: 3,
    totalVolumes: 3,
  },

  calcom34: {
    title: "Commentary on the Gospel of John, Vol. 1",
    books: ["John"],
    volumeOf: "John",
    volumeNum: 1,
    totalVolumes: 2,
  },
  calcom35: {
    title: "Commentary on the Gospel of John, Vol. 2",
    books: ["John"],
    volumeOf: "John",
    volumeNum: 2,
    totalVolumes: 2,
  },

  calcom36: {
    title: "Commentary on Acts, Vol. 1",
    books: ["Acts"],
    volumeOf: "Acts",
    volumeNum: 1,
    totalVolumes: 2,
  },
  calcom37: {
    title: "Commentary on Acts, Vol. 2",
    books: ["Acts"],
    volumeOf: "Acts",
    volumeNum: 2,
    totalVolumes: 2,
  },

  calcom38: {
    title: "Commentary on Romans",
    books: ["Romans"],
    volumeOf: "Romans",
    volumeNum: 1,
    totalVolumes: 1,
  },

  calcom39: {
    title: "Commentary on Corinthians, Vol. 1",
    books: ["1 Corinthians", "2 Corinthians"],
    volumeOf: "Corinthians",
    volumeNum: 1,
    totalVolumes: 2,
  },
  calcom40: {
    title: "Commentary on Corinthians, Vol. 2",
    books: ["1 Corinthians", "2 Corinthians"],
    volumeOf: "Corinthians",
    volumeNum: 2,
    totalVolumes: 2,
  },

  calcom41: {
    title: "Commentary on Galatians & Ephesians",
    books: ["Galatians", "Ephesians"],
    volumeOf: "Galatians & Ephesians",
    volumeNum: 1,
    totalVolumes: 1,
  },

  calcom42: {
    title: "Commentary on Philippians, Colossians & Thessalonians",
    books: ["Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians"],
    volumeOf: "Philippians, Colossians & Thessalonians",
    volumeNum: 1,
    totalVolumes: 1,
  },

  calcom43: {
    title: "Commentary on Timothy, Titus & Philemon",
    books: ["1 Timothy", "2 Timothy", "Titus", "Philemon"],
    volumeOf: "Timothy, Titus & Philemon",
    volumeNum: 1,
    totalVolumes: 1,
  },

  calcom44: {
    title: "Commentary on Hebrews",
    books: ["Hebrews"],
    volumeOf: "Hebrews",
    volumeNum: 1,
    totalVolumes: 1,
  },

  calcom45: {
    title: "Commentary on the Catholic Epistles",
    books: ["James", "1 Peter", "2 Peter", "1 John", "Jude"],
    volumeOf: "Catholic Epistles",
    volumeNum: 1,
    totalVolumes: 1,
  },
};

/**
 * Reverse lookup: given a Bible book name, return all CCEL volume IDs
 * that contain commentary on that book.
 */
export function getVolumesForBook(bookName) {
  return Object.entries(CALVIN_VOLUME_MAP)
    .filter(([, v]) => v.books.includes(bookName))
    .map(([id]) => id);
}

/**
 * Get the CCEL base URL for a volume.
 *  e.g. "calcom38" → "https://ccel.org/ccel/calvin/calcom38"
 */
export function getCcelUrl(volumeId) {
  return `https://ccel.org/ccel/calvin/${volumeId}`;
}
