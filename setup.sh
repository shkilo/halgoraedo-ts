#!/bin/bash
sudo amazon-linux-extras install docker -y
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo chmod 666 /var/run/docker.sock
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
sudo service docker start

cd /home/ec2-user/server
echo "
CLIENT_URL = $(aws --region=ap-northeast-2 ssm get-parameter --name 'CLIENT_URL' --query 'Parameter.Value')
DB_HOST = $(aws --region=ap-northeast-2 ssm get-parameter --name 'DB_HOST' --query 'Parameter.Value')
DB_PORT = $(aws --region=ap-northeast-2 ssm get-parameter --name 'DB_PORT' --query 'Parameter.Value')
DB_NAME = $(aws --region=ap-northeast-2 ssm get-parameter --name 'DB_NAME' --query 'Parameter.Value')
DB_PASSWORD = $(aws --region=ap-northeast-2 ssm get-parameter --name 'DB_PASSWORD' --query 'Parameter.Value')
DB_USER = $(aws --region=ap-northeast-2 ssm get-parameter --name 'DB_USER' --query 'Parameter.Value')
GOOGLE_CALLBACK_URL = $(aws --region=ap-northeast-2 ssm get-parameter --name 'GOOGLE_CALLBACK_URL' --query 'Parameter.Value')
GOOGLE_CLIENT_ID = $(aws --region=ap-northeast-2 ssm get-parameter --name 'GOOGLE_CLIENT_ID' --query 'Parameter.Value')
GOOGLE_CLIENT_SECRET = $(aws --region=ap-northeast-2 ssm get-parameter --name '	GOOGLE_CLIENT_SECRET' --query 'Parameter.Value')
JWT_SECRET = $(aws --region=ap-northeast-2 ssm get-parameter --name 'JWT_SECRET' --query 'Parameter.Value')
" >> .env