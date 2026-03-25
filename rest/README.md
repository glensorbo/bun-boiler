# 🌐 REST

HTTP request files for testing the API with [kulala.nvim](https://github.com/mistweaverco/kulala.nvim).

## 📁 Files

| File          | Routes                               |
| ------------- | ------------------------------------ |
| `health.http` | `GET /healthcheck`                   |
| `user.http`   | `GET /api/user`, `GET /api/user/:id` |

## ⚙️ Environment

Kulala uses `http-client.env.json` for environment variables. This file is **gitignored** (it may contain real tokens). Copy the example to get started:

```sh
cp rest/http-client.env.json.example rest/http-client.env.json
```

Then fill in your values. Switch environments in Neovim with kulala's env switcher.

| Variable    | Description                           |
| ----------- | ------------------------------------- |
| `BASE_URL`  | Server base URL                       |
| `JWT_TOKEN` | Bearer token for authenticated routes |

To get a JWT for local dev, generate one signed with your `JWT_SECRET` env var and paste it into `http-client.env.json` under the `dev` key.

## 🚀 Usage

Open any `.http` file and use your kulala keybinds to send requests. Place the cursor inside a request block and trigger the send action.
