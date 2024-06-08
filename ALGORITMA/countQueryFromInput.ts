const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];

function countQueryFromInput(input: string[], query: string[]) {
  const result: number[] = [];
  query.forEach((qWord) => {
    let counter = 0;
    input.forEach((iWord) => {
      if (qWord === iWord) counter += 1;
    });
    result.push(counter);
  });

  console.log(result);
}

countQueryFromInput(INPUT, QUERY);
