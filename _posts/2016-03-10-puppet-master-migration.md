---
layout: post
title: Puppet Master Migration
subtitle: Migrating puppet master to a new server
---

If you run puppet with a master and you live in a world where you frequently redeploy your infrastructure, at some point you likely will need to redeploy your master.

### First
  Build your new puppet master server and bring it online with your latest puppet code.

### Secondly
Deploy code on the old puppet master to get them to *cleanly* convert to your new master. It's important that this code is only deployed on the existing master, and not the new master.

Our goal is the accomplish:

- Clear certificates on puppet node
- Update `/etc/hosts` file to point agent to new puppet master


{% highlight puppet %} 
# point agent to new puppet master
host { 'puppet.example.com':
  ensure => present,
  ip     => '1.2.3.4'
}

# remove certs 
file {'ssl_cleanup':
  ensure  => absent,
  path    => '/var/lib/puppet/ssl',
  recurse => true,
  purge   => true,
  force   => true,
}
{% endhighlight %}

It will take two puppet runs for your nodes to converge and connect to your new master.

On the first puppet run, the agent will clear its certs, preparing itself to receive the new masters certs. By updating the hosts file, the agent will contact the new master on the second run. This approach is assuming that the puppet masters CNAMES will remain the same. If they aren't, you can accomplish the same results by updating the `puppet.conf` file with the new CNAME of the new master.

Once all of the agent nodes have connected to the new master, you should complete the conversion by updating DNS to point the puppet CNAME to the A Record of the new master and remove the `/etc/hosts` entry used during the conversion:

{% highlight puppet %} 
# point agent to new puppet master
host { 'puppet.example.com':
  ensure => abset,
  ip     => '1.2.3.4'
}
{% endhighlight %}


### Finally
Shutdown the old puppet master.
