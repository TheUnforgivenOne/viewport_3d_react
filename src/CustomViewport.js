import { useEffect, useState } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import { ViewportType } from '@cornerstonejs/core/dist/esm/enums';

const VIEWPORT_ID = 'viewport_id';
const LOADER_TYPE = 'cornerstoneStreamingImageVolume';
const VOLUME_ID = 'volume_id';

const initViewport = (id) => {
  const renderingEngine = cornerstone.getRenderingEngine('renderingEngine');
  const element = document.getElementById(id);

  const viewportInput = {
    viewportId: VIEWPORT_ID + id,
    type: ViewportType.ORTHOGRAPHIC,
    element,
    defaultOptions: {},
  };
  renderingEngine.enableElement(viewportInput);
};

const renderViewport = async (id, imageIds) => {
  const renderingEngine = cornerstone.getRenderingEngine('renderingEngine');
  const viewport = renderingEngine.getViewport(VIEWPORT_ID + id);

  const v_id = `${LOADER_TYPE}:${VOLUME_ID}_${id}`;
  const volume = await cornerstone.volumeLoader.createAndCacheVolume(v_id, {
    imageIds,
  });

  volume.load();
  viewport.setVolumes([{ volumeId: v_id }]);
  viewport.render();
};

const options = ['axial', 'sagittal', 'coronal', 'acquisition'];

const CustomViewport = ({ imageIds, id }) => {
  const [orientation, setOrientation] = useState('axial');

  useEffect(() => {
    if (imageIds.length) {
      initViewport(id);
      renderViewport(id, imageIds);
    }
  }, [imageIds]);

  return (
    <>
      <select
        value={orientation}
        defaultValue={orientation}
        onChange={(e) => {
          setOrientation(e.target.value);

          const renderingEngine =
            cornerstone.getRenderingEngine('renderingEngine');
          const viewport = renderingEngine.getViewport(VIEWPORT_ID + id);

          viewport.setOrientation(e.target.value);
        }}
      >
        {options.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <div
        id={id}
        style={{ height: '500px', width: '500px' }}
      ></div>
    </>
  );
};

export default CustomViewport;
