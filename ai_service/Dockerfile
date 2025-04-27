FROM python:3.11 as builder

ENV PYTHONUNBUFFERED 1
ENV PATH="/py/bin:$PATH"

WORKDIR /app
EXPOSE 8000
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    gettext \
    libc-dev \
      build-essential \
      libpq-dev \
      libjpeg62-turbo-dev \
      zlib1g-dev \
      libffi-dev \
      libssl-dev && \
    apt-get remove -y build-essential && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp 


COPY ./src/requirements.txt /app
RUN /py/bin/pip install --no-cache-dir -r requirements.txt

COPY ./src /app
