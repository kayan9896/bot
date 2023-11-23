FROM python:3.10

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt
//RUN pip install -r requirements2.txt
CMD ["python", "-u", "server.py"]
