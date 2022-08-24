import React from 'react';

const Player = ({draw, height, width}) => {
  const canvas = React.useRef();

  React.useEffect(() => {
    const context = canvas.current.getContext("2d");

    const image = new Image();
    image.src = require("../rooms/Character.png");

    image.onload = () => {
      context.drawImage(image, 0, 0);
    };
  });

return (
    <canvas ref={canvas} height={height} width={width} />
  );
};

export default Player;
