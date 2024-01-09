function calcDist(pointOne, pointTwo) {
    let aSqr = Math.pow(Math.abs(pointOne.x - pointTwo.x), 2);
    let bSqr = Math.pow(Math.abs(pointOne.y - pointTwo.y), 2);    
    let dist = Math.sqrt(aSqr + bSqr);
    return dist;
}