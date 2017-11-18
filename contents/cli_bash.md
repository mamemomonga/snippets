# bash メモ
Bourne Shell系で使えるシェルスクリプトチートブック

## bashオプション
	set -eu

	bash -eu script.sh

* -e コマンドが0以外のステータスで終了した場合，一部の場合を除いて即座に終了する
* -u 未定義の変数を参照するとエラー・メッセージを表示する
* -x 実行内容を表示
* -n 文法チェックのみ行う
* -v コマンドを実行する前に入力行を表示する
* -o オプション -o pipefail パイプが失敗したとき停止する

-u オプションを使用する場合、未定義変数を正しく処理するため、${1:-}とするとよい。
$1が空なら空のままであるという意味。

## bashの変数

パラメータ変数

| 書式     | 内容　|
|----------|-------|
| $0       | スクリプト名                                           |
| $$       | プロセスID                                             |
| $#       | パラメータ数                                           |
| $1,$2... | パラメータ                                             |
| $*       | $IFSで分割された全パラメータ                           |
| $@       | スペースで区切られたパラメータ                         |
| $?       | 最後に実行したフォアグラウンドコマンドの終了ステータス |
| $!       | 最後に実行したバックグラウンドコマンドのプロセスID     |
| $-       | 現在のbashのオプションフラグ                           |

変数展開

| 書式                        | 内容                                                  |
|-----------------------------|-------------------------------------------------------|
| ${変数名:-文字列}           | 変数が未定義または空の場合 文字列に置換               |
| ${変数名:=文字列}           | 変数が未定義または空の場合 文字列に置換して変数に代入 |
| ${変数名:?}                 | 変数が未定義または空の場合 エラー                     |
| ${変数名:?エラーメッセージ} | 変数が未定義または空の場合 エラー                     |
| ${変数名:開始位置:[長さ]}   | 変数から文字列切り出し                                |
| ${#変数名}                  | 変数の文字数                                          |
| ${変数名#パターン}          | 変数の先頭がマッチした場合 最短マッチ部を削除         |
| ${変数名##パターン}         | 変数の先頭がマッチした場合 最長マッチ部を削除         |
| ${変数名%パターン}          | 変数の末尾がマッチした場合 最短マッチ部を削除         |
| ${変数名%%パターン}         | 変数の末尾がマッチした場合 最長マッチ部を削除         |

パターンとして使える文字は、* 任意の文字, ? 任意の一文字, [...] 括弧内のいずれか

## 最初の設定例

	#!/bin/bash
	set -euo pipefail
	shopt -s nullglob

	1行目: シバン(shebang)
	2行目: 
	   e 実行したコマンドの終了ステータスが0以外だったら終了
	   u 変数未定義だったら終了
	   o pipefail パイプの最後の終了ステータスが0以外だったら終了
	3行目: ファイル名のワイルドカード「*」を常に展開する

## ヒアドキュメントをつかって複数行のコードを実行

	bash -eu << 'EOS'
	echo 'Hello World!'
	EOS

sudo経由

	sudo bash -eu << 'EOS'
	whoami
	EOS

## 連番

seqを使う

	for i in $(seq 0 10); do
	  echo $i
	done

bash

	for i in {0..10}; do
	  echo $i
	done

## リスト

	THELIST="hello1 hello2 hello3"
	for i in $THELIST; do
	  echo "[$i]"
	done


	cat > thelist.txt << 'EOS'
	hello1
	hello2
	hello3
	EOS
	for i in $(cat thelist.txt); do
	  echo "[$i]"
	done
	rm thelist.txt

## 分岐

### case

	case 値 in
	  パターン1 ) 処理1 ;;
	  パターン2 ) 処理2 ;;
	  パターン3 ) 処理3 ;;
	  …
	  パターンn ) 処理n ;;
	esac

readと組み合わせた例

	while true; do
		read -n1 -p "処理を継続しますか [y/n]? " yn
		case $yn in
			[Yy]* ) echo; echo "継続"; break ;;
			[Nn]* ) echo; echo "終了"; exit  ;;
			*     ) echo; echo "yまたはnを入力してください" ;;
		esac
	done

### if

	if [ -n "$(uname | grep 'Darwin')" ]; then
	    echo "macOSです"
	elif [ -n "$(uname | grep 'Linux')" ]; then
	    echo "Linuxです"
	fi

### test

if の後にある [ が test コマンド

| 書式      | 内容　|
|-----------|-------|
| -f file   | ファイルがある
| -n string | 文字列が空ではない
| -z string | 文字列が空である
| s1 = s2   | s1とs2が同じ文字列である

詳しくは man test

## シェルスクリプト例

引数でコマンドを実行し、未定義コマンドの場合USAGEを表示

	#!/bin/bash
	set -euo pipefail
	
	action1() {
		echo "ACTION1"
		exit 0
	}
	
	action2() {
		echo "ACTION2"
		exit 0
	}
	
	usage() {
		echo "USAGE: $(basename $0) [ action1 | action2 ]"
		exit 1
	}
	
	case "${1:-}" in
		"action1" ) action1 ;;
		"action2" ) action2 ;;
		*         ) usage   ;;
	esac


## カレントディレクトリを得る

	${0%/*}

絶対パスでカレントディレクトリを得る

	BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

絶対パスで一階層上を得る

	BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

絶対パスで一階層上を取得(OSXは使えない)

	BASEDIR=$(readlink -f $(dirname "$0")/..)

絶対パスで一階層上を取得(Perlを使う)

	BASEDIR=$( perl -MCwd -MFile::Basename -e 'print Cwd::abs_path(dirname($ARGV[0])."/../")' $0)

## 1列目を取得

awkももっとも簡単な使用例。awkはオークと読むらしい

	cat hoge.txt | awk '{print $1}'

## nobodyユーザで実行したい

	#!/bin/bash
	set -eux
	run_user() {
	  whoami
	}
	run() {
	  local func=$(declare -f run_user)
	  sudo -u nobody bash -euxc "$func; run_user"
	}
	run

## スクリプトの読み込み

### 別のファイルを読み込む

	source ./script.sh

または

	. ./script.sh

変数 BASH_SOURCE には 読み込んだスクリプトのファイル名が入っている。

### 文字列をコードとして解釈する

	THECODE="echo 'Hello World'"
	eval $THECODE

## リダイレクトメモ

* 1: STDOUT
* 2: STDERR

使用例

	thescript > /dev/null 2>&1

| 書式     | 内容　|
|----------|-------|
| 2>&1        | STDERRをSTDOUTで出力 |
| 2>/dev/null | STDERRを出力しない   |
| 1>/dev/null | STDOUTを出力しない   |
| >/dev/null  | 1>/dev/null と同じ   |

### 画面出力と同時にファイルにも書き出す

* **\>( command_list )** はbashの機能で Process Substitution(プロセス置換)、command_listをファイル(名前付きパイプ)のように扱える。

例

	#!/bin/bash
	set -eu
	
	exec 1> >( tee hello.txt )
	exec 2>&1
	
	date +'%Y-%m-%d %H:%M:%S'
	echo "Hello World!"

## 時間と日付

	date +'%Y-%m-%d %H:%M:%S'
	date +'%y%m%d_%H%M%S'

man strftime


## ランダムなパスワードを生成する(Perlワンライナー)

	#!/bin/bash
	set -eu

	PASSWORD=$(perl -e 'my @chars; for(my $i=0;$i<$ARGV[1];$i++) { push @chars,substr($ARGV[0],int(rand()*length($ARGV[0])),1) }; print join("",@chars);' 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789-_().!' 32)

	echo "PASSWORD: $PASSWORD"

## 標準入力から行毎に読み込む

	while read line; do
		echo "[$line]"
	done < "${1:-/dev/stdin}"


