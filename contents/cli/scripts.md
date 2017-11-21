# いろいろなスクリプト

## 時間と日付

詳しくは man strftime

2017-01-01 00:00:00

	date +'%Y-%m-%d %H:%M:%S'

170101_000000

	date +'%y%m%d_%H%M%S'

## ランダムなパスワードの生成

	#-- {"wrap":"bash"}
	perl -e 'my @chars; for(my $i=0;$i<$ARGV[1];$i++) { push @chars,substr($ARGV[0],int(rand()*length($ARGV[0])),1) }; print join("",@chars);' 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789-_().!' 32

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

## グローバルIPアドレスの確認

	curl -s httpbin.org/ip | jq -r '.origin'


