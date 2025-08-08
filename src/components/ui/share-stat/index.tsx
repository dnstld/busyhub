'use client';

import Achievements from '@/components/presenters/achievements';
import HeatmapChart from '@/components/presenters/charts/heatmap-chart';
import { ShareModal } from '@/components/ui/share-modal';
import { useUser } from '@/providers';
import { useCalendar } from '@/providers/events-provider';
import { useSharing } from '@/providers/sharing-provider';
import html2canvas from 'html2canvas-pro';
import { Share2Icon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function ShareStat() {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [canShareStat, setCanShareStat] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const events = useCalendar();
  const user = useUser();
  const { setIsSharing } = useSharing();

  useEffect(() => {
    // Always enable share functionality now since we have multiple fallback options
    setCanShareStat(true);
  }, []);

  const handleShare = async () => {
    const element = hiddenRef.current;
    if (!element) return;

    setIsGenerating(true);
    setIsSharing(true); // This will update the UI for components
    setIsModalOpen(true);

    // Wait a bit for React to re-render the components with the new sharing state
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#18181b', // zinc-900
        scale: 2, // Higher resolution
        useCORS: true,
      });

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png')
      );

      setImageBlob(blob);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate the image. Please try again.');
      setIsModalOpen(false);
    } finally {
      setIsGenerating(false);
      setIsSharing(false); // Reset the UI state
    }
  };

  const handleShareMethod = async (method: 'native' | 'copy' | 'download') => {
    if (!imageBlob) return;

    const file = new File([imageBlob], 'busyhub-stats.png', {
      type: 'image/png',
    });

    try {
      switch (method) {
        case 'native':
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              title: 'My BusyHub Calendar Stats',
              text: 'Check out my calendar activity stats from BusyHub!',
              files: [file],
            });
          } else {
            throw new Error('Native sharing not supported');
          }
          break;

        case 'copy':
          if (navigator.clipboard && 'write' in navigator.clipboard) {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': imageBlob,
              }),
            ]);
          } else {
            throw new Error('Clipboard not supported');
          }
          break;

        case 'download':
          const url = URL.createObjectURL(imageBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'busyhub-stats.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          break;
      }
    } catch (error) {
      // Check if it's a user cancellation (AbortError) - don't log as error
      if (
        error instanceof Error &&
        (error.name === 'AbortError' ||
          error.message.includes('canceled') ||
          error.message.includes('cancelled') ||
          error.message.includes('Share canceled'))
      ) {
        // User cancelled, just throw without logging
        throw error;
      }

      // Only log actual errors (not cancellations)
      console.error(`Error with ${method} share:`, error);
      throw error;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageBlob(null);
  };

  return (
    <>
      <section className="flex flex-col items-center gap-4">
        <button
          onClick={handleShare}
          disabled={!canShareStat || isGenerating}
          className={`group text-lg font-bold py-4 px-8 rounded-xl inline-flex items-center gap-3 cursor-pointer transition-all duration-300 transform ${
            canShareStat && !isGenerating
              ? 'bg-lime-400 hover:bg-lime-300 text-zinc-900 hover:scale-105 hover:shadow-2xl hover:shadow-lime-500/20'
              : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
          }`}
        >
          <Share2Icon
            size={20}
            className="group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
          {isGenerating ? 'Generating...' : 'Share Stats'}
        </button>

        {!canShareStat && (
          <p className="text-xs text-zinc-400 text-center max-w-xs">
            This feature is not supported in your browser. On mobile, it may
            download the image instead.
          </p>
        )}

        {/* Hidden element rendered off-screen for screenshot generation */}
        <div
          ref={hiddenRef}
          className="absolute left-[-9999px] top-0 bg-zinc-900 text-zinc-100 p-8 w-fit"
        >
          <div className="flex flex-col gap-6">
            {/* Header with avatar and user info */}
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
              <Image
                className="w-16 h-16 rounded-full"
                src={user?.image || ''}
                alt={`${user?.name ?? 'User'} avatar`}
                width={64}
                height={64}
              />
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-zinc-400 text-sm">busyhub.app</p>
              </div>
            </div>

            {/* Heatmap Chart */}
            <div>
              <HeatmapChart events={events} />
            </div>

            {/* Achievements/Badges */}
            <div>
              <Achievements />
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-zinc-500 border-t border-zinc-800 pt-4">
              <p>Generated by DeskBuddy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageBlob={imageBlob}
        isGenerating={isGenerating}
        onShare={handleShareMethod}
      />
    </>
  );
}
