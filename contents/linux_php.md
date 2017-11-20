# PHP

* ソースからのビルド
* mod_php
* MariaDBのインストール
* memcached, APCu, ImageMagick

## MariaDB

[MariaDBのリポジトリを行う](./linux_mariadb.md)

インストール

	#-- {"wrap":"sudo bash -xeu" }
	export DEBIAN_FRONTEND=noninteractive
	apt-get update
	apt-get -q -y install mariadb-server mariadb-client libmariadbd-dev


## Aapche2.4と必要な関連ライブラリ

	#-- {"wrap":"sudo bash -xeu" }
	export DEBIAN_FRONTEND=noninteractive
	apt-get install -y \
		build-essential autoconf \
		apache2 apache2-dev libapache2-mod-rpaf \
		libxml2 libxml2-dev libssl-dev libcurl4-openssl-dev pkg-config \
		libbz2-dev libjpeg-dev libpng-dev libxpm-dev libfreetype6-dev libmcrypt-dev

## PHPのインストール

ダウンロード

	#-- {"wrap":"bash -eu","placeholder":"7.1" }
	PHP_VERSION="7.1"
	PHP_VERSION=$(curl -sL http://www.php.net/releases/feed.php | \
	perl -E 'while(<>) { if(m#<link rel="enclosure" title="PHP ([^"]+) \(tar\.xz\)" href="([^"]+)">#mg) { say "$1"} }' | \
	grep "$PHP_VERSION" )
	echo "PHP $PHP_VERSION"
	mkdir -p php
	curl -Lo php/php-$PHP_VERSION.tar.xz http://jp2.php.net/get/php-$PHP_VERSION.tar.xz/from/this/mirror
	
ディレクトリ移動して展開

	cd php
	tar Jxf php-*.tar.xz
	cd php-*

Configure ツール

	#-- {"wrap":"cat > ../configure.pl","language":"perl" }
	#!/usr/bin/env perl
	use feature 'say';
	use strict;
	use warnings;
	
	my @opt=(
		
		# [Apache 1.X]
		# 'with-apxs',
		
		# [Apache 2.X]
		'with-apxs2=/usr/bin/apxs',
	
		# 64bit
		'with-libdir=lib64',
		
		# php.d
		'with-config-file-scan-dir=/usr/local/etc/php.d',
		
		# [データベース]
		'with-mysqli=mysqlnd',
		'with-pdo-mysql',
		'enable-mysqlnd',
			
		# [マルチバイト]
		'enable-mbstring',
		'enable-mbregex',
	
		# [アーカイブ]		
		'with-zlib',
		'with-bz2',
		'enable-zip',
	
		# [いろいろ]
		'with-openssl',
		'with-pcre-regex',
		'with-mcrypt',
		'enable-bcmath', # 任意精度数学関数
		
		# [画像処理関連]
		'enable-exif',
		'with-jpeg-dir',
		'with-png-dir',
		'with-xpm-dir',
		'with-gd',
		'enable-gd-jis-conv',
		'enable-gd-native-ttf',
		'enable-exif',
		'with-freetype-dir=/usr/lib',
		
		# [ネットワーク]
		'enable-sockets',
		'enable-ftp',
		'with-curl',
		'with-openssl',
	
		# Zend OPcache
		'enable-opcache',
	);
	
	# OCP - Opcache Control Panel
	# https://gist.github.com/ck-on/4959032
	
	if(-d '/usr/local/icu48') {
		push @opt,'enable-intl';
		push @opt,'with-icu-dir=/usr/local/icu48'
	}
	
	say join(' ',('./configure',map {"--$_"} @opt));

configureの実行

	perl ../configure.pl | sh

build

	#-- {"wrap":"bash -xeu" }
	NUMCPUS=$(grep -c '^processor' /proc/cpuinfo)
	make -j $NUMCPUS

test

	#-- {"wrap":"bash -xeu" }
	NUMCPUS=$(grep -c '^processor' /proc/cpuinfo)
	echo s | make -j $NUMCPUS test

install

	#-- {"wrap":"sudo bash -xeu" }
	make install
	mkdir -p /usr/local/etc/php.d


上階層に移動

	cd ..

01_global.ini

	#-- {"wrap":"sudo sh -c 'cat > /usr/local/etc/php.d/01_global.ini'" }
	[PHP]
	expose_php             = off
	short_open_tag         = off
	
	memory_limit           = 256M
	
	file_uploads           = On
	max_file_uploads       = 20
	post_max_size          = 20M
	upload_max_filesize    = 10M
	
	display_errors         = On
	display_startup_errors = On
	html_errors            = On
	log_errors             = On
	report_memleaks        = On
	error_reporting        = E_ALL
	
	error_log     = /var/log/php/error.log
	sendmail_path = /usr/sbin/sendmail -t -i
	
	[Date]
	date.timezone = Asia/Tokyo

02_opcache.ini

	#-- {"wrap":"sudo sh -c 'cat > /usr/local/etc/php.d/02_opcache.ini'" }
	[PHP]
	zend_extension=opcache.so
	
	[opcache]
	opcache.memory_consumption=128
	opcache.interned_strings_buffer=8
	opcache.max_accelerated_files=4000
	opcache.revalidate_freq=60
	opcache.fast_shutdown=1
	opcache.enable_cli=0

## Apache設定

	#-- {"wrap":"sudo bash -xeu" }
	mkdir -p /var/log/php
	chown www-data:www-data /var/log/php
	
	sed -i.bak \
	  -e 's/^ServerTokens OS/#ServerTokens OS/' \
	  -e 's/^#ServerTokens Minimal/ServerTokens Minimal/' \
	  -e 's/^ServerSignature On/#ServerSignature On/' \
	  -e 's/^#ServerSignature Off/ServerSignature Off/' \
	  /etc/apache2/conf-available/security.conf
	
	cat >> /etc/apache2/conf-available/security.conf << 'EOL'
	<DirectoryMatch "/\.svn">
	   Require all denied
	</DirectoryMatch>
	EOL


サイト設定

	#-- {"wrap":"sudo sh -c 'cat > /etc/apache2/sites-available/site.conf'" }
	<VirtualHost *:80>
	ServerAdmin webmaster@localhost
	
	<Directory /home/web/public>
	    Options       -Indexes +FollowSymLinks
	    AllowOverride All
	    Require       all granted
	</Directory>
	DocumentRoot /home/web/public
	
	LogLevel debug
	ErrorLog  ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
	
	SetEnvIf X-Forwarded-Protocol "^https$" HTTPS=on
	
	<FilesMatch \.php$>
	    SetHandler application/x-httpd-php
	</FilesMatch>
	
	AddType        text/html   .php
	DirectoryIndex index.php index.html
	
	</VirtualHost>

Webユーザの追加

	#-- {"wrap":"sudo bash -xeu" }
	useradd -m -s /bin/bash web
	gpasswd -a web adm
	chmod 755 /home/web

デフォルトのページ作成 (確認後 index.php を忘れず削除)

	#-- {"wrap":"sudo -u web bash -xeu" }
	mkdir -p /home/web/public
	echo '<?php phpinfo() ?>' > /home/web/public/index.php
	mkdir -p /home/web/logs
	ln -s /var/log/apache2 /home/web/logs/apache2

### memcached for php7

	#-- {"wrap":"sudo bash -xeu" }
	apt-get install -y libmemcached-dev
	cd /usr/local/src/php
	git clone -b php7 --depth=1 https://github.com/php-memcached-dev/php-memcached
	cd php-memcached
	phpize
	./configure
	make
	echo s | make test
	make install

03_memcached.ini

	#-- {"wrap":"sudo sh -c 'cat > /usr/local/etc/php.d/03_memcached.ini'" }
	[PHP]
	extension=memcached.so
	
	[Session]
	session.save_handler = files
	# session.save_handler = memcached
	# session.save_path = "localhost:11211"
	
	[memcached]
	memcached.sess_locking = On
	
	memcached.sess_lock_wait_min = 1000;
	memcached.sess_lock_wait_max = 2000;
	memcached.sess_lock_retries = 5;
	memcached.sess_lock_expire = 0;
	memcached.sess_prefix = "memc.sess.key."
	memcached.sess_persistent = Off
	memcached.sess_consistent_hash = On
	memcached.sess_remove_failed_servers = Off
	memcached.sess_number_of_replicas = 0
	memcached.sess_binary_protocol = On
	memcached.sess_randomize_replica_read = Off
	memcached.sess_connect_timeout = 1000
	memcached.sess_sasl_username = NULL
	memcached.sess_sasl_password = NULL
	memcached.compression_type = "fastlz"
	memcached.compression_factor = "1.3"
	memcached.compression_threshold = 2000
	memcached.serializer = "igbinary"
	memcached.store_retry_count = 2
	memcached.default_consistent_hash = Off
	memcached.default_binary_protocol = Off
	memcached.default_connect_timeout = 0

### APCu

	#-- {"wrap":"sudo bash -xeu" }
	echo 'no' | pecl install APCu

04_apcu.ini

	#-- {"wrap":"sudo sh -c 'cat > /usr/local/etc/php.d/04_apcu.ini'" }
	[PHP]
	extension=apcu.so
	
	[apc]
	apc.shm_size=32M
	apc.enable_cli=Off

### ImageMagick

	#-- {"wrap":"sudo bash -xeu" }
	export DEBIAN_FRONTEND=noninteractive
	apt-get install -y imagemagick libmagick++-dev
	echo 'autodetect' | pecl install imagick

05_imagick.ini

	#-- {"wrap":"sudo sh -c 'cat > /usr/local/etc/php.d/05_imagick.ini'" }
	[PHP]
	extension=imagick.so


### サイトの設定とApache再起動

	#-- {"wrap":"sudo bash -xeu" }
	a2dismod mpm_event
	a2enmod mpm_prefork
	a2enmod rpaf
	a2dissite 000-default
	a2ensite site
	service apache2 restart


