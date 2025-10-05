import express from 'express';
import * as dotenv from 'dotenv';
import api from 'api';

dotenv.config();

const router = express.Router();
const SdkInstance = api('@eden-ai/v2.0#4whgluqww3se');
SdkInstance.auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzUyYTIwZmUtZTNhZC00YThlLWI1ZmMtZjQyZTUxZjg5ZmVkIiwidHlwZSI6ImFwaV90b2tlbiJ9.nXtG4Zv4Yg4a9ZZwL6dJMHVBY65HYxrk--7OIj3FN3E');//afterwards add the apiu key in the env file

router.route('/').get((req,res) =>{
    res.send('Hello World!');
});
async function generateImage(prompt) {
    console.log(prompt);
    try {    
        const response = await SdkInstance.image_generation_create({
            response_as_dict: true,
            attributes_as_list: true,
            show_original_response: false,
            num_images: 1,
            providers: 'openai/dall-e-3',
            fallback_providers: null,
            text: prompt,
            resolution: '1024x1024'
          })
        const imageUrl = response.data['openai/dall-e-3'].image_resource_url[0];
        return imageUrl;
    } catch (error) {
        console.error('Error generating image:', error);
        return null;
    }
}


router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;
        const imageUrl = await generateImage(prompt); // Generate image

        if (imageUrl) {
            // Send the image URL as response
            res.status(200).json({ imageUrl: imageUrl });
        } else {
            console.log('Failed to generate image.');
            res.status(500).json({ error: 'Failed to generate image.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});



export default router;