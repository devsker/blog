---
title: Self-hosting your Notes is really easy.
description: Self-hosting LiveSync for Obsidian on a 2015 MacBook Pro "Home Server".
pubDate: 2026-04-13
link: https://blog.sker.lol/posts/self-hosting-your-notes-is-really-easy/
---
**TL;DR for the impatient:** I turned my old MacBook Pro 2015 into a "Home Server" running LiveSync for Obsidian, where I save my notes. After dealing with massive battery drain from other apps and failing to set up overly complex alternatives, I realized a simple CouchDB instance and the LiveSync plugin was all I needed. It was incredibly easy, and I'll never pay for cloud sync again.

---

## **The Catalyst: Battery Drain on the Morning Train**

I posted my first blog post a few weeks ago, and it's been really fun to write my progress down. But today at 9 am, while sitting in the train driving to school, I started thinking about the annoyance that [AFFINE](https://affine.pro/) is.

AFFINE likes to drain a lot of battery. And when I say a lot, I mean **a lot**. It's really nice for a stationary PC which doesn't run on battery power, but for a student on the go, it's simply not an option. Adding equations using LaTeX is a pain, and the whole experience feels laggy on mobile hardware.

I simply searched "notion alternatives selfhosting". A few different results popped up.

---

## **Finding the Alternative**

I didn't immediately land on [Obsidian](https://obsidian.md/). Like any good tech journey, there were some failed experiments along the way. 

### **Attempt 1: AFFINE**
As I mentioned, AFFINE was the first obvious choice because it's really similar to Notion. And that's it. It's not that good for my specific needs. The performance and battery issues immediately disqualified it from being my daily driver.

### **Attempt 2: Outline**
The next result was [Outline](https://www.getoutline.com/). Outline seemed really nice, even had some OAuth integrations, like GitHub or Google, which I thought were really nice.

I tried to set it up, which failed hard. It just didn't want to start. I didn't investigate a lot because I simply don't care enough to troubleshoot a broken setup when I just want to take notes.

---

## **Defining What I Actually Need**

After Outline failed, I took a step back and thought about if I really need something like Notion. 

**What I need:**
* **Simple UI**
* **Fast startup times** (I hate to wait)
* **Easy note taking**
* **Markdown support** (and LaTeX)

**What I don't need:**
* Collaboration
* A lot of features

I recently watched a video by [Theo (t3dotgg)](https://www.youtube.com/@t3dotgg) on YouTube. He talked about Notion and how he can't use Obsidian because he needs the collaboration features. After talking to a friend about Obsidian, I realized it would really fit my usecase perfectly.

Obsidian **is not** a real Notion alternative if you need to work with others—using it in a team seems like a massive pain. But for my solo setup? It's exactly what I was looking for.

---

## **The LiveSync Setup Experience**

Setting up my own sync solution sounded intimidating at first, but it was soooo easy. And so worth it.

I decided to use an old MacBook Pro 2015 as a "Home Server". Here is exactly how it went down:

1.  **The Database:** I just needed to download the `docker-compose.yml` file for a [CouchDB](https://couchdb.apache.org/) instance.
2.  **Configuration:** I opened the web UI of CouchDB and created a new "obsidian" database.
3.  **The Client:** I installed Obsidian on all my devices and downloaded the community plugin [Self-hosted LiveSync](https://github.com/vrtmrz/obsidian-livesync).
4.  **Syncing:** I used the defaults, and it just worked. 

That's it. It's really easy.

---

## **Conclusion**

I now have a fast, markdown-native, battery-friendly note-taking system that syncs perfectly across all my devices without relying on third-party cloud subscriptions.

I'll never pay for any note taking app with cloud sync ever again.

---

**P.S.** MacOS is a pain to work with in terms of a home server. If you're starting from scratch, I would recommend Linux for this.