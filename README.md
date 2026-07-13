
> Open this page at [https://counterexample6.github.io/pxt-makecode-ads/](https://counterexample6.github.io/pxt-makecode-ads/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/counterexample6/pxt-makecode-ads** and import

## Freemium joke extension

The **Freemium** category adds a virtual-credit HUD and a deliberately annoying
fake-ad engine. New projects begin with 100 credits. Premium can be unlocked by
placing **unlock premium with key** in `on start` and entering `SUBSCRIBE`.

This initial implementation includes chargeable replacement blocks for creating,
destroying, moving, and configuring sprites; A-button events and controller
movement; and common scene actions (background color and camera following).
Each replacement block costs one credit in free mode. The last paid action
completes before its ad begins. Premium status is stored with Arcade settings
when the target supports it.

The fake ad uses a 10-second scene overlay and restores 50 credits after it
finishes. It is intentionally a joke: no real advertisements, network requests,
payments, or subscription validation are performed.

> A standard MakeCode extension cannot recolor, remove, or automatically charge
> existing Arcade blocks. Chargeable Sprite, Controller, and Scene/Tile wrapper
> blocks will live in this extension's own category.

## Edit this project

To edit this repository in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/counterexample6/pxt-makecode-ads** and click import

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
