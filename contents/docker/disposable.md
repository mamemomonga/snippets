# さくっとDocker

いますぐLinuxを使いたい、ログアウトしたらもういらない。そういうときに便利です。

--rm オプションがあると、シェルから抜けるとそのコンテナを削除します。

## 素のLinuxディストリビューションのシェルに入る

[Debian Jessie](https://hub.docker.com/_/debian/)

	docker run -it --rm debian:jessie bash

[Ubuntu Xenial](https://hub.docker.com/_/ubuntu/)

	docker run -it --rm ubuntu:xenial bash

[Alpine Linux](https://hub.docker.com/_/alpine/)

	docker run -it --rm alpine:latest sh

[CentOS 6](https://hub.docker.com/_/centos/)

	docker run -it --rm centos:6 bash 

## さまざまな言語の実行環境

カレントディレクトリを コンテナ内部の /app にマウントして、そこを作業ディレクトリとしたシェルに入る

[Perl 5](https://hub.docker.com/_/perl/)

	docker run -it --rm -v $(pwd):/app -w /app perl:5 bash

[Python 3.6](https://hub.docker.com/_/python/)

	docker run -it --rm -v $(pwd):/app -w /app python:3.6 bash

[node.js 8](https://hub.docker.com/_/node/)

	docker run -it --rm -v $(pwd):/app -w /app node:8 bash


