# Mastodon: ポスト

## 縦書きポスト
	
[要 toot コマンド](https://github.com/ihabunek/toot)

	#-- {"placeholder":"TATEGAKI"}
	echo "TATEGAKI" | perl -CSAD -MEncode -E '$_=<>; chomp; say join("",reverse map qq{echo "$_" | toot post\n},split(//,$_))' | sh

