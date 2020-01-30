![Reuters](badge.svg)

# Reuters graphics rig

### Quickstart

1. Make sure to export a GitHub [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) that has all `repo` permissions to the environment variable `GITHUB_TOKEN`. (Check out this [quick primer](https://medium.com/@himanshuagarwal1395/setting-up-environment-variables-in-macos-sierra-f5978369b255) on environment variables and how to set a permanent one on a Mac.)

2. If you haven't already, install our scaffolding engine, [bluprint](https://github.com/reuters-graphics/bluprint), and add the graphics rig bluprint to the CLI.
  ```
  $ yarn global add @reuters-graphics/bluprint
  $ bluprint add reuters-graphics/graphics-rig
  ```

3. Make a fresh directory and use the bluprint to scaffold out your project.

  ```
  $ mkdir my-new-project
  $ cd my-new-project
  $ bluprint start
  ```

4. [READ THE DOCS.](https://reuters-graphics.github.io/style/graphics-rig/)
