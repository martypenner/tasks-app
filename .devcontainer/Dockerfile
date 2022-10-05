FROM node:16-alpine

# Let scripts know we're running in Docker (useful for containerized development)
ENV RUNNING_IN_DOCKER true

RUN apk add --no-cache git openssh-client zsh

# Set up ZSH as the unprivileged user (we just need to start it; it'll initialize our setup itself)
USER node
# set up oh my zsh
RUN cd "$HOME" && wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh && sh install.sh
# initialize ZSH
RUN /bin/zsh "$HOME/.zshrc"
