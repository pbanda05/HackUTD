# Toyota 3D Models

This folder is for storing Toyota 3D models downloaded from Sketchfab.

## How to Add Models

1. Download Toyota 3D models from Sketchfab (https://sketchfab.com/tags/toyota)
2. Convert to GLB format if needed (most Sketchfab models are already in GLB format)
3. Place the models in this folder with these names:
   - `camry.glb` - Toyota Camry
   - `rav4.glb` - Toyota RAV4
   - `highlander.glb` - Toyota Highlander
   - `tacoma.glb` - Toyota Tacoma

4. Update the `MODEL_URLS` in `src/components/toyota/Car3DViewer.jsx`:
   ```javascript
   const MODEL_URLS = {
     camry: '/models/camry.glb',
     rav4: '/models/rav4.glb',
     highlander: '/models/highlander.glb',
     tacoma: '/models/tacoma.glb',
   };
   ```

## License Notes

Make sure to check the license of any models you download from Sketchfab. Some models may require attribution or have usage restrictions.

## Alternative: Using CDN URLs

You can also use direct URLs to models hosted elsewhere:
```javascript
const MODEL_URLS = {
  camry: 'https://your-cdn.com/models/camry.glb',
  rav4: 'https://your-cdn.com/models/rav4.glb',
  // etc.
};
```

