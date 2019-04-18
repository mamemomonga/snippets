# MySQL/MariaDB

# クエリ

CRUD(CREATE,READ,UPDATE,DELETE)

	SELECT * FROM tbl_name;

	INSERT INTO tbl_name (col_name) VALUES (expr);

	UPDATE tbl_name SET col_name1=expr;

	CREATE TABLE tbl_name (col_name type);

# DB作成

データベース作成

	#-- {"placeholder":"db_name"}
	CREATE DATABASE db_name DEFAULT CHARACTER SET utf8mb4;

# ユーザの設定(GRANTS)

全権限付与

	GRANT ALL PRIVILEGES ON db_name.* TO user@'host' IDENTIFIED BY 'PASSWORD';

管理権限のあるユーザの登録

	GRANT ALL ON *.* TO admin@localhost IDENTIFIED BY 'PASSWORD' WITH GRANT OPTION;

特定DBのみの管理権限

	GRANT ALTER, CREATE, DELETE, DROP, INDEX, INSERT, SELECT, UPDATE, LOCK TABLES
	  ON db_name.* TO user_name@'192.168.0.%' IDENTIFIED BY 'PASSWORD';

WordPress

	GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER
	  ON db_name.* TO user_name@'192.168.0.%' IDENTIFIED BY 'PASSWORD';

一般的なWebアプリ

	GRANT SELECT, INSERT, DELETE, UPDATE
	  ON db_name.* TO user_name@'192.168.0.%' IDENTIFIED BY 'PASSWORD';

ユーザ一覧

	SELECT DISTINCT mu.user,mu.host,md.db
	 FROM mysql.user AS mu
	 LEFT JOIN mysql.db AS md
	 ON mu.user=md.user
	 ORDER by mu.user ASC;

ユーザ削除

	#-- {"placeholder":"USERNAME"}
	DELETE FROM mysql.db   WHERE user='USERNAME';
	DELETE FROM mysql.user WHERE user='USERNAME';
	FLUSH PRIVILEGES;

権限の確認

	SHOW GRANTS FOR user@host\G

# 設定

ランダムな文字列を含んだrootパスワードを設定する。

mysqlのrootユーザとrootパスワードをUNIX rootユーザの場合省略できるようにする

	#-- {"wrap":"sudo bash -eu"}	
	MYSQLPASSWORD="$(bash << 'END_OF_PERL'
	perl -e 'my @chars; for(my $i=0;$i<$ARGV[1];$i++) { push @chars,substr($ARGV[0],int(rand()*length($ARGV[0])),1) }; print join("",@chars);' 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789-_().!' 32
	END_OF_PERL
	)"
	mysqladmin password "$MYSQLPASSWORD"
	echo '[client]' > /root/.my.cnf
	echo 'user=root' >> /root/.my.cnf
	echo "password=$MYSQLPASSWORD" >> /root/.my.cnf
	chmod 600 /root/.my.cnf
	echo "GRANT ALL ON *.* TO root@'127.0.0.1' IDENTIFIED BY '$MYSQLPASSWORD' WITH GRANT OPTION;" | mysql

rootパスワードの更新

	SET PASSWORD FOR root@localhost=PASSWORD('NEW_PASSWORD');

システム変数の確認

	SHOW VARIABLES;

文字コードの確認

	SHOW VARIABLES LIKE 'character_%';

