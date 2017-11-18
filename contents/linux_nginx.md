# nginx

https://nginx.org/en/

### Ubuntu

インストール

	#-- {"wrap":"sudo bash -eux"}
	. /etc/lsb-release
	cat >> /etc/apt/sources.list << EOT
	# nginx
	deb http://nginx.org/packages/ubuntu/ $DISTRIB_CODENAME nginx
	deb-src http://nginx.org/packages/ubuntu/ $DISTRIB_CODENAME nginx
	EOT
	EOS

セットアップ

	#-- {}
	$ wget https://nginx.org/keys/nginx_signing.key
	$ sudo apt-key add nginx_signing.key

	$ sudo apt update
	$ sudo apt install nginx

