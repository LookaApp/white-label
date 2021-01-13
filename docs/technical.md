---
layout: default
title: Technical Description
nav_order: 30
---

# Technical Description

This section gives a more in depth technical walkthrough of how the white label works, and how to integrate it into your app. We're constantly adding to this documentation so if something is not sufficiently covered please let us know via github or email.

If you prefer code to words and want to get the white label running, then please skip straight to the tutorial which gives you everything you need to get the white label running on your computer.

We're going to describe what integrating the white label entails. This section will complement the tutorial which shows you how to integrate the white label.

### Concepts

For the purpose of this documentation there’s three pieces we’ll refer to.

**Hosting App (HA)** - This is your app! Your users will access the white label through your app. This means that they’ll never have to leave your domain and can have a cohesive experience that increases the value of your brand in their eyes. The Hosting App loads the white label logo maker. The hosting app is responsible for its own user auth and for payment processing (if you’re selling logos).

**Hosting App Service (HAS)** - This is a backend service hosted on your servers. It can be configured as part of your current backend service or as a standalone function. The purpose of the hosting app service is to store your unique app shared secret and use it to fetch authentication tokens from our White Label Service (see below), and to signal to our White Label Service when purchases have been made.

**White Label Configuration (WLC)** - this is a JSON object that describes how the white label should be customized so that it looks just the way you’d like. You can specify your logo, brand colors,  URLs for routing customers back to your app, among other things. We’ll set up your configuration with you after you’ve registered. This is when we’ll configure your unique shared secret.

**White Label Service (WLS)** - this is a backend service that we provide so that you can authenticate your users with us, and to indicate to us when logos have been purchased or downloaded. You cannot communicate with the WLS through a client side app, it must be through a backend service or serverless function.

**White Label App (WLA)** - this is the white label logo maker with your custom configuration loaded into it.

### White label integration

To integrate the white label into your app. Follow these steps:

1. At the point in HA where the user will enter the white label, make a call to HAS fetching an auth token and identity token for the white label. This call should include a unique identifier for the user entering the white label. It could be a userId or a sessionId.
2. Your HAS will use its shared secret and ID to call our WLS and request an auth token. If the secret and ID are correct we'll return an auth token and an identity token for the white label.
3. Redirect your user to the WLA app URL. By deafult it is `http://wl.looka.com?authToken=${authToken}&identityToken=${identityToken}` however on configuration we can route it to a subdomain of yours.
4. The user then uses the white label logo maker to their hearts content. When they're happy and ready to purchase, they click the "buy" button in the top right of the logo editor. This text can be customized. They're then redirected back to HA where they can purchase through HA or process the transaction otherwise. WLA will pass the logoID back to HA on clicking this button.
5. HA then makes a call to HAS that a logo has been purchased and includes the logoId and a payment reference. HAS requests WLS, and WLS records the purchase on our end, and then generates the assets for the purchased logo.
6. WLS returns a URL to HAS which HAS passes to HA. The URL gives the user access to their logo assets.
7. HA users can go back to WLA anytime to edit their logo.


### What's next?
* You can try out the tutorial to get it running on your local machine. Most users get it up and running in less than 10 minutes.
* The FAQ section goes over some additional background.
* Contact us partnerhips@looka.com with any questions or open an issue on github.


