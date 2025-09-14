# AI Recommerce

## Getting Started

### Prerequisites

- [mise](https://mise.jdx.dev/installing-mise.html)

### Installation

Install tools and dependencies:

```bash
# Install tools: nodejs and pnpm
mise install
# Install dependencies
pnpm install
```

### Config environment

```bash
cp .env.example .env # Create env file
```

You may need to modify one or all values in the .env file depending on your environment. The information about each variable can be found in the .env.example file.

### Development

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173`.

## Start server:

```shell
pnpm run dev
```

## Lint:
Please run lint and format your code before commit it using:

```shell
pnpm run lint:fix
```

## Run test
### Unit test

```shell
pnpm run test
```

### End-to-end test

```shell
pnpm run test:e2e
```

## Building for Production

Create a production build:

```bash
pnpm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `pnpm run build`

```
├── package.json
├── pnpm-lock.yaml
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Design choices 

### AI recommendation

This project uses LLM to generate recommendations. Currently, only Gemini is supported.

The expected output of the LLM is a short marketing text and a category. Because the output is structured, you can leverage the [structured output](https://ai.google.dev/gemini-api/docs/structured-output) provided by Gemini to generate a recommendation.

Because we would like to limit the category to a few options from [taxonomy category](https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt), we can leverage the enums functionality provided by Gemini to limit the output of the LLM.

### Securing API usage in production

In a production environment, directly calling the AI provider API from the client-side is insecure as it exposes the API key. To mitigate this, we must introduce a backend proxy service that sits between the frontend application and the AI service.

This proxy has two primary responsibilities:
1. Securely manage the AI provider's API key.
2. Control access to the AI-powered recommendation feature.

Here are the key security measures to implement in the proxy:

- API Key Management: The proxy will store the AI provider's API key securely (e.g., using a secret manager like AWS Secrets Manager, Google Secret Manager, or HashiCorp Vault) and inject it into requests sent to the AI service. The key will never be exposed to the client.

- Authentication & Authorization:
  - Public Access: If the feature is available to all users without login, we must prevent abuse.
      - Rate Limiting: Implement IP-based or fingerprint-based rate limiting to prevent a single user from overwhelming the service.
      - Resource Abuse Prevention: Consider using techniques like CAPTCHA for anonymous users to ensure requests are from humans.
  - Authenticated Access: If the feature is only for registered users, the proxy must enforce this.
    - The proxy should validate an authentication token (e.g., a JWT) sent with each request from the frontend.
    - It should also perform authorization checks to ensure the authenticated user has the necessary permissions to use the service.

- Input Validation: The proxy must rigorously validate all incoming data from the client (product name, condition, notes). This prevents common vulnerabilities like Injection attacks and ensures data integrity before it is sent to the AI service.

- Caching: To reduce latency and costs associated with the AI service, the proxy should implement a caching layer. Requests with identical inputs can return a cached response, avoiding a new call to the AI provider.

- Logging and Monitoring: The proxy should log all requests and responses (while being careful not to log sensitive data). This is crucial for monitoring for suspicious activity, debugging, and analyzing usage patterns.

- HTTPS/TLS Enforcement: All communication between the client and the proxy, and between the proxy and the AI service, must be over HTTPS to protect data in transit.

### API details 
  - The proxy must provide an API that follows the format below:
  ```openapi generator
  /recommendation:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                productName:
                  type: string
                condition:
                  type: string
                notes:
                  type: string
              required: [productName, condition, notes]
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  marketingText:
                    type: string 
                  category: 
                    type: string 
                required: [marketingText, category]
  ```
