# Take-Flight Application

This project is a flight booking application that demonstrates the use of React, Node.js, AWS Lambda, and WebSocket for real-time flight data updates.

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:
Node.js
Yarn (or npm)

### Clone the repository

To clone the repository, run the following command:

[git clone https://github.com/Siya360/take-flight.git](https://github.com/Siya360/take-flight.git)

### Environment Setup

Navigate to the `/server` directory:

cd server

Copy the .env.example file to .env:

cp .env.example .env

    Open the .env file and fill in the actual configuration values for your environment.

    Repeat steps 1-3 for the /client directory.

Install Dependencies

    Navigate to the /client directory and install the dependencies:

cd client
yarn install

Navigate to the /server directory and install the dependencies:

cd server
yarn install

Running the Application
Client

In the /client directory, you can run:

yarn start

    This runs the app in development mode.
    Open http://localhost:4000 to view it in your browser.
    The page will reload with edits. Lint errors will be shown in the console.

Server

In the /server directory, you can run:

yarn start

    This starts the Node.js server.
    Ensure the server is running for the client to communicate with the backend services.

Running Tests

To launch the test runner in interactive watch mode, run:

yarn test

yarn test

Building for Production

To build the app for production, run:

yarn build

    This builds the app to the build folder.
    It correctly bundles React in production mode and optimizes the build for performance.

Learn More

To learn more about React, check out the React documentation.
Project Structure

    src/components: Contains React components for the application.
    src/pages: Includes different pages for the application, such as FlightList, NewFlight, and FlightDetails.
    src/styles: Contains styled components and Material-UI customizations.
    src/utils: Utility functions and API service handlers.

Contributing

Contributions are welcome. Please open an issue or submit a pull request with any improvements.
License

This project is licensed under the MIT License - see the LICENSE file for details.

Make sure to replace `<repository-url>` with the actual URL of your repository. This updated README.md provides a comprehensive overview of the project, including environment setup instructions, particularly the handling of `.env` files, and a structured guide for running and building the application.
