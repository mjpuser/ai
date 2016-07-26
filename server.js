'use strict';

const retina = require('./app');
//
const spawn = require('child_process').spawn;

const ffmpeg = spawn('ffmpeg',
   `-loglevel panic -video_size ${retina.dimension}x${retina.dimension} -framerate 1 -f x11grab -i :0.0+100,100 -c:v rawvideo -pix_fmt:v rgb24 -f rawvideo -`.split(' ')
);

const colors = ['r', 'g', 'b'];
const inputTo = (color, rgb, index) => {
   const cola = colors[color];
   if (cola === 'r') {
      try {
         console.log('rgb', rgb.readUInt8(0));
         retina[cola][index].write(rgb);
      } catch(e) {
         console.log('whaup?', rgb);
         // swallow?
      }
   }
};

const printOutput = (cs, i) => {
   cs.ganglion.on('data', chunk => {
      process.stdout.write(`${cs.ganglion.index}:${chunk.readUInt8(0)};\n`);
   });
};

ffmpeg.stdout.on('data', (chunk) => {
   const entries = chunk.entries();
   let count = 0;
   for (let entry of entries) {
      const rgbVal = entry[1];
      inputTo(count % 3, Buffer.from(rgbVal.toString(16), 'hex'), Math.floor(count / 3), retina);
      count++;
      if (count === retina.total) {
         count = 0;
      }
   }
});
retina.monster.r.forEach(printOutput);

ffmpeg.stdout.on('close', (code) => {
   console.log(`this closed ${code}`);
});

//
// process.stdin.on('data', (chunk) => {
//    console.log('data');
// });
// process.stdin.on('close', code => console.log('closed:', code));
