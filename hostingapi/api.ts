import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import session, { Session } from "koa-session";
import koaServe from "koa-static-server";
import cors from "@koa/cors";
import fetch from "node-fetch";
import { createClient } from "redis";
import { promisify } from "util";

const app = new Koa();
app.keys = ["newest secret key"];
const router = new Router();

const redisClient = createClient();

// eslint-disable-next-line @typescript-eslint/unbound-method
const getAsync = promisify(redisClient.get).bind(redisClient);
// eslint-disable-next-line @typescript-eslint/unbound-method
const setAsync = promisify(redisClient.set).bind(redisClient);

const memoryStore = {
  /**
   * get session object by key
   */
  get: async (key: string): Promise<unknown> => {
    return JSON.parse(await getAsync(key));
  },

  /**
   * set session object for key, with a maxAge (in ms)
   */
  set: (key: string, sess: Partial<Session> & { _expire?: number; _maxAge?: number }): void => {
    setAsync(key, JSON.stringify(sess));
  },

  /**
   * destroy session for key
   */
  destroy: (key: string): void => { },
};

app.use(session({ store: memoryStore }, app));
// Use bodyparser middleware to parse JSON request
app.use(bodyParser());
app.use(cors());
app.use(async (ctx, next) => {
  ctx.session.save();
  await next();
});

const appSecret = "ru9Eigea sahr2Noh jo7AeGho phaeTai2 iew0Shee aXee4ahc Pheek6oo iQu1eefi";

// eslint-disable-next-line @typescript-eslint/require-await
router.get("/getWhiteLabelAuth", async (ctx) => {
  const sessionId = ctx.session._sessCtx.externalKey as string;
  console.log("Session: ", sessionId)

  const { authToken, identityToken } = await fetch("https://whitelabel.dev.looka.com/authToken", {
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

// Use Koa Router middleware
app.use(router.routes()).use(router.allowedMethods());

app.use(
  koaServe({
    maxage: 60000,
    rootDir: `${__dirname}/../hostingapp/dist`,
    notFoundFile: "index.html",
  }),
);

// Finally, start the server
app.listen(4000, function () {
  console.log("Server started on localhost:4000");
});
