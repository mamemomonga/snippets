# MariaDB

[MariaDB repository configuration tool](https://downloads.mariadb.org/mariadb/repositories/)

## インストール

### リポジトリ設定

MariaDB 10.1 Debian 8 Jessie

	#-- { "wrap":"sudo bash -xeu" }
	apt-get install -y software-properties-common
	apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 0xcbcb082a1bb943db
	add-apt-repository 'deb [arch=amd64,i386,ppc64el] http://ftp.yz.yamagata-u.ac.jp/pub/dbms/mariadb/repo/10.1/debian jessie main'

MariaDB 10.1 Ubuntu 16.04 LTS xenial

	#-- { "wrap":"sudo bash -xeu" }
	apt-get install -y software-properties-common
	apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
	add-apt-repository 'deb [arch=amd64,i386,ppc64el] http://ftp.yz.yamagata-u.ac.jp/pub/dbms/mariadb/repo/10.1/ubuntu xenial main'

インストール

	#-- { "wrap":"sudo bash -xeu" }
	export DEBIAN_FRONTEND=noninteractive
	apt-get update
	apt-get -q -y install mariadb-server

## MySQLのルートパスワードを自動設定する

ランダムなパスワードを生成し、それをMySQL rootパスワードとして設定する。また、UNIX rootユーザの場合パスワードレスでログインできるように、/root/.my.cnfにパスワードを保存する。

	#-- {"wrap":"sudo bash -xeu"}
	MYSQLPASSWORD=$(perl -e 'my @chars; for(my $i=0;$i<$ARGV[1];$i++) { push @chars,substr($ARGV[0],int(rand()*length($ARGV[0])),1) }; print join("",@chars);' 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789-_().!' 32)
	mysqladmin password "$MYSQLPASSWORD"
	echo '[client]' > /root/.my.cnf
	echo 'user=root' >> /root/.my.cnf
	echo "password=$MYSQLPASSWORD" >> /root/.my.cnf
	chmod 600 /root/.my.cnf

### rootでログイン

rootでログインする

	sudo su -
	mysql

.my.cnfを指定する

	sudo mysql --defaults-extra-file=/root/.my.cnf

初回設定以降 sudo mysql のみでOK

	sudo ln -s /root/.my.cnf ~/.my.cnf
	sudo mysql

