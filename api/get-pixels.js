const Jimp = require('jimp');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { url, width = 4000, height = 4000 } = req.query; // Default to 250x250 or maybe can setted to 4k

    if (!url) {
        return res.status(400).json({ error: 'Missing image URL' });
    }

    try {
        const image = await Jimp.read(url);
        const resized = image.resize(parseInt(width), parseInt(height));
        const pixels = [];
        resized.scan(0, 0, width, height, (x, y, idx) => {
            pixels.push([
                resized.bitmap.data[idx] / 255, // R
                resized.bitmap.data[idx + 1] / 255, // G
                resized.bitmap.data[idx + 2] / 255 // B
            ]);
        });

        res.json({ pixels, width, height });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process image' });
    }
};
