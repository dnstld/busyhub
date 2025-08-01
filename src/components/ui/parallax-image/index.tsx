'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function ParallaxImage() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 0.2, 1], ['0%', '0%', '-50%']);

  return (
    <section>
      <h2 className="text-4xl font-bold tracking-tight mb-8">
        Your Calendar, Beautifully Visualized
      </h2>

      <div
        ref={containerRef}
        className="relative overflow-hidden aspect-video w-full max-w-[275px] xs:max-w-[300px] sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-sm border border-zinc-800 mx-auto"
      >
        <motion.div
          style={{ y }}
          className="absolute top-0 left-0 w-full h-[150%]"
        >
          <Image
            src="/images/app.jpg"
            alt="A screenshot of the app showing the heatmap panel and calendar events"
            fill
            className="object-cover object-top"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
