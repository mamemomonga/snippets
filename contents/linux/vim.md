# vim

シンプルな設定

	#-- { "wrap":"cat > .vimrc" }
	syntax on
	set wildmenu
	set history=100
	set number
	set scrolloff=5
	set autowrite
	set tabstop=4
	set shiftwidth=4
	set softtabstop=0
	set termencoding=utf-8
	set encoding=utf-8
	set fileencodings=iso-2022-jp,utf-8,cp932,euc-jp,ucs2le,ucs-2
	set fenc=utf-8
	set enc=utf-8

gvimrc

	#-- { "wrap":"cat > .gvimrc" }
	set iminsert=0
	set imsearch=-1
	set lines=70
	set columns=140

	" Mac
	if has('gui_macvim')
		set guifont=Source\ Code\ Pro:h12
		set showtabline=2
		set guioptions-=T
		map <silent> gt :tabnext<CR>
		map <silent> gT :tabprev<CR>
		map <silent> <C-e> :tabclose<CR>
	endif

	" Windows gvimの場合
	" gvimrcをcp932で保存してください
	if has("gui_win32")
		set guifont=ＭＳ_ゴシック:h10
	"	set noantialias
		:colorscheme darkblue
	endif

Windows gvim用(cygwin)

	cd $(cygpath -u "$USERPROFILE")

.vimrc, .gvimrc ファイルを作成

	#-- { "wrap":"bash -xeu" }
	cd $(cygpath -u "$USERPROFILE")
	iconv -f utf8 -t cp932 > _vimrc < .vimrc
	iconv -f utf8 -t cp932 > _gvimrc < .gvimrc
	rm .vimrc .gvimrc

