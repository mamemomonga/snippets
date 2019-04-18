# tmux.conf

	#-- { "wrap":"cat > ~/.tmux.conf" }
	# --------------------------
	# 画面
	# --------------------------
	
	## 256色端末の使用
	set -g default-terminal "screen-256color"
	set -g terminal-overrides 'xterm:colors=256'
	
	## 色:ステータスバー
	set -g status-fg white
	#set -g status-bg black
	set -g status-bg "#000066"
	
	# ステータスラインの設定 
	set-window-option -g window-status-format "#I:#W"
	set-window-option -g window-status-current-format "#[fg=colour255,bg=colour27,bold] #I:#W #[default]"
	
	## 色:ウィンドウリスト
	setw -g window-status-fg cyan
	setw -g window-status-bg default
	setw -g window-status-attr dim
	
	## 色:アクティブウィンドウ
	setw -g window-status-current-fg   white
	# setw -g window-status-current-bg   red
	setw -g window-status-current-bg   "#0000FF"
	setw -g window-status-current-attr bright
	
	## 色:ペインボーダー
	set -g pane-border-fg green
	set -g pane-border-bg black
	
	## 色:アクティブペイン
	set -g pane-active-border-fg white
	set -g pane-active-border-bg yellow
	
	## 色:コマンドライン
	set -g message-fg  white
	set -g message-bg  black
	set -g message-attr bright
	
	# ステータスバーを設定する
	## 左パネルを設定する
	set -g status-left-length 40
	set -g status-left "#[fg=green]Session: #S #[fg=yellow]#I #[fg=cyan]#P "
	
	## 右パネルを設定する
	# set -g status-right "#[fg=cyan][%Y-%m-%d(%a) %H:%M] #[fg=colour255,bg=colour75] #H "
	
	## ステータスバーのUTF-8サポート
	# set -g status-utf8 on
	
	## リフレッシュ間隔(デフォルト 15秒)
	set -g status-interval 30
	
	## ウィンドウリストの位置
	set -g status-justify left
	
	## ヴィジュアルノーティフィケーション
	setw -g monitor-activity on
	set -g visual-activity on
	
	## ステータスバー位置
	set -g status-position top
	
	# ウィンドウ名が自動で変わらないようにする
	set-option -g allow-rename off
	
	# --------------------------
	# キーバインド
	# --------------------------

	# 新しいウィンドウを開いて縦割りにして一つ目のペインに戻る
	bind C new-window \; split-window -h \; select-pane -t :.0
	
	# 設定のリロード
	bind r source-file ~/.tmux.conf \; display-message "Reload Config!!"

	# vimのキーバインドでペインを移動する
	bind h select-pane -L
	bind j select-pane -D
	bind k select-pane -U
	bind l select-pane -R
	bind -r C-h select-window -t :-
	bind -r C-l select-window -t :+
	
	# vimのキーバインドでペインをリサイズする
	bind -r H resize-pane -L 5
	bind -r J resize-pane -D 5
	bind -r K resize-pane -U 5
	bind -r L resize-pane -R 5

	# コピーをvim風に設定する
	setw -g mode-keys vi

	# --------------------------
	# その他の設定
	# --------------------------
	# クリップボード共有 macOS + reattach-to-user-namespace
	# --------------------------

	# set-option -g default-command "reattach-to-user-namespace -l zsh"

	# コピーをvim風に設定する
	# bind-key -t vi-copy v begin-selection
	# bind-key -t vi-copy y copy-pipe "reattach-to-user-namespace pbcopy"
	# unbind -t vi-copy Enter
	# bind-key -t vi-copy Enter copy-pipe "reattach-to-user-namespace pbcopy"

	# マウス操作有効
	# setw -g mouse

## SSHで直接tmuxを起動する

	ssh -t user@host tmux

デタッチしていたら

	ssh -t user@host tmux a


