const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel])

  // console.log('outputs :', outputs);
}

k = 20;

function runAnalysis() {
  const testSetSize = 50;
  const [testSet, trainingSet] = splitDataSet(outputs, testSetSize);
  let correctPred = 0;
  _.range(1 , k+1).forEach(r => {
      const accuracy = _.chain(testSet)
        .filter(testPoint =>  knn(trainingSet, _.initial(testPoint), r) === testPoint[3])
        .size()
        .divide(testSetSize)
        .value()
      //console.log('bucket, el[3] :', bucket, el[3]);
      console.log('correctPred :',r , accuracy);
  })  
}
const knn = (data, point, kk) => 
  _.chain(data)
    .map(row => [distance(_.initial(row), point), _.last(row)])
    .sortBy(row => row[0])
    .slice(0, kk)
    .countBy(row => row[1])
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
