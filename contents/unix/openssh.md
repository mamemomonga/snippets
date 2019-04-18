# OpenSSH

# ProxyCommand

OpenSSH単独で踏台サーバ経由で接続する方法では一番便利

項目   | 内容
-------|---------
gwuser    | ゲートウェイユーザ
gwhost    | ゲートウェイホスト
svuser    | サーバユーザ
svhost    | サーバホスト
thehost   | ホスト

## ワンライナー

-W オプションを使う方法

	ssh -o "ProxyCommand ssh gwuser@gwhost -W %h:%p 2> /dev/null" svuser@svhost

netcatを使う方法

	ssh -o "ProxyCommand ssh gwuser@gwhost nc %h %p 2> /dev/null" svuser@svhost

## configを利用する方法

~/.ssh/config

	Host thehost
		ProxyCommand ssh ssh gwuser@gwhost -W %h:%p 2> /dev/null
		HostName svhost
		User svuser

コマンド

	ssh thehost

# ssh-agent

	$ exec ssh-agent $SHELL
	$ ssh-add

# キーペア

## キーの作成

デフォルトの保存先(~/.ssh/)

	$ ssh-keygen -t ed25519

カレントディレクトリに作成、コメント付き

	$ ssh-keygen -t ed25519 -f ./id_ed25519 -C 'MyNewKey'

