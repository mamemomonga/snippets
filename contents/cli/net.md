# ネットワーク関連

## [Google Public DNS](https://developers.google.com/speed/public-dns/)

その1

	8.8.8.8

その2

	8.8.4.4

## dig DNSの情報取得

google.com 正引き

	dig google.com

google.com 正引き 短く出力

	dig google.com +short

google.com 正引き DNSサーバは8.8.8.8参照

	dig @8.8.8.8 google.com

google.com 逆引き

	dig -x 8.8.8.8

正引き逆引きだけなら getent hosts (Linux)

	getent hosts google.com
	getent hosts 8.8.8.8

## whois

google.com の情報取得

	whois google.com

8.8.8.8 の情報取得

	whois 8.8.8.8

## ipcalc

192.168.0.0/24 の有効なIPアドレスの数、Netmaskなどを計算

	ipcalc 192.168.0.0/24

192.168.0.0/255.255.255.0 の有効なIPアドレスの数、Netmaskなどを計算

	ipcalc 192.168.0.0/255.255.255.0

## nmap

192.168.0.0/24の端末一覧

	nmap -sP 192.168.0.0/24

192.168.0.0/24の端末ポートスキャンとOSの推測

	sudo nmap -O -sS 192.168.0.0/24

## グローバルIPアドレスの確認

	curl -s httpbin.org/ip | jq -r '.origin'


