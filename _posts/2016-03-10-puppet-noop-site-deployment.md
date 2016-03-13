---
layout: post
title: Puppet noop for site rollouts
subtitle: Using noop mode for site deployments
---

It's quite common to use puppet [environments](https://docs.puppetlabs.com/puppet/latest/reference/environments.html) to control the rollout of puppet code through the environments of your infrastructure `dev, stg, prd`

You may also run a blue/green datacenter used to roll changes and validate in an offline site, only switching traffic once validation passes. 

If this is the case, its probably quite undesireable to blast out changes to both datacenters as soon as the code hits the `production` code branch. After all, doesn't that defeat the purpose of a blue/green model? 

You could accomplish this by correlating a puppet environment with a site ie: `production-blue` & `production-green`, but this isn't a pure use of environments and could potentially lead to drift between sites, even though they should be identical servers.

Likewise, for production servers, you could disable puppet from running as a daemon, and control rollouts by kicking the `puppet agent` on each server. While this would work, you lose some of the power of puppet ensuring your nodes remain in compliance with a known state.

Using puppets noop feature, we can utilize environments as they were intended, while rolling changes to a site when we are ready.

We can toggle noop for all resources in the catalog by setting defaults on resources:

#### site.pp
{% highlight puppet %} 
$noop = <some determining factor>

if $noop == true {
  notify { "site ${site} is set for noop mode.": }
  Package {noop => $noop}
  File {noop => $noop}
  Service {noop => $noop}
  Exec {noop => $noop}
  User {noop => $noop}
  Group {noop => $noop}
  Cron {noop => $noop}
}
{% endhighlight %}

Coupled with hiera, you may have a site hierarchy:

### hiera/site/blue.yaml
```
---
noop: true
```

### hiera/site/green.yaml
```
---
noop: false
```

With these hiera configurations and the above puppet code, when your new puppet code hits production, the blue site will run in `noop` mode (only reporting what would change), while the green site will apply the new code.

Of course, you don't need to use hiera to make this work, you just need a way to classify your servers into their respective site and be able to set the `$noop` variable based on some logic that fits into your architecture.
