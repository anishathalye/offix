# Development

Development happens in the `develop` branch, while the latest stable version is
in the `master` branch.

## Setup

The easiest way to get started on hacking on OffiX is to use [Vagrant][vagrant]
and run everything inside a virtual machine.

Make sure you have [Vagrant][vagrant] installed on your machine.

To start the VM:

```bash
vagrant up
```

If you need to power off the VM at any point, run:

```bash
vagrant halt
```

To ssh into the VM:

```bash
vagrant ssh
```

**Note: the rest of the commands in this section are meant to be run _inside
the VM_, not on the host machine.**

The project directory gets synchronized to `/offix` inside the VM.

## Sniffer

The sniffer can't really be developed inside the VM because it depends on WiFi
hardware.

There are plans to add a testing mode to the sniffer so it will generate fake
data to aid in development of the web interface.

## Web Interface

Before running the OffiX web interface, set up the configuration and install
dependencies as follows:

```bash
cd /offix/offix-web
cp config.sample.js config.js # these are okay defaults for development
npm install
```

After this, you're ready to run OffiX:

```bash
npm start
```

Now, on your local machine, you should be able to navigate to
`http://localhost:3000/` and see OffiX running!

## Tips

* **While developing, you should keep `vagrant rsync-auto` running on the host
  machine so that whenever you change any files, they're automatically synced
  over to the VM.** When the app running in the VM detects changed files, it'll
  automatically restart (because of the debug flag).

* This project uses [EditorConfig][editorconfig].
  [Download][editorconfig-download] a plugin for your editor!

[vagrant]: https://www.vagrantup.com/
[editorconfig]: http://editorconfig.org/
[editorconfig-download]: http://editorconfig.org/#download
