# Express JS Boiler Plate

This is a boilerplate for building web applications using the Express.js framework. It provides a structured and modular project template that can be used as a starting point for building web applications in Node.js.

## Getting Started

To get started, clone the repository and follow the below steps:

1. Rename the `.env.example` file to `.env` and modify the values of the environment variables as needed for your specific application.

2. Run the `npm install` command to install the necessary dependencies for the project.

3. Run the `npm run dev` command to start the development server.

4. To verify that the application is working correctly, navigate to the `/api/hello` endpoint in your web browser or using a tool like Postman. If the response from the server is a JSON object containing the message "Hello World", then the application is running correctly.

5. Once you have verified that the application is running correctly, you can create a new file in the routes directory to define a new API endpoint. To do this, import the router object from the `express.js` configuration file and define a new route using the `router.get()` method. For example:

```js
import { router } from "../config/express.js";

router.get("/new-route", (req, res, next) => {
    res.json({ message: "This is a new route" });
});

export default router;
```

This will define a new endpoint at `/api/new-route` that returns a JSON object containing the message "This is a new route".

## Directory Structure

The directory structure of the project has been designed with the aim of maintaining modularity and organization of the codebase. Below is a brief description of each directory:

-   `src/`
    -   `bootstrap/`: This directory comprises the code that is executed during the initialization of the application. It includes code that loads all the routes dynamically, sets the default middlewares.
    -   `config/`: This directory contains the configuration files for the application, such as the Express.js configuration file, database configuration, and other application-specific configurations.
    -   `controllers/`: This directory contains the controllers that handle the business logic of a particular route.
    -   `database/`: This directory contains the code related to database queries and schemas.
    -   `middlewares/`: This directory contains the middleware functions that are incorporated in the API request pipeline.
    -   `routes/`: This directory contains the route handlers for the API endpoints. Each file in this directory defines a set of routes and their corresponding handlers, thus encapsulating the application's API functionalities.
    -   `services`: The core business logic of any operation inside controller resides in this director.
    -   `utils/`: This directory comprises the utility functions that are used throughout the application.
    -   `validation/`: This directory contains the validation schemas that are employed for validating the incoming requests.
    -   `app.js`: This file initializes the Express.js server by importing the app instance from the config/express.js file. The start function is then called with the app instance as an argument to initialize the application. Finally, the listen method is called on the app instance with the specified port number to start the server.
