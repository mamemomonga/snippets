# Docker関連スニペット集

* [docker-alpine-sshd](https://github.com/mamemomonga/docker-alpine-sshd)
* [docker-container-rsync-demo](https://github.com/mamemomonga/docker-container-rsync-demo)
* [DockerHub mamemomonga](https://hub.docker.com/u/mamemomonga/)

## 便利なコマンド集

### TheContainerのIPアドレスを取得する

	#-- {"wrap":"bash -xeu"}
	docker inspect --format="{{ .NetworkSettings.IPAddress }}" TheContainer

### すべてのコンテナを削除

	#-- {"wrap":"bash -xeu"}
	docker ps -a | awk '{ print $1 }' | sed '1d' | xargs docker rm -f

### 終了したコンテナを削除

	#-- {"wrap":"bash -xeu"}
	docker ps -a | grep 'Exited' | awk '{ print $1 }' | xargs docker rm

### ダグのないイメージを削除

	#-- {"wrap":"bash -xeu"}
	docker images -f 'dangling=true' --format '{{ .ID }}' | xargs docker rmi

### bash: TheVolumeがなければNamed Volumeを作成する

	#-- {"wrap":"bash -xeu"}
	function create_docker_volume {
		local name=$1
		if [ -z "$( docker volume ls --filter "name=$name" --format '{{ .Name }}' )" ]; then
			echo "Creating Docker Volume: $name"
			docker volume create $name
		fi
	}
	create_docker_volume TheVolume

# コマンド

### run

busyboxのシェル起動、exitしたらコンテナを削除

	$ docker run -it --rm busybox sh
	
busyboxで1日スリープするコンテナをバックグラウンドで起動、hello.sh をローカルで作成し実行中のコンテナに送信しコンテナで起動、シェルに入り内容を確認したあとコンテナを終了して削除。

	$ cat > hello.sh << 'EOS'
	#!/bin/sh
	echo "Hello World!"
	EOS

	$ docker run -d --name 'test-busybox' busybox sleep 1d

	$ cat hello.sh | docker exec -i test-busybox sh -c 'cat > /hello.sh; chmod 755 /hello.sh'

	$ docker exec test-busybox /hello.sh
	Hello World!

	$ docker exec -it test-busybox sh
	/ # cat hello.sh
	#!/bin/sh
	echo "Hello World!"

	/ # exit

	$ docker stop test-busybox
	test-busybox

	$ docker rm test-busybox
	test-busybox

## イメージ

### build
カレントディレクトリのDockerfileから the-image イメージを作成する

	$ docker build --tag the-image .
	$ docker build -t the-image .

### images
イメージの一覧を表示する

	$ docker images

### rmi
imagename イメージを削除する

	$ docker rmi the-image

### save
イメージを圧縮しながらアーカイブに保存する

	$ docker save the-image | gzip -c -9 > the-image.tar.gz

### load
イメージを圧縮されたアーカイブから復元する

	$ cat the-image.tar.gz | gunzip -c -9 | docker load

## コンテナ

### run

the-image イメージから the-container コンテナを作成し、デーモンとして起動する

	$ docker run --name the-container --detach the-image
	$ docker run --name the-container -d the-image

the-image イメージから the-container コンテナを作成し、バックグラウンドで起動し、
起動する80/TCPをローカルホストの8000/TCPで公開し、/dataをカレントディレクトリのdataフォルダと共有する

	$ docker run -p 8000:80 -v $(pwd)/data:/data -d --name the-container the-image

### stop, start, rm

the-container 停止

	$ docker stop the-container

the-container 起動

	$ docker start the-container

the-container 削除

	$ docker rm the-container

## docker-machine

現在参照しているDOCKER\_HOSTのIPアドレスを取得する

	$ echo $DOCKER_HOST | sed -e 's/^tcp:\/\///' -e 's/:[0-9]*$//'

