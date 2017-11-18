# nginx

https://nginx.org/en/

# Ubuntuへのインストール

リポジトリの設定

	#-- {"wrap":"sudo bash -eux"}
	. /etc/lsb-release
	cat >> /etc/apt/sources.list << EOT
	# nginx
	deb http://nginx.org/packages/ubuntu/ $DISTRIB_CODENAME nginx
	deb-src http://nginx.org/packages/ubuntu/ $DISTRIB_CODENAME nginx
	EOT
	EOS

インストール

	#-- {"wrap":"sudo bash -eux"}
	wget https://nginx.org/keys/nginx_signing.key
	apt-key add nginx_signing.key
	apt-get -y update
	apt-get -y install nginx

# nginx.conf

## nginxでIP制限とBasic認証を併用する

IP制限のルールにマッチしない場合はBASIC認証を行う

	#-- {"language":"nginx"}
	http {
		get $access_allowed {
			default disable;
			127.0.0.1 allow;
			192.168.0.0/24 allow;	
		}
	
		# IP制限のみ
		server {
			listen       80;
			server_name  _;
	
			if ($access_allowed = "disable") { return 403; }
	
			location / {
				proxy_set_header Host            $http_host;
				proxy_set_header X-Real-IP       $remote_addr;
				proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
				# proxy_set_header X-Forwarded-Proto 'https';
				proxy_pass http://127.0.0.1:8001;
			}
		}
	
		# IP制限とBASIC認証
		server {
			listen       80;
			server_name  _;
	
			set $realm off;
			if ( $access_allowed = "disable" ) {
			    set $realm "Restricted";
			}
			auth_basic $realm;
			auth_basic_user_file /etc/nginx/htpasswd;
	
			location / {
				proxy_set_header Host            $http_host;
				proxy_set_header X-Real-IP       $remote_addr;
				proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
				# proxy_set_header X-Forwarded-Proto 'https';
				proxy_pass http://127.0.0.1:8001;
			}
		}
	}

htpasswdは debian系ならば apache2-utils にある

	htpasswd -c /etc/nginx/htpasswd [USERNAME]


