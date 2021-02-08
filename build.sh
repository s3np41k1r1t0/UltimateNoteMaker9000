docker build -t s3np41k1r1t0/ultimatenotemaker . && docker run -p 3000:3000 --volume=databases:/usr/src/app/databases -d s3np41k1r1t0/ultimatenotemaker && echo "Server running on port 3000"
