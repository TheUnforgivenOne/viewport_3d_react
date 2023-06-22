import { useEffect } from 'react';
import { cornerstoneStreamingImageVolumeLoader } from '@cornerstonejs/streaming-image-volume-loader';

import dicomParser from 'dicom-parser';
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import { MouseBindings } from '@cornerstonejs/tools/dist/esm/enums';

const { ZoomTool, StackScrollMouseWheelTool, PanTool } = cornerstoneTools;

window.cornerstone = cornerstone;
window.cornerstoneTools = cornerstoneTools;

function initCornerstoneDICOMImageLoader() {
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.configure({
    useWebWorkers: true,
    decodeConfig: {
      convertFloatPixelDataToInt: false,
    },
  });

  var config = {
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: false,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: true,
        strict: false,
      },
    },
  };

  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
}

function initVolumeLoader() {
  cornerstone.volumeLoader.registerUnknownVolumeLoader(
    cornerstoneStreamingImageVolumeLoader
  );
  cornerstone.volumeLoader.registerVolumeLoader(
    'cornerstoneStreamingImageVolume',
    cornerstoneStreamingImageVolumeLoader
  );
}

const init = async () => {
  initCornerstoneDICOMImageLoader();
  initVolumeLoader();
  await cornerstone.init();

  await cornerstoneTools.init();


  if (!cornerstoneTools.state.tools.StackScrollMouseWheel) {
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
  }
  if (!cornerstoneTools.state.tools.Zoom) {
    cornerstoneTools.addTool(ZoomTool);
  }
  if (!cornerstoneTools.state.tools.Pan) {
    cornerstoneTools.addTool(PanTool);
  }

  new cornerstone.RenderingEngine('renderingEngine');
};

const useInitCornerstone = () => {
  useEffect(() => {
    init();
    return () => {
      // It doesn't work (because async) so probably should be removed
      cornerstoneTools.removeTool(StackScrollMouseWheelTool);
      cornerstoneTools.removeTool(ZoomTool);
    }
  }, []);

  return;
};

export default useInitCornerstone;
