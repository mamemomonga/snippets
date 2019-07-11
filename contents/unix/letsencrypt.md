# Let's Encryptとnginxの設定

nginxに手作業で Let's Encrypt を設定します。

Ubuntu 18.04 LTS

インストール

	#-- {"wrap":"bash -xeu"}
	sudo apt install certbot

ドメイン名の設定

	export LE_TARGET_DOMAIN=example.com

メールアドレスの設定

	export LE_EMAIL=name@domain.com


dhparamの作成

	#-- {"wrap":"bash -xeu"}
	sudo openssl dhparam -out /etc/nginx/dhparams.pem 4096


## DNS認証

証明書の作成・取得

	#-- {"wrap":"bash -xeu"}
	sudo ./certbot-auto certonly \
	  --debug \
	  --manual \
	  --agree-tos \
	  --manual-public-ip-logging-ok \
	  --preferred-challenges dns \
	  --email $LE_EMAIL \
	  --domain $LE_TARGET_DOMAIN  

* 画面表示に従って TXT レコードをDNSに追加する
* /etc/letsencrypt/live/$LE_TARGET_DOMAIN 以下に証明書が保存される

## Web認証

acme-challenge用の公開ディレクトリを用意する

	#-- {"wrap":"bash -xeu"}
	sudo mkdir -p -m 0755 /usr/local/certbot/var/$LE_TARGET_DOMAIN/webroot

nginxの設定

	#-- {"wrap":"bash -xeu"}
	sudo sh -c "cat > /etc/nginx/conf.d/$LE_TARGET_DOMAIN.conf" << EOS
	server {
	   listen               80;
	   server_name          $LE_TARGET_DOMAIN;
	   location /.well-known {
	        root /usr/local/certbot/var/$LE_TARGET_DOMAIN/webroot;
	   }
	}
	EOS


構文チェックと再起動

	#-- {"wrap":"bash -xeu"}
	sudo nginx -t
	sudo systemctl restart nginx


証明書の作成・取得

	#-- {"wrap":"bash -xeu"}
	sudo certbot certonly \
	  --webroot \
	  --webroot-path /usr/local/certbot/var/$LE_TARGET_DOMAIN/webroot \
	  --rsa-key-size 4096 \
	  --agree-tos \
	  -d $LE_TARGET_DOMAIN \
	  -m $LE_EMAIL

# 共通項目

nginxの設定

	#-- {"wrap":"bash -xeu"}
	sudo sh -c "perl -nle \"s/###TARGET_DOMAIN###/$LE_TARGET_DOMAIN/g; print\" > /etc/nginx/conf.d/$LE_TARGET_DOMAIN.conf" << 'EOS'
	server {
	   listen               80;
	   server_name          ###TARGET_DOMAIN###;
	   server_tokens        off;
	   location /.well-known {
	      root /usr/local/certbot/var/###TARGET_DOMAIN###/webroot;
	   }
	   location / { return 301 https://$host$request_uri; }
	}
	server {
	   listen                    443 ssl http2;
	   server_name               ###TARGET_DOMAIN###;
	   server_tokens             off;
	   
	   ssl                       on;
	   ssl_prefer_server_ciphers on;
	   ssl_session_cache         shared:SSL:10m;
	   ssl_session_timeout       10m;
	   ssl_protocols             TLSv1.2;
	   ssl_stapling              on;
	   ssl_ciphers               HIGH:!MEDIUM:!LOW:!aNULL:!NULL:!SHA;
	   
	   add_header Strict-Transport-Security "max-age=15768000";
	   ssl_certificate     /etc/letsencrypt/live/###TARGET_DOMAIN###/fullchain.pem;
	   ssl_certificate_key /etc/letsencrypt/live/###TARGET_DOMAIN###/privkey.pem;
	   ssl_dhparam         /etc/nginx/dhparams.pem;
	
	   location / {
	      # proxy_set_header Host                 $http_host;
	      # proxy_set_header X-Real-IP            $remote_addr;
	      # proxy_set_header X-Forwarded-For      $proxy_add_x_forwarded_for;
	      # proxy_set_header X-Forwarded-Proto    $scheme;
	      # proxy_set_header X-Forwarded-Protocol $scheme;
	      # proxy_pass http://192.168.1.1:80;
	      return 404;      
	   }
	}
	EOS

構文チェックと再起動

	#-- {"wrap":"bash -xeu"}
	sudo nginx -t
	sudo systemctl restart nginx

### 証明書の自動更新

証明書は90日で失効するので、月に一回自動更新仕掛けを作る。月のランダムな1日の3時の何分かに実行。

apt で導入した場合不要である。(/etc/cron.d/certbot が自動更新を行う)

	$ perl -e "printf('%02d %02d %02d * * root /usr/local/certbot/certbot-auto renew --force-renew && service nginx restart'.qq{\n},int(rand()*59),3,int(rand()*30)+1)" > /tmp/certbot

	$ cat /tmp/certbot
	28 03 12 * * root /usr/local/letsencrypt/certbot-auto renew --force-renew && service nginx restart

	$ sudo mv /tmp/certbot /etc/cron.d/
	$ sudo chown root:root /etc/cron.d/certbot
	$ sudo chmod 644 /etc/cron.d/certbot

### エラーが出る場合

	Creating virtual environment...
	
のあとにPythonのエラーが出る場合は、ロケールを変更して実行すればいいらしい。

	$ export LC_ALL="en_US.UTF-8"
	$ export LC_CTYPE="en_US.UTF-8"

https://github.com/certbot/certbot/issues/2883


