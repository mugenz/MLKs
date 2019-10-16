const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel])

  // console.log('outputs :', outputs);
}



// function runAnalysis() {
//   const testSetSize = 50;
//   const [testSet, trainingSet] = splitDataSet(minMax(outputs, 3), testSetSize);
//   _.range(1 , k+1).forEach(r => {
//       const accuracy = _.chain(testSet)
//         .filter(testPoint =>  knn(trainingSet, _.initial(testPoint), r) === testPoint[3])
//         .size()
//         .divide(testSetSize)
//         .value()
//       //console.log('bucket, el[3] :', bucket, el[3]);
//       console.log('k :',r , accuracy);
//   })  
// }

function runAnalysis() {
  const testSetSize = 50;
  const k = 10;
  _.range(0, 3).forEach(feature => {
      const data = _.map(outputs, row => [row[feature], _.last(row)]);
      const [testSet, trainingSet] = splitDataSet(minMax(data, 1), testSetSize);
      const accuracy = _.chain(testSet)
        .filter(testPoint =>  knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
        .size()
        .divide(testSetSize)
        .value()
      //console.log('bucket, el[3] :', bucket, el[3]);
      console.log('feature :',feature , accuracy);
  })  
}
const knn = (data, point, kk) => 
  _.chain(data)
    .map(row => [distance(_.initial(row), point), _.last(row)]) // find distance 
    .sortBy(row => row[0]) // sort results, less distance up
    .slice(0, kk) // keep k results
    .countBy(row => row[1]) // count them
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt() 
    .value();

const distance = (pointA, pointB) => {
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;
};

const splitDataSet = (data, testSetSize) => {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testSetSize);
  const trainingSet = _.slice(shuffled, testSetSize);

  return [testSet, trainingSet];
}
// normalize Data
function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);
  for (let i=0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i]);

    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }
  return clonedData;
}
