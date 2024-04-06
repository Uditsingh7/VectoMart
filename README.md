
# Grocery Booking System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

The Grocery Booking System is a robust Node.js TypeScript application designed to streamline the process of managing grocery orders. It leverages modern development practices and technologies to provide a scalable and maintainable backend solution.

## Key Features

- **Express.js Server**: Utilizes Express.js to build a high-performance HTTP server, ensuring efficient handling of requests and responses.
- **TypeScript Support**: Written in TypeScript to enhance code quality, maintainability, and developer productivity, enabling static type checking and improved tooling support.
- **Dockerized Environment**: Utilizes Docker containers for seamless deployment and scaling, ensuring consistent behavior across different environments and simplifying infrastructure management.
- **PostgreSQL Integration**: Integrates with PostgreSQL, a powerful relational database, for efficient data storage and retrieval, providing reliability and scalability for large-scale applications.
- **Jest Testing**: Includes comprehensive test suites written with Jest, a popular testing framework, to ensure code correctness and maintainability through automated testing.
- **RESTful API Design**: Adheres to RESTful principles for API design, promoting interoperability, scalability, and ease of integration with other systems.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js
- Docker
- Docker Compose

## Getting Started

1. **Clone the Repository**: Begin by cloning this repository to your local machine:

```bash
git clone https://github.com/Uditsingh7/qp-assessment.git
```

2. **Navigate to the Project Directory**: Move into the project directory:

```bash
cd qp-assessment
```

3. **Configure Environment Variables**: Create a `.env` file based on the provided `.env.example` file, and update it with your PostgreSQL database credentials and other configuration settings:

```bash
cp .env.example .env
```

4. **Start the Application**: Run the following command to start the application using Docker Compose:

```bash
docker-compose up --build
```

5. **Access the Application**: Once the containers are up and running, access the application at [http://localhost:3000](http://localhost:3000).

## Testing

To run the test cases, execute the following command:

```bash
npm test
```

## Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to the project.

## License

This project is licensed under the terms of the [MIT License](LICENSE).

## Acknowledgements

Big thanks to OpenAI for assisting in crafting this README!
