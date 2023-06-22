import { useState, useEffect } from 'react';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { imageLoader } from '@cornerstonejs/core';
import useInitCornerstone from './useInitCornerstone';
import CustomViewport from './CustomViewport';

const App = () => {
  useInitCornerstone();
  const [imageIds, setImageIds] = useState([]);

  const onFilesChange = async (e) => {
    const files = Array.from(e.target.files);

    const filesData = await Promise.all(
      files.map(async (file) => {
        const imageId =
          cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        const metaData = await imageLoader.loadAndCacheImage(imageId);
        cornerstoneWADOImageLoader.wadors.metaDataManager.add(
          imageId,
          metaData
        );

        return imageId;
      })
    );

    Promise.resolve().then(() => {
      setImageIds(filesData);
    });
  };

  return (
    <div>
      <input type="file" multiple onChange={onFilesChange} />
      <CustomViewport imageIds={imageIds} id="1" />
      <CustomViewport imageIds={imageIds} id="2" />
    </div>
  );
};

export default App;
