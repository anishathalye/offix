Vagrant.configure(2) do |config|

  config.vm.box = 'debian/jessie64'

  # synced folder
  config.vm.synced_folder '.', '/offix', type: 'rsync',
    rsync__exclude: ['.git/', 'env/'],
    rsync__args: ['--verbose', '--archive', '-z', '--copy-links']

  # disable default synced folder
  config.vm.synced_folder '.', '/vagrant', disabled: true

  # port forward
  config.vm.network 'forwarded_port', guest: 3000, host: 3000

  # install packages
  config.vm.provision 'shell', inline: <<-EOS
    apt-get -y update

    apt-get install -y \
      build-essential libpcap-dev librabbitmq-dev \
      rabbitmq-server \
      mongodb

    wget -qO- https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-x64.tar.xz \
      | tar xJ -C /usr/local --strip=1
  EOS

end
