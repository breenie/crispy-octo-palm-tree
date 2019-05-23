module.exports = (emotions) => {
  return emotions.sort((first, second) => {
    return first.Confidence - second.Confidence;
  }).pop().Type;
};