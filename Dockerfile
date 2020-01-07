FROM node:latest

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/ShangHai /etc/localtime # 经测试，不加这一行有时会不生效。或系统重启后也会恢复成UTC时间
RUN echo "Asia/Shanghai" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

# 创建工作目录
RUN mkdir -p /app
WORKDIR /app

# 安装项目依赖
# 这样可以利用 docker build cache
# @see https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#leverage-build-cache
COPY package.json .
RUN yarn --registry=https://registry.npm.taobao.org

# 复制剩余文件
COPY . .

# 编译源码
RUN yarn build

# 清除 devDependencies 依赖
RUN npm prune --production

EXPOSE 7001

CMD yarn docker
