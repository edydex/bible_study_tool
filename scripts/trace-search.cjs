const {bibleBooks} = require('../src/data/bible-books.js');
const extraAliases = {'he': 'Hebrews', 'heb': 'Hebrews', 'hebrews': 'Hebrews', 'judges': 'Judges', 'judg': 'Judges', 'jdg': 'Judges', 'revelation': 'Revelation', 'rev': 'Revelation', 're': 'Revelation'};
const allAliases = {...extraAliases};
bibleBooks.forEach(b => { allAliases[b.name.toLowerCase()] = b.name; allAliases[b.abbr.toLowerCase()] = b.name });
const sorted = Object.keys(allAliases).sort((a,b) => b.length - a.length);

function trace(word) {
  const trimmed = word.trim().toLowerCase();
  for (const alias of sorted) {
    if (!trimmed.startsWith(alias)) continue;
    const rest = trimmed.slice(alias.length);
    if (rest && !/^[\s\d:.]/.test(rest)) continue;
    // This alias matched
    const refPart = rest.trim();
    console.log(JSON.stringify(word), '-> alias', JSON.stringify(alias), '(' + allAliases[alias] + '), rest=' + JSON.stringify(rest) + ', refPart=' + JSON.stringify(refPart));
    return;
  }
  console.log(JSON.stringify(word), '-> NO alias match -> text search');
}

['husband', 'husband ', 'husb', 'revelation', 'reveal', 'judges', 'judge', 'mark', 'job', 'acts', 'heaven'].forEach(trace);
