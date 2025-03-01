
export HOMEBREW_PIP_INDEX_URL=http://mirrors.aliyun.com/pypi/simple #ckbrew
export HOMEBREW_API_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles/api #ckbrew
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles #ckbrew
eval $(/opt/homebrew/bin/brew shellenv) #ckbrew
export HOMEBREW_NO_AUTO_UPDATE=true #禁止自动更新

export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

#bin
export PATH="$HOME/.bin:$PATH"

#flutter
export DEV_HOME=/Volumes/US100-FAT/Dev
export GRADLE_USER_HOME=$DEV_HOME/gradle
export FLUTTER_HOME=$DEV_HOME/flutter
export FLUTTER_DEVELOPMENT_TOOLS=$DEV_HOME/.flutter-devtools
export DART_TOOL_DIR=$DEV_HOME/.dart-tool
export DART_SERVER_CACHE_DIR=$DEV_HOME/.dartServer
export PUB_HOSTED_URL=https://mirrors.tuna.tsinghua.edu.cn/dart-pub;
export FLUTTER_STORAGE_BASE_URL=https://mirrors.tuna.tsinghua.edu.cn/flutter
export PATH="$FLUTTER_HOME/bin:$PATH"
#sdk
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH #jdk
export ANDROID_SDK_ROOT="$DEV_HOME/android_sdk"
export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH" #cmd
export PATH="$ANDROID_SDK_ROOT/platform-tools:$PATH" #adb
#go
export GOPATH=$HOME/.go
export PATH=$PATH:$GOPATH/bin
export GOPROXY=https://goproxy.cn