const express = require("express");
const ytdl = require("@distube/ytdl-core");
const cors = require("cors");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
app.use(cors());

function sanitizeFilename(name) {
  return name
    .replace(/[\/\\?%*:|"<>]/g, "-") // Replace illegal filename chars
    .replace(/[\r\n]+/g, "") // Remove line breaks
    .replace(/[^\x00-\x7F]/g, "") // Strip non-ASCII characters
    .trim();
}
app.get("/", (req, res) => {
  res.send("home");
});

app.get("/download", async (req, res) => {
  const { url } = req.query;

  if (!ytdl.validateURL(url)) {
    return res.status(400).send("Invalid YouTube URL");
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = sanitizeFilename(info.videoDetails.title) || "audio";

    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);
    res.setHeader("Content-Type", "audio/mpeg");

    const audioStream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    ffmpeg(audioStream)
      .audioBitrate(192)
      .format("mp3")
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        res.status(500).end("Conversion error");
      })
      .pipe(res, { end: true });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).send("Failed to download");
  }
});

const PORT = process.env.PORT || 45000;
app.listen(PORT, () => {
  console.log(`YTDL local server running at http://localhost:${PORT}`);
});
