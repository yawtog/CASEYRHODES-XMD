const fs = require("fs");

cmd({
    pattern: "vv",
    react: "💾",
    alias: ["retrive", "viewonce"],
    desc: "Fetch and resend a ViewOnce message content (image/video/voice).",
    category: "misc",
    use: "<query>",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.quoted) return reply("Please reply to a ViewOnce message.");

        const mime = m.quoted.mtype;
        let ext, mediaType;

        if (mime === "imageMessage") {
            ext = "jpg";
            mediaType = "image";
        } else if (mime === "videoMessage") {
            ext = "mp4";
            mediaType = "video";
        } else if (mime === "audioMessage") {
            ext = "mp3";
            mediaType = "audio";
        } else {
            return reply("Unsupported media type. Please reply to an image, video, or audio message.");
        }

        if (!m.quoted.message) return reply("Unable to retrieve the message. Ensure it's a ViewOnce media.");

        let buffer = await m.quoted.download();
        let filePath = `./temp/${Date.now()}.${ext}`;

        fs.writeFileSync(filePath, buffer);

        let mediaObj = {};
        mediaObj[mediaType] = { url: filePath };

        await conn.sendMessage(from, mediaObj, { caption: `🔁 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄᴀsᴇʏʀʜᴏᴅᴇs ᴛᴇᴄʜ ${mediaType}` });

        setTimeout(() => {
            fs.unlink(filePath, (err) => {
                if (err) console.error("File deletion error:", err);
            });
        }, 5000);

    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while fetching the ViewOnce message.");
    }
});
