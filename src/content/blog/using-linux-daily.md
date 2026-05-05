---
title: "Using Linux Daily"
description: "Reviving a decade-old Dell Latitude E7470 with Arch Linux. From battling Windows bloat and failed distro-hops to achieving 8-hour battery life."
pubDate: 2026-03-18
---

**TL;DR for the impatient:** I bought a decade-old Dell laptop for the price of a really good dinner. Windows 10 turned it into a space heater with a battery life measured in minutes. After a traumatic journey through Ubuntu, CachyOS, and Debian, I nuked everything and installed Arch Linux using the `archinstall` script. Three weeks later, I'm getting 8-hour battery life, zero crashes, and I haven't opened Windows once. This is how it happened, why it worked, and why you might (or might not) want to try it too.

---

## **A Love Letter to the Dell Latitude E7470**

Let's start with the protagonist of this story: a **Dell Latitude E7470**, purchased on eBay for about **€65**. For those unfamiliar with Dell's business lineup, the Latitude E-series is what your corporate IT department hands out to people who need an reliable laptop. They're tanks. Boring in the best possible way.

**The specs, for the curious:**
- **CPU:** Intel Core i5-6300U
- **RAM:** 8GB DDR4-2133
- **Storage:** 256GB SATA SSD
- **Display:** 14-inch 1080p IPS matte panel (i LOVE matte screens)
- **Graphics:** Intel HD Graphics 520
- **Battery:** 4-cell 55Wh (supposedly refurbished, health reporting around 95%)

At €65, this is what economists would hopefully call "stupidly good value." This machine was $1,339 when new. It's built from carbon fiber and magnesium alloy. It has actual USB-A ports (three of them!), a full-size HDMI, and an Ethernet jack, things modern ultrabooks have murdered in cold blood for the sake of being 2mm thinner. The keyboard has that perfect "I'm writing a serious document" travel distance.
But here's the thing about hardware from 2015: **Windows 11 doesn't want it anymore.**

---

## **Windows just being Windows**

I gave Windows a fair shot. I really did. The laptop came with Windows 10 Pro preinstalled, activated, seemingly ready to go. I updated it (three hours of my life I'll never get back), installed Office 365, Chrome, Discord. The standard student starter pack.

The first red flag was the boot time. We're talking 2 minutes from power button to desktop, then another 90 seconds of "Please wait while we prepare Windows" nonsense. Once logged in, the fan immediately spooled up to jet-engine decibels. Task Manager showed 40% CPU usage at idle. Why? Windows Search indexing and a dozen Dell background services that refused to die.

Opening PowerPoint took 15 seconds. Not a huge presentation, just a blank template. Chrome with two tabs (Gmail, YouTube) pushed RAM usage to 6.2GB, triggering constant page file thrashing on the SATA SSD.

I disabled what I could, used O&O ShutUp10++, stripped the telemetry down to the bone. It helped, slightly. The idle CPU dropped to 25%. But the fundamental bloat remained.

First day of school with this laptop. I charged it to 100% overnight. First period: Web-based assessment through the school's Moodle instance. Simple stuff, HTML forms, no video. 

By the end of second period (roughly 90 minutes in), I was at 47%. The fan was screaming. The bottom of the laptop was hot enough to fry an egg. By the third period, at 11:00 AM, I got the dreaded 10% warning. I frantically searched for a power outlet.

I made it to lunch at 3%.

---

## **Finding the Distro**

I didn't blindly install Arch. I did what any reasonable person does: I distro-hopped until I questioned my life choices.

### **Attempt 1: Ubuntu 25.10**

Ubuntu was my comfort zone. My old desktop ran Ubuntu 18.04 for a few weeks during my early coding experiments.
I put Ubuntu 25.10 on a USB stick with Ventoy installed. Installation was smooth. I installed it alongside a Windows partition just in case (spoiler: I never booted Windows again).

Every single boot, without fail, Ubuntu greeted me with an error message: *"Sorry, Ubuntu 25.10 has experienced an internal error."* No further context. No "click here for details" that revealed anything useful. Just an apology, as if my operating system was Canadian. I clicked "Don't show again." It showed again next boot.

**Result:** 38 minutes from 100% to dead.

Thirty-eight minutes. Worse than Windows, somehow. The CPU was pinned at 2.8GHz constantly, never down clocking. The fans never spun down. It was like the kernel had no idea what power management was.

I tried "Power Saver" mode. Battery life jumped to 4 hours, but the system became unusable. YouTube dropped frames at 720p. VSCode (which I need for web development) took multiple seconds to open a file.

### **Attempt 2: CachyOS**

A friend of mine ([velibdot](https://codeberg.org/velibdot)) used CachyOS so I thought it would be a good idea to also use it.
CachyOS is an Arch-based distribution with heavy optimizations, using the XFS filesystem by default, and offering a Calamares installer that *should* just work. I wanted to believe.

I downloaded the XFCE edition (lightweight, right?). Put it on the USB with Ventoy installed. Booted the live environment. Beautiful. Fast. Responsive. I clicked "Install."

The installer finished. I rebooted. 

**Black screen.**

Weird. I checked the BIOS boot menu. No CachyOS entry. I booted a live USB again and checked GParted. The SSD showed as entirely unallocated. Blank. No partitions. The installer had pretended to work, shown a progress bar, claimed success, and then written absolutely nothing to disk.

I tried again. Same result.

I assumed Ventoy was the culprit. Sometimes it plays badly with installers. I grabbed a fresh USB drive, used **balenaEtcher** to do a direct DD-style flash, and tried again. Success! It installed. I rebooted.

**The Fish Shell Incident** \
CachyOS defaults to **Fish** shell instead of Bash. Arrow keys sent escape sequences that printed `[A [B` instead of navigating history. The default terminal (Alacritty) had broken font rendering for powerline symbols.

I thought, "Fine, I'll just install Node Version Manager (NVM) and get to work."

Except NVM doesn't officially support Fish. You need to install `fisher` and then `nvm` plugin, or manually source the bash NVM script with `bass`, or use `fnm` instead. This took 45 minutes of my life. My rule is: **If a basic development tool takes more than 30 minutes to configure on a "user-friendly" distro, I'm out.**

I also discovered CachyOS had installed a custom kernel with specific CPU scheduler optimizations that made my laptop fans pulse rhythmically, whooosh, silence, whooosh, silence, every 10 seconds. Like it was breathing. Like it was alive. Like it was mocking me.

### **Attempt 3: Debian 13**

Debian is the rock. The foundation. The "if it works on Debian, it works everywhere" standard. I installed Debian 13 with KDE Plasma, non-free firmware included.

And you know what? **It was perfect.** Stable. Boring. The battery life was acceptable (6 hours). The fans were quiet. KDE Connect worked. Discover (the app store) was functional.

But I had been spoiled. By Arch. By the AUR.

See, in my previous Linux experiments, I had used Arch. I knew the joy of `yay -S spotify` and having it just work, with all dependencies resolved, with the latest version, without adding third-party repositories.

Discord required manually downloading a .deb from their website, which then failed to install due to dependency hell.

I tried Flatpak. I tried Snap. Flatpak apps took 15 seconds to launch. Snap required `snapd`, which I don't like.

I realized: I didn't want a "stable" system. I wanted a system that could get out of my way and let me install the tools I need, when I need them, without theological debates about package philosophy.

So I did the unthinkable.

---

## **Installing Actual Arch Linux**

Not Manjaro. Not EndeavourOS. Not Garuda. **Arch Linux.** The one where the installation guide is a wiki page that assumes you know what a filesystem is.

### **The `archinstall` Experience**

I downloaded the latest Arch ISO. Flashed it. Booted. Instead of seeing a black prompt and having to manually `fdisk` my drive, I typed:

```bash
archinstall
```

And suddenly, I was in a TUI application. This felt like cheating. Arch purists would punch me in the face.

**The configuration choices that mattered:**

1. **Disk Configuration:** I chose "Best effort" partitioning, btrfs. I didn't need LVM or encryption on a school laptop.

2. **Profile:** "Desktop" → "KDE"

3. **Graphics Drivers:** Intel (open source)

4. **Audio:** pipewire (modern, handles Bluetooth better than PulseAudio)

5. **Kernels:** Linux (standard). Not Zen, not LTS. Just the vanilla kernel.

6. **Additional Packages:** This was crucial. I checked:
   - **NetworkManager:** For easy WiFi management
   - **Bluetooth:** Essential for my headphones
   - **Printing:** CUPS
   - **Power Management:** `power-profiles-daemon`

7. **Networking Backend:** Here's where I messed up the first time. The installer asks if you want to use **iwd** or the **default** (wpa_supplicant) backend for NetworkManager. I selected iwd.

   **Big mistake.** \
  On first boot, WiFi connected. I was happy. I rebooted. WiFi disappeared. NetworkManager showed "No WiFi adapter found." I spent an hour debugging `iwd` vs `wpa_supplicant` conflicts, trying to switch backends manually, editing `/etc/NetworkManager/NetworkManager.conf`.

   Eventually, I gave up, re-ran `archinstall`, and selected **Default** networking. It worked perfectly.

Total install time: 15 minutes. Reboot. Black screen with a cursor... then KDE Plasma loaded.

I had done it. I was running Arch. Me and my Intel HD Graphics against the world.

---

## **Daily Driving**

That was about three weeks ago. Since then, this laptop has been my daily driver for everything: school, coding, entertainment, communication. Here's what that actually looks like.

## **The Electron Problem and Native Alternatives**

Let's talk about the dark side. Not everything is perfect. Some software is actively hostile to battery life, and I had to become ruthless about it.

### **The Electron Battery drainers**

**Visual Studio Code:** On Windows, this was my IDE of choice. When I used it on Ubuntu in Power Saver mode, it was laggy. But worse: it was **hungry**.

On Arch this translated to 3 hours of battery life. Unacceptable for school days.

**The Alternative:** **Zed Editor**
Zed is written in Rust, uses GPU acceleration via GPUI framework, and is native code. No embedded Chromium.
The difference is stark. Zed lacks some of VSCode's extensions, limited debugging support, but for writing code? It's faster.

**AFFINE:** This hurts because I love AFFINE. It's a Notion/Obsidian alternative, self-hostable, beautiful, open-source. But it's also Electron-based (i think). On battery saver mode, typing lagged. The cursor would stutter. Battery drain was a pain.

**The Alternative:** **Ghostwriter**
I switched to plain Markdown files. Ghostwriter is a native Qt application. It has no cloud sync, no database, no bloat. Just files in a folder. I organize them by subject.

---

## **KDE Connect**

I mentioned KDE Connect briefly, but it deserves its own section because it's soooo good.

Picture this: You're in class. Your phone is in your bag, on silent Someone texts you. Normally, you pull out your phone, get distracted by Instagram, miss what the teacher said.

With KDE Connect: The notification appears in your KDE notification panel. You see it's just your friend asking about lunch. You reply using your laptop keyboard, which sends the text through your phone. You never touched the phone. You never broke focus.

**Other features:**
- **Clipboard sharing:** Copy a URL on laptop, paste it into WhatsApp on phone instantly.
- **Remote input:** Use your phone as a touchpad for the laptop when doing presentations.
- **File sharing:** Send photos from phone to laptop by right-clicking in Dolphin (file manager) → "Send to Phone."
- **Ring my phone:** When I inevitably lose my phone in the couch cushions at home.

Our school has open WiFi. KDE Connect uses broadcast packets to find devices. Occasionally, during lectures, I get a pair request from "Redmi 13C" or "Galaxy S23." Random students trying to connect to any open device. I decline, but it's amusing to know that somewhere in the school, someone is trying to pair with my laptop.

---

## **Switching to Arch on my main PC**

I'm switching my main rig to Linux too. This is the harder battle. The Dell laptop is Intel graphics, open source drivers, no proprietary nonsense. My gaming PC has an **AMD Ryzen 7 3700X** and an **AMD Radeon 5700xt**.

I'm documenting this journey separately. Stay tuned for "Switching to Arch on my main PC."

---

## **Why Open Source Matters to a Broke Student**

Let's zoom out. Why do all this? Why not just buy a new laptop with better battery life? Why not suffer through Windows like everyone else?

Because **I don't own my software anymore.** Windows 11 requires a Microsoft account to install (workarounds exist, but they're temporary). It shows ads in the Start menu. It uploads telemetry I can't inspect. It decides when to update, what features I need, what "AI companions" should interrupt my workflow.

On Arch, I own everything. If something breaks, I broke it, and I can fix it. If I don't want a feature, I don't install it. If I want to change how my window manager behaves, I edit a text file.

Plus, **it's free.** No €100 Windows license. No €60 Office subscription. No Adobe Creative Cloud. Just free tools that respect my time and my wallet.

---

## **Who Should Actually Do This?**

After 2,200+ words let me be real: **Linux is not for everyone.** Not yet. Maybe not ever for some people.

**You should try this if:**
- You have hardware between 5-10 years old that's "slow" on Windows
- You enjoy troubleshooting (or at least don't hate it)
- Your school/work doesn't require specific Windows-only software (looking at you, AutoCAD, SolidWorks, Adobe)
- You have technical curiosity and time to learn
- You have a backup plan (I keep a Windows USB stick in my bag, just in case)

**You should NOT do this if:**
- You're in the middle of exam season and need stability above all else
- You require software with no Linux alternative (check first!)
- The thought of opening a terminal makes you anxious
- You need specific peripherals with no Linux drivers (some printers, specialized scanners, certain WiFi cards, though most work now)
- You game competitively (kernel based anti-cheat will ruin your day)

**The Dual-Boot Safety Net:**
If you're curious but scared, shrink your Windows partition by 50GB, install Linux alongside it. Use Linux for daily tasks, boot Windows only when absolutely necessary. That's how I started years ago. Eventually, you'll find you haven't booted Windows in three months, and then you can wipe it.

---

## **Three Weeks Later**

I'm writing this conclusion in Ghostwriter on my Arch laptop. It's 11:30 PM. I've been using this machine since 9:00 AM. Battery is at 13%. The fan is silent. KDE Connect just dinged a message from my girlfriend that dinner is ready.

The Dell Latitude E7470, rescued from obsolescence by a €0 operating system, is now my favorite computer I've ever owned. Not because it's powerful (it's not), or because it's flashy (it's a black rectangle), but because it **works for me** instead of against me.

Windows told me this hardware was trash. Arch proved it was more than capable.

_I use Arch btw._

---

**P.S.** If you try this and break everything, the Arch Wiki is at wiki.archlinux.org. It's a great piece of documentation.
