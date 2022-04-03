# Markdown Image Capture

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![build workflow](https://github.com/RyoheiTaima/markdown-image-capture/actions/workflows/build.yml/badge.svg)
[![codecov](https://codecov.io/gh/RyoheiTaima/markdown-image-capture/branch/master/graph/badge.svg?token=8F55ID109P)](https://codecov.io/gh/RyoheiTaima/markdown-image-capture)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/RyoheiTaima/markdown-image-capture)

This tool is to capture images specified markdown.

## Installation

```sh
npm install markdown-image-capture
```

## Quick Start

1. make a configuration file `.micconfig.json`.

  ```json
  {
    "login": {  // Optional. If login is required for caputur, a login action should be set.
      "url": "https://example-site.com/login",
      "actions": [  // Three actions are available: Fill, Click, and Wait.
        {
          // Fill action. This action fills the input form specified 'selector' with 'value'.
          "type": "fill",
          "selector": "input[name='username']",
          "value": "sample-user"
        },
        {
          // Click action. This action clicks the button specified 'selector'.
          "type": "click",
          "selector": "text=login",
        },
        {
          // Wait action. This action wait appear the selector specified 'selector'. If 'value' is 'hidden', wait disappear the selector.
          "type": "wait",
          "selector": "text=Welcome\sto\sSample\sSite",
          "value": "visible"
        },
      ]
    },
    "pages": {  // Pages you want capture images.
      "dashboard": {
        "url": "https://example-site.com/home",
        "actions": []
      },
      "createForm": {
        "url": "https://example-site.com/user",
        "actions": [  // If you want to capture forms, dialogs, etc.., you can specified actions like 'login'.
          {
            "type": "click",
            "selector": "button >> text=create\suser",
          }
        ]
      }
    }
  }
  ```
2. Insert image marks in markdown.

  ```markdown:sample.md
  Click the button in dashboard.
  ![dashboard_/html/body/div](./img/dashboard_with_button_highlighted) <-- Insert this.
  ```

  Image marks are interpreted as follows.
  `{pageName}_{highlightedSelector}({savePath})`

  | Name | Required | Description |
  | --- | --- | --- |
  | pageName | Yes | A page name in keys of config.pages. The specified page will be captured. |
  | highlightedSelector | No | Highlighted selector in page specified 'pageName'. |
  | savePath | Yes | Path where a captured image will be saved. |
3. Run this tool.

  ```sh
  npm run markdown-image-capture sample.md
  ```
