# Setup Guide — Ghar Ka Kaam (Voice Task Bot)

This app is free forever and needs no coding skills to set up. Follow these
steps once. It should take about 15–20 minutes the first time.

There are two parts:
- **Part A** — logging results to a Google Sheet (optional but recommended)
- **Part B** — hosting the app for free and installing it on the Android phone

---

## Part A — Log results to a Google Sheet

### 1. Create a new Google Sheet
- Go to [sheets.google.com](https://sheets.google.com) and sign in with your
  Google account.
- Click the **+ (Blank)** button to create a new, empty spreadsheet.
- Give it any name you like, e.g. "Ghar Kaam Log".

### 2. Open the Apps Script editor
- In the Sheet, click **Extensions** in the top menu, then **Apps Script**.
- A new tab opens with a code editor and a file called `Code.gs` containing
  some placeholder text.

### 3. Paste the script
- Select all the placeholder text in `Code.gs` and delete it.
- Open the file `google-apps-script.js` (in this same folder) on your
  computer, copy its **entire contents**, and paste it into `Code.gs`.
- Click the save icon (or press Ctrl+S / Cmd+S).

### 4. Deploy it as a Web App
- Click the blue **Deploy** button (top right) → **New deployment**.
- Click the gear/settings icon next to "Select type" and choose **Web app**.
- Fill in:
  - Description: anything, e.g. "Ghar Kaam logger"
  - Execute as: **Me**
  - Who has access: **Anyone**
- Click **Deploy**.
- The first time, Google will ask you to authorize the script — click
  **Authorize access**, choose your Google account, click **Advanced** if it
  shows a warning screen, then **Go to (project name) (unsafe)**, then
  **Allow**. This warning appears only because it's your own personal
  script, not a published app — it's safe to allow.
- After deploying, Google shows you a **Web app URL** that looks like:
  `https://script.google.com/macros/s/AKfycb.../exec`
  **Copy this entire URL.**
- (Optional sanity check: paste that URL into your phone or computer's
  browser and open it. It should just show the word `OK`.)

### 5. Paste the URL into the app
- Open the file `js/app.js` (in this folder) in any text editor.
- Near the top, find this line:
  ```js
  const SHEET_WEBHOOK_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
  ```
- Replace the placeholder text (keeping the quotes) with the URL you copied,
  e.g.:
  ```js
  const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycb.../exec";
  ```
- Save the file.

That's it — every time someone finishes a day's checklist in the app, one
row per task gets added to a sheet tab named **"Log"** inside your Google
Sheet automatically.

> If you skip Part A entirely, the app still works perfectly on the phone —
> it just won't save a record anywhere else.

---

## Part B — Host it for free and install it on the phone

### 6. Host the app for free with GitHub Pages
- If you don't have one, create a free account at
  [github.com](https://github.com).
- Create a new repository (click **+** top right → **New repository**),
  give it any name (e.g. `voice-task-bot`), and click **Create repository**.
- Upload every file and folder from this `voice-task-bot` folder into that
  repository (on the repository page: **Add file → Upload files**, then
  drag the whole contents of this folder in, including the `css`, `js`,
  `images`, and `icons` sub-folders). Commit the changes.
- In the repository, go to **Settings → Pages**.
- Under "Build and deployment" → "Source", choose **Deploy from a branch**.
- Under "Branch", choose **main** (or **master**) and folder **/(root)**,
  then click **Save**.
- Wait a minute or two, then refresh the Pages settings page — it will show
  a link like `https://yourusername.github.io/voice-task-bot/`. That is
  your app's permanent, free web address.

### 7. Install it on the Android phone
- On the Android phone, open **Chrome**.
- Go to the link from step 6 (`https://yourusername.github.io/voice-task-bot/`).
- Tap the **⋮** menu (three dots, top right) → **Add to Home screen** →
  **Add** (also sometimes shown as **Install app**).
- A colorful house icon (the app icon) appears on the home screen. Tapping
  it opens the app full-screen, like any other app, and it keeps working
  even without internet after the first open (the checklist itself doesn't
  need internet — only the optional Sheet logging does).

---

## 8. Changing questions, pictures, or which day a task appears

Everything about *what* the app asks and *when* lives in one file:
`js/tasks-config.js`. Open it in any text editor. Each task looks like:

```js
{
  id: "kitchen_slab",
  textHi: "क्या आपने किचन का स्लैब साफ किया?",
  image: "kitchen_slab.svg",
  day: ["everyday"]
},
```

- To change the **wording**, edit the text inside `textHi` — keep it short,
  since it's read aloud, not written.
- To change the **picture**, put a new `.svg` file into the `images/`
  folder and change `image` to that file's name.
- To change **which day(s)** a task is asked, edit the `day` list. Use
  `"everyday"` to ask it every day, or any combination of `"monday"`,
  `"tuesday"`, `"wednesday"`, `"thursday"`, `"friday"`, `"saturday"`,
  `"sunday"`.
- Detailed comments at the top of `tasks-config.js` explain all of this
  again in more depth.

After editing, if the app is hosted on GitHub Pages, re-upload the changed
`tasks-config.js` file to the same GitHub repository (Part B, step 6) to
update the live app. If it's opened directly from files on the phone/
computer, just save the file — the change applies the next time the app
is opened (you may need to close and reopen the app, or clear the
browser's cache, since the service worker caches files for offline use).
