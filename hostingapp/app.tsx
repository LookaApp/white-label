import { Fragment, h, render } from "preact";
import Router, { Route } from "preact-router";
import "preact/devtools";
import { useCallback, useEffect, useState } from "preact/hooks";

const PurchasePage = ({ logoId }: { logoId: string }) => {
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);
  const purchase = useCallback((e) => {
    void fetch(`http://localhost:4000/purchaseLogo/${logoId}`, { method: "post" }).then((res) => {
      if (res.status === 200) {
        void res.json().then(({ authToken, identityToken, redirectTo }) => {
          setRedirectTo(`${redirectTo}?authToken=${authToken}&identityToken=${identityToken}`);
        });
      }
    });
  }, []);

  return (
    <Fragment>
      <h1>Purchase</h1>
      <form method="post" action="">
        <button onClick={purchase} type="button">
          Buy and continue
        </button>

        {redirectTo ? <a href={redirectTo}>Back to your logos</a> : null}
      </form>
    </Fragment>
  );
};

const WhiteLabelAccess = () => {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [identityToken, setIdentityToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    void fetch("http://localhost:4000/getWhiteLabelAuth").then((res) => {
      if (res.status === 200) {
        void res.json().then((token) => {
          setAuthToken(token.authToken);
          setIdentityToken(token.identityToken);
        });
      }
    });
  }, []);

  return (
    <Fragment>
      <h1>Hosting App</h1>
      {authToken ? (
        <a href={`http://wl.looka.com?authToken=${authToken}&identityToken=${identityToken}`}>
          <button>Go to logo maker</button>
        </a>
      ) : null}
    </Fragment>
  );
};

const App = () => {
  return (
    <Router>
      <Route component={PurchasePage} path="/purchase/:logoId" />
      <Route component={WhiteLabelAccess} default path="/" />
    </Router>
  );
};

render(<App />, document.body);
