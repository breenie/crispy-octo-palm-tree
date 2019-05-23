const emotion = require("../emotion");

test("Sort emotions", () => {

  const double = [
    {Type: 'HAPPY', Confidence: 0.23751387000083923},
    {Type: 'DISGUSTED', Confidence: 0.1577695608139038},
    {Type: 'ANGRY', Confidence: 0.23923498392105103},
    {Type: 'SURPRISED', Confidence: 98.03953552246094},
    {Type: 'SAD', Confidence: 0.05963750183582306},
    {Type: 'CONFUSED', Confidence: 0.3887871205806732},
    {Type: 'CALM', Confidence: 0.8775225877761841}
  ];

  expect(emotion(double)).toBe("SURPRISED");
});