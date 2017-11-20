# ネット関係各種

## グローバルIPアドレスの確認

	curl -s httpbin.org/ip | jq -r '.origin'

