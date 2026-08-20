import { useEffect, useState } from "react";

export type LatestYouTubeVideo = {
  videoId: string;
  title: string;
};

export function useLatestYouTubeVideo(channelId: string) {
  const [video, setVideo] = useState<LatestYouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLatestVideo() {
      try {
        const response = await fetch(
          `/api/youtube-latest?channelId=${encodeURIComponent(channelId)}`,
          { signal: controller.signal }
        );

        if (!response.ok) return;

        const data = (await response.json()) as {
          video: LatestYouTubeVideo | null;
        };
        setVideo(data.video);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.warn("Latest YouTube video could not be loaded.", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadLatestVideo();
    return () => controller.abort();
  }, [channelId]);

  return { video, loading };
}
