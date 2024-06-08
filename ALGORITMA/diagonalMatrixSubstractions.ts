const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];

function diagonalMatrixSubtractions(matrix: number[][]) {
  let firstMatrixSum = 0;
  let secondMatrixSum = 0;

  for (let x = 0; x < matrix.length; x++) {
    firstMatrixSum += matrix[x][x];
    secondMatrixSum += matrix[x][matrix.length - x - 1];
  }

  const result = firstMatrixSum - secondMatrixSum;

  console.log(`${firstMatrixSum} - ${secondMatrixSum} = ${result}`);
}

diagonalMatrixSubtractions(matrix);
