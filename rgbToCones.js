/*
const CONE_DIMENSION = 3; // 3 x 3 per ganglion
const xOffset = index % DIMENSION;
const yOffset = Math.floor(index / DIMENSION);
cones.forEach((cone, i) => {
   const coneXOffset = (CONE_DIMENSION * xOffset) + (i % CONE_DIMENSION);
   const coneYOffset = CONE_DIMENSION * DIMENSION * (yOffset + Math.floor(i / CONE_DIMENSION));

   console.log(`${index},${i} ->`, coneXOffset + coneYOffset);
});
*/

/*


const CONE_DIMENSION = 3; // 3 x 3 per ganglion
const xOffset = Math.floor((index % DIMENSION) / CONE_DIMENSION);
const yOffset = Math.floor(index / DIMENSION);
cones.forEach((cone, i) => {
   const coneXOffset = (CONE_DIMENSION * xOffset) + (i % CONE_DIMENSION);
   const coneYOffset = (CONE_DIMENSION * DIMENSION * yOffset) + (DIMENSION * Math.floor(i / CONE_DIMENSION));

   console.log(`${index},${i} ->`, coneXOffset + coneYOffset);
});

*/
