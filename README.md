# Manager-measurement API

## Description

The Shopper API provides endpoints for managing and retrieving information related to water and gas readings. The API is implemented using Node.js, TypeScript, and Express, and integrates with external services such as Gemini to process and manage measurement data.

## Integration with Gemini

The API uses [Google Gemini](https://ai.google.dev/gemini-api/docs/api-key) to read and identify prompts from images uploaded to the API. The process includes:

1. **Image Upload**: The user uploads an image in base64 format to the `/upload` endpoint.
2. **Processing with Gemini**: The image is processed using Google Gemini to extract relevant data. During this process, the image is analyzed by the generative AI model `gemini-1.5-flash`.
3. **Image Storage and URL Generation**: After processing, the image is saved within the Docker container, and a URL is generated that allows access to the image file.
4. **API Response**: The extracted data, including the measurement value, image URL, and a unique UUID for the measurement, is returned to the user.

**Note:** Ensure you have a Gemini account and the necessary credentials configured for the service to work properly. You need to set the `GEMINI_API_KEY` in your environment variables.

## Environment Setup

To use Gemini, add the following environment variable to your `.env` file:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

## How Gemini Works in the Application

When an image is uploaded, the following steps are executed:

1. **Image Processing**: The image is sent to Gemini, which analyzes it using the specified model and prompt to extract relevant measurement data.
2. **Image Saving**: The image is saved inside the Docker container's `/app/images` directory. A URL for accessing the image is generated, allowing it to be viewed or retrieved externally.
3. **Result Handling**: The API returns the analysis results and the image URL in the response.

## Endpoints

### Measurement Endpoints

#### 1. Upload Image

**Endpoint:** `/upload`

**Method:** POST

**Description:** Receives an image in base64 format, queries Gemini, and returns the measurement read by the API.

**Request Body:**

```json
{
    "image": "base64",
    "customer_code": "string",
    "measure_datetime": "datetime",
    "measure_type": "WATER" or "GAS"
}
```

**Response:**

- **200 OK**

```json
{
    "image_url": "string",
    "measure_value": integer,
    "measure_uuid": "string"
}
```

- **400 Bad Request**

```json
{
    "error_code": "INVALID_DATA",
    "error_description": "<error description>"
}
```

- **409 Conflict**

```json
{
    "error_code": "DOUBLE_REPORT",
    "error_description": "Measurement for the month has already been made"
}
```

#### 2. Confirm Measurement

**Endpoint:** `/confirm`

**Method:** PATCH

**Description:** Confirms or corrects the value read by Gemini.

**Request Body:**

```json
{
    "measure_uuid": "string",
    "confirmed_value": integer
}
```

**Response:**

- **200 OK**

```json
{
    "success": true
}
```

- **400 Bad Request**

```json
{
    "error_code": "INVALID_DATA",
    "error_description": "<error description>"
}
```

- **404 Not Found**

```json
{
    "error_code": "MEASURE_NOT_FOUND",
    "error_description": "Measurement not found"
}
```

- **409 Conflict**

```json
{
    "error_code": "CONFIRMATION_DUPLICATE",
    "error_description": "Measurement has already been confirmed"
}
```

#### 3. List Measurements by Customer

**Endpoint:** `/<customer_code>/list`

**Method:** GET

**Description:** Lists measurements performed by a specific customer. Optionally filters by `measure_type`.

**Query Parameters:**

- `measure_type` (optional): Filter measurements by type ("WATER" or "GAS"). Validation is case insensitive.

**Response:**

- **200 OK**

```json
{
    "customer_code": "string",
    "measures": [
        {
            "measure_uuid": "string",
            "measure_datetime": "datetime",
            "measure_type": "string",
            "has_confirmed": boolean,
            "image_url": "string"
        }
    ]
}
```

- **400 Bad Request**

```json
{
    "error_code": "INVALID_TYPE",
    "error_description": "Invalid measurement type"
}
```

- **404 Not Found**

```json
{
    "error_code": "MEASURES_NOT_FOUND",
    "error_description": "No measurements found"
}
```
## Technologies Used

- **[Node.js](https://nodejs.org/):** JavaScript runtime built on Chrome's V8 JavaScript engine.
- **[Express](https://expressjs.com/):** Web framework for Node.js for building RESTful APIs.
- **[TypeScript](https://www.typescriptlang.org/):** Superset of JavaScript that adds static typing and other features.
- **[Tsup](https://tsup.egoist.dev/):** Build tool for compiling TypeScript code to JavaScript.
- **[TSX](https://tsx.dev/):** Tool for running and developing TypeScript projects.
- **[Jest](https://jestjs.io/):** Testing framework for JavaScript.
- **[Supertest](https://www.npmjs.com/package/supertest):** HTTP assertions for testing APIs.
- **[Sequelize](https://sequelize.org/):** Promise-based ORM for Node.js.
- **[PostgreSQL](https://www.postgresql.org/):** Relational database used for storing measurements and other data.
- **[Docker](https://www.docker.com/):** Containerization platform for developing, shipping, and running applications.
- **[Google Generative AI (Gemini)](https://ai.google.dev/gemini-api/docs/api-key):** Used to process images and extract measurement data from uploaded images.

## Running the Project

### Install Dependencies

Run the following command to install project dependencies:

```bash
npm install
```

### Configure Environment Variables

Add the following environment variable to your `.env` file:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

### Start the Server

Run the following command to start the server in development mode:

```bash
npm run start:dev
```

**Note**: If running locally, make sure to update the database configuration from `postgres` to `localhost` in the Sequelize setup.

### Test the API

Use tools like Postman or cURL to test the API endpoints:

- **Upload an image**: `POST http://localhost:3000/upload`
- **Confirm a measurement**: `PATCH http://localhost:3000/confirm`
- **List measurements**: `GET http://localhost:3000/<customer_code>/list`

### Run with Docker

To build and run the application with Docker, use:

```bash
npm run docker:up
```

### Run Tests

To run the tests using Jest:

```bash
npm test
```

To run the tests inside a Docker container:

```bash
npm run test:docker
```

To run the tests for CI/CD inside a Docker container:

```bash
npm run test:docker:ci
```

## Contributing

Feel free to open issues or submit pull requests to contribute improvements to this project.

## License

This project is licensed under the [MIT License](LICENSE).
