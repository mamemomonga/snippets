# いろいろなスクリプト

## 時間と日付

詳しくは man strftime

2017-01-01 00:00:00

	date +'%Y-%m-%d %H:%M:%S'

170101_000000

	date +'%y%m%d_%H%M%S'

## ランダムなパスワード

32文字のパスワードを生成する

フォントによって違いがわかるにくい文字は除外してある。

	#-- {"wrap":"bash"}
	perl -E 'my @chars; for(my $i=0;$i<$ARGV[1];$i++) { push @chars,substr($ARGV[0],int(rand()*length($ARGV[0])),1) }; say join("",@chars);' 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789-_().!' 32

## ランダムなデータ

ランダムな長さのデータを生成する。以下の例だと8バイトのデータを16進数で表示し、16文字のデータが得られる。

	#-- {"wrap":"bash"}
	openssl rand -hex 8

## 標準入力から行毎に読み込む

	while read line; do
		echo "[$line]"
	done < "${1:-/dev/stdin}"

## カレントディレクトリでスペースの含まれているディレクトリ一覧を読み込む

	#-- {"wrap":"bash"}
	declare -a DIRS
	IFS='
	' DIRS=$( find . ! -path . -maxdepth 1 -type d )
	for i in $DIRS; do
		echo "[$i]"
	done


