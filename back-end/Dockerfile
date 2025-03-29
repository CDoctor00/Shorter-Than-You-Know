# Builder layer
FROM golang:1.23.5-alpine3.21 AS builder

# Create and change working directory
WORKDIR /app

# Retrieve application dependencies to use builder cache
COPY go.* ./
RUN go mod download

# Copy app code
COPY . ./

# Build binary
RUN CGO_ENABLED=0 go build -ldflags '-s -w -extldflags "-static"' -o backend /app/main.go

# Production layer
FROM alpine:3.21

# Update system image
RUN apk --update add ca-certificates && \
    rm -rf /var/cache/apk/*

# Add new user
RUN adduser -D appuser
USER appuser

# Copy binary from build stage
COPY --from=builder /app/backend /home/appuser/backend

WORKDIR /home/appuser
EXPOSE 10000
CMD [ "./backend" ]