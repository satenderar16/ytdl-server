# YTDL Server – YouTube Downloader (Node.js + Docker)

This is a simple Node.js server to download YouTube videos using `ffmpeg`, packaged in a Docker container. No Node.js or `ffmpeg` setup needed – just Docker!

## What You'll Get

- A web or API service to download videos or audio from YouTube
- Runs locally in one command
- No need to install Node.js or `ffmpeg` on your machine

---

##  Requirements

-  [Docker installed](https://www.docker.com/products/docker-desktop)

---

##  Quick Start

### 1. Download the code

Clone this repository (or download the ZIP):

```bash
git clone https://github.com/satenderar16/ytdl-server.git
cd ytdl-server

### Build docker image

Docker build -t ytdl-server .

### Run the server on localhost

docker run -d -p 45000:45000 —name ytdl ytdl-server
