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
        See it in action
      </h2>
      <div className="w-full max-w-[275px] xs:max-w-[300px] sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
        <div
          className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-700"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-xs text-zinc-400 font-mono">BusyHub</span>
          </div>
        </div>
        <div
          ref={containerRef}
          className="relative overflow-hidden aspect-video rounded-sm border border-zinc-800"
        >
          <motion.div
            style={{ y }}
            className="absolute top-0 left-0 w-full h-[250%]"
          >
            <Image
              src="/images/app.jpg"
              alt="BusyHub dashboard displaying interactive calendar heatmap and productivity insights for a real user"
              fill
              className="object-cover object-top"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
