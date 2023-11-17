# Use an official Golang runtime as a parent image
FROM golang:1.21


ENV GONOSUMDB=*
ENV GO111MODULE=on

# Set the working directory inside the container
WORKDIR /app
COPY go.mod go.sum /app/

RUN go mod download

# Install "air" for hot-reloading
RUN go install github.com/cosmtrek/air@latest

# Copy the local package files to the container's workspace
COPY . /app

# Update Go packages with go get
RUN go get -d -v

# Expose the port the application will run on
EXPOSE 3000

# Start the Go application with hot-reloading using "air"
CMD ["air", "run", "main.go"]