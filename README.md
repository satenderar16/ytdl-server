git clone https://github.com/satenderar16/ytdl-server.git && \
cd ytdl-server && \
docker build -t ytdl-server . && \
docker run -d -p 45000:45000 --name ytdl ytdl-server
