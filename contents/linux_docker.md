# Docker

## セットアップ (Ubuntu 16.04.3 LTS)

* OverlayFS2 を使用する
* dockerデータを別ディスクに設定する

### Dockerのインストールとセットアップ

	#-- {"wrap":"sudo bash -eu"}
	wget https://get.docker.com -O - | sh
	systemctl stop docker
 
	CONFIGURATION_FILE=$(systemctl show --property=FragmentPath docker | cut -f2 -d=)
	echo "[CONFIGURATION_FILE] $CONFIGURATION_FILE"
	cp $CONFIGURATION_FILE /etc/systemd/system/docker.service

	perl -pi -e 's/^(ExecStart=.+)$/$1 -s overlay2/' /etc/systemd/system/docker.service
	systemctl daemon-reload
	systemctl start docker
	docker info 2>&1 | grep 'Storage Driver'

現在のユーザをdockerコマンドを実行できるようにする

	#-- {"wrap":"sudo bash -xeu"}
	usermod -a -G docker $USER

いったんログアウトする

### Docker Composeのインストール

[こちらで](https://docs.docker.com/compose/install/#install-compose) 最新版を確認する


	#-- {"wrap":"sudo bash -xeu"}
	curl -L https://github.com/docker/compose/releases/download/1.17.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
	chmod 755 /usr/local/bin/docker-compose

実行の確認

	docker-compose --version

### データを別ボリュームに置く
新しいディスクを追加する。/dev/xvdf(/dev/sdf)に割り当てるものとする

**割り当てドライブを十分に確認すること**

	#-- {"wrap":"sudo bash -xeu"}
	fdisk /dev/xvdf << 'EOS'
	n
	p
	1


	w
	q
	EOS

コピペする場合は先頭の $ は除去して一行づつ確認しながら実行

	$ sudo mkfs.ext4 /dev/xvdf1
	$ sudo mount /dev/xvdf1 /mnt
	$ sudo e2label /dev/xvdf1 docker
	$ sudo service docker stop
	$ sudo sh -c 'cp -a /var/lib/docker/* /mnt'
	$ sudo rm -rf /var/lib/docker
	$ sudo mkdir /var/lib/docker
	$ sudo sh -c 'echo "LABEL=docker /var/lib/docker ext4 defaults,discard 0 0" >> /etc/fstab'
	$ sudo mount -a

	$ ls /var/lib/docker
	$ sudo service docker start
	$ docker info


