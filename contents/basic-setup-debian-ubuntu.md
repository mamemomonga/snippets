# Debian, Ubuntu ベーシックセットアップ

* Debian 10.x (buster)
* Ubuntu 18.04 LTS (Bionic Beaver)

スニペット

	#-- { "wrap":"sudo bash -xeu" }
	#!/bin/bash
	set -eu
	
	# Build Essentialをインストールする
	INSTALL_BUILD_ESSENTIAL=1
	
	# Dockerをインストールする
	INSTALL_DOCKER=2
	
	if [ "$(id -u)" != 0 ]; then
		echo "Please Run as root"
		exit 1
	fi
	
	# 新しいホスト名
	NEW_HOSTNAME=${1:-}
	
	# EC2で動作しているか
	IS_RUN_EC2=0
	if [ -f /sys/hypervisor/uuid ] && [ $(head -c 3 /sys/hypervisor/uuid) == ec2 ]; then IS_RUN_EC2=1; fi
	
	# VMwareで動作しているか
	IS_RUN_VMW=0
	if [ -f /sys/class/dmi/id/sys_vendor ] && [ $(head -c 6 /sys/class/dmi/id/sys_vendor) == VMwarw ]; then IS_RUN_VMW=1; fi
	
	# 起動完了まで待機する
	if [ -d /var/lib/cloud ]; then
		until [ -f /var/lib/cloud/instance/boot-finished ]; do
			sleep 1
		done
	fi
	
	echo "*** START $0 ***"
	if [ -n "${NEW_HOSTNAME:-}" ]; then
		echo "*** NEW_HOSTNAME: $NEW_HOSTNAME ***"
	fi
	
	if [ $IS_RUN_EC2 == 1 ]; then
		echo "*** RUNNING ON EC2 ***"
	fi
	
	if [ $IS_RUN_VMW == 1 ]; then
		echo "*** RUNNING ON VMware ***"
	fi
	
	export DEBIAN_FRONTEND=noninteractive
	apt-get update
	apt-get -y install \
		tzdata \
		git \
		curl \
	   	wget \
		vim \
		ntp \
	   	postfix \
		jq \
		sudo \
		dnsutils
	
	if [ $INSTALL_BUILD_ESSENTIAL ]; then
		apt-get -y install build-essential
	fi
	
	rm /etc/localtime
	ln -s /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
	echo 'Asia/Tokyo' > /etc/timezone
	date
	
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
	set fileencodings=utf-8,cp932,euc-jp,iso-2022-jp,ucs2le,ucs-2
	set fenc=utf-8
	set enc=utf-8
	EOS
	
	update-alternatives --set editor /usr/bin/vim.basic
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
	
	if [ $IS_RUN_EC2 == 1 ]; then
		cat >> /etc/ntp.conf << 'EOS'
	server 0.amazon.pool.ntp.org iburst
	server 1.amazon.pool.ntp.org iburst
	server 2.amazon.pool.ntp.org iburst
	server 3.amazon.pool.ntp.org iburst
	EOS
	else
		cat >> /etc/ntp.conf << 'EOS'
	server ntp1.jst.mfeed.ad.jp iburst
	server ntp2.jst.mfeed.ad.jp iburst
	server ntp3.jst.mfeed.ad.jp iburst
	EOS
	fi
	
	service ntp restart
	sleep 10
	ntpq -p
	sed -i.bak -e 's/^\(inet_protocols = all\)/#\1/' /etc/postfix/main.cf
	echo 'inet_protocols = ipv4' >> /etc/postfix/main.cf
	service postfix restart
	
	if [ -n "${NEW_HOSTNAME:-}" ]; then
		if [ -e /usr/bin/hostnamectl ]; then
			hostnamectl set-hostname $NEW_HOSTNAME
			if [ -e /etc/cloud/templates/hosts.debian.tmpl ]; then
				echo "127.0.0.2 $NEW_HOSTNAME" >> /etc/cloud/templates/hosts.debian.tmpl
			fi
		fi
	fi
	
	if [ $INSTALL_DOCKER == 1 ]; then
		curl https://get.docker.com/ | sh
	fi
	
	if [ $IS_RUN_VMW == 1 ]; then
	    apt-get install -y open-vm-tools
	fi
	
	echo "*** FINISH $0 ***"

