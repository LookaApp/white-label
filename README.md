# White label authorization 

This contains of four very basic applications
* a fake host front-end
* a fake host API

To test it, run `npm run dev`. 

PROVIDE AN DEFAULT REDIS-SERVER! It will be needed to store the user sessions.
During development it would be very nerving to loose all sessions on every code change. So I use redis.

Just start `redis-server` without options in a console. That is all required.

The host application will run on localhost:4000. 


## Test

Start the application and open `http://localhost:4000`.

You will see a button if the hosting api was able to fetch a token from the white label service.

Click on the button and you will launch the white label application. It loads a basic configuration using the authToken.
The whitelabel will verify the authToken with the whitelabelservice. You will see a message from the configuration in case this works.


Run through the logo-maker and create a logo. Perform a purchase. You will directed back to the hosting app, perform a purchase and will be able to return to the white-label-app.
