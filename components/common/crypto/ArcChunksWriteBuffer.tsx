import { useStore } from "@/stores/arcChunks";
import { useEffect, useRef } from "react";

function ArcChunksWriteBuffer() {
  const ARC_ChunksBuffer = useStore((state) => state.arcChunks);
  const ARC_ChunksBufferRef = useRef(ARC_ChunksBuffer);

  useEffect(() => {
    const changedChunks = [];
    for (let ix = 0; ix < ARC_ChunksBuffer.length; ix++) {
      if (ARC_ChunksBufferRef.current[ix] !== undefined) {
        if (
          ARC_ChunksBuffer[ix].activities.length !==
          ARC_ChunksBufferRef.current[ix].activities.length
        ) {
          changedChunks.push(ARC_ChunksBuffer[ix]);
        }
      }
    }
    console.log(changedChunks.length, " | changes detected");
  }, [ARC_ChunksBuffer]);

  return <></>;
}

export { ArcChunksWriteBuffer };
