'use client';

import * as React from 'react';
import { TextWavy } from '@/components/ui/text-wavy';

export function TextWavyDemo() {
  return (
    <div className="flex justify-center items-center size-full p-4">
      <TextWavy
        delayTime={0.5}
        colors={['rgba(255,255,255,0.6)', '#2E90FF', '#00E5FF', 'rgba(255,255,255,0.6)']}
        fontSizes={['14px', '18px', '14px']}
        fontWeights={[500, 700, 500]}
        className="uppercase tracking-wider font-primary"
        text={"Let's create a wave effect"}
      />
    </div>
  );
}

export default TextWavyDemo;
