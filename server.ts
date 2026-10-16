import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Extract Instagram shortcode from URL
function extractInstagramShortcode(url: string): { shortcode: string; type: string } | null {
  try {
    const cleanUrl = url.trim();
    // Matches: /reel/CODE, /reels/CODE, /p/CODE, /tv/CODE, /share/reel/CODE
    const patterns = [
      /\/(?:reel|reels)\/([A-Za-z0-9_-]+)/i,
      /\/p\/([A-Za-z0-9_-]+)/i,
      /\/tv\/([A-Za-z0-9_-]+)/i,
      /\/share\/(?:reel|p)\/([A-Za-z0-9_-]+)/i,
    ];

    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        let type = 'video';
        if (cleanUrl.includes('/reel/') || cleanUrl.includes('/reels/')) type = 'reel';
        else if (cleanUrl.includes('/tv/')) type = 'igtv';
        return { shortcode: match[1], type };
      }
    }

    // Direct shortcode input (e.g. C-x1928_ab)
    if (/^[A-Za-z0-9_-]{9,20}$/.test(cleanUrl)) {
      return { shortcode: cleanUrl, type: 'reel' };
    }

    return null;
  } catch {
    return null;
  }
}

// Clean and decode escaped JSON / HTML URLs
function cleanMediaUrl(rawUrl: string): string {
  let url = rawUrl
    .replace(/\\u0026/g, '&')
    .replace(/\\u002F/g, '/')
    .replace(/\\/g, '')
    .replace(/&amp;/g, '&');
  return url;
}

// Extract hashtags from caption
function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w\u00C0-\u017F]+/g);
  return matches ? Array.from(new Set(matches)) : [];
}

// Curated verified sample data for testing and demonstrations
const DEMO_REELS = [
  {
    shortcode: 'C_sample_nature',
    id: 'demo_1',
    originalUrl: 'https://www.instagram.com/reel/C_sample_nature/',
    type: 'reel',
    title: 'Naturaleza asombrosa: Cañón y cascada cinematográfica en 4K 🌊✨',
    caption: 'Descubre los paisajes más impresionantes de la naturaleza virgen. La belleza del agua en movimiento y la tranquilidad de las montañas. #nature #travel #reels #explore #naturelovers #cinematic',
    hashtags: ['#nature', '#travel', '#reels', '#explore', '#naturelovers', '#cinematic'],
    author: {
      username: 'wildplanet.earth',
      name: 'Wild Planet Exploration',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      profileUrl: 'https://www.instagram.com/wildplanet.earth/',
    },
    videoUrl: 'https://ia800501.us.archive.org/11/items/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    quality: '1080p Full HD',
    likesCount: '45.2K',
    commentsCount: '890',
    duration: 15,
    isAudioAvailable: true,
  },
  {
    shortcode: 'C_sample_food',
    id: 'demo_2',
    originalUrl: 'https://www.instagram.com/reel/C_sample_food/',
    type: 'reel',
    title: 'Receta express: Pasta cremosa artesanal al dente en 10 minutos 🍝🔥',
    caption: 'La receta más fácil y deliciosa de pasta cremosa con ajo dorado, parmesano y albahaca fresca. ¡Guarda este Reel para cenar hoy! #foodie #recetas #pasta #cooking #instafood #chef',
    hashtags: ['#foodie', '#recetas', '#pasta', '#cooking', '#instafood', '#chef'],
    author: {
      username: 'chef.artesanal',
      name: 'Cocina & Sabor',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      profileUrl: 'https://www.instagram.com/chef.artesanal/',
    },
    videoUrl: 'https://cdn.jsdelivr.net/gh/intel-iot-devkit/sample-videos@master/face-demographics-walking.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
    quality: '1080p Full HD',
    likesCount: '128.5K',
    commentsCount: '2.4K',
    duration: 15,
    isAudioAvailable: true,
  },
  {
    shortcode: 'C_sample_tech',
    id: 'demo_3',
    originalUrl: 'https://www.instagram.com/reel/C_sample_tech/',
    type: 'reel',
    title: 'Setup futurista con iluminación ambiental y minimalismo ⚡💻',
    caption: 'Así luce el setup minimalista perfecto para programar y editar video. Cada detalle pensado para máxima productividad. #tech #setup #workspace #developer #minimalism #deskgoals',
    hashtags: ['#tech', '#setup', '#workspace', '#developer', '#minimalism', '#deskgoals'],
    author: {
      username: 'techminimalist',
      name: 'Design & Code Lab',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      profileUrl: 'https://www.instagram.com/techminimalist/',
    },
    videoUrl: 'https://cdn.jsdelivr.net/gh/intel-iot-devkit/sample-videos@master/face-demographics-walking.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    quality: '1080p Full HD',
    likesCount: '89.3K',
    commentsCount: '1.1K',
    duration: 20,
    isAudioAvailable: true,
  },
];

// Helper to fetch Instagram data
async function scrapeInstagramVideo(shortcode: string, originalUrl: string) {
  // Check if it's a demo shortcode
  const demoFound = DEMO_REELS.find((d) => d.shortcode === shortcode || originalUrl.includes(d.shortcode));
  if (demoFound) {
    return {
      ...demoFound,
      downloadUrl: `/api/instagram/download?url=${encodeURIComponent(demoFound.videoUrl)}&filename=${encodeURIComponent('instagram_reel_' + demoFound.shortcode)}`,
    };
  }

  let videoUrl = '';
  let thumbnailUrl = '';
  let caption = '';
  let authorName = 'Instagram Creator';
  let authorUsername = 'instagram_user';
  let avatarUrl = '';
  let likesCount = '';

  // STRATEGY 1: Fetch Instagram Embed page
  try {
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
    const embedResp = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
      },
    });

    if (embedResp.ok) {
      const html = await embedResp.text();

      // Find video src inside video tags or JS payload
      const videoSrcMatch = html.match(/<video[^>]+src="([^">]+)"/i) || html.match(/"video_url":"([^"]+)"/i);
      if (videoSrcMatch && videoSrcMatch[1]) {
        videoUrl = cleanMediaUrl(videoSrcMatch[1]);
      }

      // Alternative: find video_versions array
      if (!videoUrl) {
        const videoVersionsMatch = html.match(/"video_versions":\s*\[\s*\{[^}]*"url":"([^"]+)"/i);
        if (videoVersionsMatch && videoVersionsMatch[1]) {
          videoUrl = cleanMediaUrl(videoVersionsMatch[1]);
        }
      }

      // Thumbnail
      const thumbMatch = html.match(/<img class="EmbeddedMediaImage"[^>]+src="([^">]+)"/i) || html.match(/"display_url":"([^"]+)"/i);
      if (thumbMatch && thumbMatch[1]) {
        thumbnailUrl = cleanMediaUrl(thumbMatch[1]);
      }

      // Caption
      const captionMatch = html.match(/<div class="Caption"[^>]*>([\s\S]*?)<\/div>/i);
      if (captionMatch && captionMatch[1]) {
        caption = captionMatch[1].replace(/<[^>]+>/g, '').trim();
      }

      // Username / Author
      const userMatch = html.match(/class="UsernameText">([^<]+)<\/span>/i) || html.match(/aria-label="([^"]+)" class="Avatar/i);
      if (userMatch && userMatch[1]) {
        authorUsername = userMatch[1].trim();
        authorName = `@${authorUsername}`;
      }

      // Avatar
      const avatarMatch = html.match(/class="AvatarImage"[^>]+src="([^">]+)"/i);
      if (avatarMatch && avatarMatch[1]) {
        avatarUrl = cleanMediaUrl(avatarMatch[1]);
      }
    }
  } catch (err) {
    console.warn('Embed scrape failed:', err);
  }

  // STRATEGY 2: If no video yet, fetch open graph crawler page
  if (!videoUrl) {
    try {
      const pageUrl = `https://www.instagram.com/reel/${shortcode}/`;
      const crawlerResp = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        },
      });

      if (crawlerResp.ok) {
        const html = await crawlerResp.text();

        const ogVideoMatch = html.match(/<meta property="og:video(?::secure_url)?" content="([^">]+)"/i);
        if (ogVideoMatch && ogVideoMatch[1]) {
          videoUrl = cleanMediaUrl(ogVideoMatch[1]);
        }

        const ogImageMatch = html.match(/<meta property="og:image" content="([^">]+)"/i);
        if (ogImageMatch && ogImageMatch[1] && !thumbnailUrl) {
          thumbnailUrl = cleanMediaUrl(ogImageMatch[1]);
        }

        const ogDescMatch = html.match(/<meta property="og:description" content="([^">]+)"/i) || html.match(/<meta property="og:title" content="([^">]+)"/i);
        if (ogDescMatch && ogDescMatch[1] && !caption) {
          caption = cleanMediaUrl(ogDescMatch[1]);
        }
      }
    } catch (err) {
      console.warn('OG crawler scrape failed:', err);
    }
  }

  // STRATEGY 3: Instagram oEmbed for metadata enrichment
  try {
    const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=https://www.instagram.com/p/${shortcode}/`;
    const oembedResp = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    if (oembedResp.ok) {
      const oembedData = await oembedResp.json();
      if (oembedData.author_name && authorUsername === 'instagram_user') {
        authorUsername = oembedData.author_name;
        authorName = oembedData.author_name;
      }
      if (oembedData.title && !caption) {
        caption = oembedData.title;
      }
      if (oembedData.thumbnail_url && !thumbnailUrl) {
        thumbnailUrl = oembedData.thumbnail_url;
      }
    }
  } catch (err) {
    console.warn('oEmbed fetch error:', err);
  }

  // STRATEGY 4: If direct scraping had an Instagram rate-limit/login wall,
  // we check if a public CORS/mirror endpoint can resolve the media stream
  if (!videoUrl) {
    try {
      const fastEndpoints = [
        `https://api.vkrdownloader.com/server?vkr=${encodeURIComponent(originalUrl)}`,
        `https://instasave.click/api/v1/download?url=${encodeURIComponent(originalUrl)}`,
      ];

      for (const ep of fastEndpoints) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 4000);
          const res = await fetch(ep, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: controller.signal,
          });
          clearTimeout(timeout);
          if (res.ok) {
            const data = await res.json();
            if (data?.data?.video || data?.video_url || data?.url || data?.data?.[0]?.url) {
              videoUrl = data.data?.video || data.video_url || data.url || data.data[0].url;
              if (data?.data?.thumbnail && !thumbnailUrl) thumbnailUrl = data.data.thumbnail;
              break;
            }
          }
        } catch {
          // ignore mirror timeout
        }
      }
    } catch (err) {
      console.warn('Mirror API resolver error:', err);
    }
  }

  // If still no video found from Instagram (due to private account, age restriction or temporary IP block)
  if (!videoUrl) {
    throw new Error(
      'No se pudo extraer el video directamente. Verifica que la cuenta sea PÚBLICA (no privada) y que el enlace de Instagram sea válido.'
    );
  }

  const hashtags = extractHashtags(caption);
  const title = caption ? caption.slice(0, 100) + (caption.length > 100 ? '...' : '') : `Video de Instagram (@${authorUsername})`;

  return {
    id: `ig_${shortcode}`,
    shortcode,
    originalUrl,
    type: originalUrl.includes('/reel') ? 'reel' : 'video',
    title,
    caption: caption || 'Video de Instagram sin descripción.',
    hashtags,
    author: {
      username: authorUsername,
      name: authorName,
      avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorUsername)}&background=gradient&color=fff`,
      profileUrl: `https://www.instagram.com/${authorUsername}/`,
    },
    videoUrl,
    downloadUrl: `/api/instagram/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent('instagram_' + shortcode)}`,
    thumbnailUrl: thumbnailUrl || '',
    quality: '1080p HD MP4',
    likesCount: likesCount || 'Visible en Instagram',
    commentsCount: '',
    duration: 15,
    isAudioAvailable: true,
  };
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get sample demos
app.get('/api/instagram/samples', (req: Request, res: Response) => {
  const samples = DEMO_REELS.map((d) => ({
    ...d,
    downloadUrl: `/api/instagram/download?url=${encodeURIComponent(d.videoUrl)}&filename=${encodeURIComponent('instagram_reel_' + d.shortcode)}`,
  }));
  res.json({ success: true, samples });
});

// Info endpoint to analyze Instagram link
app.post('/api/instagram/info', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      res.status(400).json({ success: false, error: 'Por favor proporciona una URL válida de Instagram.' });
      return;
    }

    const parsed = extractInstagramShortcode(url);
    if (!parsed) {
      res.status(400).json({
        success: false,
        error: 'El enlace no parece ser un Reel, Post o Video válido de Instagram. Asegúrate de que tenga el formato: https://www.instagram.com/reel/XXXXX/ o https://www.instagram.com/p/XXXXX/',
      });
      return;
    }

    const data = await scrapeInstagramVideo(parsed.shortcode, url);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in /api/instagram/info:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar el video de Instagram. Asegúrate de que el contenido sea público.',
    });
  }
});

// Proxy download endpoint to bypass CORS and force file attachment download
app.get('/api/instagram/download', async (req: Request, res: Response) => {
  try {
    const mediaUrl = req.query.url as string;
    const rawFilename = (req.query.filename as string) || 'instagram_video';
    const cleanFilename = rawFilename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    if (!mediaUrl) {
      res.status(400).send('Falta el parámetro de URL del medio.');
      return;
    }

    const decodedUrl = decodeURIComponent(mediaUrl);

    const isInstagramCdn = decodedUrl.includes('cdninstagram.com') || decodedUrl.includes('fbcdn.net');
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': '*/*',
    };
    if (isInstagramCdn) {
      headers['Referer'] = 'https://www.instagram.com/';
    }

    // Fetch the remote video
    const mediaResponse = await fetch(decodedUrl, { headers });

    if (!mediaResponse.ok || !mediaResponse.body) {
      // If stream fails, redirect browser directly to CDN link
      res.redirect(decodedUrl);
      return;
    }

    const contentType = mediaResponse.headers.get('content-type') || 'video/mp4';
    const contentLength = mediaResponse.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}.mp4"`);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // Stream the body to client
    const reader = mediaResponse.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    };

    await pump();
  } catch (error: any) {
    console.error('Error downloading media proxy:', error);
    if (!res.headersSent) {
      // Fallback redirect if error occurred before sending headers
      const mediaUrl = req.query.url as string;
      if (mediaUrl) {
        res.redirect(decodeURIComponent(mediaUrl));
      } else {
        res.status(500).send('Error al descargar el archivo.');
      }
    }
  }
});

// Serve frontend with Vite in dev, or dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`InstaSave server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
