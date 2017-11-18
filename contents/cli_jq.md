# jq

JSONのデータを表示・加工できます。

https://stedolan.github.io/jq/manual/

## 値の追加

	echo '{"hoge":"moge"}' > data1.json && cat data1.json
	cat data1.json | jq '.+{"tada":"dada"}' > data2.json && cat data2.json
	cat data2.json | jq 'del(.hoge)' > data3.json && cat data3.json

