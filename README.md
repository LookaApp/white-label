# White label Demo App 

This contains of two simple applications
* a fake host front-end
* a fake host API

To test it, run `npm run dev`. 

PROVIDE A DEFAULT REDIS-SERVER! It will be needed to store the user sessions.

Just start `redis-server` without options in a console. That is all required.

The host application will run on localhost:4000. 


## Test

Start the application and open `http://localhost:4000`.

You will see a button if the hosting api was able to fetch a token from the white label service.

Click on the button and you will launch the white-label-app. It loads a basic configuration using the authToken.
The whitelabel will verify the authToken with the white-label-service. You will see a message from the configuration in case this works.

Run through the logo-maker and create a logo. Perform a purchase. You will directed back to the hosting app, perform a purchase and you will be able to return to the white-label-app.
