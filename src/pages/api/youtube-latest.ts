import type { NextApiRequest, NextApiResponse } from "next";

const CHANNELS = new Set([
  "UCkLt6fDcwJIlK8I2k8aKLqQ",
  "UCsxsonS_6WkvUG3dYPL5IPQ",
]);

function decodeXml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const channelId = Array.isArray(request.query.channelId)
    ? request.query.channelId[0]
    : request.query.channelId;

  if (!channelId || !CHANNELS.has(channelId)) {
    return response.status(400).json({ video: null });
  }

  try {
    const feedResponse = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { headers: { Accept: "application/atom+xml" } }
    );

    if (!feedResponse.ok) {
      return response.status(200).json({ video: null });
    }

    const xml = await feedResponse.text();
    const firstEntry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];
    const videoId = firstEntry?.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = firstEntry?.match(/<title>([\s\S]*?)<\/title>/)?.[1];

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=1800, stale-while-revalidate=86400"
    );

    return response.status(200).json({
      video:
        videoId && title
          ? { videoId, title: decodeXml(title.trim()) }
          : null,
    });
  } catch {
    return response.status(200).json({ video: null });
  }
}
