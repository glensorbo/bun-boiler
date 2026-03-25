# 🌐 REST

HTTP request files for testing the API with [kulala.nvim](https://github.com/mistweaverco/kulala.nvim).

## 📁 Files

| File          | Routes                               |
| ------------- | ------------------------------------ |
| `health.http` | `GET /healthcheck`                   |
| `user.http`   | `GET /api/user`, `GET /api/user/:id` |

## ⚙️ Environment

`kulala.json` defines environments. Switch between them in Neovim with kulala's environment switcher (`:lua require('kulala').set_selected_env()`).

| Variable    | Description                           |
| ----------- | ------------------------------------- |
| `BASE_URL`  | Server base URL                       |
| `JWT_TOKEN` | Bearer token for authenticated routes |

To get a JWT for local dev, generate one signed with your `JWT_SECRET` env var, then paste it into `kulala.json` under the `development` key.

## 🚀 Usage

Open any `.http` file and use your kulala keybinds to send requests. Place the cursor inside a request block and trigger the send action.
