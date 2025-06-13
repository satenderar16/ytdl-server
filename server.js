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
    const baseTitle = sanitizeFilename(info.videoDetails.title) || "audio";

    const audioStream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    ffmpeg.getAvailableEncoders((err, encoders) => {
      if (err) {
        console.error("Error checking encoders:", err);
        res.status(500).end("Internal error");
        return;
      }

      let codec = null;
      let format = null;
      let extension = null;
      let contentType = null;

      if (encoders["aac"]) {
        codec = "aac";
        format = "adts";
        extension = "aac";
        contentType = "audio/aac";
        console.log("Using AAC codec");
      } else if (encoders["libmp3lame"]) {
        codec = "libmp3lame";
        format = "mp3";
        extension = "mp3";
        contentType = "audio/mpeg";
        console.log("Using MP3 codec");
      } else {
        console.error("Neither AAC nor MP3 codec available");
        res.status(500).end("No supported audio codec available");
        return;
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${baseTitle}.${extension}"`
      );
      res.setHeader("Content-Type", contentType);

      ffmpeg(audioStream)
        .audioCodec(codec)
        .audioBitrate(512)
        .format(format)
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          res.status(500).end("Conversion error");
        })
        .pipe(res, { end: true });
    });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).send("Failed to download");
  }
});

const PORT = process.env.PORT || 45000;
app.listen(PORT, () => {
  console.log(`YTDL local server running at http://localhost:${PORT}`);
});
