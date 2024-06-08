const word = 'NEGIE1';

function reverse(word: string) {
  const alphabets = [...word]
    .filter((v) => isNaN(Number(v)) === true)
    .map((v) => v);
  const nums = [...word]
    .filter((v) => isNaN(Number(v)) === false)
    .map((v) => v);

  const reversedAlphabets = alphabets.reverse().join('');
  const reversed = reversedAlphabets + nums.join('');

  console.log(reversed);
}

reverse(word);
