# よく使うOpenSSLのコマンド例

# 自己署名証明書の作成

サーバーキーの作成

	#-- {"wrap":"bash -xeu"}
	openssl genrsa 2048 > self-signed.key

自己署名キー

	#-- {"wrap":"bash -xeu"}
	openssl req -new -x509 -days 3650 -key self-signed.key -out self-signed.crt \
	 -subj "/CN=example.com/C=JP/ST=Kyoto/L=Kyoto/O=SnakeOil Japan LTD./OU=Web Section"

CSRと自己署名キー

	#-- {"wrap":"bash -xeu"}
	openssl req -new -key server.key -out server.csr \
	 -subj "/CN=example.com/C=JP/ST=Kyoto/L=Kyoto/O=SnakeOil Japan LTD./OU=Web Section"
	openssl x509 -days 3650 -req -signkey server.key < server.csr > server.crt

## snakeoil証明書

	#-- {"wrap":"bash -xeu"}
	sudo make-ssl-cert generate-default-snakeoil --force-overwrite

以下のファイルが現在のホストをCommon Nameとして再生成される

	/etc/ssl/private/ssl-cert-snakeoil.key
	/etc/ssl/certs/ssl-cert-snakeoil.pem

# 確認

## 証明書の内容確認

	#-- {"wrap":"bash -xeu"}
	openssl x509 -noout -text -in ssl.crt/server.crt

## 秘密鍵の内容確認

	#-- {"wrap":"bash -xeu"}
	openssl rsa -noout -text -in ssl.key/server.key

## リクエストの内容確認

	#-- {"wrap":"bash -xeu"}
	openssl req -noout -text -in ssl.csr/server.csr

# 秘密鍵のパスワード削除

	#-- {"wrap":"bash -xeu"}
	openssl rsa -in server.key -out server.key

# dhparamの生成

	#-- {"wrap":"bash -xeu"}
	openssl dhparam -out dhparam.pem 2048
	
# SSL/TLS client program

## SSL接続の確認

	#-- {"wrap":"bash -xeu"}
	echo -n | openssl s_client -connect www.google.com:443 

## 証明書の確認

	#-- {"wrap":"bash -xeu"}
	echo -n | openssl s_client -showcerts -connect www.google.com:443

## Signature Algorithmの確認

	#-- {"wrap":"bash -xeu"}
	openssl s_client -connect www.google.com:443 < /dev/null 2>/dev/null \
	| openssl x509 -text -in /dev/stdin | grep "Signature Algorithm"

# ランダムな値を生成

Base64(A–Z,a–z,0–9,+,/,=)

	#-- {"wrap":"bash -xeu"}
	openssl rand -base64 32

HEX

	#-- {"wrap":"bash -xeu"}
	openssl rand -hex 48

パスワード最適化

	#-- {"wrap":"bash -xeu"}
	openssl rand -base64 64 | perl -E 'local $/; $_=<>; s#\n#_#g;s#/#.#g;s#/#!#g; for my $c(1..16) { print substr($_,$c,1_) }; say ""'

# SSLSCANを使う
http://sourceforge.net/projects/sslscan/

HTTPS

	#-- {"wrap":"bash -xeu"}
	sslscan --no-failed www.google.com:443

POP3S(StartTLS)

	#-- {"wrap":"bash -xeu"}
	sslscan --starttls --no-failed pop.gmail.com:110

POP3S

	#-- {"wrap":"bash -xeu"}
	sslscan --no-failed pop.gmail.com:995

SMTPS

	#-- {"wrap":"bash -xeu"}
	sslscan --starttls --no-failed smtp.gmail.com:25

SMTPS(Submission Port)

	#-- {"wrap":"bash -xeu"}
	sslscan --starttls --no-failed smtp.gmail.com:587

SMTPS

	#-- {"wrap":"bash -xeu"}
	sslscan --no-failed smtp.gmail.com:465

# 証明書の検証サイト

[Qualys SSL Labs SSL Server Test](https://www.ssllabs.com/ssltest/)

