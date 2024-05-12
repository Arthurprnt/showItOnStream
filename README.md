
# showItOnStream

Tool to show on stream texts and files sent in a specific discord channel.

## Chapters

<p>
  • <a href="#installation">Installation</a></br>
  • <a href="#usage">Usage</a></br>
</p>

## Installation

Here are the steps to follow to install the tool.
Please note that to use this tool you'll need a discord bot (you can create one [here](https://discord.com/developers/applications)), and grant it admin perms.

- Download the source code zip
- Install nodejs v20.12.2 or higher
- Run `npm i` in the folder where you extracted the files
- Set your discord bot token in the `config.json` file
- Also put the discord channel id where you want to send the messages and files
- Run `node index` in the same folder as before and you should see something like that:
![preview](https://github.com/Arthurprnt/showItOnStream/assets/93857989/201407a5-d181-4c84-8ef0-a03815429093)

If so, you've successfully set-up the tool. Now you'll just need to add in obs.

## Usage

The step to follow to use the tool are very simple:
- Add browser source in obs with the link YOUR_IP:3000
- Set the the source size to 1920x1080
- You can check the `Control audio via OBS` if you want to reduce the output volume
- Then, it should look like this:

![obs](https://github.com/Arthurprnt/showItOnStream/assets/93857989/18ca2e5f-5cd2-4b03-966a-2bb0b0292d96)

You're all done, enjoy the tool !
