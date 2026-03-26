# 🌐 REST

HTTP request files for testing the API with [kulala.nvim](https://github.com/mistweaverco/kulala.nvim).

## 📁 Files

| File          | Routes                                                      |
| ------------- | ----------------------------------------------------------- |
| `health.http` | `GET /healthcheck`                                          |
| `user.http`   | `GET /api/user`, `GET /api/user/:id`                        |
| `auth.http`   | `POST /api/auth/create-user`, `POST /api/auth/set-password` |

## ⚙️ Environment

Kulala uses `http-client.env.json` for environment variables. This file is **gitignored** (it may contain real tokens). Copy the example to get started:

```sh
cp rest/http-client.env.json.example rest/http-client.env.json
```

Then fill in your values. Switch environments in Neovim with kulala's env switcher.

| Variable       | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `BASE_URL`     | Server base URL                                              |
| `JWT_TOKEN`    | Bearer auth token for authenticated routes                   |
| `SIGNUP_TOKEN` | Short-lived signup token returned by `/api/auth/create-user` |

To get a JWT for local dev, call `POST /api/auth/create-user` with a valid auth token, then use the `token` from the signup link query param in `http-client.env.json`.

## 🚀 Usage

Open any `.http` file and use your kulala keybinds to send requests. Place the cursor inside a request block and trigger the send action.
