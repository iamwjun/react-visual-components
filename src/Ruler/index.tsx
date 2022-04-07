import React, { useCallback, useEffect, useRef } from 'react';

interface RulerProps {
  width: number;
  height: number;
  className?: string;
  style?: Omit<React.CSSProperties, 'width' | 'height'>;
  direction: 'horizontal' | 'vertical';
  lineColor?: string;
  fontColor?: string;
  backgroundColor?: string;
}

const Ruler: React.FC<RulerProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    width,
    height,
    direction,
    style = {},
    className = '',
    backgroundColor = '#15161f',
    lineColor = '#404040',
    fontColor = '#A8A8A8',
  } = props;

  const drawRuler = useCallback(
    (element: HTMLCanvasElement, type: 'horizontal' | 'vertical') => {
      const { offsetWidth, offsetHeight } = element;
      element.width = offsetWidth * 2;
      element.height = offsetHeight * 2;

      const step = 10;
      const maxLength = type === 'horizontal' ? offsetWidth * 2 : offsetHeight * 2;
      const ctx = element.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let i = 0; i < maxLength; i += 2) {
          if (type === 'horizontal') {
            ctx.moveTo(i, 40);
          } else {
            ctx.moveTo(40, i);
          }
          if (i % step === 0) {
            if (i % (step * 15) === 0) {
              if (type === 'horizontal') {
                ctx.lineTo(i, 0);
              } else {
                ctx.lineTo(0, i);
              }
            } else {
              if (type === 'horizontal') {
                ctx.lineTo(i, 26);
              } else {
                ctx.lineTo(26, i);
              }
            }
          }
          if (i % (step * 15) === 0) {
            if (type === 'vertical') {
              ctx.save();
              ctx.translate(8, 8);
              ctx.rotate(-Math.PI / 2);
            }
            ctx.fillStyle = fontColor;
            ctx.font = '20px serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            if (type === 'vertical') {
              ctx.fillText(i.toString(), -Math.abs(i - 14), 6);
              ctx.restore();
            } else {
              ctx.fillText(i.toString(), i + 6, 13);
            }
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.scale(0.5, 0.5);
      }
    },
    [fontColor, lineColor],
  );

  useEffect(() => {
    if (canvasRef.current && direction) {
      drawRuler(canvasRef.current, direction);
    }
  }, [direction, drawRuler]);

  return (
    <canvas
      className={className}
      style={{ ...style, backgroundColor, width, height }}
      // eslint-disable-next-line jsx-a11y/aria-role
      role="ruler"
      ref={canvasRef}
    />
  );
};

export default Ruler;
