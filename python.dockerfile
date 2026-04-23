FROM python:3.12.3

# RUN apt-get update -qq && \
#   apt-get upgrade -y -qq && \
#   apt-get install --no-install-recommends -y \
#   build-essential nodejs npm && \
#   npm install --global yarn

WORKDIR /home
COPY requirements.txt .
RUN pip install -r requirements.txt

RUN echo "alias ll='ls -AFoqv --color --group-directories-first'" >> ~/.bashrc

CMD [ "python", "./server.py" ]