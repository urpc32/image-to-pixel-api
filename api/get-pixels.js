const { createCanvas, loadImage } = require('canvas');

module.exports = async (req, res) => {
    const { url, width = 50, height = 50 } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing image URL' });
    }

    try {
        const image = await loadImage(url);
        const canvas = createCanvas(parseInt(width), parseInt(height));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height).data;
        const pixels = [];

        for (let i = 0; i < imageData.length; i += 4) {
            pixels.push([imageData[i] / 255, imageData[i + 1] / 255, imageData[i + 2] / 255]);
        }

        res.json({ pixels, width, height });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process image' });
    }
};
