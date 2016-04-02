---
layout: post
title: mac pro + esxi 6.0
subtitle: Running esxi 6.0 on a mac pro 6,1
---

Apple supports virtualization of OSX on [apple hardware](https://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=1000131).


While the installation of esxi onto the mac pro went off without a hitch, getting OSX installed in a VM proved to be tougher than the KB articles led to believe.

### Install ESXi
Install esxi 6.0 as you normally would - there were no "gotchyas" in this process.

### Install OSX in a VM

This process is documented in a [VMware KB article](http://partnerweb.vmware.com/GOSIG/MacOSX_10_11.html#installation1). However, I found a few vital steps to be missing.

How I got OSX installed in a VM:

#### 1. Download OSX
Get the image from the app store.

#### 2. Convert installer to a bootable image
Recent versions of OSX are no longer bootable by default, but apple provides a [method](https://support.apple.com/en-us/HT201372) to still accomplish that. Write the image to a flashdrive of 8GB or larger.

#### 3. Create an OSX VM
Create a VM with a type of OSX 10.10. The default disk type will be IDE and there is no way to change this through the creation wizard.

After you have created the VM, edit the settings, delete the disk and create a new disk of type SCSI. **This step is very important.** Until I changed the disk type to SCSI, both disk utility and the installer would fail to find the disks. Disk utility would constantly spin.

Plug your bootable flash drive into the mac pro. Add a new USB device to the VM and select the flash drive with the bootable image.

#### 4. Boot the VM and install OSX
Before you begin the actual installation process, you must fire up disk utility and partition the virtual hard disk with a GUID partition table.

Proceed through the OSX installation process as normal, selecting your virtual hard disk as the install target.
