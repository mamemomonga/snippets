# Linux: Debian Jessie(8.x), Ubuntu xenial(14.04) の設定

## ホスト名変更

ホスト名を「THE_NEW_HOSTNAME」に設定して再起動

	#-- { "wrap":"sudo bash -xeu","placeholder":"THE_NEW_HOSTNAME" }
	NEW_HOSTNAME="THE_NEW_HOSTNAME"
	echo "$NEW_HOSTNAME" > /etc/hostname
	echo "127.0.0.1 localhost $NEW_HOSTNAME" > /tmp/hosts
	sed -e '1d' /etc/hosts >> /tmp/hosts
	cat /tmp/hosts > /etc/hosts
	rm /tmp/hosts
	reboot

## ローカルタイムを日本時間にする

	#-- { "wrap":"sudo bash -xeu" }
	rm /etc/localtime
	ln -s /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
	echo 'Asia/Tokyo' > /etc/timezone
	date

## ロケールが日本語だったら英語にする

	#-- { "wrap":"sudo bash -xeu" }
	if [ "$LANG" = "ja_JP.UTF-8" ]; then
		sed -i '/^# en_US.UTF-8 UTF-8/s/^# //' /etc/locale.gen
		locale-gen
		update-locale LANG=en_US.UTF-8
	fi

## update, git, curl, wget

	#-- { "wrap":"sudo bash -xeu" }
	export DEBIAN_FRONTEND=noninteractive
	apt-get update
	apt-get -y upgrade
	apt-get install -y git-core curl wget

## build-essential

	sudo sh -c 'DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential'

## vim

	#-- { "wrap":"sudo bash -xeu" }
	DEBIAN_FRONTEND=noninteractive apt-get install -y vim
	cat > /etc/vim/vimrc.local << 'EOS'
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
	EOS
	sudo sh -c "echo '3' | update-alternatives --config editor"

## NTP

インストールと基本設定

	#-- { "wrap":"sudo bash -xeu" }
	DEBIAN_FRONTEND=noninteractive apt-get install -y ntp
	mv /etc/ntp.conf /etc/ntp.conf.orig

	cat > /etc/ntp.conf << 'EOS'
	driftfile /var/lib/ntp/drift
	statistics loopstats peerstats clockstats
	filegen loopstats file loopstats type day enable
	filegen peerstats file peerstats type day enable
	filegen clockstats file clockstats type day enable
	
	restrict -4 default kod notrap nomodify nopeer noquery
	restrict -6 default kod nomodify notrap nopeer noquery
	restrict 127.0.0.1 
	restrict ::1
	EOS

参照先: 日本国内の場合

	#-- { "wrap":"sudo bash -xeu" }
	cat >> /etc/ntp.conf << 'EOS'
	server ntp1.jst.mfeed.ad.jp iburst
	server ntp2.jst.mfeed.ad.jp iburst
	server ntp3.jst.mfeed.ad.jp iburst
	EOS

参照先: AmazonEC2の場合

	#-- { "wrap":"sudo bash -xeu" }
	cat >> /etc/ntp.conf << 'EOS'
	server 0.amazon.pool.ntp.org iburst
	server 1.amazon.pool.ntp.org iburst
	server 2.amazon.pool.ntp.org iburst
	server 3.amazon.pool.ntp.org iburst
	EOS

ntpd再起動と動作確認

	#-- { "wrap":"sudo bash -xeu" }
	service ntp restart
	sleep 10
	ntpq -p


## postfix

	#-- { "wrap":"sudo bash -xeu" }
	DEBIAN_FRONTEND=noninteractive apt-get install -y postfix
	sed -i.bak -e 's/^\(inet_protocols = all\)/#\1/' /etc/postfix/main.cf
	echo 'inet_protocols = ipv4' >> /etc/postfix/main.cf
	service postfix restart


## ユーザの追加とsudoユーザ

パスワードなしでsudoできるユーザを作成する

rootで実行する

	#-- { "wrap":"bash -xeu","placeholder":"ubuntu" }
	NEW_USER=ubuntu
	NEW_ID=1001
	export DEBIAN_FRONTEND=noninteractive

	groupadd -g $NEW_ID $NEW_USER
	useradd -g $NEW_ID -u $NEW_ID -m -s /bin/bash $NEW_USER

	apt-get install -y sudo
	cat > /etc/sudoers.d/wheel_user << EOS
	$NEW_USER ALL=(ALL) NOPASSWD:ALL
	EOS
	chmod 600 /etc/sudoers.d/wheel_user
