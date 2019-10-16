require('@tensorflow/tfjs-node') // run cpu if want gpu add '-gpu'
const tf = require('@tensorflow/tfjs')
const loadCSV = require('./load-csv')

const knn = (features, labels, predictionPoint, k) => {
    const { mean, variance } = tf.moments(features, 0)
    const scaledPrediction = predictionPoint.sub(mean).div(variance.pow(0.5))
    return features
        .sub(mean)
        .div(variance.pow(0.5))
        .sub(scaledPrediction) // find distance start
        .pow(2)
        .sum(1)
        .pow(0.5) //find distance stop
        .expandDims(1) 
        .concat(labels, 1) // concat labels in same tensor
        .unstack() // from here down we work on simple arrays
        .sort((a,b) => a.get(0) > b.get(0) ? 1 : -1) // sort array of results
        .slice(0, k) //keep K results
        .reduce ((acc, pair) => acc + pair.get(1), 0) / k; // REGRESSION find m.o. of results
 }

let { features, labels, testFeatures, testLabels } = loadCSV('kc_house_data.csv', {
    shuffle: true,
    splitTest: 10,
    dataColumns: ['lat', 'long', 'sqft_lot', 'sqft_living'],
    labelColumns: ['price']
})

features = tf.tensor(features)
labels = tf.tensor(labels)
// testFeatures = tf.tensor(testFeatures)
//testLabels = tf.tensor(testLabels)


testFeatures.forEach((testItem, i) => {
    [3,4,5,6,7,8,9,10].forEach(k => {
        const result = knn(features, labels, tf.tensor(testItem), k)
        const err = ((testLabels[i][0] - result) / testLabels[i][0]) * 100
        console.log('Guess', k, Number(err).toFixed(2) + '%', result, testLabels[i][0]);
    })
});