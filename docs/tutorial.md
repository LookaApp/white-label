---
layout: default
title: Tutorial
nav_order: 40
---

#  Tutorial

This tutorial walks you through running the white label locally and how to integrate it in your app.

If you'd rather read about how the white label integration works, then check out the [technical description](./technical). 

### Getting started

Our white label demo app is hosted on [GitHub](https://github.com/LookaApp/white-label). To get started, clone the repo and follow the instructions in the README. You should have everything running locally in about 10 minutes. Click through the app, choose a logo, edit it, and click "buy" when you're happy.

The code is straightforward, so open up your favorite text editor and follow along in the code as you work through the app. The code consists of two main pieces.

* The **hosting app** (called HA in [technical description](./technical)). This loads the White Label App (WLA) and handles the purchase event. You'll find it in the folder hostingapp/.
* The **hosting app service** (called HAS in technical description). This makes authentication and purchase requests to the White Label Service (WLS). You'll find it in the folder hostingapi/.

Both of these can serve as models for your integration. You can implement these in any language you want and with almost any app framework. We're happy to provide guidance if you need it.


### Limitations of the white label demo app
This white label demo is meant to help you test out integrating the white label in your app. *It is not meant to be used in a production environment*. Please only use it to test integrations and demo internally. The demo white label logo maker only generates three different logos. If you'd like to see the full range of what you'll have access to after registering your white label, please go to our [logo maker](https://looka.com/onboarding) and check out our production app. The white label logo maker also only generates generic assets. We don't think these limitations will affect your ability to test and demo the logo maker in any way. If these do create an issue, please contact us and we'll help you sort it out. Thanks for your understanding.


### API docs
The HAS needs to implement two routes: /getWhiteLabelAuth and /purchaseLogo/:logoId

<div class="code-example" markdown="1">
```js
// GET /getWhiteLabelAuth
// PARAMS sessionId: string

// Example
router.get("/getWhiteLabelAuth", async (ctx) => {

  // Here we're using a sessionId for the unique user identifier.
  // In your app, you will likely use a userId.
  const sessionId = ctx.session._sessCtx.externalKey as string;

  const { authToken, identityToken } = await fetch(WHITE_LABEL_SERVICE_URL, {
    method: "post",
    body: JSON.stringify({
      hostingAppIdentifier: "cba.com",
      appSecret,
      sessionIdentifier: sessionId,
    }),
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    if (res.status === 200) {
      return res.json().then((obj) => {
        return obj.data as { authToken: string; identityToken: string };
      });
    } else {
      console.log(await res.json());
      ctx.throw("White label service refused to generate a token", 500);
    }
  });
  ctx.status = 200;
  ctx.body = { authToken, identityToken };
  ctx.session.authToken = authToken;
  ctx.session.identityToken = identityToken;
});
```
</div>
<div class="code-example" markdown="1">
```js
// POST /purchaseLogo/:logoId
// PARAMS logoId: string

// Example
router.post("/purchaseLogo/:logoId", async (ctx) => {
  const { logoId } = <{ logoId: string }>ctx.params;
  const { authToken, identityToken } = ctx.session as {
    authToken?: string;
    identityToken?: string;
  };

  if (!authToken || !identityToken) {
    ctx.throw(401);
  }

  if (!logoId) {
    ctx.throw(406);
  }

  await fetch(`https://whitelabel.dev.looka.com/purchase/${logoId}`, {
    method: "post",
    body: JSON.stringify({
      appSecret,
      paymentReference: Math.random().toString(36).slice(2),
      token: authToken,
    }),
    headers: { "Content-Type": "application/json" },
  }).then(
    async (res) => {
      if (res.status === 200) {
        const jsonResponse = await res.json();
        ctx.body = { authToken, identityToken, redirectTo: jsonResponse.data.redirectPath };
        ctx.status = 200;
      } else {
        console.log(await res.json());
        ctx.throw(res.status);
      }
    },
    (err) => {
      console.error({ whiteLabelServiceError: err });
      ctx.throw(500);
    },
  );
});


```
</div>


### What's next?

* [Contact us](mailto:partnerships@looka.com) to register your white label or talk about [plans and pricing](./pricing).
* We're always happy to receive feedback on our white label [GitHub page](https://github.com/LookaApp/white-label/issues).
* Look at the [FAQ](./faq) for more information


