# curl

## ダウンロード

### 標準出力へ出力

	curl https://www.google.com/robots.txt

### 規定のファイル名へ出力

	curl -O https://www.google.com/robots.txt

### ファイル名を指定して出力

	curl -o google-robots.txt https://www.google.com/robots.txt

## ヘッダの確認

* [curlでヘッダを見る方法いろいろ](http://qiita.com/takc923/items/1b508bb370c78b7a9d44)

### verbose

verboseな情報はSTDERRに出力される

	curl --verbose https://gist.github.com/
	curl --verbose https://gist.github.com/ 1> /dev/null

#### include

	curl --include https://gist.github.com/

### dump-header
--dump-header FILENAME

	curl --dump-header - https://gist.github.com/

### trace
--trace FILENAME

	curl --trace - https://gist.github.com/
	curl --trace-ascii - https://gist.github.com/

## さまざまなメソッドでの接続

### GET/POST/PUT/DELETE

-X オプションでメソッド名 GET/POST/PUT/DELETE を指定すればよい

	curl -X PUT -d 'example[foo]=bar' -d 'example[jane]=doe' http://example.com/api/1/example/1.json

* [cURL で GET/POST/PUT/DELETE](http://www.cocoalife.net/2010/11/post_859.html)


### HEAD

	curl --head https://gist.github.com/

### POST

#### フォーム
	curl -F "name1=value1" -F "name2=value2" http://yourdomain/execute.script

	curl -F "name1=value1" -F "name2=value2" -F "profile_icon=@path/to/file.png" -F "zip_file=@path/to/zipfile.zip" http://yourdomain/execute.script

#### JSONをBODYにいれてPOST

	curl -v \
	  -H 'Accept: application/json' \
	  -H 'Content-type: application/json' \
	  -X POST \
	  -d '{"key1":"value1"}' \
	  https://endpoint/

* [curlコマンドから HTTP POST する方法](http://qiita.com/letsspeak/items/8c7266742371699ab45e)

# BASIC認証

	curl --basic --user user:password http://hostname/

# SSL/TLS

### 証明書を検証しない

	curl --insecure https://gist.github.com/

# ヘッダの変更

### User-Agent書き換え
-A, --user-agent

### Referer書き換え
-e, --referer

### 追加リクエストヘッダ
-H, --header

	curl -H "X-First-Name: Joe" http://192.168.0.1/


