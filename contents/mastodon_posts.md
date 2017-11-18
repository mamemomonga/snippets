# Mastodon: ポスト

## 縦書きポスト
	
[tootコマンドが必要](https://github.com/ihabunek/toot)

	# {"placeholder":"TATEGAKI"}
	echo "TATEGAKI" | perl -MEncode -E '$_=<>; chomp; say encode_utf8(join("",reverse map qq{echo "$_" | toot post\n},split(//,decode_utf8($_))))' | sh


