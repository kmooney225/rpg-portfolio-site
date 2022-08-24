// class Sprite {
//   constructor({ position, velocity, image, framesX = {max: 1},  framesY = {max: 1}}) {
//     this.position = position;
//     this.image = image;
//     this.framesX = framesX;
//     this.framesY = framesY;
//     this.image.onload = () => {
//     this.width = this.image.width / this.framesX.max;
//     this.height = this.image.height / this.framesY.max;
//     console.log(this.width)
//     console.log(this.height)
//     }
//   }
//
//   draw() {
//       context.drawImage(
//         this.image,
//         0,
//         0,
//         this.image.width/ this.framesX.max,
//         this.image.height/ this.framesY.max,
//         this.position.x,
//         this.position.y,
//         this.image.width/this.framesX.max,
//         this.image.height/this.framesY.max,
//       );
//   }
// }
