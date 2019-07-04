const getPolyLineByPath = path => {
  const points = [];
  const polyLine = [
    {
      points: [],
      color: "#0091ff",
      width: 6
    }
  ];
  if (!path) {
    return polyLine;
  }
  const { steps } = path;
  if (steps && steps.length > 0) {
    for (let i = 0; i < steps.length; i++) {
      const { polyline } = steps[i];
      let polyArr = polyline.split(";");
      for (let j = 0; j < polyArr.length; j++) {
        points.push({
          longitude: parseFloat(polyArr[j].split(",")[0]),
          latitude: parseFloat(polyArr[j].split(",")[1])
        });
      }
    }
    polyLine[0].points = points;
  } else {
    return polyLine;
  }
  return polyLine;
};

exports.getPolyLineByPath = getPolyLineByPath;
