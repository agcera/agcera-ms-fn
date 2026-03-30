import { useState } from 'react';

const ZoomableImage = ({ image }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setCursorPosition({ x, y });
  };

  return (
    <div
      className="relative w-full h-full max-w-20 max-h-20 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={image}
        className="w-full h-full transition-transform duration-300 transform-gpu"
        style={{
          transformOrigin: `${cursorPosition.x * 100}% ${cursorPosition.y * 100}%`,
          transform: isHovered ? 'scale(2)' : 'scale(1)',
        }}
        alt="productImage"
      />
    </div>
  );
};

export default ZoomableImage;
