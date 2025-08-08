'use client';

import { Copy, Download, Share2, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageBlob: Blob | null;
  isGenerating: boolean;
  onShare: (method: 'native' | 'copy' | 'download') => void;
}

export function ShareModal({
  isOpen,
  onClose,
  imageBlob,
  isGenerating,
  onShare,
}: ShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Check native share support
    if (
      typeof navigator !== 'undefined' &&
      'share' in navigator &&
      'canShare' in navigator
    ) {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);

      // Don't revoke the URL immediately, let the component handle it when closing
      return () => {
        // Only revoke if we're unmounting or imageBlob is changing to null
        if (!imageBlob) {
          URL.revokeObjectURL(url);
        }
      };
    } else {
      // Clean up when imageBlob becomes null
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
    }
  }, [imageBlob]);

  // Clean up blob URL when modal closes
  useEffect(() => {
    if (!isOpen && imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  }, [isOpen, imageUrl]);

  const handleShare = async (method: 'native' | 'copy' | 'download') => {
    try {
      await onShare(method);

      // Show feedback
      const messages = {
        native: 'Shared successfully!',
        copy: 'Copied to clipboard!',
        download: 'Downloaded successfully!',
      };

      setFeedback(messages[method]);
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1500);
    } catch (error) {
      // Check if it's a user cancellation (AbortError) - don't show error for this
      if (
        error instanceof Error &&
        (error.name === 'AbortError' ||
          error.message.includes('canceled') ||
          error.message.includes('cancelled') ||
          error.message.includes('Share canceled'))
      ) {
        // User cancelled, do nothing - keep modal open and don't log as error
        return;
      }

      // Only log and show error for actual errors (not cancellations)
      console.error('Share error:', error);
      setFeedback('Something went wrong. Please try again.');
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50">
        <div className="bg-white dark:bg-zinc-900 rounded-t-3xl md:rounded-3xl w-full max-w-lg mx-auto transform transition-transform duration-300 ease-out">
          {/* Handle bar for mobile */}
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Share Stats
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={20} className="text-zinc-500 dark:text-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Image Preview */}
            {isGenerating ? (
              <div className="flex items-center justify-center h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-400" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Generating image...
                  </span>
                </div>
              </div>
            ) : imageUrl ? (
              <div className="mb-6">
                <Image
                  src={imageUrl}
                  alt="Stats preview"
                  width={400}
                  height={200}
                  className="w-full h-32 object-contain bg-zinc-100 dark:bg-zinc-800 rounded-xl"
                />
              </div>
            ) : null}

            {/* Feedback */}
            {feedback && (
              <div className="mb-4 p-3 bg-lime-100 dark:bg-lime-900/20 text-lime-800 dark:text-lime-400 rounded-lg text-center text-sm font-medium">
                {feedback}
              </div>
            )}

            {/* Share Options */}
            <div className="space-y-3">
              {canNativeShare && (
                <button
                  onClick={() => handleShare('native')}
                  disabled={isGenerating || !imageBlob}
                  className="w-full flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Share2
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      Share
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Share via system share sheet
                    </div>
                  </div>
                </button>
              )}

              <button
                onClick={() => handleShare('copy')}
                disabled={isGenerating || !imageBlob}
                className="w-full flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Copy
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    Copy Image
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Copy to clipboard
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleShare('download')}
                disabled={isGenerating || !imageBlob}
                className="w-full flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Download
                    size={20}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    Save Image
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Download to device
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
