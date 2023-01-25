import React from 'react';
import collision from './data/Collision.js'
import musicData from './data/Music.js'
// import aboutData from './data/About.js'
// import contactData from './data/Contact.js'
// import projectsData from './data/Projects.js'
import { gsap } from "gsap";


const Scene = ({draw, height, width}) => {
  const canvas = React.useRef();

  React.useEffect(() => {

    console.log(musicData)

    const context = canvas.current.getContext("2d");

    const offset = {
      x: -290,
      y: -180
    }

    const boundaries = []

    const collisionMap = []
    for (let i = 0; i < collision.length; i+=30) {
      collisionMap.push(collision.slice(i, 30 + i))
    }

    const musicMap = []
    for (let i = 0; i < musicData.length; i+=30) {
      musicMap.push(musicData.slice(i, 30 + i))
    }

    class Boundary {
      static width = 56;
      static height = 56;

      constructor({position}) {
        this.position = position
        this.width = 56
        this.height = 56
      }

      draw() {
        context.fillStyle = 'rgba(255, 0, 0, 0)'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
      }
    }

    class Sprite {
      constructor({ position, velocity, image, framesX = {max: 1},  framesY = {max: 1}}) {
        this.position = position;
        this.image = image;
        this.framesX = {...framesX, val:0, elapsed:0};
        this.framesY = {...framesY, val:0};

        this.image.onload = () => {
          this.width = this.image.width / this.framesX.max;
          this.height = this.image.height / this.framesY.max;
        }
        this.moving = false
      }

      draw() {
          context.drawImage(
            this.image,
            this.framesX.val * 32,
            this.framesY.val * 64,
            this.image.width/ this.framesX.max,
            this.image.height/ this.framesY.max,
            this.position.x,
            this.position.y,
            this.image.width/this.framesX.max,
            this.image.height/this.framesY.max,
          );

          if (!this.moving) return
          if (this.framesX.max > 1) {
            this.framesX.elapsed++
          }

          if (  this.framesX.elapsed % 10 === 0)
          if (this.framesX.val < this.framesX.max-1) this.framesX.val++
          else this.framesX.val = 0

      }
    }

    function rectangularCollsion({rectangle1, rectangle2}) {
      return(
         rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
         rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
         rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
         rectangle1.position.y + rectangle1.height >= rectangle2.position.y
      )
    }

    const image = new Image();
    image.src = require("../rooms/PracticeRoom.png");

    const foregroundImage = new Image();
    foregroundImage.src = require("../rooms/ForegroundObjects.png");

    const playerImage = new Image();
    playerImage.src = require("../rooms/CharacterMove.png");

    const background = new Sprite({
      position: {
        x: offset.x,
        y: offset.y
      },
      image : image
  })

  const foreground = new Sprite({
      position: {
        x: offset.x,
        y: offset.y
      },
      image : foregroundImage
  })

  const player = new Sprite ({
    position: {
      x: width/2,
      y: height/2- 1312 /28,
    },
    image: playerImage,
    framesX: {
      max: 6
    },
    framesY: {
      max: 4
    }
  })

  // const testBoundary = new Boundary ({
  //   position:{
  //     x: 200,
  //     y: 200
  //   }
  // })

    collisionMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        if ( symbol === 2372){
          boundaries.push(new Boundary({
            position:{
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            }
          })
        )
      }
    })
    })

    const musics = []

    musicMap.forEach((row, i) => {
      row.forEach((symbol, j) => {
        if ( symbol === 2372){
          musics.push(new Boundary({
            position:{
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            }
          })
        )
      }
    })
    })
    
    const musicMenu = {
      initiated: false
    }

    const movables = [background, ...boundaries, foreground, ...musics]

    const keys = {
      w: {
        pressed: false
      },

      s: {
        pressed: false
      },

      a: {
        pressed: false
      },

      d: {
        pressed: false
      },

      space: {
        pressed: false
      }
    }

    let lastKey = '';

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        default:
          break;

        case 'w':
          keys.w.pressed = true
          lastKey = 'w'
          break;

        case 's':
          keys.s.pressed = true
          lastKey = 's'
          break;

        case 'a':
          keys.a.pressed = true
          lastKey = 'a'
          break;

        case 'd':
          keys.d.pressed = true
          lastKey = 'd'
          break;

        case ' ':
          keys.space.pressed = true
          lastKey = ' '
          break;

      }
    })

    window.addEventListener('keyup', (e) => {
      switch (e.key) {
        default:
          break;

        case 'w':
        keys.w.pressed = false
          break;

        case 's':
          keys.s.pressed = false
          break;

        case 'd':
          keys.d.pressed = false
          break;

        case 'a':
          keys.a.pressed = false
          break;

        case ' ':
          keys.space.pressed = false
          break;
      }
      console.log(e.key);
    });

    //Game loop-----------------------------------------------------------------------------
    function animate () {
      const animationID = window.requestAnimationFrame(animate);
      background.draw();
      boundaries.forEach( boundary => {
        boundary.draw()
      });
      musics.forEach( music => {
        music.draw()
      });
      player.draw();
      foreground.draw();

      if (musicMenu.initiated) return

      if (keys.space.pressed && lastKey === ' ') {
        for (let i = 0; i <musics.length; i++){
          console.log('hit')
          const music = musics[i]
          if (
            rectangularCollsion({
              rectangle1: {...player, position:{
                x: player.position.x-2 || player.position.x+2,
                y: player.position.y-2 || player.position.y+2
              }},
              rectangle2: music
            })
           ){
            console.log('event A C T I V A T E D')
            window.cancelAnimationFrame(animationID)
            musicMenu.initiated = true
            player.moving = false
            gsap.to('#overlappingDiv', {
              opacity: 0.7,
              duration: 0.8,
              onComplete() {
                animateMusicMenu()
              }
            })
            break;
          }
        }
      }

      let moving = true

      player.moving = false

      if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i <boundaries.length; i++){
          player.framesY.val = 1
          player.moving = true
          const boundary = boundaries[i]
          if (
            rectangularCollsion({
              rectangle1: player,
              rectangle2: {...boundary, position:{
                x: boundary.position.x,
                y: boundary.position.y + 3
              }}
            })
          ) {
            console.log('colliding')
            moving = false
            break;
          }
        }
      if (moving){
      movables.forEach((movable) => {
        movable.position.y += 2
      })
    }
  }

      if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i <boundaries.length; i++){
          player.framesY.val = 3
          player.moving = true
          const boundary = boundaries[i]
          if (
            rectangularCollsion({
              rectangle1: player,
              rectangle2: {...boundary, position:{
                x: boundary.position.x,
                y: boundary.position.y - 3
              }}
            })
          ) {
            console.log('colliding')
            moving = false
            break;
          }
        }
      if (moving){
      movables.forEach((movable) => {
        movable.position.y -= 2
      })
    }

        }
      if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i <boundaries.length; i++){
          player.framesY.val = 2
          player.moving = true
          const boundary = boundaries[i]
          if (
            rectangularCollsion({
              rectangle1: player,
              rectangle2: {...boundary, position:{
                x: boundary.position.x + 3,
                y: boundary.position.y
              }}
            })
          ) {
            console.log('colliding')
            moving = false
            break;
          }
        }
      if (moving){
      movables.forEach((movable) => {
        movable.position.x += 2
      })
    }

        }
      if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i <boundaries.length; i++){
          player.framesY.val = 0
          player.moving = true
          const boundary = boundaries[i]
          if (
            rectangularCollsion({
              rectangle1: player,
              rectangle2: {...boundary, position:{
                x: boundary.position.x - 3,
                y: boundary.position.y
              }}
            })
          ) {
            console.log('colliding')
            moving = false
            break;
          }
        }
      if (moving){
      movables.forEach((movable) => {
        movable.position.x -= 2
      })
    }
  }
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

    function animateMusicMenu () {
      const musicMenuID = window.requestAnimationFrame(animateMusicMenu);

      if (keys.space.pressed && lastKey === ' ') {
          gsap.to('#overlappingDiv', {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
              window.cancelAnimationFrame(musicMenuID)
              musicMenu.initiated = false
              animate()
            }
          })
        }
      }

    animate();

  });

return (
    <canvas ref={canvas} height={height} width={width} />
  );
};

export default Scene;
