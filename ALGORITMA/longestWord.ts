const sentence = 'Saya sangat senang mengerjakan soal algoritma';

function longest(sentences: string): void {
  const separatedSentences = sentences.split(' ');
  const longestWord = separatedSentences.sort((a, b) => b.length - a.length)[0];
  console.log(`${longestWord}: ${longestWord.length} character`);
}

longest(sentence);
