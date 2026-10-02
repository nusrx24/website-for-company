'use client';

import * as React from 'react';
import {
  motion,
  useReducedMotion,
  type ValueKeyframesDefinition,
  type Variants,
} from 'motion/react';
import { cn } from '@/lib/utils';

export interface PropsTextWave extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  as?: React.ElementType;
  colors?: ValueKeyframesDefinition[];
  fontSizes?: ValueKeyframesDefinition[];
  fontWeights?: ValueKeyframesDefinition[];
  delayTime?: number;
}

export const TextWavy = ({
  text,
  as: Component = 'span',
  colors = ['#5AABFF', '#00E5FF', '#2E90FF', '#5AABFF'],
  fontSizes = ['11px', '12.5px', '11px'],
  fontWeights = [500, 700, 500],
  delayTime = 0.5,
  className,
  ...props
}: PropsTextWave) => {
  const letters = text.split('');
  const reducedMotion = useReducedMotion();

  const perspective = {
    initial: {
      fontSize: fontSizes[0],
      fontWeight: fontWeights[0],
      color: colors[0],
    },
    enter: (i: number) => ({
      fontSize: fontSizes,
      fontWeight: fontWeights,
      color: colors,
      transition: {
        delay: delayTime + i * 0.04,
        duration: 0.8,
        ease: 'easeInOut',
        repeat: reducedMotion ? 0 : Infinity,
        repeatDelay: 3.5,
      },
    }),
  } as Variants;

  const MotionComponent = motion.create(Component as any);

  return (
    <MotionComponent
      className={cn('inline-flex items-center flex-wrap', className)}
      {...(props as any)}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={perspective}
          initial="initial"
          animate="enter"
          style={{ display: 'inline-block' }}
          className="will-change-[font-size,color,font-weight]"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export default TextWavy;
